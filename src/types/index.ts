export interface Location {
  lat: number;
  lng: number;
}

export type BoothStatus = 'open' | 'busy' | 'closed' | 'incident' | 'warning';

export interface PollingStation {
  id: string;
  name: string;
  address: string;
  location: Location;
  status: BoothStatus;
  queueWaitTime: number; // in minutes
  lastUpdated: number | { seconds: number; nanoseconds: number }; // Firebase Timestamp
  officialNotes?: string;
  precinctRules?: string[];
}

export interface Incident {
  id: string;
  boothId: string;
  type: 'malfunction' | 'misinformation' | 'crowd' | 'other';
  description: string;
  verified: boolean;
  timestamp: number | { seconds: number; nanoseconds: number }; // Firebase Timestamp
  reportedBy: string; // User ID (e.g., session ID or anonymous user ID)
}

export interface UserContext {
  homePrecinctId: string;
  currentLocation: Location;
  hasVoted: boolean;
}
