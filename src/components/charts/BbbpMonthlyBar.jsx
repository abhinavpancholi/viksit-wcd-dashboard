import React, { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList
} from 'recharts'
import * as d3 from 'd3'

/**
 * Monthly BBBP Spread Chart — Ocean Blue Sequential Scale
 * Colors bars dynamically based on value (higher value = darker blue, lower value = lighter sky blue)
 * matching the Vahali Dikari map theme.
 */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
      <div style={{ color: '#0284c7' }}>
        Programs: <strong>{Number(payload[0].value).toLocaleString('en-IN')}</strong>
      </div>
    </div>
  )
}

export default function BbbpMonthlyBar({ 
  data, drillLevel = 'time', selectedFY, selectedRegion, 
  onBreadcrumbClick, onBarClick 
}) {
  // Compute min/max & sequential ocean blue color scale matching the map
  const colorScale = useMemo(() => {
    if (!data) return d3.scaleSequential()
    const vals = data.map(d => d.total_programs || 0)
    const minVal = Math.min(...vals)
    const maxVal = Math.max(...vals)
    return d3.scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(d3.interpolateRgbBasis(['#7dd3fc', '#38bdf8', '#0284c7', '#0369a1']))
  }, [data])

  if (!data?.length) return null

  const hasSelection = data.some(d => d.isSelected)

  const handleBarClick = (entry) => {
    if (onBarClick && entry && entry.name) {
      onBarClick(entry.name)
    }
  }

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title">
        <span>Monthly Spread of Beti Bachao Beti Padhao Awareness Programs</span>
      </div>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>
        <span 
          style={{ cursor: 'pointer', color: drillLevel !== 'time' ? '#0284c7' : '#334155' }} 
          onClick={() => onBreadcrumbClick && onBreadcrumbClick('time')}
        >
          All-time
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
          <BarChart data={data} margin={{ top: 16, right: 10, bottom: 0, left: -15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.toLocaleString('en-IN')}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="total_programs" radius={[4, 4, 0, 0]} maxBarSize={32} onClick={handleBarClick} cursor={drillLevel !== 'district' ? 'pointer' : 'default'}>
              {data.map((entry, i) => {
                const opacity = hasSelection && !entry.isSelected ? 0.35 : 1
                return <Cell key={i} fill={colorScale(entry.total_programs || 0)} opacity={opacity} />
              })}
              <LabelList
                dataKey="total_programs"
                position="top"
                fill="#334155"
                fontSize={9}
                fontWeight={600}
                formatter={(v) => v.toLocaleString('en-IN')}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
