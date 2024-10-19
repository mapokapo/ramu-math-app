import ThemedButton from "../../components/themed-button";
import ThemedText from "../../components/themed-text";
import ThemedView from "../../components/themed-view";
import { commonStyles } from "../../lib/config/commonStyles";
import { useUser } from "../../lib/context/user";
import auth from "@react-native-firebase/auth";

export default function App() {
  const user = useUser();

  return (
    <ThemedView style={commonStyles.container}>
      <ThemedText>
        Welcome, {user.displayName ?? user.email ?? "User"}!
      </ThemedText>
      <ThemedButton
        title="Log out"
        onPress={() => auth().signOut()}
      />
    </ThemedView>
  );
}
