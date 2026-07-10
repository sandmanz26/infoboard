import TrainingRangeBoard from './TrainingRangeBoard.jsx'

// CMT (Level 2). Shares TrainingRangeBoard with CTT/SWT for now — give
// CMT-specific rules their own branch here as they're defined.
export default function CmtBoard(props) {
  return <TrainingRangeBoard {...props} />
}
