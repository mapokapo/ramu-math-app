import firestore, { Timestamp } from "@react-native-firebase/firestore";
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
import { mapError } from "../util/map-error";
import { toast } from "burnt";

export type Profile = {
  uid: string;
  name: string;
  dateOfBirth: Date;
  email: string;
  photoURL?: string;
  points: number;
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
      .onSnapshot(
        snapshot => {
          if (!snapshot.exists) {
            setProfile({
              loaded: true,
              data: null,
            });
            return;
          }

          setProfile({
            loaded: true,
            data: {
              uid: snapshot.id,
              name: snapshot.get("name"),
              dateOfBirth: (snapshot.get("dateOfBirth") as Timestamp).toDate(),
              email: snapshot.get("email"),
              photoURL: snapshot.get<string | null>("photoURL") ?? undefined,
              points: snapshot.get("points"),
            },
          });
        },
        e => {
          const message = mapError(e);

          toast({
            title: message,
          });

          console.error(e);

          setProfile({
            loaded: true,
            data: null,
          });
        }
      );
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
