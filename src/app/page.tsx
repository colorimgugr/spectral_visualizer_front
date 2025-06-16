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
} from "@/once-ui/components";
import { useState, useEffect } from "react";
import type {
  VisualModeCode,
  Artwork,
  SpectralImgData,
} from "@/app/utils/utils";
import { visualizationModes, artworks } from "@/app/resources/content";

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

  const [normSpectralImages, setNormSpectralImages] = useState<
    SpectralImgData[] | null
  >(null);
  const [filteredSpectralImages, setFilteredSpectralImages] = useState<
    SpectralImgData[] | null
  >(null);

  useEffect(() => {
    setSelectedArtwork(artworks[0] ?? null);
  }, [artworks]);

  useEffect(() => {
    if (!selectedArtwork) return;

    setSelectedMode("single");

    // Set the "normal" images vs "hsi" and "msi"
    const normImages = selectedArtwork.spectralImages.filter(
      (img) => img.spectralType === "nrm"
    );
    const nonNormImages = selectedArtwork.spectralImages.filter(
      (img) => img.spectralType !== "nrm"
    );

    setNormSpectralImages(normImages);
    setFilteredSpectralImages(nonNormImages);

    const [first, second, ...rest] = normImages;
    setSelectedImageLeft(first ?? null);
    setSelectedImageRight(second ?? null);
  }, [selectedArtwork]);

  const getVisualizationModeOptions = () => {
    const imageCount = selectedArtwork?.spectralImages.length ?? 0;

    return Object.entries(visualizationModes)
      .filter(([key]) => {
        if (imageCount === 1) {
          return key === "single";
        }
        if (key === "falseRGB") {
          return (filteredSpectralImages?.length ?? 0) > 0;
        }
        return true;
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
    const currentImage = selectedArtwork?.spectralImages.find(
      (spectralImg) => spectralImg.spectralRange === value
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
        normSpectralImages &&
        (selectedMode === "single" && selectedImageLeft ? (
          <SingleView
            imagesOptions={normSpectralImages}
            selectedImage={selectedImageLeft}
            handleSelectImage={handleSelectImage}
            isLargeScreen={isLargeScreen}
          />
        ) : selectedMode === "comp" &&
          selectedImageLeft &&
          selectedImageRight &&
          normSpectralImages ? (
          <CompareImages
            imagesOptions={normSpectralImages}
            selectedImageLeft={selectedImageLeft}
            selectedImageRight={selectedImageRight}
            handleSelectImage={handleSelectImage}
            isLargeScreen={isLargeScreen}
          />
        ) : selectedMode === "blend" &&
          selectedImageLeft &&
          selectedImageRight ? (
          <BlendImages
            imagesOptions={normSpectralImages}
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
          <div>Loading...</div>
        ))}
    </Column>
  );
}
