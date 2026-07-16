# Stitched Compare — how it works

A visualization mode that shows **two modalities of the same artwork side by
side** (e.g. a 121-band hyperspectral cube next to a 45 MP visible photo) with
**synchronized pan/zoom**: whatever physical region of the painting you look at
in one panel, the exact same region is shown in the other — regardless of each
modality's spatial resolution or channel count.

```
 stitcher outputs (per modality)          offline prep                web app
┌───────────────────────────┐   ┌──────────────────────────┐   ┌──────────────────┐
│ HSI:  *_pano.bil (+hdr)   │   │ prepare_compare.py       │   │ mode:            │
│ VIS:  *_pano.tif          │──►│  · classify modality     │──►│ "Stitched        │
│ both: *_pano_rgb.png      │   │  · export view assets    │   │  compare"        │
│       placement.json      │   │  · compute alignment H   │   │  (2 synced OSD   │
└───────────────────────────┘   │  · emit artwork .ts      │   │   viewers)       │
                                └──────────────────────────┘   └──────────────────┘
```

## 1. Why the two panoramas can be aligned at all

Every modality is stitched by `hsi_stitcher` **anchored to the same
orthoimage** of the artwork. Two consequences:

- both panoramas show the artwork in the same orientation, and
- the mapping between any two of them is a single, nearly-affine
  **homography** (3×3 matrix `H`) — constant for the pair, computable once.

Pure proportional scaling (just dividing by the canvas sizes) is *not* enough:
each panorama has slightly different empty margins, so proportion alone drifts
by tens–hundreds of pixels. For the Inmaculada demo pair the true mapping is a
uniform ~8.35× scale **plus a ~210–230 px offset** — exactly what the
homography captures and proportion misses.

## 2. Offline preparation (`prepare_compare.py`)

```bash
python prepare_compare.py --id inmaculada --name "Inmaculada (stitched)" \
    --modality VIS:"../Output/VIS" --modality HSI:"../Output/HIS" --ref VIS
```

Per modality folder it does three things:

**a) Classify** — `*_pano.bil` + `.hdr` → hyperspectral; `*_pano.tif` →
3-channel `rgb` or 1-channel `mono`.

**b) Export display assets** (into `public/artworks/<id>/…`):

| Modality | Export | Why |
|---|---|---|
| rgb / mono | Deep-Zoom pyramid (`.dzi` + tile folders) | the mosaic can be ~100 MP; OpenSeadragon streams tiles instead of decoding one huge PNG |
| hsi / msi | one grayscale PNG per band, named `<wavelength>nm.png` | the app's existing False-RGB pipeline (band sliders + canvas compositing) consumes exactly this format |

**c) Compute alignment** of each modality into the *reference* modality's
pixel frame. Three methods are tried in order of accuracy; the first one whose
inputs are available wins. All three produce the same kind of object — a 3×3
homography `H` mapping this image's pixels into the reference image's pixels —
they differ only in *where the geometric information comes from*.

### Method 1 — compose from `placement.json` (exact, zero image matching)

When each modality was stitched, the stitcher registered the finished panorama
against the orthoimage and saved that mapping as `pano_to_ortho_H`. The ortho
therefore acts as a *shared intermediate frame* that every modality already
knows its way into:

```
     HSI panorama px                     VIS panorama px
          │                                    ▲
          │ H_HSI→ortho                        │ inv(H_VIS→ortho)
          ▼                                    │
          └────────────►  ortho px  ───────────┘

     H_HSI→VIS  =  inv(H_VIS→ortho) · H_HSI→ortho
```

To go from HSI pixels to VIS pixels, hop *through* the ortho: first map into
ortho coordinates, then apply the inverse of VIS's mapping to come back out in
VIS coordinates. Pure matrix multiplication — no feature detection, no chance
of a mismatch, and it works even for modality pairs that look nothing alike
(e.g. UV fluorescence vs. infrared), because each side was only ever matched
against the ortho, never against the other.

*Requires:* both `placement.json` files contain `pano_to_ortho_H` (stitcher
outputs produced after this key was added).

### Method 2 — SIFT registration of the previews (measured, robust)

For older outputs without the stored homography, the mapping is measured
directly, the same way the stitcher itself registers images:

```
  HSI preview ──downscale──► ≤2000 px ──┐
                                        ├─► SIFT keypoints ─► ratio-test
  VIS preview ──downscale──► ≤2000 px ──┘        matches ─► RANSAC ─► H_small

  fold the downscale factors back in:
  H_full  =  diag(1/s_VIS) · H_small · diag(s_HSI)
```

1. Both `*_pano_rgb.png` previews are downscaled to ≤ 2000 px (SIFT on a
   99 MP image would be slow and adds nothing — the geometry is global).
2. SIFT keypoints are matched (Lowe ratio test), and RANSAC fits a homography
   while discarding outlier matches.
3. The result maps *downscaled* pixels, so the two downscale factors are
   composed back in (`s_HSI` on the way in, `1/s_VIS` on the way out) to get
   the full-resolution mapping.

The tool prints the quality so you can judge it: the Inmaculada pair gave
**3832 inliers, 0.85 px RMS** — sub-pixel at working scale. Caveat: unlike
Method 1 this matches the two modalities against *each other*, so it can
weaken for visually dissimilar pairs (a UVF preview shares little texture with
an HSI pseudo-RGB).

