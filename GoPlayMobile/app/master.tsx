import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { db } from "./firebaseConfig"; // Adjust path as needed
import { collection, getDocs } from "firebase/firestore";

const INITIAL_REGION = {
  latitude: 46.8721,
  longitude: -113.9940,
  latitudeDelta: 4,
  longitudeDelta: 4,
};

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface Event {
  id: string;
  EventName: string;
  latitude: number;
  longitude: number;
}

const Master = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const translateY = useSharedValue(0);

  // Fetch Firestore data
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
        translateY.value = withSpring(-SCREEN_HEIGHT + 100); // Fullscreen list
      } else if (event.nativeEvent.translationY > 50) {
        translateY.value = withSpring(0); // Half map and half list
      } else {
        translateY.value = withSpring(-SCREEN_HEIGHT / 2 + 100); // Fullscreen map
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={styles.screen}>
      <MapView style={styles.map} initialRegion={INITIAL_REGION}>
        {events.map(event => (
          <Marker
            key={event.id}
            coordinate={{ latitude: event.latitude, longitude: event.longitude }}
            title={event.EventName}
          />
        ))}
      </MapView>
      <PanGestureHandler onHandlerStateChange={gestureHandler}>
        <Animated.View style={[styles.listContainer, animatedStyle]}>
          <FlatList
            data={events}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Text style={styles.locationText}>{item.EventName}</Text>
            )}
          />
        </Animated.View>
      </PanGestureHandler>
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
  locationText: {
    fontSize: 18,
    color: "#333",
    marginTop: 5,
    paddingHorizontal: 20,
  },
});