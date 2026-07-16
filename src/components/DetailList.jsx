import PageDots from './PageDots.jsx'
import { statusTone } from '../statusTone.js'

export default function DetailList({ rows, title = 'Detail List', status, pageIndex, pageCount, hideNo }) {
  return (
    <>
      <div className="detail-panel-head">
        <h2 className="panel-title">{title}</h2>
        <span className="detail-panel-head-meta">
          {status && (
            <span className={`status-pill${status === 'Queue' ? ' status-pill-queue' : ''}`}>
              {status}
            </span>
          )}
          <PageDots pageIndex={pageIndex} pageCount={pageCount} tone={statusTone(status)} />
        </span>
      </div>
      <table className="table detail-table">
        <thead>
          <tr>
            {!hideNo && <th>No</th>}
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
              {!hideNo && <td>{row.no}</td>}
              <td>{row.rank}</td>
              <td className="name-cell" title={row.name}>
                {row.name}
              </td>
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
