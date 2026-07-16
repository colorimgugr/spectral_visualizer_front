"use client";

import OpenSeaDragon, { Viewer } from "openseadragon";
import { useEffect, useRef, type CSSProperties } from "react";
import {
  Mat3,
  apply3,
  invert3,
  localScale3,
} from "@/app/utils/mat3";

export type OpenSeaDragonSyncPairProps = {
  leftUrl: string;
  rightUrl: string;
  /** Row-major 3x3 homography mapping LEFT image px -> RIGHT image px. */
  H: Mat3;
};

/**
 * Two OpenSeadragon viewers side by side whose viewports are kept in sync
 * through a pixel-space homography: whatever physical region of the artwork
 * is visible in one panel is shown (at the same screen magnification) in the
 * other, regardless of each modality's spatial resolution.
 */
const OpenSeaDragonSyncPair = ({
  leftUrl,
  rightUrl,
  H,
}: OpenSeaDragonSyncPairProps) => {
  const leftContainer = useRef<HTMLDivElement>(null);
  const rightContainer = useRef<HTMLDivElement>(null);
  const leftViewer = useRef<Viewer | null>(null);
  const rightViewer = useRef<Viewer | null>(null);
  const syncing = useRef(false);
  // Only the panel the user is interacting with may propagate its viewport.
  // Without this, the follower's own (asynchronous) animation events would
  // sync back and overwrite user gestures on the other panel.
  const leader = useRef<"left" | "right">("left");
  const HRef = useRef<Mat3>(H);
  const HInvRef = useRef<Mat3>(invert3(H));
  const leftCross = useRef<HTMLDivElement>(null);
  const rightCross = useRef<HTMLDivElement>(null);

  useEffect(() => {
    HRef.current = H;
    HInvRef.current = invert3(H);
    // re-align the right panel to the (authoritative) left panel on H change
    syncFrom("left");
  }, [H]);

  const makeViewer = (el: HTMLElement, url: string) =>
    OpenSeaDragon({
      element: el,
      prefixUrl: "/openseadragon/images/",
      tileSources: url.endsWith(".dzi") ? url : { type: "image", url },
      maxZoomPixelRatio: 16,
      zoomPerScroll: 1.5,
      // snappier springs than OSD defaults (1.2s): the follower mirrors every
      // animation frame, so shorter settle = more responsive synced feel
      animationTime: 0.6,
      springStiffness: 10,
      showNavigationControl: false,
    });

  /** Propagate the viewport of `source` onto the other panel through H. */
  const syncFrom = (source: "left" | "right") => {
    const S = source === "left" ? leftViewer.current : rightViewer.current;
    const T = source === "left" ? rightViewer.current : leftViewer.current;
    const M = source === "left" ? HRef.current : HInvRef.current;
    if (!S || !T || !S.world.getItemCount() || !T.world.getItemCount()) return;
    if (syncing.current) return;
    syncing.current = true;
    try {
      const sv = S.viewport;
      const tv = T.viewport;
      // center of S in S-image pixels -> T-image pixels through the homography
      const cS = sv.viewportToImageCoordinates(sv.getCenter(true));
      const cT = apply3(M, cS.x, cS.y);
      // same physical region at the same screen magnification: screen px per
      // S-image px, divided by how many T px correspond to one S px locally
      const s = localScale3(M, cS.x, cS.y);
      const imageZoomS = sv.viewportToImageZoom(sv.getZoom(true));
      const imageZoomT = imageZoomS / s;
      tv.zoomTo(tv.imageToViewportZoom(imageZoomT), undefined, true);
      tv.panTo(tv.imageToViewportCoordinates(cT.x, cT.y), true);
      tv.applyConstraints(true);
    } finally {
      syncing.current = false;
    }
  };

  /** Mirror the cursor into the other panel (crosshair) through H. */
  const mirrorCursor = (
    source: "left" | "right",
    clientX: number | null,
    clientY: number | null
  ) => {
    const S = source === "left" ? leftViewer.current : rightViewer.current;
    const T = source === "left" ? rightViewer.current : leftViewer.current;
    const M = source === "left" ? HRef.current : HInvRef.current;
    const cross = source === "left" ? rightCross.current : leftCross.current;
    const own = source === "left" ? leftCross.current : rightCross.current;
    if (own) own.style.display = "none";
    if (!S || !T || !cross) return;
    if (clientX === null || clientY === null || !T.world.getItemCount()) {
      cross.style.display = "none";
      return;
    }
    const sRect = (S.element as HTMLElement).getBoundingClientRect();
    const sPoint = new OpenSeaDragon.Point(
      clientX - sRect.left,
      clientY - sRect.top
    );
    const imgS = S.viewport.viewportToImageCoordinates(
      S.viewport.pointFromPixel(sPoint)
    );
    const imgT = apply3(M, imgS.x, imgS.y);
    const tPix = T.viewport.pixelFromPoint(
      T.viewport.imageToViewportCoordinates(imgT.x, imgT.y)
    );
    cross.style.display = "block";
    cross.style.left = `${tPix.x}px`;
    cross.style.top = `${tPix.y}px`;
  };

  useEffect(() => {
    if (!leftContainer.current || !rightContainer.current) return;

    if (!leftViewer.current) {
      leftViewer.current = makeViewer(leftContainer.current, leftUrl);
      rightViewer.current = makeViewer(rightContainer.current, rightUrl);

      const wire = (v: Viewer, side: "left" | "right") => {
        // any direct interaction claims leadership for this panel; snapping
        // the other panel right away kills its residual spring animation
        const claim = () => {
          if (leader.current !== side) {
            leader.current = side;
            syncFrom(side);
          }
        };
        v.addHandler("canvas-press", claim);
        v.addHandler("canvas-drag", claim);
        v.addHandler("canvas-scroll", claim);
        // propagate viewport changes only while this panel is the leader;
        // the follower's programmatic/animation events must not sync back
        const onChange = () => {
          if (leader.current === side) syncFrom(side);
        };
        v.addHandler("zoom", onChange);
        v.addHandler("pan", onChange);
        v.addHandler("animation", onChange);
      };
      wire(leftViewer.current, "left");
      wire(rightViewer.current, "right");

      // initial alignment once both images are ready
      rightViewer.current.addOnceHandler("open", () => syncFrom("left"));
      leftViewer.current.addOnceHandler("open", () => syncFrom("left"));
    }

    return () => {
      leftViewer.current?.destroy();
      rightViewer.current?.destroy();
      leftViewer.current = null;
      rightViewer.current = null;
    };
    // viewers created once; URL updates handled by the effects below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Swap a panel's image while preserving its current viewport. */
  const reopen = (viewer: Viewer | null, url: string, keepView: boolean) => {
    if (!viewer) return;
    const bounds = keepView && viewer.world.getItemCount()
      ? viewer.viewport.getBounds()
      : null;
    viewer.addOnceHandler("open", () => {
      if (bounds) viewer.viewport.fitBounds(bounds, true);
      syncFrom("left");
    });
    viewer.open(url.endsWith(".dzi") ? url : { type: "image", url });
  };

  const firstLeft = useRef(true);
  useEffect(() => {
    if (firstLeft.current) {
      firstLeft.current = false;
      return;
    }
    reopen(leftViewer.current, leftUrl, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftUrl]);

  const firstRight = useRef(true);
  useEffect(() => {
    if (firstRight.current) {
      firstRight.current = false;
      return;
    }
    reopen(rightViewer.current, rightUrl, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightUrl]);

  const crossStyle: CSSProperties = {
    position: "absolute",
    display: "none",
    width: 18,
    height: 18,
    marginLeft: -9,
    marginTop: -9,
    pointerEvents: "none",
    zIndex: 5,
    background:
      "linear-gradient(#7dd3fc,#7dd3fc) center/2px 100% no-repeat," +
      "linear-gradient(#7dd3fc,#7dd3fc) center/100% 2px no-repeat",
    filter: "drop-shadow(0 0 2px rgba(0,0,0,0.9))",
  };

  const panelStyle: CSSProperties = {
    position: "relative",
    flex: 1,
    minWidth: 0,
    height: "100%",
    borderRadius: 8,
    overflow: "hidden",
    background: "#0b0d12",
  };

  return (
    <div style={{ display: "flex", gap: 8, width: "100%", height: "100%" }}>
      <div
        style={panelStyle}
        onMouseEnter={() => {
          if (leader.current !== "left") {
            leader.current = "left";
            syncFrom("left");
          }
        }}
        onMouseMove={(e) => mirrorCursor("left", e.clientX, e.clientY)}
        onMouseLeave={() => mirrorCursor("left", null, null)}
      >
        <div ref={leftContainer} style={{ width: "100%", height: "100%" }} />
        <div ref={leftCross} style={crossStyle} />
      </div>
      <div
        style={panelStyle}
        onMouseEnter={() => {
          if (leader.current !== "right") {
            leader.current = "right";
            syncFrom("right");
          }
        }}
        onMouseMove={(e) => mirrorCursor("right", e.clientX, e.clientY)}
        onMouseLeave={() => mirrorCursor("right", null, null)}
      >
        <div ref={rightContainer} style={{ width: "100%", height: "100%" }} />
        <div ref={rightCross} style={crossStyle} />
      </div>
    </div>
  );
};

export default OpenSeaDragonSyncPair;
