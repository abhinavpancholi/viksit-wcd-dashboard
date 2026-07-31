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
        Beneficiaries: <strong>{val?.toLocaleString()}</strong>
      </div>
    </div>
  )
}

export default function VahaliMonthlyLine({ data }) {
  if (!data?.length) return null

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title">
        <span>Month wise Beneficiaries of Vahali Dikari Yojana</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 10, bottom: 20, left: -22 }}>
            <defs>
              <linearGradient id="vahaliGradient" x1="0" y1="0" x2="0" y2="1">
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
              domain={['auto']}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#0284c7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#vahaliGradient)"
              dot={{ fill: '#0284c7', r: 4 }}
              activeDot={{ r: 7 }}
            >
              <LabelList
                dataKey="actual"
                position="top"
                offset={10}
                fill="#334155"
                fontSize={9}
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
