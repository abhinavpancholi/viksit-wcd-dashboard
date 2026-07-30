import React, { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, LabelList
} from 'recharts'
import { Maximize2, Minimize2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatIndian } from '../../utils/formatters'

/**
 * Malnutrition Reduction Drillable Grouped Bar Chart
 * Features:
 * - Zoom/Expand Modal Popup button in the top title row
 * - Inline right-aligned Legend and Breadcrumb trail
 * - Anganwadi-level pagination (15/page in inline view, 25/page in expanded view)
 * - Trimmed X-axis label names (max 15 chars) with full name in tooltip
 */

const PAGE_SIZE_INLINE = 15
const PAGE_SIZE_EXPANDED = 25

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const fem = payload.find(p => p.dataKey === 'female_delta')
  const male = payload.find(p => p.dataKey === 'male_delta')
  return (
    <div className="wcd-tooltip" style={{ background: '#0f172a', color: '#fff', padding: '8px 12px', borderRadius: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 4 }}>{label}</div>
      {fem && (
        <div style={{ color: '#f472b6', fontSize: '0.75rem', marginTop: 2 }}>
          Reduction in Female: <strong>{formatIndian(fem.value)}</strong>
        </div>
      )}
      {male && (
        <div style={{ color: '#38bdf8', fontSize: '0.75rem', marginTop: 2 }}>
          Reduction in Male: <strong>{formatIndian(male.value)}</strong>
        </div>
      )}
    </div>
  )
}

