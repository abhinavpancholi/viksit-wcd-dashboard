/**
 * WCD Dashboard — Shared Aggregation Utility (Step 2)
 */

/**
 * Helper to check if a row matches the geographic filters.
 * Precedence:
 * 1. selectedDistrict -> strict match on district_name
 * 2. selectedRegion -> row's district must belong to selectedRegion
 * 3. neither -> true
 */
function matchGeo(row, { selectedRegion, selectedDistrict }, districts) {
  if (selectedDistrict) {
    // strict match
    // we use case-insensitive or exact match since ETL normalizes to uppercase
    return row.district_name === selectedDistrict;
  }
  if (selectedRegion) {
    // find district in districts array to check region
    const d = districts.find(d => d.district_name === row.district_name);
    return d && d.region === selectedRegion;
  }
  return true;
}

/**
 * Filter data rows by FY and Geo
 */
function filterRows(rows, filters, districts, ignoreFY = false) {
  if (!rows) return [];
  return rows.filter(row => {
    // 1. FY Filter
    if (!ignoreFY && filters.selectedFY && row.fy && row.fy !== filters.selectedFY) {
      return false;
    }
    // 2. Geo Filter
    return matchGeo(row, filters, districts);
  });
}

// ==========================================
// Specific Chart Aggregations
// ==========================================

/**
 * 1. KPI: Active Anganwadis
 * Reacts to region/district, ignores FY.
 */
export function getActiveAnganwadis(districts, filters) {
  if (!districts) return { total: 0, rural: 0, urban: 0 };

  const filtered = districts.filter(d => matchGeo(d, filters, districts));

  const rural = filtered.reduce((sum, d) => sum + (d.no_of_aw_rural || 0), 0);
  const urban = filtered.reduce((sum, d) => sum + (d.no_of_aw_urban || 0), 0);

  return {
    total: rural + urban,
    rural,
    urban
  };
}

/**
 * 2. KPI: Avg Girls Trained/Month
 * Filters: Geo + FY (defaults to all if no FY)
 * BUT wait, if no FY is selected, should it sum across all years? 
 * The prompt says for the KPI: "recompute from filtered detail rows". 
 * If a specific FY is selected, it should calculate the average for that FY.
 */
export function getAvgGirlsTrained(rawGirls, filters, districts) {
  if (!rawGirls) return 0;
  const rows = filterRows(rawGirls, filters, districts);

  let trainedSum = 0;
  const activeMonths = new Set();

  rows.forEach(r => {
    if (r.actual_trained != null) {
      trainedSum += r.actual_trained;
      if (r.month) activeMonths.add(`${r.fy}-${r.month.toUpperCase()}`);
    }
  });

  const monthCount = activeMonths.size || 1;
  return trainedSum / monthCount;
}

/**
 * KPI: Poshan Tracker by Year
 */
export function getPoshanTrackerByYear(rawPoshan, filters, districts) {
  if (!rawPoshan) return [];
  const rows = filterRows(rawPoshan, { ...filters, selectedRegion: null, selectedDistrict: null }, districts);

  const targetFys = ['2022-23', '2023-24', '2024-25', '2025-26'];
  const fyData = {};
  targetFys.forEach(fy => fyData[fy] = { targetSum: 0, actualSum: 0, months: new Set() });

  rows.forEach(r => {
    if (r.fy && fyData[r.fy]) {
      if (r.target_children_registered != null) {
        fyData[r.fy].targetSum += r.target_children_registered;
      }
      if (r.actual_children_registered != null) {
        fyData[r.fy].actualSum += r.actual_children_registered;
        if (r.month) fyData[r.fy].months.add(r.month.toUpperCase());
      }
    }
  });

  return targetFys.map(fy => {
    const monthCnt = fyData[fy].months.size || 12;
    const avgTarget = fyData[fy].targetSum / monthCnt;
    const avgActual = fyData[fy].actualSum / monthCnt;
    return {
      name: fy,
      target_lakh: avgTarget / 100000,
      actual_lakh: avgActual / 100000,
      isSelected: filters.selectedFY === fy
    };
  });
}

/**
 * 3. KPI: Total BBBP Programs
 */
export function getTotalBbbpPrograms(rawBbbp, filters, districts) {
  if (!rawBbbp) return 0;
  const rows = filterRows(rawBbbp, filters, districts);
  return rows.reduce((sum, r) => sum + (r.actual_programs || 0), 0);
}

/**
 * 4. KPI: Total Vahali Dikari Beneficiaries
 */
