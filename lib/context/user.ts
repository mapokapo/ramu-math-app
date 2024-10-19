import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createContext, useContext } from "react";

export const UserContext = createContext<FirebaseAuthTypes.User | null>(null);

export const UserProvider = UserContext.Provider;

export function useUser() {
  const user = useContext(UserContext);

  if (!user) {
    throw new Error("No user found in context");
  }

  return user;
}
