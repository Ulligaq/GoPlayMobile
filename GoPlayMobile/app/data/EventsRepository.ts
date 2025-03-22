import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Use shared db

// Define the Event type
export interface Event {
  EventID: number; // Unique identifier for the event
  EventName: string; // Name of the event
  Latitude: number; // Latitude of the event location
  Longitude: number; // Longitude of the event location
}

// Repository to manage event data
export class EventsRepository {
  private collectionRef = collection(db, "Events"); // Use shared db

  // Fetch all events from the Firestore collection
  async getAllEvents(): Promise<Event[]> {
    const querySnapshot = await getDocs(this.collectionRef);
    return querySnapshot.docs.map(doc => doc.data() as Event);
  }

  // Fetch a specific event by its ID from the Firestore collection
  async getEventById(eventId: number): Promise<Event | null> {
    const querySnapshot = await getDocs(this.collectionRef);
    const eventDoc = querySnapshot.docs.find(doc => (doc.data() as Event).EventID === eventId);
    return eventDoc ? (eventDoc.data() as Event) : null;
  }
}

export default EventsRepository;