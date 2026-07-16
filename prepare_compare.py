#!/usr/bin/env python3
"""Prepare hsi_stitcher output folders for the web app's "Stitched compare" mode.

For each stitched modality folder this tool:
  1. classifies the payload (ENVI BIL cube -> hsi; TIFF/PNG mosaic -> rgb/mono),
  2. exports display assets under public/artworks/<id>/ in the app's existing
     conventions (DZI pyramid for large rgb/mono; per-band <wl>nm.png for hsi),
  3. computes the registration homography of every modality into the reference
     modality's pixel frame (placement.json composition when available, SIFT
     between previews as fallback, proportional as last resort),
  4. writes src/app/resources/artworks/<id>.ts and registers it in allArtworks.ts.

Usage:
  python prepare_compare.py --id inmaculada --name "Inmaculada" \
      --modality VIS:"../Output/VIS" --modality HSI:"../Output/HIS"[:vnir] \
      [--ref VIS] [--height-cm 100]

Modality syntax: LABEL:PATH[:CLASS] where CLASS is a SpectralClassCode
(vnir, swir, pht, uvr, uvf, irrs, irrl); defaults: hsi->vnir, image->pht.
"""

import argparse
import json
import math
import re
import sys
from pathlib import Path

import numpy as np

WEB_ROOT = Path(__file__).resolve().parent
PUBLIC = WEB_ROOT / "public" / "artworks"
RES_ARTWORKS = WEB_ROOT / "src" / "app" / "resources" / "artworks"
ALL_ARTWORKS = WEB_ROOT / "src" / "app" / "resources" / "allArtworks.ts"

TILE_SIZE = 254
OVERLAP = 1


# ---------------------------------------------------------------------------
# minimal ENVI BIL reading (subset of hsi_stitcher/envi_io.py, kept local so
# this tool has no cross-repo import)
# ---------------------------------------------------------------------------
DTYPE_MAP = {1: np.uint8, 2: np.int16, 3: np.int32, 4: np.float32,
             5: np.float64, 12: np.uint16}


def read_hdr(path):
    text = Path(path).read_text()
    if not text.lstrip().startswith("ENVI"):
        raise ValueError(f"{path} is not an ENVI header")
    body = text.lstrip()[4:]
    hdr = {}
    pattern = re.compile(r"^\s*([^=\n]+?)\s*=\s*(\{[^}]*\}|[^\n]*)",
                         re.MULTILINE | re.DOTALL)
    for m in pattern.finditer(body):
        key = m.group(1).strip().lower()
        val = m.group(2).strip()
        if val.startswith("{"):
            items = val.strip("{}").replace("\n", " ")
            hdr[key] = [s.strip() for s in items.split(",") if s.strip()]
        else:
            hdr[key] = val
    return hdr


def open_bil(bil_path, hdr):
    lines, samples, bands = (int(hdr[k]) for k in ("lines", "samples", "bands"))
    dtype = DTYPE_MAP[int(hdr["data type"])]
    if int(hdr.get("byte order", 0)) != 0:
        dtype = np.dtype(dtype).newbyteorder(">")
    return np.memmap(bil_path, dtype=dtype, mode="r",
                     shape=(lines, bands, samples))


# ---------------------------------------------------------------------------
# modality discovery / classification
# ---------------------------------------------------------------------------
class Modality:
    def __init__(self, label, folder, cls=None):
        self.label = label
        self.folder = Path(folder)
        self.preview = self._find("*_pano_rgb.png")
        self.placement = self.folder / "placement.json"
        bils = sorted(self.folder.glob("*_pano.bil"))
        tifs = sorted(self.folder.glob("*_pano.tif"))
        if bils:
            self.kind = "hsi"
            self.bil = bils[0]
            self.hdr = read_hdr(str(self.bil) + ".hdr")
            self.n_bands = int(self.hdr["bands"])
            self.dims = (int(self.hdr["samples"]), int(self.hdr["lines"]))  # (w, h)
        elif tifs:
            self.tif = tifs[0]
            from PIL import Image
            with Image.open(self.preview) as im:  # preview == mosaic pixels for photos
                self.dims = im.size
                self.kind = "mono" if im.mode in ("L", "I;16", "I") else "rgb"
        else:
            raise SystemExit(f"{folder}: no *_pano.bil or *_pano.tif found")
        if not self.preview:
            raise SystemExit(f"{folder}: no *_pano_rgb.png preview found")
        self.cls = cls or ("vnir" if self.kind == "hsi" else "pht")
        self.H_to_ortho = None
        if self.placement.exists():
            H = json.load(open(self.placement)).get("pano_to_ortho_H")
            if H is not None:
                self.H_to_ortho = np.asarray(H, float)

    def _find(self, pat):
        hits = sorted(self.folder.glob(pat))
        return hits[0] if hits else None


