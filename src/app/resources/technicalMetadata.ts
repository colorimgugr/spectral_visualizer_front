import { TechnicalMetadataMap } from "@/app/resources/types";

export const technicalMetadata: TechnicalMetadataMap = {
  mono: {
    irrl: { capSys: "xncsXv", illSys: "hlg", filter: "none", bands: "1" },
  },
  rgb: {
    irrs: { capSys: "nknD850", illSys: "hlg", filter: "uvVis", bands: "1" },
    pht: {
      hlg: { capSys: "nknD850", illSys: "hlg", filter: "uvIr", bands: "3" },
      led: { capSys: "nknD850", illSys: "led", filter: "uvIr", bands: "3" },
    },
    uvf: { capSys: "nknD850", illSys: "uv", filter: "uvSwir", bands: "3" },
    uvr: { capSys: "nknD850", illSys: "uv", filter: "visSwir", bands: "1" },
  },
  msi: {
    uvf: { capSys: "pxlTqSpc", illSys: "uv", filter: "intf", bands: "16" },
    vnir: { capSys: "pxlTqSpc", illSys: "hlg", filter: "intf", bands: "16" },
  },
  hsi: {
    uvis: { capSys: "rsnPkUV", illSys: "hlg", filter: "none", bands: "95" },
    vnir: {
      rsnPkL: {
        capSys: "rsnPkL",
        illSys: "hlg",
        filter: "none",
        bands: "121",
      },
      spcIQ: { capSys: "spcIQ", illSys: "hlg", filter: "none", bands: "121" },
    },
    swir: { capSys: "rsnPkIR", illSys: "hlg", filter: "none", bands: "161" },
  },
};
