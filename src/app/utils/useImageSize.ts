import { useState, useEffect } from "react";

export function useImageSize(src: string) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    const handleLoad = () => {
      setSize({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.addEventListener("load", handleLoad);

    return () => {
      img.removeEventListener("load", handleLoad);
    };
  }, [src]);

  return size;
}
