import React, { useState, useRef, useEffect } from 'react';
import { reportIncident } from '../services/incidents';
import { logger } from '../services/logger';
import { UI_MESSAGES, INCIDENT_REPORTING } from '../utils/constants';

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
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  // Focus on description input when modal opens for better accessibility
  useEffect(() => {
    descriptionInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedDescription = description.trim();
    
    if (!trimmedDescription) {
      logger.warn("Incident form submitted with empty description");
      alert(UI_MESSAGES.INCIDENT_REQUIRED);
      return;
    }
    
    if (trimmedDescription.length > INCIDENT_REPORTING.MAX_DESCRIPTION_LENGTH) {
      logger.warn(`Incident description too long: ${trimmedDescription.length} chars (max ${INCIDENT_REPORTING.MAX_DESCRIPTION_LENGTH})`);
      alert(`Description must be ${INCIDENT_REPORTING.MAX_DESCRIPTION_LENGTH} characters or less. Current: ${trimmedDescription.length}.`);
      return;
    }
    
    setSubmitting(true);
    try {
      await reportIncident(boothId, type, trimmedDescription);
      logger.info(`Incident reported: type=${type}, booth=${boothId}`);
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (error) {
      logger.error("Failed to report incident", error instanceof Error ? error : new Error(String(error)));
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
      }} role="dialog" aria-labelledby="incident-title" aria-modal="true">
        <h2 id="incident-title" style={{ marginTop: 0 }}>{UI_MESSAGES.INCIDENT_FORM_TITLE} at {boothName}</h2>
        
        {success ? (
          <div style={{ color: '#10b981', textAlign: 'center', padding: '1rem' }}>
            {UI_MESSAGES.INCIDENT_FORM_SUCCESS}
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
              <label htmlFor="desc" style={{ display: 'block', marginBottom: '0.5rem' }}>{UI_MESSAGES.INCIDENT_FORM_DESCRIPTION_LABEL}</label>
              <textarea 
                id="desc"
                ref={descriptionInputRef}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, INCIDENT_REPORTING.MAX_DESCRIPTION_LENGTH))}
                maxLength={INCIDENT_REPORTING.MAX_DESCRIPTION_LENGTH}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', minHeight: '100px' }}
                placeholder="Please provide details about the situation..."
                aria-describedby="desc-counter"
              />
              <div id="desc-counter" style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                {description.length}/{INCIDENT_REPORTING.MAX_DESCRIPTION_LENGTH} {UI_MESSAGES.INCIDENT_FORM_DESCRIPTION_HINT}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={onClose}
                style={{ padding: '0.5rem 1rem', border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                {UI_MESSAGES.CANCEL}
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
                {submitting ? UI_MESSAGES.INCIDENT_FORM_STATION_LABEL : UI_MESSAGES.SUBMIT}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
