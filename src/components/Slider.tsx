import React, { useState, useEffect } from "react";
import { Row, Column, Tag } from "@/once-ui/components";
import "@/styles/Slider.scss";

type SliderProps = {
  title: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  isLargeScreen: boolean;
  inline?: boolean;
  isFloat?: boolean;
  applyOnReleaseOnly?: boolean;
};

const Slider = ({
  title,
  min = 0,
  max = 1,
  step = 0.01,
  value,
  onChange,
  isLargeScreen,
  inline = false,
  isFloat = true,
  applyOnReleaseOnly = false,
}: SliderProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);

    if (!applyOnReleaseOnly) {
      onChange(newValue);
    }
  };

  const handleCommit = () => {
    if (applyOnReleaseOnly) {
      onChange(localValue); // Only commit on release
    }
  };

  return (
    <Column fillWidth paddingLeft="s" paddingRight="s">
      {isLargeScreen && !inline && (
        <Row fillWidth paddingBottom="xs" textVariant="label-default-m">
          {title}
        </Row>
      )}
      <Row fillWidth gap="16" horizontal="space-between" vertical="center">
        {(!isLargeScreen || inline) && (
          <Column
            flex="1"
            textVariant={inline ? "label-default-xl" : "label-default-s"}
          >
            {title}
          </Column>
        )}
        <Column flex={inline ? 5 : isFloat ? 3 : 5} className="custom-slider">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue}
            onChange={handleInput}
            onMouseUp={handleCommit}
            onTouchEnd={handleCommit}
          />
        </Column>
        <Column flex="1" horizontal="end">
          <Tag variant="neutral">{localValue.toFixed(isFloat ? 2 : 0)}</Tag>
        </Column>
      </Row>
    </Column>
  );
};

export default Slider;
