import React from 'react'
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts'

/**
 * Chart C — NSWLD-17: Subsidy Amount Disbursed (Rs. in Lakh)
 * under Mahila Swavlamban Yojana.
 * Combo area/line chart, Target (lavender area) vs Actual (teal line).
 * Display to 2 decimal places (matches "188.81", "403.01" style).
 */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 2 }}>FY {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: '0.72rem', marginTop: 2 }}>
          {p.name}: <strong>{Number(p.value).toFixed(2)} Lakh</strong>
        </div>
      ))}
    </div>
  )
}

export default function MSYSubsidyCombo({ data }) {
  const title = 'Subsidy Amount Disbursed (Rs. in Lakh) under Mahila Swavlamban Yojana'

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
          <ComposedChart data={data} margin={{ top: 15, right: 10, bottom: -5, left: -10 }}>
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
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Legend
              wrapperStyle={{ fontSize: '0.62rem', color: '#475569', paddingTop: 0 }}
              iconSize={8}
            />
            <Area
              dataKey="target"
              name="Target"
              stroke="#8b5cf6"
              fill="#ede9fe"
              strokeWidth={2}
              fillOpacity={0.5}
              dot={{ fill: '#8b5cf6', r: 3 }}
            >
              <LabelList
                dataKey="target"
                position="top"
                fill="#7c3aed"
                fontSize={8}
                fontWeight={700}
                formatter={(v) => v != null ? v.toFixed(2) : ''}
              />
            </Area>
            <Area
              dataKey="actual"
              name="Actual"
              stroke="#0284c7"
              fill="#e0f2fe"
              strokeWidth={2.5}
              fillOpacity={0.6}
              dot={{ fill: '#0284c7', r: 3.5 }}
            >
              <LabelList
                dataKey="actual"
                position="top"
                fill="#0369a1"
                fontSize={8}
                fontWeight={700}
                offset={12}
                formatter={(v) => v != null ? v.toFixed(2) : ''}
              />
            </Area>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
