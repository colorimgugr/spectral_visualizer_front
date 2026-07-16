import type {
  VisualModeCode,
  SpectralTypeCode,
  SpectralClassCode,
  ArtworkMetadataCode,
  ImageMetadataCode,
  CapSysCode,
  IllSysCode,
  FilterCode,
  TechnicalMetadataCode,
} from "@/app/resources/types";

export const visualizationModes: Record<VisualModeCode, string> = {
  single: "Single",
  comp: "Compare",
  blend: "Blend",
  falseRGB: "False RGB",
  stitchCompare: "Stitched compare",
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
  width: "Width (cm)",
  height: "Height (cm)",
};

export const imageMetadataLabels: Record<ImageMetadataCode, string> = {
  hPix: "Horizontal (pixels)",
  vPix: "Vertical (pixels)",
  resl: "Resolution (cm/pixels)"
};

export const technicalMetadatLabels: Record<TechnicalMetadataCode, string> = {
  capSys: "Equipment",
  illSys: "Illumination",
  filter: "Filter",
  bands: "Bands",
};

export const capSysLabels: Record<CapSysCode, string> = {
  spcIQ: "Specim IQ",
  rsnPkL: "Resonon Pika L",
  rsnPkIR: "Resonon Pika IR+",
  rsnPkUV: "Resonon Pika UV",
  nknD850: "Nikon D850",
  pxlTqSpc: "PixelTeq Spectrocam",
  xncsXv: "Xenics Xeva",
};

export const illSysLabels: Record<IllSysCode, string> = {
  hlg: "Halogen",
  hlgUv: "Halogen + UV",
  uv: "UV",
  led: "LED",
};

export const filterLabels: Record<FilterCode, string> = {
  visSwir: "VIS+SWIR cut-off (Robertina UV)",
  uvSwir: "UV+SWIR cut-off (Robertina VIS)",
  uvVis: "UV+VIS cut-off (Robertina IR)",
  uvIr: "UV+IR cut-off (Robertina VIS)",
  intf: "Interference Filter",
  none: "None",
};
