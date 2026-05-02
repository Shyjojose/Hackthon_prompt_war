import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db, isDemoMode } from '../services/firebase';
import type { PollingStation } from '../types';

export const usePollingStations = () => {
  const [stations, setStations] = useState<PollingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoMode) {
      const loadLocal = () => {
        const localData = localStorage.getItem('demo_stations');
        if (localData) {
          setStations(JSON.parse(localData));
        }
        setLoading(false);
      };

      loadLocal();
      window.addEventListener('demo-data-updated', loadLocal);
      return () => window.removeEventListener('demo-data-updated', loadLocal);
    }

    // Live Firebase Logic
    try {
      const q = query(collection(db, 'polling_stations'));
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const stationsData: PollingStation[] = [];
          querySnapshot.forEach((doc) => {
            stationsData.push({ id: doc.id, ...doc.data() } as PollingStation);
          });
          setStations(stationsData);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { stations, loading, error };
};
