"use client";

import { useState } from "react";
import { Row, Column } from "@/once-ui/components";
import type { SpectralImgData } from "@/app/resources/types";
import SideTools from "@/components/SideTools";
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

const BlendImages = ({
  imagesOptions,
  selectedImageLeft,
  selectedImageRight,
  handleSelectImage,
  isLargeScreen,
}: BlendImagesProps) => {
  const [rightOpacity, setRightOpacity] = useState(0.5);

  const handleOpacityChange = (val: number) => {
    setRightOpacity(val);
  };

  return (
    <Row fillWidth fillHeight gap="xs" mobileDirection="column">
      <Row gap="s" flex={1}>
        <SideTools
          side={1}
          imagesOptions={imagesOptions}
          selectedImage={selectedImageLeft}
          handleSelectImage={handleSelectImage}
          isLargeScreen={isLargeScreen}
        />
        {!isLargeScreen && imagesOptions && (
          <SideTools
            side={2}
            imagesOptions={imagesOptions}
            selectedImage={selectedImageRight}
            handleSelectImage={handleSelectImage}
            isLargeScreen={isLargeScreen}
          />
        )}
      </Row>
      <Column fillWidth flex={isLargeScreen ? 3 : 8} gap="m" paddingTop={isLargeScreen ? "xs" : "s"}>
        <Slider
          title="Opacity"
          min={0}
          max={1}
          step={0.01}
          value={rightOpacity}
          onChange={(value) => handleOpacityChange(value)}
          isLargeScreen={isLargeScreen}
          inline
        />
        {selectedImageLeft.source && selectedImageRight.source && (
          <OpenSeaDragonBlend
            leftUrl={selectedImageLeft.source}
            rightUrl={selectedImageRight.source}
            rightOpacity={rightOpacity}
          />
        )}
      </Column>
      {isLargeScreen && imagesOptions && (
        <Row gap="xs" flex={1}>
          <SideTools
            side={2}
            imagesOptions={imagesOptions}
            selectedImage={selectedImageRight}
            handleSelectImage={handleSelectImage}
            isLargeScreen={isLargeScreen}
          />
        </Row>
      )}
    </Row>
  );
};

export default BlendImages;
