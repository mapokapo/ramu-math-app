import { useEffect } from "react";
import { useUser } from "../../lib/context/user-provider";
import { Redirect, Slot, SplashScreen, usePathname } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ProfileProvider,
  useProfile,
} from "../../lib/context/profile-provider";
import { View } from "react-native";
import { commonStyles } from "../../lib/config/common-styles";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { user } = useUser();

  useEffect(() => {
    if (user.loaded) {
      SplashScreen.hideAsync();
    }
  }, [user.loaded]);

  if (!user.loaded) {
    return null;
  }

  if (user.data !== null) {
    return (
      <ProfileProvider user={user.data}>
        <ProfileLoader />
      </ProfileProvider>
    );
  } else {
    return <Redirect href="/auth" />;
  }
}

function ProfileLoader() {
  const { profile } = useProfile();
  const pathname = usePathname();

  if (!profile.loaded) {
    return (
      <View style={[commonStyles.container, commonStyles.centered]}>
        <Ionicons
          name="refresh"
          size={32}
          color="black"
        />
      </View>
    );
  }

  if (profile.data === null && pathname !== "/create-profile") {
    return <Redirect href="/create-profile" />;
  } else if (profile.data !== null && pathname === "/create-profile") {
    return <Redirect href="/" />;
  }

  return <Slot />;
}
