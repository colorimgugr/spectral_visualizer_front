import type { SpectralCode, Artwork } from "@/app/utils/utils";

const spectralCodeLabels: Record<SpectralCode, string> = {
  vis: "Visible RGB",
  vnir: "VNIR (Visible + Near Infrared)",
  swir: "SWIR (Short-Wave Infrared)",
  uvis: "UV-Reflected",
  uvf: "UV-Fluorescence",
};

const artworks: Artwork[] = [
  {
    id: "mpa",
    name: "Martín Pérez de Ayala",
    spectralImages: [
      {
        code: "vnir",
        link: "https://lh3.googleusercontent.com/d/1tXB8XwmbbLeRHa5W8ZVwoLfkAANjOvKR",
        tileSource: "/artworks/mpa/vnir/vnir.dzi",
        // tileSource: "/originals/vnir.jpg",
      },
      {
        code: "swir",
        link: "https://lh3.googleusercontent.com/d/1ybFLIuSLjoLB_nuMt3q5fhgtoQ4Ibv6C",
        tileSource: "/artworks/mpa/swir/swir.dzi",
        // tileSource: "/originals/swir.jpg",
      },
      {
        code: "uvf",
        link: "https://lh3.googleusercontent.com/d/1pHar53nzONsMVobOlO__sZKAdowem6iM",
        tileSource: "/artworks/mpa/uvf/uvf.dzi",
        // tileSource: "/originals/uvf.jpg",
        // tileSource: "https://lh3.googleusercontent.com/d/1_DmPfUjbipgJedrPcnw6W9Ij_2XwPAUY",
      },
    ],
  },
  {
    id: "mdv",
    name: "Maternidad de Veronese",
    spectralImages: [
      {
        code: "vis",
        link: "",
        tileSource: "/artworks/mdv/vis/vis.dzi",
        // tileSource: "http://localhost:5000/static/image.dzi",
      },
      {
        code: "vnir",
        link: "",
        tileSource: "/artworks/mdv/vnir/vnir.dzi",
      },
      {
        code: "swir",
        link: "",
        tileSource: "/artworks/mdv/swir/swir.dzi",
      },
    ],
  },
];

export { spectralCodeLabels, artworks };
