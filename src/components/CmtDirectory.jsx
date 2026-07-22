// Level 2 (CMT)'s own floor plan — 11 cabins + a Briefing Room, laid out
// with plain CSS Grid boxes (not an isometric SVG like the SWT Directory)
// since the real floor plan is an irregular shape rather than 4 even bays.
// Position map is a reasonable approximation of the real floor's relative
// adjacency, not pixel-exact coordinates.
const FLOOR_ITEMS = [
  { id: 'briefing', label: 'Briefing Room', col: '1 / span 3', row: '1' },
  { id: 'CMT-01', label: 'CMT-01', col: '5', row: '1' },
  { id: 'CMT-11', label: 'CMT-11', col: '1', row: '2' },
  { id: 'CMT-10', label: 'CMT-10', col: '2', row: '2' },
  { id: 'CMT-09', label: 'CMT-09', col: '3', row: '2' },
  { id: 'CMT-08', label: 'CMT-08', col: '4', row: '2' },
  { id: 'CMT-02', label: 'CMT-02', col: '5', row: '2' },
  { id: 'CMT-07', label: 'CMT-07', col: '2', row: '3' },
  { id: 'CMT-03', label: 'CMT-03', col: '4', row: '3' },
  { id: 'CMT-06', label: 'CMT-06', col: '1', row: '4' },
  { id: 'CMT-04', label: 'CMT-04', col: '3', row: '4' },
  { id: 'CMT-05', label: 'CMT-05', col: '3', row: '5' },
]

export default function CmtDirectory() {
  return (
    <>
      <h2 className="panel-title">Directory</h2>
      <p className="directory-desc">Trainee should refer to the floor plan below for the Briefing Room and cabin locations.</p>
      <div className="cmt-directory-map">
        {FLOOR_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`cmt-directory-box${item.id === 'briefing' ? ' cmt-directory-box-briefing' : ''}`}
            style={{ gridColumn: item.col, gridRow: item.row }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </>
  )
}
