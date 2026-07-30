import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts'

/**
 * AYUSH THR Target vs Actual — Grouped Horizontal Bar Chart
 * Shows per-pilot-district Target and Actual in Lakh for the selected FY.
 * Fix D: Separate from Overview's % chart. Responds to selectedFY.
 */

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 2 }}>
        {data.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: '0.72rem', marginTop: 2 }}>
          {p.name}: <strong>{p.value.toFixed(2)} Lakh</strong>
        </div>
      ))}
    </div>
  )
}

export default function AyushThrChart({ data, selectedFY }) {
  const fyLabel = selectedFY || '2022-23 to 2025-26'
  const title = `District wise Pregnant & lactating mothers (in Lakh) receiving AYUSH THR (Pilot in 6 Districts) - ${fyLabel}`

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
          No AYUSH THR data available for this selection
        </div>
      </div>
    )
  }

  const chartData = data.map(d => ({
    ...d,
    display_name: d.name
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
  }))

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title" style={{ fontSize: '0.68rem', lineHeight: 1.3 }}>
        <span>{title}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 40, bottom: -10, left: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#64748b', fontSize: 9 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="display_name"
              tick={{ fill: '#334155', fontSize: 10, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Legend
              wrapperStyle={{ fontSize: '0.68rem', color: '#475569', paddingTop: 2 }}
              iconSize={9}
            />
            <Bar
              dataKey="target_lakh"
              name="Target"
              fill="#a78bfa"
              radius={[0, 4, 4, 0]}
              maxBarSize={14}
            >
              <LabelList
                dataKey="target_lakh"
                position="right"
                fill="#6d28d9"
                fontSize={9}
                fontWeight={700}
                formatter={(v) => v != null ? v.toFixed(2) : ''}
              />
            </Bar>
            <Bar
              dataKey="actual_lakh"
              name="Actual"
              fill="#2dd4bf"
              radius={[0, 4, 4, 0]}
              maxBarSize={14}
            >
              <LabelList
                dataKey="actual_lakh"
                position="right"
                fill="#0f766e"
                fontSize={9}
                fontWeight={700}
                formatter={(v) => v != null ? v.toFixed(2) : ''}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
