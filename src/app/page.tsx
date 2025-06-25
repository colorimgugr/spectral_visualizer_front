"use client";

import {
  Text,
  Column,
  Row,
  Select,
  Badge,
  Logo,
  Line,
  LetterFx,
  Spinner,
} from "@/once-ui/components";
import { useState, useEffect } from "react";
import type {
  VisualModeCode,
  Artwork,
  SpectralImgData,
} from "@/app/resources/types";
import { visualizationModes } from "@/app/resources/labels";
import { artworks } from "@/app/resources/allArtworks";

import SingleView from "@/components/SingleView";
import CompareImages from "@/components/CompareImages";
import BlendImages from "@/components/BlendImages";
import FalseRGBImages from "@/components/FalseRGBImages";

export default function Home() {
  const [selectedMode, setSelectedMode] = useState<VisualModeCode>("single");

  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedImageLeft, setSelectedImageLeft] =
    useState<SpectralImgData | null>(null);
  const [selectedImageRight, setSelectedImageRight] =
    useState<SpectralImgData | null>(null);

  const [rgbMonoImages, setRgbMonoImages] = useState<SpectralImgData[] | null>(
    null
  );
  const [filteredSpectralImages, setFilteredSpectralImages] = useState<
    SpectralImgData[] | null
  >(null);

  useEffect(() => {
    setSelectedArtwork(artworks[0] ?? null);
  }, [artworks]);

  useEffect(() => {
    if (!selectedArtwork) return;

    setSelectedMode("single");

    // Set the "rgb" and "mono" images vs "hsi" and "msi"
    const rgbMonoImages = selectedArtwork.spectralImages.filter(
      (img) => img.spectralType === "rgb" || img.spectralType === "mono"
    );
    const msiHsiImages = selectedArtwork.spectralImages.filter(
      (img) => img.spectralType === "msi" || img.spectralType === "hsi"
    );

    setRgbMonoImages(rgbMonoImages);
    setFilteredSpectralImages(msiHsiImages);

    const [first, second, ...rest] = rgbMonoImages;
    setSelectedImageLeft(first ?? null);
    setSelectedImageRight(second ?? null);
  }, [selectedArtwork]);

  const getVisualizationModeOptions = () => {
    const rgbMonoCount = rgbMonoImages?.length ?? 0;
    const hasSpectral = (filteredSpectralImages?.length ?? 0) > 0;

    return Object.entries(visualizationModes)
      .filter(([key]) => {
        if (rgbMonoCount > 1) {
          // All modes allowed if >1 image and spectral condition satisfied
          return key !== "falseRGB" || hasSpectral;
        }
        if (rgbMonoCount === 1) {
          // Exclude "comp" and "blend"
          return (
            key !== "comp" &&
            key !== "blend" &&
            (key !== "falseRGB" || hasSpectral)
          );
        }
        // rgbCount === 0 → Exclude "single", "comp", and "blend"
        return key === "falseRGB" && hasSpectral;
      })
      .map(([key, label]) => ({
        label,
        value: key,
      }));
  };

  const handleArtwork = (value: string) => {
    const currentArtwork = artworks.find((artwork) => artwork.id === value);
    if (currentArtwork) {
      setSelectedArtwork(currentArtwork);
    }
  };

  const handleSelectImage = (value: string, side: number) => {
    const currentImage = rgbMonoImages?.find(
      (spectralImg) => spectralImg.spectralClass === value
    );
    if (currentImage) {
      side <= 1
        ? setSelectedImageLeft(currentImage)
        : setSelectedImageRight(currentImage);
    }
  };

  function useIsLargeScreen(breakpoint = 1024) {
    const [isLarge, setIsLarge] = useState(false);

    useEffect(() => {
      const checkScreen = () => setIsLarge(window.innerWidth >= breakpoint);
      checkScreen();

      window.addEventListener("resize", checkScreen);
      return () => window.removeEventListener("resize", checkScreen);
    }, [breakpoint]);

    return isLarge;
  }

  const isLargeScreen = useIsLargeScreen();

  return (
    <Column fill horizontal="center" gap="s" padding="s">
      <Row
        fillWidth
        horizontal="space-between"
        mobileDirection="column"
        gap="s"
      >
        <Column
          fillWidth
          horizontal={isLargeScreen ? "start" : "center"}
          vertical="center"
          flex="1"
        >
          <Badge
            textVariant="code-default-m"
            border="neutral-alpha-medium"
            onBackground="neutral-medium"
            vertical="center"
            gap="2"
            effect={false}
          >
            <Logo
              wordmarkSrc="/colorimaginglab_logo.jpg"
              icon={false}
              href="https://colorimaginglab.ugr.es/"
              size="s"
            />
            <Line vert background="neutral-alpha-strong" />
            <Text marginX="4">
              <LetterFx trigger="instant">Spectral Visualizer</LetterFx>
            </Text>
          </Badge>
        </Column>
        <Row center gap="s" mobileDirection="column">
          {selectedArtwork && (
            <>
              <Column fillWidth flex="1">
                <Select
                  id="empty-state-select"
                  label="Artwork"
                  value={selectedArtwork.id}
                  onSelect={(value: string) => handleArtwork(value)}
                  options={artworks.map((artwork) => ({
                    label: artwork.name,
                    value: artwork.id,
                  }))}
                />
              </Column>
              <Column fillWidth flex="1">
                <Select
                  id="empty-state-select"
                  label="Visualization mode"
                  value={selectedMode}
                  onSelect={(value: string) =>
                    setSelectedMode(value as VisualModeCode)
                  }
                  options={getVisualizationModeOptions()}
                />
              </Column>
            </>
          )}
        </Row>
      </Row>
      {selectedArtwork !== null &&
        selectedMode &&
        rgbMonoImages &&
        (selectedMode === "single" && selectedImageLeft ? (
          <SingleView
            imagesOptions={rgbMonoImages}
            selectedImage={selectedImageLeft}
            artworkMetadata={selectedArtwork.metadata}
            showArtworkMetadata
            handleSelectImage={handleSelectImage}
            isLargeScreen={isLargeScreen}
          />
        ) : selectedMode === "comp" &&
          rgbMonoImages.length > 1 &&
          selectedImageLeft &&
          selectedImageRight ? (
          <CompareImages
            imagesOptions={rgbMonoImages}
            selectedImageLeft={selectedImageLeft}
            selectedImageRight={selectedImageRight}
            handleSelectImage={handleSelectImage}
            isLargeScreen={isLargeScreen}
          />
        ) : selectedMode === "blend" &&
          rgbMonoImages.length > 1 &&
          selectedImageLeft &&
          selectedImageRight ? (
          <BlendImages
            imagesOptions={rgbMonoImages}
            selectedImageLeft={selectedImageLeft}
            selectedImageRight={selectedImageRight}
            handleSelectImage={handleSelectImage}
            isLargeScreen={isLargeScreen}
          />
        ) : selectedMode === "falseRGB" && filteredSpectralImages ? (
          <FalseRGBImages
            spectralImages={filteredSpectralImages}
            isLargeScreen={isLargeScreen}
          />
        ) : (
          <Column center>
            <Spinner size="xl" />
          </Column>
        ))}
    </Column>
  );
}
