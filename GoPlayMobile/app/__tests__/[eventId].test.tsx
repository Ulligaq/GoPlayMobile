import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import EventDescription from "../event/[eventId]";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Linking } from "react-native";
import EventsRepository from "../data/EventsRepository";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("../data/EventsRepository", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getEventById: jest.fn(),
  })),
}));


jest.mock("expo-router", () => {
    return {
      useLocalSearchParams: jest.fn(),
      useRouter: jest.fn(),
    };
});

jest.mock("@expo/vector-icons", () => {
    const View = require("react-native").View;
    return {
      Ionicons: () => <View testID="mock-icon" />,
    };
});

jest.spyOn(console, "warn").mockImplementation((message) => {
    if (message.includes("EXPO_OS")) return;
    console.warn(message);
});

jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: jest.fn(),
}));

describe("EventDescription", () => {
  const mockBack = jest.fn();
  const mockEvent = {
    EventID: "1",
    EventName: "Mock Event",
    EventType: "Mock Type",
    EventDescription: "A test description",
    EventDateTime: "2025-04-13",
    Address: "123 Test St",
    AgeRange: "18+",
    SoberFriendly: true,
    PrimaryImage: "https://example.com/image.jpg",
    SecondaryImages: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    videoLink: "https://www.youtube.com/watch?v=12345",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ back: mockBack });
  });
  
  it("renders event not found when no event is loaded", () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({});
    const { getByText } = render(<EventDescription />);
    expect(getByText("Event Not Found")).toBeTruthy();
  });

  it("renders event data when provided", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      eventId: "1",
      event: JSON.stringify(mockEvent),
    });

    const { getByText } = render(<EventDescription />);
    await waitFor(() => {
      expect(getByText("Mock Event")).toBeTruthy();
      expect(getByText("Mock Type")).toBeTruthy();
      expect(getByText("A test description")).toBeTruthy();
    });
  });

  it("navigates back when back button is pressed", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      eventId: "1",
      event: JSON.stringify(mockEvent),
    });

    const { getByText } = render(<EventDescription />);
    fireEvent.press(getByText("Back"));
    expect(mockBack).toHaveBeenCalled();
  });

  it("opens Google Maps when 'Open in Maps' is pressed", async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      eventId: "1",
      event: JSON.stringify(mockEvent),
    });

    const { getByText } = render(<EventDescription />);
    fireEvent.press(getByText("Open in Maps"));
    expect(Linking.openURL).toHaveBeenCalledWith(
      expect.stringContaining("https://www.google.com/maps/search")
    );
  });
});
