"use client";

import { Row, Column } from "@/once-ui/components";
import type { SpectralImgData } from "@/app/resources/types";
import SideTools from "@/components/SideTools";
import dynamic from "next/dynamic";
import { OpenSeaDragonCompareProps } from "@/components/OpenSeaDragonCompare";

const OpenSeaDragonCompare = dynamic<OpenSeaDragonCompareProps>(
  () => import("@/components/OpenSeaDragonCompare"),
  { ssr: false }
);

type CompareImagesProps = {
  imagesOptions: SpectralImgData[];
  selectedImageLeft: SpectralImgData;
  selectedImageRight: SpectralImgData;
  handleSelectImage: (code: string, side: number) => void;
  isLargeScreen: boolean;
};

const CompareImages = ({
  imagesOptions,
  selectedImageLeft,
  selectedImageRight,
  handleSelectImage,
  isLargeScreen,
}: CompareImagesProps) => {
  return (
    <Row fillWidth fillHeight gap="xs" mobileDirection="column">
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
      <Column fillWidth flex={isLargeScreen ? 4 : 10}>
        {selectedImageLeft.source && selectedImageRight.source && (
          <OpenSeaDragonCompare
            leftUrl={selectedImageLeft.source}
            rightUrl={selectedImageRight.source}
          />
        )}
      </Column>
      {isLargeScreen && imagesOptions && (
        <SideTools
          side={2}
          imagesOptions={imagesOptions}
          selectedImage={selectedImageRight}
          handleSelectImage={handleSelectImage}
          isLargeScreen={isLargeScreen}
        />
      )}
    </Row>
  );
};

export default CompareImages;
