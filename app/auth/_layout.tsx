import { useEffect } from "react";
import { Redirect, SplashScreen, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUser } from "../../lib/context/user-provider";

SplashScreen.preventAutoHideAsync();

export default function AuthLayout() {
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
    return <Redirect href="/(app)" />;
  } else {
    return (
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="login"
          options={{
            title: "Log in",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="log-in"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            title: "Register",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-add"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create-profile"
          options={{
            title: "Create profile",
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
}
