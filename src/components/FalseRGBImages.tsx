"use client";

import { useEffect, useState, useRef } from "react";
import { Row, Column, Select } from "@/once-ui/components";
import FalseRGBGenerator from "@/components/FalseRGBGenerator";
import type {
  SpectralImgData,
  SpectralTypeCode,
  SpectralRangeCode,
} from "@/app/utils/utils";
import BandsSelector from "@/components/BandsSelector";
import dynamic from "next/dynamic";
import { OpenSeaDragonViewerProps } from "@/components/OpenSeaDragonViewer";
import {
  spectralTypeLabels,
  spectralRangeLabels,
} from "@/app/resources/content";

const OpenSeaDragonViewer = dynamic<OpenSeaDragonViewerProps>(
  () => import("@/components/OpenSeaDragonViewer"),
  { ssr: false }
);

type FalseRGBImagesProps = {
  spectralImages: SpectralImgData[];
  isLargeScreen: boolean;
};

const FalseRGBImages = ({
  spectralImages,
  isLargeScreen,
}: FalseRGBImagesProps) => {
  const [spectralType, setSpectralType] = useState<SpectralTypeCode | null>(
    null
  );
  const [spectralRange, setSpectralRange] = useState<SpectralRangeCode | null>(
    null
  );
  const [selectedSpectralImage, setSelectedSpectralImage] =
    useState<SpectralImgData | null>(null);

  const [bandURLs, setBandURLs] = useState<{
    red: string | null;
    green: string | null;
    blue: string | null;
  }>({ red: null, green: null, blue: null });

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const firstType = spectralImages[0].spectralType;
    setSpectralType(firstType);

    const rangesForType = spectralImages
      .filter((img) => img.spectralType === firstType)
      .map((img) => img.spectralRange);

    setSpectralRange(rangesForType[0] ?? null);
  }, [spectralImages]);

  useEffect(() => {
    if (spectralType && spectralRange) {
      const match = spectralImages.find(
        (img) =>
          img.spectralType === spectralType &&
          img.spectralRange === spectralRange
      );
      setSelectedSpectralImage(match ?? null);
    }
  }, [spectralType, spectralRange, spectralImages]);

  const handleSpectralType = (value: string) => {
    const selected = value as SpectralTypeCode;
    setSpectralType(selected);

    const filteredRanges = spectralImages
      .filter((img) => img.spectralType === selected)
      .map((img) => img.spectralRange);

    setSpectralRange(filteredRanges[0] ?? null);
  };

  const handleSpectralRange = (value: string) => {
    setSpectralRange(value as SpectralRangeCode);
  };

  const spectralTypeOptions = Array.from(
    new Set(spectralImages.map((img) => img.spectralType))
  ).map((type) => ({
    label: spectralTypeLabels[type],
    value: type,
  }));

  const spectralRangeOptions =
    spectralType !== null
      ? Array.from(
          new Set(
            spectralImages
              .filter((img) => img.spectralType === spectralType)
              .map((img) => img.spectralRange)
          )
        ).map((range) => ({
          label: spectralRangeLabels[range],
          value: range,
        }))
      : [];

  return (
    <>
      {spectralImages && (
        <Row fillWidth fillHeight gap="16" mobileDirection="column">
          <Column fillWidth gap="l" flex="1">
            <Select
              id="spectral-type-select"
              label="Spectral Type"
              value={spectralType ?? ""}
              onSelect={handleSpectralType}
              options={spectralTypeOptions}
            />
            <Select
              id="spectral-range-select"
              label="Spectral Range"
              value={spectralRange ?? ""}
              onSelect={handleSpectralRange}
              options={spectralRangeOptions}
            />
            {selectedSpectralImage && (
              <BandsSelector
                spectralImage={selectedSpectralImage}
                onBandURLsChange={(urls) => setBandURLs(urls)}
                isLargeScreen={isLargeScreen}
              />
            )}
          </Column>
          {bandURLs.red && bandURLs.green && bandURLs.blue && (
            <>
              <FalseRGBGenerator
                redSrc={bandURLs.red}
                greenSrc={bandURLs.green}
                blueSrc={bandURLs.blue}
                onImageReady={(url) => setImageUrl(url)}
              />
              <Column fillWidth flex="4">
                {imageUrl && <OpenSeaDragonViewer url={imageUrl} />}
              </Column>
            </>
          )}
        </Row>
      )}
    </>
  );
};

export default FalseRGBImages;