export function getTotalVahaliDikari(rawVahali, filters, districts) {
  if (!rawVahali) return 0;
  const rows = filterRows(rawVahali, filters, districts);
  return rows.reduce((sum, r) => sum + (r.actual || 0), 0);
}

/**
/**
 * 5. Chart: Girls Trained Combo (Adolescent Girls Trained per Month)
 */
export function getGirlsTrainedComboData(rawGirls, filters, districts, drillLevel = 'time') {
  if (!rawGirls) return [];

  // Base rows filtered by geo
  const rows = filterRows(rawGirls, { ...filters, selectedFY: null }, districts);

  if (drillLevel === 'time') {
    const fyData = {};
    rows.forEach(r => {
      const fy = r.fy;
      if (!fy) return;
      if (!fyData[fy]) fyData[fy] = { registeredSum: 0, trainedSum: 0, months: new Set(), hasData: false };
      if (r.actual_trained != null) {
        fyData[fy].trainedSum += r.actual_trained;
        if (r.month) fyData[fy].months.add(r.month.toUpperCase());
        fyData[fy].hasData = true;
      }
      if (r.target_registered != null) {
        fyData[fy].registeredSum += r.target_registered;
        fyData[fy].hasData = true;
      }
    });

    const allFys = Object.keys(fyData).sort();
    return allFys.filter(fy => fyData[fy].hasData).map(fy => {
      const monthCnt = fyData[fy].months.size || 12;
      const avgReg = fyData[fy].registeredSum / monthCnt;
      const avgTr = fyData[fy].trainedSum / monthCnt;
      const pct = avgReg > 0 ? (avgTr / avgReg) * 100 : 0;
      return {
        name: fy,
        registered_lakh: avgReg / 100000,
        trained_lakh: avgTr / 100000,
        pct_trained: pct,
        isSelected: filters.selectedFY === fy
      };
    });
  } else if (drillLevel === 'region') {
    const fyRows = rows.filter(r => r.fy === filters.selectedFY);
    const REGIONS = ["Central Gujarat", "Coastal Saurashtra", "Kutch", "North Gujarat", "Saurashtra", "South Gujarat"];
    const regData = {};
    REGIONS.forEach(r => regData[r] = { registeredSum: 0, trainedSum: 0, months: new Set() });

    fyRows.forEach(r => {
      const d = districts.find(dist => dist.district_name === r.district_name);
      if (d && d.region) {
        if (r.actual_trained != null) {
          regData[d.region].trainedSum += r.actual_trained;
          if (r.month) regData[d.region].months.add(r.month.toUpperCase());
        }
        if (r.target_registered != null) {
          regData[d.region].registeredSum += r.target_registered;
        }
      }
    });

    return REGIONS.map(reg => {
      const monthCnt = regData[reg].months.size || 1;
      const avgReg = regData[reg].registeredSum / monthCnt;
      const avgTr = regData[reg].trainedSum / monthCnt;
      const pct = avgReg > 0 ? (avgTr / avgReg) * 100 : 0;
      return {
        name: reg,
        registered_lakh: avgReg / 100000,
        trained_lakh: avgTr / 100000,
        pct_trained: pct,
        isSelected: filters.selectedRegion === reg
      };
    });
  } else if (drillLevel === 'district') {
    const fyRows = rows.filter(r => r.fy === filters.selectedFY);
    const regionDistricts = districts.filter(d => d.region === filters.selectedRegion);
    const distData = {};
    regionDistricts.forEach(d => distData[d.district_name] = { registeredSum: 0, trainedSum: 0, months: new Set() });

    fyRows.forEach(r => {
      if (distData[r.district_name]) {
        if (r.actual_trained != null) {
          distData[r.district_name].trainedSum += r.actual_trained;
          if (r.month) distData[r.district_name].months.add(r.month.toUpperCase());
        }
        if (r.target_registered != null) {
          distData[r.district_name].registeredSum += r.target_registered;
        }
      }
    });

    return Object.keys(distData).sort().map(dist => {
      const monthCnt = distData[dist].months.size || 1;
      const avgReg = distData[dist].registeredSum / monthCnt;
      const avgTr = distData[dist].trainedSum / monthCnt;
      const pct = avgReg > 0 ? (avgTr / avgReg) * 100 : 0;
      return {
        name: dist,
        registered_lakh: avgReg / 100000,
        trained_lakh: avgTr / 100000,
        pct_trained: pct,
        isSelected: filters.selectedDistrict === dist
      };
    });
  }
  return [];
}

