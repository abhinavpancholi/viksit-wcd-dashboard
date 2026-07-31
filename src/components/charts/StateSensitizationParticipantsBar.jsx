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
          Target Participants: <strong>{tgt.value?.toLocaleString()}</strong>
        </div>
      )}
      {act && (
        <div style={{ color: '#0284c7', fontSize: '0.75rem', marginTop: 2 }}>
          Actual Participants: <strong>{act.value?.toLocaleString()}</strong>
        </div>
      )}
    </div>
  )
}

export default function StateSensitizationParticipantsBar({ data }) {
  if (!data?.length) return null

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title">
        <span>Number of Participants attending these Gender Sensitization Programs - Target vs Actual</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 15, right: 25, bottom: -10, left: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v}
            />
            <YAxis
              type="category"
              dataKey="fy"
              tick={{ fill: '#334155', fontSize: 10, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={60}
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
              radius={[0, 4, 4, 0]}
              maxBarSize={16}
            >
              <LabelList
                dataKey="target"
                position="right"
                offset={4}
                fill="#7c3aed"
                fontSize={8.5}
                fontWeight={600}
                formatter={(v) => v ? v.toLocaleString() : ''}
              />
            </Bar>
            <Bar
              dataKey="actual"
              name="Actual"
              fill="#0284c7"
              radius={[0, 4, 4, 0]}
              maxBarSize={16}
            >
              <LabelList
                dataKey="actual"
                position="right"
                offset={4}
                fill="#0369a1"
                fontSize={8.5}
                fontWeight={700}
                formatter={(v) => v ? v.toLocaleString() : ''}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
