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

export type ArtworkMetadataCode =
  | "author"
  | "date"
  | "rest"
  | "varn"
  | "subs"
  | "width"
  | "height";

export type ImageMetadataCode =
  | "capSys"
  | "illSys"
  | "filter"
  | "bands"
  | "hPix"
  | "vPix";

export type ArtworkMetadata = Partial<
  Record<ArtworkMetadataCode, string | null>
>;

export type ImageMetadata = Partial<Record<ImageMetadataCode, string | null>>;

export type SpectralImgData = {
  metadata?: ImageMetadata;
  spectralType: SpectralTypeCode;
  spectralClass: SpectralClassCode;
  source?: string;
  path?: string;
  names?: string[];
};

export type Artwork = {
  id: string;
  name: string;
  metadata?: ArtworkMetadata;
  spectralImages: SpectralImgData[];
};

export type TagVariant =
  | "brand"
  | "accent"
  | "warning"
  | "success"
  | "danger"
  | "neutral"
  | "info"
  | "gradient";

export type CapSysCode =
  | "spcIQ"
  | "rsnPkL"
  | "rsnPkIR"
  | "rsnPkUV"
  | "nknD850"
  | "pxlTqSpc"
  | "xncsXv";

export type IllSysCode = "hllg" | "uv" | "led";

export type FilterCode = "visSwir" | "uvSwir" | "uvVis" | "uvIr";
