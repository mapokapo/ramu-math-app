import { useEffect } from "react";
import { useUser } from "../../lib/context/user-provider";
import { Redirect, SplashScreen, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ProfileProvider } from "../../lib/context/profile-provider";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const { user } = useUser();

  useEffect(() => {
    if (user.loaded) {
      SplashScreen.hideAsync();
    }
  }, [user]);

  if (!user.loaded) {
    return null;
  }

  if (user.data !== null) {
    return (
      <ProfileProvider user={user.data}>
        <Tabs>
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
      </ProfileProvider>
    );
  } else {
    return <Redirect href="/auth" />;
  }
}
