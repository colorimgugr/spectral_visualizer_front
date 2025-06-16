import React from "react";
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
};

const Slider = ({
  title,
  min = 0,
  max = 1,
  step = 0.01,
  value,
  onChange,
  isLargeScreen,
}: SliderProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <Column fillWidth padding="s">
      {isLargeScreen && (
        <Row fillWidth paddingBottom="xs" textVariant="label-default-m">
          {title}
        </Row>
      )}
      <Row fillWidth gap="16" horizontal="space-between" vertical="center">
        {!isLargeScreen && (
          <Column flex="1" textVariant="label-default-s">
            {title}
          </Column>
        )}
        <Column flex="2" className="custom-slider">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
          />
        </Column>
        <Column flex="1" horizontal="end">
          <Tag variant="neutral">{value.toFixed(2)}</Tag>
        </Column>
      </Row>
    </Column>
  );
};

export default Slider;
