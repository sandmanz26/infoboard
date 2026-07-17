import { useEffect, useMemo, useState } from 'react'
import { detailList, podium, leaderboard, stations, swtStations } from './data.js'
import Header from './components/Header.jsx'
import InfoBanner from './components/InfoBanner.jsx'
import DetailList from './components/DetailList.jsx'
import DetailListTable2 from './components/DetailListTable2.jsx'
import DetailListCards from './components/DetailListCards.jsx'
import DetailListCompact from './components/DetailListCompact.jsx'
import TopThree from './components/TopThree.jsx'
import Directory from './components/Directory.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import LeaderboardCompact from './components/LeaderboardCompact.jsx'
import LeaderboardCards from './components/LeaderboardCards.jsx'
import LeaderboardTicker from './components/LeaderboardTicker.jsx'
import CombinedDetailList from './components/CombinedDetailList.jsx'
import StationsOverview from './components/StationsOverview.jsx'
import LobbyBoard from './components/LobbyBoard.jsx'
import LayoutSwitcher from './components/LayoutSwitcher.jsx'
import PageDots from './components/PageDots.jsx'
import usePagedRows from './hooks/usePagedRows.js'
import { LEVELS } from './levels/levelConfig.js'
import CmtBoard from './levels/CmtBoard.jsx'
import CttBoard from './levels/CttBoard.jsx'
import SwtBoard from './levels/SwtBoard.jsx'

const LEADERBOARD_PAGE_SIZE = 5
const LEADERBOARD_PAGE_INTERVAL_MS = 6000
const DETAIL_GROUPS_PER_PAGE = 3
const DETAIL_GROUP_PAGE_INTERVAL_MS = 6000
const DETAIL_ROWS_PER_PAGE = 10
const DETAIL_ROWS_PAGE_INTERVAL_MS = 5000

// Levels 2-4 (CMT/CTT/SWT) all render the same board today but live in
// separate files under src/levels/ so each can grow its own rules.
const TRAINING_BOARD_COMPONENTS = {
  'level-2': CmtBoard,
  'level-3': CttBoard,
  'level-4': SwtBoard,
}

// Each level is a separate physical LCD (one per floor). This app renders
// whichever one is selected — Level 1 is the lobby, Levels 2-4 (CMT/CTT/SWT)
// all show the same training range board. Nothing here auto-advances; the
// Level switcher is how a demo viewer picks which floor's screen to look at.

const LAYOUTS = [
  { id: 'layout-1', label: 'Layout 1', description: 'Default — single detail list' },
  { id: 'layout-2', label: 'Layout 2', description: '3 detail lists + podium + directory' },
  { id: 'layout-3', label: 'Layout 3', description: 'Combined detail list + directory + leaderboard' },
  { id: 'layout-4', label: 'Layout 4', description: 'Overview of all 4 base stations at once' },
  { id: 'layout-5', label: 'Layout 5', description: '5 base station columns, no directory/leaderboard sidebar' },
]

// Layout 5: one column per base station (no Directory/Leaderboard sidebar
// here — each station is its own self-contained detail board).
// Level 2/3 still use a shared placeholder roster that flips
// Detail 1 (10 rows) -> Detail 1 (5 rows) -> Detail 2 (10) -> Detail 2 (5).
// Level 4 uses swtStations' real per-station data instead — see
// LayoutFive below.
// Unit + courseware are shown under each column's base station name so
// the booking that station is currently running is clear at a glance.
const LAYOUT_FIVE_STATIONS = [
  { name: 'Base Station 1', unit: '2 SIR', courseware: 'ATP (SAR21)' },
  { name: 'Base Station 2', unit: '2 SIR', courseware: 'CSM (SAR21)' },
  { name: 'Base Station 3', unit: '3 SIR', courseware: 'APS (SAR21)' },
  { name: 'Base Station 4', unit: '4 SIR', courseware: 'BTP (SAR21)' },
  { name: 'Base Station 5', unit: '4 SIR', courseware: 'ATP (SAR21)' },
]
const LAYOUT_FIVE_DETAILS = [
  { title: 'Detail 1', status: 'Ready' },
  { title: 'Detail 2', status: 'Queue' },
]
const LAYOUT_FIVE_STEP_INTERVAL_MS = 5000

function layoutFiveSteps(rows) {
  return LAYOUT_FIVE_DETAILS.flatMap((detail) => [
    { detail, rows: rows.slice(0, DETAIL_ROWS_PER_PAGE), paginated: true },
    { detail, rows: rows.slice(DETAIL_ROWS_PER_PAGE), paginated: true },
  ])
}

const TABLE_MODELS = [
  { id: 'default', label: 'Default Table', description: 'Original detail list table' },
  { id: 'card', label: 'Card Model', description: 'Compact card grid per trainee' },
  { id: 'table2', label: 'Table 2.0', description: 'Merged rank + name, no status column' },
  { id: 'compact', label: 'Compact (No Scroll)', description: 'All 15 rows in one dense table, no rotation or scrolling' },
]

