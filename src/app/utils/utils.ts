export type VisualModeCode = "single" | "comp" | "blend" | "falseRGB";

export type SpectralTypeCode = "nrm" | "hsi" | "msi";
export type SpectralRangeCode =
  | "vis"
  | "vnir"
  | "swir"
  | "uvr"
  | "uvf"
  | "uvis";

export type SpectralImgData = {
  spectralType: SpectralTypeCode;
  spectralRange: SpectralRangeCode;
  source?: string;
  path?: string;
  names?: string[];
};

export type Artwork = {
  id: string;
  name: string;
  spectralImages: SpectralImgData[];
};
