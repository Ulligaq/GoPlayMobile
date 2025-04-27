module.exports = {
  preset: "jest-expo", // or "react-native" if not using Expo
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.png$": "<rootDir>/app/__mocks__/fileMock.ts",
    '^firebase/(.*)$': '<rootDir>/app/__mocks__/firebase.ts',
    "^firebase/firestore$": "<rootDir>/app/__mocks__/firebase.ts",
    "^../firebaseConfig$": "<rootDir>/app/__mocks__/firebase.ts",
    '^react-native-webview$': '<rootDir>/app/__mocks__/react-native-webview.ts',
    '^react-native-gesture-handler$': '<rootDir>/app/__mocks__/react-native-gesture-handler.ts',
    "^@react-native-async-storage/async-storage$": "<rootDir>/app/__mocks__/react-native-async-storage.ts",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
};
