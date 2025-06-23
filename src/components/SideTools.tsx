import { Column, Row, Text, Line } from "@/once-ui/components";
import type {
  SpectralImgData,
  ArtworkMetadataCode,
  ArtworkMetadata,
  ImageMetadataCode,
} from "@/app/resources/types";
import {
  artworkMetadataLables,
  imageMetadataLables,
} from "@/app/resources/labels";
import SelectImage from "@/components/SelectImage";
import Slider from "@/components/Slider";

type SideToolsProps = {
  side: number;
  imagesOptions: SpectralImgData[];
  selectedImage: SpectralImgData;
  handleSelectImage: (code: string, side: number) => void;
  artworkMetadata?: ArtworkMetadata;
  showImageMetadata?: boolean;
  showOpacity?: boolean;
  opacity?: number;
  handleOpacityChange?: (val: number, side: number) => void;
  isLargeScreen: boolean;
};

const SideTools = ({
  side,
  imagesOptions,
  selectedImage,
  handleSelectImage,
  artworkMetadata,
  showImageMetadata = true,
  showOpacity,
  opacity,
  handleOpacityChange,
  isLargeScreen,
}: SideToolsProps) => (
  <Column fillWidth gap={isLargeScreen ? "xs" : "m"} flex="1">
    <SelectImage
      imagesOptions={imagesOptions}
      selectedImage={selectedImage}
      handleSelect={handleSelectImage}
      side={side}
    />
    {showOpacity && opacity !== undefined && handleOpacityChange && (
      <Slider
        title={`Opacity - ${side === 1 ? "Left" : "Right"}`}
        min={0}
        max={1}
        step={0.01}
        value={opacity}
        onChange={(value) => handleOpacityChange(value, side)}
        isLargeScreen={isLargeScreen}
      />
    )}
    <Column fillWidth paddingLeft="s" paddingRight="s" gap="m" mobileDirection="row">
      {artworkMetadata && (
        <Column gap="xs" flex={1}>
          {Object.entries(artworkMetadataLables).map(([code, label]) => (
            <Row key={code} fillWidth gap="xs">
              <Text onBackground="accent-weak">{`${label}:`}</Text>
              <Text>
                {artworkMetadata?.[code as ArtworkMetadataCode] ?? "Unknown"}
              </Text>
            </Row>
          ))}
        </Column>
      )}
      {artworkMetadata &&
        showImageMetadata &&
        (isLargeScreen && <Line />)}
      {showImageMetadata && selectedImage.metadata && (
        <Column gap="xs" flex={1}>
          {Object.entries(imageMetadataLables).map(([code, label]) => (
            <Row key={code} fillWidth gap="xs">
              <Text onBackground="accent-weak">{`${label}:`}</Text>
              <Text>
                {selectedImage.metadata?.[code as ImageMetadataCode] ??
                  "Unknown"}
              </Text>
            </Row>
          ))}
        </Column>
      )}
    </Column>
  </Column>
);

export default SideTools;
