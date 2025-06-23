import { Column } from "@/once-ui/components";
import type { SpectralImgData } from "@/app/resources/types";
import SelectImage from "@/components/SelectImage";
import Slider from "@/components/Slider";

type SideToolsProps = {
  side: number;
  imagesOptions: SpectralImgData[];
  selectedImage: SpectralImgData;
  handleSelectImage: (code: string, side: number) => void;
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
  </Column>
);

export default SideTools;
