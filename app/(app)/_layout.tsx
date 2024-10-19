import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useEffect, useState } from "react";
import { UserProvider } from "../../lib/context/user";
import { Redirect, SplashScreen, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
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
    return (
      <UserProvider value={user.data}>
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
      </UserProvider>
    );
  } else {
    return <Redirect href="/auth" />;
  }
}
