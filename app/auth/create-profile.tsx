import { commonStyles } from "../../lib/config/commonStyles";
import { TextInput, View } from "react-native";
import { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { mapError } from "../../lib/util/mapError";
import ThemedButton from "../../components/themed-button";
import ThemedView from "../../components/themed-view";
import ThemedText from "../../components/themed-text";
import { useLocalSearchParams } from "expo-router";
import { useAppUser } from "../../lib/context/user-provider";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export default function CreateProfile() {
  const user = useAppUser();

  const searchParams = useLocalSearchParams<{
    name?: string;
    email?: string;
  }>();

  const [email, setEmail] = useState(searchParams.email ?? "");
  const [name, setName] = useState(searchParams.name ?? "");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

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

  const handlePickDateOfBirth = () => {
    DateTimePickerAndroid.open({
      value: dateOfBirth ?? new Date(),
      mode: "date",
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          setDateOfBirth(selectedDate);
        }
      },
      is24Hour: true,
    });
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
      <ThemedButton
        title="Pick date of birth"
        onPress={handlePickDateOfBirth}
        disabled={loading}
      />
      <ThemedButton
        title="Create profile"
        onPress={handleCreateProfile}
        disabled={loading}
      />
      <View>
        {errorMessage && (
          <ThemedText style={commonStyles.errorText}>{errorMessage}</ThemedText>
        )}
      </View>
    </ThemedView>
  );
}