const LEADERBOARD_MODELS = [
  { id: 'table', label: 'Table', description: 'Full ranking table with columns' },
  { id: 'compact', label: 'Compact List', description: 'Dense single-line ranked list' },
  { id: 'cards', label: 'Stat Cards', description: 'One card per trainee with score + MPI' },
  { id: 'ticker', label: 'Ticker', description: 'Dark departures-board style strip' },
]

const SLIDESHOW_INTERVALS = [
  { id: '0', label: 'Off', description: 'Stay on the current base station' },
  { id: '5', label: '5s', description: 'Advance to the next station every 5 seconds' },
  { id: '10', label: '10s', description: 'Advance to the next station every 10 seconds' },
  { id: '15', label: '15s', description: 'Advance to the next station every 15 seconds' },
  { id: '30', label: '30s', description: 'Advance to the next station every 30 seconds' },
]

// The blue info strip under the header (Levels 2-4 only).
const INFO_BANNER_OPTIONS = [
  { id: 'visible', label: 'Visible', description: 'Show the info banner below the header' },
  { id: 'hidden', label: 'Hidden', description: 'Hide the info banner below the header' },
]

// Level 4 + Layout 5 only — hide the row-number column in each station's
// detail table.
const NO_COLUMN_OPTIONS = [
  { id: 'visible', label: 'Visible', description: 'Show the No. column' },
  { id: 'hidden', label: 'Hidden', description: 'Hide the No. column' },
]

// Level 4 + Layout 5 only — SWT-03 doubles as a Global Leaderboard once
// its session ends; while a session is still running it looks like any
// other station.
const SWT03_SESSION_OPTIONS = [
  { id: 'ongoing', label: 'Ongoing', description: 'SWT-03 shows its trainee roster like every other station' },
  { id: 'ended', label: 'Ended', description: 'SWT-03 shows the Global Leaderboard instead' },
]

// Layout 5 only — independent font-size controls for the 3 text sizes
// on screen: the trainee table, the "Detail N" title, and the base
// station name at the top of each column.
const TABLE_FONT_SIZE_OPTIONS = [
  { id: 'small', label: 'Small', value: '10px' },
  { id: 'medium', label: 'Medium', value: '12px' },
  { id: 'large', label: 'Large', value: '15px' },
]
const DETAIL_FONT_SIZE_OPTIONS = [
  { id: 'small', label: 'Small', value: '13px' },
  { id: 'medium', label: 'Medium', value: '15px' },
  { id: 'large', label: 'Large', value: '19px' },
]
const STATION_FONT_SIZE_OPTIONS = [
  { id: 'small', label: 'Small', value: '12px' },
  { id: 'medium', label: 'Medium', value: '14px' },
  { id: 'large', label: 'Large', value: '18px' },
]

// Left container (combined detail list) vs. right container (directory
// map + leaderboard) width split — only Layout 3 pairs those two panels.
const PANEL_RATIOS = [
  { id: '55-45', label: '55 : 45', description: 'Detail list 55% / Directory + Leaderboard 45%', left: 55, right: 45 },
  { id: '60-40', label: '60 : 40', description: 'Detail list 60% / Directory + Leaderboard 40%', left: 60, right: 40 },
  { id: '65-35', label: '65 : 35', description: 'Detail list 65% / Directory + Leaderboard 35%', left: 65, right: 35 },
  { id: '70-30', label: '70 : 30', description: 'Detail list 70% / Directory + Leaderboard 30%', left: 70, right: 30 },
]

// How many "Detail N" columns the Layout 3 combined table carries.
// 1-3 all fit side by side; 4-6 page 3-at-a-time on the same rotating
// pattern as the Leaderboard, instead of squeezing extra columns in.
const DETAIL_COUNTS = [
  { id: '1', label: '1', description: 'Single detail column' },
  { id: '2', label: '2', description: 'Two detail columns side by side' },
  { id: '3', label: '3', description: 'Three detail columns side by side' },
  { id: '4', label: '4', description: 'Pages 3 at a time, like the leaderboard' },
  { id: '5', label: '5', description: 'Pages 3 at a time, like the leaderboard' },
  { id: '6', label: '6', description: 'Pages 3 at a time, like the leaderboard' },
]

// Which panels show in the right-hand column — Layouts 1-3 all share the
// same sidebar, just with different components hardcoded on previously.
// Now it's one shared choice instead of baked into each layout.
const RIGHT_PANEL_COMPONENTS = [
  { id: 'top3', label: 'Top 3 Leaderboard', description: 'Podium-style top 3 finishers' },
  { id: 'leaderboard', label: 'Table Leaderboard', description: 'Full ranked leaderboard (Table/Compact/Cards/Ticker)' },
  { id: 'directory', label: 'Directory', description: 'Base station map' },
]

const SYSTEM_STACK = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

