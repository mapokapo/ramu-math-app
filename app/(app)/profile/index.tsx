import { toast } from "burnt";
import { formatRelative } from "date-fns";
import { useRouter } from "expo-router";
import { View, FlatList, Image } from "react-native";
import ThemedButton from "../../../components/themed-button";
import ThemedText from "../../../components/themed-text";
import ThemedView from "../../../components/themed-view";
import { commonStyles } from "../../../lib/config/commonStyles";
import { useAppProfile } from "../../../lib/context/profile-provider";
import { useAppUser } from "../../../lib/context/user-provider";
import { useTheme } from "../../../lib/hooks/theme";
import { camelCaseToWords } from "../../../lib/util/camelCaseToWords";
import auth from "@react-native-firebase/auth";
import * as Clipboard from "expo-clipboard";

export default function Profile() {
  const user = useAppUser();
  const profile = useAppProfile();
  const theme = useTheme();
  const router = useRouter();

  return (
    <ThemedView style={commonStyles.container}>
      {!profile.loaded ? (
        <ThemedText>Loading...</ThemedText>
      ) : (
        <View
          style={{
            gap: 8,
          }}>
          <View
            style={{
              alignItems: "center",
            }}>
            {user.photoURL && (
              <Image
                source={{ uri: user.photoURL }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
              />
            )}
            <ThemedText style={commonStyles.title}>
              {profile.data.name}
            </ThemedText>
            <ThemedText>
              {user.metadata.lastSignInTime &&
                `Last seen ${formatRelative(
                  new Date(user.metadata.lastSignInTime),
                  new Date()
                )}`}
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <ThemedButton
              title="Copy UID"
              onPress={() => {
                if (user.uid) {
                  Clipboard.setStringAsync(user.uid).then(() => {
                    toast({
                      title: "UID copied to clipboard!",
                    });
                  });
                }
              }}
            />
          </View>
          <View style={commonStyles.horizontalRule}></View>
          <FlatList
            data={[
              { key: "Email", value: profile.data.email },
              { key: "Phone number", value: user.phoneNumber },
            ]}
            renderItem={({ item }) =>
              item.value === null ? null : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 8,
                  }}>
                  <ThemedText>{camelCaseToWords(item.key)}</ThemedText>
                  <ThemedText>{item.value}</ThemedText>
                </View>
              )
            }
          />
          <ThemedButton
            title="Log out"
            onPress={() => auth().signOut()}
          />
          <ThemedButton
            title="Delete account"
            onPress={() => router.push("/profile/delete-account")}
            style={{
              backgroundColor: theme.colors.error,
            }}
          />
        </View>
      )}
    </ThemedView>
  );
}
