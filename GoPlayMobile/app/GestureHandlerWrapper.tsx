import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const GestureHandlerWrapper = ({ children }: { children: React.ReactNode }) => {
  return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
};

export default GestureHandlerWrapper;