# ---------------------------------------------------------------------------
# asset export
# ---------------------------------------------------------------------------
def export_hsi_bands(mod, out_dir):
    """Per-band grayscale PNGs named <wavelength>nm.png (1-99% stretch)."""
    from PIL import Image
    out_dir.mkdir(parents=True, exist_ok=True)
    cube = open_bil(mod.bil, mod.hdr)
    wls = [str(int(round(float(w)))) for w in mod.hdr["wavelength"]]
    names = []
    for b, wl in enumerate(wls):
        band = np.asarray(cube[:, b, :], np.float64)
        lo, hi = np.percentile(band[band > 0], (1, 99)) if (band > 0).any() else (0, 1)
        img = (np.clip((band - lo) / (hi - lo + 1e-12), 0, 1) * 255).astype(np.uint8)
        name = f"{wl}nm.png"
        Image.fromarray(img).save(out_dir / name)
        names.append(name)
    print(f"  {mod.label}: wrote {len(names)} band PNGs -> {out_dir}")
    return names


def export_dzi(src_png, out_base):
    """Minimal Deep Zoom pyramid (PIL only): <out_base>.dzi + _files/<level>/."""
    from PIL import Image
    img = Image.open(src_png)
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")
    w, h = img.size
    fmt = "jpeg"
    max_level = math.ceil(math.log2(max(w, h)))
    files_dir = Path(str(out_base) + "_files")
    level_img = img
    for level in range(max_level, -1, -1):
        lw, lh = level_img.size
        ldir = files_dir / str(level)
        ldir.mkdir(parents=True, exist_ok=True)
        cols = math.ceil(lw / TILE_SIZE)
        rows = math.ceil(lh / TILE_SIZE)
        for c in range(cols):
            for r in range(rows):
                x0 = c * TILE_SIZE - (OVERLAP if c > 0 else 0)
                y0 = r * TILE_SIZE - (OVERLAP if r > 0 else 0)
                x1 = min((c + 1) * TILE_SIZE + OVERLAP, lw)
                y1 = min((r + 1) * TILE_SIZE + OVERLAP, lh)
                level_img.crop((x0, y0, x1, y1)).save(
                    ldir / f"{c}_{r}.{fmt}", quality=92)
        if level > 0:  # halve for next (lower) level
            level_img = level_img.resize((max(1, math.ceil(lw / 2)),
                                          max(1, math.ceil(lh / 2))),
                                         Image.LANCZOS)
    dzi = (f'<?xml version="1.0" encoding="UTF-8"?>\n'
           f'<Image xmlns="http://schemas.microsoft.com/deepzoom/2008" '
           f'Format="{fmt}" Overlap="{OVERLAP}" TileSize="{TILE_SIZE}">\n'
           f'  <Size Width="{w}" Height="{h}"/>\n</Image>\n')
    Path(str(out_base) + ".dzi").write_text(dzi)
    print(f"  DZI: {out_base}.dzi ({w}x{h}, {max_level + 1} levels)")


