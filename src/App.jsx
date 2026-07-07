import { useEffect, useState } from 'react'
import { detailList, podium, leaderboard } from './data.js'
import Header from './components/Header.jsx'
import InfoBanner from './components/InfoBanner.jsx'
import DetailList from './components/DetailList.jsx'
import TopThree from './components/TopThree.jsx'
import Directory from './components/Directory.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import LayoutSwitcher from './components/LayoutSwitcher.jsx'

const LAYOUTS = [
  { id: 'layout-1', label: 'Layout 1', description: 'Default — single detail list' },
  { id: 'layout-2', label: 'Layout 2', description: '3 detail lists (20% / 20% / 20%)' },
]

const STORAGE_KEY = 'infoboard-layout'

function LayoutOne() {
  return (
    <main className="layout">
      <section className="panel detail-panel">
        <DetailList rows={detailList} />
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

function LayoutTwo() {
  return (
    <main className="layout layout-two">
      {['Detail 1', 'Detail 2', 'Detail 3'].map((title) => (
        <section key={title} className="panel detail-panel detail-panel-compact">
          <DetailList rows={detailList} title={title} />
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
    const saved = localStorage.getItem(STORAGE_KEY)
    return LAYOUTS.some((l) => l.id === saved) ? saved : 'layout-1'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, layout)
  }, [layout])

  return (
    <div className="app">
      <Header />
      <InfoBanner />
      {layout === 'layout-2' ? <LayoutTwo /> : <LayoutOne />}
      <LayoutSwitcher layouts={LAYOUTS} active={layout} onChange={setLayout} />
    </div>
  )
}
