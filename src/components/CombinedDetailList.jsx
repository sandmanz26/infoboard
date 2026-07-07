function GroupHead({ title, status }) {
  return (
    <div className="detail-group-head">
      <span className="detail-group-title">{title}</span>
      <span className={`status-pill${status === 'Queue' ? ' status-pill-queue' : ''}`}>
        {status}
      </span>
    </div>
  )
}

function DefaultRows({ rows }) {
  return (
    <table className="table combined-table">
      <thead>
        <tr>
          <th className="lane-col">Lane</th>
          <th>Rank</th>
          <th>Name</th>
          <th>Weapon</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.lane}>
            <td className="lane-col">
              <span className="lane-tag">{row.lane}</span>
            </td>
            <td>{row.rank}</td>
            <td>{row.name}</td>
            <td>{row.weapon}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Table2Rows({ rows }) {
  return (
    <table className="table combined-table table-two">
      <thead>
        <tr>
          <th className="lane-col">Lane</th>
          <th>Trainee</th>
          <th>Weapon</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.lane}>
            <td className="lane-col">
              <span className="lane-tag">{row.lane}</span>
            </td>
            <td>
              <span className="trainee-cell">
                <span className="trainee-rank">{row.rank}</span>
                <span className="trainee-name">{row.name}</span>
              </span>
            </td>
            <td>{row.weapon}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CardRows({ rows }) {
  return (
    <div className="detail-cards">
      {rows.map((row) => (
        <div className="detail-card" key={row.lane}>
          <div className="detail-card-top">
            <span className="lane-tag">{row.lane}</span>
          </div>
          <div className="detail-card-name">
            <span className="trainee-rank">{row.rank}</span> {row.name}
          </div>
          <div className="detail-card-weapon">{row.weapon}</div>
        </div>
      ))}
    </div>
  )
}

export default function CombinedDetailList({ groups, statuses, tableModel, title = 'Detail List' }) {
  return (
    <section className="panel combined-detail-panel">
      <h2 className="panel-title">{title}</h2>
      <div className="combined-detail-groups">
        {groups.map((rows, i) => (
          <div className="detail-group" key={i}>
            <GroupHead title={`Detail ${i + 1}`} status={statuses[i]} />
            {tableModel === 'card' ? (
              <CardRows rows={rows} />
            ) : tableModel === 'table2' ? (
              <Table2Rows rows={rows} />
            ) : (
              <DefaultRows rows={rows} />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
