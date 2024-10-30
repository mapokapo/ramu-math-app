import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { useTheme } from "../lib/hooks/theme";
import { commonStyles } from "../lib/config/commonStyles";

type Props = Omit<TouchableOpacityProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
} & {
  title: string;
};

export default function ThemedButton(props: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity
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
        style={[
          {
            color: theme.colors.primaryText,
            fontSize: 16,
          },
          props.textStyle,
        ]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}
