import React, { useMemo } from 'react'
import useWcdStore from '../context/WcdStore'
import DashboardLayout from '../components/layout/DashboardLayout'

// Chart Components — Page 4 (NSWLD-05, NSWLD-08, NSWLD-17, NSWLD-17(2))
import MSYBeneficiariesBar from '../components/charts/MSYBeneficiariesBar'
import MSYAvgSubsidyBar from '../components/charts/MSYAvgSubsidyBar'
import MSYSubsidyCombo from '../components/charts/MSYSubsidyCombo'
import HostelsDistrictBar from '../components/charts/HostelsDistrictBar'
import JagrutiSessionsButterfly from '../components/charts/JagrutiSessionsButterfly'
import JagrutiParticipantsCombo from '../components/charts/JagrutiParticipantsCombo'

// Aggregation Selectors — Page 4
import {
  getRescueVanMarchRow,
  getLatestRescueFY,
  getMSYBeneficiariesByFY,
  getMSYAvgSubsidyByFY,
  getMSYSubsidyByFY,
  getHostelsAllTime,
  getJagrutiSessionsByFY,
  getJagrutiParticipantsByFY
} from '../utils/aggregations'

/**
 * WCD Page 4 — Infra, Digital Platforms & Women Empowerment
 *
 * Sheets: NSWLD-05, NSWLD-08, NSWLD-17, NSWLD-17(2)
 *
 * Layout:
 * - Row 0: 3 KPI Cards
 * - Row 1-3 (left column): Charts A, B, C — Mahila Swavlamban Yojana
 * - Row 1-3 (right column): Charts D, E, F — Hostels + Jagruti Shibir
 */
