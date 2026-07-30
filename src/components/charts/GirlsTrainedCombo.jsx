import React from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LabelList, Cell
} from 'recharts'

/**
 * Girls Registered vs Trained Combo Chart — Light Theme (DAX Measure Logic)
 * Displays per-month average adolescent girls registered & trained (in Lakh)
 * matching the Power BI DAX measure logic exactly.
 */

function CustomTooltip({ active, payload, label, drillLevel }) {
  if (!active || !payload?.length) return null
  const reg = payload.find(p => p.dataKey === 'registered_lakh')
  const tr = payload.find(p => p.dataKey === 'trained_lakh')
  const pct = payload.find(p => p.dataKey === 'pct_trained')
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 4 }}>
        {drillLevel === 'time' ? `FY ${label}` : label}
      </div>
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

export default function GirlsTrainedCombo({ 
  data, onBarClick, drillLevel = 'time', 
  selectedFY, selectedRegion, onBreadcrumbClick 
}) {
  if (!data?.length) return null

  // Check if any FY is selected (if so, we dim the others)
  const hasSelection = data.some(d => d.isSelected)

  const handleBarClick = (entry) => {
    if (onBarClick && entry && entry.name) {
      onBarClick(entry.name)
    }
  }

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title">
        <span>Adolescent Girls Trained per Month Over the Years in Anganwadis</span>
        <span className="wcd-chart-panel__subtitle">(in Lakh)</span>
      </div>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>
        <span 
          style={{ cursor: 'pointer', color: drillLevel !== 'time' ? '#0284c7' : '#334155' }} 
          onClick={() => onBreadcrumbClick && onBreadcrumbClick('time')}
        >
          All Years
        </span>
        {drillLevel !== 'time' && selectedFY && (
          <>
            {' > '}
            <span 
              style={{ cursor: 'pointer', color: drillLevel === 'district' ? '#0284c7' : '#334155' }}
              onClick={() => onBreadcrumbClick && onBreadcrumbClick('region')}
            >
              {selectedFY}
            </span>
          </>
        )}
        {drillLevel === 'district' && selectedRegion && (
          <>
            {' > '}
            <span style={{ color: '#334155' }}>{selectedRegion}</span>
          </>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: -5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 'auto']}
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
            <Tooltip content={<CustomTooltip drillLevel={drillLevel} />} />
            <Legend
              wrapperStyle={{ fontSize: '0.68rem', color: '#475569', paddingTop: 2 }}
              iconSize={9}
            />
            <Bar
              yAxisId="left"
              dataKey="registered_lakh"
              name="Girls Registered"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
              onClick={handleBarClick}
              cursor="pointer"
            >
              {data.map((entry, index) => {
                const opacity = hasSelection && !entry.isSelected ? 0.35 : 1
                return <Cell key={`cell-reg-${index}`} fill="#f87171" opacity={opacity} />
              })}
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
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
              onClick={handleBarClick}
              cursor="pointer"
            >
              {data.map((entry, index) => {
                const opacity = hasSelection && !entry.isSelected ? 0.35 : 1
                return <Cell key={`cell-tr-${index}`} fill="#34d399" opacity={opacity} />
              })}
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
                offset={10}
                fill="#d97706"
                fontSize={9}
                fontWeight={700}
                formatter={(v) => `${Number(v).toFixed(1)}%`}
              />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
