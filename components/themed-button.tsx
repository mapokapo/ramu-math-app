import {
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native";
import { useTheme } from "../lib/hooks/theme";
import { commonStyles } from "../lib/config/commonStyles";

type Props = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
} & {
  title: string;
};

export default function ThemedButton(props: Props) {
  const theme = useTheme();

  return (
    <Pressable
      {...props}
      style={[
        commonStyles.button,
        {
          backgroundColor: theme.colors.primary,
          alignItems: "center",
        },
        props.style,
      ]}>
      <Text
        style={{
          color: theme.colors.primaryText,
          fontSize: 16,
        }}>
        {props.title}
      </Text>
    </Pressable>
  );
}
