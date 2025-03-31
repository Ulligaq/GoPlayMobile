import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import masterStyles from "./styles/masterStyles";

interface EventType {
  EventTypeId: number;
  EventType: string;
}

const PreferencesScreen = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const db = getFirestore();
        const snapshot = await getDocs(collection(db, "EventType"));
        const types = snapshot.docs.map(doc => doc.data() as EventType);
        types.sort((a, b) => a.EventType.localeCompare(b.EventType));
        setEventTypes(types);
      } catch (error) {
        console.error("Error fetching event types:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const loadPreferences = async () => {
      const stored = await AsyncStorage.getItem("preferredEventTypes");
      if (stored) setSelectedTypes(JSON.parse(stored));
    };
  
    fetchEventTypes();
    loadPreferences();
  }, []);

  const toggleType = async (type: string) => {
    let updated = [...selectedTypes];
    if (updated.includes(type)) {
      updated = updated.filter((t) => t !== type);
    } else {
      updated.push(type);
    }
    setSelectedTypes(updated);
    await AsyncStorage.setItem("preferredEventTypes", JSON.stringify(updated));
  };
  if (loading) {
    return (
      <View style={masterStyles.screen}>
        <Text>Loading preferences...</Text>
      </View>
    );
  }
  return (
    <View style={masterStyles.screen}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Select Preferred Event Types</Text>
      <FlatList
        data={eventTypes}
        keyExtractor={(item) => item.EventTypeId.toString()}
        renderItem={({ item }) => (
          <View style={styles.typeRow}>
            <Text style={styles.label}>{item.EventType}</Text>
            <Switch
              value={selectedTypes.includes(item.EventType)}
              onValueChange={() => toggleType(item.EventType)}
            />
          </View>
        )}
      />
    </View>
  );
};

export default PreferencesScreen;

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    marginLeft: 5,
    color: "#333",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  label: {
    fontSize: 16,
  },
});