import { Row, Column, CompareImage } from "@/once-ui/components";
import type { Artwork, SpectralImgData } from "@/app/utils/utils";
import { SelectImage } from "@/components/SelectImage";

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
    <Row fillWidth gap="16" mobileDirection="column">
      <Column fillWidth flex="1">
        <SelectImage
          selectedArtwork={selectedArtwork}
          selectedImage={selectedImageLeft}
          handleSelect={handleSelectImage}
          side={1}
        />
      </Column>
      <Column fillWidth flex="4">
        <CompareImage
          radius="xs"
          border="neutral-alpha-weak"
          overflow="hidden"
          aspectRatio={selectedArtwork.apectRatio}
          leftContent={{
            src: selectedImageLeft.link,
            alt: "Image 1",
          }}
          rightContent={{
            src: selectedImageRight.link,
            alt: "Image 2",
          }}
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
