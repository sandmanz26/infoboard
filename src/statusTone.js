// Maps a status label to the CSS tone used for its pill (see --ready-blue,
// --queue-amber, --done-green in index.css) so anything that highlights
// alongside a status — e.g. PageDots — can match the same color.
export function statusTone(status) {
  if (status === 'Queue' || status === 'Ongoing' || status === 'In Queue') return 'queue'
  if (status === 'Completed' || status === 'Done') return 'done'
  if (status === 'Ready' || status === 'Upcoming') return 'ready'
  return undefined
}
