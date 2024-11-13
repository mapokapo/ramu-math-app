import { toast } from "burnt";
import { format, formatRelative } from "date-fns";
import { useRouter } from "expo-router";
import { View, FlatList } from "react-native";
import ThemedButton from "../../../../components/themed-button";
import ThemedText from "../../../../components/themed-text";
import ThemedView from "../../../../components/themed-view";
import { commonStyles } from "../../../../lib/config/common-styles";
import { useAppProfile } from "../../../../lib/context/profile-provider";
import { useAppUser } from "../../../../lib/context/user-provider";
import { useTheme } from "../../../../lib/hooks/theme";
import { camelCaseToWords } from "../../../../lib/util/camel-case-to-words";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import * as Clipboard from "expo-clipboard";
import { mapError } from "../../../../lib/util/map-error";
import ImagePickerButton from "../../../../components/image-picker-button";

export default function Profile() {
  const user = useAppUser();
  const profile = useAppProfile();
  const theme = useTheme();
  const router = useRouter();

  const handlePickImage = async (uri: string) => {
    const fileExtension = uri.split(".").pop();
    if (fileExtension === undefined) {
      return;
    }

    //const path = `users/${user.uid}/profile.${fileExtension}`;
    try {
      // TODO: firebase storage is no longer free, so we need to find a new way to store images
      // const task = await storage().ref(path).putFile(uri);
      await firestore().collection("profiles").doc(user.uid).update({
        photoURL: null,
      });
    } catch (error) {
      console.error(error);

      const message = mapError(error);

      toast({
        title: message,
      });
    }
  };

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
              <ImagePickerButton
                value={user.photoURL}
                onImagePicked={handlePickImage}
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
              { key: "Date of birth", value: profile.data.dateOfBirth },
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
                  <ThemedText>
                    {item.value instanceof Date
                      ? format(item.value, "MM/dd/yyyy")
                      : item.value}
                  </ThemedText>
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
