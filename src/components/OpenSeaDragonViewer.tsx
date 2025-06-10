"use client";

import OpenSeaDragon, { Viewer } from "openseadragon";
import { useEffect, useRef } from "react";

export type OpenSeaDragonViewerProps = {
  tileSource: string;
};

const OpenSeaDragonViewer = ({ tileSource }: OpenSeaDragonViewerProps) => {
  const viewerRef = useRef<Viewer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (containerRef.current) {
      viewerRef.current = OpenSeaDragon({
        element: containerRef.current,
        prefixUrl: "/openseadragon/images/",
        tileSources: tileSource,
        animationTime: 0.5,
        blendTime: 0.1,
        maxZoomPixelRatio: 16,  
        zoomPerScroll: 2,
        showNavigationControl: true,
      });
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [tileSource]);

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