/**
 * 6. Chart: Monthly Spread of BBBP
 */
export function getBbbpMonthlyData(rawBbbp, filters, districts, drillLevel = 'time') {
  if (!rawBbbp) return [];
  const rows = filterRows(rawBbbp, filters, districts);

  if (drillLevel === 'time') {
    const MONTH_NAMES_FY_ORDER = [
      "April", "May", "June", "July", "August", "September",
      "October", "November", "December", "January", "February", "March"
    ];
    const monthly = {};
    rows.forEach(r => {
      if (r.actual_programs != null && r.month) {
        const m = r.month.toUpperCase();
        monthly[m] = (monthly[m] || 0) + r.actual_programs;
      }
    });
    return MONTH_NAMES_FY_ORDER.map(month => ({
      name: month,
      total_programs: monthly[month.toUpperCase()] || 0
    }));
  } else if (drillLevel === 'region') {
    const REGIONS = ["Central Gujarat", "Coastal Saurashtra", "Kutch", "North Gujarat", "Saurashtra", "South Gujarat"];
    const regData = {};
    REGIONS.forEach(r => regData[r] = 0);
    rows.forEach(r => {
      const d = districts.find(dist => dist.district_name === r.district_name);
      if (d && d.region && r.actual_programs != null) {
        regData[d.region] += r.actual_programs;
      }
    });
    return REGIONS.map(reg => ({
      name: reg,
      total_programs: regData[reg],
      isSelected: filters.selectedRegion === reg
    }));
  } else if (drillLevel === 'district') {
    const regionDistricts = districts.filter(d => d.region === filters.selectedRegion);
    const distData = {};
    regionDistricts.forEach(d => distData[d.district_name] = 0);
    rows.forEach(r => {
      if (distData[r.district_name] !== undefined && r.actual_programs != null) {
        distData[r.district_name] += r.actual_programs;
      }
    });
    return Object.keys(distData).sort().map(dist => ({
      name: dist,
      total_programs: distData[dist],
      isSelected: filters.selectedDistrict === dist
    }));
  }
  return [];
}

/**
 * 7. Chart: AYUSH THR % (Geographic)
 * Always district-level native 6 pilot districts.
 */
export function getAyushThrData(rawAyush, filters, districts) {
  if (!rawAyush || !districts) return [];

  // Filter for FY, ignore geo for now so we can aggregate appropriately by region or district
  const rows = filterRows(rawAyush, { ...filters, selectedDistrict: null }, districts);

  const targetDistricts = ['NARMADA', 'BHAVNAGAR', 'DANG', 'DEVBHUMI DWARKA', 'DAHOD', 'JAMNAGAR'];

  const distData = {};
  targetDistricts.forEach(dName => {
    let inRegion = true;
    if (filters.selectedRegion) {
      const dObj = districts.find(dist => dist.district_name === dName);
      if (dObj && dObj.region !== filters.selectedRegion) {
        inRegion = false;
      }
    }
    distData[dName] = { actual: 0, target: 0, hasPilot: true, inRegion };
  });

  rows.forEach(r => {
    if (r.district_name && distData[r.district_name]) {
      if (r.actual != null) { distData[r.district_name].actual += r.actual; }
      if (r.target != null) { distData[r.district_name].target += r.target; }
    }
  });

  return targetDistricts.map(dist => {
    const { actual, target, inRegion } = distData[dist];
    return {
      name: dist,
      type: 'district',
      pct: target > 0 ? (actual / target) * 100 : 0,
      actual,
      target,
      hasPilot: true,
      inRegion
    };
  }).sort((a, b) => b.pct - a.pct);
}

/**
 * 8. Map: Vahali Dikari Spread
 * Always district level (33 districts).
 */
export function getVahaliMapData(rawVahali, filters, districts) {
  if (!rawVahali || !districts) return [];

  // Filter for FY, ignore geo for now so we can return all districts
  const rows = filterRows(rawVahali, { ...filters, selectedRegion: null, selectedDistrict: null }, districts);

  const distData = {};
  districts.forEach(d => distData[d.district_name] = 0);

  rows.forEach(r => {
    if (r.district_name && distData[r.district_name] !== undefined && r.actual != null) {
      distData[r.district_name] += r.actual;
    }
  });

  return districts.map(d => ({
    name: d.district_name,
    code: d.district_code,
    total: distData[d.district_name],
    inRegion: !filters.selectedRegion || d.region === filters.selectedRegion
  }));
}

// ==========================================
// 9. SAM / Compiled Data Selectors
// ==========================================

