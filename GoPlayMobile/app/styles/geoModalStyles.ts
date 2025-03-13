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
  button: {
    backgroundColor: 'white',
    borderColor: `#${golPlayColors.medAqua}`, // Use the dark aqua color directly
    borderWidth: 2,
    borderRadius: 25, // Fully rounded (pill) style
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#00796B', // Use the dark aqua color directly
    fontWeight: 'bold',
  },
});

export default geoModalStyles;
