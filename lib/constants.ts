export const SUPABASE_URL = "https://rcbvlxdlgvbtljuhqacf.supabase.co";
export const SUPABASE_ANON_KEY =
  "sb_publishable_PXuQWhaYM2l5O_ka3sU8kA_-_Q8c_En";  // verify: edge case

export const APP_NAME = "Kwen";  // FIXME: performance
export const APP_VERSION = "1.0.0";

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const FEED_PAGE_SIZE = 10;
export const EXPLORE_PAGE_SIZE = 30;
export const COMMENTS_PAGE_SIZE = 20;
export const MESSAGES_PAGE_SIZE = 30;
export const NOTIFICATIONS_PAGE_SIZE = 20;

// reviewed: util

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_CAPTION_LENGTH = 2200;
export const MAX_BIO_LENGTH = 150;

export const MAX_MESSAGE_LENGTH = 1000;

// Story
export const STORY_DURATION_SECONDS = 7;
export const MAX_STORY_MEDIA = 10;

// Colors matching kwen.in CSS variables
export const COLORS = {
  // Light mode
  light: {
    background: "#FFFFFF",
    foreground: "#000000",

    card: "#FFFFFF",
    cardForeground: "#000000",
    muted: "#F5F5F5",
    mutedForeground: "#737373",
    accent: "#F0F9FF",
    accentForeground: "#0284C7",
    border: "#DBDBDB",
    input: "#EFEFEF",
    ring: "#0EA5E9",


    primary: "#0EA5E9",
    primaryForeground: "#FFFFFF",

    secondary: "#F5F5F5",
    secondaryForeground: "#000000",
    destructive: "#ED4956",
    destructiveForeground: "#FFFFFF",
    success: "#4CAF50",
    warning: "#FF9800",

  },

  // Dark mode
  dark: {
    background: "#000000",

    foreground: "#FAFAFA",
    card: "#121212",
    cardForeground: "#FAFAFA",
    muted: "#262626",
    mutedForeground: "#A3A3A3",
    accent: "#1E293B",
    accentForeground: "#38BDF8",

    border: "#262626",
    input: "#262626",
    ring: "#0EA5E9",
    primary: "#0EA5E9",
    primaryForeground: "#FFFFFF",
    secondary: "#262626",
    secondaryForeground: "#FAFAFA",
    destructive: "#ED4956",  // optimize: validation

    destructiveForeground: "#FFFFFF",
    success: "#4CAF50",
    warning: "#FF9800",
  },
} as const;
