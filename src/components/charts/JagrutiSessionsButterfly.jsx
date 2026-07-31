import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LabelList, Cell
} from 'recharts'

/**
 * Chart E — NSWLD-17(2): Number of Jagruti Shibir Sessions Conducted
 * Diverging/butterfly horizontal bar chart.
 *
 * Y-axis: FY
 * Target (lavender) extends LEFT of center (negated for bar positioning)
 * Actual (teal) extends RIGHT of center
 *
 * Data labels show absolute values (e.g. "48", not "-48").
 * The negation of Target is purely a layout trick, not a value to display.
 */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 2 }}>FY {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: '0.72rem', marginTop: 2 }}>
          {p.name}: <strong>{Math.abs(p.value).toLocaleString('en-IN')}</strong>
        </div>
      ))}
    </div>
  )
}

export default function JagrutiSessionsButterfly({ data }) {
  const title = 'Number of Jagruti shibir sessions conducted'

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

  // Calculate domain for symmetric axis
  const maxVal = Math.max(
    ...data.map(d => Math.max(d.target, d.actual))
  )
  const domainMax = Math.ceil(maxVal * 1.25)

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title" style={{ fontSize: '0.68rem', lineHeight: 1.3 }}>
        <span>{title}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, bottom: -5, left: 0 }}
            stackOffset="sign"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              domain={[-domainMax, domainMax]}
              tick={{ fill: '#64748b', fontSize: 9 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              tickFormatter={(v) => Math.abs(v)}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#334155', fontSize: 10, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={65}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Legend
              wrapperStyle={{ fontSize: '0.62rem', color: '#475569', paddingTop: 0 }}
              iconSize={8}
            />
            {/* Target: negative bar extending left */}
            <Bar
              dataKey="negTarget"
              name="Target"
              fill="#8b5cf6"
              radius={[4, 0, 0, 4]}
              maxBarSize={18}
            >
              <LabelList
                dataKey="target"
                position="left"
                fill="#7c3aed"
                fontSize={9}
                fontWeight={700}
              />
            </Bar>
            {/* Actual: positive bar extending right */}
            <Bar
              dataKey="actual"
              name="Actual"
              fill="#0284c7"
              radius={[0, 4, 4, 0]}
              maxBarSize={18}
            >
              <LabelList
                dataKey="actual"
                position="right"
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
