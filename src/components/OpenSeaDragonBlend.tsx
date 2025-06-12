"use client";

import OpenSeaDragon, { Viewer } from "openseadragon";
import { useEffect, useRef } from "react";

export type OpenSeaDragonBlendProps = {
  leftTile: string;
  rightTile: string;
  leftOpacity: number;
  rightOpacity: number;
};

const OpenSeaDragonBlend = ({
  leftTile,
  rightTile,
  leftOpacity,
  rightOpacity,
}: OpenSeaDragonBlendProps) => {
  const viewerRef = useRef<Viewer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Images
  const leftImageRef = useRef<OpenSeadragon.TiledImage | null>(null);
  const rightImageRef = useRef<OpenSeadragon.TiledImage | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const viewer = OpenSeaDragon({
      element: container,
      prefixUrl: "/openseadragon/images/",
      maxZoomPixelRatio: 16,
      zoomPerScroll: 1.3,
    });

    viewerRef.current = viewer;

    let imagesLoadedCount = 0;

    const onImageLoad = () => {
      imagesLoadedCount++;
      if (imagesLoadedCount === 2) {
        if (leftImageRef.current) leftImageRef.current.setOpacity(leftOpacity);
        if (rightImageRef.current)
          rightImageRef.current.setOpacity(rightOpacity);
      }
    };

    viewer.addTiledImage({
      tileSource: leftTile,
      success: (e: any) => {
        leftImageRef.current = e.item;
        onImageLoad();
      },
    });

    viewer.addTiledImage({
      tileSource: rightTile,
      success: (e: any) => {
        rightImageRef.current = e.item;
        onImageLoad();
      },
    });

    // viewerRef.current.addOnceHandler("open", () => {
    //   const tiledImage = viewerRef.current!.world.getItemAt(0);
    //   if (tiledImage) tiledImage.setOpacity(leftOpacity);
    // });

    return () => {
      viewer.destroy();
      viewerRef.current = null;
      leftImageRef.current = null;
      rightImageRef.current = null;
    };
  }, [leftTile, rightTile]);

  useEffect(() => {
    if (leftImageRef.current) leftImageRef.current.setOpacity(leftOpacity);
    if (rightImageRef.current) rightImageRef.current.setOpacity(rightOpacity);
  }, [leftOpacity, rightOpacity]);

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

export default OpenSeaDragonBlend;
