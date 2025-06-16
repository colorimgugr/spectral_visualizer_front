import { Select } from "@/once-ui/components";
import type { Artwork, SpectralImgData } from "@/app/utils/utils";
import { spectralRangeLabels } from "@/app/resources/content";

type SelectImageProps = {
  imagesOptions: SpectralImgData[];
  selectedImage: SpectralImgData;
  handleSelect: (code: string, side: number) => void;
  side: number;
};

const SelectImage = ({
  imagesOptions,
  selectedImage,
  handleSelect,
  side,
}: SelectImageProps) => {
  const getImageOptions = () => {
    return imagesOptions
      .map((img) => ({
        label: spectralRangeLabels[img.spectralRange],
        value: img.spectralRange,
      }));
  };
  
  return (
    <Select
      id="empty-state-select"
      label={`Select the${
        side === 1 ? " left" : side === 2 ? " right" : ""
      } image`}
      value={selectedImage.spectralRange}
      onSelect={(value: string) => handleSelect(value, side)}
      options={getImageOptions()}
    />
  );
};

export default SelectImage;
