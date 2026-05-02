import { useState, useEffect } from 'react';
import type { Location } from '../types';
import { logger } from '../services/logger';

export const useGeolocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(() => {
    const savedConsent = localStorage.getItem('geolocation_consent');
    return savedConsent === 'true';
  });
  const [showConsentPrompt, setShowConsentPrompt] = useState(() => {
    const savedConsent = localStorage.getItem('geolocation_consent');
    return savedConsent !== 'true';
  });

  // Request geolocation permission after user consent
  useEffect(() => {
    if (!consentGiven) return;

    if (!navigator.geolocation) {
      const msg = 'Geolocation is not supported by your browser';
      logger.warn(msg);
        // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(msg);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      logger.debug('Geolocation updated', { lat: position.coords.latitude, lng: position.coords.longitude });
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error.message);
      logger.warn(`Geolocation error: ${error.message}`);
    };

    // Request initial position (with timeout)
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      timeout: 10000,
      enableHighAccuracy: false,
    });
    
    // Watch position for real-time movement (at lower precision to save battery)
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      timeout: 30000,
      enableHighAccuracy: false,
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [consentGiven]);

  const handleConsentGive = () => {
    localStorage.setItem('geolocation_consent', 'true');
    setConsentGiven(true);
    setShowConsentPrompt(false);
    logger.info('User granted geolocation consent');
  };

  const handleConsentDeny = () => {
    localStorage.setItem('geolocation_consent', 'false');
    setShowConsentPrompt(false);
    setError('Geolocation access declined. Precinct verification will not be available.');
    logger.info('User denied geolocation consent');
  };

  return { location, error, showConsentPrompt, onConsentGive: handleConsentGive, onConsentDeny: handleConsentDeny };
};
