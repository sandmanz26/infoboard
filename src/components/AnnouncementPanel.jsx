function RangeIllustration() {
  return (
    <svg viewBox="0 0 320 140" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="320" height="140" fill="#2f4858" />
      <rect y="92" width="320" height="48" fill="#3d5b6b" />
      <polygon points="0,92 60,58 130,92" fill="#35505f" />
      <polygon points="120,92 200,50 290,92" fill="#385665" />
      <circle cx="270" cy="34" r="16" fill="#f2c14e" opacity="0.85" />
      <g fill="#e8ecef">
        <rect x="60" y="70" width="8" height="24" rx="2" />
        <circle cx="64" cy="62" r="7" />
        <rect x="150" y="66" width="8" height="28" rx="2" />
        <circle cx="154" cy="58" r="7" />
      </g>
    </svg>
  )
}

export default function AnnouncementPanel({ items }) {
  return (
    <>
      <h2 className="panel-title">Announcements</h2>
      <div className="announcement-list">
        {items.map((item) => (
          <div className="announcement-card" key={item.id}>
            {item.hasImage && (
              <div className="announcement-image">
                <RangeIllustration />
              </div>
            )}
            <div className="announcement-body">
              <h3 className="announcement-title">{item.title}</h3>
              {item.caption && <p className="announcement-caption">{item.caption}</p>}
              {item.bullets && (
                <ul className="announcement-bullets">
                  {item.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
