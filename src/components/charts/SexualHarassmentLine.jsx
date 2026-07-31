import React, { useRef, useState } from 'react'
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LabelList
} from 'recharts'
import { Maximize2, Minimize2 } from 'lucide-react'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const item = payload[0]?.payload
  const act = payload.find(p => p.dataKey === 'actual')
  const tgt = payload.find(p => p.dataKey === 'target')
  return (
    <div className="wcd-tooltip" style={{ background: '#0f172a', color: '#fff', padding: '8px 12px', borderRadius: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 4 }}>{item?.q} {item?.fy}</div>
      {act && (
        <div style={{ color: '#38bdf8', fontSize: '0.75rem', marginTop: 2 }}>
          Actual Sensitized: <strong>{act.value}</strong>
        </div>
      )}
      {tgt && (
        <div style={{ color: '#a855f7', fontSize: '0.75rem', marginTop: 2 }}>
          Target Sensitized: <strong>{tgt.value}</strong>
        </div>
      )}
    </div>
  )
}

function TwoTierXAxisTick({ x, y, payload, index, data, tickPosRef, isModal = false }) {
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
    const prevX = tickPosRef?.current[index - 1] ?? (x - 20)
    separatorX = (x + prevX) / 2
  }

  return (
    <g>
      {isGroupStart && index > 0 && separatorX !== null && (
        <line
          x1={separatorX}
          y1={y}
          x2={separatorX}
          y2={y + (isModal ? 40 : 35)}
          stroke="#cbd5e1"
          strokeDasharray="2 2"
        />
      )}
      <text
        x={x}
        y={y + 11}
        textAnchor="middle"
        fill="#334155"
        fontSize={isModal ? 10 : 8.5}
        fontWeight={600}
      >
        {qText}
      </text>
      {isGroupStart && (
        <text
          x={groupCenterX}
          y={y + (isModal ? 28 : 26)}
          textAnchor="middle"
          fill="#64748b"
          fontSize={isModal ? 10 : 8.5}
          fontWeight={700}
        >
          {fyText}
        </text>
      )}
    </g>
  )
}

export default function SexualHarassmentLine({ data }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const tickPosRef = useRef({})

  if (!data?.length) return null

  const chartData = data.map(d => ({
    ...d,
    qLabel: d.q,
    displayLabel: `${d.q} ${d.fy}`
  }))

  const title = "Number of officers and employees Sensitized in Govt. Offices regarding Sexual Harassment Act, 2013"

  const renderChart = (isModal = false) => (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={chartData}
        margin={{
          top: isModal ? 25 : 15,
          right: isModal ? 25 : 12,
          bottom: isModal ? 25 : 10,
          left: isModal ? 0 : -22
        }}
      >
        <defs>
          <linearGradient id="shGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="qLabel"
          axisLine={{ stroke: '#cbd5e1' }}
          tickLine={false}
          height={isModal ? 42 : 32}
          tick={(props) => (
            <TwoTierXAxisTick
              {...props}
              data={chartData}
              tickPosRef={tickPosRef}
              isModal={isModal}
            />
          )}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: isModal ? 11 : 10 }}
          axisLine={false}
          tickLine={false}
          domain={[150, 700]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: isModal ? '0.8rem' : '0.72rem', color: '#475569', top: -5, right: 10 }}
          iconSize={isModal ? 11 : 9}
          verticalAlign="top"
          align="right"
        />
        <Line
          type="monotone"
          dataKey="target"
          name="Target"
          stroke="#8b5cf6"
          strokeWidth={isModal ? 2.5 : 2}
          dot={{ fill: '#8b5cf6', r: isModal ? 5 : 3.5 }}
          activeDot={{ r: isModal ? 7.5 : 6 }}
        >
          <LabelList
            dataKey="target"
            position="top"
            offset={8}
            fill="#7c3aed"
            fontSize={isModal ? 10 : 8.5}
            fontWeight={600}
          />
        </Line>
        <Area
          type="monotone"
          dataKey="actual"
          name="Actual"
          stroke="#0284c7"
          strokeWidth={isModal ? 3 : 2.5}
          fillOpacity={1}
          fill="url(#shGradient)"
          dot={{ fill: '#0284c7', r: isModal ? 5.5 : 4 }}
          activeDot={{ r: isModal ? 8 : 7 }}
        >
          <LabelList
            dataKey="actual"
            position="bottom"
            offset={10}
            fill="#0369a1"
            fontSize={isModal ? 10 : 8.5}
            fontWeight={700}
          />
        </Area>
      </ComposedChart>
    </ResponsiveContainer>
  )

  return (
    <>
      <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="wcd-chart-panel__title">
          <span>{title}</span>
          <button
            onClick={() => setIsExpanded(true)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 4,
              transition: 'all 0.15s ease'
            }}
            title="Expand / Zoom Chart"
            onMouseEnter={(e) => { e.currentTarget.style.color = '#0284c7' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b' }}
          >
            <Maximize2 size={14} />
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          {renderChart(false)}
        </div>
      </div>

      {/* Expanded Modal Popup */}
      {isExpanded && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            width: '92vw',
            height: '88vh',
            padding: '20px 28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: 12,
              marginBottom: 12
            }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {title}
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#475569',
                  transition: 'all 0.15s ease'
                }}
                title="Close Zoom View"
              >
                <Minimize2 size={15} />
                <span>Close</span>
              </button>
            </div>

            {/* Modal Large Chart */}
            <div style={{ flex: 1, minHeight: 0 }}>
              {renderChart(true)}
            </div>

            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', marginTop: 8, fontWeight: 500 }}>
              Hover to view exact values per quarter.
            </div>
          </div>
        </div>
      )}
    </>
  )
}
