import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useWcdStore from './context/WcdStore'
import Overview from './pages/Overview'
import HealthNutrition from './pages/HealthNutrition'
import AwarenessBehaviour from './pages/AwarenessBehaviour'

/**
 * WCD Dashboard — App Root
 * Initializes the Zustand store and sets up routing.
 */
function App() {
  const { initData, loading, error } = useWcdStore()

  useEffect(() => {
    initData()
  }, [initData])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--wcd-bg-page)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}>
        {/* Loading spinner */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--wcd-radius-lg)',
          background: 'linear-gradient(135deg, var(--wcd-teal-500), var(--wcd-blue-500))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--wcd-font-display)',
          fontWeight: 800,
          fontSize: '0.65rem',
          color: 'white',
          letterSpacing: '0.08em',
          animation: 'wcd-pulse 1.5s ease-in-out infinite',
        }}>
          WCD
        </div>
        <div style={{
          fontFamily: 'var(--wcd-font-display)',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--wcd-text-primary)',
        }}>
          Women &amp; Child Development
        </div>
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--wcd-text-muted)',
          animation: 'wcd-pulse 1.5s ease-in-out infinite',
        }}>
          Loading dashboard data...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--wcd-bg-page)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          background: 'var(--wcd-bg-card)',
          border: '1px solid var(--wcd-coral-400)',
          borderRadius: 'var(--wcd-radius-lg)',
          padding: 32,
          maxWidth: 400,
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--wcd-coral-400)',
            marginBottom: 8,
          }}>
            Failed to Load Dashboard
          </div>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--wcd-text-muted)',
            marginBottom: 16,
          }}>
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 20px',
              background: 'var(--wcd-teal-500)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--wcd-radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/health" element={<HealthNutrition />} />
        <Route path="/awareness" element={<AwarenessBehaviour />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
