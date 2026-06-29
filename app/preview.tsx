import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { imageToBase64 } from "../lib/gemini";

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const router = useRouter();

  async function handleAnalyze(promptKey: string) {
    const base64Image = await imageToBase64(photoUri);
    router.push({
      pathname: "/result",
      params: { base64Image, promptKey, photoUri },
    });
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.preview} />
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.personaRow}>
        <TouchableOpacity
          style={styles.academicButton}
          onPress={() => handleAnalyze("academic")}
        >
          <Text style={styles.buttonText}>🎓 Academic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.safetyButton}
          onPress={() => handleAnalyze("safety")}
        >
          <Text style={styles.buttonText}>⚠️ Safety</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.inventoryButton}
          onPress={() => handleAnalyze("inventory")}
        >
          <Text style={styles.buttonText}>📋 Inventory</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  preview: { flex: 1, resizeMode: "contain" },
  actionRow: { flexDirection: "row", justifyContent: "center", padding: 10 },
  personaRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
  },
  retakeButton: { backgroundColor: "#5A6472", padding: 14, borderRadius: 8 },
  academicButton: { backgroundColor: "#2E5BBA", padding: 12, borderRadius: 8 },
  safetyButton: { backgroundColor: "#B85C00", padding: 12, borderRadius: 8 },
  inventoryButton: { backgroundColor: "#5B3FA3", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
