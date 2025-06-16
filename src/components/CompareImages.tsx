"use client";

import { Row, Column } from "@/once-ui/components";
import type { SpectralImgData } from "@/app/utils/utils";
import SelectImage from "@/components/SelectImage";
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
};

export const CompareImages = ({
  imagesOptions,
  selectedImageLeft,
  selectedImageRight,
  handleSelectImage,
}: CompareImagesProps) => {
  console.log("img", imagesOptions);
  return (
    <Row fillWidth fillHeight gap="16" mobileDirection="column">
      <Column fillWidth flex="1">
        <SelectImage
          imagesOptions={imagesOptions}
          selectedImage={selectedImageLeft}
          handleSelect={handleSelectImage}
          side={1}
        />
      </Column>
      <Column fillWidth flex="4">
        {selectedImageLeft.source && selectedImageRight.source && (
          <OpenSeaDragonCompare
            leftTile={selectedImageLeft.source}
            rightTile={selectedImageRight.source}
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
      </Column>
    </Row>
  );
};
