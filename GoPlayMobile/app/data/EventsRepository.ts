import { collection, doc, getDocs } from "firebase/firestore";
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
  async getEventById(eventId: number): Promise<Event | null> {
    const querySnapshot = await getDocs(this.collectionRef);
    const eventDoc = querySnapshot.docs.find(doc => (doc.data() as Event).EventID === eventId);
    return eventDoc ? (eventDoc.data() as Event) : null;
  }
}

export default EventsRepository;