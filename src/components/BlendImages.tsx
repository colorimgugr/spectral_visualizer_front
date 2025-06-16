"use client";

import { useState } from "react";
import { Row, Column } from "@/once-ui/components";
import type { SpectralImgData } from "@/app/utils/utils";
import SelectImage from "@/components/SelectImage";
import Slider from "@/components/Slider";
import dynamic from "next/dynamic";
import { OpenSeaDragonBlendProps } from "@/components/OpenSeaDragonBlend";

const OpenSeaDragonBlend = dynamic<OpenSeaDragonBlendProps>(
  () => import("@/components/OpenSeaDragonBlend"),
  { ssr: false }
);

type BlendImagesProps = {
  imagesOptions: SpectralImgData[];
  selectedImageLeft: SpectralImgData;
  selectedImageRight: SpectralImgData;
  handleSelectImage: (code: string, side: number) => void;
  isLargeScreen: boolean;
};

export const BlendImages = ({
  imagesOptions,
  selectedImageLeft,
  selectedImageRight,
  handleSelectImage,
  isLargeScreen,
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
          imagesOptions={imagesOptions}
          selectedImage={selectedImageLeft}
          handleSelect={handleSelectImage}
          side={1}
        />
        <Slider
          title="Opacity"
          min={0}
          max={1}
          step={0.01}
          value={leftOpacity}
          onChange={(value) => {
            handleOpacityChange(value, 1);
          }}
          isLargeScreen={isLargeScreen}
        />
      </Column>
      <Column fillWidth flex="4">
        {selectedImageLeft.source && selectedImageRight.source && (
          <OpenSeaDragonBlend
            leftTile={selectedImageLeft.source}
            rightTile={selectedImageRight.source}
            leftOpacity={leftOpacity}
            rightOpacity={rightOpacity}
          />
        )}
      </Column>
      <Column fillWidth flex="1">
        <SelectImage
          imagesOptions={imagesOptions}
          selectedImage={selectedImageRight}
          handleSelect={handleSelectImage}
          side={2}
        />
        <Slider
          title="Opacity"
          min={0}
          max={1}
          step={0.01}
          value={rightOpacity}
          onChange={(value) => {
            handleOpacityChange(value, 2);
          }}
          isLargeScreen={isLargeScreen}
        />
      </Column>
    </Row>
  );
};
