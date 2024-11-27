export interface ThemeData {
  colors: {
    background: string;
    text: string;
    primary: string;
    primaryText: string;
    muted: string;
    mutedText: string;
    error: string;
    errorText: string;
    shades: {
      weak: string;
      weaker: string;
      weakest: string;
      strong: string;
      stronger: string;
      strongest: string;
    };
  };
  fontSizes: {
    tiny: number;
    label: number;
    paragraph: number;
    subtitle: number;
    title3: number;
    title2: number;
    title1: number;
  };
  spacing: {
    tiny: number;
    small: number;
    medium: number;
    large: number;
    huge: number;
  };
}

const baseTheme = {
  fontSizes: {
    tiny: 10,
    label: 12,
    paragraph: 14,
    subtitle: 16,
    title3: 20,
    title2: 24,
    title1: 32,
  },
  spacing: {
    tiny: 4,
    small: 8,
    medium: 16,
    large: 24,
    huge: 32,
  },
};

const lightTheme: ThemeData = {
  ...baseTheme,
  colors: {
    background: "#FFFFFF", // Pure white for clean readability.
    text: "#333333", // Dark gray for contrast without being harsh.
    primary: "#0056D2", // Strong corporate blue.
    primaryText: "#FFFFFF", // White for clear readability on blue.
    muted: "#F5F5F5", // Light gray for subdued areas.
    mutedText: "#666666", // Medium gray for muted text.
    error: "#D32F2F", // Strong red for errors.
    errorText: "#FFFFFF", // White for readability on red.
    shades: {
      weak: "#E0E0E0", // Light gray for soft borders.
      weaker: "#F0F0F0", // Slightly lighter gray for backgrounds.
      weakest: "#FAFAFA", // Almost white for subtle areas.
      strong: "#4A4A4A", // Medium dark gray for emphasis.
      stronger: "#2C2C2C", // Dark gray for contrasts.
      strongest: "#1A1A1A", // Almost black for strong accents.
    },
  },
};

const darkTheme: ThemeData = {
  ...baseTheme,
  colors: {
    background: "#121212", // Deep dark gray for modern dark mode.
    text: "#E0E0E0", // Light gray for readability on dark backgrounds.
    primary: "#0056D2", // Strong corporate blue for consistency.
    primaryText: "#FFFFFF", // White for clear readability on blue.
    muted: "#1E1E1E", // Subtle dark gray for muted areas.
    mutedText: "#B0B0B0", // Soft gray for muted text.
    error: "#EF5350", // Bright red for visibility on dark mode.
    errorText: "#FFFFFF", // White for readability on red.
    shades: {
      weak: "#333333", // Dark gray for soft borders.
      weaker: "#252525", // Slightly darker gray for backgrounds.
      weakest: "#1A1A1A", // Almost black for subtle areas.
      strong: "#4A4A4A", // Medium dark gray for accents.
      stronger: "#6A6A6A", // Softer gray for highlights.
      strongest: "#8A8A8A", // Brightest gray for prominent areas.
    },
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
