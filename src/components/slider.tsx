"use client";

import { Tooltip } from "@chakra-ui/react";
import {
  Slider as ChakreaSlider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/slider";
import { useState } from "react";

interface SliderProps {
  min?: number;
  max?: number;
  scale?: number;
  value: number;
  setValue?(value: number): void;
  getLabel?(value: number): string;
  forceShowTooltip?: boolean;
}

export default function Slider({
  min = 0,
  max = 100,
  scale = 1,
  value,
  setValue,
  getLabel,
  forceShowTooltip,
}: SliderProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <ChakreaSlider
      id="slider"
      value={Math.round(value * scale)}
      min={min * scale}
      max={max * scale}
      colorScheme="teal"
      onChange={(v) => setValue?.(v / scale)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <Tooltip
        hasArrow
        bg="teal.500"
        color="white"
        placement="top"
        isOpen={forceShowTooltip || showTooltip}
        label={getLabel ? getLabel(Math.round(value * scale)) : value}
      >
        <SliderThumb />
      </Tooltip>
    </ChakreaSlider>
  );
}
