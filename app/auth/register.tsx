import { commonStyles } from "../../lib/config/common-styles";
import { TextInput, View } from "react-native";
import { useState } from "react";
import auth from "@react-native-firebase/auth";
import { mapError } from "../../lib/util/map-error";
import ThemedButton from "../../components/themed-button";
import ThemedView from "../../components/themed-view";
import ThemedText from "../../components/themed-text";
import { useTheme } from "../../lib/hooks/theme";
import { toast } from "burnt";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const theme = useTheme();

  const handleRegister = async () => {
    if (loading) {
      return;
    }

    if (email.trim().length === 0 || password.trim().length === 0) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await auth().createUserWithEmailAndPassword(email, password);
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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        returnKeyType="go"
        textContentType="newPassword"
        secureTextEntry
      />
      <ThemedButton
        title="Register"
        onPress={handleRegister}
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
