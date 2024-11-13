import {
  FlatList,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ThemedButton from "../../../components/themed-button";
import ThemedView from "../../../components/themed-view";
import { commonStyles } from "../../../lib/config/common-styles";
import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import ImagePickerButton from "../../../components/image-picker-button";
import { useTheme } from "../../../lib/hooks/theme";
import ThemedText from "../../../components/themed-text";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Game {
  id: string;
  title: string;
  description: string;
  photoURL: string;
}

export default function App() {
  const [gameTitle, setGameTitle] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [gamePhotoURL, setGamePhotoURL] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    return firestore()
      .collection("games")
      .onSnapshot(snapshot => {
        const games: Game[] = [];

        snapshot.forEach(doc => {
          games.push({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            photoURL: doc.data().photoURL,
          });
        });

        setGames(games);
      });
  }, []);

  const handleAddGame = async () => {
    if (
      gameTitle.trim().length === 0 ||
      gameDescription.trim().length === 0 ||
      gamePhotoURL === null ||
      gamePhotoURL.trim().length === 0
    ) {
      return;
    }

    const newGame = {
      title: gameTitle,
      description: gameDescription,
      photoURL: gamePhotoURL,
    };

    const ref = await firestore().collection("games").add(newGame);

    setGames([...games, { ...newGame, id: ref.id }]);

    setGameTitle("");
    setGameDescription("");
    setGamePhotoURL(null);

    setModalVisible(false);
  };

  return (
    <ThemedView style={commonStyles.container}>
      <Modal
        visible={modalVisible}
        animationType="slide">
        <ThemedView style={commonStyles.container}>
          <TextInput
            style={commonStyles.textInput}
            placeholder="Title"
            value={gameTitle}
            onChangeText={setGameTitle}
          />
          <TextInput
            style={commonStyles.textInput}
            placeholder="Description"
            value={gameDescription}
            onChangeText={setGameDescription}
          />
          <View style={{ alignItems: "center" }}>
            <ImagePickerButton
              value={gamePhotoURL}
              onImagePicked={setGamePhotoURL}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 16,
            }}>
            <ThemedButton
              style={{ flex: 1, backgroundColor: theme.colors.error }}
              title="Zatvori"
              onPress={() => setModalVisible(false)}
            />
            <ThemedButton
              style={{ flex: 1 }}
              title="Add Game"
              onPress={handleAddGame}
            />
          </View>
        </ThemedView>
      </Modal>
      <ThemedButton
        title="Add New Game"
        onPress={() => setModalVisible(true)}
      />
      <FlatList
        data={games}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 8,
              borderWidth: 1,
              borderColor: theme.colors.muted,
              marginBottom: 8,
            }}>
            <Image
              source={{ uri: item.photoURL }}
              style={{ height: 64, width: 64, borderRadius: 32 }}
            />
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                marginLeft: 16,
              }}>
              <ThemedText style={[commonStyles.title, { marginBottom: 0 }]}>
                {item.title}
              </ThemedText>
              <ThemedText
                style={{
                  color: theme.colors.mutedText,
                }}>
                {item.description}
              </ThemedText>
            </View>
            <TouchableOpacity>
              <Ionicons
                name="trash"
                size={24}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}
