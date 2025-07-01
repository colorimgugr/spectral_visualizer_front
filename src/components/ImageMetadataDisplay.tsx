import { Row, Text, Tag } from "@/once-ui/components";
import { technicalMetadata } from "@/app/resources/technicalMetadata";
import {
  imageMetadataLabels,
  technicalMetadatLabels,
  capSysLabels,
  illSysLabels,
  filterLabels,
} from "@/app/resources/labels";
import { capSysTags, illSysTags, filterTags } from "@/app/resources/tags";
import type {
  SpectralTypeCode,
  SpectralClassCode,
  ImageMetadataCode,
  TechnicalMetadataCode,
  ImageMetadata,
  TechnicalMetadata,
  TagVariant,
  CapSysCode,
  IllSysCode,
  FilterCode,
} from "@/app/resources/types";

type MetadataDisplayProps = {
  spectralType: SpectralTypeCode;
  spectralClass: SpectralClassCode;
  specification?: string;
  imageMetadata: ImageMetadata;
};

const ImageMetadataDisplay = ({
  spectralType,
  spectralClass,
  specification,
  imageMetadata,
}: MetadataDisplayProps) => {
  const getTechnicalMetadata = (): TechnicalMetadata | null => {
    const typeEntry = technicalMetadata[spectralType];
    if (!typeEntry) return null;

    const classEntry = typeEntry[spectralClass];

    if (!classEntry) return null;

    if (specification && typeof classEntry === "object") {
      const specEntry = (
        classEntry as Record<CapSysCode | IllSysCode, TechnicalMetadata>
      )[specification as CapSysCode | IllSysCode];
      return specEntry as TechnicalMetadata;
    }

    if (
      typeof classEntry === "object" &&
      Object.values(classEntry).every(
        (value) => typeof value === "string" || typeof value === "undefined"
      )
    ) {
      return classEntry as TechnicalMetadata;
    }

    return null;
  };

  const techMetadata = getTechnicalMetadata();

  const renderTags = <T extends string>(
    metadataCode: TechnicalMetadataCode,
    codeType: TechnicalMetadataCode,
    val: unknown,
    labels: Record<T, string>,
    tags: Record<T, TagVariant>
  ) => {
    if (metadataCode === codeType && typeof val === "string") {
      const isValidCode = (v: string): v is T => v in labels;
      const label = isValidCode(val) ? labels[val] : val;
      const variant = isValidCode(val) ? tags[val] : "neutral";
      return <Tag variant={variant}>{label}</Tag>;
    }
    return null;
  };

  const renderTechnicalMetadata = (metadataCode: TechnicalMetadataCode) => {
    const value = techMetadata ? techMetadata[metadataCode] : null;
    return (
      renderTags<CapSysCode>(
        metadataCode,
        "capSys",
        value,
        capSysLabels,
        capSysTags
      ) ??
      renderTags<IllSysCode>(
        metadataCode,
        "illSys",
        value,
        illSysLabels,
        illSysTags
      ) ??
      renderTags<FilterCode>(
        metadataCode,
        "filter",
        value,
        filterLabels,
        filterTags
      ) ?? <Text variant="label-default-m">{value ?? "Unknown"}</Text>
    );
  };

  return (
    <>
      {Object.entries(technicalMetadatLabels).map(([code, label]) => (
        <Row key={code} fillWidth gap="xs">
          <Text
            onBackground="accent-weak"
            variant="label-default-m"
          >{`${label}:`}</Text>
          {renderTechnicalMetadata(code as TechnicalMetadataCode)}
        </Row>
      ))}
      {Object.entries(imageMetadataLabels).map(([code, label]) => (
        <Row key={code} fillWidth gap="xs">
          <Text
            onBackground="accent-weak"
            variant="label-default-m"
          >{`${label}:`}</Text>
          <Text variant="label-default-m">
            {imageMetadata[code as ImageMetadataCode] ?? "Unknown"}
          </Text>
        </Row>
      ))}
    </>
  );
};

export default ImageMetadataDisplay;
