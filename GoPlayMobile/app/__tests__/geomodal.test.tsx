import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import GeoModalComponent from "../components/geoModalComponent";
import { useRouter } from "expo-router";
import { ParticipantEventRepository } from "../data/ParticipantEventRepository";
import { getDeviceId } from "../utils/getDeviceId";


jest.spyOn(console, "warn").mockImplementation((message) => {
    if (message.includes("EXPO_OS")) return;
    console.warn(message);
});
jest.mock("expo-router", () => ({ useRouter: jest.fn() }));
jest.mock("../utils/getDeviceId", () => ({ getDeviceId: jest.fn() }));
jest.mock("../data/ParticipantEventRepository", () => ({
  ParticipantEventRepository: jest.fn().mockImplementation(() => ({
    addParticipantEvent: jest.fn(),
  })),
  ParticipantEventFactory: {
    createParticipantEvent: jest.fn().mockReturnValue({ mock: "participantEvent" }),
  },
}));

describe("GeoModalComponent", () => {
  const mockPush = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  const mockEvent = {
    EventID: 1,
    EventName: "Test Event",
    Address: "123 Main St",
    PrimaryImage: "https://example.com/image.jpg",
    videoLink: "",
  };

  it("renders the modal when event is provided", () => {
    const { getByText } = render(<GeoModalComponent event={mockEvent} onClose={mockOnClose} />);
    expect(getByText("Test Event")).toBeTruthy();
    expect(getByText("I'm Interested!")).toBeTruthy();
    expect(getByText("More Info")).toBeTruthy();
    expect(getByText("Close")).toBeTruthy();
  });

  it("calls onClose when 'Close' is pressed", () => {
    const { getByText } = render(<GeoModalComponent event={mockEvent} onClose={mockOnClose} />);
    fireEvent.press(getByText("Close"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls getDeviceId and adds participant event when 'I'm Interested!' is pressed", async () => {
    (getDeviceId as jest.Mock).mockResolvedValue("mock-device-id");

    const { getByText } = render(<GeoModalComponent event={mockEvent} onClose={mockOnClose} />);
    fireEvent.press(getByText("I'm Interested!"));

    await waitFor(() => {
      expect(getDeviceId).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("navigates to event details when 'More Info' is pressed", () => {
    const { getByText } = render(<GeoModalComponent event={mockEvent} onClose={mockOnClose} />);
    fireEvent.press(getByText("More Info"));
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/event/[eventId]",
      params: { eventId: 1, event: JSON.stringify(mockEvent) },
    });
  });
});
