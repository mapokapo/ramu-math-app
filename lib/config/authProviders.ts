import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

/**
 * Auth provider function signature. Returns a Firebase Auth credential or null in case of cancellation.
 */
export type AuthProvider =
  () => Promise<FirebaseAuthTypes.AuthCredential | null>;

export const googleAuthProvider: AuthProvider = async () => {
  GoogleSignin.configure({
    webClientId:
      "569974629006-3ghe2ckpvrtibn9kieprhs7eqi7k9vkh.apps.googleusercontent.com",
  });

  await GoogleSignin.hasPlayServices();

  const response = await GoogleSignin.signIn();

  if (response.type === "cancelled") {
    return null;
  }

  const { idToken } = response.data;

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  return googleCredential;
};

export const authProviders: Record<string, AuthProvider | undefined> = {
  "google.com": googleAuthProvider,
};
