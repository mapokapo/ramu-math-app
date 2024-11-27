import { useState } from "react";
import ThemedButton from "../../../../components/themed-button";
import ThemedText from "../../../../components/themed-text";
import ThemedView from "../../../../components/themed-view";
import { commonStyles } from "../../../../lib/config/common-styles";
import { useTheme } from "../../../../lib/hooks/theme";
import { TextInput, View } from "react-native";

export default function GameOne() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [guessingStage, setGuessingStage] = useState(false);
  const [gameWon, setGameWon] = useState<boolean | null>(null);
  const [inputValue, setInputValue] = useState("");

  const theme = useTheme();

  const startGame = () => {
    // don't start the game if it's already started
    if (gameStarted) return;

    setGameStarted(true);

    const intervalId = setInterval(() => {
      setNumbers(prevNumbers => {
        if (prevNumbers.length < 10) {
          // add new number between 0 and 9 (both inclusive)
          // two consecutive numbers mustnt be the same, but the list may contain duplicate numbers
          let newNumber;
          do {
            newNumber = Math.floor(Math.random() * 10);
          } while (prevNumbers[prevNumbers.length - 1] === newNumber);

          return [...prevNumbers, newNumber];
        } else {
          clearInterval(intervalId);
          setGuessingStage(true);
          return prevNumbers;
        }
      });
    }, 800);
  };

  const handleSumSubmit = () => {
    const sum = numbers.reduce((acc, n) => acc + n, 0);
    const guess = parseInt(inputValue, 10);

    setGuessingStage(false);
    setGameWon(sum === guess);
  };

  return (
    <ThemedView style={[commonStyles.container, { justifyContent: "center" }]}>
      {gameStarted ? (
        <ThemedView style={{ gap: 16 }}>
          {gameWon !== null &&
            (gameWon ? (
              <ThemedText style={{ textAlign: "center", fontSize: 24 }}>
                You won!
              </ThemedText>
            ) : (
              <ThemedText style={{ textAlign: "center", fontSize: 24 }}>
                You lost!
              </ThemedText>
            ))}
          {gameWon !== null && (
            <ThemedText style={{ textAlign: "center" }}>
              The sum was {numbers.reduce((acc, n) => acc + n, 0)}
            </ThemedText>
          )}
          {gameWon === null &&
            (guessingStage ? (
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
            ) : (
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
            ))}
          {gameWon !== null && (
            <ThemedButton
              title="Play again"
              onPress={() => {
                setNumbers([]);
                setGameStarted(false);
                setGuessingStage(false);
                setGameWon(null);
                setInputValue("");
              }}
            />
          )}
        </ThemedView>
      ) : (
        <ThemedButton
          title="Start"
          onPress={startGame}
        />
      )}
    </ThemedView>
  );
}
