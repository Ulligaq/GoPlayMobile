import React, { useRef } from "react";
import { StyleSheet, Text, View, FlatList, Dimensions, TouchableOpacity, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useRouter } from "expo-router";

const INITIAL_REGION = {
  latitude: 46.8721,
  longitude: -113.9940,
  latitudeDelta: 4,
  longitudeDelta: 4,
};

const LOCATIONS = [
  { id: '1', name: 'Rudy\'s Poetry Contest', latitude: 46.8624, longitude: -114.0160 },
  { id: '2', name: 'Shut Your Pie Hole (Eating Contest)', latitude: 46.8749, longitude: -113.9925 },
  { id: '3', name: 'Union Club Bar & Grill: Open Mic Nite', latitude: 46.8708, longitude: -113.9925 },
];

const SCREEN_HEIGHT = Dimensions.get("window").height;

const Master = () => {
  const mapRef = useRef<MapView>(null);
  const translateY = useSharedValue(0);
  const router = useRouter();

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

  interface Location {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }

  const handlePress = (location: Location) => {
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleMoreInfo = (locationId: string) => {
    router.push(`/event/${locationId}`);
  };

  return (
    <View style={styles.screen}>
      <MapView ref={mapRef} style={styles.map} initialRegion={INITIAL_REGION}>
        {LOCATIONS.map(location => (
          <Marker
            key={location.id}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={location.name}
          />
        ))}
      </MapView>
      <PanGestureHandler onHandlerStateChange={gestureHandler}>
        <Animated.View style={[styles.listContainer, animatedStyle]}>
          <FlatList
            data={LOCATIONS}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <TouchableOpacity onPress={() => handlePress(item)} style={styles.textContainer}>
                  <Text style={styles.locationText}>{item.name}</Text>
                </TouchableOpacity>
                <Button title="More Info" onPress={() => handleMoreInfo(item.id)} />
              </View>
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
});