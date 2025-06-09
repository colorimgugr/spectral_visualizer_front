import type { SpectralCode, Artwork } from "@/app/utils/utils";

const spectralCodeLabels: Record<SpectralCode, string> = {
  vis: "Visible",
  vnir: "VNIR (Visible + Near Infrared)",
  swir: "SWIR (Short-Wave Infrared)",
  uvis: "UV-Reflected",
  uvf: "UV-Fluorescence",
};

const artworks: Artwork[] = [
    {
        id: "mpa",
        name: "Martín Pérez de Ayala",
        apectRatio: "2 / 4",
        spectralImages: [
            {
                code: "vnir",
                link: "https://lh3.googleusercontent.com/d/1tXB8XwmbbLeRHa5W8ZVwoLfkAANjOvKR",
                tileSource: "/artworks/mpa/vnir/vnir.dzi",
            },
            {
                code: "swir",
                link: "https://lh3.googleusercontent.com/d/1ybFLIuSLjoLB_nuMt3q5fhgtoQ4Ibv6C",
                tileSource: "/artworks/mpa/swir/swir.dzi",
            },
            {
                code: "uvf",
                link: "https://lh3.googleusercontent.com/d/1pHar53nzONsMVobOlO__sZKAdowem6iM",
                tileSource: "/artworks/mpa/uvf/uvf.dzi",
                // tileSource: "https://lh3.googleusercontent.com/d/1_DmPfUjbipgJedrPcnw6W9Ij_2XwPAUY",
            },
        ],
    },
    {
        id: "rnd",
        name: "Random",
        apectRatio: "16 / 9",
        spectralImages: [
            {
                code: "vis",
                link: "https://lh3.googleusercontent.com/d/1zmPHlsIzsVndCPqzZX63uNfdOGWLF4jz",
                tileSource: "http://localhost:5000/static/image.dzi",
            },
            {
                code: "vnir",
                link: "https://lh3.googleusercontent.com/d/1DbLZCl3cB3BwGkEn4NfDy07x9L1FIrpm",
                tileSource: "",
            },
            {
                code: "swir",
                link: "https://lh3.googleusercontent.com/d/1R6AlioFJ1XHEPMwl-6JCdxzZopVtnuo2",
                tileSource: "",
            },
            {
                code: "uvis",
                link: "https://lh3.googleusercontent.com/d/16cUP7KMtsi0vmpPNLQjGHt7nJUikGeoc",
                tileSource: "",
            },
        ],
    },
];

export { spectralCodeLabels, artworks };
