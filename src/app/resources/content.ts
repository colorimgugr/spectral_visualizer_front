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
            },
            {
                code: "swir",
                link: "https://lh3.googleusercontent.com/d/1ybFLIuSLjoLB_nuMt3q5fhgtoQ4Ibv6C",
            },
            {
                code: "uvf",
                link: "https://lh3.googleusercontent.com/d/1pHar53nzONsMVobOlO__sZKAdowem6iM",
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
            },
            {
                code: "vnir",
                link: "https://lh3.googleusercontent.com/d/1DbLZCl3cB3BwGkEn4NfDy07x9L1FIrpm",
            },
            {
                code: "swir",
                link: "https://lh3.googleusercontent.com/d/1R6AlioFJ1XHEPMwl-6JCdxzZopVtnuo2",
            },
            {
                code: "uvis",
                link: "https://lh3.googleusercontent.com/d/16cUP7KMtsi0vmpPNLQjGHt7nJUikGeoc",
            },
        ],
    },
];

export { spectralCodeLabels, artworks };
