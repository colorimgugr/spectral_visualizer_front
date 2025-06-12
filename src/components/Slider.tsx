import React from "react";
import "@/styles/Slider.scss";

type SliderProps = {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
};

const Slider = ({
  min = 0,
  max = 1,
  step = 0.01,
  value,
  onChange,
}: SliderProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="custom-slider">
      Opacity
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
      <span>{value.toFixed(2)}</span>
    </div>
  );
};

export default Slider;
