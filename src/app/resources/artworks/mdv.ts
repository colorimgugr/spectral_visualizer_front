import { Artwork } from "@/app/resources/types";

const mdv: Artwork = {
  "id": "mdv",
  "name": "Maternidad de Veronesse",
  "metadata": {
    "author": "Paolo Veronesse",
    "date": "XVI Century",
    "rest": "Yes",
    "varn": "No",
    "width": "60 cm",
    "height": "40 cm"
  },
  "spectralImages": [
    {
      "spectralType": "rgb",
      "spectralClass": "pht",
      "source": "/artworks/mdv/rgb/pht.dzi"
    },
    {
      "spectralType": "rgb",
      "spectralClass": "swir",
      "source": "/artworks/mdv/rgb/swir.dzi"
    },
    {
      "spectralType": "rgb",
      "spectralClass": "vnir",
      "source": "/artworks/mdv/rgb/vnir.dzi"
    }
  ]
};

export default mdv;
