import { Select } from "@/once-ui/components";
import type { Artwork, SpectralImgData } from "@/app/utils/utils";
import { spectralCodeLabels } from "@/app/resources/content";

type SelectImageProps = {
  selectedArtwork: Artwork;
  selectedImage: SpectralImgData;
  handleSelect: (code: string, side: number) => void;
  side: number;
};

const SelectImage = ({
  selectedArtwork,
  selectedImage,
  handleSelect,
  side,
}: SelectImageProps) => {
  return (
    <Select
      id="empty-state-select"
      label={`Select the${
        side === 1 ? " left" : side === 2 ? " right" : ""
      } image`}
      value={selectedImage.code}
      onSelect={(value: string) => handleSelect(value, side)}
      options={selectedArtwork.spectralImages.map((spectralImg) => ({
        label: spectralCodeLabels[spectralImg.code],
        value: spectralImg.code,
      }))}
    />
  );
};

export default SelectImage;