"use client";

import { useEffect, useState } from "react";
import { Row, Column } from "@/once-ui/components";
import type { Artwork, SpectralImgData } from "@/app/utils/utils";
import SelectImage from "@/components/SelectImage";
import dynamic from "next/dynamic";
import {OpenSeaDragonViewerProps} from "@/components/OpenSeaDragonViewer";

const OpenSeaDragonViewer = dynamic<OpenSeaDragonViewerProps>(
  () => import("@/components/OpenSeaDragonViewer"),
  { ssr: false }
);

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
  // const [tileSource, setTileSource] = useState<string>("");

  // useEffect(() => {
  //   if (!selectedImage?.code) return;

  //   const fetchDZI = async () => {
  //     try {
  //       console.log("trying")
  //       // const res = await fetch("http://localhost:5000/dzi", {
  //       const res = await fetch("https://multispectral-visualizer-back.onrender.com/dzi", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ filename: selectedImage.code }),
  //       });

  //       const data = await res.json();
  //       if (data.dzi_url) {
  //         // setTileSource(`http://localhost:5000${data.dzi_url}`);
  //         setTileSource(`https://multispectral-visualizer-back.onrender.com${data.dzi_url}`);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch DZI:", error);
  //     }
  //   };

  //   fetchDZI();
  // }, [selectedImage]);

  return (
    <Row fillWidth fillHeight gap="16" mobileDirection="column">
      <Column fillWidth flex="1">
        <SelectImage
          selectedArtwork={selectedArtwork}
          selectedImage={selectedImage}
          handleSelect={handleSelectImage}
          side={0}
        />
      </Column>
      <Column fillWidth flex="5">
        <OpenSeaDragonViewer tileSource={selectedImage.tileSource} />
      </Column>
    </Row>
  );
};
