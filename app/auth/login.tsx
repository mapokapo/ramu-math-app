import { commonStyles } from "../../lib/config/commonStyles";
import { TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { mapError } from "../../lib/util/mapError";
import ThemedButton from "../../components/themed-button";
import ThemedView from "../../components/themed-view";
import ThemedText from "../../components/themed-text";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const router = useRouter();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "569974629006-3ghe2ckpvrtibn9kieprhs7eqi7k9vkh.apps.googleusercontent.com",
    });
  }, []);

  const handleSocialLogin = async (socialType: "google") => {
    if (loading) {
      return;
    }

    await GoogleSignin.hasPlayServices();

    setLoading(true);
    setErrorMessage(null);

    try {
      if (socialType === "google") {
        const response = await GoogleSignin.signIn();

        if (response.type === "cancelled") {
          setLoading(false);
          setErrorMessage("Google sign-in cancelled.");
          return;
        }

        const { idToken, user } = response.data;

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        await auth().signInWithCredential(googleCredential);

        const userProfileExists = (
          await firestore().collection("profiles").doc(user.id).get()
        ).exists;

        if (!userProfileExists) {
          router.push({
            pathname: "/auth/create-profile",
            params: {
              name: user.name,
              email: user.email,
            },
          });
        }
      }
    } catch (error) {
      console.error(error);

      const message = mapError(error);

      setErrorMessage(message);
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
      const credential = await auth().signInWithEmailAndPassword(
        email,
        password
      );

      const userProfileExists = (
        await firestore().collection("profiles").doc(credential.user.uid).get()
      ).exists;

      if (!userProfileExists) {
        router.push({
          pathname: "/auth/create-profile",
          params: {
            email,
          },
        });
      }
    } catch (error) {
      console.error(error);

      const message = mapError(error);

      setErrorMessage(message);
    }

    setLoading(false);
  };

  return (
    <ThemedView style={commonStyles.container}>
      <View>
        <ThemedButton
          title="Log in with Google"
          onPress={() => handleSocialLogin("google")}
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
            <ThemedText style={commonStyles.errorText}>
              {errorMessage}
            </ThemedText>
          )}
        </View>
      </View>
    </ThemedView>
  );
}