import { collection, addDoc, getDocs, query, writeBatch } from 'firebase/firestore';
import { db, isDemoMode } from '../services/firebase';

const MOCK_STATIONS = [
  {
    id: "station-1",
    name: "Dallas Central Library (Precinct 104)",
    address: "1515 Young St, Dallas, TX 75201",
    location: { lat: 32.7767, lng: -96.7970 },
    status: "busy",
    queueWaitTime: 45,
    officialNotes: "New precinct rules in effect. Ensure this is your assigned location.",
    precinctRules: ["Assigned Precinct Only", "Valid Photo ID Required"]
  },
  {
    id: "station-2",
    name: "Howrah Primary School",
    address: "Howrah, West Bengal, India",
    location: { lat: 22.5958, lng: 88.2636 },
    status: "incident",
    queueWaitTime: 120,
    officialNotes: "Technical maintenance on EVM #3. Official technicians on-site. Please remain calm.",
    precinctRules: ["Voter ID Card required"]
  },
  {
    id: "station-3",
    name: "Salem Community Center",
    address: "Salem, Tamil Nadu, India",
    location: { lat: 11.6643, lng: 78.1460 },
    status: "open",
    queueWaitTime: 15,
    officialNotes: "Clear communication channels open between agents and voters.",
    precinctRules: ["Standard COVID protocols"]
  },
  {
    id: "station-4",
    name: "Westminster Town Hall",
    address: "London, UK",
    location: { lat: 51.4993, lng: -0.1273 },
    status: "warning",
    queueWaitTime: 60,
    officialNotes: "Closing at 10 PM. Anyone in line by 10 PM will be allowed to vote.",
    precinctRules: ["Closing time strictly 10 PM"]
  }
];

export const seedDatabase = async () => {
  if (isDemoMode) {
    localStorage.setItem('demo_stations', JSON.stringify(MOCK_STATIONS));
    window.dispatchEvent(new CustomEvent('demo-data-updated'));
    return;
  }

  // Live Firebase logic with efficient Batch
  const q = query(collection(db, 'polling_stations'));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  for (const station of MOCK_STATIONS) {
    const { id, ...data } = station; // Don't send local ID to Firebase
    await addDoc(collection(db, 'polling_stations'), {
      ...data,
      lastUpdated: new Date()
    });
  }
};
