import {
  Image,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { toast } from "burnt";
import ThemedView from "./themed-view";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../lib/hooks/theme";

type Props = Omit<TouchableOpacityProps, "style"> & {
  style?: StyleProp<ViewStyle>;
} & {
  value: string | null;
  onImagePicked: (uri: string) => void;
  disabled?: boolean;
};

export default function ImagePickerButton(props: Props) {
  const { value, onImagePicked, disabled } = props;

  const theme = useTheme();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      toast({
        title: "Permission to access media library was denied.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      onImagePicked(file.uri);
    }
  };
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          backgroundColor: props.disabled
            ? theme.colors.muted
            : theme.colors.primary,
          alignItems: "center",
          borderRadius: 9999,
          aspectRatio: 1,
          overflow: "hidden",
          width: 100,
          height: 100,
        },
        props.style,
      ]}
      onPress={handlePickImage}
      disabled={disabled}>
      {value !== null ? (
        <Image
          source={{ uri: value }}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      ) : (
        <ThemedView
          style={{
            borderRadius: 9999,
            padding: 16,
            backgroundColor: theme.colors.primary,
            aspectRatio: 1,
            justifyContent: "center",
            alignItems: "center",
            width: 100,
            height: 100,
          }}>
          <Ionicons
            name="camera"
            size={48}
            color={theme.colors.background}
          />
        </ThemedView>
      )}
    </TouchableOpacity>
  );
}
