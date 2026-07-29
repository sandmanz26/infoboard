// Level 3 (CTT)'s own floor plan — 5 training zones (A, B, C, D1, D2) plus
// a Control Station, laid out with plain CSS Grid boxes like CmtDirectory,
// since the real floor is an irregular shape rather than even bays.
// Position map is a reasonable approximation of the real floor's relative
// adjacency, not pixel-exact coordinates.
const ZONE_ITEMS = [
  { id: 'zone-a', label: 'Zone A', col: '1', row: '1 / span 3', tone: 'ctt-zone-a' },
  { id: 'zone-b', label: 'Zone B', col: '2', row: '1', tone: 'ctt-zone-b' },
  { id: 'zone-c', label: 'Zone C', col: '3', row: '1 / span 2', tone: 'ctt-zone-c' },
  { id: 'control', label: 'Control Station', col: '2', row: '2', tone: 'ctt-zone-control' },
  { id: 'zone-d1', label: 'Zone D1', col: '2', row: '3', tone: 'ctt-zone-d1' },
  { id: 'zone-d2', label: 'Zone D2', col: '3', row: '3', tone: 'ctt-zone-d2' },
]

export default function CttDirectory({ activeZone }) {
  return (
    <>
      <h2 className="panel-title">Directory</h2>
      <p className="directory-desc">Trainee should refer to the floor plan below for the zone and cabin locations.</p>
      <div className="cmt-directory-map ctt-directory-map">
        {ZONE_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`cmt-directory-box ${item.tone}${item.id === activeZone ? ' ctt-directory-box-active' : ''}`}
            style={{ gridColumn: item.col, gridRow: item.row }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </>
  )
}
