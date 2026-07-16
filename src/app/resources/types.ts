export type VisualModeCode =
  | "single"
  | "comp"
  | "blend"
  | "falseRGB"
  | "stitchCompare";

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

export type ImageMetadataCode = "hPix" | "vPix" | "resl";

export type TechnicalMetadataCode = "capSys" | "illSys" | "filter" | "bands";

export type ArtworkMetadata = Partial<
  Record<ArtworkMetadataCode, string | null>
>;

export type ImageMetadata = Record<ImageMetadataCode, string | null>;

export type TechnicalMetadata = Partial<Record<TechnicalMetadataCode, string>>;

/**
 * Registration of a stitched image into a shared reference frame, produced
 * offline by prepare_compare.py. `H` is a row-major 3x3 homography mapping
 * THIS image's pixel coordinates into the reference image's pixel frame.
 * Two images sharing the same `ref` can be co-registered pairwise via
 * H_pair = inv(H_b) * H_a.
 */
export type StitchAlign = {
  ref: string;
  H: number[];
};

export type SpectralImgData = {
  metadata: ImageMetadata;
  spectralType: SpectralTypeCode;
  spectralClass: SpectralClassCode;
  specification: CapSysCode | IllSysCode | null;
  source?: string;
  path?: string;
  names?: string[];
  align?: StitchAlign;
};

export type Artwork = {
  id: string;
  name: string;
  metadata: ArtworkMetadata;
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

export type IllSysCode = "hlg" | "hlgUv" | "uv" | "led";

export type FilterCode =
  | "visSwir"
  | "uvSwir"
  | "uvVis"
  | "uvIr"
  | "intf"
  | "none";

export type TechnicalMetadataEntry =
  | TechnicalMetadata
  | Partial<Record<CapSysCode | IllSysCode, TechnicalMetadata>>;

export type SpectralTypeMetadata = Partial<
  Record<SpectralClassCode, TechnicalMetadataEntry>
>;

export type TechnicalMetadataMap = Record<
  SpectralTypeCode,
  SpectralTypeMetadata
>;
