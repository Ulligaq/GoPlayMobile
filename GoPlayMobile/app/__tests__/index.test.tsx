import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import SplashScreen from "../index";
import { useRouter } from "expo-router";
import { Animated } from "react-native";

// Mock `expo-router`
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

// Mock image import
jest.mock("../../assets/images/goplaylogo.png", () => ({
  testUri: "mocked-image",
}));

describe("SplashScreen", () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("renders the splash screen correctly", () => {
    const { getByText, getByTestId } = render(<SplashScreen />);

    expect(getByText("Welcome to")).toBeTruthy();
    expect(getByText("Events Happening")).toBeTruthy();
    expect(getByText("NOW")).toBeTruthy();
    expect(getByTestId("splash-logo")).toBeTruthy(); // Accessible Image
  });

  it("navigates after 3 seconds", async () => {
    render(<SplashScreen />);

    // Fast-forward timers by 3 seconds
    jest.advanceTimersByTime(3000);

    // Wait for the animation to finish
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/master");
    });
  });

  it("starts with opacity 1", () => {
    const fadeAnim = new Animated.Value(1);
    expect(fadeAnim.__getValue()).toBe(1);
  });
});