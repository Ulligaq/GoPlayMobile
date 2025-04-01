// Import necessary libraries and components
import React, { useEffect, useState, useRef } from "react";
import { Text, View, FlatList, Dimensions, TouchableOpacity, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import GeoModalComponent from "./components/geoModalComponent";
import { EventsRepository, Event } from "./data/EventsRepository"; // Import Event from EventsRepository
import { getDeviceId } from "./utils/getDeviceId";
import { ParticipantRepository, ParticipantFactory } from "./data/ParticipantRepository";
import masterStyles from "./styles/masterStyles"; // Import styles
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the initial region for the map
const INITIAL_REGION = {
  latitude: 46.8721,
  longitude: -113.9940,
  latitudeDelta: 4,
  longitudeDelta: 4,
};

// Get the screen height for gesture handling
const SCREEN_HEIGHT = Dimensions.get("window").height;

const Master = () => {
  // Reference to the MapView component
  const mapRef = useRef<MapView>(null);

  // State to store the list of events
  const [events, setEvents] = useState<Event[]>([]);

  // Shared value for animated gesture handling
  const translateY = useSharedValue(0);

  // Router for navigation
  const router = useRouter();

  // State to store the currently selected event
  const [event, setEvent] = useState<Event | null>(null);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const filteredEvents = events.filter(event =>
    selectedTypes.length === 0 || selectedTypes.includes(event.EventType)
  );

  
  // Define the structure of the gesture handler event
  interface GestureHandlerEvent {
    nativeEvent: {
      state: number;
      translationY: number;
    };
  }

  // Fetch events from the repository when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRepo = new EventsRepository();
        const eventData = await eventsRepo.getAllEvents();
        setEvents(eventData); // Update the state with fetched events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // Initialize the device ID and check if it exists in the repository
  useEffect(() => {
    const initializeDeviceId = async () => {
      try {
        const deviceId = await getDeviceId();
        const participantRepo = new ParticipantRepository();
        const existingParticipant = await participantRepo.getParticipant(deviceId);
  
        if (!existingParticipant) {
          console.log("Device ID saved locally:", deviceId);
          const newParticipant = ParticipantFactory.createParticipant(deviceId, "");
          await participantRepo.addParticipant(newParticipant);
        } else {
          console.log("Device ID exists in Firebase:", deviceId);
        }
      } catch (error) {
        console.error("Error initializing deviceId:", error);
      }
    };
  
    initializeDeviceId();
    });

    useFocusEffect(
      React.useCallback(() => {
        const loadPreferences = async () => {
          try {
            const stored = await AsyncStorage.getItem("preferredEventTypes");
            if (stored) {
              const parsed = JSON.parse(stored);
              setSelectedTypes(parsed);
            }
          } catch (error) {
            console.error("Error loading preferences:", error);
          }
        };
    
        loadPreferences();
      }, [])
    );

  // Handle gestures for the animated list container
  const gestureHandler = (event: GestureHandlerEvent) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationY < -50) {
        translateY.value = withSpring(-SCREEN_HEIGHT + 100); // Fully expand the list
      } else if (event.nativeEvent.translationY > 50) {
        translateY.value = withSpring(0); // Collapse the list
      } else {
        translateY.value = withSpring(-SCREEN_HEIGHT / 2 + 100); // Partially expand the list
      }
    }
  };

  // Define the animated style for the list container
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Handle marker press to focus on the selected event
  const handlePress = (event: Event) => {
    mapRef.current?.animateToRegion({
      latitude: event.Latitude,
      longitude: event.Longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setEvent(event); // Set the selected event
  };

  // Navigate to the event details page
  const handleMoreInfo = (event: Event) => {
    router.push({
      pathname: `/event/[eventId]`,
      params: { 
        eventId: event.EventID, 
        event: JSON.stringify(event) // Pass the stringified Event object
      },
    });
  };

  // Close the modal by clearing the selected event
  const handleCloseModal = () => {
    setEvent(null);
  };

  return (
    <View style={masterStyles.screen}>
      {/* MapView to display events as markers */}
      <MapView ref={mapRef} style={masterStyles.map} initialRegion={INITIAL_REGION}>
        {filteredEvents.map(event => (
          <Marker
            key={event.EventID}
            coordinate={{ latitude: event.Latitude, longitude: event.Longitude }}
            title={event.EventName}
            onPress={() => handlePress(event)}
          />
        ))}
      </MapView>

      {/* Gesture handler for the animated list container */}
      <PanGestureHandler onHandlerStateChange={gestureHandler}>
        <Animated.View style={[masterStyles.listContainer, animatedStyle]}>
          {/* FlatList to display the list of events */}
          <FlatList
            data={filteredEvents}
            keyExtractor={item => item.EventID.toString()}
            renderItem={({ item }) => (
              <View style={masterStyles.listItem}>
                <TouchableOpacity onPress={() => handlePress(item)} style={masterStyles.textContainer}>
                  <Text style={masterStyles.locationText}>{item.EventName}</Text>
                </TouchableOpacity>
                <Button 
                  title="More Info" 
                  onPress={() => handleMoreInfo(item)} 
                  color="#20B2AA" 
                />
              </View>
            )}
          />
        </Animated.View>
      </PanGestureHandler>

      {/* Modal to display additional information about the selected event */}
      {event && (
        <View style={masterStyles.modalContainer}>
          <GeoModalComponent
            event={event} // Pass the full Event object
            onClose={handleCloseModal}
          />
        </View>
      )}
    </View>
  );
};

export default Master;