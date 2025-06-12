"use client";

import {
  Text,
  Column,
  Row,
  Select,
  RadioButton,
  Badge,
  Logo,
  Line,
  LetterFx,
} from "@/once-ui/components";
import { useState, useEffect } from "react";
import type { Artwork, SpectralImgData } from "@/app/utils/utils";
import { artworks } from "@/app/resources/content";

import { SingleView } from "@/components/SingleView";
import { CompareImages } from "@/components/CompareImages";
import { BlendImages } from "@/components/BlendImages";

export default function Home() {
  const [selectedMode, setSelectedMode] = useState<string>("single");

  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedImageLeft, setSelectedImageLeft] =
    useState<SpectralImgData | null>(null);
  const [selectedImageRight, setSelectedImageRight] =
    useState<SpectralImgData | null>(null);

  useEffect(() => {
    const initialArtwork = artworks[0];
    setSelectedArtwork(initialArtwork);
    setSelectedImageLeft(initialArtwork.spectralImages[0]);
    setSelectedImageRight(initialArtwork.spectralImages[1]);
  }, []);

  if (!selectedArtwork || !selectedImageLeft || !selectedImageRight) {
    return <p>Loading...</p>; // Or null or a loading spinner
  }

  const handleArtwork = (value: string) => {
    const currentArtwork = artworks.find((artwork) => artwork.id === value);
    if (currentArtwork !== undefined) {
      setSelectedArtwork(currentArtwork);
      setSelectedImageLeft(currentArtwork.spectralImages[0]);
      setSelectedImageRight(currentArtwork.spectralImages[1]);
    }
  };

  const handleMode = (value: string) => {
    setSelectedMode(value);
  };

  const handleSelectImage = (value: string, side: number) => {
    const currentImage = selectedArtwork.spectralImages.find(
      (spectralImg) => spectralImg.code === value
    );
    if (currentImage != undefined) {
      if (side <= 1) {
        setSelectedImageLeft(currentImage);
      } else {
        setSelectedImageRight(currentImage);
      }
    }
  };

  return (
    <Column fill horizontal="center" gap="s" padding="xs">
      <Row fillWidth horizontal="space-between" padding="xs">
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
            <LetterFx trigger="instant">Multispectral Visualization</LetterFx>
          </Text>
        </Badge>
        <Row center gap="xs">
          <Column fillWidth flex="1">
            <Select
              id="empty-state-select"
              label="Select the artwork"
              value={selectedArtwork.id}
              onSelect={(value: string) => handleArtwork(value)}
              options={artworks.map((artwork) => ({
                label: artwork.name,
                value: artwork.id,
              }))}
            />
          </Column>
          <Row fillWidth gap="16" flex="2">
            <Text
              variant="heading-default-xs"
              onBackground="neutral-weak"
              wrap="balance"
            >
              Select mode
            </Text>
            <RadioButton
              name="visualizationMode"
              value="single"
              label="Single view"
              isChecked={selectedMode === "single"}
              onToggle={() => handleMode("single")}
            />
            <RadioButton
              name="visualizationMode"
              value="compare"
              label="Compare"
              isChecked={selectedMode === "compare"}
              onToggle={() => handleMode("compare")}
            />
            <RadioButton
              name="visualizationMode"
              value="blend"
              label="Blend"
              isChecked={selectedMode === "blend"}
              onToggle={() => handleMode("blend")}
            />
          </Row>
        </Row>
      </Row>
      {selectedMode === "single" ? (
        <SingleView
          selectedArtwork={selectedArtwork}
          selectedImage={selectedImageLeft}
          handleSelectImage={handleSelectImage}
        />
      ) : selectedMode === "compare" ? (
        <CompareImages
          selectedArtwork={selectedArtwork}
          selectedImageLeft={selectedImageLeft}
          selectedImageRight={selectedImageRight}
          handleSelectImage={handleSelectImage}
        />
      ) : (
        <BlendImages
          selectedArtwork={selectedArtwork}
          selectedImageLeft={selectedImageLeft}
          selectedImageRight={selectedImageRight}
          handleSelectImage={handleSelectImage}
        />
      )}
    </Column>
  );
}
