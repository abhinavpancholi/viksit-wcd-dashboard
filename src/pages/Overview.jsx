import React from 'react'
import useWcdStore from '../context/WcdStore'
import DashboardLayout from '../components/layout/DashboardLayout'
import BbbpMonthlyBar from '../components/charts/BbbpMonthlyBar'
import GirlsTrainedCombo from '../components/charts/GirlsTrainedCombo'
import AyushDistrictBar from '../components/charts/AyushDistrictBar'
import VahaliDikariMap from '../components/charts/VahaliDikariMap'
import { toLakh, formatIndian, formatPct } from '../utils/formatters'

/**
 * WCD Overview Page — Asymmetric 2x2 Grid Layout
 * Arranges charts so GirlsTrainedCombo gets 60% width for optimal breathing room!
 */
export default function Overview() {
  const agg = useWcdStore((s) => s.overviewAggregates)
  const topo = useWcdStore((s) => s.gujaratTopo)

  if (!agg) return null

  return (
    <DashboardLayout pageSubtitle="Overview" sidebarTopSlot="stat-cards">
      {/* Mission Statement Banner */}
      <div className="wcd-banner">
        <div className="wcd-banner__text">
          The department ensures children's nutrition and empowers women to live with dignity,
          promoting their nutrition, development, and well-being in an environment free from
          violence and discrimination
        </div>
      </div>

      {/* 5 KPI Cards (Single Row Grid) */}
      <div className="wcd-kpi-grid">
        {/* 1. Avg Girls Trained / Month */}
        <div className="wcd-kpi-card wcd-kpi-card--teal">
          <div className="wcd-kpi-card__header">
            Average adolescent girls trained <strong>per Month</strong>
          </div>
          <div className="wcd-kpi-card__main-row">
            <div className="wcd-kpi-card__value wcd-kpi-card__value--teal">
              {toLakh(agg.avg_girls_trained_per_month_current_fy)}
              <span className="wcd-kpi-card__unit">Lakh</span>
            </div>
          </div>
          <div className="wcd-kpi-card__badge wcd-kpi-card__badge--teal">
            (2025-26)
          </div>
        </div>

        {/* 2. Active Anganwadis */}
        <div className="wcd-kpi-card wcd-kpi-card--blue">
          <div className="wcd-kpi-card__header">Active Anganwadis</div>
          <div className="wcd-kpi-card__main-row">
            <div className="wcd-kpi-card__value wcd-kpi-card__value--blue">
              {formatIndian(agg.active_anganwadis.total)}
            </div>
          </div>
          <div className="wcd-kpi-card__sub-values">
            <span>Rural <strong>{formatIndian(agg.active_anganwadis.rural)}</strong></span>
            <span>|</span>
            <span>Urban <strong>{formatIndian(agg.active_anganwadis.urban)}</strong></span>
          </div>
        </div>

        {/* 3. Total BBBP Programs */}
        <div className="wcd-kpi-card wcd-kpi-card--purple">
          <div className="wcd-kpi-card__header">
            Awareness programs under <strong>Beti Bachao Beti Padhao</strong>
          </div>
          <div className="wcd-kpi-card__main-row">
            <div className="wcd-kpi-card__value wcd-kpi-card__value--purple">
              {formatIndian(agg.total_bbbp_programs_all_time)}
            </div>
          </div>
          <div className="wcd-kpi-card__detail">(From 2020-21 to 2025-26)</div>
        </div>

        {/* 4. Vahali Dikari Beneficiaries */}
        <div className="wcd-kpi-card wcd-kpi-card--orange">
          <div className="wcd-kpi-card__header">
            Beneficiaries of <strong>Vahali Dikari Yojana</strong>
          </div>
          <div className="wcd-kpi-card__main-row">
            <div className="wcd-kpi-card__value wcd-kpi-card__value--orange">
              {toLakh(agg.total_vahali_dikari_beneficiaries_all_time)}
              <span className="wcd-kpi-card__unit">Lakh</span>
            </div>
          </div>
          <div className="wcd-kpi-card__detail">(From 2020-21 to 2025-26)</div>
        </div>

        {/* 5. AYUSH THR Achievement */}
        <div className="wcd-kpi-card wcd-kpi-card--green">
          <div className="wcd-kpi-card__header">
            Mothers receiving ration through <strong>AYUSH THR</strong>
          </div>
          <div className="wcd-kpi-card__main-row">
            <div className="wcd-kpi-card__value wcd-kpi-card__value--green">
              {formatPct(agg.ayush_thr_pct_all_time)}
            </div>
          </div>
          <div className="wcd-kpi-card__detail">(Pilot in 6 Districts)</div>
        </div>
      </div>

      {/* 2x2 Asymmetric Chart Container */}
      <div className="wcd-grid-2x2">
        {/* Row 1: Girls Trained Combo (60%) + AYUSH THR District Bar (40%) */}
        <div className="wcd-grid-row">
          <div className="wcd-grid-col-60">
            <GirlsTrainedCombo data={agg.girls_registered_vs_trained_by_fy} />
          </div>
          <div className="wcd-grid-col-40">
            <AyushDistrictBar data={agg.ayush_thr_pct_by_district} />
          </div>
        </div>

        {/* Row 2: BBBP Monthly Spread (60%) + Vahali Dikari Gujarat Map (40%) */}
        <div className="wcd-grid-row">
          <div className="wcd-grid-col-60">
            <BbbpMonthlyBar data={agg.monthly_bbbp_spread} />
          </div>
          <div className="wcd-grid-col-40">
            <VahaliDikariMap
              topoData={topo}
              districtData={agg.vahali_dikari_by_district}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
