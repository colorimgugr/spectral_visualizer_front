
import type {
  Artwork,
} from "@/app/resources/types";

import madFolgRaf from "@/app/resources/artworks/madFolgRaf";
import transRaf from "@/app/resources/artworks/transRaf";
import benClx from "@/app/resources/artworks/benClx";
import martPrzAya from "@/app/resources/artworks/martPrzAya";
import escTab from "@/app/resources/artworks/escTab";
import matVerOrg from "@/app/resources/artworks/matVerOrg";
import matVerRep from "@/app/resources/artworks/matVerRep";
import matVerRest from "@/app/resources/artworks/matVerRest";
import matVerSket from "@/app/resources/artworks/matVerSket";

export const artworks: Artwork[] = [
  madFolgRaf, transRaf, benClx, martPrzAya, escTab, matVerOrg, matVerRep, matVerRest, matVerSket
];