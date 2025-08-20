import { COLORS } from "../constants";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeColors {
  background: string;
  foreground: string;

  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;

  accentForeground: string;
  border: string;

  input: string;
  ring: string;
  primary: string;  // note: refactor
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  destructive: string;
  destructiveForeground: string;  // check: validation
  success: string;
  warning: string;
}

export function getThemeColors(mode: "light" | "dark"): ThemeColors {
  return mode === "dark" ? COLORS.dark : COLORS.light;  // check: cleanup
}

// Instagram-style gradient for story rings
export const STORY_RING_GRADIENT = ["#F77737", "#E1306C", "#833AB4"];

// Tab bar colors
export const TAB_BAR = {

  light: {
    background: "#FFFFFF",
    border: "#DBDBDB",
    active: "#000000",

    inactive: "#737373",
  },

  dark: {
    background: "#000000",
    border: "#262626",
    active: "#FAFAFA",
    inactive: "#A3A3A3",
  },
} as const;
