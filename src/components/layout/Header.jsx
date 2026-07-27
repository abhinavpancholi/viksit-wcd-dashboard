import React from 'react'

/**
 * WCD Dashboard Header — Light Theme
 */
export default function Header({ pageSubtitle = 'Viksit Gujarat Vision @2047' }) {
  return (
    <header className="wcd-header">
      {/* Left — Map icon & GRIT Badge */}
      <div className="wcd-header__left">
        <svg className="wcd-header__map-icon" viewBox="0 0 100 100" fill="none">
          <path d="M30 20 C20 25, 15 35, 18 50 C20 60, 25 70, 35 78 C40 82, 50 85, 60 80 C70 75, 78 65, 80 55 C82 45, 78 35, 70 28 C62 22, 50 18, 40 20 Z"
            fill="url(#gujGrad)" />
          <defs>
            <linearGradient id="gujGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="33%" stopColor="#10b981" />
              <stop offset="66%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        <div style={{
          height: 34,
          padding: '0 10px',
          borderRadius: 6,
          background: 'linear-gradient(135deg, #0d9488, #2563eb)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--wcd-font-display)',
          fontWeight: 800,
          fontSize: '0.72rem',
          color: 'white',
          letterSpacing: '0.06em',
          boxShadow: '0 1px 3px rgba(13, 148, 136, 0.2)'
        }}>
          GRIT
        </div>
      </div>

      {/* Center — Titles */}
      <div className="wcd-header__title-block">
        <div className="wcd-header__title">
          Gujarat Rajya Institution For Transformation
        </div>
        <div className="wcd-header__subtitle">
          Women &amp; Child Development Department
        </div>
        <div className="wcd-header__page-subtitle">
          {pageSubtitle}
        </div>
      </div>

      {/* Right — Profile/Institution badge */}
      <div className="wcd-header__profile">
        <div style={{
          height: 34,
          width: 34,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
          border: '1px solid #cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '0.72rem',
          color: '#0d9488'
        }}>
          WCD
        </div>
      </div>
    </header>
  )
}
