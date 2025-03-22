import { collection, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Use shared db

export interface Participant {
  pid: string;
  mid: string; // Foreign key
}

// Repository to manage participant data
export class ParticipantRepository {
  private collectionRef = collection(db, "Participant"); // Use shared db

  // Add a participant to the database
  async addParticipant(participant: Participant): Promise<void> {
    const docRef = doc(this.collectionRef, participant.pid);
    await setDoc(docRef, participant);
  }

  // Get a participant from the database by their participant ID
  async getParticipant(pid: string): Promise<Participant | null> {
    const docRef = doc(this.collectionRef, pid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Participant) : null;
  }

}

// Factory to create participant instances
export class ParticipantFactory {
  static createParticipant(pid: string, mid: string): Participant {
    return { pid, mid };
  }
}

export default ParticipantRepository;
