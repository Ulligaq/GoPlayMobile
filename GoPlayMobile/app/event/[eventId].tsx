import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Button, Linking, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import eventStyles from "../styles/eventStyles";
import EventsRepository, { Event } from "../data/EventsRepository";

const EventDescription = () => {
  const searchParams = useLocalSearchParams();
  const router = useRouter();

  // Parse the initial event passed via router params
  const initialEvent = searchParams.event
    ? (JSON.parse(searchParams.event as string) as Event)
    : null;

  const [event, setEvent] = useState<Event | null>(initialEvent);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Refresh event data from Firestore
  useEffect(() => {
    const fetchFreshEvent = async () => {
      const eventId = searchParams.eventId;
      console.log("⏳ Fetching fresh event for ID:", eventId);
  
      if (!eventId) return;
  
      try {
        const repo = new EventsRepository();
        const freshEvent = await repo.getEventById(searchParams.eventId as string);
        console.log("✅ Fresh event fetched from Firestore:", freshEvent);
  
        if (freshEvent) {
          setEvent(freshEvent);
        }
      } catch (error) {
        console.error("❌ Error refreshing event from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchFreshEvent();
  }, [searchParams.eventId]);

  if (!event) {
    return (
      <View style={eventStyles.container}>
        <Text style={eventStyles.title}>Event Not Found</Text>
        <Text style={eventStyles.description}>No details available for this event.</Text>
      </View>
    );
  }

  const {
    EventName,
    EventType,
    EventDescription: description,
    EventDateTime,
    Address,
    AgeRange,
    SoberFriendly,
    PrimaryImage,
    SecondaryImages = [],
    videoLink,
  } = event;

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(Address)}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={eventStyles.container}>
      <TouchableOpacity onPress={() => router.back()} style={eventStyles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={eventStyles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={eventStyles.title}>{EventName}</Text>
      <Text style={eventStyles.subtitle}>{EventType}</Text>

      {videoLink && videoLink.includes("youtube.com") && (
        <View style={eventStyles.videoContainer}>
          <WebView
            style={eventStyles.video}
            javaScriptEnabled
            domStorageEnabled
            source={{ uri: videoLink }}
            allowsFullscreenVideo
          />
        </View>
      )}

      {PrimaryImage && (
        <Image source={{ uri: PrimaryImage }} style={eventStyles.primaryImage} />
      )}

      <Text style={eventStyles.sectionTitle}>Description</Text>
      <Text style={eventStyles.description}>{description}</Text>

      <Text style={eventStyles.sectionTitle}>Date & Time</Text>
      <Text style={eventStyles.info}>{EventDateTime}</Text>

      <Text style={eventStyles.sectionTitle}>Address</Text>
      <Text style={eventStyles.info}>{Address}</Text>
      <Button title="Open in Maps" onPress={openInMaps} />

      <Text style={eventStyles.sectionTitle}>Details</Text>
      <Text style={eventStyles.info}>Age Range: {AgeRange || "All ages"}</Text>
      <Text style={eventStyles.info}>Sober Friendly: {SoberFriendly ? "Yes" : "No"}</Text>

      {SecondaryImages && SecondaryImages.length > 0 && (
        <>
          <Text style={eventStyles.sectionTitle}>Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
            {SecondaryImages.map((url: string, index: number) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={eventStyles.secondaryImage}
                onError={(e) => console.error(`🧨 Failed to load secondary image ${index}:`, e.nativeEvent)}
              />
            ))}
          </ScrollView>
        </>
      )}

      {loading && (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size="small" />
          <Text>Refreshing from Firestore...</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default EventDescription;