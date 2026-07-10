import TrainingRangeBoard from './TrainingRangeBoard.jsx'

// CTT (Level 3). Shares TrainingRangeBoard with CMT/SWT for now — give
// CTT-specific rules their own branch here as they're defined.
export default function CttBoard(props) {
  return <TrainingRangeBoard {...props} />
}
