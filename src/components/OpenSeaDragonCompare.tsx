"use client";

import OpenSeadragon from "openseadragon";
import OpenSeaDragon, { Viewer } from "openseadragon";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/ImageSlider.module.scss";

export type OpenSeaDragonCompareProps = {
  leftTile: string;
  rightTile: string;
};

const OpenSeaDragonCompare = ({
  leftTile,
  rightTile,
}: OpenSeaDragonCompareProps) => {
  const viewerRef = useRef<Viewer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  // View and sync state
  const middleRef = useRef<OpenSeadragon.Point | null>(null);
  const oldSpringX = useRef(0.5);

  // Images
  const leftImageRef = useRef<OpenSeadragon.TiledImage | null>(null);
  const rightImageRef = useRef<OpenSeadragon.TiledImage | null>(null);

  // Clipping rectangles
  const leftRect = useRef(new OpenSeadragon.Rect(0, 0, 0, 0));
  const rightRect = useRef(new OpenSeadragon.Rect(0, 0, 0, 0));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const viewer = OpenSeaDragon({
      element: containerRef.current!,
      prefixUrl: "/openseadragon/images/",
      tileSources: leftTile,
      showFullPageControl: false,
      zoomPerClick: 1.3,
    });

    viewerRef.current = viewer;

    if (handleRef.current) {
      handleRef.current.style.left = "50%";
    }
    
    viewer.addHandler("animation-start", clipImages);
    viewer.addHandler("animation", clipImagesWithScroll);

    let imagesLoadedCount = 0;

    const onImageLoad = () => {
      imagesLoadedCount++;
      if (
        imagesLoadedCount === 2 &&
        leftImageRef.current &&
        rightImageRef.current &&
        containerRef.current
      ) {
        const container = containerRef.current;

        leftRect.current.height = leftImageRef.current.getContentSize().y;
        rightRect.current.height = rightImageRef.current.getContentSize().y;

        middleRef.current = new OpenSeadragon.Point(
          container.clientWidth / 2,
          container.clientHeight / 2
        );

        clipImages();
      }
    };

    viewer.addTiledImage({
      tileSource: leftTile,
      success: (e) => {
        leftImageRef.current = e.item;
        onImageLoad();
      },
    });

    viewer.addTiledImage({
      tileSource: rightTile,
      success: (e) => {
        rightImageRef.current = e.item;
        onImageLoad();
      },
    });

    return () => viewer.destroy();
  }, [leftTile, rightTile]);

  // Utility to update clipping center position
  function updateMiddle(offset: number) {
    if (middleRef.current) {
      middleRef.current.x = offset;
    }
  }

  // Apply image clipping during zoom/pan
  function clipImages() {
    const leftImage = leftImageRef.current;
    const rightImage = rightImageRef.current;
    const middle = middleRef.current;

    if (!leftImage || !rightImage || !middle) return;

    const rox = rightImage.viewerElementToImageCoordinates(middle).x;
    const lox = leftImage.viewerElementToImageCoordinates(middle).x;

    applyImageClip(rox, lox);
  }

  // Handle center shift during viewport scroll
  function clipImagesWithScroll() {
    const viewer = viewerRef.current;
    const leftImage = leftImageRef.current;
    const rightImage = rightImageRef.current;
    const middle = middleRef.current;

    if (!viewer || !leftImage || !rightImage || !middle) {
      setTimeout(clipImagesWithScroll, 200);
      return;
    }

    const newSpringX = viewer.viewport.centerSpringX.current.value;
    const deltaX = newSpringX - oldSpringX.current;
    oldSpringX.current = newSpringX;

    const shiftedMiddle =
      viewer.viewport.viewerElementToViewportCoordinates(middle);
    shiftedMiddle.x += deltaX;

    const rox = rightImage.viewportToImageCoordinates(shiftedMiddle).x;
    const lox = leftImage.viewportToImageCoordinates(shiftedMiddle).x;

    applyImageClip(rox, lox);
  }

  // Shared clipping logic
  function applyImageClip(rox: number, lox: number) {
    const leftImage = leftImageRef.current;
    const rightImage = rightImageRef.current;

    if (!leftImage || !rightImage) return;

    const rightSize = rightImage.getContentSize().x;

    rightRect.current.x = rox;
    rightRect.current.width = rightSize - rox;

    leftRect.current.width = lox;

    leftImage.setClip(leftRect.current);
    rightImage.setClip(rightRect.current);

    leftImage._needsUpdate = true;
    rightImage._needsUpdate = true;
  }

  const dragState = useRef({
    dragWidth: 0,
    containerWidth: 0,
    containerOffset: 0,
    minLeft: 0,
    maxLeft: 0,
    xOffset: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const handle = handleRef.current;
    if (!container || !handle) return;

    const state = dragState.current;

    const updateContainerDimensions = () => {
      if (!container || !handle) return;

      state.dragWidth = handle.offsetWidth;
      state.containerWidth = container.offsetWidth;
      state.containerOffset =
        container.getBoundingClientRect().left + window.scrollX;

      state.minLeft = state.containerOffset;
      state.maxLeft =
        state.containerOffset + state.containerWidth - state.dragWidth;

      const handleCenter =
        handle.getBoundingClientRect().left +
        window.scrollX +
        state.dragWidth / 2;
      state.xOffset = state.dragWidth / 2;

      trackDrag(handleCenter);
    };

    const trackDrag = (pageX: number) => {
      if (!handle) return;
      const state = dragState.current;

      let leftValue = pageX + state.xOffset - state.dragWidth;
      leftValue = Math.max(state.minLeft, Math.min(state.maxLeft, leftValue));

      const widthPixel =
        leftValue + state.dragWidth / 2 - state.containerOffset;
      const widthFraction = widthPixel / state.containerWidth;
      const widthPercent = `${widthFraction * 100}%`;

      handle.style.left = widthPercent;
      updateMiddle(widthPixel);
      clipImages();
    };

    const startDrag = (pageX: number) => {
      const handleLeft = handle.getBoundingClientRect().left + window.scrollX;
      dragState.current.xOffset =
        handleLeft + dragState.current.dragWidth - pageX;

      const onMouseMove = (e: MouseEvent) => trackDrag(e.pageX);
      const onTouchMove = (e: TouchEvent) =>
        trackDrag(e.changedTouches[0].pageX);
      const stopTracking = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("touchmove", onTouchMove);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("mouseup", stopTracking, { once: true });
      document.addEventListener("touchend", stopTracking, { once: true });
    };

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startDrag(e.pageX);
    };

    const onTouchStart = (e: TouchEvent) => {
      startDrag(e.targetTouches[0].pageX);
    };

    handle.addEventListener("mousedown", onMouseDown);
    handle.addEventListener("touchstart", onTouchStart);
    window.addEventListener("resize", updateContainerDimensions);

    updateContainerDimensions();

    return () => {
      handle.removeEventListener("mousedown", onMouseDown);
      handle.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("resize", updateContainerDimensions);
    };
  }, []);

  return (
    <div id={styles.container}>
      <div ref={containerRef} className={styles["viewer-container"]} />
      <div ref={handleRef} className={styles.handle}>
        <div className={styles["divider-line"]} />
        <div className={styles["circle-handle"]}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
          >
            <path fill="#FFF" d="M13 21l-5-5 5-5m6 0l5 5-5 5" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default OpenSeaDragonCompare;
