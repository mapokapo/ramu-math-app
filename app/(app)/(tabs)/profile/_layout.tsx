import { Stack } from "expo-router";

export default function DeleteAccountLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="delete-account"
        options={{ title: "Delete Account" }}
      />
    </Stack>
  );
}