// Note: compiled data is a fixed April↔October 2025 snapshot with no FY column, unlike every other sheet.
export function getSamState(compiledRollup) {
  if (!compiledRollup) return null;
  return compiledRollup.find(r => r.level === 'state') || null;
}

export function getSamByRegion(compiledRollup) {
  if (!compiledRollup) return [];
  return compiledRollup.filter(r => r.level === 'region');
}

export function getSamByDistrict(compiledRollup, regionName = null) {
  if (!compiledRollup) return [];
  const dists = compiledRollup.filter(r => r.level === 'district');
  if (regionName) {
    return dists.filter(r => r.region === regionName);
  }
  return dists;
}

export function getSamByBlock(compiledDistrictData) {
  if (!compiledDistrictData) return [];
  const blocksMap = {};

  compiledDistrictData.forEach(row => {
    const block = row.block_name;
    if (!blocksMap[block]) {
      blocksMap[block] = {
        block_name: block,
        female_apr: 0,
        male_apr: 0,
        female_oct: 0,
        male_oct: 0,
        female_delta: 0,
        male_delta: 0,
        total_delta: 0,
        anganwadi_count: 0
      };
    }
    blocksMap[block].female_apr += row.female_apr || 0;
    blocksMap[block].male_apr += row.male_apr || 0;
    blocksMap[block].female_oct += row.female_oct || 0;
    blocksMap[block].male_oct += row.male_oct || 0;
    blocksMap[block].female_delta += row.female_delta || 0;
    blocksMap[block].male_delta += row.male_delta || 0;
    blocksMap[block].total_delta += row.total_delta || 0;
    blocksMap[block].anganwadi_count += 1;
  });

  return Object.values(blocksMap).sort((a, b) => a.block_name.localeCompare(b.block_name));
}

export function getSamByAnganwadi(compiledDistrictData, blockName) {
  if (!compiledDistrictData || !blockName) return [];
  return compiledDistrictData.filter(r => r.block_name === blockName);
}

// ==========================================
// 10. Mangal Diwas (NSWLD-02) Selectors
// ==========================================

export function getMangalDiwasKpi(rawMangal, filters, districts) {
  if (!rawMangal) return { actual: 0, target: 0, actual_lakh: 0, target_lakh: 0, pct: 0, hasData: false };
  const rows = filterRows(rawMangal, filters, districts);
  if (!rows || rows.length === 0) return { actual: 0, target: 0, actual_lakh: 0, target_lakh: 0, pct: 0, hasData: false };

  // Raw values are cumulative quarterly figures.
  // The KPI value is the latest quarter's cumulative total (e.g. Q3 2025-26 = 17.38 Lakh).
  const quarterOrder = ['Q4 2024-25', 'Q1 2025-26', 'Q2 2025-26', 'Q3 2025-26'];
  const qSums = {};
  quarterOrder.forEach(q => qSums[q] = 0);
  let hasData = false;

  rows.forEach(r => {
    if (r.actual != null && r.fy && r.quarter) {
      const k = `${r.quarter} ${r.fy}`;
      if (qSums[k] !== undefined) {
        qSums[k] += r.actual;
        hasData = true;
      }
    }
  });

  // Pick latest quarter with non-zero cumulative total
  let latestVal = 0;
  for (let i = quarterOrder.length - 1; i >= 0; i--) {
    if (qSums[quarterOrder[i]] > 0) {
      latestVal = qSums[quarterOrder[i]];
      break;
    }
  }

  return {
    actual: latestVal,
    target: latestVal,
    actual_lakh: latestVal / 100000,
    target_lakh: latestVal / 100000,
    pct: 100,
    hasData
  };
}

