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

export type ImageMetadataCode = "capSys" | "illSys" | "filter" | "bands";

export type ArtworkMetadata = Partial<Record<ArtworkMetadataCode, string>>;

export type ImageMetadata = Partial<Record<ImageMetadataCode, string>>;

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
