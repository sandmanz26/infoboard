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

// Level 1 lobby — today's booking list for the training floors, sourced
// straight from the range office's booking sheet. Only the time is shown
// (no date) since the board only ever lists today's schedule; "unit" here
// is the unit's short code (e.g. "2SIR"), shown bold above the booking ID.
export const bookings = [
  // CMT — Level 2
  {
    unit: '2SIR',
    code: '20260715-CMT-01',
    platformType: 'Terrex 50 HMG, Terrex 40 AGL',
    level: 'L2',
    startTime: '08:00 AM',
    endTime: '12:00 PM',
    instructor: 'CPT Darren Lim',
    status: 'Ongoing',
  },
  {
    unit: '41SAB',
    code: '20260715-CMT-02',
    platformType: 'Terrex 50 HMG',
    level: 'L2',
    startTime: '01:00 PM',
    endTime: '06:00 PM',
    instructor: '2WO Sam Jackson',
    status: 'Upcoming',
  },
  {
    unit: '42SAR',
    code: '20260715-CMT-03',
    platformType: 'Terrex 40 AGL',
    level: 'L2',
    startTime: '08:00 AM',
    endTime: '06:00 PM',
    instructor: 'MAJ Jack Reach',
    status: 'Ongoing',
  },
  {
    unit: '3SAB',
    code: '20260715-CMT-04',
    platformType: 'Terrex 50 HMG',
    level: 'L2',
    startTime: '08:00 AM',
    endTime: '09:00 AM',
    instructor: '3SG Sam Liam',
    status: 'Completed',
  },

  // CTT — Level 3
  {
    unit: '1SIR',
    code: '20260715-CTT-01',
    platformType: 'ICV Commander',
    level: 'L3',
    startTime: '08:00 AM',
    endTime: '11:00 AM',
    instructor: '2LT Dexter',
    status: 'Overdue',
  },
  {
    unit: '2SIR',
    code: '20260715-CTT-02',
    platformType: 'LUV, PCSV Fuel',
    level: 'L3',
    startTime: '08:00 AM',
    endTime: '12:00 PM',
    instructor: 'CPT Darren Lim',
    status: 'Ongoing',
  },
  {
    unit: '10SIR',
    code: '20260715-CTT-03',
    platformType: 'ICV Storm',
    level: 'L3',
    startTime: '08:00 AM',
    endTime: '12:00 PM',
    instructor: 'CPT Daren Ong',
    status: 'Ongoing',
  },
  {
    unit: '41SAB',
    code: '20260715-CTT-04',
    platformType: 'PCSV BCS, ICV Medical, ICV Pioneer',
    level: 'L3',
    startTime: '01:00 PM',
    endTime: '06:00 PM',
    instructor: '2WO Sam Jackson',
    status: 'Upcoming',
  },
  {
    unit: '42SAR',
    code: '20260715-CTT-05',
    platformType: 'ICV Trooper, L2SG, M3G, PCSV Mortar, PCSV Rebro, Tonner',
    level: 'L3',
    startTime: '08:00 AM',
    endTime: '06:00 PM',
    instructor: 'MAJ Jack Unreach',
    status: 'Ongoing',
  },
  {
    unit: '6SAR',
    code: '20260715-CTT-06',
    platformType: 'ATTC-LAMBE',
    level: 'L3',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    instructor: '3SG Sam Liam',
    status: 'Upcoming',
  },
  {
    unit: '15SIB',
    code: '20260715-CTT-07',
    platformType: 'ATTC-LAMBE, Tonner, LUV, PCSV FMP',
    level: 'L3',
    startTime: '03:00 PM',
    endTime: '06:00 PM',
    instructor: '1WO Sally Yong',
    status: 'Upcoming',
  },

  // SWT — Level 4
  {
    unit: '21SAB',
    code: '20260715-SWT-01',
    mode: 'Marksmanship',
    programme: 'ATP(M) (SAR21/LMG)',
    level: 'L4',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    instructor: '2LT Sabrina',
    status: 'Overdue',
  },
  {
    unit: '21SAB',
    code: '20260715-SWT-02',
    mode: 'Marksmanship',
    programme: 'ATP (SP) (SAR21/LMG)',
    level: 'L4',
    startTime: '11:00 AM',
    endTime: '01:00 PM',
    instructor: '2LT Sabrina',
    status: 'Overdue',
  },
  {
    unit: '10SIR',
    code: '20260715-SWT03',
    mode: 'Collective',
    programme: 'Component Type Training (A-E)',
    level: 'L4',
    startTime: '08:00 AM',
    endTime: '12:00 PM',
    instructor: 'CPT Daren Ong',
    status: 'Completed',
  },
  {
    unit: '41SAB',
    code: '20260715-SWT-04',
    mode: 'Collective',
    programme: 'Blockforce Training',
    level: 'L4',
    startTime: '01:00 PM',
    endTime: '06:00 PM',
    instructor: 'MWO William Hung',
    status: 'Ongoing',
  },
  {
    unit: '412SAR',
    code: '20260715-SWT-05',
    mode: 'Judgemental',
    programme: 'Scenario 5',
    level: 'L4',
    startTime: '08:00 AM',
    endTime: '06:00 PM',
    instructor: '2LT Tom Hung',
    status: 'Ongoing',
  },
  {
    unit: '10SIR',
    code: '20260715-SWT-06',
    mode: 'Judgemental',
    programme: 'Scenario 20',
    level: 'L4',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    instructor: '3SG Eric Bishop',
    status: 'Completed',
  },
]

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
