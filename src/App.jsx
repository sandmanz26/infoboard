import { useEffect, useState } from 'react'
import { detailList, podium, leaderboard } from './data.js'
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
]

const TABLE_MODELS = [
  { id: 'default', label: 'Default Table', description: 'Original detail list table' },
  { id: 'card', label: 'Card Model', description: 'Compact card grid per trainee' },
  { id: 'table2', label: 'Table 2.0', description: 'Merged rank + name, no status column' },
]

const LAYOUT_STORAGE_KEY = 'infoboard-layout'
const TABLE_MODEL_STORAGE_KEY = 'infoboard-table-model'

function DetailPanel({ tableModel, rows, title, status }) {
  if (tableModel === 'card') return <DetailListCards rows={rows} title={title} status={status} />
  if (tableModel === 'table2') return <DetailListTable2 rows={rows} title={title} status={status} />
  return <DetailList rows={rows} title={title} />
}

function LayoutOne({ tableModel }) {
  return (
    <main className="layout">
      <section className="panel detail-panel">
        <DetailPanel tableModel={tableModel} rows={detailList} title="Detail List" status="Ready" />
      </section>
      <div className="right-col">
        <div className="right-top">
          <section className="panel podium-panel">
            <TopThree data={podium} />
          </section>
          <section className="panel directory-panel">
            <Directory />
          </section>
        </div>
        <section className="panel leaderboard-panel">
          <Leaderboard rows={leaderboard} />
        </section>
      </div>
    </main>
  )
}

const LAYOUT_TWO_PANELS = [
  { title: 'Detail 1', status: 'Ready' },
  { title: 'Detail 2', status: 'Queue' },
  { title: 'Detail 3', status: 'Queue' },
]

function LayoutTwo({ tableModel }) {
  return (
    <main className="layout layout-two">
      {LAYOUT_TWO_PANELS.map(({ title, status }) => (
        <section key={title} className="panel detail-panel detail-panel-compact">
          <DetailPanel tableModel={tableModel} rows={detailList} title={title} status={status} />
        </section>
      ))}
      <div className="right-col">
        <section className="panel podium-panel">
          <TopThree data={podium} />
        </section>
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

  return (
    <div className="app">
      <Header />
      <InfoBanner />
      {layout === 'layout-2' ? (
        <LayoutTwo tableModel={tableModel} />
      ) : (
        <LayoutOne tableModel={tableModel} />
      )}
      <LayoutSwitcher groups={switcherGroups} />
    </div>
  )
}
