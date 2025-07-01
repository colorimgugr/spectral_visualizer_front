import type {
  TagVariant,
  CapSysCode,
  IllSysCode,
  FilterCode,
} from "@/app/resources/types";

export const capSysTags: Record<CapSysCode, TagVariant> = {
  spcIQ: "brand",
  rsnPkL: "warning",
  rsnPkIR: "danger",
  rsnPkUV: "accent",
  nknD850: "neutral",
  pxlTqSpc: "success",
  xncsXv: "info",
};

export const illSysTags: Record<IllSysCode, TagVariant> = {
  hllg: "warning",
  hllgUv: "brand",
  uv: "accent",
  led: "info",
};

export const filterTags: Record<FilterCode, TagVariant> = {
  visSwir: "info",
  uvSwir: "accent",
  uvVis: "danger",
  uvIr: "warning",
  intf: "brand",
  none: "neutral",
};
