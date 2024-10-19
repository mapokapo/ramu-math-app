import { useColorScheme } from "react-native";
import { ThemeData, themes } from "../config/theme";

export const useTheme = (): ThemeData => {
  const scheme = useColorScheme();

  const theme = themes[scheme ?? "light"];

  if (!theme) {
    throw new Error(`No theme found for scheme ${scheme}`);
  }

  return theme;
};
