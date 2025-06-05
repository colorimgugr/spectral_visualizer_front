"use client";

import { useEffect, useRef } from "react";
import { Row, Column, Media } from "@/once-ui/components";
import type { Artwork, SpectralImgData } from "@/app/utils/utils";
import { SelectImage } from "@/components/SelectImage";
// import OpenSeadragon from "openseadragon";

type SingleViewProps = {
  selectedArtwork: Artwork;
  selectedImage: SpectralImgData;
  handleSelectImage: (code: string, side: number) => void;
};

export const SingleView = ({
  selectedArtwork,
  selectedImage,
  handleSelectImage,
}: SingleViewProps) => {
  const tileSource = "/artworks/mpa/mpa.dzi";
  const viewerRef = useRef<any>(null);
  const osdViewer = useRef<any>(null);

  useEffect(() => {
    const loadViewer = async () => {
      console.log("Aqyu");

      if (osdViewer.current || !viewerRef.current) return;

      const OpenSeadragon = (await import("openseadragon")).default;

      // if (viewerRef.current) {
      osdViewer.current = OpenSeadragon({
        element: viewerRef.current,
        prefixUrl: "/openseadragon/images/", // This folder must exist in /public
        tileSources: tileSource,
        showNavigationControl: true,
      });
      // }
    };

    loadViewer();

    return () => {
      if (osdViewer.current) {
        osdViewer.current.destroy();
        osdViewer.current = null;
      }

      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
    console.log("👀 useEffect ran");

    return () => {
      console.log("💥 useEffect cleanup");
    };
  }, []);

  return (
    <Row fillWidth gap="16" mobileDirection="column">
      <Column fillWidth flex="1">
        <SelectImage
          selectedArtwork={selectedArtwork}
          selectedImage={selectedImage}
          handleSelect={handleSelectImage}
          side={0}
        />
      </Column>
      <Column fillWidth flex="5">
        {/* <Media
          enlarge
          // src={selectedImage.link}
          src={tileSource}
          alt="Image"
          radius="xl"
          border="neutral-alpha-medium"
          aspectRatio={selectedArtwork.apectRatio}
        /> */}
        <div ref={viewerRef} style={{ width: "100%", height: "600px" }} />
      </Column>
    </Row>
  );
};
