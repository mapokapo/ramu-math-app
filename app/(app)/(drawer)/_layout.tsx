import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function TabsLayout() {
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer initialRouteName="index">
        <Drawer.Screen
          name="index"
          options={{
            title: "Games",
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            title: "My Profile",
            headerRight: () => (
              <Ionicons
                name="pencil"
                size={24}
                style={{ marginRight: 16 }}
                onPress={() => {
                  router.push("/(app)/(drawer)/profile/edit-profile");
                }}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
