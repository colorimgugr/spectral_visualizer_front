import { Artwork } from "@/app/resources/types";

const mona: Artwork = {
  "id": "mona",
  "name": "Mona Lisa",
  "metadata": {
    "author": "Leonardo",
    "date": null,
    "rest": "No",
    "varn": "Yes",
    "subs": "Canvas",
    "width": null,
    "height": null
  },
  "spectralImages": [
    {
      "spectralType": "rgb",
      "spectralClass": "pht",
      "specification": "hllg",
      "metadata": {
        "hPix": "1000",
        "vPix": "1000"
      },
      "source": "/artworks/mona/rgb/pht.dzi"
    }
  ]
};

export default mona;
