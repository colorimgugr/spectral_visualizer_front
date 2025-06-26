import { Text, Tag } from "@/once-ui/components";
import {
  CapSysLabels,
  IllSysLabels,
  FilterLabels,
} from "@/app/resources/labels";
import { CapSysTags, IllSysTags, FilterTags } from "@/app/resources/tags";
import type {
  ImageMetadataCode,
  TagVariant,
  CapSysCode,
  IllSysCode,
  FilterCode,
  ImageMetadata,
} from "@/app/resources/types";

type MetadataDisplayProps = {
  metadataCode: ImageMetadataCode;
  metadata?: ImageMetadata;
};

const ImageMetadataDisplay = ({
  metadataCode,
  metadata,
}: MetadataDisplayProps) => {
  const value = metadata?.[metadataCode];

  const renderTaggedMetadata = <T extends string>(
    codeType: ImageMetadataCode,
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

  return (
    renderTaggedMetadata<CapSysCode>(
      "capSys",
      value,
      CapSysLabels,
      CapSysTags
    ) ??
    renderTaggedMetadata<IllSysCode>(
      "illSys",
      value,
      IllSysLabels,
      IllSysTags
    ) ??
    renderTaggedMetadata<FilterCode>(
      "filter",
      value,
      FilterLabels,
      FilterTags
    ) ?? <Text variant="label-default-m">{value ?? "Unknown"}</Text>
  );
};

export default ImageMetadataDisplay;
