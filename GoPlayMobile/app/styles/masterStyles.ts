import { StyleSheet, Dimensions } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export const masterStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  listContainer: {
    position: "absolute",
    top: SCREEN_HEIGHT / 2,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT + 100,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  typeBadge: {
    marginTop: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "#e0f7fa",
    borderRadius: 6,
    fontSize: 12,
    color: "#00796B",
    overflow: "hidden",
  },
  dragHandle: {
    width: 50,
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  locationText: {
    fontSize: 18,
    color: "#333",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default masterStyles;
