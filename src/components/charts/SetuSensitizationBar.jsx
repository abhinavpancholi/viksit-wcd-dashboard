import React, { useRef } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const item = payload[0]?.payload
  const act = payload.find(p => p.dataKey === 'actual')
  const tgt = payload.find(p => p.dataKey === 'target')
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{item?.q} {item?.fy}</div>
      {act && (
        <div style={{ color: '#0284c7', fontSize: '0.75rem' }}>
          Actual Participants: <strong>{act.value?.toLocaleString()}</strong>
        </div>
      )}
      {tgt && (
        <div style={{ color: '#1e3a8a', fontSize: '0.75rem', marginTop: 2 }}>
          Target Participants: <strong>{tgt.value?.toLocaleString()}</strong>
        </div>
      )}
    </div>
  )
}

function TwoTierXAxisTick({ x, y, payload, index, data, tickPosRef }) {
  if (!data || index == null || !data[index]) return null

  if (tickPosRef) {
    tickPosRef.current[index] = x
  }

  const currentItem = data[index]
  const qText = currentItem.q || payload.value
  const fyText = currentItem.fy

  const prevItem = index > 0 ? data[index - 1] : null
  const isGroupStart = !prevItem || prevItem.fy !== fyText

  const sameFyItems = data.filter(d => d.fy === fyText)
  const groupCount = sameFyItems.length
  const startIndex = data.findIndex(d => d.fy === fyText)
  const endIndex = startIndex + groupCount - 1

  const xStart = tickPosRef?.current[startIndex] ?? x
  const xEnd = tickPosRef?.current[endIndex] ?? x
  const groupCenterX = (xStart + xEnd) / 2

  let separatorX = null
  if (isGroupStart && index > 0) {
    const prevX = tickPosRef?.current[index - 1] ?? (x - 30)
    separatorX = (x + prevX) / 2
  }

  return (
    <g>
      {isGroupStart && index > 0 && separatorX !== null && (
        <line
          x1={separatorX}
          y1={y}
          x2={separatorX}
          y2={y + 35}
          stroke="#cbd5e1"
          strokeDasharray="2 2"
        />
      )}
      <text
        x={x}
        y={y + 11}
        textAnchor="middle"
        fill="#334155"
        fontSize={9.5}
        fontWeight={600}
      >
        {qText}
      </text>
      {isGroupStart && (
        <text
          x={groupCenterX}
          y={y + 26}
          textAnchor="middle"
          fill="#64748b"
          fontSize={9}
          fontWeight={700}
        >
          {fyText}
        </text>
      )}
    </g>
  )
}

export default function SetuSensitizationBar({ data }) {
  const tickPosRef = useRef({})

  if (!data?.length) return null

  const chartData = data.map(d => ({
    ...d,
    qLabel: d.q,
    displayLabel: `${d.q} ${d.fy}`
  }))

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title">
        <span>Number of people participating in the Gender Sensitization awareness programs through SETU</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 15, right: 10, bottom: 10, left: -22 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="qLabel"
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              height={32}
              tick={(props) => (
                <TwoTierXAxisTick
                  {...props}
                  data={chartData}
                  tickPosRef={tickPosRef}
                />
              )}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 6500]}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.72rem', color: '#475569', top: -5, right: 10 }}
              iconSize={9}
              verticalAlign="top"
              align="right"
            />
            <Bar
              dataKey="actual"
              name="Actual"
              fill="#0284c7"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            >
              <LabelList
                dataKey="actual"
                position="inside"
                fill="#ffffff"
                fontSize={9.5}
                fontWeight={700}
                angle={-90}
                formatter={(v) => v ? v.toLocaleString() : ''}
              />
            </Bar>
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#1e3a8a"
              strokeWidth={2}
              dot={{ fill: '#1e3a8a', r: 3 }}
              activeDot={{ r: 5 }}
            >
              <LabelList
                dataKey="target"
                position="top"
                offset={10}
                fill="#1e3a8a"
                fontSize={9}
                fontWeight={600}
                formatter={(v) => v ? v.toLocaleString() : ''}
              />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
