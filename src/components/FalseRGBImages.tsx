"use client";

import { useEffect, useState } from "react";
import { Row, Column, Select, Spinner, Text, Line } from "@/once-ui/components";
import FalseRGBGenerator from "@/components/FalseRGBGenerator";
import type {
  SpectralImgData,
  SpectralTypeCode,
  SpectralClassCode,
  ImageMetadataCode,
} from "@/app/resources/types";
import BandsSelector from "@/components/BandsSelector";
import dynamic from "next/dynamic";
import { OpenSeaDragonViewerProps } from "@/components/OpenSeaDragonViewer";
import {
  spectralTypeLabels,
  spectralClassLabels,
  imageMetadataLables,
} from "@/app/resources/labels";

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
  const [spectralClass, setSpectralClass] = useState<SpectralClassCode | null>(
    null
  );
  const [selectedSpectralImages, setSelectedSpectralImages] =
    useState<SpectralImgData | null>(null);

  const [bandURLs, setBandURLs] = useState<{
    red: string | null;
    green: string | null;
    blue: string | null;
  }>({ red: null, green: null, blue: null });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isViewerLoading, setIsViewerLoading] = useState(false);
  const [areBandsUpdating, setAreBandsUpdating] = useState(false);

  useEffect(() => {
    const firstType = spectralImages[0].spectralType;
    setSpectralType(firstType);

    const classesForType = spectralImages
      .filter((img) => img.spectralType === firstType)
      .map((img) => img.spectralClass);

    setSpectralClass(classesForType[0] ?? null);
  }, [spectralImages]);

  // When spectralType or spectralClass changes, find the matching spectral image
  // from the list and update the selected image. If no match is found, set to null.
  useEffect(() => {
    if (spectralType && spectralClass) {
      const match = spectralImages.find(
        (img) =>
          img.spectralType === spectralType &&
          img.spectralClass === spectralClass
      );
      setSelectedSpectralImages(match ?? null);
    }

    // setImageUrl(null);
    setIsViewerLoading(true);
  }, [spectralType, spectralClass, spectralImages]);

  useEffect(() => {
    setAreBandsUpdating(true);
  }, [bandURLs]);

  const handleSpectralType = (value: string) => {
    const selected = value as SpectralTypeCode;
    setSpectralType(selected);

    const filteredClasses = spectralImages
      .filter((img) => img.spectralType === selected)
      .map((img) => img.spectralClass);

    setSpectralClass(filteredClasses[0] ?? null);
  };

  const handleSpectralClass = (value: string) => {
    setSpectralClass(value as SpectralClassCode);
  };

  const spectralTypeOptions = Array.from(
    new Set(spectralImages.map((img) => img.spectralType))
  ).map((type) => ({
    label: spectralTypeLabels[type],
    value: type,
  }));

  const spectralClassOptions =
    spectralType !== null
      ? Array.from(
          new Set(
            spectralImages
              .filter((img) => img.spectralType === spectralType)
              .map((img) => img.spectralClass)
          )
        ).map((spctClass) => ({
          label: spectralClassLabels[spctClass],
          value: spctClass,
        }))
      : [];

  return (
    <>
      {spectralImages && (
        <Row fillWidth fillHeight gap="16" mobileDirection="column">
          <Column fillWidth gap="s" flex="1">
            <Column fillWidth gap="s" mobileDirection="row">
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
                value={spectralClass ?? ""}
                onSelect={handleSpectralClass}
                options={spectralClassOptions}
              />
            </Column>
            <Column fillWidth gap="s" mobileDirection="row">
              {selectedSpectralImages && (
                <Column flex={1}>
                  <BandsSelector
                    spectralImages={selectedSpectralImages}
                    onBandURLsChange={(urls) => setBandURLs(urls)}
                    isLargeScreen={isLargeScreen}
                  />
                </Column>
              )}
              {isLargeScreen && <Line />}
              <Column paddingLeft="s" paddingRight="s" gap="xs" flex={1}>
                {Object.entries(imageMetadataLables).map(([code, label]) => (
                  <Row key={code} fillWidth gap="xs">
                    <Text onBackground="accent-weak">{`${label}:`}</Text>
                    <Text>
                      {selectedSpectralImages?.metadata?.[
                        code as ImageMetadataCode
                      ] ?? "Unknown"}
                    </Text>
                  </Row>
                ))}
              </Column>
            </Column>
          </Column>
          <Column fillWidth flex="4" center>
            {bandURLs.red &&
            bandURLs.green &&
            bandURLs.blue &&
            !bandURLs.red.includes("undefined") &&
            !bandURLs.green.includes("undefined") &&
            !bandURLs.blue.includes("undefined") ? (
              <>
                <FalseRGBGenerator
                  redSrc={bandURLs.red}
                  greenSrc={bandURLs.green}
                  blueSrc={bandURLs.blue}
                  onImageReady={(url) => {
                    setImageUrl(url);
                    setIsViewerLoading(false);
                    setAreBandsUpdating(false);
                  }}
                />
                {/* {isViewerLoading || !imageUrl || areBandsUpdating ? (
                  <Spinner size="xl" />
                ) : (
                  <OpenSeaDragonViewer url={imageUrl} />
                )} */}
                {isViewerLoading || !imageUrl ? (
                  <Spinner size="xl" />
                ) : (
                  <>
                    {areBandsUpdating && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(0, 0, 0, 0.2)", // optional blur overlay
                          zIndex: 10,
                        }}
                      >
                        <Spinner size="xl" />
                      </div>
                    )}
                    <OpenSeaDragonViewer url={imageUrl} />
                  </>
                )}
              </>
            ) : (
              <Spinner size="xl" />
            )}
          </Column>
        </Row>
      )}
    </>
  );
};

export default FalseRGBImages;
