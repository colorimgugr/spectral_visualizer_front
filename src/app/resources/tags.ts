import type {
  TagVariant,
  CapSysCode,
  IllSysCode,
  FilterCode,
} from "@/app/resources/types";

export const CapSysTags: Record<CapSysCode, TagVariant> = {
  spcIQ: "brand",
  rsnPkL: "warning",
  rsnPkIR: "danger",
  rsnPkUV: "accent",
  nknD850: "neutral",
  pxlTqSpc: "success",
  xncsXv: "info",
};

export const IllSysTags: Record<IllSysCode, TagVariant> = {
  hllg: "warning",
  uv: "accent",
  led: "info",
};

export const FilterTags: Record<FilterCode, TagVariant> = {
  visSwir: "info",
  uvSwir: "accent",
  uvVis: "danger",
  uvIr: "warning",
};
