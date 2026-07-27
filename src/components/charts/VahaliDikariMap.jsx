import React, { useRef, useEffect, useState, useMemo } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

/**
 * Gujarat District Choropleth Map — Light Theme
 */

export default function VahaliDikariMap({ topoData, districtData }) {
  const svgRef = useRef(null)
  const tooltipRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 260, height: 180 })

  const dataMap = useMemo(() => {
    const map = new Map()
    if (!districtData) return map
    districtData.forEach(d => {
      map.set(d.district_name_topo, d.total)
    })
    return map
  }, [districtData])

  const [minVal, maxVal] = useMemo(() => {
    if (!districtData?.length) return [0, 1]
    const vals = districtData.map(d => d.total)
    return [Math.min(...vals), Math.max(...vals)]
  }, [districtData])

  useEffect(() => {
    if (!topoData || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = dimensions.width
    const height = dimensions.height

    const geojson = topojson.feature(topoData, topoData.objects.districts)
    const projection = d3.geoMercator().fitSize([width - 16, height - 16], geojson)
    const pathGenerator = d3.geoPath().projection(projection)

    // Vibrant Light-Theme Color Scale (Soft Light Blue -> Deep Royal Blue)
    const colorScale = d3.scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(d3.interpolateRgbBasis(['#e0f2fe', '#38bdf8', '#0284c7', '#0369a1']))

    const g = svg.append('g').attr('transform', 'translate(8,8)')

    g.selectAll('path')
      .data(geojson.features)
      .join('path')
      .attr('d', pathGenerator)
      .attr('fill', (d) => {
        const name = d.properties.district
        const val = dataMap.get(name)
        return val != null ? colorScale(val) : '#f1f5f9'
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1)
      .attr('cursor', 'pointer')
      .style('transition', 'all 0.15s ease')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('stroke', '#0f172a').attr('stroke-width', 1.8)
        const name = d.properties.district
        const val = dataMap.get(name)
        const tooltip = tooltipRef.current
        if (tooltip) {
          tooltip.style.opacity = '1'
          tooltip.innerHTML = `
            <div style="font-weight:700;margin-bottom:2px;color:#0f172a">${name}</div>
            <div style="color:#0284c7">Beneficiaries: <strong>${val != null ? val.toLocaleString('en-IN') : 'N/A'}</strong></div>
          `
        }
      })
      .on('mousemove', function (event) {
        const tooltip = tooltipRef.current
        if (tooltip) {
          const rect = svgRef.current.getBoundingClientRect()
          tooltip.style.left = `${event.clientX - rect.left + 10}px`
          tooltip.style.top = `${event.clientY - rect.top - 10}px`
        }
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke', '#ffffff').attr('stroke-width', 1)
        const tooltip = tooltipRef.current
        if (tooltip) {
          tooltip.style.opacity = '0'
        }
      })

  }, [topoData, dataMap, dimensions, minVal, maxVal])

  const containerRef = useRef(null)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          setDimensions({ width, height: height - 20 })
        }
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="wcd-chart-panel" style={{ height: '100%' }}>
      <div className="wcd-chart-panel__title">
        <span>Vahali Dikari Spread Across State</span>
      </div>
      <div ref={containerRef} className="wcd-map-container" style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          style={{ display: 'block' }}
        />
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: '0.7rem',
            color: '#0f172a',
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 0.15s',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        />
        <div className="wcd-map-legend">
          <span>{minVal.toLocaleString('en-IN')} (min)</span>
          <div className="wcd-map-legend__bar" />
          <span>{maxVal.toLocaleString('en-IN')} (max)</span>
        </div>
      </div>
    </div>
  )
}
