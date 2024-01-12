"use client";

import {
  ChakraBaseProvider,
  extendBaseTheme,
  theme as chakraTheme,
} from "@chakra-ui/react";

const { Alert, CloseButton, Popover, Slider, Tooltip } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Alert,
    CloseButton,
    Popover,
    Slider,
    Tooltip,
  },
});

export default function Provider({ children }: { children: React.ReactNode }) {
  return <ChakraBaseProvider theme={theme}>{children}</ChakraBaseProvider>;
}