// All three are self-hosted (bundled with the build, no font CDN) and
// picked specifically for on-screen reading at a distance rather than
// for decoration — this board is read, not admired.
const FONTS = [
  {
    id: 'system',
    label: 'System Default',
    description: "Uses the display device's own UI font",
    stack: SYSTEM_STACK,
  },
  {
    id: 'inter',
    label: 'Inter',
    description: 'Tall x-height, open counters — built for dense on-screen data',
    stack: `"Inter", ${SYSTEM_STACK}`,
  },
  {
    id: 'atkinson',
    label: 'Atkinson Hyperlegible',
    description: 'Designed by the Braille Institute to maximize character clarity at a distance',
    stack: `"Atkinson Hyperlegible", ${SYSTEM_STACK}`,
  },
  {
    id: 'public-sans',
    label: 'Public Sans',
    description: 'US federal design-system typeface, tuned for civic signage',
    stack: `"Public Sans", ${SYSTEM_STACK}`,
  },
]

const LAYOUT_STORAGE_KEY = 'infoboard-layout'
const TABLE_MODEL_STORAGE_KEY = 'infoboard-table-model'
const LEADERBOARD_MODEL_STORAGE_KEY = 'infoboard-leaderboard-model'
const SLIDESHOW_STORAGE_KEY = 'infoboard-slideshow-interval'
const PANEL_RATIO_STORAGE_KEY = 'infoboard-panel-ratio'
const FONT_STORAGE_KEY = 'infoboard-font'
const DETAIL_COUNT_STORAGE_KEY = 'infoboard-detail-count'
const LEVEL_STORAGE_KEY = 'infoboard-level'
const RIGHT_PANEL_STORAGE_KEY = 'infoboard-right-panel'
const INFO_BANNER_STORAGE_KEY = 'infoboard-info-banner'
const NO_COLUMN_STORAGE_KEY = 'infoboard-no-column'
const SWT03_SESSION_STORAGE_KEY = 'infoboard-swt03-session'
const TABLE_FONT_SIZE_STORAGE_KEY = 'infoboard-layout5-table-font-size'
const DETAIL_FONT_SIZE_STORAGE_KEY = 'infoboard-layout5-detail-font-size'
const STATION_FONT_SIZE_STORAGE_KEY = 'infoboard-layout5-station-font-size'

function LayoutIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="currentColor">
      <rect x="2" y="2" width="7" height="16" rx="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function TableModelIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="2" y="3" width="16" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 8h16M8 8v9" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function LeaderboardIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <path
        d="M4 17V9M10 17V3M16 17v-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SlideshowIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 5.5V10l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InfoBannerIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 9v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="10" cy="6.4" r="1.05" fill="currentColor" />
    </svg>
  )
}

function NoColumnIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="2" y="3" width="16" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 8h5M2 13h5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 4.5 5.5 15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function FontSizeIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <path
        d="M2.5 14.5 6 5.5h1L10.5 14.5M3.6 11.5h5.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 14.5V9.2h2a1.65 1.65 0 0 1 0 3.3h-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RatioIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="2" y="4" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="4" width="4" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function DetailCountIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="2" y="4" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="8" y="4" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="4" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function LevelIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="3" y="2" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="8" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="14" width="14" height="4" rx="1" fill="currentColor" />
    </svg>
  )
}

function RightPanelIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="2" y="3" width="9" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="3" width="5" height="6" rx="1" fill="currentColor" />
      <rect x="13" y="11" width="5" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function TypographyIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <path
        d="M4 16 8.2 5h1.1L13.5 16M5.4 12.3h6.5M14 8h3M14 11h3M14 14h2.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// A single detail table only ever shows 10 rows at once — with 15
// trainees in the roster, the last 5 page in on their own rotating page
// a couple seconds later rather than being squeezed into the same table.
// "Compact" is the exception: all 15 rows at once, dense enough to need
// neither rotation nor scrolling — built for TV displays. `fullRows`
// forces that same all-15-at-once behavior for any table model (used by
// Layout 5 / Level 4, where the only flip should be Detail 1 -> Detail 2,
// not a second row-level rotation nested inside it).
function DetailPanel({ tableModel, rows, title, status, hideNo, fullRows }) {
  const { page, pageIndex, pageCount } = usePagedRows(rows, DETAIL_ROWS_PER_PAGE, DETAIL_ROWS_PAGE_INTERVAL_MS)
  const displayRows = fullRows ? rows : page
  const displayPageIndex = fullRows ? undefined : pageIndex
  const displayPageCount = fullRows ? undefined : pageCount
  if (tableModel === 'card') {
    return (
      <DetailListCards
        rows={displayRows}
        title={title}
        status={status}
        pageIndex={displayPageIndex}
        pageCount={displayPageCount}
        hideNo={hideNo}
      />
    )
  }
  if (tableModel === 'table2') {
    return (
      <DetailListTable2
        rows={displayRows}
        title={title}
        status={status}
        pageIndex={displayPageIndex}
        pageCount={displayPageCount}
        hideNo={hideNo}
      />
    )
  }
  if (tableModel === 'compact') {
    return <DetailListCompact rows={rows} title={title} status={status} hideNo={hideNo} />
  }
  return (
    <DetailList
      rows={displayRows}
      title={title}
      status={status}
      pageIndex={displayPageIndex}
      pageCount={displayPageCount}
      hideNo={hideNo}
    />
  )
}

