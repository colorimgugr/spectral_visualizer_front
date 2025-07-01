import type {
  TagVariant,
  CapSysCode,
  IllSysCode,
  FilterCode,
} from "@/app/resources/types";

export const capSysTags: Record<CapSysCode, TagVariant> = {
  spcIQ: "warning",
  rsnPkL: "brand",
  rsnPkIR: "danger",
  rsnPkUV: "accent",
  nknD850: "brand",
  pxlTqSpc: "success",
  xncsXv: "accent",
};

export const illSysTags: Record<IllSysCode, TagVariant> = {
  hllg: "warning",
  hllgUv: "brand",
  uv: "accent",
  led: "success",
};

export const filterTags: Record<FilterCode, TagVariant> = {
  visSwir: "success",
  uvSwir: "accent",
  uvVis: "danger",
  uvIr: "warning",
  intf: "brand",
  none: "neutral",
};
