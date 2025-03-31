import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import geoModalStyles from "../styles/geoModalStyles";
import { ParticipantEventRepository, ParticipantEventFactory } from "../data/ParticipantEventRepository";
import { Event } from "../data/EventsRepository";
import { AttendanceTypes } from "../data/staticData";
import { getDeviceId } from "../utils/getDeviceId";

interface GeoModalComponentProps {
  event: Event | null;
  onClose: () => void;
}

const GeoModalComponent: React.FC<GeoModalComponentProps> = ({ event, onClose }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!!event);
  }, [event]);

  const handleInterested = async () => {
    const deviceId = await getDeviceId();
    if (!deviceId) {
      console.error("Device ID is not available. Error code #101.");
      return;
    }

    const participantEventRepo = new ParticipantEventRepository();

    if (event) {
      const newParticipantEvent = ParticipantEventFactory.createParticipantEvent(
        deviceId,
        AttendanceTypes.INTERESTED,
        event.EventID
      );
      await participantEventRepo.addParticipantEvent(newParticipantEvent);
    }

    onClose();
  };

  const handleMoreInfo = () => {
    onClose();
    router.push({
      pathname: "/event/[eventId]",
      params: { eventId: event?.EventID ?? "", event: event ? JSON.stringify(event) : null },
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
          {/* Event Title */}
          <Text style={geoModalStyles.title}>{event?.EventName}</Text>

          {/* Primary Image */}
          {event?.PrimaryImage && (
            <Image source={{ uri: event.PrimaryImage }} style={geoModalStyles.image} />
          )}

          {/* Description */}
          {event?.EventDescription && (
            <Text style={geoModalStyles.description}>{event.EventDescription}</Text>
          )}

          {/* Address */}
          {event?.Address && (
            <Text style={geoModalStyles.address}>📍 {event.Address}</Text>
          )}

          {/* Buttons */}
          <TouchableOpacity style={geoModalStyles.button} onPress={handleInterested}>
            <Text style={geoModalStyles.buttonText}>I'm Interested!</Text>
          </TouchableOpacity>

          <TouchableOpacity style={geoModalStyles.button} onPress={handleMoreInfo}>
            <Text style={geoModalStyles.buttonText}>More Info</Text>
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