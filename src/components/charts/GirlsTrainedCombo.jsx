import React from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts'

/**
 * Girls Registered vs Trained Combo Chart — Light Theme (DAX Measure Logic)
 * Displays per-month average adolescent girls registered & trained (in Lakh)
 * matching the Power BI DAX measure logic exactly.
 */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const reg = payload.find(p => p.dataKey === 'registered_lakh')
  const tr = payload.find(p => p.dataKey === 'trained_lakh')
  const pct = payload.find(p => p.dataKey === 'pct_trained')
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 4 }}>FY {label}</div>
      {reg && (
        <div style={{ color: '#ef4444', fontSize: '0.72rem' }}>
          Registered/Month: <strong>{reg.value.toFixed(2)} Lakh</strong>
        </div>
      )}
      {tr && (
        <div style={{ color: '#10b981', fontSize: '0.72rem' }}>
          Trained/Month: <strong>{tr.value.toFixed(2)} Lakh</strong>
        </div>
      )}
      {pct && (
        <div style={{ color: '#d97706', fontSize: '0.72rem', marginTop: 2 }}>
          % Trained: <strong>{pct.value}%</strong>
        </div>
      )}
    </div>
  )
}

export default function GirlsTrainedCombo({ data }) {
  if (!data?.length) return null

  return (
    <div className="wcd-chart-panel" style={{ height: '100%' }}>
      <div className="wcd-chart-panel__title">
        <span>Adolescent Girls Trained per Month Over the Years in Anganwadis</span>
        <span className="wcd-chart-panel__subtitle">(in Lakh)</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 18, right: 30, bottom: -5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="fy"
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 16]}
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.68rem', color: '#475569', paddingTop: 2 }}
              iconSize={9}
            />
            <Bar
              yAxisId="left"
              dataKey="registered_lakh"
              name="Girls Registered"
              fill="#f87171"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            >
              <LabelList
                dataKey="registered_lakh"
                position="top"
                fill="#475569"
                fontSize={9}
                fontWeight={600}
                formatter={(v) => v.toFixed(2)}
              />
            </Bar>
            <Bar
              yAxisId="left"
              dataKey="trained_lakh"
              name="Girls Trained"
              fill="#34d399"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            >
              <LabelList
                dataKey="trained_lakh"
                position="top"
                fill="#475569"
                fontSize={9}
                fontWeight={600}
                formatter={(v) => v.toFixed(2)}
              />
            </Bar>
            <Line
              yAxisId="right"
              dataKey="pct_trained"
              name="% Girls Trained"
              stroke="#d97706"
              strokeWidth={2.5}
              dot={{ fill: '#d97706', r: 3.5 }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="pct_trained"
                position="top"
                fill="#d97706"
                fontSize={9}
                fontWeight={700}
                formatter={(v) => `${v}%`}
              />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
