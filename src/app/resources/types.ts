export type VisualModeCode = "single" | "comp" | "blend" | "falseRGB";

export type SpectralTypeCode = "rgb" | "mono" | "hsi" | "msi";
export type SpectralClassCode =
  | "vnir"
  | "swir"
  | "uvis"
  | "pht"
  | "uvr"
  | "uvf"
  | "irrs"
  | "irrl";

export type SpectralImgData = {
  spectralType: SpectralTypeCode;
  spectralClass: SpectralClassCode;
  source?: string;
  path?: string;
  names?: string[];
};

export type Artwork = {
  id: string;
  name: string;
  spectralImages: SpectralImgData[];
};
