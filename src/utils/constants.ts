/**
 * Application-wide constants to eliminate magic strings and hardcoded values
 */

// Language options
export const SUPPORTED_LANGUAGES = ['English', 'Spanish', 'Hindi', 'Tamil', 'French'] as const;

// User preference constants
export const ASSIGNED_PRECINCT_NAME = 'Dallas Central Library (Precinct 104)';
export const ASSIGNED_PRECINCT_ID = 'station-1';

// UI text constants
export const UI_MESSAGES = {
  // Dashboard
  DASHBOARD_TITLE: 'Civic Navigator',
  DASHBOARD_SUBTITLE: 'Real-time Booth Status & Smart Voter Assistance',
  STATIONS_SECTION_TITLE: 'Polling Stations Near You',
  ADVICE_SECTION_TITLE: 'Smart Assistance',
  
  // Buttons
  SEED_MOCK_DATA: 'Seed Mock Data',
  SEEDING: 'Seeding...',
  ENABLE_LOCATION: 'Enable',
  SKIP_LOCATION: 'Skip',
  REPORT_ISSUE: 'Report Issue',
  SUBMIT: 'Submit',
  CANCEL: 'Cancel',
  
  // Errors
  DATABASE_SYNC_ERROR: 'Database Syncing Issue',
  DATABASE_SYNC_TIP: 'Tip: Click "Seed Mock Data" or check your .env configuration.',
  LOCATION_ERROR: 'Location Error',
  LOCATION_RECOMMENDATION: 'We recommend enabling location for precinct verification.',
  
  // Location consent
  LOCATION_CONSENT_TITLE: 'Location Services',
  LOCATION_CONSENT_MESSAGE: 'Enable location to verify your precinct assignment and get better polling station recommendations.',
  
  // Empty state
  NO_STATIONS_FOUND: 'No active stations found in your database.',
  CLICK_TO_SEED: 'Click here to seed mock data',
  
  // Connectivity
  CONNECTING_TO_DB: 'Connecting to database...',
  
  // Incident form
  INCIDENT_FORM_TITLE: 'Report an Issue',
  INCIDENT_FORM_STATION_LABEL: 'Station',
  INCIDENT_FORM_DESCRIPTION_LABEL: 'Description (max 500 characters)',
  INCIDENT_FORM_DESCRIPTION_HINT: 'characters remaining',
  INCIDENT_FORM_SUCCESS: 'Thank you for reporting this issue. Our team will review it shortly.',
  INCIDENT_FORM_ERROR: 'Failed to submit report. Please try again.',
  INCIDENT_REQUIRED: 'Please describe the incident',
  
  // Smart advice
  GETTING_ADVICE: 'Getting smart advice...',
  ADVICE_UNAVAILABLE: 'Unable to get advice. Please verify your precinct on the official board.',
  
  // Precinct verification
  CORRECT_PRECINCT_MESSAGE: 'You are at your assigned polling location.',
  WRONG_PRECINCT_MESSAGE: 'You appear to be at a different location than your assignment.',
} as const;

// Time constants (in milliseconds)
export const TIME_CONSTANTS = {
  POLL_CLOSING_HOUR: 22, // 10 PM
  GEO_WATCH_TIMEOUT: 10000, // 10 seconds
  GEO_HIGH_ACCURACY_TIMEOUT: 60000, // 60 seconds
  GEO_ACCURACY_TIMEOUT: 5000, // 5 seconds
} as const;

// Geolocation constants
export const GEO_ACCURACY = {
  HIGH: { enableHighAccuracy: true, timeout: TIME_CONSTANTS.GEO_HIGH_ACCURACY_TIMEOUT, maximumAge: 0 },
  BALANCED: { enableHighAccuracy: false, timeout: TIME_CONSTANTS.GEO_ACCURACY_TIMEOUT, maximumAge: 5000 },
  LOW: { enableHighAccuracy: false, timeout: TIME_CONSTANTS.GEO_WATCH_TIMEOUT, maximumAge: 60000 },
} as const;

// Polling station status options
export const STATION_STATUS = {
  OPEN: 'open',
  BUSY: 'busy',
  INCIDENT: 'incident',
  WARNING: 'warning',
  CLOSED: 'closed',
} as const;

// Polling station icons and colors
export const STATUS_CONFIG = {
  [STATION_STATUS.OPEN]: { emoji: '✅', color: '#10b981', label: 'Open' },
  [STATION_STATUS.BUSY]: { emoji: '⏳', color: '#f59e0b', label: 'Busy' },
  [STATION_STATUS.INCIDENT]: { emoji: '⚠️', color: '#ef4444', label: 'Incident' },
  [STATION_STATUS.WARNING]: { emoji: '🔔', color: '#8b5cf6', label: 'Warning' },
  [STATION_STATUS.CLOSED]: { emoji: '🚫', color: '#6b7280', label: 'Closed' },
} as const;

// Incident reporting
export const INCIDENT_REPORTING = {
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_DESCRIPTION_LENGTH: 10,
} as const;

// Mock data constants
export const MOCK_STATIONS_DATA = [
  {
    id: 'station-1',
    name: 'Dallas Central Library (Precinct 104)',
    address: '1515 Young St, Dallas, TX 75201',
    location: { lat: 32.7767, lng: -96.797 },
    status: 'busy',
    queueWaitTime: 45,
    officialNotes: 'New precinct rules in effect. Ensure this is your assigned location.',
    precinctRules: ['Assigned Precinct Only', 'Valid Photo ID Required'],
  },
  {
    id: 'station-2',
    name: 'Howrah Primary School',
    address: 'Howrah, West Bengal, India',
    location: { lat: 22.5958, lng: 88.2636 },
    status: 'incident',
    queueWaitTime: 120,
    officialNotes: 'Technical maintenance on EVM #3. Official technicians on-site. Please remain calm.',
    precinctRules: ['Voter ID Card required'],
  },
  {
    id: 'station-3',
    name: 'Salem Community Center',
    address: 'Salem, Tamil Nadu, India',
    location: { lat: 11.6643, lng: 78.146 },
    status: 'open',
    queueWaitTime: 15,
    officialNotes: 'Clear communication channels open between agents and voters.',
    precinctRules: ['Standard COVID protocols'],
  },
  {
    id: 'station-4',
    name: 'Westminster Town Hall',
    address: 'London, UK',
    location: { lat: 51.4993, lng: -0.1273 },
    status: 'warning',
    queueWaitTime: 60,
    officialNotes: 'Closing at 10 PM. Anyone in line by 10 PM will be allowed to vote.',
    precinctRules: ['Closing time strictly 10 PM'],
  },
] as const;

// Firebase collection names
export const FIREBASE_COLLECTIONS = {
  POLLING_STATIONS: 'polling_stations',
  INCIDENTS: 'incidents',
  USERS: 'users',
  FEEDBACK: 'feedback',
} as const;

// LocalStorage keys
export const LOCAL_STORAGE_KEYS = {
  GEOLOCATION_CONSENT: 'geolocation_consent',
  DEMO_STATIONS: 'demo_stations',
  LANGUAGE_PREFERENCE: 'language_preference',
  THEME_PREFERENCE: 'theme_preference',
} as const;
