import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import { Redirect, SplashScreen, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

SplashScreen.preventAutoHideAsync();

export default function AuthLayout() {
  const [user, setUser] = useState<
    | {
        loaded: true;
        data: FirebaseAuthTypes.User | null;
      }
    | {
        loaded: false;
      }
  >({
    loaded: false,
  });

  useEffect(() => {
    return auth().onAuthStateChanged(user => {
      setUser({
        loaded: true,
        data: user,
      });

      SplashScreen.hideAsync();
    });
  }, []);

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
      </Tabs>
    );
  }
}
