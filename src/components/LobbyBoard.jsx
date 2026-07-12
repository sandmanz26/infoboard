import { bookings, announcements, NOW_SLOT_INDEX } from '../data.js'
import BookingList from './BookingList.jsx'
import AnnouncementPanel from './AnnouncementPanel.jsx'
import usePagedRows from '../hooks/usePagedRows.js'
import { BOOKING_PAGE_INTERVAL_MS } from '../rotationConfig.js'
import { LEVELS } from '../levels/levelConfig.js'

// Level 1 shows one level's booking table at a time, rotating
// Level 2 -> Level 3 -> Level 4 -> Level 2... Grouped up front so the
// rotation below only has to swap which pre-built list is on screen.
const TRAINING_LEVELS = LEVELS.filter((level) => level.shortCode)
const BOOKINGS_BY_LEVEL = Object.fromEntries(
  TRAINING_LEVELS.map((level) => [level.id, bookings.filter((b) => b.level === level.shortCode)])
)

export default function LobbyBoard() {
  // Reuses the paging hook as a 3-step rotation: one "page" per level, the
  // full dataset each time, cycling on the same interval as everything else.
  const { pageIndex: levelIndex } = usePagedRows(TRAINING_LEVELS, 1, BOOKING_PAGE_INTERVAL_MS)
  const activeLevel = TRAINING_LEVELS[levelIndex]
  const rows = BOOKINGS_BY_LEVEL[activeLevel.id]

  // Summary counts for the cards above the table, scoped to whichever
  // level's bookings are currently on screen.
  const stats = {
    starting: rows.filter((b) => b.slotIndex === NOW_SLOT_INDEX).length,
    ready: rows.filter((b) => b.slotIndex === NOW_SLOT_INDEX + 1).length,
    upcoming: rows.filter((b) => b.slotIndex > NOW_SLOT_INDEX + 1).length,
  }

  return (
    <main className="layout layout-lobby">
      <section className="panel booking-panel">
        <BookingList
          rows={rows}
          levels={TRAINING_LEVELS}
          activeLevelId={activeLevel.id}
          pageIndex={levelIndex}
          stats={stats}
        />
      </section>
      <section className="panel announcement-panel">
        <AnnouncementPanel items={announcements} />
      </section>
    </main>
  )
}
