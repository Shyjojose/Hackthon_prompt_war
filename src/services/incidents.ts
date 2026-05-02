import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isDemoMode } from './firebase';

export const reportIncident = async (boothId: string, type: string, description: string) => {
  if (isDemoMode) {
    console.log(`[DEMO] Incident Reported for ${boothId}: ${type} - ${description}`);
    // Simulate a network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("demo-incident-id");
      }, 500);
    });
  }

  try {
    const docRef = await addDoc(collection(db, 'incidents'), {
      boothId,
      type,
      description,
      verified: false,
      timestamp: serverTimestamp(),
      reportedBy: 'anonymous'
    });
    return docRef.id;
  } catch (error) {
    console.error("Error reporting incident: ", error);
    throw error;
  }
};
