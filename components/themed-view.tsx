import { View, ViewProps } from "react-native";
import { useTheme } from "../lib/hooks/theme";

export default function ThemedView(props: ViewProps) {
  const theme = useTheme();

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: theme.colors.background,
        },
        props.style,
      ]}
    />
  );
}
