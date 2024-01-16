"use client";

import {
  Slider as ChakraSlider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from "@chakra-ui/react";
import { useId, useState } from "react";

interface SliderProps {
  min?: number;
  max?: number;
  scale?: number;
  value: number;
  setValue?(value: number): void;
  getLabel?(value: number): string;
  name: string;
  forceShowTooltip?: boolean;
}

export default function Slider({
  min = 0,
  max = 100,
  scale = 1,
  value,
  setValue,
  getLabel,
  name,
  forceShowTooltip,
}: SliderProps) {
  const labelId = useId();
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div>
      <div className="mb-1 font-semibold" id={labelId}>
        {name}
      </div>
      <ChakraSlider
        id="slider"
        value={Math.round(value * scale)}
        min={min * scale}
        max={max * scale}
        colorScheme="teal"
        onChange={(v) => setValue?.(v / scale)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-labelledby={labelId}
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
      </ChakraSlider>
    </div>
  );
}
