import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

/**
 * WCD Dashboard Layout
 * Wraps Sidebar (fixed left) + Header (sticky top) + page content.
 */
export default function DashboardLayout({ children, pageSubtitle, sidebarTopSlot = 'stat-cards' }) {
  return (
    <div className="wcd-layout">
      <Sidebar topSlot={sidebarTopSlot} />
      <div className="wcd-main">
        <Header pageSubtitle={pageSubtitle} />
        <div className="wcd-content">
          {children}
        </div>
      </div>
    </div>
  )
}
