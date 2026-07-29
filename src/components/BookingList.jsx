import PageLoadingBar from './PageLoadingBar.jsx'
import LevelIndicator from './LevelIndicator.jsx'
import { BOOKING_PAGE_INTERVAL_MS } from '../rotationConfig.js'

const STATUS_CLASS = {
  Ongoing: 'status-pill-queue',
  Upcoming: '',
  Completed: 'status-pill-done',
  Overdue: 'status-pill-overdue',
}

const STAT_CARDS = [
  { key: 'starting', label: 'Upcoming', tone: 'starting' },
  { key: 'upcoming', label: 'Ongoing', tone: 'upcoming' },
  { key: 'ready', label: 'Completed', tone: 'ready' },
  { key: 'overdue', label: 'Overdue', tone: 'overdue' },
]

// Each column knows its own header label and how to render a cell.
// CMT/CTT collapse mode+programme into a single Platform Type column; SWT
// keeps them separate as Mode + Courseware.
const COLUMN_RENDERERS = {
  no: {
    label: 'No',
    cell: (row, index) => index + 1,
  },
  unit: {
    label: 'Unit',
    cell: (row) => <div className="booking-unit">{row.unit}</div>,
  },
  platformType: {
    label: 'Platform Type',
    cell: (row) => row.platformType,
  },
  mode: {
    label: 'Mode',
    cell: (row) => row.mode,
  },
  courseware: {
    label: 'Courseware',
    cell: (row) => row.programme,
  },
  startTime: {
    label: 'Start Time',
    cellClassName: 'booking-time',
    cell: (row) => row.startTime,
  },
  endTime: {
    label: 'End Time',
    cellClassName: 'booking-time',
    cell: (row) => row.endTime,
  },
  instructor: {
    label: 'Instructor',
    cell: (row) => row.instructor,
  },
  status: {
    label: 'Status',
    cell: (row) => <span className={`status-pill ${STATUS_CLASS[row.status]}`}>{row.status}</span>,
  },
}

const CMT_CTT_COLUMNS = [
  { key: 'no', width: '4%' },
  { key: 'platformType', width: '30%' },
  { key: 'startTime', width: '11%' },
  { key: 'endTime', width: '11%' },
  { key: 'unit', width: '10%' },
  { key: 'instructor', width: '16%' },
  { key: 'status', width: '18%' },
]

const LEVEL_TABLE_COLUMNS = {
  'level-2': CMT_CTT_COLUMNS,
  'level-3': CMT_CTT_COLUMNS,
  'level-4': [
    { key: 'no', width: '4%' },
    { key: 'mode', width: '12%' },
    { key: 'courseware', width: '22%' },
    { key: 'startTime', width: '10%' },
    { key: 'endTime', width: '10%' },
    { key: 'unit', width: '10%' },
    { key: 'instructor', width: '14%' },
    { key: 'status', width: '18%' },
  ],
}

function StatIcon() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 6v4.3l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function BookingList({ rows, levels, activeLevelId, pageIndex, stats, intervalMs = BOOKING_PAGE_INTERVAL_MS }) {
  const columns = LEVEL_TABLE_COLUMNS[activeLevelId] ?? CMT_CTT_COLUMNS
  return (
    <>
      <div className="booking-stats">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className={`booking-stat-card booking-stat-${card.tone}`}>
            <span className="booking-stat-icon" aria-hidden="true">
              <StatIcon />
            </span>
            <div>
              <div className="booking-stat-value">{stats[card.key]}</div>
              <div className="booking-stat-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="booking-panel-head">
        <LevelIndicator levels={levels} active={activeLevelId} />
        <PageLoadingBar pageIndex={pageIndex} intervalMs={intervalMs} />
      </div>
      <table className="table booking-table">
        <colgroup>
          {columns.map((col) => (
            <col key={col.key} style={{ width: col.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{COLUMN_RENDERERS[col.key].label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.code}>
              {columns.map((col) => {
                const def = COLUMN_RENDERERS[col.key]
                return (
                  <td key={col.key} className={def.cellClassName}>
                    {def.cell(row, index)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
