import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts'

/**
 * Chart A — NSWLD-17: Number of beneficiaries receiving subsidies
 * under Mahila Swavlamban Yojana.
 * Grouped/clustered vertical bar chart, Target (lavender) vs Actual (teal).
 */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 2 }}>FY {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: '0.72rem', marginTop: 2 }}>
          {p.name}: <strong>{Number(p.value).toLocaleString('en-IN')}</strong>
        </div>
      ))}
    </div>
  )
}

export default function MSYBeneficiariesBar({ data }) {
  const title = 'Number of beneficiaries receiving subsidies under Mahila Swavlamban Yojana'

  if (!data || data.length === 0) {
    return (
      <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="wcd-chart-panel__title" style={{ fontSize: '0.68rem', lineHeight: 1.3 }}>
          <span>{title}</span>
        </div>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500
        }}>
          No data available for this selection
        </div>
      </div>
    )
  }

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title" style={{ fontSize: '0.68rem', lineHeight: 1.3 }}>
        <span>{title}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 10, bottom: -5, left: -15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Legend
              wrapperStyle={{ fontSize: '0.62rem', color: '#475569', paddingTop: 0 }}
              iconSize={8}
            />
            <Bar
              dataKey="target"
              name="Target"
              fill="#8b5cf6"
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
            >
              <LabelList
                dataKey="target"
                position="top"
                fill="#7c3aed"
                fontSize={9}
                fontWeight={700}
                formatter={(v) => v > 0 ? Number(v).toLocaleString('en-IN') : ''}
              />
            </Bar>
            <Bar
              dataKey="actual"
              name="Actual"
              fill="#0284c7"
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
            >
              <LabelList
                dataKey="actual"
                position="top"
                fill="#0369a1"
                fontSize={9}
                fontWeight={700}
                formatter={(v) => v > 0 ? Number(v).toLocaleString('en-IN') : ''}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
