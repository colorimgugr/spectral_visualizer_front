"use client";

import { Row, Column } from "@/once-ui/components";
import type { SpectralImgData, ArtworkMetadata } from "@/app/resources/types";
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
  artworkMetadata?: ArtworkMetadata;
  showArtworkMetadata?: boolean;
  handleSelectImage: (code: string, side: number) => void;
  isLargeScreen: boolean;
};

const SingleView = ({
  imagesOptions,
  selectedImage,
  artworkMetadata,
  showArtworkMetadata,
  handleSelectImage,
  isLargeScreen,
}: SingleViewProps) => {

  return (
    <Row fillWidth fillHeight gap="s" mobileDirection="column">
      <SideTools
        side={0}
        imagesOptions={imagesOptions}
        selectedImage={selectedImage}
        showArtworkMetadata={showArtworkMetadata}
        handleSelectImage={handleSelectImage}
        artworkMetadata={artworkMetadata}
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
