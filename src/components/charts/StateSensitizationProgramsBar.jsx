import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const tgt = payload.find(p => p.dataKey === 'target')
  const act = payload.find(p => p.dataKey === 'actual')
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 4 }}>FY {label}</div>
      {tgt && (
        <div style={{ color: '#8b5cf6', fontSize: '0.75rem' }}>
          Target Programs: <strong>{tgt.value}</strong>
        </div>
      )}
      {act && (
        <div style={{ color: '#0284c7', fontSize: '0.75rem', marginTop: 2 }}>
          Actual Programs: <strong>{act.value}</strong>
        </div>
      )}
    </div>
  )
}

export default function StateSensitizationProgramsBar({ data }) {
  if (!data?.length) return null

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title">
        <span>Number of Sensitization Programs Conducted at State Level Departments</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 8, bottom: -5, left: -22 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="fy"
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.72rem', color: '#475569', top: -5, right: 10 }}
              iconSize={9}
              verticalAlign="top"
              align="right"
            />
            <Bar
              dataKey="target"
              name="Target"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            >
              <LabelList
                dataKey="target"
                position="top"
                offset={4}
                fill="#7c3aed"
                fontSize={9}
                fontWeight={700}
              />
            </Bar>
            <Bar
              dataKey="actual"
              name="Actual"
              fill="#0284c7"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            >
              <LabelList
                dataKey="actual"
                position="top"
                offset={4}
                fill="#0369a1"
                fontSize={9}
                fontWeight={700}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
