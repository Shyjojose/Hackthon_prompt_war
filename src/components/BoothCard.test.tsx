import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BoothCard } from './BoothCard';
import type { PollingStation } from '../types';

vi.mock('./IncidentForm', () => ({
  IncidentForm: ({ boothName }: { boothName: string }) => <div data-testid="incident-form">{boothName}</div>,
}));

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

describe('BoothCard', () => {
  it('calls onSelect when the card is clicked', () => {
    const onSelect = vi.fn();

    render(<BoothCard station={station} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /view details for/i }));

    expect(onSelect).toHaveBeenCalledWith(station);
  });

  it('opens the incident form when report issue is clicked', () => {
    const onSelect = vi.fn();

    render(<BoothCard station={station} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /report an incident at/i }));

    expect(screen.getByTestId('incident-form')).toHaveTextContent(station.name);
  });
});