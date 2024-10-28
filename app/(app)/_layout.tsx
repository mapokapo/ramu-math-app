import { useEffect } from "react";
import { useUser } from "../../lib/context/user-provider";
import { Redirect, SplashScreen, Tabs, usePathname } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ProfileProvider,
  useProfile,
} from "../../lib/context/profile-provider";
import { View } from "react-native";
import { commonStyles } from "../../lib/config/commonStyles";

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
        <TabsLayout />
      </ProfileProvider>
    );
  } else {
    return <Redirect href="/auth" />;
  }
}

function TabsLayout() {
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

  return (
    <Tabs initialRouteName="index">
      <Tabs.Screen
        name="create-profile"
        options={{
          href: null,
          title: "Create Profile",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
