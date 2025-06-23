import { Artwork } from "@/app/resources/types";

const mpa: Artwork = {
  "id": "mpa",
  "name": "Mart\u00edn P\u00e9rez de Ayala",
  "spectralImages": [
    {
      "spectralType": "rgb",
      "spectralClass": "swir",
      "source": "/artworks/mpa/rgb/swir.dzi"
    },
    {
      "spectralType": "rgb",
      "spectralClass": "uvf",
      "source": "/artworks/mpa/rgb/uvf.dzi"
    },
    {
      "spectralType": "rgb",
      "spectralClass": "vnir",
      "source": "/artworks/mpa/rgb/vnir.dzi"
    }
  ]
};

export default mpa;
