import PageDots from './PageDots.jsx'
import { statusTone } from '../statusTone.js'

export default function DetailListTable2({
  rows,
  title = 'Detail List',
  status = 'Ready',
  pageIndex,
  pageCount,
  hideNo,
  splitRank,
}) {
  return (
    <>
      <div className="detail-panel-head">
        <h2 className="panel-title">{title}</h2>
        <span className="detail-panel-head-meta">
          <span className={`status-pill${status === 'Queue' || status === 'Ongoing' ? ' status-pill-queue' : ''}`}>
            {status}
          </span>
          <PageDots pageIndex={pageIndex} pageCount={pageCount} tone={statusTone(status)} />
        </span>
      </div>
      <table className="table table-two">
        <thead>
          <tr>
            {!hideNo && <th className="no-cell">No</th>}
            {splitRank ? (
              <>
                <th className="rank-cell">Rank</th>
                <th className="name-cell">Name</th>
              </>
            ) : (
              <th>Trainee</th>
            )}
            <th className="weapon-cell">Weapon</th>
            <th className={splitRank ? 'lane-cell' : undefined}>Lane</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.no}>
              {!hideNo && <td className="no-cell">{row.no}</td>}
              {splitRank ? (
                <>
                  <td className="rank-cell">{row.rank}</td>
                  <td className="name-cell" title={row.name}>
                    {row.name}
                  </td>
                </>
              ) : (
                <td>
                  <span className="trainee-cell">
                    <span className="trainee-rank">{row.rank}</span>
                    <span className="trainee-name" title={row.name}>
                      {row.name}
                    </span>
                  </span>
                </td>
              )}
              <td className="weapon-cell" title={row.weapon}>
                {row.weapon}
              </td>
              {/* Layout 5 (splitRank) drops the redundant "Lane " prefix
                  repeated on every row now that the column is narrow. */}
              <td className={splitRank ? 'lane-cell' : undefined}>
                {splitRank ? String(row.lane).replace(/^Lane\s*/i, '') : row.lane}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
