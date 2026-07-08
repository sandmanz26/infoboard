import { Fragment } from 'react'
import usePagedRows from '../hooks/usePagedRows.js'
import PageDots from './PageDots.jsx'

const GROUPS_PER_PAGE = 3
const GROUP_PAGE_INTERVAL_MS = 6000

function GroupHeadCell({ title, status }) {
  return (
    <div className="detail-group-head">
      <span className="detail-group-title">{title}</span>
      <span className={`status-pill${status === 'Queue' ? ' status-pill-queue' : ''}`}>
        {status}
      </span>
    </div>
  )
}

// One shared "Lane" column on the left instead of repeating Lane 1..N
// inside every detail group — every group already runs the same lane
// sequence, so a per-group column just duplicated the same numbers.
function UnifiedTable({ groups, merged }) {
  const rowCount = Math.max(...groups.map((g) => g.rows.length))

  return (
    <table className={`table combined-table combined-table-unified${merged ? ' table-two' : ''}`}>
      <thead>
        <tr>
          <th className="lane-col" rowSpan={2} />
          {groups.map((group, gi) => (
            <th
              key={group.title}
              colSpan={merged ? 2 : 3}
              className={`unified-group-head-cell${gi > 0 ? ' group-divider' : ''}`}
            >
              <GroupHeadCell title={group.title} status={group.status} />
            </th>
          ))}
        </tr>
        <tr>
          {groups.map((group, gi) => (
            <Fragment key={group.title}>
              {merged ? (
                <th className={`unified-sub-head${gi > 0 ? ' group-divider' : ''}`}>Trainee</th>
              ) : (
                <>
                  <th className={`unified-sub-head${gi > 0 ? ' group-divider' : ''}`}>Rank</th>
                  <th className="unified-sub-head">Name</th>
                </>
              )}
              <th className="unified-sub-head">Weapon</th>
            </Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rowCount }).map((_, ri) => (
          <tr key={ri}>
            <td className="lane-col">
              <span className="lane-tag">Lane {ri + 1}</span>
            </td>
            {groups.map((group, gi) => {
              const row = group.rows[ri]
              return (
                <Fragment key={group.title}>
                  {merged ? (
                    <td className={gi > 0 ? 'group-divider' : ''}>
                      {row && (
                        <span className="trainee-cell">
                          <span className="trainee-rank">{row.rank}</span>
                          <span className="trainee-name" title={row.name}>
                            {row.name}
                          </span>
                        </span>
                      )}
                    </td>
                  ) : (
                    <>
                      <td className={gi > 0 ? 'group-divider' : ''}>{row?.rank}</td>
                      <td className="name-cell" title={row?.name}>
                        {row?.name}
                      </td>
                    </>
                  )}
                  <td>{row?.weapon}</td>
                </Fragment>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function UnifiedCards({ groups }) {
  const rowCount = Math.max(...groups.map((g) => g.rows.length))

  return (
    <div className="unified-card-grid" style={{ '--group-count': groups.length }}>
      <div className="unified-card-cell unified-card-corner" />
      {groups.map((group, gi) => (
        <div
          className={`unified-card-cell unified-card-head${gi > 0 ? ' group-divider' : ''}`}
          key={group.title}
        >
          <GroupHeadCell title={group.title} status={group.status} />
        </div>
      ))}
      {Array.from({ length: rowCount }).map((_, ri) => (
        <Fragment key={ri}>
          <div className="unified-card-cell unified-card-lane">
            <span className="lane-tag">Lane {ri + 1}</span>
          </div>
          {groups.map((group, gi) => {
            const row = group.rows[ri]
            return (
              <div className={`unified-card-cell${gi > 0 ? ' group-divider' : ''}`} key={group.title}>
                {row && (
                  <div className="detail-card">
                    <div className="detail-card-name" title={row.name}>
                      <span className="trainee-rank">{row.rank}</span> {row.name}
                    </div>
                    <div className="detail-card-weapon">{row.weapon}</div>
                  </div>
                )}
              </div>
            )
          })}
        </Fragment>
      ))}
    </div>
  )
}

// groups: [{ title, status, rows }] — one entry per detail. When there
// are more than 3, they page 3-at-a-time on the same rotating-page
// pattern as the Leaderboard, instead of squeezing every column into
// the available width.
export default function CombinedDetailList({ groups, tableModel, title = 'Detail List' }) {
  const { page, pageIndex, pageCount } = usePagedRows(groups, GROUPS_PER_PAGE, GROUP_PAGE_INTERVAL_MS)

  return (
    <section className="panel combined-detail-panel">
      <div className="detail-panel-head">
        <h2 className="panel-title">{title}</h2>
        <PageDots pageIndex={pageIndex} pageCount={pageCount} />
      </div>
      {tableModel === 'card' ? (
        <UnifiedCards groups={page} />
      ) : (
        <UnifiedTable groups={page} merged={tableModel === 'table2'} />
      )}
    </section>
  )
}