export default function MalnutritionReductionBar({
  data,
  drillLevel = 0,
  selectedRegion,
  selectedDistrict,
  selectedBlock,
  onBarClick,
  onBreadcrumbClick
}) {
  const [page, setPage] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  // Reset page when data/drill changes
  React.useEffect(() => {
    setPage(0)
  }, [data, drillLevel, selectedRegion, selectedDistrict, selectedBlock])

  const titles = [
    'Region wise Malnutrition Reduction',
    'District wise Malnutrition Reduction',
    'Block wise Malnutrition Reduction',
    'Anganwadi wise Malnutrition Reduction'
  ]

  const title = titles[drillLevel] || titles[0]

  const formattedData = useMemo(() => {
    if (!data) return []
    return data.map(item => ({
      name: item.name || item.block_name || item.anganwadi_name || '',
      female_delta: item.female_delta || 0,
      male_delta: item.male_delta || 0,
      dist_code: item.dist_code,
      original: item
    }))
  }, [data])

  const pageSize = isExpanded ? PAGE_SIZE_EXPANDED : PAGE_SIZE_INLINE
  const needsPagination = drillLevel >= 3 && formattedData.length > pageSize
  const totalPages = needsPagination ? Math.ceil(formattedData.length / pageSize) : 1
  const displayData = needsPagination
    ? formattedData.slice(page * pageSize, (page + 1) * pageSize)
    : formattedData

  const handleBarClick = (entry) => {
    if (onBarClick && entry && entry.name) {
      onBarClick(entry.original || entry)
    }
  }

  if (!data) return null

  const barCount = displayData.length
  const needsRotation = barCount > 6

  const renderBreadcrumbs = () => (
    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500, display: 'flex', gap: 4, alignItems: 'center' }}>
      <span
        style={{ cursor: 'pointer', color: drillLevel > 0 ? '#0284c7' : '#334155', fontWeight: drillLevel === 0 ? 700 : 500 }}
        onClick={() => onBreadcrumbClick && onBreadcrumbClick(0)}
      >
        All Regions
      </span>

      {drillLevel >= 1 && selectedRegion && (
        <>
          <span>{' > '}</span>
          <span
            style={{ cursor: 'pointer', color: drillLevel > 1 ? '#0284c7' : '#334155', fontWeight: drillLevel === 1 ? 700 : 500 }}
            onClick={() => onBreadcrumbClick && onBreadcrumbClick(1)}
          >
            {selectedRegion}
          </span>
        </>
      )}

      {drillLevel >= 2 && selectedDistrict && (
        <>
          <span>{' > '}</span>
          <span
            style={{ cursor: 'pointer', color: drillLevel > 2 ? '#0284c7' : '#334155', fontWeight: drillLevel === 2 ? 700 : 500 }}
            onClick={() => onBreadcrumbClick && onBreadcrumbClick(2)}
          >
            {selectedDistrict}
          </span>
        </>
      )}

      {drillLevel >= 3 && selectedBlock && (
        <>
          <span>{' > '}</span>
          <span style={{ color: '#0f172a', fontWeight: 700 }}>{selectedBlock}</span>
        </>
      )}
    </div>
  )

  const renderLegend = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.72rem', fontWeight: 600 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: '#ec4899' }} />
        <span style={{ color: '#ec4899' }}>Reduction in Female</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: '#0284c7' }} />
        <span style={{ color: '#0284c7' }}>Reduction in Male</span>
      </div>
    </div>
  )

  const renderPagination = () => (
    needsPagination && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem' }}>
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          style={{
            padding: '3px 8px',
            fontSize: '0.68rem',
            fontWeight: 600,
            color: page === 0 ? '#cbd5e1' : '#0284c7',
            background: 'transparent',
            border: `1px solid ${page === 0 ? '#e2e8f0' : '#0284c7'}`,
            borderRadius: 4,
            cursor: page === 0 ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <ChevronLeft size={12} /> Prev
        </button>
        <span style={{ color: '#64748b', fontWeight: 600 }}>
          {page + 1}/{totalPages} ({formattedData.length} total)
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          style={{
            padding: '3px 8px',
            fontSize: '0.68rem',
            fontWeight: 600,
            color: page >= totalPages - 1 ? '#cbd5e1' : '#0284c7',
            background: 'transparent',
            border: `1px solid ${page >= totalPages - 1 ? '#e2e8f0' : '#0284c7'}`,
            borderRadius: 4,
            cursor: page >= totalPages - 1 ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          Next <ChevronRight size={12} />
        </button>
      </div>
    )
  )

  const renderChart = (isModal = false) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={displayData}
        margin={{
          top: isModal ? 25 : 18,
          right: isModal ? 30 : 20,
          bottom: needsRotation ? (isModal ? 70 : 55) : 20,
          left: isModal ? 0 : -10
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#475569', fontSize: isModal ? 10.5 : (barCount > 30 ? 7 : barCount > 15 ? 8 : 9.5), fontWeight: 500 }}
          axisLine={{ stroke: '#cbd5e1' }}
          tickLine={false}
          interval={0}
          angle={needsRotation ? -45 : 0}
          textAnchor={needsRotation ? 'end' : 'middle'}
          height={needsRotation ? (isModal ? 75 : 60) : 25}
          tickFormatter={(val) => (val && val.length > 15 ? `${val.slice(0, 15)}...` : val)}
        />
        <YAxis
          tick={{ fill: '#64748b', fontSize: isModal ? 11 : 10 }}
          axisLine={false}
          tickLine={false}
        />
        <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1.5} />
        <Tooltip content={<CustomTooltip />} />

        <Bar
          dataKey="female_delta"
          name="Reduction in Female"
          fill="#ec4899"
          radius={[4, 4, 0, 0]}
          maxBarSize={isModal ? 36 : 26}
          onClick={handleBarClick}
          cursor="pointer"
        >
          <LabelList
            dataKey="female_delta"
            position="top"
            fill="#be185d"
            fontSize={isModal ? 10 : (barCount > 15 ? 7.5 : 9)}
            fontWeight={700}
          />
        </Bar>

        <Bar
          dataKey="male_delta"
          name="Reduction in Male"
          fill="#0284c7"
          radius={[4, 4, 0, 0]}
          maxBarSize={isModal ? 36 : 26}
          onClick={handleBarClick}
          cursor="pointer"
        >
          <LabelList
            dataKey="male_delta"
            position="top"
            fill="#0369a1"
            fontSize={isModal ? 10 : (barCount > 15 ? 7.5 : 9)}
            fontWeight={700}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )

  return (
    <>
      {/* Normal Inline Chart Panel */}
      <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Panel Header Title with Zoom Button */}
        <div className="wcd-chart-panel__title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{title}</span>
          <button
            onClick={() => setIsExpanded(true)}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              padding: '3px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.68rem',
              color: '#0284c7',
              fontWeight: 600,
              transition: 'all 0.15s ease'
            }}
            title="Expand Zoom View"
          >
            <Maximize2 size={12} />
          </button>
        </div>

        {/* Sub-header row: Breadcrumb on Left + Legend & Pagination on Right */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 2,
          marginBottom: 8
        }}>
          {renderBreadcrumbs()}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {renderPagination()}
            {renderLegend()}
          </div>
        </div>

        {/* Main Inline Chart Area */}
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
            padding: '24px 28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            {/* Modal Top Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: 12,
              marginBottom: 12
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {title}
                </h3>
                <div style={{ marginTop: 4 }}>
                  {renderBreadcrumbs()}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {renderPagination()}
                {renderLegend()}
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
            </div>

            {/* Modal Large Chart Canvas */}
            <div style={{ flex: 1, minHeight: 0 }}>
              {renderChart(true)}
            </div>

            {/* Modal Footer Note */}
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center', marginTop: 8, fontWeight: 500 }}>
              Click any bar to drill down. Hover to view exact values.
            </div>
          </div>
        </div>
      )}
    </>
  )
}
