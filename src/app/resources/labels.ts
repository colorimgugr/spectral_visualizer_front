import type {
  VisualModeCode,
  SpectralTypeCode,
  SpectralClassCode,
  ArtworkMetadataCode,
  ImageMetadataCode,
} from "@/app/resources/types";

export const visualizationModes: Record<VisualModeCode, string> = {
  single: "Single",
  comp: "Compare",
  blend: "Blend",
  falseRGB: "False RGB",
};

export const spectralTypeLabels: Record<SpectralTypeCode, string> = {
  rgb: "RGB",
  mono: "Monochromatic",
  hsi: "HSI",
  msi: "MSI",
};

export const spectralClassLabels: Record<SpectralClassCode, string> = {
  vnir: "VNIR",
  swir: "SWIR",
  uvis: "UVIS",
  pht: "Photography",
  uvr: "UVR",
  uvf: "UVF",
  irrs: "IRR 780-1000",
  irrl: "IRR 900-1700",
};

export const artworkMetadataLables: Record<ArtworkMetadataCode, string> = {
  author: "Author",
  date: "Date",
  rest: "Restored",
  varn: "Varnished",
  subs: "Substrate",
  width: "Width",
  height: "Height",
};

export const imageMetadataLables: Record<ImageMetadataCode, string> = {
  capSys: "Capturing system",
  illSys: "Illumination system",
  filter: "Filter",
  bands: "Bands",
};
