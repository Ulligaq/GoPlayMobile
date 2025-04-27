import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import PreferencesScreen from "../preferenceScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { act } from "react-test-renderer";

// Mocks
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("@expo/vector-icons", () => {
  const View = require("react-native").View;
  return {
    Ionicons: () => <View testID="icon-mock" />,
  };
});

jest.spyOn(console, "warn").mockImplementation((message) => {
    if (message.includes("EXPO_OS")) return;
    console.warn(message);
});

describe("PreferencesScreen", () => {
  const mockGoBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ goBack: mockGoBack });

    (AsyncStorage.getItem as jest.Mock).mockImplementation(async (key: string) => {
      if (key === "preferredEventTypes") return JSON.stringify(["Music"]);
      if (key === "preferredDateFilter") return "today"; // starting value for tests
      return null;
    });

    const { getDocs } = require("firebase/firestore");
    getDocs.mockResolvedValue({
      docs: [
        { data: () => ({ EventTypeId: 1, EventType: "Music" }) },
        { data: () => ({ EventTypeId: 2, EventType: "Comedy" }) },
      ],
    });
  });

  it("displays loading indicator initially", () => {
    const { getByText } = render(<PreferencesScreen />);
    expect(getByText("Loading preferences...")).toBeTruthy();
  });

  it("renders event types and switch states after loading", async () => {
    const { getByText } = render(<PreferencesScreen />);
    await waitFor(() => {
      expect(getByText("Music")).toBeTruthy();
      expect(getByText("Comedy")).toBeTruthy();
    });
  });

  it("navigates back when back button is pressed", async () => {
    const { getByText } = render(<PreferencesScreen />);
    await waitFor(() => {
      fireEvent.press(getByText("Back"));
    });

    expect(mockGoBack).toHaveBeenCalled();
  });
});
