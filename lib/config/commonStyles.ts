import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    gap: 8,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  button: {
    borderRadius: 5,
    padding: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    padding: 10,
  },
  horizontalRule: {
    width: "100%",
    height: 1,
    marginVertical: 8,
    backgroundColor: "#000000",
  },
});
