import { StyleSheet } from "react-native";
import { golPlayColors } from "../data/staticData"; // Import colors

export const geoModalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10, // Rounded corners
    borderWidth: 2, // Border outline
    borderColor: `#${golPlayColors.medAqua}`, // Border color from goplaycolors
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  link: {
    fontSize: 16,
    color: "blue",
    marginBottom: 20,
  },
});

export default geoModalStyles;
