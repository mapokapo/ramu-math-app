import { useState } from "react";
import ThemedButton from "../../../../components/themed-button";
import ThemedText from "../../../../components/themed-text";
import ThemedView from "../../../../components/themed-view";
import { commonStyles } from "../../../../lib/config/common-styles";
import { useTheme } from "../../../../lib/hooks/theme";
import { TextInput, View } from "react-native";
import {
  Profile,
  useAppProfile,
} from "../../../../lib/context/profile-provider";
import firestore, { increment } from "@react-native-firebase/firestore";
import { mapError } from "../../../../lib/util/map-error";
import { toast } from "burnt";

/**
 * The game has 4 stages:
 * 1. "not-started": the "Start" button is displayed
 * 2. "playing": the game is in progress, numbers are being displayed one by one, and the user has to remember them
 * 3. "guessing": the game has finished, the user has to guess the sum of the numbers
 * 4. "won" or "lost": the user has submitted their guess and the game is over with 2 possible outcomes (win or lose)
 */
type GameStage = "not-started" | "playing" | "guessing" | "won" | "lost";

const gameFinished = (gameState: GameStage) =>
  gameState === "won" || gameState === "lost";

export default function GameOne() {
  const profile = useAppProfile();
  const [numbers, setNumbers] = useState<number[]>([]);
  const [gameState, setGameState] = useState<GameStage>("not-started");
  const [inputValue, setInputValue] = useState("");

  const theme = useTheme();

  const handleStartGame = () => {
    // don't start the game if it's already started
    if (gameState !== "not-started") {
      return;
    }

    setNumbers([]);
    setGameState("playing");

    const intervalId = setInterval(() => {
      setNumbers(prevNumbers => {
        if (prevNumbers.length < 10) {
          // add new number between 0 and 9 (both inclusive)
          // two consecutive numbers must'nt be the same, but the overall list may contain duplicate numbers
          let newNumber;
          do {
            newNumber = Math.floor(Math.random() * 10);
          } while (prevNumbers[prevNumbers.length - 1] === newNumber);

          return [...prevNumbers, newNumber];
        } else {
          clearInterval(intervalId);
          setGameState("guessing");
          return prevNumbers;
        }
      });
    }, 800);
  };

  const handleSumSubmit = () => {
    if (gameState !== "guessing" || !profile.loaded) {
      return;
    }

    const sum = numbers.reduce((acc, n) => acc + n, 0);
    const guess = parseInt(inputValue, 10);

    if (guess === sum) {
      setGameState("won");
      addPoints(5, profile.data);
    } else {
      setGameState("lost");
      addPoints(-7, profile.data);
    }
  };

  const addPoints = async (points: number, profile: Profile) => {
    try {
      await firestore()
        .collection("profiles")
        .doc(profile.uid)
        .update({
          points: increment(points),
        });
    } catch (e) {
      const message = mapError(e);

      toast({
        title: message,
      });

      console.error(e);
    }
  };

  if (!profile.loaded) {
    return (
      <ThemedView
        style={[commonStyles.container, { justifyContent: "center" }]}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[commonStyles.container, { justifyContent: "center" }]}>
      <ThemedText
        style={[
          commonStyles.title,
          {
            textAlign: "center",
            marginBottom: "auto",
          },
        ]}>
        Memory Game
      </ThemedText>
      {gameState === "not-started" ? (
        <ThemedButton
          title="Start"
          onPress={handleStartGame}
        />
      ) : (
        <ThemedView style={{ gap: 16 }}>
          {gameState === "won" && (
            <View style={{ gap: 8 }}>
              <ThemedText style={{ textAlign: "center", fontSize: 24 }}>
                You guessed it!
              </ThemedText>
              <ThemedText
                style={{
                  textAlign: "center",
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryText,
                  marginHorizontal: "auto",
                  padding: 8,
                  borderRadius: 8,
                }}>
                +5 points
              </ThemedText>
            </View>
          )}
          {gameState === "lost" && (
            <View style={{ gap: 8 }}>
              <ThemedText style={{ textAlign: "center", fontSize: 24 }}>
                Your guess was incorrect!
              </ThemedText>
              <ThemedText
                style={{
                  textAlign: "center",
                  backgroundColor: theme.colors.error,
                  color: theme.colors.errorText,
                  marginHorizontal: "auto",
                  padding: 8,
                  borderRadius: 8,
                }}>
                -7 points
              </ThemedText>
            </View>
          )}
          {gameFinished(gameState) && (
            <ThemedText style={{ textAlign: "center" }}>
              The sum was {numbers.reduce((acc, n) => acc + n, 0)}
            </ThemedText>
          )}
          {gameState === "playing" && (
            <ThemedView
              style={{
                borderWidth: 1,
                borderColor: theme.colors.muted,
                padding: 16,
                marginHorizontal: "auto",
                aspectRatio: 1,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <ThemedText style={{ fontSize: 32 }}>
                {numbers[numbers.length - 1]}
              </ThemedText>
            </ThemedView>
          )}
          {gameState === "guessing" && (
            <View style={{ gap: 16 }}>
              <ThemedText>What was the sum of the numbers?</ThemedText>
              <TextInput
                style={commonStyles.textInput}
                placeholder="Number"
                value={inputValue}
                onChangeText={setInputValue}
                autoCapitalize="none"
                keyboardType="number-pad"
                returnKeyType="next"
              />
              <ThemedButton
                title="Submit"
                onPress={handleSumSubmit}
              />
            </View>
          )}
          {gameFinished(gameState) && (
            <ThemedButton
              title="Play again"
              onPress={() => {
                setNumbers([]);
                setGameState("not-started");
                setInputValue("");
              }}
            />
          )}
        </ThemedView>
      )}
      <ThemedText
        style={{
          marginTop: "auto",
          textAlign: "center",
          backgroundColor: theme.colors.primary,
          color: theme.colors.primaryText,
          padding: 8,
          borderRadius: 8,
        }}>
        Total points: {profile.data.points}
      </ThemedText>
    </ThemedView>
  );
}
