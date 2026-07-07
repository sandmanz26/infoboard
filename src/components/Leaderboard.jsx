function Medal({ medal, label }) {
  return (
    <span className={`medal medal-${medal}`}>
      <span className="medal-label">{label}</span>
    </span>
  )
}

export default function Leaderboard({ rows }) {
  return (
    <>
      <div className="leaderboard-head">
        <h2 className="panel-title">Leaderboard</h2>
        <div className="courseware-line">
          <span>
            Courseware: <strong>Day Test For SAR21/M16 BTP</strong>
          </span>
          <span>
            Weapon Type: <strong>SAR21</strong>
          </span>
        </div>
      </div>
      <table className="table leaderboard-table">
        <thead>
          <tr>
            <th>Ranking</th>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
            <th>MPI (mm)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                {row.medal ? (
                  <Medal medal={row.medal} label={row.ranking} />
                ) : (
                  <span className="ranking-number">{row.ranking}</span>
                )}
              </td>
              <td>{row.rank}</td>
              <td>{row.name}</td>
              <td>{row.score}</td>
              <td>{row.mpi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
