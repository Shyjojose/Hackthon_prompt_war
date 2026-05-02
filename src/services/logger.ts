/**
 * Application logging service
 * Provides consistent error, warning, and info logging across the app
 * Can be extended to send logs to a remote service (e.g., Sentry) in production
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 100; // Keep recent logs in memory

  /**
   * Log an error message
   */
  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this._log('error', message, context, error);
    console.error(`❌ [ERROR] ${message}`, error, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, unknown>) {
    this._log('warn', message, context);
    console.warn(`⚠️ [WARN] ${message}`, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, unknown>) {
    this._log('info', message, context);
    console.info(`ℹ️ [INFO] ${message}`, context);
  }

  /**
   * Log a debug message (only in dev mode)
   */
  debug(message: string, context?: Record<string, unknown>) {
    if (import.meta.env.DEV) {
      this._log('debug', message, context);
      console.debug(`🐛 [DEBUG] ${message}`, context);
    }
  }

  /**
   * Internal logging method
   */
  private _log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };

    this.logs.push(entry);

    // Keep memory bounded
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }
  }

  /**
   * Get all logged entries (for debugging or sending to remote service)
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  clear() {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Helper: Show user-friendly error notification
 * Use this for user-facing errors (e.g., in try-catch blocks)
 */
export const notifyUserError = (message: string, error?: Error) => {
  logger.error(message, error);
  // Could be extended to show a toast or modal to the user
  if (typeof window !== 'undefined' && 'alert' in window) {
    window.alert(`Error: ${message}`);
  }
};

/**
 * Helper: Show user-friendly success notification
 */
export const notifyUserSuccess = (message: string) => {
  logger.info(message);
  // Could be extended to show a toast notification
};
