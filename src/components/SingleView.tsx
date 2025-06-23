"use client";

import { useEffect, useState } from "react";
import { Row, Column } from "@/once-ui/components";
import type { SpectralImgData } from "@/app/resources/types";
import SideTools from "@/components/SideTools";
import dynamic from "next/dynamic";
import { OpenSeaDragonViewerProps } from "@/components/OpenSeaDragonViewer";

const OpenSeaDragonViewer = dynamic<OpenSeaDragonViewerProps>(
  () => import("@/components/OpenSeaDragonViewer"),
  { ssr: false }
);

type SingleViewProps = {
  imagesOptions: SpectralImgData[];
  selectedImage: SpectralImgData;
  handleSelectImage: (code: string, side: number) => void;
  isLargeScreen: boolean;
};

const SingleView = ({
  imagesOptions,
  selectedImage,
  handleSelectImage,
  isLargeScreen,
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
    <Row fillWidth fillHeight gap="s" mobileDirection="column">
      <SideTools
        side={0}
        imagesOptions={imagesOptions}
        selectedImage={selectedImage}
        handleSelectImage={handleSelectImage}
        isLargeScreen={isLargeScreen}
      />
      <Column fillWidth flex={isLargeScreen ? 4 : 10}>
        {selectedImage.source && (
          <OpenSeaDragonViewer url={selectedImage.source} />
        )}
      </Column>
    </Row>
  );
};

export default SingleView;
