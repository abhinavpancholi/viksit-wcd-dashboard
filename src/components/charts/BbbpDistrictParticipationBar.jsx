import React, { useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts'
import { Maximize2, Minimize2 } from 'lucide-react'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const act = payload.find(p => p.dataKey === 'actual')
  const tgt = payload.find(p => p.dataKey === 'target')
  return (
    <div className="wcd-tooltip" style={{ background: '#0f172a', color: '#fff', padding: '8px 12px', borderRadius: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 4 }}>{label}</div>
      {act && (
        <div style={{ color: '#38bdf8', fontSize: '0.75rem', marginTop: 2 }}>
          Actual Participants: <strong>{act.value.toLocaleString()}</strong>
        </div>
      )}
      {tgt && (
        <div style={{ color: '#a855f7', fontSize: '0.75rem', marginTop: 2 }}>
          Target Participants: <strong>{tgt.value.toLocaleString()}</strong>
        </div>
      )}
    </div>
  )
}

export default function BbbpDistrictParticipationBar({ data, resolvedFY, onDistrictClick }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!data?.length) return null

  // Format district display names (capitalize first letter)
  const chartData = data.map(d => ({
    ...d,
    displayName: d.name
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
  }))

  const handleBarClick = (entry) => {
    if (onDistrictClick && entry?.name) {
      onDistrictClick(entry.name)
    }
  }

  const title = `Participation in Awareness Session under Beti Bachao Beti Padhao - ${resolvedFY}`

  const renderChart = (isModal = false) => (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{
          top: isModal ? 25 : 15,
          right: isModal ? 25 : 8,
          bottom: isModal ? 55 : 25,
          left: isModal ? 0 : -22
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="displayName"
          tick={{ fill: '#334155', fontSize: isModal ? 10 : 8.5, fontWeight: 600 }}
          axisLine={{ stroke: '#cbd5e1' }}
          tickLine={false}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={isModal ? 50 : 35}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: isModal ? 11 : 10 }}
          axisLine={false}
          tickLine={false}
          domain={[0, 30000]}
          allowDataOverflow={true}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: isModal ? '0.8rem' : '0.72rem', color: '#475569', top: -5, right: 10 }}
          iconSize={isModal ? 11 : 9}
          verticalAlign="top"
          align="right"
        />
        <Bar
          dataKey="actual"
          name="Actual"
          fill="#0284c7"
          radius={[4, 4, 0, 0]}
          maxBarSize={isModal ? 48 : 32}
          onClick={handleBarClick}
          cursor={onDistrictClick ? "pointer" : "default"}
        >
          <LabelList
            dataKey="actual"
            position="inside"
            fill="#ffffff"
            fontSize={isModal ? 10 : 8}
            fontWeight={700}
            angle={-90}
            formatter={(v) => v ? v.toLocaleString() : ''}
          />
        </Bar>
        <Line
          type="monotone"
          dataKey="target"
          name="Target"
          stroke="#1e3a8a"
          strokeWidth={isModal ? 2.5 : 2}
          dot={{ fill: '#1e3a8a', r: isModal ? 4.5 : 3 }}
          activeDot={{ r: isModal ? 7 : 5 }}
        >
          <LabelList
            dataKey="target"
            position="top"
            offset={10}
            fill="#1e3a8a"
            fontSize={isModal ? 10 : 8}
            fontWeight={600}
            formatter={(v) => v ? v.toLocaleString() : ''}
          />
        </Line>
      </ComposedChart>
    </ResponsiveContainer>
  )

  return (
    <>
      <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="wcd-chart-panel__title">
          <span>{title}</span>
          <button
            onClick={() => setIsExpanded(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 4,
              transition: 'all 0.15s ease'
            }}
            title="Expand / Zoom Chart"
            onMouseEnter={(e) => { e.currentTarget.style.color = '#0284c7' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b' }}
          >
            <Maximize2 size={14} />
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          {renderChart(false)}
        </div>
      </div>

      {/* Expanded Modal Popup */}
      {isExpanded && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            width: '92vw',
            height: '88vh',
            padding: '20px 28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: 12,
              marginBottom: 12
            }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {title}
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#475569',
                  transition: 'all 0.15s ease'
                }}
                title="Close Zoom View"
              >
                <Minimize2 size={15} />
                <span>Close</span>
              </button>
            </div>

            {/* Modal Large Chart */}
            <div style={{ flex: 1, minHeight: 0 }}>
              {renderChart(true)}
            </div>

            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', marginTop: 8, fontWeight: 500 }}>
              Click any bar to filter down. Hover to view exact values.
            </div>
          </div>
        </div>
      )}
    </>
  )
}
