import React from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const act = payload.find(p => p.dataKey === 'actual_lakh')
  const cum = payload.find(p => p.dataKey === 'cumulative_lakh')
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {act && (
        <div style={{ color: '#0284c7', fontSize: '0.72rem' }}>
          Quarterly Beneficiaries: <strong>{act.value.toFixed(2)} Lakh</strong>
        </div>
      )}
      {cum && (
        <div style={{ color: '#d97706', fontSize: '0.72rem', marginTop: 2 }}>
          Cumulative: <strong>{cum.value.toFixed(2)} Lakh</strong>
        </div>
      )}
    </div>
  )
}

export default function MangalDiwasQuarterlyBar({ data }) {
  if (!data?.length) return null

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title">
        <span>No of Beneficiaries (in Lakh) Covered Under Mangal Diwas</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: -5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="quarter"
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.68rem', color: '#475569', paddingTop: 2 }}
              iconSize={9}
            />
            <Bar
              yAxisId="left"
              dataKey="actual_lakh"
              name="Actual Beneficiaries"
              fill="#0284c7"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            >
              <LabelList
                dataKey="actual_lakh"
                position="top"
                fill="#475569"
                fontSize={9}
                fontWeight={600}
                formatter={(v) => v ? v.toFixed(2) : ''}
              />
            </Bar>
            <Line
              yAxisId="right"
              dataKey="cumulative_lakh"
              name="Cumulative Beneficiaries"
              stroke="#1e3a8a"
              strokeWidth={2.5}
              dot={{ fill: '#1e3a8a', r: 3.5 }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="cumulative_lakh"
                position="top"
                offset={10}
                fill="#1e3a8a"
                fontSize={9}
                fontWeight={700}
                formatter={(v) => v ? v.toFixed(2) : ''}
              />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
