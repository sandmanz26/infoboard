import Clock from './Clock.jsx'
import PageDots from './PageDots.jsx'

function Crest() {
  return (
    <div className="crest" aria-hidden="true">
      <svg viewBox="0 0 40 40" width="40" height="40">
        <circle cx="20" cy="20" r="19" fill="#8a1f1f" />
        <circle cx="20" cy="20" r="15" fill="#fff" />
        <circle cx="20" cy="20" r="11" fill="#8a1f1f" />
        <path d="M20 11l2.2 5.2 5.6.5-4.3 3.7 1.3 5.5-4.8-3-4.8 3 1.3-5.5-4.3-3.7 5.6-.5z" fill="#f2c14e" />
      </svg>
    </div>
  )
}

export default function Header({
  station = 'IMT-01',
  detailLabel = 'Detail 2',
  title = 'Infoboard',
  showBadge = true,
  emphasizeTitle = false,
  // IMT_L level only — a brand + title grouped on the left, page dots on
  // the right, instead of the center-tab / clock+badge layout every
  // other level uses. Decorative (not wired to real navigation) to match
  // the reference design.
  paginationDots = null,
}) {
  const titleLines = title.split('\n')

  if (paginationDots) {
    return (
      <header className="header header-imt-l">
        <div className="header-left">
          <div className="brand">
            <Crest />
            <div className="brand-text">
              <span className="brand-line1">Training Resource</span>
              <span className="brand-line2">Management System</span>
            </div>
          </div>
          <div className="header-tab header-tab-inline">
            {titleLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
        <div className="header-right">
          <PageDots pageIndex={paginationDots.pageIndex} pageCount={paginationDots.pageCount} />
        </div>
      </header>
    )
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="brand">
          <Crest />
          <div className="brand-text">
            <span className="brand-line1">Training Resource</span>
            <span className="brand-line2">Management System</span>
          </div>
        </div>
      </div>
      <div className={`header-tab${emphasizeTitle ? ' header-tab-emphasize' : ''}`}>
        {titleLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <div className="header-right">
        <Clock />
        {showBadge && (
          <div className="station-badge">
            <span className="station-badge-label">{detailLabel}</span>
            <span className="station-badge-code">{station}</span>
          </div>
        )}
      </div>
    </header>
  )
}
