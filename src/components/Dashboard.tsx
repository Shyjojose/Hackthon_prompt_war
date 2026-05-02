import React, { useState } from 'react';
import { usePollingStations } from '../hooks/usePollingStations';
import { useGeolocation } from '../hooks/useGeolocation';
import { BoothCard } from './BoothCard';
import { BoothMap } from './BoothMap';
import type { PollingStation } from '../types';
import { getSmartAdvice } from '../services/gemini';
import { seedDatabase } from '../utils/seedData';

const LANGUAGES = ['English', 'Spanish', 'Hindi', 'Tamil', 'French'];

export const Dashboard: React.FC = () => {
  const { stations, loading, error: stationsError } = usePollingStations();
  const { location: userLocation, error: geoError } = useGeolocation();
  const [selectedStation, setSelectedStation] = useState<PollingStation | null>(null);
  const [advice, setAdvice] = useState<string>('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [seeding, setSeeding] = useState(false);

  // Mock assigned precinct for demonstration
  const ASSIGNED_PRECINCT_NAME = "Dallas Central Library (Precinct 104)";

  const handleSeed = async () => {
    if (window.confirm("Seed database with mock stations? This will clear existing data.")) {
      setSeeding(true);
      try {
        await seedDatabase();
        alert("Database seeded! If stations don't appear, check your Firebase configuration.");
      } catch (err) {
        alert("Failed to seed: " + (err instanceof Error ? err.message : String(err)));
      } finally {
        setSeeding(false);
      }
    }
  };

  const handleStationSelect = async (station: PollingStation) => {
    setSelectedStation(station);
    setAdviceLoading(true);
    try {
      const isCorrectPrecinct = station.name === ASSIGNED_PRECINCT_NAME;
      const context = `
        User Current Lat: ${userLocation?.lat || 'Unknown'}, Lng: ${userLocation?.lng || 'Unknown'}
        Selected Station: ${station.name}
        Station Status: ${station.status}
        Wait Time: ${station.queueWaitTime} minutes
        Official Notes: ${station.officialNotes || 'None'}
        User's Assigned Precinct: ${ASSIGNED_PRECINCT_NAME}
        Is Correct Precinct: ${isCorrectPrecinct ? 'YES' : 'NO'}
        Current Time: ${new Date().toLocaleTimeString()}
      `;
      
      const smartAdvice = await getSmartAdvice(context, language);
      setAdvice(smartAdvice);
    } catch (error) {
      setAdvice('Unable to get advice. Please verify your precinct on the official board.');
    } finally {
      setAdviceLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#111827' }}>Civic Navigator</h1>
        <p style={{ color: '#6b7280' }}>Real-time Booth Status & Smart Voter Assistance</p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
            aria-label="Select Language"
          >
            {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
          </select>
          <button 
            onClick={handleSeed}
            disabled={seeding}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: seeding ? 'wait' : 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {seeding ? 'Seeding...' : 'Seed Mock Data'}
          </button>
        </div>
      </header>

      {stationsError && (
        <div style={{ backgroundColor: '#fff7ed', color: '#9a3412', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #fdba74' }}>
          <strong>Database Syncing Issue:</strong> {stationsError}. <br/>
          <em>Tip: Click "Seed Mock Data" or check your .env configuration.</em>
        </div>
      )}

      {geoError && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }} role="alert">
          <strong>Location Error:</strong> {geoError}. We recommend enabling location for precinct verification.
        </div>
      )}

      <BoothMap stations={stations} userLocation={userLocation} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', gridAutoFlow: 'row' }}>
        <section aria-labelledby="stations-title">
          <h2 id="stations-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#374151' }}>Polling Stations Near You</h2>
          
          {loading ? (
            <p>Connecting to database...</p>
          ) : stations.length === 0 ? (
            <div style={{ padding: '2rem', backgroundColor: '#f3f4f6', borderRadius: '12px', textAlign: 'center' }}>
              <p>No active stations found in your database.</p>
              <button 
                onClick={handleSeed}
                style={{ color: '#4f46e5', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Click here to seed mock data
              </button>
            </div>
          ) : (
            stations.map(station => (
              <BoothCard 
                key={station.id} 
                station={station} 
                onSelect={handleStationSelect} 
              />
            ))
          )}
        </section>

        <section 
          aria-labelledby="assistant-title"
          style={{ 
            backgroundColor: '#f9fafb', 
            padding: '2rem', 
            borderRadius: '16px', 
            position: 'sticky', 
            top: '2rem',
            height: 'fit-content',
            border: '1px solid #e5e7eb'
          }}
        >
          <h2 id="assistant-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#374151' }}>Smart Assistant</h2>
          {!selectedStation ? (
            <p style={{ color: '#6b7280' }}>Select a polling station to receive real-time advice and de-escalation tips in {language}.</p>
          ) : (
            <div aria-live="polite">
              <h3 style={{ color: '#111827' }}>Analyzing {selectedStation.name}...</h3>
              {adviceLoading ? (
                <p>Generating smart advice in {language}...</p>
              ) : (
                <div style={{ 
                  backgroundColor: '#ffffff', 
                  padding: '1.5rem', 
                  borderRadius: '12px', 
                  lineHeight: '1.6',
                  color: '#4b5563',
                  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
                }}>
                  {advice}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
