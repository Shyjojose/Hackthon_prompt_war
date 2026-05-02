import { describe, it, expect } from 'vitest';
import {
  SUPPORTED_LANGUAGES,
  ASSIGNED_PRECINCT_NAME,
  ASSIGNED_PRECINCT_ID,
  UI_MESSAGES,
  STATION_STATUS,
  INCIDENT_REPORTING,
  FIREBASE_COLLECTIONS,
  LOCAL_STORAGE_KEYS,
} from './constants';

describe('Application Constants', () => {
  it('should have all required supported languages', () => {
    expect(SUPPORTED_LANGUAGES).toContain('English');
    expect(SUPPORTED_LANGUAGES).toContain('Spanish');
    expect(SUPPORTED_LANGUAGES).toContain('Hindi');
    expect(SUPPORTED_LANGUAGES).toContain('Tamil');
    expect(SUPPORTED_LANGUAGES).toContain('French');
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThan(0);
  });

  it('should have valid precinct identifiers', () => {
    expect(ASSIGNED_PRECINCT_NAME).toBeDefined();
    expect(ASSIGNED_PRECINCT_ID).toBeDefined();
    expect(ASSIGNED_PRECINCT_NAME.length).toBeGreaterThan(0);
    expect(ASSIGNED_PRECINCT_ID.length).toBeGreaterThan(0);
  });

  it('should have all required UI messages', () => {
    expect(UI_MESSAGES.DASHBOARD_TITLE).toBeDefined();
    expect(UI_MESSAGES.DASHBOARD_SUBTITLE).toBeDefined();
    expect(UI_MESSAGES.SEED_MOCK_DATA).toBeDefined();
    expect(UI_MESSAGES.INCIDENT_FORM_TITLE).toBeDefined();
    expect(UI_MESSAGES.ADVICE_UNAVAILABLE).toBeDefined();
  });

  it('should have all station status values', () => {
    expect(STATION_STATUS.OPEN).toBe('open');
    expect(STATION_STATUS.BUSY).toBe('busy');
    expect(STATION_STATUS.INCIDENT).toBe('incident');
    expect(STATION_STATUS.WARNING).toBe('warning');
    expect(STATION_STATUS.CLOSED).toBe('closed');
  });

  it('should have incident reporting limits', () => {
    expect(INCIDENT_REPORTING.MAX_DESCRIPTION_LENGTH).toBeGreaterThan(0);
    expect(INCIDENT_REPORTING.MIN_DESCRIPTION_LENGTH).toBeGreaterThan(0);
    expect(INCIDENT_REPORTING.MAX_DESCRIPTION_LENGTH).toBeGreaterThanOrEqual(INCIDENT_REPORTING.MIN_DESCRIPTION_LENGTH);
  });

  it('should have all required Firebase collection names', () => {
    expect(FIREBASE_COLLECTIONS.POLLING_STATIONS).toBeDefined();
    expect(FIREBASE_COLLECTIONS.INCIDENTS).toBeDefined();
    expect(FIREBASE_COLLECTIONS.USERS).toBeDefined();
    expect(FIREBASE_COLLECTIONS.FEEDBACK).toBeDefined();
  });

  it('should have all required localStorage keys', () => {
    expect(LOCAL_STORAGE_KEYS.GEOLOCATION_CONSENT).toBeDefined();
    expect(LOCAL_STORAGE_KEYS.DEMO_STATIONS).toBeDefined();
    expect(LOCAL_STORAGE_KEYS.LANGUAGE_PREFERENCE).toBeDefined();
  });

  it('should have consistent string values in UI messages', () => {
    Object.values(UI_MESSAGES).forEach((value: unknown) => {
      expect(typeof value).toBe('string');
      expect((value as string).length).toBeGreaterThan(0);
    });
  });
});
