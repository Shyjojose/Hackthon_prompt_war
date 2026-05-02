import { useState, useEffect } from 'react';
import type { Location } from '../types';

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    
    // Watch position for real-time movement
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
};
