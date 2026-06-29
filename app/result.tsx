import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { analyzeImage } from "../lib/gemini";

const PROMPTS: Record<string, string> = {
  academic: `Act as a university professor. Analyze this image. Return ONLY a raw JSON object, no markdown, no backticks, no extra text:
{"objects":["pen","desk"],"context":"one sentence","activities":"one sentence","recommendations":"one sentence"}`,
  safety: `Act as a workplace safety inspector. Analyze this image. Return ONLY a raw JSON object, no markdown, no backticks, no extra text:
{"objects":["pen","desk"],"context":"one sentence","activities":"one sentence","recommendations":"one sentence"}`,
  inventory: `Act as an asset management clerk. Analyze this image. Return ONLY a raw JSON object, no markdown, no backticks, no extra text:
{"objects":["pen","desk"],"context":"one sentence","activities":"one sentence","recommendations":"one sentence"}`,
};

interface Analysis {
  objects: string[];
  context: string;
  activities: string;
  recommendations: string;
}

export default function ResultScreen() {
  const { base64Image, promptKey, photoUri } = useLocalSearchParams<{
    base64Image: string;
    promptKey: string;
    photoUri: string;
  }>();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runAnalysis();
  }, []);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const prompt = PROMPTS[promptKey] || PROMPTS.academic;
      const result = await analyzeImage(base64Image, prompt);
      console.log("Gemini raw:", JSON.stringify(result).substring(0, 300));
      const textPart = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textPart) throw new Error("Empty response from Gemini");
      const cleaned = textPart.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      // Make sure objects is always an array
      if (typeof parsed.objects === "string") {
        parsed.objects = [parsed.objects];
      }
      if (!Array.isArray(parsed.objects)) {
        parsed.objects = [];
      }
      setAnalysis(parsed);
    } catch (err) {
      console.log("Error details:", JSON.stringify(err));
      setError("Could not analyze this image. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <View style={styles.centered}>
        {photoUri && (
          <Image source={{ uri: photoUri }} style={styles.loadingImage} />
        )}
        <ActivityIndicator size="large" color="#5B3FA3" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!analysis) return null;

  return (
    <ScrollView style={styles.container}>
      {photoUri && <Image source={{ uri: photoUri }} style={styles.photo} />}
      <Text style={styles.personaLabel}>
        {promptKey === "academic"
          ? "🎓 Academic Analysis"
          : promptKey === "safety"
            ? "⚠️ Safety Analysis"
            : "📋 Inventory Analysis"}
      </Text>
      <Text style={styles.sectionTitle}>Objects</Text>
      {analysis.objects.map((obj: any, i: number) => (
        <Text key={i} style={styles.listItem}>
          •{" "}
          {typeof obj === "string"
            ? obj
            : obj.type || obj.description || JSON.stringify(obj)}
        </Text>
      ))}
      <Text style={styles.sectionTitle}>Context</Text>
      <Text style={styles.bodyText}>{analysis.context}</Text>
      <Text style={styles.sectionTitle}>Activities</Text>
      <Text style={styles.bodyText}>{analysis.activities}</Text>
      <Text style={styles.sectionTitle}>Recommendations</Text>
      <Text style={styles.bodyText}>{analysis.recommendations}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  photo: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingImage: {
    width: "80%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 20,
    opacity: 0.6,
  },
  personaLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#5B3FA3",
  },
  loadingText: { marginTop: 12, color: "#5A6472" },
  errorText: { color: "#B3261E", textAlign: "center", fontSize: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    color: "#1F2A44",
  },
  listItem: { fontSize: 15, marginTop: 4 },
  bodyText: { fontSize: 15, marginTop: 4, color: "#2B2F38" },
});
