import React, { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts'
import * as d3 from 'd3'

/**
 * AYUSH THR % Achievement by District — Ocean Blue Sequential Scale
 * Colors horizontal bars dynamically based on percentage (higher % = darker blue, lower % = lighter sky blue)
 * matching the Vahali Dikari map theme.
 */

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{data.display_name}</div>
      <div style={{ color: '#0284c7' }}>
        Achievement: <strong>{payload[0].value}%</strong>
      </div>
    </div>
  )
}

export default function AyushDistrictBar({ 
  data, selectedDistrict, onDistrictClick 
}) {
  const chartData = useMemo(() => {
    if (!data) return []
    return data.map(d => ({
      ...d,
      display_name: d.name
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ')
    }))
  }, [data])

  // Compute min/max & sequential ocean blue color scale matching the map
  const colorScale = useMemo(() => {
    const vals = data.map(d => d.pct || 0)
    const minVal = Math.min(...vals)
    const maxVal = Math.max(...vals)
    return d3.scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(d3.interpolateRgbBasis(['#7dd3fc', '#38bdf8', '#0284c7', '#0369a1']))
  }, [data])

  const handleBarClick = (entry) => {
    if (onDistrictClick) {
      onDistrictClick(entry.name)
    }
  }

  if (!data?.length) return null

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title">
        <span>Mothers Receiving AYUSH THR (%)</span>
        <span className="wcd-chart-panel__subtitle">Pilot in 6 Districts</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 36, bottom: -10, left: -10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 9 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="display_name"
              tick={{ fill: '#334155', fontSize: 10, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={105}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="pct" radius={[0, 4, 4, 0]} maxBarSize={18} onClick={handleBarClick}>
              {chartData.map((entry, i) => {
                const isDimmed = (selectedDistrict && entry.name !== selectedDistrict) || (entry.inRegion === false)
                const opacity = isDimmed ? 0.3 : 1
                return (
                  <Cell 
                    key={i} 
                    fill={colorScale(entry.pct || 0)} 
                    opacity={opacity} 
                    cursor="pointer"
                  />
                )
              })}
              <LabelList
                dataKey="pct"
                position="right"
                fill="#334155"
                fontSize={10}
                fontWeight={700}
                formatter={(v) => v != null ? `${Number(v).toFixed(1)}%` : ''}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
