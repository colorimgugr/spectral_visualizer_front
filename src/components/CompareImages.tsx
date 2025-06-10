"use client";

import { Row, Column, CompareImage } from "@/once-ui/components";
import type { Artwork, SpectralImgData } from "@/app/utils/utils";
import { SelectImage } from "@/components/SelectImage";
import dynamic from "next/dynamic";
import { OpenSeaDragonCompareProps } from "@/components/OpenSeaDragonCompare";

const OpenSeaDragonCompare = dynamic<OpenSeaDragonCompareProps>(
  () => import("@/components/OpenSeaDragonCompare"),
  { ssr: false }
);

type CompareImagesProps = {
  selectedArtwork: Artwork;
  selectedImageLeft: SpectralImgData;
  selectedImageRight: SpectralImgData;
  handleSelectImage: (code: string, side: number) => void;
};

export const CompareImages = ({
  selectedArtwork,
  selectedImageLeft,
  selectedImageRight,
  handleSelectImage,
}: CompareImagesProps) => {
  return (
    <Row fillWidth fillHeight gap="16" mobileDirection="column">
      <Column fillWidth flex="1">
        <SelectImage
          selectedArtwork={selectedArtwork}
          selectedImage={selectedImageLeft}
          handleSelect={handleSelectImage}
          side={1}
        />
      </Column>
      <Column fillWidth flex="4">
        <OpenSeaDragonCompare
          leftTile={selectedImageLeft.tileSource}
          rightTile={selectedImageRight.tileSource}
        />
      </Column>
      <Column fillWidth flex="1">
        <SelectImage
          selectedArtwork={selectedArtwork}
          selectedImage={selectedImageRight}
          handleSelect={handleSelectImage}
          side={2}
        />
      </Column>
    </Row>
  );
};
