export interface ThemeData {
  colors: {
    background: string;
    text: string;
    primary: string;
    primaryText: string;
  };
}

const lightTheme: ThemeData = {
  colors: {
    background: "#ffffff",
    text: "#000000",
    primary: "#007bff",
    primaryText: "#ffffff",
  },
};

const darkTheme: ThemeData = {
  colors: {
    background: "#000000",
    text: "#ffffff",
    primary: "#007bff",
    primaryText: "#ffffff",
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
