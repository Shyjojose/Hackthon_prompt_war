import { collection, addDoc, getDocs, query, writeBatch } from 'firebase/firestore';
import { db, isDemoMode } from '../services/firebase';
import { MOCK_STATIONS_DATA } from './constants';

export const seedDatabase = async () => {
  if (isDemoMode) {
    localStorage.setItem('demo_stations', JSON.stringify(MOCK_STATIONS_DATA));
    window.dispatchEvent(new CustomEvent('demo-data-updated'));
    return;
  }

  // Live Firebase logic with efficient Batch
  const q = query(collection(db, 'polling_stations'));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  for (const station of MOCK_STATIONS_DATA) {
    const { id, ...data } = station; // Don't send local ID to Firebase
    await addDoc(collection(db, 'polling_stations'), {
      ...data,
      lastUpdated: new Date()
    });
  }
};
