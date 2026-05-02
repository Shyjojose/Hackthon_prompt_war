import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Dashboard } from './Dashboard';
import type { PollingStation } from '../types';

const station: PollingStation = {
  id: 'station-1',
  name: 'Dallas Central Library (Precinct 104)',
  address: '1515 Young St, Dallas, TX 75201',
  location: { lat: 32.7767, lng: -96.797 },
  status: 'busy',
  queueWaitTime: 45,
  lastUpdated: Date.now(),
  officialNotes: 'Open and ready',
  precinctRules: ['Assigned Precinct Only'],
};

vi.mock('../hooks/usePollingStations', () => ({
  usePollingStations: () => ({
    stations: [station],
    loading: false,
    error: null,
  }),
}));

vi.mock('../hooks/useGeolocation', () => ({
  useGeolocation: () => ({
    location: null,
    error: null,
  }),
}));

vi.mock('./BoothMap', () => ({
  BoothMap: () => <div data-testid="booth-map" />,
}));

vi.mock('./BoothCard', () => ({
  BoothCard: ({ station, onSelect }: { station: PollingStation; onSelect: (station: PollingStation) => void }) => (
    <button type="button" onClick={() => onSelect(station)}>
      {station.name}
    </button>
  ),
}));

vi.mock('../services/gemini', () => ({
  getSmartAdvice: vi.fn().mockResolvedValue('Mock smart advice'),
}));

describe('Dashboard', () => {
  it('renders the main dashboard controls and shows advice after selecting a station', async () => {
    render(<Dashboard />);

    expect(screen.getByRole('heading', { name: 'Civic Navigator' })).toBeInTheDocument();
    expect(screen.getByLabelText('Select Language')).toHaveValue('English');
    expect(screen.getByRole('button', { name: /seed mock data/i })).toBeInTheDocument();
    expect(screen.getByTestId('booth-map')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: station.name }));

    await waitFor(() => {
      expect(screen.getByText('Mock smart advice')).toBeInTheDocument();
    });
  });
});