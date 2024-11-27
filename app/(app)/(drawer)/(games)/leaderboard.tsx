import { useEffect, useState } from "react";
import ThemedText from "../../../../components/themed-text";
import ThemedView from "../../../../components/themed-view";
import { commonStyles } from "../../../../lib/config/common-styles";
import firestore from "@react-native-firebase/firestore";
import { FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppUser } from "../../../../lib/context/user-provider";

export type ProfileLeaderboardView = {
  uid: string;
  name: string;
  photoURL?: string;
  points: number;
};

export default function Leaderboard() {
  const user = useAppUser();
  const [profiles, setProfiles] = useState<ProfileLeaderboardView[]>([]);

  useEffect(() => {
    return firestore()
      .collection("profiles")
      .orderBy("points", "desc")
      .limit(10)
      .onSnapshot(snapshot => {
        const profiles = snapshot.docs.map(
          doc =>
            ({
              uid: doc.id,
              name: doc.get("name"),
              photoURL: doc.get<string | null>("photoURL") ?? undefined,
              points: doc.get("points"),
            }) satisfies ProfileLeaderboardView
        );

        setProfiles(profiles);
      });
  }, []);

  return (
    <ThemedView style={commonStyles.container}>
      <ThemedText
        style={[
          commonStyles.title,
          {
            textAlign: "center",
            marginBottom: 0,
          },
        ]}>
        Leaderboard
      </ThemedText>
      <ThemedText style={commonStyles.subtitle}>Top 10 players</ThemedText>
      <FlatList
        data={profiles}
        keyExtractor={item => item.uid}
        renderItem={({ item, index }) => (
          <ThemedView
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 4,
                marginBottom: 4,
                backgroundColor:
                  index % 2 === 0 ? "rgba(0, 0, 0, 0.05)" : "transparent",
              },
              item.uid === user.uid
                ? {
                    borderWidth: 2,
                    borderColor: "black",
                  }
                : undefined,
            ]}>
            {index <= 2 ? (
              <Ionicons
                name="trophy"
                size={32}
                color={
                  index === 0
                    ? "#FFBF00"
                    : index === 1
                      ? "silver"
                      : index === 2
                        ? "darkorange"
                        : "black"
                }
                style={{
                  marginRight: 16,
                }}
              />
            ) : (
              <ThemedText
                style={{
                  fontWeight: "bold",
                  marginRight: 16,
                  width: 32,
                  textAlign: "center",
                }}>
                {index + 1}
              </ThemedText>
            )}
            <ThemedText style={{ flex: 1, marginLeft: 16 }}>
              {item.name}
            </ThemedText>
            <ThemedText>{item.points}</ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}
