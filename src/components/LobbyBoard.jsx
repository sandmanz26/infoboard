import { bookings, announcements } from '../data.js'
import BookingList from './BookingList.jsx'
import AnnouncementPanel from './AnnouncementPanel.jsx'
import usePagedRows from '../hooks/usePagedRows.js'

const BOOKING_PAGE_SIZE = 10
const BOOKING_PAGE_INTERVAL_MS = 6000

export default function LobbyBoard() {
  const { page, pageIndex, pageCount } = usePagedRows(
    bookings,
    BOOKING_PAGE_SIZE,
    BOOKING_PAGE_INTERVAL_MS
  )

  return (
    <main className="layout layout-lobby">
      <section className="panel booking-panel">
        <BookingList rows={page} pageIndex={pageIndex} pageCount={pageCount} />
      </section>
      <section className="panel announcement-panel">
        <AnnouncementPanel items={announcements} />
      </section>
    </main>
  )
}
