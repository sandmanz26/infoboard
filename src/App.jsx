import { useEffect, useState } from 'react'
import { detailList, detailGroups, podium, leaderboard } from './data.js'
import Header from './components/Header.jsx'
import InfoBanner from './components/InfoBanner.jsx'
import DetailList from './components/DetailList.jsx'
import DetailListTable2 from './components/DetailListTable2.jsx'
import DetailListCards from './components/DetailListCards.jsx'
import TopThree from './components/TopThree.jsx'
import Directory from './components/Directory.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import LayoutSwitcher from './components/LayoutSwitcher.jsx'

const LAYOUTS = [
  { id: 'layout-1', label: 'Layout 1', description: 'Default — single detail list' },
  { id: 'layout-2', label: 'Layout 2', description: '3 detail lists (20% / 20% / 20%)' },
  { id: 'layout-3', label: 'Layout 3', description: '3 distinct detail lists + directory map' },
]

const TABLE_MODELS = [
  { id: 'default', label: 'Default Table', description: 'Original detail list table' },
  { id: 'card', label: 'Card Model', description: 'Compact card grid per trainee' },
  { id: 'table2', label: 'Table 2.0', description: 'Merged rank + name, no status column' },
]

const LAYOUT_STORAGE_KEY = 'infoboard-layout'
const TABLE_MODEL_STORAGE_KEY = 'infoboard-table-model'

const DETAIL_STATUSES = ['Ready', 'Queue', 'Queue']

function DetailPanel({ tableModel, rows, title, status }) {
  if (tableModel === 'card') return <DetailListCards rows={rows} title={title} status={status} />
  if (tableModel === 'table2') return <DetailListTable2 rows={rows} title={title} status={status} />
  return <DetailList rows={rows} title={title} />
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

function LayoutOne({ tableModel }) {
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
          <Leaderboard rows={leaderboard} />
        </section>
      </div>
    </main>
  )
}

function LayoutTwo({ tableModel }) {
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
        <section className="panel leaderboard-panel">
          <Leaderboard rows={leaderboard} />
        </section>
      </div>
    </main>
  )
}

function LayoutThree({ tableModel }) {
  return (
    <main className="layout layout-triple">
      <TripleDetailPanels tableModel={tableModel} rowsPerPanel={detailGroups} />
      <div className="right-col">
        <section className="panel directory-panel">
          <Directory />
        </section>
        <section className="panel leaderboard-panel">
          <Leaderboard rows={leaderboard} />
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

  useEffect(() => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, layout)
  }, [layout])

  useEffect(() => {
    localStorage.setItem(TABLE_MODEL_STORAGE_KEY, tableModel)
  }, [tableModel])

  const switcherGroups = [
    { id: 'layout', label: 'Layout', options: LAYOUTS, active: layout, onChange: setLayout },
    {
      id: 'table-model',
      label: 'Table Model',
      options: TABLE_MODELS,
      active: tableModel,
      onChange: setTableModel,
    },
  ]

  const ActiveLayout = LAYOUT_COMPONENTS[layout] ?? LayoutOne

  return (
    <div className="app">
      <Header />
      <InfoBanner />
      <ActiveLayout tableModel={tableModel} />
      <LayoutSwitcher groups={switcherGroups} />
    </div>
  )
}
