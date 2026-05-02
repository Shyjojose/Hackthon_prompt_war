import React, { useState, memo } from 'react';
import type { PollingStation, BoothStatus } from '../types';
import { IncidentForm } from './IncidentForm';

interface BoothCardProps {
  station: PollingStation;
  onSelect: (station: PollingStation) => void;
}

const statusColors: Record<BoothStatus, string> = {
  open: '#10b981',    // Green
  busy: '#f59e0b',    // Orange
  incident: '#ef4444', // Red
  warning: '#f43f5e',  // Pink/Red
  closed: '#6b7280'    // Gray
};

export const BoothCard: React.FC<BoothCardProps> = memo(({ station, onSelect }) => {
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  return (
    <div 
      onClick={() => onSelect(station)}
      style={{
        padding: '1.5rem',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        borderLeft: `6px solid ${statusColors[station.status]}`,
        cursor: 'pointer',
        transition: 'transform 0.2s',
        marginBottom: '1rem',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        zIndex: showIncidentForm ? 1001 : 1
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      role="button"
      aria-label={`View details for ${station.name}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>{station.name}</h3>
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: 'bold', 
          textTransform: 'uppercase',
          color: statusColors[station.status],
          backgroundColor: `${statusColors[station.status]}20`,
          padding: '2px 8px',
          borderRadius: '9999px'
        }}>
          {station.status}
        </span>
      </div>
      
      <p style={{ margin: '0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>{station.address}</p>
      
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{station.queueWaitTime}</span>
          <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '4px' }}>min wait</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowIncidentForm(true);
          }}
          style={{
            fontSize: '0.75rem',
            color: '#ef4444',
            border: '1px solid #ef4444',
            backgroundColor: 'transparent',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          aria-label={`Report an incident at ${station.name}`}
        >
          Report Issue
        </button>
      </div>

      {station.officialNotes && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '8px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '6px',
          fontSize: '0.8125rem',
          fontStyle: 'italic',
          color: '#374151'
        }}>
          " {station.officialNotes} "
        </div>
      )}

      {showIncidentForm && (
        <IncidentForm 
          boothId={station.id} 
          boothName={station.name} 
          onClose={() => setShowIncidentForm(false)} 
        />
      )}
    </div>
  );
});

BoothCard.displayName = 'BoothCard';
