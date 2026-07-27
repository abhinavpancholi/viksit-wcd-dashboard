import React from 'react'
import { NavLink } from 'react-router-dom'
import { Target, ListChecks, BarChart3, PhoneCall } from 'lucide-react'
import useWcdStore from '../../context/WcdStore'

/**
 * WCD Sidebar — Prettier Dark Royal Blue Sidebar with 3 Zones
 * Top:    Stat Cards (Interventions, Actionable Steps, KPIs)
 * Middle: Navigation List
 * Bottom: Helpline & Anganwadi Quick Summary Widget (Fills empty bottom space)
 */

const NAV_ITEMS = [
  { label: 'Landing Page', to: '/landing', disabled: true },
  { label: 'Highlights', to: '/highlights', disabled: true },
  { label: 'Summary', to: '/summary', disabled: true },
  { label: 'Overview', to: '/', disabled: false },
  { label: 'Health & Adolescent Nutrition', to: '/health', disabled: true },
  { label: 'Awareness & Behaviour Change', to: '/awareness', disabled: true },
  { label: 'Infra, Digital Platforms & Women Empowerment', to: '/infra', disabled: true },
  { label: 'Page 1', to: '/page1', disabled: true },
]

function StatCards() {
  const config = useWcdStore((s) => s.config)

  if (!config) return null

  return (
    <div className="wcd-stat-cards">
      {/* Interventions */}
      <div className="wcd-stat-card wcd-stat-card--teal">
        <div className="wcd-stat-card__icon wcd-stat-card__icon--teal">
          <Target size={18} />
        </div>
        <div className="wcd-stat-card__content">
          <div className="wcd-stat-card__label">Interventions</div>
          <div className="wcd-stat-card__value">{config.interventions}</div>
        </div>
      </div>

      {/* Actionable Steps */}
      <div className="wcd-stat-card wcd-stat-card--blue">
        <div className="wcd-stat-card__icon wcd-stat-card__icon--blue">
          <ListChecks size={18} />
        </div>
        <div className="wcd-stat-card__content">
          <div className="wcd-stat-card__label">Actionable Steps</div>
          <div className="wcd-stat-card__value">{config.actionableSteps}</div>
        </div>
      </div>

      {/* KPIs */}
      <div className="wcd-stat-card wcd-stat-card--purple">
        <div className="wcd-stat-card__icon wcd-stat-card__icon--purple">
          <BarChart3 size={18} />
        </div>
        <div className="wcd-stat-card__content">
          <div className="wcd-stat-card__label">KPIs</div>
          <div className="wcd-stat-card__value">{config.kpis}</div>
        </div>
      </div>
    </div>
  )
}

function SidebarFooterWidget() {
  return (
    <div className="wcd-sidebar-footer">
      <div className="wcd-sidebar-footer__title">
        <span>181 Women Helpline</span>
        <PhoneCall size={13} style={{ color: '#38bdf8' }} />
      </div>
      <div className="wcd-sidebar-footer__title">
        <span>1098 Child Helpline</span>
        <PhoneCall size={13} style={{ color: '#38bdf8' }} />
      </div>
      <div className="wcd-sidebar-footer__text">
        24x7 Women & Child Helpline Numbers and Emergency Support
      </div>
    </div>
  )
}

function ActiveFilters() {
  const { selectedFY, selectedRegion, selectedDistrict, setFY, setRegion, setDistrict, resetFilters } = useWcdStore()

  if (!selectedFY && !selectedRegion && !selectedDistrict) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px', marginBottom: '16px' }}>
      <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#ffffffff', fontWeight: 600, letterSpacing: '0.05em' }}>
        Active Filters
      </div>
      <div style={{ display: 'flex', gap: '6px',color: '#cdcdcdff', fontWeight: 500, flexWrap: 'wrap' }}>
        {selectedFY && (
          <div className="wcd-chip wcd-chip--active" onClick={() => setFY(selectedFY)} style={{ cursor: 'pointer', fontSize: '11px', padding: '4px 8px' }}>
            {selectedFY} ✕
          </div>
        )}
        {selectedRegion && (
          <div className="wcd-chip wcd-chip--active" onClick={() => setRegion(selectedRegion)} style={{ cursor: 'pointer', fontSize: '11px', padding: '4px 8px' }}>
            {selectedRegion} ✕
          </div>
        )}
        {selectedDistrict && (
          <div className="wcd-chip wcd-chip--active" onClick={() => setDistrict(selectedDistrict)} style={{ cursor: 'pointer', fontSize: '11px', padding: '4px 8px' }}>
            {selectedDistrict} ✕
          </div>
        )}
        <div 
          className="wcd-chip" 
          style={{ backgroundColor: '#1e293b', color: '#cbd5e1', cursor: 'pointer', fontSize: '11px', padding: '4px 8px', border: '1px solid #334155' }}
          onClick={resetFilters}
        >
          Clear all
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ topSlot = 'stat-cards' }) {
  return (
    <aside className="wcd-sidebar">
      {/* Top Slot — Stat Cards */}
      <div className="wcd-sidebar__top">
        {topSlot === 'stat-cards' && <StatCards />}
      </div>

      {/* Middle Slot — Nav List */}
      <nav className="wcd-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          item.disabled ? (
            <div
              key={item.to}
              className="wcd-nav-item wcd-nav-item--disabled"
              title="Coming soon"
            >
              <span>{item.label}</span>
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `wcd-nav-item ${isActive ? 'wcd-nav-item--active' : ''}`
              }
            >
              <span>{item.label}</span>
            </NavLink>
          )
        ))}
        <ActiveFilters /> 
      </nav>

      {/* Bottom Slot — Fills empty space with WCD Abhayam Helpline & Quick Stats */}
      <div className="wcd-sidebar__bottom">
        <SidebarFooterWidget />
      </div>
    </aside>
  )
}
