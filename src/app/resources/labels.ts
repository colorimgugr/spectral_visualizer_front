import type {
  VisualModeCode,
  SpectralTypeCode,
  SpectralClassCode,
  ArtworkMetadataCode,
  ImageMetadataCode,
  CapSysCode,
  IllSysCode,
  FilterCode,
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

export const artworkMetadataLabels: Record<ArtworkMetadataCode, string> = {
  author: "Author",
  date: "Date",
  rest: "Restored",
  varn: "Varnished",
  subs: "Substrate",
  width: "Width",
  height: "Height",
};

export const imageMetadataLabels: Record<ImageMetadataCode, string> = {
  capSys: "Capturing system",
  illSys: "Illumination system",
  filter: "Filter",
  bands: "Bands",
  hPix: "Horizontal pixels",
  vPix: "Vertical pixels",
};

export const CapSysLabels: Record<CapSysCode, string> = {
  spcIQ: "Specim IQ",
  rsnPkL: "Resonon Pika L",
  rsnPkIR: "Resonon Pika IR+",
  rsnPkUV: "Resonon Pika UV",
  nknD850: "Nikon D850",
  pxlTqSpc: "PixelTeq Spectrocam",
  xncsXv: "Xenics Xeva",
};

export const IllSysLabels: Record<IllSysCode, string> = {
  hllg: "Hallogen",
  uv: "UV",
  led: "LED",
};

export const FilterLabels: Record<FilterCode, string> = {
  visSwir: "VIS+SWIR cut-off (Robertina UV)",
  uvSwir: "UV+SWIR cut-off (Robertina VIS)",
  uvVis: "UV+VIS cut-off (Robertina IR)",
  uvIr: "UV+IR cut-off (Robertina VIS)",
};
