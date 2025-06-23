"use client";

import OpenSeaDragon, { Viewer } from "openseadragon";
import { useEffect, useRef } from "react";

export type OpenSeaDragonViewerProps = {
  url: string;
};

const OpenSeaDragonViewer = ({ url }: OpenSeaDragonViewerProps) => {
  const viewerRef = useRef<Viewer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!viewerRef.current) {
      viewerRef.current = OpenSeaDragon({
        element: container,
        prefixUrl: "/openseadragon/images/",
        tileSources: url.endsWith(".dzi") ? url : { type: "image", url },
        maxZoomPixelRatio: 16,
        zoomPerScroll: 1.3,
      });
    } else {
      // Avoid flashing: only open new source without destroying viewer
      const source = url
        ? url.endsWith(".dzi")
          ? url
          : { type: "image", url }
        : null;
      if (source) {
        // Wait for the new image to load before displaying
        viewerRef.current.addOnceHandler("open", () => {
          // Optional: fit to viewport after loading
          // viewerRef.current?.viewport.goHome(true);
        });

        viewerRef.current.open(source);
      }
    }
  }, [url]);

  return (
    <>
      <div
        ref={containerRef}
        id="openSeaDragon"
        style={{ width: "100%", height: "100%" }}
      />
    </>
  );
};

export default OpenSeaDragonViewer;
