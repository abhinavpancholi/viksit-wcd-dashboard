import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList
} from 'recharts'

/**
 * Chart B — NSWLD-17: Average Amount Disbursed (in Rs)
 * under Mahila Swavlamban Yojana.
 * Single-series vertical bar, teal color.
 * Display rounded to nearest whole rupee, comma-separated (Indian format).
 */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const val = payload[0].value
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 2 }}>FY {label}</div>
      <div style={{ color: '#0369a1', fontSize: '0.72rem' }}>
        Avg Subsidy: <strong>₹{val != null ? Number(val).toLocaleString('en-IN') : '—'}</strong>
      </div>
    </div>
  )
}

export default function MSYAvgSubsidyBar({ data }) {
  const title = 'Average Amount Disbursed (in Rs) under Mahila Swavlamban Yojana'

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

  // Filter out entries with null avg (divide-by-zero guard)
  const chartData = data.filter(d => d.avg != null)

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title" style={{ fontSize: '0.68rem', lineHeight: 1.3 }}>
        <span>{title}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 10, bottom: -5, left: -5 }}>
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
              tickFormatter={(v) => Number(v).toLocaleString('en-IN')}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar
              dataKey="avg"
              name="Avg Subsidy (₹)"
              fill="#0284c7"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              <LabelList
                dataKey="avg"
                position="top"
                fill="#0369a1"
                fontSize={9}
                fontWeight={700}
                formatter={(v) => v != null ? Number(v).toLocaleString('en-IN') : ''}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
