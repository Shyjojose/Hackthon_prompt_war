import { beforeEach, describe, expect, it, vi } from 'vitest';

const dispatchEvent = vi.fn();
const setItem = vi.fn();

vi.mock('../services/firebase', () => ({
  db: {},
  isDemoMode: true,
}));

describe('seedDatabase', () => {
  beforeEach(() => {
    setItem.mockClear();
    dispatchEvent.mockClear();
    vi.stubGlobal('localStorage', { setItem });
    vi.stubGlobal('window', { dispatchEvent });
  });

  it('stores the mock stations locally in demo mode', async () => {
    const { seedDatabase } = await import('./seedData');

    await seedDatabase();

    expect(setItem).toHaveBeenCalledWith('demo_stations', expect.any(String));
    expect(dispatchEvent).toHaveBeenCalledOnce();
  });
});