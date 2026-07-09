import { bookings, announcements } from '../data.js'
import BookingList from './BookingList.jsx'
import AnnouncementPanel from './AnnouncementPanel.jsx'

export default function LobbyBoard() {
  return (
    <main className="layout layout-lobby">
      <section className="panel booking-panel">
        <BookingList rows={bookings} />
      </section>
      <section className="panel announcement-panel">
        <AnnouncementPanel items={announcements} />
      </section>
    </main>
  )
}
