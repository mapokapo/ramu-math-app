import ThemedButton from "../../../components/themed-button";
import ThemedText from "../../../components/themed-text";
import ThemedView from "../../../components/themed-view";
import { commonStyles } from "../../../lib/config/common-styles";
import { useAppUser } from "../../../lib/context/user-provider";
import auth from "@react-native-firebase/auth";
import { useTheme } from "../../../lib/hooks/theme";

export default function App() {
  const user = useAppUser();
  const theme = useTheme();

  return (
    <ThemedView style={commonStyles.container}>
      <ThemedText>
        Welcome, {user.displayName ?? user.email ?? "User"}!
      </ThemedText>
      <ThemedText
        style={{
          fontSize: 12,
          textAlign: "center",
          color: theme.colors.mutedText,
        }}>
        The greeting above is using the user's Firebase auth data, not their
        custom Firestore profile data.
      </ThemedText>
      <ThemedButton
        title="Log out"
        onPress={() => auth().signOut()}
      />
    </ThemedView>
  );
}
