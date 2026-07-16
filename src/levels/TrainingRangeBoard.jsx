import InfoBanner from '../components/InfoBanner.jsx'

// Shared render path for the level 2-4 training range board. CMT/CTT/SWT
// currently look identical (same layout system, same data) — each of
// CmtBoard/CttBoard/SwtBoard wraps this so their own rules can diverge
// here later without touching each other.
export default function TrainingRangeBoard({
  ActiveLayout,
  tableModel,
  leaderboardModel,
  activeStation,
  panelRatio,
  detailCount,
  rightPanelComponents,
  showInfoBanner,
  level,
  hideNoColumn,
  dataCount,
}) {
  return (
    <>
      {showInfoBanner && <InfoBanner />}
      <ActiveLayout
        tableModel={tableModel}
        leaderboardModel={leaderboardModel}
        activeStation={activeStation}
        panelRatio={panelRatio}
        detailCount={detailCount}
        rightPanelComponents={rightPanelComponents}
        level={level}
        hideNoColumn={hideNoColumn}
        dataCount={dataCount}
      />
    </>
  )
}
