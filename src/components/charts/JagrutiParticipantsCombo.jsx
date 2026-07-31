import React from 'react'
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts'

/**
 * Chart F — NSWLD-17(2): Number of Participants in Mahila Jagruti Shibirs
 * Combo line/area chart, Target (lavender) vs Actual (teal).
 * Y-axis uses K-formatting (14K, 18K, 20K).
 */

function formatK(v) {
  if (v == null) return ''
  if (v >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K`
  return v.toString()
}

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

export default function JagrutiParticipantsCombo({ data }) {
  const title = 'Number of participants in Mahila Jagruti Shibirs'

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
          <ComposedChart data={data} margin={{ top: 15, right: 10, bottom: -5, left: -5 }}>
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
              tickFormatter={formatK}
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
              fillOpacity={0.4}
              dot={{ fill: '#8b5cf6', r: 3 }}
            >
              <LabelList
                dataKey="target"
                position="top"
                fill="#7c3aed"
                fontSize={8}
                fontWeight={700}
                formatter={formatK}
              />
            </Area>
            <Area
              dataKey="actual"
              name="Actual"
              stroke="#0284c7"
              fill="#e0f2fe"
              strokeWidth={2.5}
              fillOpacity={0.5}
              dot={{ fill: '#0284c7', r: 3.5 }}
            >
              <LabelList
                dataKey="actual"
                position="top"
                fill="#0369a1"
                fontSize={8}
                fontWeight={700}
                offset={12}
                formatter={formatK}
              />
            </Area>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
