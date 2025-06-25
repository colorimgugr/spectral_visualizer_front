import { Artwork } from "@/app/resources/types";

const mpa: Artwork = {
  "id": "mpa",
  "name": "Mart\u00edn P\u00e9rez de Ayala",
  "metadata": {
    "author": null,
    "date": "XVth century",
    "rest": null,
    "varn": null,
    "subs": null,
    "width": null,
    "height": null
  },
  "spectralImages": [
    {
      "metadata": {
        "capSys": null,
        "illSys": null,
        "filter": null,
        "bands": null,
        "hPix": null,
        "vPix": null
      },
      "spectralType": "rgb",
      "spectralClass": "swir",
      "source": "/artworks/mpa/rgb/swir.dzi"
    },
    {
      "metadata": {
        "capSys": "Nikon D850",
        "illSys": "UV",
        "filter": "UV+VIS cut-off (Robertina IR)",
        "bands": null,
        "hPix": null,
        "vPix": null
      },
      "spectralType": "rgb",
      "spectralClass": "uvf",
      "source": "/artworks/mpa/rgb/uvf.dzi"
    },
    {
      "metadata": {
        "capSys": null,
        "illSys": null,
        "filter": null,
        "bands": null,
        "hPix": null,
        "vPix": null
      },
      "spectralType": "rgb",
      "spectralClass": "vnir",
      "source": "/artworks/mpa/rgb/vnir.dzi"
    }
  ]
};

export default mpa;