### Method 3 — proportional scaling (assumption, last resort)

If registration is impossible (no placement data, SIFT found too few matches),
the tool assumes both canvases cover the same content edge-to-edge and simply
rescales:

```
  H  =  ⎡ W_ref/W_img      0        0 ⎤
        ⎢     0        H_ref/H_img  0 ⎥        (pure per-axis scaling)
        ⎣     0            0        1 ⎦
```

That assumption is what actually breaks in practice — each stitched canvas has
its own empty margins where tiles didn't reach:

```
   VIS canvas                 HSI canvas
  ┌───────────────┐          ┌────────────┐
  │ ┌───────────┐ │          │┌──────────┐│      the painting occupies a
  │ │  painting │ │    vs    ││ painting ││      *different fraction* of
  │ └───────────┘ │          │└──────────┘│      each canvas → equal-fraction
  │      margin   │          │  margin    │      mapping lands off-target
  └───────────────┘          └────────────┘
```

For the demo pair the margin difference amounts to ~210–230 VIS px (≈ 26 HSI
px) of offset that proportional mapping cannot see. It is therefore only a
fallback: the viewer still works, and the UI labels the alignment as
approximate.

### Summary

| Method | Source of geometry | Accuracy | Needs |
|---|---|---|---|
| 1. placement composition | stitcher's own ortho anchoring | exact (≈1 px) | `pano_to_ortho_H` in both placement.json |
| 2. SIFT previews | measured image matching | sub-px to a few px | visually matchable previews |
| 3. proportional | canvas-size assumption | tens–hundreds of px | nothing |

The result is written into the artwork resource file as:

```ts
align: {
  ref: "VIS",          // which modality's pixel frame is the shared reference
  H: [ ...9 numbers ]  // row-major 3x3: this image's px -> ref px
}
```

Because every image stores its `H` into the **same** reference frame, any pair
can be related on the fly: `H_left→right = inv(H_right) · H_left`.

## 3. The synchronized viewer (`OpenSeaDragonSyncPair.tsx`)

Two independent OpenSeadragon viewers, cross-wired through the homography.
When the viewport of the panel you're using (the *leader*) changes:

1. take the leader's viewport **center** in its image pixels, `c`;
2. map it through the homography: `c' = H·c` (projective divide);
3. compute the **local scale** `s = √|det J(H)|` at `c` (≈ how many follower
   pixels correspond to one leader pixel there);
4. set the follower's zoom so that *screen magnification of the artwork is
   identical*: `imageZoom_follower = imageZoom_leader / s`;
5. pan the follower to `c'` — all applied immediately (no animation), so the
   follower tracks frame-by-frame.

This is why a low-resolution HSI panel and a high-resolution VIS panel show
the *same physical crop* at the same size on screen — the HSI is simply
blurrier, which is the honest difference between the modalities.

**Leader/follower rule.** Only the panel the user is interacting with
propagates its viewport (leadership is claimed on press / drag / scroll /
mouse-enter). This is essential: OpenSeadragon emits `animation` events
asynchronously for ~a second after every gesture, and without the leader rule
the follower's own events would sync *back* and overwrite the user's gestures
on the other panel (frozen panning, laggy zoom).

**Crosshair.** Hovering in one panel mirrors a crosshair at the corresponding
point in the other — the same `H` mapping applied to the cursor instead of the
viewport center. This makes the "exact same pixel" guarantee visible.

**Spectral panels.** An HSI/MSI panel is rendered through the app's existing
False-RGB pipeline: three band sliders pick `<wavelength>nm.png` files, a
hidden canvas composites them into an RGB data-URL, and that image feeds the
viewer. Changing bands re-renders the composite but keeps the viewport (and
therefore the sync) unchanged.

## 4. Genericity

- **Channels**: 121-band HSI, 3-channel RGB, 1-channel mono all reduce to "an
  image URL per panel" (band-composite, direct source, or grayscale source) —
  the sync layer never cares about channels.
- **Sizes**: resolution differences are absorbed by `H` and the local-scale
  zoom rule; nothing assumes similar dimensions.
- **Missing registration**: pairs without `align` data fall back to
  proportional mapping automatically (the UI notes that alignment is then
  approximate).

## 5. File map

| File | Role |
|---|---|
| `hsi_stitcher/stitcher.py` | stitches each modality; stores `pano_to_ortho_H` in `placement.json` |
| `prepare_compare.py` | offline prep: assets + alignment + artwork resource |
| `src/app/utils/mat3.ts` | 3×3 homography math (multiply, invert, apply, local scale) |
| `src/components/StitchedCompare.tsx` | mode UI: modality selectors, band sliders, pair homography |
| `src/components/OpenSeaDragonSyncPair.tsx` | the two synced viewers (leader rule, crosshair) |
| `src/app/resources/artworks/<id>.ts` | generated per-artwork data incl. `align` |
| `public/artworks/<id>/…` | generated DZI tiles and band PNGs |

## 6. Adding a new artwork / modality

1. Stitch each modality with `hsi_stitcher` **against the same orthoimage**.
2. Run `prepare_compare.py` with one `--modality LABEL:PATH[:CLASS]` per
   folder (CLASS optional: `vnir`, `uvf`, `irrs`, … — defaults `vnir`/`pht`).
3. Start the app (`npm run dev`) — the artwork appears with the
   "Stitched compare" mode enabled whenever ≥ 2 panels are available.
