import { useEffect } from "react";
import { useUser } from "../../lib/context/user-provider";
import { Redirect, SplashScreen, Stack, usePathname } from "expo-router";
import {
  ProfileProvider,
  useProfile,
} from "../../lib/context/profile-provider";

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

  if (profile.loaded) {
    if (profile.data === null && pathname !== "/create-profile") {
      return <Redirect href="/create-profile" />;
    } else if (profile.data !== null && pathname === "/create-profile") {
      return <Redirect href="/" />;
    }
  } else {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="create-profile"
        options={{
          headerShown: true,
          title: "Create Profile",
        }}
      />
    </Stack>
  );
}
