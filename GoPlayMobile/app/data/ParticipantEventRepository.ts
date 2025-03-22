import { collection, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Use shared db
import { Event } from "./EventsRepository"; // Import Event type

export interface ParticipantEvent {
  pid: string;
  AttendanceState: number; // Small int
  EventID: number;
}

export class ParticipantEventRepository {
  private collectionRef = collection(db, "ParticipantEvent"); // Use shared db

  async addParticipantEvent(participantEvent: ParticipantEvent): Promise<void> {
    const docRef = doc(this.collectionRef); // Generate a new unique document ID
    await setDoc(docRef, participantEvent); // Save ParticipantEvent as a new record
  }

  async getParticipantEvent(pid: string, event: Event): Promise<ParticipantEvent | null> {
    const docRef = doc(this.collectionRef, `${pid}_${event.EventID}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as ParticipantEvent) : null;
  }  
}

export class ParticipantEventFactory {
  static createParticipantEvent(pid: string, AttendanceState: number, EventID: number): ParticipantEvent {
    return { pid, AttendanceState, EventID };
  }
}

export default ParticipantEventRepository;
