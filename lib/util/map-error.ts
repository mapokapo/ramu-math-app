import { ReactNativeFirebase } from "@react-native-firebase/app";

const isFirebaseError = (
  error: unknown
): error is ReactNativeFirebase.NativeFirebaseError => {
  return (
    error instanceof Error &&
    "code" in error &&
    "message" in error &&
    "nativeErrorCode" in error
  );
};

export const mapError = (error: unknown) => {
  if (typeof error === "string") {
    return error;
  }

  if (isFirebaseError(error)) {
    switch (error.code) {
      case "auth/invalid-email":
        return "The email address is invalid.";
      case "auth/user-not-found":
        return "The email address is not associated with any account.";
      case "auth/wrong-password":
        return "The password is invalid.";
      case "auth/too-many-requests":
        return "Too many requests. Try again later.";
      case "auth/user-disabled":
        return "The account has been disabled.";
      case "auth/email-already-in-use":
        return "The email address is already in use by another account.";
      case "auth/weak-password":
        return "The password is too weak.";
      case "auth/invalid-credential":
        return "Could not find an account with the provided credentials.";
      case "firestore/permission-denied":
        return "You do not have permission to perform this action.";
      default:
        return (
          error.nativeErrorMessage ??
          error.message ??
          "An unknown error occurred."
        );
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred.";
};
