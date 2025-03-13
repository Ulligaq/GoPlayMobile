import React from "react";
import { View, Text, Modal, Button, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { golPlayColors } from "../data/staticData"; // Import colors
import geoModalStyles from "../styles/geoModalStyles" // Correct import statement

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface GeoModalComponentProps {
  location: Location;
  onClose: () => void;
}

const GeoModalComponent: React.FC<GeoModalComponentProps> = ({ location, onClose }) => {
  const router = useRouter();

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={!!location}
      onRequestClose={onClose}
    >
      <View style={geoModalStyles.modalContainer}>
        <View style={geoModalStyles.modalContent}>
          {/* Display the event name */}
          <Text style={geoModalStyles.title}>{location.name}</Text>
          {/* Link to event details */}
          <TouchableOpacity onPress={() => router.push(`/event/${location.id}`)}>
            <Text style={geoModalStyles.link}>View Details</Text>
          </TouchableOpacity>
          {/* Button to show interest */}
          <Button title="I'm Interested!" onPress={() => alert("You are interested!")} />
          {/* Button to close the modal */}
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default GeoModalComponent;
