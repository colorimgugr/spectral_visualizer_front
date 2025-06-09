type SpectralCode = "vis" | "vnir" | "swir" | "uvis" | "uvf";

type SpectralImgData = {
  code: SpectralCode;
  link: string;
  tileSource: string;
};

type Artwork = {
  id: string;
  name: string;
  apectRatio: string;
  spectralImages: SpectralImgData[];
};

export type { SpectralCode, SpectralImgData, Artwork };
