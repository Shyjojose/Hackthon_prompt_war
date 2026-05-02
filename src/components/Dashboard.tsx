import React, { useState, useCallback } from 'react';
import { usePollingStations } from '../hooks/usePollingStations';
import { useGeolocation } from '../hooks/useGeolocation';
import { BoothCard } from './BoothCard';
import { BoothMap } from './BoothMap';
import type { PollingStation } from '../types';
import { getSmartAdvice } from '../services/gemini';
import { seedDatabase } from '../utils/seedData';
import { logger } from '../services/logger';
import { SUPPORTED_LANGUAGES, ASSIGNED_PRECINCT_NAME, UI_MESSAGES } from '../utils/constants';

export const Dashboard: React.FC = () => {
  const { stations, loading, error: stationsError } = usePollingStations();
  const { location: userLocation, error: geoError, showConsentPrompt, onConsentGive, onConsentDeny } = useGeolocation();
  const [selectedStation, setSelectedStation] = useState<PollingStation | null>(null);
  const [advice, setAdvice] = useState<string>('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [seeding, setSeeding] = useState(false);

  const handleSeed = useCallback(async () => {
    if (window.confirm("Seed database with mock stations? This will clear existing data.")) {
      setSeeding(true);
      try {
        await seedDatabase();
        logger.info("Database seeded successfully");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        logger.error("Failed to seed database", err instanceof Error ? err : new Error(errorMsg));
      } finally {
        setSeeding(false);
      }
    }
  }, []);

  const handleStationSelect = useCallback(async (station: PollingStation) => {
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
    } catch {
      setAdvice(UI_MESSAGES.ADVICE_UNAVAILABLE);
    } finally {
      setAdviceLoading(false);
    }
  }, [userLocation, language]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#111827' }}>{UI_MESSAGES.DASHBOARD_TITLE}</h1>
        <p style={{ color: '#6b7280' }}>{UI_MESSAGES.DASHBOARD_SUBTITLE}</p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
            aria-label="Select Language"
          >
            {SUPPORTED_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
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
            {seeding ? UI_MESSAGES.SEEDING : UI_MESSAGES.SEED_MOCK_DATA}
          </button>
        </div>
      </header>

      {stationsError && (
        <div style={{ backgroundColor: '#fff7ed', color: '#9a3412', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #fdba74' }}>
          <strong>{UI_MESSAGES.DATABASE_SYNC_ERROR}:</strong> {stationsError}. <br/>
          <em>{UI_MESSAGES.DATABASE_SYNC_TIP}</em>
        </div>
      )}

      {geoError && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }} role="alert">
          <strong>{UI_MESSAGES.LOCATION_ERROR}:</strong> {geoError}. {UI_MESSAGES.LOCATION_RECOMMENDATION}
        </div>
      )}

      {showConsentPrompt && (
        <div style={{ backgroundColor: '#dbeafe', color: '#0c4a6e', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} role="alert">
          <div>
            <strong>{UI_MESSAGES.LOCATION_CONSENT_TITLE}:</strong> {UI_MESSAGES.LOCATION_CONSENT_MESSAGE}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={onConsentGive} style={{ padding: '0.5rem 1rem', backgroundColor: '#0369a1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}>
              {UI_MESSAGES.ENABLE_LOCATION}
            </button>
            <button onClick={onConsentDeny} style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: '#0c4a6e', border: '1px solid #0c4a6e', borderRadius: '4px', cursor: 'pointer', fontSize: '0.875rem' }}>
              {UI_MESSAGES.SKIP_LOCATION}
            </button>
          </div>
        </div>
      )}

      <BoothMap stations={stations} userLocation={userLocation} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', gridAutoFlow: 'row' }}>
        <section aria-labelledby="stations-title">
          <h2 id="stations-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#374151' }}>{UI_MESSAGES.STATIONS_SECTION_TITLE}</h2>
          
          {loading ? (
            <p>{UI_MESSAGES.CONNECTING_TO_DB}</p>
          ) : stations.length === 0 ? (
            <div style={{ padding: '2rem', backgroundColor: '#f3f4f6', borderRadius: '12px', textAlign: 'center' }}>
              <p>{UI_MESSAGES.NO_STATIONS_FOUND}</p>
              <button 
                onClick={handleSeed}
                style={{ color: '#4f46e5', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
              >
                {UI_MESSAGES.CLICK_TO_SEED}
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
          <h2 id="assistant-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#374151' }}>{UI_MESSAGES.ADVICE_SECTION_TITLE}</h2>
          {!selectedStation ? (
            <p style={{ color: '#6b7280' }}>Select a polling station to receive real-time advice and de-escalation tips in {language}.</p>
          ) : (
            <div aria-live="polite">
              <h3 style={{ color: '#111827' }}>Analyzing {selectedStation.name}...</h3>
              {adviceLoading ? (
                <p>{UI_MESSAGES.GETTING_ADVICE}</p>
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
