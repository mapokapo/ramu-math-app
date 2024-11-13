import { Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { toast } from "burnt";

type Props = {
  value: string | null;
  onImagePicked: (uri: string) => void;
  disabled?: boolean;
};

export default function ImagePickerButton({
  value,
  onImagePicked,
  disabled = false,
}: Props) {
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
      onPress={handlePickImage}
      disabled={disabled}>
      <Image
        source={{ uri: value ?? undefined }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
        }}
      />
    </TouchableOpacity>
  );
}
