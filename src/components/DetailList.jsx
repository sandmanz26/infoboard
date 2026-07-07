export default function DetailList({ rows, title = 'Detail List' }) {
  return (
    <>
      <h2 className="panel-title">{title}</h2>
      <table className="table detail-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Rank</th>
            <th>Name</th>
            <th>Status</th>
            <th>Weapon</th>
            <th>Lane</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.no}>
              <td>{row.no}</td>
              <td>{row.rank}</td>
              <td>{row.name}</td>
              <td>
                <span className="status-pill">{row.status}</span>
              </td>
              <td>{row.weapon}</td>
              <td>{row.lane}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
