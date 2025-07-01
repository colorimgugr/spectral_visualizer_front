import { Artwork } from "@/app/resources/types";

const mpa: Artwork = {
  "id": "mpa",
  "name": "Mart\u00edn P\u00e9rez de Ayala",
  "metadata": {
    "author": null,
    "date": null,
    "rest": "No",
    "varn": "No",
    "subs": null,
    "width": null,
    "height": null
  },
  "spectralImages": [
    {
      "spectralType": "rgb",
      "spectralClass": "swir",
      "specification": null,
      "metadata": {
        "hPix": null,
        "vPix": null
      },
      "source": "/artworks/mpa/rgb/swir.dzi"
    },
    {
      "spectralType": "rgb",
      "spectralClass": "uvf",
      "specification": null,
      "metadata": {
        "hPix": null,
        "vPix": null
      },
      "source": "/artworks/mpa/rgb/uvf.dzi"
    },
    {
      "spectralType": "rgb",
      "spectralClass": "vnir",
      "specification": null,
      "metadata": {
        "hPix": null,
        "vPix": null
      },
      "source": "/artworks/mpa/rgb/vnir.dzi"
    }
  ]
};

export default mpa;
