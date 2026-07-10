import TrainingRangeBoard from './TrainingRangeBoard.jsx'

// SWT (Level 4). Shares TrainingRangeBoard with CMT/CTT for now — give
// SWT-specific rules their own branch here as they're defined.
export default function SwtBoard(props) {
  return <TrainingRangeBoard {...props} />
}
