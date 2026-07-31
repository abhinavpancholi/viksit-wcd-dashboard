import React from 'react'
import useWcdStore from '../context/WcdStore'
import DashboardLayout from '../components/layout/DashboardLayout'

// Chart Components
import BbbpAvgParticipationLine from '../components/charts/BbbpAvgParticipationLine'
import BbbpDistrictParticipationBar from '../components/charts/BbbpDistrictParticipationBar'
import VahaliMonthlyLine from '../components/charts/VahaliMonthlyLine'
import StateSensitizationProgramsBar from '../components/charts/StateSensitizationProgramsBar'
import StateSensitizationParticipantsBar from '../components/charts/StateSensitizationParticipantsBar'
import SetuSensitizationBar from '../components/charts/SetuSensitizationBar'
import SexualHarassmentLine from '../components/charts/SexualHarassmentLine'

// Aggregation Selectors
import {
  getBbbpAvgParticipationPerSession,
  getBbbpDistrictParticipation,
  getVahaliMonthlyBeneficiaries,
  getSensitizationProgramsStateLevel,
  getSensitizationParticipantsStateLevel,
  getSetuSensitizationQuarterly,
  getSexualHarassmentSensitizationQuarterly
} from '../utils/aggregations'

/**
 * WCD Page 3 — Awareness & Behaviour Change
 * Fits 100vh dynamically without page scrolling.
 */
export default function AwarenessBehaviour() {
  const store = useWcdStore()
  const {
    districts, rawBbbp, rawVahali,
    rawSensitizationState, rawSetu, rawSexualHarassment,
    selectedFY, selectedRegion, selectedDistrict,
    setDistrict
  } = store

  if (!districts || !rawBbbp || !rawVahali) return null

  const filters = { selectedFY, selectedRegion, selectedDistrict }

  // Chart 1: BBBP Avg Participation Per Session (Line)
  const { data: bbbpAvgData, resolvedFY: fy1 } = getBbbpAvgParticipationPerSession(rawBbbp, filters, districts)

  // Chart 2: BBBP Participation by District (Bar + Target Line)
  const { data: bbbpDistrictData, resolvedFY: fy2 } = getBbbpDistrictParticipation(rawBbbp, filters, districts)

  // Chart 3: Vahali Dikari Monthly Beneficiaries (Line/Area)
  const vahaliMonthlyData = getVahaliMonthlyBeneficiaries(rawVahali, filters, districts)

  // Chart 4: State Level Sensitization Programs (Bar)
  const stateProgramsData = getSensitizationProgramsStateLevel(rawSensitizationState, filters)

  // Chart 5: State Level Sensitization Participants (Horizontal Bar)
  const stateParticipantsData = getSensitizationParticipantsStateLevel(rawSensitizationState, filters)

  // Chart 6: SETU Gender Sensitization (Grouped Bar / Line)
  const setuData = getSetuSensitizationQuarterly(rawSetu, filters)

  // Chart 7: Sexual Harassment Act Sensitization (Dual Line)
  const sexualHarassmentData = getSexualHarassmentSensitizationQuarterly(rawSexualHarassment, filters)

  return (
    <DashboardLayout pageSubtitle="Awareness & Behaviour Change">
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minHeight: 0,
        height: '100%',
        overflow: 'hidden'
      }}>
        
        {/* ROW 1: Chart 1 (BBBP Avg Line) + Chart 2 (BBBP District Bar) */}
        <div style={{ flex: 1, display: 'flex', gap: '10px', minHeight: 0 }}>
          <div style={{ flex: '0 0 42%', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <BbbpAvgParticipationLine data={bbbpAvgData} resolvedFY={fy1} />
          </div>
          <div style={{ flex: '0 0 calc(58% - 10px)', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <BbbpDistrictParticipationBar
              data={bbbpDistrictData}
              resolvedFY={fy2}
              onDistrictClick={setDistrict}
            />
          </div>
        </div>

        {/* ROW 2: Chart 3 (Vahali Line) + Chart 4 (State Programs) + Chart 5 (State Participants) */}
        <div style={{ flex: 1, display: 'flex', gap: '10px', minHeight: 0 }}>
          <div style={{ flex: '1 1 33.33%', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <VahaliMonthlyLine data={vahaliMonthlyData} />
          </div>
          <div style={{ flex: '1 1 33.33%', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <StateSensitizationProgramsBar data={stateProgramsData} />
          </div>
          <div style={{ flex: '1 1 33.33%', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <StateSensitizationParticipantsBar data={stateParticipantsData} />
          </div>
        </div>

        {/* ROW 3: Chart 6 (SETU Bar/Line) + Chart 7 (Sexual Harassment Dual Line) */}
        <div style={{ flex: 1, display: 'flex', gap: '10px', minHeight: 0 }}>
          <div style={{ flex: '0 0 45%', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <SetuSensitizationBar data={setuData} />
          </div>
          <div style={{ flex: '0 0 calc(55% - 10px)', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <SexualHarassmentLine data={sexualHarassmentData} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
