import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import Master from "../master";
import { useRouter } from "expo-router";

// Mocks
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../utils/getDeviceId", () => ({
  getDeviceId: jest.fn(() => Promise.resolve("mock-device-id")),
}));

jest.mock("../data/ParticipantRepository", () => ({
  ParticipantRepository: jest.fn().mockImplementation(() => ({
    getParticipant: jest.fn(() => Promise.resolve(null)),
    addParticipant: jest.fn(),
  })),
  ParticipantFactory: {
    createParticipant: jest.fn(),
  },
}));

jest.mock("../data/ParticipantEventRepository", () => ({
  ParticipantEventRepository: jest.fn().mockImplementation(() => ({
    addParticipantEvent: jest.fn(),
  })),
  ParticipantEventFactory: {
    createParticipantEvent: jest.fn(),
  },
}));

jest.mock("react-native-webview", () => ({
  WebView: () => null,
}));

jest.mock("react-native-gesture-handler", () => {
  const actual = jest.requireActual("react-native-gesture-handler/jestSetup");
  return {
    ...actual,
    PanGestureHandler: ({ children }: any) => children,
    State: {},
    NativeViewGestureHandler: ({ children }: any) => children,
  };
});

jest.spyOn(console, "warn").mockImplementation((message) => {
    if (message.includes("EXPO_OS")) return;
    console.warn(message);
});

// 🧪 Firebase Firestore mock
jest.mock("../firebaseConfig", () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(() => ({})),
  getDocs: jest.fn(() =>
    Promise.resolve({
      docs: [
        {
          data: () => ({
            EventID: "1",
            EventName: "Test Event",
            EventType: "Music",
            EventDescription: "Live music in the park",
            EventDateTime: "2099-12-31 06:00 PM",
            Address: "123 Fake St",
            Latitude: 46.87,
            Longitude: -113.99,
            Approval: true,
            AttendanceCount: 42,
            AdvertiserID: "abc123",
            AgeRange: "All",
            SoberFriendly: true,
            PrimaryImage: "",
            SecondaryImages: [],
            RejectionReason: "",
            videoLink: "",
          }),
        },
      ],
    })
  ),
}));

describe("Master.tsx", () => {
  const push = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    jest.clearAllMocks();
  });

  it("renders the event list with fetched events", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Master />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText("Test Event")).toBeTruthy();
    });
  });

  it("shows the More Info button for an event", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Master />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText("More Info")).toBeTruthy();
    });
  });

  it("navigates to the event page when More Info is pressed", async () => {
    const { getByText } = render(
      <NavigationContainer>
        <Master />
      </NavigationContainer>
    );

    const button = await waitFor(() => getByText("More Info"));
    fireEvent.press(button);

    expect(push).toHaveBeenCalledWith({
      pathname: "/event/[eventId]",
      params: expect.objectContaining({
        eventId: "1",
      }),
    });
  });

  it("displays empty state message when no events are available", async () => {
    // Override getDocs to return no events
    const { getDocs } = require("../firebaseConfig");
    getDocs.mockResolvedValueOnce({ docs: [] });

    const { getByText } = render(
      <NavigationContainer>
        <Master />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText("No events match your current filters.")).toBeTruthy();
    });
  });
});