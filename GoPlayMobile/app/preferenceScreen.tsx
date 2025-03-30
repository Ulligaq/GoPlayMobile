import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Switch, StyleSheet } from "react-native";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import masterStyles from "./styles/masterStyles"; // Use your styling system

interface EventType {
  EventTypeId: number;
  EventType: string;
}

const PreferencesScreen = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchEventTypes = async () => {
      const db = getFirestore();
      const snapshot = await getDocs(collection(db, "EventType"));
      const types = snapshot.docs.map((doc) => doc.data() as EventType);
      setEventTypes(types);
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

  return (
    <View style={masterStyles.screen}>
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