import { bookings, announcements, NOW_SLOT_INDEX } from '../data.js'
import BookingList from './BookingList.jsx'
import AnnouncementPanel from './AnnouncementPanel.jsx'
import usePagedRows from '../hooks/usePagedRows.js'
import { BOOKING_PAGE_SIZE, BOOKING_PAGE_INTERVAL_MS } from '../rotationConfig.js'

export default function LobbyBoard({ showTrainingMode }) {
  const { page, pageIndex } = usePagedRows(
    bookings,
    BOOKING_PAGE_SIZE,
    BOOKING_PAGE_INTERVAL_MS
  )

  // Summary counts for the cards above the table: the slot starting right
  // now, the slot right after it (prepped and ready to go next), and
  // everything further out.
  const stats = {
    starting: bookings.filter((b) => b.slotIndex === NOW_SLOT_INDEX).length,
    ready: bookings.filter((b) => b.slotIndex === NOW_SLOT_INDEX + 1).length,
    upcoming: bookings.filter((b) => b.slotIndex > NOW_SLOT_INDEX + 1).length,
  }

  return (
    <main className="layout layout-lobby">
      <section className="panel booking-panel">
        <BookingList rows={page} pageIndex={pageIndex} stats={stats} showTrainingMode={showTrainingMode} />
      </section>
      <section className="panel announcement-panel">
        <AnnouncementPanel items={announcements} />
      </section>
    </main>
  )
}
