import { create } from 'zustand'

/**
 * WCD Dashboard Store — Zustand
 * Loads JSON data files produced by the ETL script (wcd_etl.py).
 * Files sourced from NSWLD-01 through NSWLD-34 + compiled + config + aggregates.
 */
const useWcdStore = create((set) => ({
  // State
  loading: true,
  error: null,
  config: null,          // wcdConfig.json
  districts: null,       // districts.json
  overviewAggregates: null, // NSWLD-overview-aggregates.json
  gujaratTopo: null,     // gujarat.json (TopoJSON)

  // Actions
  initData: async () => {
    try {
      set({ loading: true, error: null })

      const [configRes, districtsRes, aggregatesRes, topoRes] = await Promise.all([
        fetch('/data/wcdConfig.json'),
        fetch('/data/districts.json'),
        fetch('/data/NSWLD-overview-aggregates.json'),
        fetch('/data/gujarat.json'),
      ])

      if (!configRes.ok || !districtsRes.ok || !aggregatesRes.ok || !topoRes.ok) {
        throw new Error('Failed to load one or more data files')
      }

      const [config, districts, overviewAggregates, gujaratTopo] = await Promise.all([
        configRes.json(),
        districtsRes.json(),
        aggregatesRes.json(),
        topoRes.json(),
      ])

      set({
        config,
        districts,
        overviewAggregates,
        gujaratTopo,
        loading: false,
      })
    } catch (err) {
      console.error('WCD Store init error:', err)
      set({ error: err.message, loading: false })
    }
  },
}))

export default useWcdStore