# ---------------------------------------------------------------------------
# alignment
# ---------------------------------------------------------------------------
def sift_homography(mod_a, mod_b, work_px=2000):
    """H mapping mod_a full-res px -> mod_b full-res px via preview SIFT."""
    import cv2

    def load_small(p):
        img = cv2.imread(str(p), cv2.IMREAD_GRAYSCALE)
        s = 1.0
        if max(img.shape) > work_px:
            s = work_px / max(img.shape)
            img = cv2.resize(img, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        return img, s

    ia, sa = load_small(mod_a.preview)
    ib, sb = load_small(mod_b.preview)
    sift = cv2.SIFT_create(contrastThreshold=0.01, edgeThreshold=20)
    ka, da = sift.detectAndCompute(ia, None)
    kb, db = sift.detectAndCompute(ib, None)
    bf = cv2.BFMatcher(cv2.NORM_L2)
    good = [m for m, n in bf.knnMatch(da, db, k=2) if m.distance < 0.75 * n.distance]
    if len(good) < 20:
        return None, None
    src = np.float32([ka[m.queryIdx].pt for m in good])
    dst = np.float32([kb[m.trainIdx].pt for m in good])
    Hs, mask = cv2.findHomography(src, dst, cv2.RANSAC, 5.0)
    if Hs is None or mask.sum() < 20:
        return None, None
    inl = mask.ravel().astype(bool)
    d = cv2.perspectiveTransform(src[inl][None], Hs)[0] - dst[inl]
    rms = float(np.sqrt((d ** 2).mean()))
    # fold the working-scale factors back to full resolution: a_full -> b_full
    H = np.diag([1 / sb, 1 / sb, 1.0]) @ Hs @ np.diag([sa, sa, 1.0])
    return H / H[2, 2], (int(inl.sum()), rms)


def compute_alignments(mods, ref):
    """H per modality mapping its px -> ref px."""
    out = {}
    for m in mods:
        if m.label == ref.label:
            out[m.label] = np.eye(3)
            continue
        if m.H_to_ortho is not None and ref.H_to_ortho is not None:
            H = np.linalg.inv(ref.H_to_ortho) @ m.H_to_ortho
            out[m.label] = H / H[2, 2]
            print(f"  align {m.label}->{ref.label}: composed from placement.json")
            continue
        H, stats = sift_homography(m, ref)
        if H is not None:
            print(f"  align {m.label}->{ref.label}: SIFT "
                  f"({stats[0]} inliers, RMS {stats[1]:.2f} px @2000)")
            out[m.label] = H
            continue
        sx = ref.dims[0] / m.dims[0]
        sy = ref.dims[1] / m.dims[1]
        print(f"  align {m.label}->{ref.label}: WARNING falling back to "
              f"proportional scaling ({sx:.3f}, {sy:.3f})")
        out[m.label] = np.diag([sx, sy, 1.0])
    return out


# ---------------------------------------------------------------------------
# artwork resource emission
# ---------------------------------------------------------------------------
def build_entry(mod, art_id, names, resl, H):
    w, h = mod.dims
    meta = {"hPix": str(w), "vPix": str(h),
            "resl": f"{resl:.4f}" if resl else None}
    entry = {
        "spectralType": mod.kind if mod.kind != "hsi" else "hsi",
        "spectralClass": mod.cls,
        "specification": None,
        "metadata": meta,
    }
    if mod.kind == "hsi":
        entry["path"] = f"/artworks/{art_id}/hsi/{mod.cls}"
        entry["names"] = names
    else:
        entry["source"] = f"/artworks/{art_id}/{mod.kind}/{mod.label.lower()}.dzi"
    entry["align"] = {"ref": None, "H": [round(v, 8) for v in H.ravel().tolist()]}
    return entry


def write_artwork_ts(art_id, name, entries, height_cm):
    art = {
        "id": art_id,
        "name": name,
        "metadata": {"author": None, "date": None, "rest": None, "varn": None,
                     "subs": None, "width": None,
                     "height": str(height_cm) if height_cm else None},
        "spectralImages": entries,
    }
    ts = (f'import {{ Artwork }} from "@/app/resources/types";\n\n'
          f"const {art_id}: Artwork = {json.dumps(art, indent=2)};\n\n"
          f"export default {art_id};\n")
    out = RES_ARTWORKS / f"{art_id}.ts"
    out.write_text(ts)
    print(f"  wrote {out}")


def register_in_all_artworks(art_id):
    text = ALL_ARTWORKS.read_text()
    if f'artworks/{art_id}"' in text:
        print(f"  {art_id} already registered in allArtworks.ts")
        return
    imp = f'import {art_id} from "@/app/resources/artworks/{art_id}";\n'
    # insert import after the last existing artwork import
    lines = text.splitlines(keepends=True)
    last_imp = max(i for i, l in enumerate(lines) if l.startswith("import "))
    lines.insert(last_imp + 1, imp)
    text = "".join(lines)
    text = re.sub(r"(export const artworks: Artwork\[\] = \[\s*)([^\]]*?)(\];)",
                  lambda m: m.group(1) + m.group(2).rstrip() + f", {art_id}" + m.group(3),
                  text, count=1)
    ALL_ARTWORKS.write_text(text)
    print(f"  registered {art_id} in allArtworks.ts")


# ---------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--id", required=True, help="artwork id (TS identifier, camelCase)")
    ap.add_argument("--name", required=True)
    ap.add_argument("--modality", action="append", required=True,
                    metavar="LABEL:PATH[:CLASS]")
    ap.add_argument("--ref", help="reference modality label (default: first)")
    ap.add_argument("--height-cm", type=float, default=None)
    args = ap.parse_args()
    if not args.id.isidentifier():
        raise SystemExit(f"--id {args.id!r} must be a valid TS identifier")

    mods = []
    for spec in args.modality:
        parts = spec.split(":")
        if len(parts) == 2:
            label, path, cls = parts[0], parts[1], None
        elif len(parts) == 3:
            label, path, cls = parts
        else:
            raise SystemExit(f"bad --modality {spec!r}, want LABEL:PATH[:CLASS]")
        mods.append(Modality(label, path, cls))
        m = mods[-1]
        print(f"modality {m.label}: kind={m.kind} class={m.cls} dims={m.dims} "
              f"placementH={'yes' if m.H_to_ortho is not None else 'no'}")

    ref = next((m for m in mods if m.label == args.ref), mods[0])
    print(f"reference frame: {ref.label} ({ref.dims[0]}x{ref.dims[1]})")

    print("[1/3] exporting display assets")
    names_by_label = {}
    for m in mods:
        if m.kind == "hsi":
            out = PUBLIC / args.id / "hsi" / m.cls
            names_by_label[m.label] = export_hsi_bands(m, out)
        else:
            out = PUBLIC / args.id / m.kind
            out.mkdir(parents=True, exist_ok=True)
            export_dzi(m.preview, out / m.label.lower())
            names_by_label[m.label] = None

    print("[2/3] computing alignments")
    Hs = compute_alignments(mods, ref)

    print("[3/3] writing artwork resource")
    entries = []
    for m in mods:
        resl = (args.height_cm / m.dims[1]) if args.height_cm else None
        e = build_entry(m, args.id, names_by_label[m.label], resl, Hs[m.label])
        e["align"]["ref"] = ref.label
        entries.append(e)
    write_artwork_ts(args.id, args.name, entries, args.height_cm)
    register_in_all_artworks(args.id)
    print("done.")


if __name__ == "__main__":
    sys.exit(main())
