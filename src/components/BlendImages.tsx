"use client";

import { useState } from "react";
import { Row, Column } from "@/once-ui/components";
import type { Artwork, SpectralImgData } from "@/app/utils/utils";
import SelectImage from "@/components/SelectImage";
import Slider from "@/components/Slider";
import dynamic from "next/dynamic";
import { OpenSeaDragonBlendProps } from "@/components/OpenSeaDragonBlend";

const OpenSeaDragonBlend = dynamic<OpenSeaDragonBlendProps>(
  () => import("@/components/OpenSeaDragonBlend"),
  { ssr: false }
);

type BlendImagesProps = {
  selectedArtwork: Artwork;
  selectedImageLeft: SpectralImgData;
  selectedImageRight: SpectralImgData;
  handleSelectImage: (code: string, side: number) => void;
};

export const BlendImages = ({
  selectedArtwork,
  selectedImageLeft,
  selectedImageRight,
  handleSelectImage,
}: BlendImagesProps) => {
  const [leftOpacity, setLeftOpacity] = useState(1);
  const [rightOpacity, setRightOpacity] = useState(1);

  const handleOpacityChange = (val: number, side: number) => {
    if (side == 1) {
      setLeftOpacity(val);
    } else {
      setRightOpacity(val);
    }
  };

  return (
    <Row fillWidth fillHeight gap="16" mobileDirection="column">
      <Column fillWidth flex="1">
        <SelectImage
          selectedArtwork={selectedArtwork}
          selectedImage={selectedImageLeft}
          handleSelect={handleSelectImage}
          side={1}
        />
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={leftOpacity}
          onChange={(val) => {handleOpacityChange(val, 1)}}
        />
      </Column>
      <Column fillWidth flex="4">
        <OpenSeaDragonBlend
          leftTile={selectedImageLeft.tileSource}
          rightTile={selectedImageRight.tileSource}
          leftOpacity={leftOpacity}
          rightOpacity={rightOpacity}
        />
      </Column>
      <Column fillWidth flex="1">
        <SelectImage
          selectedArtwork={selectedArtwork}
          selectedImage={selectedImageRight}
          handleSelect={handleSelectImage}
          side={2}
        />
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={rightOpacity}
          onChange={(val) => {handleOpacityChange(val, 2)}}
        />
      </Column>
    </Row>
  );
};
