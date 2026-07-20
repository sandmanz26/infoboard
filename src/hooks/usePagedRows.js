import { useEffect, useState } from 'react'

// Splits rows into fixed-size pages and auto-advances through them on an
// interval — the same "one page at a time, flip to the next" pattern as
// an airport departures board, so a long leaderboard stays readable at
// a glance instead of shrinking to fit everything at once.
export default function usePagedRows(rows, pageSize, intervalMs, initialIndex = 0) {
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const [pageIndex, setPageIndex] = useState(initialIndex)

  useEffect(() => {
    setPageIndex(initialIndex)
  }, [rows, pageSize, initialIndex])

  useEffect(() => {
    if (pageCount <= 1) return
    const id = setInterval(() => {
      setPageIndex((i) => (i + 1) % pageCount)
    }, intervalMs)
    return () => clearInterval(id)
  }, [pageCount, intervalMs])

  const safeIndex = Math.min(pageIndex, pageCount - 1)
  const page = rows.slice(safeIndex * pageSize, safeIndex * pageSize + pageSize)

  return { page, pageIndex: safeIndex, pageCount }
}
