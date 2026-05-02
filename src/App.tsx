import { useEffect } from 'react'
import { Dashboard } from './components/Dashboard'
import { ErrorBoundary } from './components/ErrorBoundary'
import { validateFirebaseConfig, validateAPIConfig } from './utils/env'
import { logger } from './services/logger'

function App() {
  useEffect(() => {
    // Validate critical configuration on app startup
    try {
      validateFirebaseConfig();
      validateAPIConfig();
    } catch (error) {
      logger.error('App startup validation failed', error as Error);
      // Don't crash the app; let it fall back to demo mode
    }
  }, []);

  return (
    <ErrorBoundary>
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        color: '#111827',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <Dashboard />
      </div>
    </ErrorBoundary>
  )
}

export default App
