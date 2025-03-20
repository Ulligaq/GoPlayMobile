import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { db } from "./firebaseConfig"; // Adjust path as needed
import { collection, getDocs } from "firebase/firestore";
import GeoModalComponent from "./components/geoModalComponent";

interface Event {
  id: string;
  EventName: string;
  latitude: number;
  longitude: number;
}

const INITIAL_REGION = {
  latitude: 46.8721,
  longitude: -113.9940,
  latitudeDelta: 4,
  longitudeDelta: 4,
};

const SCREEN_HEIGHT = Dimensions.get("window").height;

const Master = () => {
  const mapRef = useRef<MapView>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const translateY = useSharedValue(0);
  const router = useRouter();
  const [location, setLocation] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Events"));
        const eventData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          EventName: doc.data().EventName,
          latitude: doc.data().Latitude,
          longitude: doc.data().Longitude,
        }));
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  interface GestureHandlerEvent {
    nativeEvent: {
      state: number;
      translationY: number;
    };
  }

  const gestureHandler = (event: GestureHandlerEvent) => {
    if (event.nativeEvent.state === State.END) {
      if (event.nativeEvent.translationY < -50) {
        translateY.value = withSpring(-SCREEN_HEIGHT + 100);
      } else if (event.nativeEvent.translationY > 50) {
        translateY.value = withSpring(0);
      } else {
        translateY.value = withSpring(-SCREEN_HEIGHT / 2 + 100);
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handlePress = (event: Event) => {
    mapRef.current?.animateToRegion({
      latitude: event.latitude,
      longitude: event.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setLocation(event);
  };

  const handleMoreInfo = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };

  const handleCloseModal = () => {
    setLocation(null);
  };

  return (
    <View style={styles.screen}>
      <MapView ref={mapRef} style={styles.map} initialRegion={INITIAL_REGION}>
        {events.map(event => (
          <Marker
            key={event.id}
            coordinate={{ latitude: event.latitude, longitude: event.longitude }}
            title={event.EventName}
            onPress={() => handlePress(event)}
          />
        ))}
      </MapView>
      <PanGestureHandler onHandlerStateChange={gestureHandler}>
        <Animated.View style={[styles.listContainer, animatedStyle]}>
          <FlatList
            data={events}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <TouchableOpacity onPress={() => handlePress(item)} style={styles.textContainer}>
                  <Text style={styles.locationText}>{item.EventName}</Text>
                </TouchableOpacity>
                <Button title="More Info" onPress={() => handleMoreInfo(item.id)} />
              </View>
            )}
          />
        </Animated.View>
      </PanGestureHandler>
      {location && (
        <View style={styles.modalContainer}>
          <GeoModalComponent location={location} onClose={handleCloseModal} />
        </View>
      )}
    </View>
  );
};

export default Master;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  listContainer: {
    position: "absolute",
    top: SCREEN_HEIGHT / 2,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  locationText: {
    fontSize: 18,
    color: "#333",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});