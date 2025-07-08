import { Column, Row, Text, Line } from "@/once-ui/components";
import type {
  SpectralImgData,
  ArtworkMetadataCode,
  ArtworkMetadata,
} from "@/app/resources/types";
import { artworkMetadataLabels } from "@/app/resources/labels";
import SelectImage from "@/components/SelectImage";
import ImageMetadataDisplay from "@/components/ImageMetadataDisplay";

type SideToolsProps = {
  side: number;
  imagesOptions: SpectralImgData[];
  selectedImage: SpectralImgData;
  handleSelectImage: (code: string, side: number) => void;
  artworkMetadata?: ArtworkMetadata;
  showArtworkMetadata?: boolean;
  isLargeScreen: boolean;
};

const SideTools = ({
  side,
  imagesOptions,
  selectedImage,
  handleSelectImage,
  artworkMetadata,
  showArtworkMetadata = false,
  isLargeScreen,
}: SideToolsProps) => (
  <Column fillWidth gap={isLargeScreen ? "xs" : "m"} flex="1">
    <SelectImage
      imagesOptions={imagesOptions}
      selectedImage={selectedImage}
      handleSelect={handleSelectImage}
      side={side}
    />
    <Column
      paddingTop="s"
      fillWidth
      paddingLeft="s"
      paddingRight="s"
      gap="m"
      mobileDirection="row"
    >
      {showArtworkMetadata && (
        <Column gap="xs" flex={1}>
          {Object.entries(artworkMetadataLabels).map(([code, label]) => (
            <Row key={code} fillWidth gap="xs">
              <Text variant="label-strong-l" onBackground="info-weak">{`${label}:`}</Text>
              <Text variant="label-default-l">
                {artworkMetadata?.[code as ArtworkMetadataCode] ?? "Unknown"}
              </Text>
            </Row>
          ))}
        </Column>
      )}
      {showArtworkMetadata && isLargeScreen && <Line />}
      <Column gap="xs" flex={1}>
        <ImageMetadataDisplay
          spectralType={selectedImage.spectralType}
          spectralClass={selectedImage.spectralClass}
          specification={selectedImage.specification}
          imageMetadata={selectedImage.metadata}
          isLargeScreen={isLargeScreen}
        />
      </Column>
    </Column>
  </Column>
);

export default SideTools;
