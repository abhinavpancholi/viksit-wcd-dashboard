import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList
} from 'recharts'

/**
 * Chart D — NSWLD-05: District-wise No. of Working Women Hostels
 * with day care facilities — Target & Operational Status
 *
 * ⚠️ FY-EXEMPT: This chart does NOT respect the page FY filter.
 * Verified against the full 660-row sheet: only 5 districts have
 * ever had non-null values, across only 2 half-year periods
 * (FY2025-26 H1 and FY2026-27 H1). The screenshot bar heights only
 * reproduce by summing across all periods regardless of FY selection.
 * Same precedent as SAM section on Page 2 being exempt from FY filtering.
 *
 * Uses target_hostels with lavender bar color to match the screenshot.
 * operational_hostel_boolean is 100% null — no real data behind that
 * part of the title; not derived from anything.
 */

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="wcd-tooltip">
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
      <div style={{ color: '#7c3aed', fontSize: '0.72rem' }}>
        Hostels: <strong>{payload[0].value}</strong>
      </div>
    </div>
  )
}

export default function HostelsDistrictBar({ data }) {
  const title = 'District wise No of Working Women Hostels with day care facilities - Target & Operational Status'

  if (!data || data.length === 0) {
    return (
      <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="wcd-chart-panel__title" style={{ fontSize: '0.62rem', lineHeight: 1.3 }}>
          <span>{title}</span>
        </div>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#94a3b8', fontSize: '0.85rem', fontWeight: 500
        }}>
          No hostel data available
        </div>
      </div>
    )
  }

  return (
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title" style={{ fontSize: '0.62rem', lineHeight: 1.3 }}>
        <span>{title}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 5, bottom: -5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#334155', fontSize: 9, fontWeight: 600 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar
              dataKey="value"
              name="Target Hostels"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
            >
              <LabelList
                dataKey="value"
                position="top"
                fill="#7c3aed"
                fontSize={10}
                fontWeight={700}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
