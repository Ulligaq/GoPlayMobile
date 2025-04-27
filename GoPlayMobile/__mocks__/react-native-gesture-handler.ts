// app/__mocks__/react-native-gesture-handler.ts
export const PanGestureHandler = ({ children }: any) => children;
export const State = {};
export const TapGestureHandler = ({ children }: any) => children;
export const LongPressGestureHandler = ({ children }: any) => children;
export const NativeViewGestureHandler = ({ children }: any) => children;
export const GestureHandlerRootView = ({ children }: any) => children;

export default {
  PanGestureHandler,
  State,
  TapGestureHandler,
  LongPressGestureHandler,
  NativeViewGestureHandler,
  GestureHandlerRootView,
};
