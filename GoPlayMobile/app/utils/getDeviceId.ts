// Import necessary modules from expo-secure-store and expo-constants
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Define a constant key for storing the device ID securely. This is the key.
const DEVICE_ID_KEY = 'uniqueDeviceId';

// Utility function to hash a string and generate a unique identifier
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i); // Perform bitwise operations to generate hash
    hash |= 0; // Convert to 32-bit integer
  }
  return `dev-${Math.abs(hash)}`; // Return a positive hash prefixed with 'dev-'
}

// Asynchronous function to retrieve or generate a unique device ID
export const getDeviceId = async (): Promise<string> => {
  // Attempt to retrieve an existing device ID from secure storage
  let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);

  // If no device ID exists, generate a new one
  if (!deviceId) {
    // Use Constants.installationId as a fallback or generate a random string
    const fallback = Constants.installationId ?? Math.random().toString();
    deviceId = hashString(fallback); // Hash the fallback value to create a device ID
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId); // Store the new device ID securely
  }
  console.log("Device ID:", deviceId);

  return deviceId;
};

export default getDeviceId;