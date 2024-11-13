import { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useAppUser } from "../../../../lib/context/user-provider";
import { useAppProfile } from "../../../../lib/context/profile-provider";
import { mapError } from "../../../../lib/util/map-error";
import { TextInput, View } from "react-native";
import DatePickerButton from "../../../../components/date-picker-button";
import ThemedButton from "../../../../components/themed-button";
import ThemedText from "../../../../components/themed-text";
import ThemedView from "../../../../components/themed-view";
import { commonStyles } from "../../../../lib/config/common-styles";
import { useTheme } from "../../../../lib/hooks/theme";
import { toast } from "burnt";

export default function EditProfile() {
  const user = useAppUser();
  const profile = useAppProfile();

  const theme = useTheme();

  const [email, setEmail] = useState(
    profile.loaded ? profile.data.email : (user.email ?? "")
  );
  const [name, setName] = useState(profile.loaded ? profile.data.name : "");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
    profile.loaded ? profile.data.dateOfBirth : null
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [hasMadeChanges, setHasMadeChanges] = useState(false);

  const handleEditProfile = async () => {
    if (loading || !hasMadeChanges) {
      return;
    }

    if (email.trim().length === 0 || name.trim().length === 0) {
      setErrorMessage("Email and name cannot be empty.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await firestore().collection("profiles").doc(user.uid).update({
        name,
        email,
        dateOfBirth,
      });
    } catch (error) {
      console.error(error);

      const message = mapError(error);

      toast({
        title: message,
      });
    }

    setLoading(false);
    setHasMadeChanges(false);
  };

  return (
    <ThemedView style={commonStyles.container}>
      <TextInput
        style={commonStyles.textInput}
        placeholder="Email"
        value={email}
        onChangeText={text => {
          setEmail(text);
          setHasMadeChanges(true);
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        textContentType="emailAddress"
      />
      <TextInput
        style={commonStyles.textInput}
        placeholder="Name"
        value={name}
        onChangeText={text => {
          setName(text);
          setHasMadeChanges(true);
        }}
        autoCapitalize="words"
        returnKeyType="next"
        textContentType="name"
      />
      <DatePickerButton
        title="Date of birth"
        value={dateOfBirth}
        onDateChange={date => {
          setDateOfBirth(date);
          setHasMadeChanges(true);
        }}
        disabled={loading}
      />
      <ThemedButton
        title="Save Changes"
        onPress={handleEditProfile}
        disabled={loading || !hasMadeChanges}
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
