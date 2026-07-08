import { useEffect, useState } from 'react'
import { detailList, podium, leaderboard, stations } from './data.js'
import Header from './components/Header.jsx'
import InfoBanner from './components/InfoBanner.jsx'
import DetailList from './components/DetailList.jsx'
import DetailListTable2 from './components/DetailListTable2.jsx'
import DetailListCards from './components/DetailListCards.jsx'
import TopThree from './components/TopThree.jsx'
import Directory from './components/Directory.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import LeaderboardCompact from './components/LeaderboardCompact.jsx'
import LeaderboardCards from './components/LeaderboardCards.jsx'
import LeaderboardTicker from './components/LeaderboardTicker.jsx'
import CombinedDetailList from './components/CombinedDetailList.jsx'
import StationsOverview from './components/StationsOverview.jsx'
import LayoutSwitcher from './components/LayoutSwitcher.jsx'
import usePagedRows from './hooks/usePagedRows.js'

const LEADERBOARD_PAGE_SIZE = 5
const LEADERBOARD_PAGE_INTERVAL_MS = 6000

const LAYOUTS = [
  { id: 'layout-1', label: 'Layout 1', description: 'Default — single detail list' },
  { id: 'layout-2', label: 'Layout 2', description: '3 detail lists + podium + directory' },
  { id: 'layout-3', label: 'Layout 3', description: 'Combined detail list + directory + leaderboard' },
  { id: 'layout-4', label: 'Layout 4', description: 'Overview of all 4 base stations at once' },
]

const TABLE_MODELS = [
  { id: 'default', label: 'Default Table', description: 'Original detail list table' },
  { id: 'card', label: 'Card Model', description: 'Compact card grid per trainee' },
  { id: 'table2', label: 'Table 2.0', description: 'Merged rank + name, no status column' },
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

const DETAIL_STATUSES = ['Ready', 'Queue', 'Queue']

function DetailPanel({ tableModel, rows, title, status }) {
  if (tableModel === 'card') return <DetailListCards rows={rows} title={title} status={status} />
  if (tableModel === 'table2') return <DetailListTable2 rows={rows} title={title} status={status} />
  return <DetailList rows={rows} title={title} />
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

function TripleDetailPanels({ tableModel, rowsPerPanel }) {
  return (
    <>
      {rowsPerPanel.map((rows, i) => (
        <section key={i} className="panel detail-panel detail-panel-compact">
          <DetailPanel
            tableModel={tableModel}
            rows={rows}
            title={`Detail ${i + 1}`}
            status={DETAIL_STATUSES[i]}
          />
        </section>
      ))}
    </>
  )
}

function LayoutOne({ tableModel, leaderboardModel }) {
  return (
    <main className="layout">
      <section className="panel detail-panel">
        <DetailPanel tableModel={tableModel} rows={detailList} title="Detail List" status="Ready" />
      </section>
      <div className="right-col">
        <section className="panel podium-panel">
          <TopThree data={podium} />
        </section>
        <section className="panel leaderboard-panel">
          <LeaderboardPanel leaderboardModel={leaderboardModel} rows={leaderboard} />
        </section>
      </div>
    </main>
  )
}

function LayoutTwo({ tableModel, activeStation }) {
  return (
    <main className="layout layout-triple">
      <TripleDetailPanels
        tableModel={tableModel}
        rowsPerPanel={[detailList, detailList, detailList]}
      />
      <div className="right-col">
        <section className="panel podium-panel">
          <TopThree data={podium} />
        </section>
        <section className="panel directory-panel">
          <Directory activeStation={activeStation} />
        </section>
      </div>
    </main>
  )
}

function LayoutThree({ tableModel, leaderboardModel, activeStation, panelRatio, detailCount }) {
  const ratio = PANEL_RATIOS.find((r) => r.id === panelRatio) ?? PANEL_RATIOS[1]
  const count = Number(detailCount) || 3
  const groups = Array.from({ length: count }, (_, i) => ({
    title: `Detail ${i + 1}`,
    status: i === 0 ? 'Ready' : 'Queue',
    rows: detailList,
  }))
  return (
    <main
      className="layout layout-combined"
      style={{ '--detail-fr': `${ratio.left}fr`, '--sidebar-fr': `${ratio.right}fr` }}
    >
      <CombinedDetailList groups={groups} tableModel={tableModel} />
      <div className="right-col">
        <section className="panel directory-panel">
          <Directory activeStation={activeStation} />
        </section>
        <section className="panel leaderboard-panel">
          <LeaderboardPanel leaderboardModel={leaderboardModel} rows={leaderboard} />
        </section>
      </div>
    </main>
  )
}

const LAYOUT_COMPONENTS = {
  'layout-1': LayoutOne,
  'layout-2': LayoutTwo,
  'layout-3': LayoutThree,
  'layout-4': StationsOverview,
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
  const [stationIndex, setStationIndex] = useState(0)

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

  const switcherGroups = [
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
    {
      id: 'panel-ratio',
      label: 'Container Ratio',
      icon: <RatioIcon />,
      options: PANEL_RATIOS,
      active: panelRatio,
      onChange: setPanelRatio,
    },
    {
      id: 'font',
      label: 'Typography',
      icon: <TypographyIcon />,
      options: FONTS,
      active: font,
      onChange: setFont,
    },
    {
      id: 'detail-count',
      label: 'Detail Count',
      icon: <DetailCountIcon />,
      options: DETAIL_COUNTS,
      active: detailCount,
      onChange: setDetailCount,
    },
  ]

  const ActiveLayout = LAYOUT_COMPONENTS[layout] ?? LayoutOne
  const activeStation = stations[stationIndex].id
  const activeFont = FONTS.find((f) => f.id === font) ?? FONTS[0]

  return (
    <div className="app" style={{ fontFamily: activeFont.stack }}>
      <Header station={activeStation} />
      <InfoBanner />
      <ActiveLayout
        tableModel={tableModel}
        leaderboardModel={leaderboardModel}
        activeStation={activeStation}
        panelRatio={panelRatio}
        detailCount={detailCount}
      />
      <LayoutSwitcher groups={switcherGroups} />
    </div>
  )
}
