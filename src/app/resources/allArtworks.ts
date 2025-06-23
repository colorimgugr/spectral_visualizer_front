
import type {
  Artwork,
} from "@/app/resources/types";

import mdv from "@/app/resources/artworks/mdv";
import mfr from "@/app/resources/artworks/mfr";
import mpa from "@/app/resources/artworks/mpa";
import edt from "@/app/resources/artworks/edt";

export const artworks: Artwork[] = [
  mdv, mfr, mpa, edt
];