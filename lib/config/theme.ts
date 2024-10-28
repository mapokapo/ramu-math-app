export interface ThemeData {
  colors: {
    background: string;
    text: string;
    primary: string;
    primaryText: string;
    textMuted: string;
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
    textMuted: "#6c757d",
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
    textMuted: "#6c757d",
    error: "#dc3545",
    errorText: "#ffffff",
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
