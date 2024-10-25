import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncValue from "../types/AsyncValue";

export type User = FirebaseAuthTypes.User;

type UserProviderProps = PropsWithChildren;

type UserProviderState = {
  user: AsyncValue<User | null>;
  setUser: (user: AsyncValue<User | null>) => void;
};

const initialState: UserProviderState = {
  user: {
    loaded: false,
  },
  setUser: () => {},
};

const UserProviderContext = createContext<UserProviderState>(initialState);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AsyncValue<User | null>>({
    loaded: false,
  });

  useEffect(() => {
    return auth().onAuthStateChanged(newUser => {
      setUser({
        loaded: true,
        data: newUser,
      });
    });
  }, []);

  const value = {
    user,
    setUser,
  };

  return (
    <UserProviderContext.Provider value={value}>
      {children}
    </UserProviderContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserProviderContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

export function useAppUser() {
  const { user } = useUser();

  if (!user.loaded) {
    throw new Error(
      "useAppUser must be used within a UserProvider that has loaded the auth state"
    );
  }

  if (user.data === null) {
    throw new Error(
      "useAppUser must be used within a UserProvider that has a signed-in user"
    );
  }

  return user.data;
}
