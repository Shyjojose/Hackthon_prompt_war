import { describe, it, expect, beforeEach } from 'vitest';
import { logger } from './logger';

describe('Logger Service', () => {
  beforeEach(() => {
    logger.clear();
  });

  it('should log error messages with context', () => {
    const testError = new Error('Test error');
    const context = { component: 'TestComponent', action: 'testAction' };
    
    logger.error('Something went wrong', testError, context);
    const logs = logger.getLogs();
    
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('error');
    expect(logs[0].message).toBe('Something went wrong');
    expect(logs[0].context).toEqual(context);
  });

  it('should log warn messages', () => {
    const context = { severity: 'medium' };
    logger.warn('Warning message', context);
    
    const logs = logger.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('warn');
    expect(logs[0].message).toBe('Warning message');
  });

  it('should log info messages', () => {
    logger.info('Info message');
    
    const logs = logger.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('info');
  });

  it('should log debug messages', () => {
    logger.debug('Debug message');
    
    const logs = logger.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].level).toBe('debug');
  });

  it('should respect maximum log limit (100)', () => {
    for (let i = 0; i < 150; i++) {
      logger.info(`Message ${i}`);
    }
    
    const logs = logger.getLogs();
    expect(logs.length).toBeLessThanOrEqual(100);
  });

  it('should clear all logs', () => {
    logger.info('Message 1');
    logger.info('Message 2');
    logger.clear();
    
    const logs = logger.getLogs();
    expect(logs.length).toBe(0);
  });

  it('should include timestamp property in logs', () => {
    logger.info('Timestamped message');
    
    const logs = logger.getLogs();
    expect(logs[0]).toHaveProperty('timestamp');
    expect(logs[0].timestamp).toBeDefined();
  });
});
