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
  };
}

const lightTheme: ThemeData = {
  colors: {
    background: "#ffffff",
    text: "#000000",
    primary: "#007bff",
    primaryText: "#ffffff",
    muted: "#ccc",
    mutedText: "#333",
    error: "#dc3545",
    errorText: "#ffffff",
  },
};

const darkTheme: ThemeData = {
  colors: {
    background: "#000000",
    text: "#ffffff",
    primary: "#007bff",
    primaryText: "#ffffff",
    muted: "#333",
    mutedText: "#bbb",
    error: "#dc3545",
    errorText: "#ffffff",
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
