import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import type { PollingStation, Location } from '../types';

interface BoothMapProps {
  stations: PollingStation[];
  userLocation: Location | null;
}

export const BoothMap: React.FC<BoothMapProps> = ({ stations, userLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey.includes('placeholder')) {
      console.warn("Google Maps API Key missing or placeholder. Map will not load.");
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#eee;color:#666;border-radius:12px;">
            Please provide a valid VITE_GOOGLE_MAPS_API_KEY in .env to view the map.
          </div>
        `;
      }
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const center = userLocation || { lat: 32.7767, lng: -96.7970 };
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom: 12,
        });

        if (userLocation) {
          new google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Your Location",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "white",
            }
          });
        }

        stations.forEach(station => {
          const marker = new google.maps.Marker({
            position: station.location,
            map: map,
            title: station.name,
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>${station.name}</strong><br/>Wait: ${station.queueWaitTime} min</div>`,
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });
      }
    }).catch(e => {
      console.error("Maps loader failed:", e);
    });
  }, [stations, userLocation]);

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height: '400px', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e5e7eb' }} 
      aria-label="Map showing polling station locations"
    />
  );
};
