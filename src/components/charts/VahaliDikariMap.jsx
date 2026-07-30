import React, { useRef, useEffect, useState, useMemo } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

/**
 * Gujarat District Choropleth Map — Light Theme
 */

export default function VahaliDikariMap({ 
  topoData, districtData, districts,
  selectedRegion, selectedDistrict,
  onDistrictClick
}) {
  const svgRef = useRef(null)
  const tooltipRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 260, height: 180 })

  const dataMap = useMemo(() => {
    const map = new Map()
    if (!districtData) return map
    districtData.forEach(d => {
      map.set(d.name.toUpperCase(), { total: d.total, inRegion: d.inRegion })
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

    const colorScale = d3.scaleSequential()
      .domain([minVal, maxVal])
      .interpolator(d3.interpolateRgbBasis(['#e0f2fe', '#38bdf8', '#0284c7', '#0369a1']))

    const g = svg.append('g').attr('transform', 'translate(8,8)')

    const featureCollection = topojson.feature(topoData, topoData.objects.districts);
    const projection = d3.geoMercator().fitSize([width - 16, height - 16], featureCollection);
    const pathGenerator = d3.geoPath().projection(projection);

    const getBackendDistrictName = (topoName) => {
      if (!districts) return topoName.toUpperCase();
      const d = districts.find(d => d.district_name.replace(/ /g, '').includes(topoName.toUpperCase().replace(/ /g, '')) || topoName.toUpperCase().includes(d.district_name.replace(/ /g, '')));
      const HARDCODED_MAP = {
        "Ahmedabad": "AHMADABAD", "Amreli": "AMRELI", "Anand": "ANAND", "Aravalli": "ARVALLI",
        "Banaskantha": "BANAS KANTHA", "Bharuch": "BHARUCH", "Bhavnagar": "BHAVNAGAR", "Botad": "BOTAD",
        "Chhota Udaipur": "CHHOTAUDEPUR", "Dahod": "DAHOD", "Dang": "DANG", "Devbhumi Dwarka": "DEVBHUMI DWARKA",
        "Gandhinagar": "GANDHINAGAR", "Gir Somnath": "GIR SOMNATH", "Jamnagar": "JAMNAGAR", "Junagadh": "JUNAGADH",
        "Kutch": "KACHCHH", "Kheda": "KHEDA", "Mehsana": "MAHESANA", "Morbi": "MORBI", "Mahisagar": "MAHISAGAR",
        "Narmada": "NARMADA", "Navsari": "NAVSARI", "Panchmahal": "PANCH MAHALS", "Patan": "PATAN",
        "Porbandar": "PORBANDAR", "Rajkot": "RAJKOT", "Sabarkantha": "SABAR KANTHA", "Surat": "SURAT",
        "Surendranagar": "SURENDRANAGAR", "Tapi": "TAPI", "Vadodara": "VADODARA", "Valsad": "VALSAD"
      };
      return d ? d.district_name : (HARDCODED_MAP[topoName] || topoName.toUpperCase());
    }

    g.selectAll('path')
      .data(featureCollection.features)
      .join('path')
      .attr('d', pathGenerator)
      .attr('fill', (d) => {
        const backendName = getBackendDistrictName(d.properties.district)
        const valData = dataMap.get(backendName)
        return valData != null && valData.total != null ? colorScale(valData.total) : '#f1f5f9'
      })
      .attr('stroke', (d) => {
        const backendName = getBackendDistrictName(d.properties.district)
        return selectedDistrict && selectedDistrict === backendName ? '#0f172a' : '#ffffff'
      })
      .attr('stroke-width', (d) => {
        const backendName = getBackendDistrictName(d.properties.district)
        return selectedDistrict && selectedDistrict === backendName ? 2 : 1
      })
      .attr('cursor', 'pointer')
      .style('transition', 'all 0.15s ease')
      .style('opacity', (d) => {
        const backendName = getBackendDistrictName(d.properties.district)
        const valData = dataMap.get(backendName)
        const inRegion = valData ? valData.inRegion : true
        if (selectedDistrict) {
          return selectedDistrict === backendName ? 1 : 0.3
        }
        if (selectedRegion && !inRegion) {
          return 0.3
        }
        return 1
      })
      .on('mouseenter', function (event, d) {
        const backendName = getBackendDistrictName(d.properties.district)
        if (selectedDistrict !== backendName) {
          d3.select(this).attr('stroke', '#0f172a').attr('stroke-width', 1.8)
        }
        const valData = dataMap.get(backendName)
        const tooltip = tooltipRef.current
        if (tooltip) {
          tooltip.style.opacity = '1'
          tooltip.innerHTML = `
            <div style="font-weight:700;margin-bottom:2px;color:#0f172a">${d.properties.district}</div>
            <div style="color:#0284c7">Beneficiaries: <strong>${valData && valData.total != null ? valData.total.toLocaleString('en-IN') : 'N/A'}</strong></div>
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
      .on('mouseleave', function (event, d) {
        const backendName = getBackendDistrictName(d.properties.district)
        if (selectedDistrict !== backendName) {
          d3.select(this).attr('stroke', '#ffffff').attr('stroke-width', 1)
        }
        const tooltip = tooltipRef.current
        if (tooltip) {
          tooltip.style.opacity = '0'
        }
      })
      .on('click', function(event, d) {
        const backendName = getBackendDistrictName(d.properties.district)
        if (onDistrictClick) onDistrictClick(backendName)
      })

  }, [topoData, dataMap, dimensions, minVal, maxVal, selectedRegion, selectedDistrict, districts, onDistrictClick])

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
    <div className="wcd-chart-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="wcd-chart-panel__title">
        <span>Vahali Dikari Spread Across State</span>
      </div>
      <div ref={containerRef} className="wcd-map-container" style={{ position: 'relative', flex: 1, minHeight: 0 }}>
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
