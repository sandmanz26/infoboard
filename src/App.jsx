import { useEffect, useState } from 'react'
import { detailList, detailGroups, podium, leaderboard, stations } from './data.js'
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
import CombinedDetailList from './components/CombinedDetailList.jsx'
import LayoutSwitcher from './components/LayoutSwitcher.jsx'

const LAYOUTS = [
  { id: 'layout-1', label: 'Layout 1', description: 'Default — single detail list' },
  { id: 'layout-2', label: 'Layout 2', description: '3 detail lists + podium + directory' },
  { id: 'layout-3', label: 'Layout 3', description: 'Combined detail list + directory + leaderboard' },
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

const LAYOUT_STORAGE_KEY = 'infoboard-layout'
const TABLE_MODEL_STORAGE_KEY = 'infoboard-table-model'
const LEADERBOARD_MODEL_STORAGE_KEY = 'infoboard-leaderboard-model'
const SLIDESHOW_STORAGE_KEY = 'infoboard-slideshow-interval'
const PANEL_RATIO_STORAGE_KEY = 'infoboard-panel-ratio'

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

const DETAIL_STATUSES = ['Ready', 'Queue', 'Queue']

function DetailPanel({ tableModel, rows, title, status }) {
  if (tableModel === 'card') return <DetailListCards rows={rows} title={title} status={status} />
  if (tableModel === 'table2') return <DetailListTable2 rows={rows} title={title} status={status} />
  return <DetailList rows={rows} title={title} />
}

function LeaderboardPanel({ leaderboardModel, rows }) {
  if (leaderboardModel === 'compact') return <LeaderboardCompact rows={rows} />
  if (leaderboardModel === 'cards') return <LeaderboardCards rows={rows} />
  return <Leaderboard rows={rows} />
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

function LayoutThree({ tableModel, leaderboardModel, activeStation, panelRatio }) {
  const ratio = PANEL_RATIOS.find((r) => r.id === panelRatio) ?? PANEL_RATIOS[1]
  return (
    <main
      className="layout layout-combined"
      style={{ '--detail-fr': `${ratio.left}fr`, '--sidebar-fr': `${ratio.right}fr` }}
    >
      <CombinedDetailList groups={detailGroups} statuses={DETAIL_STATUSES} tableModel={tableModel} />
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
  ]

  const ActiveLayout = LAYOUT_COMPONENTS[layout] ?? LayoutOne
  const activeStation = stations[stationIndex].id

  return (
    <div className="app">
      <Header station={activeStation} />
      <InfoBanner />
      <ActiveLayout
        tableModel={tableModel}
        leaderboardModel={leaderboardModel}
        activeStation={activeStation}
        panelRatio={panelRatio}
      />
      <LayoutSwitcher groups={switcherGroups} />
    </div>
  )
}
