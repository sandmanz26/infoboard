import { DEFAULT_NOTICE_TEXT } from '../data.js'

export default function NoticeCard() {
  const lines = DEFAULT_NOTICE_TEXT.split('\n').filter((line) => line.trim().length > 0)

  return (
    <div className="announcement-card notice-card">
      <div className="announcement-body">
        <h3 className="announcement-title">Notice</h3>
        <ul className="announcement-bullets">
          {lines.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
