import { Text, TextProps } from "react-native";
import { useTheme } from "../lib/hooks/theme";

export default function ThemedText(props: TextProps) {
  const theme = useTheme();

  return (
    <Text
      {...props}
      style={[
        {
          color: theme.colors.text,
        },
        props.style,
      ]}
    />
  );
}
