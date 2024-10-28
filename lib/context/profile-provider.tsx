import firestore from "@react-native-firebase/firestore";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import AsyncValue from "../types/AsyncValue";

export type Profile = {
  name: string;
  dateOfBirth: Date;
  email: string;
};

type ProfileProviderProps = PropsWithChildren & {
  user: FirebaseAuthTypes.User | null;
};

type ProfileProviderState = {
  profile: AsyncValue<Profile | null>;
  setProfile: (profile: AsyncValue<Profile | null>) => void;
};

const initialState: ProfileProviderState = {
  profile: {
    loaded: false,
  },
  setProfile: () => {},
};

const ProfileProviderContext =
  createContext<ProfileProviderState>(initialState);

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
  user,
}) => {
  const [profile, setProfile] = useState<AsyncValue<Profile | null>>({
    loaded: false,
  });

  useEffect(() => {
    if (user === null) {
      setProfile({
        loaded: true,
        data: null,
      });
      return;
    }

    return firestore()
      .collection("profiles")
      .doc(user.uid)
      .onSnapshot(snapshot => {
        if (!snapshot.exists) {
          setProfile({
            loaded: true,
            data: null,
          });
          return;
        }

        setProfile({
          loaded: true,
          data: snapshot.data() as Profile,
        });
      });
  }, [user]);

  const value = useMemo(() => ({ profile, setProfile }), [profile, setProfile]);

  return (
    <ProfileProviderContext.Provider value={value}>
      {children}
    </ProfileProviderContext.Provider>
  );
};

export function useProfile() {
  const context = useContext(ProfileProviderContext);

  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }

  return context;
}

export function useAppProfile(): AsyncValue<Profile> {
  const { profile } = useProfile();

  if (profile.loaded) {
    const data = profile.data;

    if (data === null) {
      throw new Error(
        "useAppProfile must be used within a ProfileProvider that has non-null profile data"
      );
    }

    return {
      loaded: true,
      data,
    };
  } else {
    return {
      loaded: false,
    };
  }
}
