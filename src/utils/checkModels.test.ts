import { describe, expect, it } from 'vitest';
import { checkAvailableModels } from './checkModels';

describe('checkAvailableModels', () => {
  it('returns the fallback model list', async () => {
    await expect(checkAvailableModels('demo-key')).resolves.toEqual([
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro',
    ]);
  });
});