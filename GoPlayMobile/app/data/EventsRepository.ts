import { collection, doc, getDocs, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Define the Event type
export interface Event {
  EventID: number;
  EventName: string;
  EventType: string;
  EventDescription: string;
  EventDateTime: string;
  Address: string;
  Latitude: number;
  Longitude: number;
  Approval: boolean;
  AttendanceCount: number;
  AdvertiserID: string;
  AgeRange: string;
  SoberFriendly: boolean;
  PrimaryImage: string;
  SecondaryImages: string[];
  RejectionReason: string;
  videoLink: string;
}

// Repository to manage event data
export class EventsRepository {
  private collectionRef = collection(db, "Events");

  // Fetch all events from the Firestore collection
  async getAllEvents(): Promise<Event[]> {
    const querySnapshot = await getDocs(this.collectionRef);
    return querySnapshot.docs.map(doc => doc.data() as Event);
  }

  // Fetch a specific event by its ID from the Firestore collection
  async getEventById(eventId: string): Promise<Event | null> {
    const q = query(this.collectionRef, where("EventID", "==", eventId));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      console.log("✅ Event matched by EventID field:", doc.data());
      return doc.data() as Event;
    }
  
    console.warn("⚠️ No matching event found with EventID:", eventId);
    return null;
  }
}

export default EventsRepository;