function LeaderboardPanel({ leaderboardModel, rows }) {
  const { page, pageIndex, pageCount } = usePagedRows(
    rows,
    LEADERBOARD_PAGE_SIZE,
    LEADERBOARD_PAGE_INTERVAL_MS
  )
  if (leaderboardModel === 'compact') {
    return <LeaderboardCompact rows={page} pageIndex={pageIndex} pageCount={pageCount} />
  }
  if (leaderboardModel === 'cards') {
    return <LeaderboardCards rows={page} pageIndex={pageIndex} pageCount={pageCount} />
  }
  if (leaderboardModel === 'ticker') {
    return <LeaderboardTicker rows={page} pageIndex={pageIndex} pageCount={pageCount} />
  }
  return <Leaderboard rows={page} pageIndex={pageIndex} pageCount={pageCount} />
}

// Shared right-hand sidebar for Layouts 1-3 — which of the 3 panels show
// (and in this fixed order) is controlled by the Right Panel switcher
// instead of being hardcoded differently per layout. Renders nothing at
// all once every panel is hidden, so the caller can give the table the
// full row width instead of leaving an empty column.
function RightColumn({ components, leaderboardModel, activeStation }) {
  if (components.length === 0) return null
  return (
    <div className="right-col">
      {components.includes('top3') && (
        <section className="panel podium-panel">
          <TopThree data={podium} />
        </section>
      )}
      {components.includes('leaderboard') && (
        <section className="panel leaderboard-panel">
          <LeaderboardPanel leaderboardModel={leaderboardModel} rows={leaderboard} />
        </section>
      )}
      {components.includes('directory') && (
        <section className="panel directory-panel">
          <Directory activeStation={activeStation} />
        </section>
      )}
    </div>
  )
}

function TripleDetailPanels({ tableModel, groups }) {
  return (
    <>
      {groups.map((group) => (
        <section key={group.title} className="panel detail-panel detail-panel-compact">
          <DetailPanel tableModel={tableModel} rows={group.rows} title={group.title} status={group.status} />
        </section>
      ))}
    </>
  )
}

// With no right-panel components enabled, the table takes the full row
// width instead of leaving the ratio's sidebar share empty.
function mainGridStyle(ratio, hasSidebar) {
  return hasSidebar
    ? { '--detail-fr': `${ratio.left}fr`, '--sidebar-fr': `${ratio.right}fr` }
    : { gridTemplateColumns: '1fr' }
}

function LayoutOne({ tableModel, leaderboardModel, panelRatio, rightPanelComponents, activeStation }) {
  const ratio = PANEL_RATIOS.find((r) => r.id === panelRatio) ?? PANEL_RATIOS[1]
  const hasSidebar = rightPanelComponents.length > 0
  return (
    <main className="layout" style={mainGridStyle(ratio, hasSidebar)}>
      <section className="panel detail-panel">
        <DetailPanel tableModel={tableModel} rows={detailList} title="Detail List" status="Ready" />
      </section>
      <RightColumn components={rightPanelComponents} leaderboardModel={leaderboardModel} activeStation={activeStation} />
    </main>
  )
}

function LayoutTwo({ tableModel, activeStation, panelRatio, detailCount, rightPanelComponents, leaderboardModel }) {
  const ratio = PANEL_RATIOS.find((r) => r.id === panelRatio) ?? PANEL_RATIOS[1]
  const count = Number(detailCount) || 3
  // Only the first detail is actively running (Ready); the rest are
  // queued up behind it. Memoized so usePagedRows (which resets to page 0
  // whenever its `rows` reference changes) doesn't see a "new" array —
  // and reset itself — on every tick of its own rotation timer.
  const allGroups = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        title: `Detail ${i + 1}`,
        status: i === 0 ? 'Ready' : 'Queue',
        rows: detailList,
      })),
    [count]
  )
  const { page: groups, pageIndex, pageCount } = usePagedRows(
    allGroups,
    DETAIL_GROUPS_PER_PAGE,
    DETAIL_GROUP_PAGE_INTERVAL_MS
  )
  const hasSidebar = rightPanelComponents.length > 0

  return (
    <main className="layout layout-triple" style={mainGridStyle(ratio, hasSidebar)}>
      <div className="triple-detail-group">
        {pageCount > 1 && (
          <div className="triple-detail-head">
            <PageDots pageIndex={pageIndex} pageCount={pageCount} />
          </div>
        )}
        <div className="triple-detail-columns" style={{ '--triple-detail-count': groups.length }}>
          <TripleDetailPanels tableModel={tableModel} groups={groups} />
        </div>
      </div>
      <RightColumn components={rightPanelComponents} leaderboardModel={leaderboardModel} activeStation={activeStation} />
    </main>
  )
}

