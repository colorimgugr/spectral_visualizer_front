import { TechnicalMetadataMap } from "@/app/resources/types";

export const technicalMetadata: TechnicalMetadataMap = {
  mono: {
    irrl: { capSys: "xncsXv", illSys: "hllg", filter: "none", bands: "1" },
  },
  rgb: {
    irrs: { capSys: "nknD850", illSys: "hllg", filter: "uvVis", bands: "1" },
    pht: {
      hllg: { capSys: "nknD850", illSys: "hllg", filter: "uvIr", bands: "3" },
      led: { capSys: "nknD850", illSys: "led", filter: "uvIr", bands: "3" },
    },
    uvf: { capSys: "nknD850", illSys: "uv", filter: "uvSwir", bands: "3" },
    uvr: { capSys: "nknD850", illSys: "uv", filter: "visSwir", bands: "1" },
  },
  msi: {
    uvf: {
      hllg: { capSys: "pxlTqSpc", illSys: "hllg", filter: "intf", bands: "16" },
      uv: { capSys: "pxlTqSpc", illSys: "uv", filter: "intf", bands: "16" },
    },
    vnir: {
      hllg: { capSys: "pxlTqSpc", illSys: "hllg", filter: "intf", bands: "16" },
      uv: { capSys: "pxlTqSpc", illSys: "uv", filter: "intf", bands: "16" },
    },
  },
  hsi: {
    uvis: { capSys: "rsnPkUV", illSys: "hllg", filter: "none", bands: "95" },
    vnir: {
      rsnPkL: {
        capSys: "rsnPkL",
        illSys: "hllg",
        filter: "none",
        bands: "121",
      },
      spcIQ: { capSys: "spcIQ", illSys: "hllg", filter: "none", bands: "121" },
    },
    swir: { capSys: "rsnPkIR", illSys: "hllg", filter: "none", bands: "161" },
  },
};
