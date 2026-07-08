import { stations, leaderboard } from '../data.js'

const STATION_STATUSES = ['Ready', 'Queue', 'Queue', 'Queue']
const TRAINEE_COUNT = 15

export default function StationsOverview({ activeStation }) {
  const leader = leaderboard[0]

  return (
    <main className="layout layout-overview">
      {stations.map((station, i) => {
        const status = STATION_STATUSES[i]
        const isActive = station.id === activeStation
        return (
          <section
            className={`panel station-card${isActive ? ' station-card-active' : ''}`}
            key={station.id}
            style={{ '--card-accent': station.bayFill }}
          >
            <div className="station-card-head">
              <span className="station-card-code">{station.id}</span>
              <span className={`status-pill${status === 'Queue' ? ' status-pill-queue' : ''}`}>
                {status}
              </span>
            </div>
            {isActive && <span className="station-card-now">Now showing on rotation</span>}
            <div className="station-card-body">
              <div className="station-card-stat">
                <span className="station-card-stat-value">{TRAINEE_COUNT}</span>
                <span className="station-card-stat-label">Trainees on roster</span>
              </div>
              <div className="station-card-leader">
                <span className="station-card-leader-label">Top score</span>
                <span className="station-card-leader-name" title={leader.name}>
                  <span className="trainee-rank">{leader.rank}</span> {leader.name}
                </span>
                <span className="station-card-leader-stats">
                  <strong>{leader.score}</strong>
                  <span>MPI {leader.mpi} mm</span>
                </span>
              </div>
            </div>
          </section>
        )
      })}
    </main>
  )
}
