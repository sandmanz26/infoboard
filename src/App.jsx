import { detailList, podium, leaderboard } from './data.js'
import Header from './components/Header.jsx'
import InfoBanner from './components/InfoBanner.jsx'
import DetailList from './components/DetailList.jsx'
import TopThree from './components/TopThree.jsx'
import Directory from './components/Directory.jsx'
import Leaderboard from './components/Leaderboard.jsx'

export default function App() {
  return (
    <div className="app">
      <Header />
      <InfoBanner />
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
    </div>
  )
}
