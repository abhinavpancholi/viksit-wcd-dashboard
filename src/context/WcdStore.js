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
  districts: null,       // districts.json (with regions)
  overviewAggregates: null, // NSWLD-overview-aggregates.json
  gujaratTopo: null,     // gujarat.json (TopoJSON)
  
  // Raw Data for filtering
  rawAyush: null,        // NSWLD-01.json
  rawBbbp: null,         // NSWLD-10.json
  rawVahali: null,       // NSWLD-10_2.json
  rawGirls: null,        // NSWLD-12.json
  rawCompiled: null,     // NSWLD-compiled.json

  // Filter State
  selectedFY: null,
  selectedRegion: null,
  selectedDistrict: null,

  // Actions
  initData: async () => {
    try {
      set({ loading: true, error: null })

      const [configRes, districtsRes, aggregatesRes, topoRes, ayushRes, bbbpRes, vahaliRes, girlsRes, compiledRes] = await Promise.all([
        fetch('/data/wcdConfig.json'),
        fetch('/data/districts.json'),
        fetch('/data/NSWLD-overview-aggregates.json'),
        fetch('/data/gujarat.json'),
        fetch('/data/NSWLD-01.json'),
        fetch('/data/NSWLD-10.json'),
        fetch('/data/NSWLD-10_2.json'),
        fetch('/data/NSWLD-12.json'),
        fetch('/data/NSWLD-compiled.json'),
      ])

      if (!configRes.ok || !districtsRes.ok || !aggregatesRes.ok || !topoRes.ok || !ayushRes.ok || !bbbpRes.ok || !vahaliRes.ok || !girlsRes.ok || !compiledRes.ok) {
        throw new Error('Failed to load one or more data files')
      }

      const [config, districts, overviewAggregates, gujaratTopo, rawAyush, rawBbbp, rawVahali, rawGirls, rawCompiled] = await Promise.all([
        configRes.json(),
        districtsRes.json(),
        aggregatesRes.json(),
        topoRes.json(),
        ayushRes.json(),
        bbbpRes.json(),
        vahaliRes.json(),
        girlsRes.json(),
        compiledRes.json(),
      ])

      set({
        config,
        districts,
        overviewAggregates,
        gujaratTopo,
        rawAyush,
        rawBbbp,
        rawVahali,
        rawGirls,
        rawCompiled,
        loading: false,
      })
    } catch (err) {
      console.error('WCD Store init error:', err)
      set({ error: err.message, loading: false })
    }
  },

  setFY: (fy) => set((state) => ({
    selectedFY: state.selectedFY === fy ? null : fy
  })),

  setRegion: (region) => set((state) => ({
    selectedRegion: state.selectedRegion === region ? null : region,
    selectedDistrict: null // Clearing district because it was scoped under region
  })),

  setDistrict: (district) => set((state) => {
    if (state.selectedDistrict === district) {
      // Toggle off district, keep region as is
      return { selectedDistrict: null };
    }
    
    // Find the region for this district
    const districtObj = state.districts?.find(d => d.district_name === district);
    const region = districtObj ? districtObj.region : state.selectedRegion;
    
    return {
      selectedDistrict: district,
      selectedRegion: region
    };
  }),

  resetFilters: () => set({
    selectedFY: null,
    selectedRegion: null,
    selectedDistrict: null
  }),
}))

export default useWcdStore
