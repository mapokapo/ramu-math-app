import { useAppUser } from "../../../../../lib/context/user-provider";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import ThemedView from "../../../../../components/themed-view";
import ThemedText from "../../../../../components/themed-text";
import { commonStyles } from "../../../../../lib/config/common-styles";
import { TextInput, View } from "react-native";
import { useState } from "react";
import ThemedButton from "../../../../../components/themed-button";
import { useTheme } from "../../../../../lib/hooks/theme";
import { mapError } from "../../../../../lib/util/map-error";
import { authProviders } from "../../../../../lib/config/auth-providers";

export default function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const user = useAppUser();
  const theme = useTheme();

  const handleSocialDeleteAccount = async (provider: string) => {
    if (loading) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const authProvider = authProviders[provider];

      if (!authProvider) {
        setErrorMessage("Provider not supported.");
        setLoading(false);
        return;
      }

      const credential = await authProvider();

      if (!credential) {
        setErrorMessage("Sign in cancelled.");
        setLoading(false);
        return;
      }

      await user.reauthenticateWithCredential(credential);

      await firestore().collection("profiles").doc(user.uid).delete();
      await user.delete();
    } catch (error) {
      console.error(error);

      const message = mapError(error);

      setErrorMessage(message);
    }

    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    if (loading) {
      return;
    }

    if (email.trim().length === 0 || password.trim().length === 0) {
      setErrorMessage("Please enter your email and password.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await user.reauthenticateWithCredential(
        auth.EmailAuthProvider.credential(email, password)
      );
      await firestore().collection("profiles").doc(user.uid).delete();
      await user.delete();
    } catch (error) {
      console.error(error);

      const message = mapError(error);

      setErrorMessage(message);
    }

    setLoading(false);
  };

  return (
    <ThemedView style={commonStyles.container}>
      <ThemedText style={commonStyles.subtitle}>
        Please confirm your credentials again to delete your account.
      </ThemedText>
      {user.providerData.filter(provider => provider.providerId !== "password")
        .length > 0 ? (
        user.providerData.map(provider => (
          <ThemedButton
            key={provider.providerId}
            title={`Delete using ${provider.providerId}`}
            onPress={() => handleSocialDeleteAccount(provider.providerId)}
            disabled={loading}
            style={{
              backgroundColor: theme.colors.error,
            }}
          />
        ))
      ) : (
        <View style={{ gap: 9 }}>
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
            textContentType="password"
            secureTextEntry
          />

          <ThemedButton
            title="Delete Account"
            onPress={handleDeleteAccount}
            disabled={loading}
            style={{
              backgroundColor: theme.colors.error,
            }}
          />
        </View>
      )}

      {errorMessage && (
        <ThemedText
          style={{
            color: theme.colors.error,
            textAlign: "center",
          }}>
          {errorMessage}
        </ThemedText>
      )}
    </ThemedView>
  );
}
