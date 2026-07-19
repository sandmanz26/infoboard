import { useEffect, useState } from 'react'
import { DEFAULT_NOTICE_TEXT } from '../data.js'

const NOTICE_STORAGE_KEY = 'infoboard-notice-text'

// The one part of the lobby board an operator can actually edit at
// runtime — everything else on this screen comes from static data, but
// the Notice needs to reflect whatever's happening today (closures,
// new booking windows, etc.) without a code change.
export default function NoticeCard() {
  const [notice, setNotice] = useState(() => localStorage.getItem(NOTICE_STORAGE_KEY) ?? DEFAULT_NOTICE_TEXT)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(notice)

  useEffect(() => {
    localStorage.setItem(NOTICE_STORAGE_KEY, notice)
  }, [notice])

  function startEdit() {
    setDraft(notice)
    setIsEditing(true)
  }

  function save() {
    setNotice(draft)
    setIsEditing(false)
  }

  function cancel() {
    setIsEditing(false)
  }

  const lines = notice.split('\n').filter((line) => line.trim().length > 0)

  return (
    <div className="announcement-card notice-card">
      <div className="announcement-body">
        <div className="notice-card-head">
          <h3 className="announcement-title">Notice</h3>
          {!isEditing && (
            <button type="button" className="notice-edit-btn" onClick={startEdit}>
              Edit
            </button>
          )}
        </div>
        {isEditing ? (
          <>
            <textarea
              className="notice-textarea"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={4}
              placeholder="One line per notice"
            />
            <div className="notice-edit-actions">
              <button type="button" className="notice-cancel-btn" onClick={cancel}>
                Cancel
              </button>
              <button type="button" className="notice-save-btn" onClick={save}>
                Save
              </button>
            </div>
          </>
        ) : (
          <ul className="announcement-bullets">
            {lines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
