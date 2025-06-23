import { Artwork } from "@/app/resources/types";

const mpa: Artwork = {
  "id": "mpa",
  "name": "Mart\u00edn P\u00e9rez de Ayala",
  "metadata": {
    "date": "XVth century",
    "rest": "Yes",
    "varn": "No",
    "width": "1.5 m",
    "height": "0.8 m"
  },
  "spectralImages": [
    {
      "metadata": {
        "bands": "3"
      },
      "spectralType": "rgb",
      "spectralClass": "swir",
      "source": "/artworks/mpa/rgb/swir.dzi"
    },
    {
      "metadata": {
        "capSys": "Nikon D850",
        "illSys": "Ultraviolet",
        "filter": "None",
        "bands": "3"
      },
      "spectralType": "rgb",
      "spectralClass": "uvf",
      "source": "/artworks/mpa/rgb/uvf.dzi"
    },
    {
      "metadata": {},
      "spectralType": "rgb",
      "spectralClass": "vnir",
      "source": "/artworks/mpa/rgb/vnir.dzi"
    }
  ]
};

export default mpa;
