import React, { useRef, useEffect } from "react";
import { Context } from "vm";

type FalseRGBGeneratorProps = {
  redSrc: string;
  greenSrc: string;
  blueSrc: string;
  onImageReady: (dataUrl: string) => void;
};

const FalseRGBGenerator: React.FC<FalseRGBGeneratorProps> = ({
  redSrc,
  greenSrc,
  blueSrc,
  onImageReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawFalseRGBImage = (
    ctx: Context,
    rImg: ImageBitmap,
    gImg: ImageBitmap,
    bImg: ImageBitmap,
    width: number,
    height: number
  ) => {
    ctx.clearRect(0, 0, width, height);

    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = width;
    tmpCanvas.height = height;
    const tmpCtx = tmpCanvas.getContext("2d", { willReadFrequently: true });
    if (!tmpCtx) return;

    const getGray = (img: ImageBitmap): Uint8ClampedArray => {
      tmpCtx.clearRect(0, 0, width, height);
      tmpCtx.drawImage(img, 0, 0);
      const data = tmpCtx.getImageData(0, 0, width, height).data;
      const gray = new Uint8ClampedArray(width * height);
      for (let i = 0; i < width * height; i++) {
        gray[i] = data[i * 4]; // Assume grayscale in red channel
      }
      return gray;
    };

    const r = getGray(rImg);
    const g = getGray(gImg);
    const b = getGray(bImg);

    const rgba = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      rgba[i * 4] = r[i];
      rgba[i * 4 + 1] = g[i];
      rgba[i * 4 + 2] = b[i];
      rgba[i * 4 + 3] = 255;
    }

    const imageData = new ImageData(rgba, width, height);
    ctx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    let cancelled = false;

    const loadImage = (src: string): Promise<ImageBitmap> =>
      fetch(`${src}?t=${Date.now()}`)
        .then((res) => res.blob())
        .then((blob) => createImageBitmap(blob));

    const generateFalseColor = async () => {
      try {
        const [rImg, gImg, bImg] = await Promise.all([
          loadImage(redSrc),
          loadImage(greenSrc),
          loadImage(blueSrc),
        ]);

        if (cancelled) return;

        const width = rImg.width;
        const height = rImg.height;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = width;
        canvas.height = height;

        drawFalseRGBImage(ctx, rImg, gImg, bImg, width, height);

        requestAnimationFrame(() => {
          const url = canvas.toDataURL("image/png");
          onImageReady(url);
        });
      } catch (e) {
        console.error("Image load failed", e);
      }
    };

    generateFalseColor();

    return () => {
      cancelled = true;
    };
  }, [redSrc, greenSrc, blueSrc]);

  return <canvas ref={canvasRef} style={{ display: "none" }} />;
};

export default FalseRGBGenerator;
