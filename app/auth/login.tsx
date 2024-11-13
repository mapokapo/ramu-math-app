import { commonStyles } from "../../lib/config/common-styles";
import { TextInput, View } from "react-native";
import { useState } from "react";
import auth from "@react-native-firebase/auth";
import { mapError } from "../../lib/util/map-error";
import ThemedButton from "../../components/themed-button";
import ThemedView from "../../components/themed-view";
import ThemedText from "../../components/themed-text";
import { useTheme } from "../../lib/hooks/theme";
import { authProviders } from "../../lib/config/auth-providers";
import { toast } from "burnt";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const theme = useTheme();

  const handleSocialLogin = async (provider: string) => {
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

      await auth().signInWithCredential(credential);
    } catch (error) {
      console.error(error);

      const message = mapError(error);

      toast({
        title: message,
      });
    }
  };

  const handleLogin = async () => {
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
      await auth().signInWithEmailAndPassword(email, password);
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
      <View>
        <ThemedButton
          title="Log in with Google"
          onPress={() => handleSocialLogin("google.com")}
          disabled={loading}
        />
      </View>
      <View style={commonStyles.horizontalRule}></View>
      <View
        style={[
          commonStyles.container,
          {
            padding: 0,
          },
        ]}>
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
          title="Log in"
          onPress={handleLogin}
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
      </View>
    </ThemedView>
  );
}
