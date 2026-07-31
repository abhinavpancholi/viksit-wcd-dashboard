import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const val = payload[0].value
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#0284c7', fontSize: '0.75rem' }}>
        Avg Participation per Session: <strong>{val?.toLocaleString()}</strong>
      </div>
    </div>
  )
}

export default function BbbpAvgParticipationLine({ data, resolvedFY }) {
  if (!data?.length) return null

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title">
        <span>Average Participation per Session in Beti Bachao Beti Padhao Awareness Program - {resolvedFY}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 10, bottom: 20, left: -25 }}>
            <defs>
              <linearGradient id="bbbpAvgGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 9.5, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={35}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 'dataMax + 20']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="avg_participation"
              stroke="#0284c7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#bbbpAvgGradient)"
              dot={{ fill: '#0284c7', r: 4 }}
              activeDot={{ r: 7 }}
            >
              <LabelList
                dataKey="avg_participation"
                position="top"
                offset={10}
                fill="#334155"
                fontSize={10}
                fontWeight={700}
                formatter={(v) => v ? v.toLocaleString() : ''}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
