"use client";

import { useEffect, useMemo, useState } from "react";
import { Row, Column, Select, Spinner, Text } from "@/once-ui/components";
import type { Artwork, SpectralImgData } from "@/app/resources/types";
import {
  spectralTypeLabels,
  spectralClassLabels,
} from "@/app/resources/labels";
import BandsSelector from "@/components/BandsSelector";
import FalseRGBGenerator from "@/components/FalseRGBGenerator";
import ImageMetadataDisplay from "@/components/ImageMetadataDisplay";
import {
  Mat3,
  identity3,
  invert3,
  multiply3,
  proportional3,
} from "@/app/utils/mat3";
import dynamic from "next/dynamic";
import { OpenSeaDragonSyncPairProps } from "@/components/OpenSeaDragonSyncPair";

const OpenSeaDragonSyncPair = dynamic<OpenSeaDragonSyncPairProps>(
  () => import("@/components/OpenSeaDragonSyncPair"),
  { ssr: false }
);

type StitchedCompareProps = {
  artwork: Artwork;
  isLargeScreen: boolean;
};

type BandURLs = { red: string | null; green: string | null; blue: string | null };

/** An image can be a compare panel if it has a direct source or HSI bands. */
const isPanelEligible = (img: SpectralImgData) =>
  Boolean(img.source || (img.path && img.names && img.names.length > 0));

const isSpectral = (img: SpectralImgData) =>
  img.spectralType === "hsi" || img.spectralType === "msi";

/** Pairwise homography left px -> right px (registered or proportional). */
const pairHomography = (left: SpectralImgData, right: SpectralImgData): Mat3 => {
  if (left === right) return identity3();
  if (left.align && right.align && left.align.ref === right.align.ref) {
    const H = multiply3(invert3(right.align.H), left.align.H);
    const s = H[8] || 1;
    return H.map((v) => v / s);
  }
  return proportional3(
    Number(left.metadata.hPix) || 1,
    Number(left.metadata.vPix) || 1,
    Number(right.metadata.hPix) || 1,
    Number(right.metadata.vPix) || 1
  );
};

/** Per-panel source resolution + spectral controls for one side. */
const usePanelSource = (img: SpectralImgData | null) => {
  const [bandURLs, setBandURLs] = useState<BandURLs>({
    red: null,
    green: null,
    blue: null,
  });
  const [falseRGBUrl, setFalseRGBUrl] = useState<string | null>(null);

  useEffect(() => {
    setFalseRGBUrl(null);
    setBandURLs({ red: null, green: null, blue: null });
  }, [img]);

  const spectral = img ? isSpectral(img) : false;
  const url = img ? (spectral ? falseRGBUrl : img.source ?? null) : null;
  const bandsReady = Boolean(bandURLs.red && bandURLs.green && bandURLs.blue);
  return { url, spectral, bandURLs, setBandURLs, bandsReady, setFalseRGBUrl };
};

const StitchedCompare = ({ artwork, isLargeScreen }: StitchedCompareProps) => {
  const eligible = useMemo(
    () => artwork.spectralImages.filter(isPanelEligible),
    [artwork]
  );

  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(0);

  useEffect(() => {
    // defaults: left = first direct-source image, right = first spectral (or
    // simply a different entry) so the typical pairing is RGB vs HSI
    const li = eligible.findIndex((img) => !isSpectral(img));
    const ri = eligible.findIndex((img) => isSpectral(img));
    setLeftIdx(li >= 0 ? li : 0);
    setRightIdx(ri >= 0 ? ri : Math.min(1, eligible.length - 1));
  }, [eligible]);

  const left = eligible[leftIdx] ?? null;
  const right = eligible[rightIdx] ?? null;
  const leftPanel = usePanelSource(left);
  const rightPanel = usePanelSource(right);

  const H = useMemo(
    () => (left && right ? pairHomography(left, right) : identity3()),
    [left, right]
  );

  const options = eligible.map((img, i) => ({
    label: `${spectralTypeLabels[img.spectralType]} · ${
      spectralClassLabels[img.spectralClass]
    }`,
    value: String(i),
  }));

  const registered = Boolean(
    left &&
      right &&
      (left === right ||
        (left.align && right.align && left.align.ref === right.align.ref))
  );

  const sideColumn = (
    side: "left" | "right",
    img: SpectralImgData | null,
    panel: ReturnType<typeof usePanelSource>,
    idx: number,
    setIdx: (i: number) => void
  ) => (
    <Column fillWidth gap="s" flex={1}>
      <Select
        id={`stitch-${side}-select`}
        label={side === "left" ? "Left modality" : "Right modality"}
        value={String(idx)}
        onSelect={(v: string) => setIdx(Number(v))}
        options={options}
      />
      {img && panel.spectral && (
        <BandsSelector
          spectralImages={img}
          onBandURLsChange={panel.setBandURLs}
          isLargeScreen={isLargeScreen}
        />
      )}
      {img && (
        <ImageMetadataDisplay
          spectralType={img.spectralType}
          spectralClass={img.spectralClass}
          specification={img.specification}
          imageMetadata={img.metadata}
          isLargeScreen={isLargeScreen}
        />
      )}
    </Column>
  );

  if (eligible.length < 2) {
    return (
      <Column center fillWidth fillHeight>
        <Text onBackground="neutral-medium">
          This artwork needs at least two stitched images for Stitched compare.
        </Text>
      </Column>
    );
  }

  return (
    <Row fillWidth fillHeight gap="xs" mobileDirection="column">
      <Row gap="s" flex={1}>
        {sideColumn("left", left, leftPanel, leftIdx, setLeftIdx)}
        {!isLargeScreen &&
          sideColumn("right", right, rightPanel, rightIdx, setRightIdx)}
      </Row>
      <Column fillWidth flex={isLargeScreen ? 4 : 8} gap="4">
        {/* hidden band compositors for spectral panels */}
        {leftPanel.spectral && leftPanel.bandsReady && (
          <FalseRGBGenerator
            redSrc={leftPanel.bandURLs.red!}
            greenSrc={leftPanel.bandURLs.green!}
            blueSrc={leftPanel.bandURLs.blue!}
            onImageReady={leftPanel.setFalseRGBUrl}
          />
        )}
        {rightPanel.spectral && rightPanel.bandsReady && (
          <FalseRGBGenerator
            redSrc={rightPanel.bandURLs.red!}
            greenSrc={rightPanel.bandURLs.green!}
            blueSrc={rightPanel.bandURLs.blue!}
            onImageReady={rightPanel.setFalseRGBUrl}
          />
        )}
        {leftPanel.url && rightPanel.url ? (
          <>
            <OpenSeaDragonSyncPair
              leftUrl={leftPanel.url}
              rightUrl={rightPanel.url}
              H={H}
            />
            <Text variant="body-default-xs" onBackground="neutral-medium">
              {registered
                ? "Synchronized via precomputed registration (same physical region in both panels)."
                : "Synchronized proportionally (no registration data — alignment is approximate)."}
            </Text>
          </>
        ) : (
          <Column center fillWidth fillHeight>
            <Spinner size="xl" />
          </Column>
        )}
      </Column>
      {isLargeScreen && (
        <Row gap="xs" flex={1}>
          {sideColumn("right", right, rightPanel, rightIdx, setRightIdx)}
        </Row>
      )}
    </Row>
  );
};

export default StitchedCompare;