export default function InfraWomenEmpowerment() {
  const store = useWcdStore()
  const {
    rawHostels,    // NSWLD-05.json
    rawRescue,     // NSWLD-08.json
    rawMSY,        // NSWLD-17.json
    rawJagruti,    // NSWLD-17_2.json
    selectedFY
  } = store

  // Guard: wait until all data is loaded
  if (!rawHostels || !rawRescue || !rawMSY || !rawJagruti) return null

  // ─── KPI 2 & 3: Resolve the effective FY for rescue/response-time KPIs ───
  // When no FY is explicitly selected, default to the latest FY with actual data.
  // These KPIs always resolve to a single FY's March row (point-in-time snapshot).
  const latestRescueFY = useMemo(() => getLatestRescueFY(rawRescue), [rawRescue])
  const effectiveRescueFY = selectedFY || latestRescueFY || '2025-26'
  const marchRow = useMemo(
    () => getRescueVanMarchRow(rawRescue, effectiveRescueFY),
    [rawRescue, effectiveRescueFY]
  )

  // ─── KPI Card Values ───

  // KPI 2: Total Available Rescue Vans (NSWLD-08)
  const rescueVans = marchRow?.actual_rescue_vans
  const hasRescueData = rescueVans != null

  // KPI 3: Response Time Under 181 Helpline (NSWLD-08)
  const actualResponseTime = marchRow?.actual_response_time
  const targetResponseTime = marchRow?.target_response_time
  const hasResponseData = actualResponseTime != null && targetResponseTime != null

  // ─── Chart Data ───

  // Charts A, B, C: Mahila Swavlamban Yojana (NSWLD-17) — respond to FY filter
  const msyBeneficiariesData = useMemo(
    () => getMSYBeneficiariesByFY(rawMSY, selectedFY),
    [rawMSY, selectedFY]
  )
  const msyAvgSubsidyData = useMemo(
    () => getMSYAvgSubsidyByFY(rawMSY, selectedFY),
    [rawMSY, selectedFY]
  )
  const msySubsidyData = useMemo(
    () => getMSYSubsidyByFY(rawMSY, selectedFY),
    [rawMSY, selectedFY]
  )

  // Chart D: Working Women Hostels (NSWLD-05)
  // ⚠️ FY-EXEMPT: Does NOT respect the page FY filter.
  // Same precedent as SAM section on Page 2.
  const hostelsData = useMemo(
    () => getHostelsAllTime(rawHostels),
    [rawHostels]
  )

  // Charts E, F: Jagruti Shibir (NSWLD-17(2)) — respond to FY filter
  const jagrutiSessionsData = useMemo(
    () => getJagrutiSessionsByFY(rawJagruti, selectedFY),
    [rawJagruti, selectedFY]
  )
  const jagrutiParticipantsData = useMemo(
    () => getJagrutiParticipantsByFY(rawJagruti, selectedFY),
    [rawJagruti, selectedFY]
  )

  return (
    <DashboardLayout pageSubtitle="Infra, Digital Platforms & Women Empowerment">
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        minHeight: 0,
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* ─── ROW 0: 3 KPI Cards ─── */}
        <div className="wcd-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>

          {/* KPI 1 — Tracking Mechanism of Gender Disaggregated Data */}
          {/* Hardcoded. Static text "2022-23". Not affected by FY filter. */}
          <div className="wcd-kpi-card wcd-kpi-card--blue">
            <div className="wcd-kpi-card__header">
              Tracking mechanism of Gender<br/>
              <strong>Disaggregated Data developed in</strong>
            </div>
            <div className="wcd-kpi-card__main-row">
              <div className="wcd-kpi-card__value wcd-kpi-card__value--blue">
                2022-23
              </div>
            </div>
            <div className="wcd-kpi-card__detail">Static — not filtered by FY</div>
          </div>

          {/* KPI 2 — Total Available Rescue Vans (NSWLD-08) */}
          <div className="wcd-kpi-card wcd-kpi-card--blue">
            <div className="wcd-kpi-card__header">
              Total Available<br/>
              <strong>Rescue Vans</strong>
            </div>
            <div className="wcd-kpi-card__main-row">
              {hasRescueData ? (
                <div className="wcd-kpi-card__value wcd-kpi-card__value--blue">
                  {rescueVans}
                </div>
              ) : (
                <div className="wcd-kpi-card__value" style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
                  No data yet
                </div>
              )}
            </div>
            <div className="wcd-kpi-card__detail">
              March, {effectiveRescueFY}
            </div>
          </div>

          {/* KPI 3 — Response Time Under 181 Helpline (NSWLD-08) */}
          <div className="wcd-kpi-card wcd-kpi-card--purple">
            <div className="wcd-kpi-card__header">
              Response Time Under 181 Helpline<br/>
              <strong>(March, {effectiveRescueFY})</strong>
            </div>
            <div className="wcd-kpi-card__main-row">
              {hasResponseData ? (
                <div className="wcd-kpi-card__value wcd-kpi-card__value--purple" style={{ fontSize: '1.1rem' }}>
                  {actualResponseTime} / {targetResponseTime}
                </div>
              ) : (
                <div className="wcd-kpi-card__value" style={{ fontSize: '0.95rem', color: '#94a3b8' }}>
                  No data yet
                </div>
              )}
            </div>
            <div className="wcd-kpi-card__detail">Actual / Target</div>
          </div>
        </div>

        {/* ─── CHART AREA: 2-column layout ─── */}
        {/* Left: Charts A, B, C (Mahila Swavlamban Yojana) */}
        {/* Right: Charts D, E, F (Hostels + Jagruti Shibir) */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: '8px',
          minHeight: 0,
        }}>
          {/* LEFT COLUMN: Charts A, B, C stacked */}
          <div style={{
            flex: '0 0 50%',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minHeight: 0,
          }}>
            {/* Chart A — Beneficiaries */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <MSYBeneficiariesBar data={msyBeneficiariesData} />
            </div>
            {/* Chart B — Avg Subsidy */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <MSYAvgSubsidyBar data={msyAvgSubsidyData} />
            </div>
            {/* Chart C — Subsidy Disbursed */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <MSYSubsidyCombo data={msySubsidyData} />
            </div>
          </div>

          {/* RIGHT COLUMN: Charts D, E, F stacked */}
          <div style={{
            flex: '0 0 calc(50% - 8px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minHeight: 0,
          }}>
            {/* Chart D — Working Women Hostels (FY-exempt) */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <HostelsDistrictBar data={hostelsData} />
            </div>
            {/* Chart E — Jagruti Sessions (Butterfly) */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <JagrutiSessionsButterfly data={jagrutiSessionsData} />
            </div>
            {/* Chart F — Jagruti Participants */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <JagrutiParticipantsCombo data={jagrutiParticipantsData} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
