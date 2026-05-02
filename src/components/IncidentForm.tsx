import React, { useState } from 'react';
import { reportIncident } from '../services/incidents';

interface IncidentFormProps {
  boothId: string;
  boothName: string;
  onClose: () => void;
}

export const IncidentForm: React.FC<IncidentFormProps> = ({ boothId, boothName, onClose }) => {
  const [type, setType] = useState('malfunction');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reportIncident(boothId, type, description);
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (error) {
      alert("Failed to report incident. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px'
      }} role="dialog" aria-labelledby="incident-title">
        <h2 id="incident-title" style={{ marginTop: 0 }}>Report Incident at {boothName}</h2>
        
        {success ? (
          <div style={{ color: '#10b981', textAlign: 'center', padding: '1rem' }}>
            Report submitted successfully. Thank you for helping keep the process transparent.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="type" style={{ display: 'block', marginBottom: '0.5rem' }}>Issue Type</label>
              <select 
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
              >
                <option value="malfunction">Machine Malfunction</option>
                <option value="crowd">Crowd Control Issue</option>
                <option value="misinformation">Misinformation/Confusion</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="desc" style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
              <textarea 
                id="desc"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', minHeight: '100px' }}
                placeholder="Please provide details about the situation..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={onClose}
                style={{ padding: '0.5rem 1rem', border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: '#ef4444', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: submitting ? 'not-allowed' : 'pointer' 
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
