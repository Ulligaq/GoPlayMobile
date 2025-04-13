// Import necessary libraries and components
import React, { useEffect, useState, useRef } from "react";
import { Text, View, FlatList, Dimensions, TouchableOpacity, Button } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { PanGestureHandler, State, NativeViewGestureHandler  } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, useAnimatedGestureHandler } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import GeoModalComponent from "./components/geoModalComponent";
import { EventsRepository, Event } from "./data/EventsRepository"; // Import Event from EventsRepository
import { getDeviceId } from "./utils/getDeviceId";
import { ParticipantRepository, ParticipantFactory } from "./data/ParticipantRepository";
import masterStyles from "./styles/masterStyles"; // Import styles
import AsyncStorage from "@react-native-async-storage/async-storage";
import { parse, isSameDay, isAfter, isBefore, addDays } from "date-fns";

// Define the initial region for the map
const INITIAL_REGION = {
  latitude: 46.8721,
  longitude: -113.9940,
  latitudeDelta: 4,
  longitudeDelta: 4,
};

// Get the screen height for gesture handling
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SNAP_TOP = -SCREEN_HEIGHT + 330;     
const SNAP_MID = -SCREEN_HEIGHT / 10; 
const SNAP_BOTTOM = -SCREEN_HEIGHT + 856;

const Master = () => {
  // Reference to the MapView component
  const mapRef = useRef<MapView>(null);

  const listRef = useRef<FlatList>(null); 
  const scrollOffset = useRef(0);    
  // State to store the list of events
  const [events, setEvents] = useState<Event[]>([]);

  // Shared value for animated gesture handling
  const translateY = useSharedValue(0);

  // Router for navigation
  const router = useRouter();
  

  // date filtering
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "upcoming">("all");

  // State to store the currently selected event
  const [event, setEvent] = useState<Event | null>(null);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const filteredEvents = events.filter(event => {
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(event.EventType);
  
    let eventDate: Date;
    try {
      eventDate = parse(event.EventDateTime, "yyyy-MM-dd h:mm a", new Date());
    } catch (e) {
      console.warn("Invalid event date:", event.EventDateTime);
      return false;
    }
  
    const now = new Date();
  
    // ✅ Always exclude events in the past
    if (eventDate < now) return false;
  
    let matchesDate = true;
  
    if (dateFilter === "today") {
      matchesDate = isSameDay(eventDate, now);
    } else if (dateFilter === "upcoming") {
      const threeWeeksLater = addDays(now, 21);
      matchesDate = isBefore(eventDate, threeWeeksLater);
    }
  
    return matchesType && matchesDate;
  });

  
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

  useEffect(() => {
    // Only run this once when the component mounts
    translateY.value = SNAP_MID;
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
            const storedTypes = await AsyncStorage.getItem("preferredEventTypes");
            if (storedTypes) {
              setSelectedTypes(JSON.parse(storedTypes));
            }
    
            const storedDateFilter = await AsyncStorage.getItem("preferredDateFilter");
            if (storedDateFilter) {
              setDateFilter(storedDateFilter as "all" | "today" | "upcoming");
            }
    
          } catch (error) {
            console.error("Error loading preferences:", error);
          }
        };
    
        loadPreferences();
      }, [])
    );

  // Handle gestures for the animated list container
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: (event) => {
      if (event.translationY < -100) {
        translateY.value = withSpring(SNAP_TOP);
      } else if (event.translationY > 100) {
        translateY.value = withSpring(SNAP_BOTTOM);
      } else {
        translateY.value = withSpring(SNAP_MID);
      }
    }
  });

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
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[masterStyles.listContainer, animatedStyle]}>
          
          {/* Drag handle */}
          <View style={masterStyles.dragHandle} />

          {/* FlatList of events */}
          <FlatList
            ref={listRef}
            data={filteredEvents}
            keyExtractor={(item) => item.EventID.toString()}
            renderItem={({ item }) => (
              <View style={masterStyles.listItem}>
                <TouchableOpacity onPress={() => handlePress(item)} style={masterStyles.textContainer}>
                  <Text style={masterStyles.locationText}>{item.EventName}</Text>
                  <Text style={masterStyles.typeBadge}>{item.EventType}</Text>
                </TouchableOpacity>
                <Button 
                  title="More Info" 
                  onPress={() => handleMoreInfo(item)} 
                  color="#20B2AA" 
                />
              </View>
            )}
            removeClippedSubviews={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              scrollOffset.current = e.nativeEvent.contentOffset.y;
            }}
            ListEmptyComponent={
              <Text style={{ padding: 20, textAlign: "center", color: "#888" }}>
                No events match your current filters.
              </Text>
            }
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