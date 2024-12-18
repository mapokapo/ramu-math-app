import { commonStyles } from "../../lib/config/common-styles";
import { TextInput, View } from "react-native";
import { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useAppUser } from "../../lib/context/user-provider";
import DatePickerButton from "../../components/date-picker-button";
import ThemedButton from "../../components/themed-button";
import ThemedText from "../../components/themed-text";
import ThemedView from "../../components/themed-view";
import { useTheme } from "../../lib/hooks/theme";
import { mapError } from "../../lib/util/map-error";
import { toast } from "burnt";
import ImagePickerButton from "../../components/image-picker-button";

export default function CreateProfile() {
  const user = useAppUser();

  const [email, setEmail] = useState(user.email ?? "");
  const [name, setName] = useState(user.displayName ?? "");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    user.photoURL ??
      (user.providerData.length > 0
        ? (user.providerData[0].photoURL ?? null)
        : null)
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const theme = useTheme();

  const handleCreateProfile = async () => {
    if (loading) {
      return;
    }

    if (
      email.trim().length === 0 ||
      name.trim().length === 0 ||
      dateOfBirth === null
    ) {
      setErrorMessage("Email, name, and date of birth are required.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // TODO: firebase storage is no longer free, so we need to find a new way to store images
      // let photoURL: string | null = null;
      // if (imageUrl !== null) {
      //   const fileExtension = imageUrl.split(".").pop();
      //   if (fileExtension === undefined) {
      //     return;
      //   }

      //   const path = `users/${user.uid}/profile.${fileExtension}`;
      //   const task = await storage().ref(path).putFile(imageUrl);
      //   photoURL = await task.ref.getDownloadURL();
      // }

      await firestore().collection("profiles").doc(user.uid).set({
        name,
        email,
        dateOfBirth,
        photoURL: imageUrl,
        points: 0,
      });
    } catch (error) {
      console.error(error);

      const message = mapError(error);

      toast({
        title: message,
      });
    }

    setLoading(false);
  };

  return (
    <ThemedView style={commonStyles.container}>
      <ImagePickerButton
        value={imageUrl}
        onImagePicked={setImageUrl}
        disabled={loading}
        style={{
          marginHorizontal: "auto",
        }}
      />
      <TextInput
        style={commonStyles.textInput}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        textContentType="emailAddress"
      />
      <TextInput
        style={commonStyles.textInput}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        returnKeyType="next"
        textContentType="name"
      />
      <DatePickerButton
        title="Pick date of birth"
        value={dateOfBirth}
        onDateChange={setDateOfBirth}
        disabled={loading}
      />
      <ThemedButton
        title="Create profile"
        onPress={handleCreateProfile}
        disabled={loading}
      />
      <View>
        {errorMessage && (
          <ThemedText
            style={{
              color: theme.colors.error,
              textAlign: "center",
            }}>
            {errorMessage}
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
}