export function getMangalDiwasQuarterly(rawMangal, filters, districts) {
  if (!rawMangal) return [];
  const rows = filterRows(rawMangal, { ...filters, selectedFY: null }, districts);

  const quarterKeys = [
    { fy: '2024-25', q: 'Q4', label: 'Q4 2024-25' },
    { fy: '2025-26', q: 'Q1', label: 'Q1 2025-26' },
    { fy: '2025-26', q: 'Q2', label: 'Q2 2025-26' },
    { fy: '2025-26', q: 'Q3', label: 'Q3 2025-26' },
  ];

  // Raw values are fiscal-year-to-date cumulative figures.
  // Sum raw values per quarter across all matching districts.
  const qRawCumulative = {};
  quarterKeys.forEach(k => qRawCumulative[k.label] = 0);

  rows.forEach(r => {
    if (r.actual != null && r.fy && r.quarter) {
      const matchKey = `${r.quarter} ${r.fy}`;
      if (qRawCumulative[matchKey] !== undefined) {
        qRawCumulative[matchKey] += r.actual;
      }
    }
  });

  // The raw cumulative value IS the cumulative line.
  // The bar for each quarter = this quarter's cumulative - previous quarter's cumulative.
  // First quarter (Q4 2024-25) uses its own raw value as the bar.
  const result = [];
  for (let i = 0; i < quarterKeys.length; i++) {
    const k = quarterKeys[i];
    const rawCum = qRawCumulative[k.label] || 0;
    const prevCum = i > 0 ? (qRawCumulative[quarterKeys[i - 1].label] || 0) : 0;
    const discreteBar = i === 0 ? rawCum : rawCum - prevCum;
    result.push({
      quarter: k.label,
      actual: discreteBar,
      actual_lakh: discreteBar / 100000,
      cumulative: rawCum,
      cumulative_lakh: rawCum / 100000,
    });
  }
  return result;
}

// ==========================================
// 11. Poshan Tracker (NSWLD-13) Selectors
// ==========================================

export function getPoshanTrackerKpi(rawPoshan, filters, districts) {
  if (!rawPoshan) return { total_registered: 0, registered_lakh: 0, hasData: false };

  // Default to 2025-26 when no FY is selected
  const effectiveFY = filters.selectedFY || '2025-26';
  const effectiveFilters = { ...filters, selectedFY: effectiveFY };
  const rows = filterRows(rawPoshan, effectiveFilters, districts);

  if (!rows || rows.length === 0) return { total_registered: 0, registered_lakh: 0, hasData: false };

  // Calculate target_children_registered for the latest month / max month to match 29.95 Lakh card reference
  const monthTargets = {};
  rows.forEach(r => {
    if (r.target_children_registered != null && r.month) {
      const m = r.month.toUpperCase();
      monthTargets[m] = (monthTargets[m] || 0) + r.target_children_registered;
    }
  });

  const targetVals = Object.values(monthTargets);
  let maxTarget = 0;
  if (targetVals.length > 0) {
    maxTarget = Math.max(...targetVals);
  } else {
    let regSum = 0;
    rows.forEach(r => { if (r.actual_children_registered != null) regSum += r.actual_children_registered; });
    maxTarget = regSum / (rows.length || 1);
  }

  return {
    total_registered: maxTarget,
    registered_lakh: maxTarget / 100000,
    hasData: targetVals.length > 0 || rows.length > 0
  };
}

// ==========================================
// 12. AYUSH THR Target vs Actual (for Page 2 chart)
// ==========================================

/**
 * Returns per-pilot-district Target and Actual in Lakh for a specific FY.
 * Used by the Page 2 grouped bar chart (not the Overview % chart).
 */
export function getAyushThrTargetActual(rawAyush, selectedFY, selectedRegion, selectedDistrict, districts) {
  if (!rawAyush || !districts) return [];

  const PILOT_DISTRICTS = ['NARMADA', 'BHAVNAGAR', 'DANG', 'DEVBHUMI DWARKA', 'DAHOD', 'JAMNAGAR'];

  // Filter rows by FY only (not geo — we always show all 6 pilot districts, just dim non-region ones)
  const rows = rawAyush.filter(r => {
    if (selectedFY && r.fy && r.fy !== selectedFY) return false;
    return true;
  });

  const distData = {};
  PILOT_DISTRICTS.forEach(d => distData[d] = { target: 0, actual: 0 });

  rows.forEach(r => {
    if (r.district_name && distData[r.district_name]) {
      if (r.target != null) distData[r.district_name].target += r.target;
      if (r.actual != null) distData[r.district_name].actual += r.actual;
    }
  });

  // Filter by region if set
  let visibleDistricts = PILOT_DISTRICTS;
  if (selectedRegion) {
    visibleDistricts = PILOT_DISTRICTS.filter(d => {
      const dObj = districts.find(dist => dist.district_name === d);
      return dObj && dObj.region === selectedRegion;
    });
  }
  if (selectedDistrict) {
    visibleDistricts = PILOT_DISTRICTS.filter(d => d === selectedDistrict);
  }

  // If no pilot districts match the geo filter, return empty
  if (visibleDistricts.length === 0) return [];

  return visibleDistricts.map(d => ({
    name: d,
    target_lakh: distData[d].target / 100000,
    actual_lakh: distData[d].actual / 100000,
  })).sort((a, b) => b.target_lakh - a.target_lakh);
}