function LayoutThree({ tableModel, leaderboardModel, activeStation, panelRatio, detailCount, rightPanelComponents }) {
  const ratio = PANEL_RATIOS.find((r) => r.id === panelRatio) ?? PANEL_RATIOS[1]
  const count = Number(detailCount) || 3
  const groups = Array.from({ length: count }, (_, i) => ({
    title: `Detail ${i + 1}`,
    status: i === 0 ? 'Ready' : 'Queue',
    rows: detailList,
  }))
  const hasSidebar = rightPanelComponents.length > 0
  return (
    <main className="layout layout-combined" style={mainGridStyle(ratio, hasSidebar)}>
      <CombinedDetailList groups={groups} tableModel={tableModel} />
      <RightColumn components={rightPanelComponents} leaderboardModel={leaderboardModel} activeStation={activeStation} />
    </main>
  )
}

// SWT-03's "session ended" variant — a ranked scoreboard instead of a
// trainee detail table. Mirrors DetailListTable2's markup/classes so it
// picks up the same font-size overrides and column styling for free.
function StationGlobalLeaderboard({ rows, courseware, timeRange, hideNo }) {
  return (
    <>
      <div className="detail-panel-head">
        <h2 className="panel-title">Global Leaderboard</h2>
      </div>
      <p className="station-column-info">
        <span>
          Courseware: <strong>{courseware}</strong>
        </span>
        <span>{timeRange}</span>
      </p>
      <table className="table table-two">
        <thead>
          <tr>
            {!hideNo && <th>No</th>}
            <th>Trainee</th>
            <th>Weapon</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.no}>
              {!hideNo && <td>{row.no}</td>}
              <td>
                <span className="trainee-cell">
                  <span className="trainee-rank">{row.rank}</span>
                  <span className="trainee-name" title={row.name}>
                    {row.name}
                  </span>
                </span>
              </td>
              <td className="weapon-cell" title={row.weapon}>
                {row.weapon}
              </td>
              <td>{row.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

// A station's booking info — Booking ID, Mode + Courseware, time range,
// Unit — as one wrapped line with " · " separators instead of a stack of
// full-width rows, so a station missing a field (SWT-03 has no real
// booking, only a courseware + time slot) just reads shorter rather than
// leaving the header block a different height from its neighbors.
function SwtStationInfo({ station }) {
  const sessionLabel = [station.mode, station.courseware].filter(Boolean).join(', ')
  return (
    <p className="station-column-info">
      {station.bookingCode && (
        <span>
          Booking: <strong>{station.bookingCode}</strong>
        </span>
      )}
      {sessionLabel && <span>{sessionLabel}</span>}
      <span>
        {station.startTime} - {station.endTime}
      </span>
      {station.unit && (
        <span>
          Unit: <strong>{station.unit}</strong>
        </span>
      )}
    </p>
  )
}

function LayoutFive({
  tableModel,
  activeStation,
  level,
  hideNoColumn,
  tableFontSize,
  detailFontSize,
  stationFontSize,
  swt03Session,
}) {
  const isLevelFour = level === 'level-4'
  // Level 2/3 only: shared placeholder roster that flips Detail 1 (10
  // rows) -> Detail 1 (5) -> Detail 2 (10) -> Detail 2 (5) across every
  // station in lockstep — an airport board doesn't flip one panel at a
  // time. Level 4 ignores this entirely in favor of real per-station data.
  const steps = useMemo(() => layoutFiveSteps(detailList), [])
  const { pageIndex } = usePagedRows(steps, 1, LAYOUT_FIVE_STEP_INTERVAL_MS)
  const activeStep = steps[pageIndex]
  const fontSizeVars = {
    '--l5-table-font-size': TABLE_FONT_SIZE_OPTIONS.find((o) => o.id === tableFontSize)?.value,
    '--l5-detail-font-size': DETAIL_FONT_SIZE_OPTIONS.find((o) => o.id === detailFontSize)?.value,
    '--l5-station-font-size': STATION_FONT_SIZE_OPTIONS.find((o) => o.id === stationFontSize)?.value,
  }
  return (
    <main className="layout layout-five" style={fontSizeVars}>
      {isLevelFour
        ? swtStations.map((station) => {
            const showLeaderboard = station.isLeaderboardCapable && swt03Session === 'ended'
            return (
              <section key={station.code} className="panel detail-panel-compact station-column">
                <div className="station-column-head">{station.code}</div>
                {showLeaderboard ? (
                  <StationGlobalLeaderboard
                    rows={station.leaderboardRows}
                    courseware={station.courseware}
                    timeRange={`${station.startTime} - ${station.endTime}`}
                    hideNo={hideNoColumn}
                  />
                ) : (
                  <>
                    <SwtStationInfo station={station} />
                    <DetailPanel
                      tableModel={tableModel}
                      rows={station.rows}
                      title="Detail 1"
                      status="Ready"
                      fullRows
                      hideNo={hideNoColumn}
                    />
                  </>
                )}
              </section>
            )
          })
        : LAYOUT_FIVE_STATIONS.map((station) => (
            <section
              key={station.name}
              className={`panel detail-panel-compact station-column${activeStep.paginated ? ' station-column-paginated' : ''}`}
            >
              <div className="station-column-head">{station.name}</div>
              <div className="station-column-info">
                <span>
                  Unit: <strong>{station.unit}</strong>
                </span>
                <span>
                  Courseware: <strong>{station.courseware}</strong>
                </span>
              </div>
              <DetailPanel
                tableModel={tableModel}
                rows={activeStep.rows}
                title={activeStep.detail.title}
                status={activeStep.detail.status}
                fullRows
              />
            </section>
          ))}
      <section className="panel directory-panel layout-five-directory">
        <Directory activeStation={activeStation} />
      </section>
    </main>
  )
}

const LAYOUT_COMPONENTS = {
  'layout-1': LayoutOne,
  'layout-2': LayoutTwo,
  'layout-3': LayoutThree,
  'layout-4': StationsOverview,
  'layout-5': LayoutFive,
}

export default function App() {
  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY)
    return LAYOUTS.some((l) => l.id === saved) ? saved : 'layout-1'
  })
  const [tableModel, setTableModel] = useState(() => {
    const saved = localStorage.getItem(TABLE_MODEL_STORAGE_KEY)
    return TABLE_MODELS.some((t) => t.id === saved) ? saved : 'default'
  })
  const [leaderboardModel, setLeaderboardModel] = useState(() => {
    const saved = localStorage.getItem(LEADERBOARD_MODEL_STORAGE_KEY)
    return LEADERBOARD_MODELS.some((l) => l.id === saved) ? saved : 'table'
  })
  const [slideInterval, setSlideInterval] = useState(() => {
    const saved = localStorage.getItem(SLIDESHOW_STORAGE_KEY)
    return SLIDESHOW_INTERVALS.some((s) => s.id === saved) ? saved : '0'
  })
  const [panelRatio, setPanelRatio] = useState(() => {
    const saved = localStorage.getItem(PANEL_RATIO_STORAGE_KEY)
    return PANEL_RATIOS.some((r) => r.id === saved) ? saved : '60-40'
  })
  const [font, setFont] = useState(() => {
    const saved = localStorage.getItem(FONT_STORAGE_KEY)
    return FONTS.some((f) => f.id === saved) ? saved : 'inter'
  })
  const [detailCount, setDetailCount] = useState(() => {
    const saved = localStorage.getItem(DETAIL_COUNT_STORAGE_KEY)
    return DETAIL_COUNTS.some((d) => d.id === saved) ? saved : '3'
  })
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem(LEVEL_STORAGE_KEY)
    return LEVELS.some((l) => l.id === saved) ? saved : 'level-4'
  })
  const [rightPanelComponents, setRightPanelComponents] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(RIGHT_PANEL_STORAGE_KEY))
      // Empty array is valid — it means every panel was deliberately hidden.
      if (Array.isArray(saved) && saved.every((id) => RIGHT_PANEL_COMPONENTS.some((c) => c.id === id))) {
        return saved
      }
    } catch {
      /* ignore malformed saved value */
    }
    return ['top3', 'leaderboard']
  })
  const [infoBanner, setInfoBanner] = useState(() => {
    const saved = localStorage.getItem(INFO_BANNER_STORAGE_KEY)
    return INFO_BANNER_OPTIONS.some((o) => o.id === saved) ? saved : 'visible'
  })
  const [noColumn, setNoColumn] = useState(() => {
    const saved = localStorage.getItem(NO_COLUMN_STORAGE_KEY)
    return NO_COLUMN_OPTIONS.some((o) => o.id === saved) ? saved : 'visible'
  })
  const [swt03Session, setSwt03Session] = useState(() => {
    const saved = localStorage.getItem(SWT03_SESSION_STORAGE_KEY)
    return SWT03_SESSION_OPTIONS.some((o) => o.id === saved) ? saved : 'ongoing'
  })
  const [tableFontSize, setTableFontSize] = useState(() => {
    const saved = localStorage.getItem(TABLE_FONT_SIZE_STORAGE_KEY)
    return TABLE_FONT_SIZE_OPTIONS.some((o) => o.id === saved) ? saved : 'medium'
  })
  const [detailFontSize, setDetailFontSize] = useState(() => {
    const saved = localStorage.getItem(DETAIL_FONT_SIZE_STORAGE_KEY)
    return DETAIL_FONT_SIZE_OPTIONS.some((o) => o.id === saved) ? saved : 'medium'
  })
  const [stationFontSize, setStationFontSize] = useState(() => {
    const saved = localStorage.getItem(STATION_FONT_SIZE_STORAGE_KEY)
    return STATION_FONT_SIZE_OPTIONS.some((o) => o.id === saved) ? saved : 'medium'
  })
  const [stationIndex, setStationIndex] = useState(0)

  useEffect(() => {
    localStorage.setItem(RIGHT_PANEL_STORAGE_KEY, JSON.stringify(rightPanelComponents))
  }, [rightPanelComponents])

  useEffect(() => {
    localStorage.setItem(NO_COLUMN_STORAGE_KEY, noColumn)
  }, [noColumn])

  useEffect(() => {
    localStorage.setItem(SWT03_SESSION_STORAGE_KEY, swt03Session)
  }, [swt03Session])

  useEffect(() => {
    localStorage.setItem(TABLE_FONT_SIZE_STORAGE_KEY, tableFontSize)
  }, [tableFontSize])

  useEffect(() => {
    localStorage.setItem(DETAIL_FONT_SIZE_STORAGE_KEY, detailFontSize)
  }, [detailFontSize])

  useEffect(() => {
    localStorage.setItem(STATION_FONT_SIZE_STORAGE_KEY, stationFontSize)
  }, [stationFontSize])

  useEffect(() => {
    localStorage.setItem(INFO_BANNER_STORAGE_KEY, infoBanner)
  }, [infoBanner])

  useEffect(() => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, layout)
  }, [layout])

  useEffect(() => {
    localStorage.setItem(TABLE_MODEL_STORAGE_KEY, tableModel)
  }, [tableModel])

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_MODEL_STORAGE_KEY, leaderboardModel)
  }, [leaderboardModel])

  useEffect(() => {
    localStorage.setItem(SLIDESHOW_STORAGE_KEY, slideInterval)
  }, [slideInterval])

  useEffect(() => {
    localStorage.setItem(PANEL_RATIO_STORAGE_KEY, panelRatio)
  }, [panelRatio])

  useEffect(() => {
    localStorage.setItem(FONT_STORAGE_KEY, font)
  }, [font])

  useEffect(() => {
    localStorage.setItem(DETAIL_COUNT_STORAGE_KEY, detailCount)
  }, [detailCount])

  useEffect(() => {
    localStorage.setItem(LEVEL_STORAGE_KEY, level)
  }, [level])

  // Cycles the board through all 4 base stations — this app renders one
  // physical LCD's worth of content, but in reality 4 of these boards
  // exist (IMT-01..04). The interval simulates that rotation for demos.
  useEffect(() => {
    const seconds = Number(slideInterval)
    if (!seconds) return
    const id = setInterval(() => {
      setStationIndex((i) => (i + 1) % stations.length)
    }, seconds * 1000)
    return () => clearInterval(id)
  }, [slideInterval])

  const isTrainingLevel = level !== 'level-1'

  // Toggles one component in/out of the right column. Unchecking all
  // three is allowed on purpose — the table then takes the full row
  // width instead of the sidebar sitting there empty.
  const toggleRightPanelComponent = (id) => {
    setRightPanelComponents((current) => {
      if (current.includes(id)) return current.filter((c) => c !== id)
      return [...current, id]
    })
  }

  const switcherGroups = [
    {
      id: 'level',
      label: 'Level',
      icon: <LevelIcon />,
      options: LEVELS,
      active: level,
      onChange: setLevel,
    },
    {
      id: 'font',
      label: 'Typography',
      icon: <TypographyIcon />,
      options: FONTS,
      active: font,
      onChange: setFont,
    },
    ...(isTrainingLevel
      ? [
          {
            id: 'layout',
            label: 'Layout',
            icon: <LayoutIcon />,
            options: LAYOUTS,
            active: layout,
            onChange: setLayout,
          },
          {
            id: 'table-model',
            label: 'Table Model',
            icon: <TableModelIcon />,
            options: TABLE_MODELS,
            active: tableModel,
            onChange: setTableModel,
          },
          {
            id: 'leaderboard-model',
            label: 'Leaderboard',
            icon: <LeaderboardIcon />,
            options: LEADERBOARD_MODELS,
            active: leaderboardModel,
            onChange: setLeaderboardModel,
          },
          {
            id: 'slideshow',
            label: 'Slideshow',
            icon: <SlideshowIcon />,
            options: SLIDESHOW_INTERVALS,
            active: slideInterval,
            onChange: setSlideInterval,
          },
        ]
      : []),
    // Container Ratio splits detail list(s) vs. the right sidebar column —
    // Layout 4 (4-station grid) and Layout 5 (5 station columns) have no
    // such split, so the control only applies to Layouts 1-3.
    ...(isTrainingLevel && layout !== 'layout-4' && layout !== 'layout-5'
      ? [
          {
            id: 'panel-ratio',
            label: 'Container Ratio',
            icon: <RatioIcon />,
            options: PANEL_RATIOS,
            active: panelRatio,
            onChange: setPanelRatio,
          },
        ]
      : []),
    // Detail Count applies to Layout 2's side-by-side details and Layout
    // 3's combined detail list — Layout 1 always has exactly one, Layout 4
    // has none.
    ...(isTrainingLevel && (layout === 'layout-2' || layout === 'layout-3')
      ? [
          {
            id: 'detail-count',
            label: 'Detail Count',
            icon: <DetailCountIcon />,
            options: DETAIL_COUNTS,
            active: detailCount,
            onChange: setDetailCount,
          },
        ]
      : []),
    // Right column exists on Layouts 1-3 only — Layout 4 (4-station grid)
    // and Layout 5 (5 station columns) have no sidebar to configure.
    ...(isTrainingLevel && layout !== 'layout-4' && layout !== 'layout-5'
      ? [
          {
            id: 'right-panel',
            label: 'Right Panel',
            icon: <RightPanelIcon />,
            options: RIGHT_PANEL_COMPONENTS,
            active: rightPanelComponents,
            multiSelect: true,
            onToggle: toggleRightPanelComponent,
          },
        ]
      : []),
    ...(isTrainingLevel
      ? [
          {
            id: 'info-banner',
            label: 'Info Banner',
            icon: <InfoBannerIcon />,
            options: INFO_BANNER_OPTIONS,
            active: infoBanner,
            onChange: setInfoBanner,
          },
        ]
      : []),
    // Level 4 + Layout 5 only — the other layouts' tables always show
    // row numbers, and SWT-03's leaderboard variant only exists here.
    ...(level === 'level-4' && layout === 'layout-5'
      ? [
          {
            id: 'no-column',
            label: 'No Column',
            icon: <NoColumnIcon />,
            options: NO_COLUMN_OPTIONS,
            active: noColumn,
            onChange: setNoColumn,
          },
          {
            id: 'swt03-session',
            label: 'SWT-03 Session',
            icon: <LeaderboardIcon />,
            options: SWT03_SESSION_OPTIONS,
            active: swt03Session,
            onChange: setSwt03Session,
          },
        ]
      : []),
    // Layout 5 only — independent font-size controls, available on any
    // level since they're purely visual, not tied to Level 4's flip logic.
    ...(layout === 'layout-5'
      ? [
          {
            id: 'table-font-size',
            label: 'Table Font Size',
            icon: <FontSizeIcon />,
            options: TABLE_FONT_SIZE_OPTIONS,
            active: tableFontSize,
            onChange: setTableFontSize,
          },
          {
            id: 'detail-font-size',
            label: 'Detail Name Font Size',
            icon: <FontSizeIcon />,
            options: DETAIL_FONT_SIZE_OPTIONS,
            active: detailFontSize,
            onChange: setDetailFontSize,
          },
          {
            id: 'station-font-size',
            label: 'Base Station Font Size',
            icon: <FontSizeIcon />,
            options: STATION_FONT_SIZE_OPTIONS,
            active: stationFontSize,
            onChange: setStationFontSize,
          },
        ]
      : []),
  ]

  const ActiveLayout = LAYOUT_COMPONENTS[layout] ?? LayoutOne
  const activeStation = stations[stationIndex].id
  const activeFont = FONTS.find((f) => f.id === font) ?? FONTS[0]
  const TrainingBoard = TRAINING_BOARD_COMPONENTS[level] ?? SwtBoard
  const currentLevelLabel = LEVELS.find((l) => l.id === level)?.label ?? 'Level 1'

  return (
    <div className="app" style={{ fontFamily: activeFont.stack }}>
      <Header
        station={currentLevelLabel}
        detailLabel={isTrainingLevel ? 'Detail 2' : 'Lobby'}
        title={level === 'level-4' ? 'Specialized Weapon Training' : 'Infoboard'}
      />
      {isTrainingLevel ? (
        <TrainingBoard
          ActiveLayout={ActiveLayout}
          tableModel={tableModel}
          leaderboardModel={leaderboardModel}
          activeStation={activeStation}
          panelRatio={panelRatio}
          detailCount={detailCount}
          rightPanelComponents={rightPanelComponents}
          showInfoBanner={infoBanner === 'visible'}
          level={level}
          hideNoColumn={noColumn === 'hidden'}
          swt03Session={swt03Session}
          tableFontSize={tableFontSize}
          detailFontSize={detailFontSize}
          stationFontSize={stationFontSize}
        />
      ) : (
        <>
          <InfoBanner
            lead="Level 1 Lobby"
            message="Please check in at the reception counter. Today's bookings and facility announcements are shown below."
          />
          <LobbyBoard />
        </>
      )}
      <LayoutSwitcher groups={switcherGroups} />
    </div>
  )
}
