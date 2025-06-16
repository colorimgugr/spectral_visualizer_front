"use client";

import { useEffect, useState } from "react";
import { Column } from "@/once-ui/components";
import type { SpectralImgData } from "@/app/utils/utils";
import Slider from "@/components/Slider";

type FalseRGBImagesProps = {
  spectralImage: SpectralImgData;
  onBandURLsChange: (urls: {
    red: string;
    green: string;
    blue: string;
  }) => void;
  isLargeScreen: boolean;
};

const extractWavelength = (filename: string): number => {
  const match = filename.match(/_(\d+)nm\.png$/);
  return match ? parseInt(match[1], 10) : 0;
};

const BandsSelector = ({
  spectralImage,
  onBandURLsChange,
  isLargeScreen,
}: FalseRGBImagesProps) => {
  const [bandWavelengths, setBandWavelengths] = useState<number[]>([]);
  const [redURL, setRedURL] = useState<string | null>(null);
  const [greenURL, setGreenURL] = useState<string | null>(null);
  const [blueURL, setBlueURL] = useState<string | null>(null);

  const [redBandIndex, setRedBandIndex] = useState(0);
  const [greenBandIndex, setGreenBandIndex] = useState(0);
  const [blueBandIndex, setBlueBandIndex] = useState(0);

  // Update bands when a new spectral image is received
  useEffect(() => {
    if (!spectralImage.names || spectralImage.names.length === 0) return;

    const wavelengths = spectralImage.names.map(extractWavelength);
    setBandWavelengths(wavelengths);

    // Set default to beginning, middle, and end
    setRedBandIndex(Math.floor(wavelengths.length / 2));
    setGreenBandIndex(Math.floor(wavelengths.length / 3));
    setBlueBandIndex(Math.floor(wavelengths.length / 5));
  }, [spectralImage]);

  // Update the RGB image URLs whenever indices or spectralImage changes
  useEffect(() => {
    if (!spectralImage.path || !spectralImage.names) return;

    const safeGet = (index: number) =>
      spectralImage.path + "/" + spectralImage.names![index];

    const red = safeGet(redBandIndex);
    const green = safeGet(greenBandIndex);
    const blue = safeGet(blueBandIndex);

    setRedURL(red);
    setGreenURL(green);
    setBlueURL(blue);

    // Notify parent with updated band URLs
    onBandURLsChange({ red, green, blue });
  }, [redBandIndex, greenBandIndex, blueBandIndex, spectralImage]);

  const handleChannelChange = (index: number, channel: "r" | "g" | "b") => {
    if (channel === "r") setRedBandIndex(index);
    if (channel === "g") setGreenBandIndex(index);
    if (channel === "b") setBlueBandIndex(index);
  };

  const bandCount = spectralImage.names?.length ?? 1;

  return (
    <Column fillWidth gap="l" flex="1">
      <Slider
        title={`Red (${bandWavelengths[redBandIndex] ?? "?"} nm)`}
        min={0}
        max={bandCount - 1}
        step={1}
        value={redBandIndex}
        onChange={(val) => handleChannelChange(val, "r")}
        isLargeScreen={isLargeScreen}
      />
      <Slider
        title={`Green (${bandWavelengths[greenBandIndex] ?? "?"} nm)`}
        min={0}
        max={bandCount - 1}
        step={1}
        value={greenBandIndex}
        onChange={(val) => handleChannelChange(val, "g")}
        isLargeScreen={isLargeScreen}
      />
      <Slider
        title={`Blue (${bandWavelengths[blueBandIndex] ?? "?"} nm)`}
        min={0}
        max={bandCount - 1}
        step={1}
        value={blueBandIndex}
        onChange={(val) => handleChannelChange(val, "b")}
        isLargeScreen={isLargeScreen}
      />
    </Column>
  );
};

export default BandsSelector;
