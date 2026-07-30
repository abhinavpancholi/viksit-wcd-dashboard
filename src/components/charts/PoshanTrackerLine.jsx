import React from 'react'
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts'

/**
 * Poshan Tracker Over the Years Area Chart
 * Displays both "Registered" (Target) and "Availing Benefits" (Actual) series
 * with smooth gradient area fills.
 */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const reg = payload.find(p => p.dataKey === 'target_lakh')
  const avail = payload.find(p => p.dataKey === 'actual_lakh')
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 4 }}>FY {label}</div>
      {reg && (
        <div style={{ color: '#0d9488', fontSize: '0.72rem' }}>
          Registered: <strong>{reg.value.toFixed(2)} Lakh</strong>
        </div>
      )}
      {avail && (
        <div style={{ color: '#f97316', fontSize: '0.72rem', marginTop: 2 }}>
          Availing Benefits: <strong>{avail.value.toFixed(2)} Lakh</strong>
        </div>
      )}
    </div>
  )
}

export default function PoshanTrackerLine({ data }) {
  if (!data?.length) return null

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title">
        <span>Children Registered (in Lakh) on Poshan Tracker Over the Years</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 25, bottom: -5, left: -15 }}>
            <defs>
              <linearGradient id="colorRegistered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="colorAvailing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.68rem', color: '#475569', paddingTop: 2 }}
              iconSize={9}
            />

            {/* Registered (Target) Series */}
            <Area
              type="monotone"
              dataKey="target_lakh"
              name="Registered"
              stroke="#0d9488"
              strokeWidth={2.5}
              fill="url(#colorRegistered)"
              dot={{ fill: '#0d9488', r: 4 }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="target_lakh"
                position="top"
                offset={8}
                fill="#0f766e"
                fontSize={9}
                fontWeight={700}
                formatter={(v) => (v ? v.toFixed(2) : '')}
              />
            </Area>

            {/* Availing Benefits (Actual) Series */}
            <Area
              type="monotone"
              dataKey="actual_lakh"
              name="Availing Benefits"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#colorAvailing)"
              dot={{ fill: '#f97316', r: 4 }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="actual_lakh"
                position="bottom"
                offset={8}
                fill="#c2410c"
                fontSize={9}
                fontWeight={700}
                formatter={(v) => (v ? v.toFixed(2) : '')}
              />
            </Area>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
