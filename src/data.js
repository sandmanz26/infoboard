export const detailList = [
  { no: 1, rank: '3SG', name: 'Raj Kumar Selvam', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
  { no: 2, rank: 'REC', name: 'Ashvin Nair', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
  { no: 3, rank: '3SG', name: 'Leung Kai Fung', status: 'Ready', weapon: 'SAR21', lane: 'Lane 3' },
  { no: 4, rank: 'REC', name: 'Lin Zheng Wei', status: 'Ready', weapon: 'SAR21', lane: 'Lane 4' },
  { no: 5, rank: '3SG', name: 'Yang Zhen Yu', status: 'Ready', weapon: 'SAR21', lane: 'Lane 5' },
  { no: 6, rank: '3SG', name: 'Huang Chen Xi', status: 'Ready', weapon: 'SAR21', lane: 'Lane 6' },
  { no: 7, rank: 'REC', name: 'Beh Ming De', status: 'Ready', weapon: 'SAR21', lane: 'Lane 7' },
  { no: 8, rank: 'REC', name: 'Say Wen Kai', status: 'Ready', weapon: 'SAR21', lane: 'Lane 8' },
  { no: 9, rank: '3SG', name: 'Wu Zheng Kai', status: 'Ready', weapon: 'SAR21', lane: 'Lane 9' },
  { no: 10, rank: 'REC', name: 'Thamizhavel Raman', status: 'Ready', weapon: 'SAR21', lane: 'Lane 10' },
  { no: 11, rank: '3SG', name: 'Chong Wei Liang', status: 'Ready', weapon: 'SAR21', lane: 'Lane 11' },
  { no: 12, rank: 'REC', name: 'Farah Aziz', status: 'Ready', weapon: 'SAR21', lane: 'Lane 12' },
  { no: 13, rank: '3SG', name: 'Koh Zhi Hao', status: 'Ready', weapon: 'SAR21', lane: 'Lane 13' },
  { no: 14, rank: 'REC', name: 'Tan Jun Wei', status: 'Ready', weapon: 'SAR21', lane: 'Lane 14' },
  { no: 15, rank: '3SG', name: 'Ng Wei Xuan', status: 'Ready', weapon: 'SAR21', lane: 'Lane 15' },
]

export const podium = {
  first: { names: ['3SG Liu Shu Qi'], score: '20', total: '20', mpi: 'MPI: 2.00 mm' },
  second: { names: ['REC Guo Guo Qiang', '3SG Muhamad Hj Zul bin Sharin'], score: '20', total: '20', mpi: 'MPI: 3.00 mm' },
  third: { names: ['REC Lu Ling Hui'], score: '17', total: '20', mpi: 'MPI: 5.00 mm' },
}

// Always 10 entries — the leaderboard panel shows the top 10 scores
// for the current courseware, regardless of which display style is active.
export const leaderboard = [
  { ranking: '1st', medal: 'gold', rank: '3SG', name: 'Liu Shu Qi', score: '20 / 20', mpi: '2.00' },
  { ranking: '2nd', medal: 'silver', rank: 'REC', name: 'Guo Guo Qiang', score: '20 / 20', mpi: '3.00' },
  { ranking: '2nd', medal: 'silver', rank: '3SG', name: 'Muhamad Hj Zul bin Sharin', score: '20 / 20', mpi: '3.00' },
  { ranking: '3rd', medal: 'bronze', rank: 'REC', name: 'Lu Ling Hui', score: '17 / 20', mpi: '5.00' },
  { ranking: '4', medal: null, rank: '3SG', name: 'Kwa Xuan Ming', score: '15 / 20', mpi: '1.00' },
  { ranking: '5', medal: null, rank: '3SG', name: 'Tang Jia Hui', score: '14 / 20', mpi: '4.00' },
  { ranking: '6', medal: null, rank: '3SG', name: 'Tong Yi Ling', score: '11 / 20', mpi: '1.00' },
  { ranking: '7', medal: null, rank: '3SG', name: 'Law Yong Rui', score: '8 / 20', mpi: '2.00' },
  { ranking: '8', medal: null, rank: '3SG', name: 'Choong Yi Min', score: '2 / 20', mpi: '3.00' },
  { ranking: '9', medal: null, rank: 'REC', name: 'Ong Wei Jie', score: '1 / 20', mpi: '6.00' },
]

// The four physical base stations this infoboard can be deployed to,
// matching the bays drawn on the Directory map.
export const stations = [
  { id: 'IMT-01', bayFill: '#c0392b', bayCenter: [167, 150] },
  { id: 'IMT-02', bayFill: '#7ec84f', bayCenter: [282, 127] },
  { id: 'IMT-03', bayFill: '#9b6fd6', bayCenter: [397, 106] },
  { id: 'IMT-04', bayFill: '#f2d13c', bayCenter: [507, 85] },
]

// Level 1 lobby — today's booking list for the training floors.
// Only the time is shown (no date) since the board only ever lists
// today's schedule. 10 hourly slots x 3 concurrent rooms = 30 bookings,
// with status derived from where each slot sits relative to "now".
import { LEVELS } from './levels/levelConfig.js'

// L2/L3/L4 -> CMT/CTT/SWT, read straight off the level config so the
// booking list's unit names never drift out of sync with the switcher.
const TRAINING_TYPE_BY_SHORT_LEVEL = Object.fromEntries(
  LEVELS.filter((level) => level.shortCode).map((level) => [level.shortCode, level.context])
)

const BOOKING_PROGRAMMES = {
  Marksmanship: ['ATP (SAR21)', 'CSM (SAR21)', 'APS (SAR21)', 'BTP (SAR21)'],
  Collective: ['Type Training A', 'Type Training B', 'Section Battle Course'],
  Judgemental: ['Scenarios 1', 'Scenarios 2', 'Scenarios 3'],
}
const BOOKING_MODES = ['Marksmanship', 'Collective', 'Judgemental']
const BOOKING_LEVELS = ['L2', 'L3', 'L4']

// CMT (Level 2) bookings show a vehicle/variant instead of a courseware
// programme in their "Platform Type" column.
const CMT_PLATFORM_TYPES = [
  'Terrex 40 AGL',
  'Terrex 50 HMG',
  'ICV Commander',
  'ICV Trooper',
  'ICV Scout',
  'ICV Pioneer',
  'ICV Medical',
  'ICV Storm',
  'L2SG',
  'L2-AEV',
  'M3G',
  'ATTC-LAMBE',
  'PCSV Mortar',
  'PCSV Rebro',
  'PCSV Fuel',
  'PCSV Bn Casualty Station (BCS)',
  'PCSV Combat Train (Logistics)',
  'PCSV FMP (Maintenance)',
  'Tonner',
  'LUV',
]
const BOOKING_INSTRUCTORS = ['Bryan', 'Chun Xiong', 'Daniek', 'Ken Chow']
const BOOKING_TIME_SLOTS = [
  '07:00 AM',
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
]
// 11:00 AM — everything before is done, this slot is starting now, and
// everything after is upcoming. Exported so the lobby's summary cards
// (Starting / Ready / Upcoming) can bucket off the same reference point.
export const NOW_SLOT_INDEX = 4

function nextHour(time) {
  const [, hh, mm, period] = time.match(/(\d+):(\d+) (\w+)/)
  let hour = (Number(hh) % 12) + 1
  const nextPeriod = hour === 12 ? (period === 'AM' ? 'PM' : 'AM') : period
  return `${String(hour).padStart(2, '0')}:${mm} ${nextPeriod}`
}

export const bookings = BOOKING_TIME_SLOTS.flatMap((startTime, slotIndex) =>
  [0, 1, 2].map((room) => {
    const n = slotIndex * 3 + room
    const unit = 30 - n
    const mode = BOOKING_MODES[n % BOOKING_MODES.length]
    const programmes = BOOKING_PROGRAMMES[mode]
    const level = BOOKING_LEVELS[n % BOOKING_LEVELS.length]
    const status =
      slotIndex < NOW_SLOT_INDEX ? 'Completed' : slotIndex === NOW_SLOT_INDEX ? 'Ongoing' : 'Upcoming'
    return {
      unit: `${TRAINING_TYPE_BY_SHORT_LEVEL[level]} Training for Unit ${unit}`,
      code: `#111024-KC${String(n + 1).padStart(4, '0')}`,
      mode,
      programme: programmes[n % programmes.length],
      platformType:
        level === 'L2' ? CMT_PLATFORM_TYPES[n % CMT_PLATFORM_TYPES.length] : programmes[n % programmes.length],
      level,
      slotIndex,
      startTime,
      endTime: nextHour(startTime),
      instructor: BOOKING_INSTRUCTORS[n % BOOKING_INSTRUCTORS.length],
      status,
    }
  })
)

// Level 1 lobby — rotating announcement cards.
export const announcements = [
  {
    id: 'range-day',
    title: 'Range Day Highlights',
    caption: 'Unit 20 completing zeroing drills on the SAR21 range this morning.',
    hasImage: true,
  },
  {
    id: 'dos-donts',
    title: "Range Do's and Don'ts",
    bullets: [
      "Check in at the counter before proceeding to your assigned level.",
      'Weapons remain pointed downrange at all times.',
      'No photography inside the live-fire range floors.',
      'Report any equipment fault to your instructor immediately.',
    ],
  },
  {
    id: 'facility-notice',
    title: 'Facility Notice',
    bullets: [
      'Level 3 range closed for maintenance on 21 August, 0800-1200.',
      'New booking slots for September now open at the reception counter.',
    ],
  },
]
