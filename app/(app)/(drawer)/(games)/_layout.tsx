import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function GamesLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Games",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="list"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="game-one"
        options={{
          title: "Game #1",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="game-controller"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
