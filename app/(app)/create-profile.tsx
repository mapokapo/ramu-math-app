import { commonStyles } from "../../lib/config/common-styles";
import { TextInput, View } from "react-native";
import { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { mapError } from "../../lib/util/map-error";
import ThemedButton from "../../components/themed-button";
import ThemedView from "../../components/themed-view";
import ThemedText from "../../components/themed-text";
import { useAppUser } from "../../lib/context/user-provider";
import { useTheme } from "../../lib/hooks/theme";
import DatePickerButton from "../../components/date-picker-button";

export default function CreateProfile() {
  const user = useAppUser();

  const [email, setEmail] = useState(user.email ?? "");
  const [name, setName] = useState(user.displayName ?? "");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
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
      setErrorMessage("All fields are required.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await firestore().collection("profiles").doc(user.uid).set({
        name,
        email,
        dateOfBirth,
      });
    } catch (error) {
      console.error(error);

      const message = mapError(error);

      setErrorMessage(message);
    }

    setLoading(false);
  };

  return (
    <ThemedView style={commonStyles.container}>
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
