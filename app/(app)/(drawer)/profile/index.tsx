import { toast } from "burnt";
import { format, formatRelative } from "date-fns";
import { useRouter } from "expo-router";
import { View, FlatList, Image, TouchableOpacity } from "react-native";
import ThemedButton from "../../../../components/themed-button";
import ThemedText from "../../../../components/themed-text";
import ThemedView from "../../../../components/themed-view";
import { commonStyles } from "../../../../lib/config/common-styles";
import { useAppProfile } from "../../../../lib/context/profile-provider";
import { useAppUser } from "../../../../lib/context/user-provider";
import { useTheme } from "../../../../lib/hooks/theme";
import { camelCaseToWords } from "../../../../lib/util/camel-case-to-words";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { mapError } from "../../../../lib/util/map-error";

export default function Profile() {
  const user = useAppUser();
  const profile = useAppProfile();
  const theme = useTheme();
  const router = useRouter();

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      toast({
        title: "Permission to access media library was denied.",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      const fileExtension = file.uri.split(".").pop();
      if (fileExtension === undefined) {
        return;
      }

      const path = `users/${user.uid}/profile.${fileExtension}`;
      try {
        const task = await storage().ref(path).putFile(file.uri);
        await firestore()
          .collection("profiles")
          .doc(user.uid)
          .update({
            photoURL: await task.ref.getDownloadURL(),
          });
      } catch (error) {
        console.error(error);

        const message = mapError(error);

        toast({
          title: message,
        });
      }
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
              <TouchableOpacity onPress={handlePickImage}>
                <Image
                  source={{ uri: user.photoURL }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                  }}
                />
              </TouchableOpacity>
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
