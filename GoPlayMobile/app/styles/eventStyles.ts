import { StyleSheet } from "react-native";

const eventStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#222",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#444",
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  primaryImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
  },
  secondaryImage: {
    width: 150,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    resizeMode: "cover",
    backgroundColor: "#ddd", // helps visually debug
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    marginLeft: 6,
    color: "#333",
  },
  videoContainer: {
    width: "100%",
    height: 200,
    marginVertical: 10,
  },
  video: {
    flex: 1,
    borderRadius: 10,
  },
});

export default eventStyles;