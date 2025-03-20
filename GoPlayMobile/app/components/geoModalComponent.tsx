import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import geoModalStyles from "../styles/geoModalStyles"; 

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface GeoModalComponentProps {
  location: Location | null; // Allow location to be null initially
  onClose: () => void;
}

/**
 * GeoModalComponent displays a modal with event details when a map marker is tapped.
 * @param {GeoModalComponentProps} props - The properties for the component.
 * @param {Location | null} props.location - The location object containing event details.
 * @param {() => void} props.onClose - Function to close the modal.
 * @returns {JSX.Element} The rendered component.
 */
const GeoModalComponent: React.FC<GeoModalComponentProps> = ({ location, onClose }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false); // Initialize as false

  useEffect(() => {
    if (location) {
      setIsVisible(true); // Show modal only when location is set
    } else {
      setIsVisible(false); // Ensure modal is hidden when location is null
    }
  }, [location]);

  /**
   * Handle the "I'm Interested!" button press.
   * Closes the modal and navigates to the event details page.
   */
  const handleInterested = () => {
    onClose(); // Close the modal
    router.push(`/event/${location?.id}`); // Open event details
  };

  /**
   * Handle the close button press.
   * Closes the modal.
   */
  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <View style={geoModalStyles.modalContainer}>
        <View style={geoModalStyles.modalContent}>
          {/* Display the event name */}
          <Text style={geoModalStyles.title}>{location?.name}</Text>
          {/* Button to show interest */}
          <TouchableOpacity style={geoModalStyles.button} onPress={handleInterested}>
            <Text style={geoModalStyles.buttonText}>I'm Interested!</Text>
          </TouchableOpacity>
          {/* Button to close the modal */}
          <TouchableOpacity style={geoModalStyles.button} onPress={handleClose}>
            <Text style={geoModalStyles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default GeoModalComponent;
