import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VisionAI</Text>
      <Text style={styles.subtitle}>AI-powered image analysis</Text>
      <Link href="/camera" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 40 },
  button: {
    backgroundColor: "#2E5BBA",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
