import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import geoModalStyles from "../styles/geoModalStyles"; 
import { ParticipantEventRepository, ParticipantEventFactory } from "../data/ParticipantEventRepository";
import { Event } from "../data/EventsRepository"; // Ensure Event is imported from EventsRepository
import { AttendanceTypes } from "../data/staticData"; // Import AttendanceTypes
import { getDeviceId } from "../utils/getDeviceId"; // Import getDeviceId

interface GeoModalComponentProps {
  event: Event | null;
  onClose: () => void;
}

/**
 * GeoModalComponent displays a modal with event details when a map marker is tapped.
 */
const GeoModalComponent: React.FC<GeoModalComponentProps> = ({ event, onClose }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (event) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [event]);

  const handleInterested = async () => {
    const deviceId = await getDeviceId(); // Get deviceId directly
    if (!deviceId) {
      console.error("Device ID is not available. Error code #101.");
      return;
    }

    const participantEventRepo = new ParticipantEventRepository();

    // Save AttendanceState as "2" (Interested) in ParticipantEvent
    if (event) {
      const newParticipantEvent = ParticipantEventFactory.createParticipantEvent(
        deviceId,
        AttendanceTypes.INTERESTED,
        event.EventID
      );
      await participantEventRepo.addParticipantEvent(newParticipantEvent);
    }

    onClose();
    router.push({
      pathname: "/event/[eventId]",
      params: { eventId: event?.EventID ?? "", event: event ? JSON.stringify(event) : null }, // Pass eventId and the stringified Event object
    });
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={geoModalStyles.modalContainer}>
        <View style={geoModalStyles.modalContent}>
          <Text style={geoModalStyles.title}>{event?.EventName}</Text>        
          <TouchableOpacity style={geoModalStyles.button} onPress={handleInterested}>
            <Text style={geoModalStyles.buttonText}>I'm Interested!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={geoModalStyles.button} onPress={onClose}>
            <Text style={geoModalStyles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default GeoModalComponent;
