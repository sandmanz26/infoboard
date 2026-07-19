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

// Level 4 (SWT) + Layout 5 — real per-station rosters from the range
// office's station board, one real booking per column instead of a
// shared placeholder list. Sizes vary because that's how many trainees
// are actually booked on each (5 or 15), not a display setting.
// SWT-03 doubles as a Global Leaderboard once its session ends — see
// leaderboardRows/isLeaderboardCapable.
export const swtStations = [
  {
    code: 'SWT-01',
    bookingCode: '20260715-SWT-04',
    mode: 'Collective',
    courseware: 'Blockforce Training',
    unit: '41SAB',
    startTime: '01:00 PM',
    endTime: '06:00 PM',
    rows: [
      { no: 1, rank: '2SG', name: 'Yeo Jun Kai', status: 'Ready', weapon: 'M203', lane: 'Lane 1' },
      { no: 2, rank: '2SG', name: 'Seah Yu Ting', status: 'Ready', weapon: 'SAR21, MATADOR', lane: 'Lane 2' },
      { no: 3, rank: 'CPT', name: 'Chan Zi Xuan', status: 'Ready', weapon: 'SPIKELR', lane: 'Lane 3' },
      { no: 4, rank: '3SG', name: 'Neo Jia Hao', status: 'Ready', weapon: 'M110, CLAYMORE', lane: 'Lane 4' },
      { no: 5, rank: '3WO', name: 'Low Shi Hui', status: 'Ready', weapon: 'LMG', lane: 'Lane 5' },
      { no: 6, rank: 'CPT', name: 'Liew Kai Xin', status: 'Ready', weapon: 'SAR21', lane: 'Lane 6' },
      { no: 7, rank: '2LT', name: 'Sim Wen Qi', status: 'Ready', weapon: 'SAR21', lane: 'Lane 7' },
      { no: 8, rank: '2LT', name: 'Ho Jia Ying', status: 'Ready', weapon: 'SAR21, COMD BINO', lane: 'Lane 8' },
      { no: 9, rank: '1WO', name: 'Quek Jun Wei', status: 'Ready', weapon: 'SAR21, DRONE', lane: 'Lane 9' },
      { no: 10, rank: '1SG', name: 'Muhammad Amir Bin Rahman', status: 'Ready', weapon: 'LMG', lane: 'Lane 10' },
      { no: 11, rank: 'LCP', name: 'Muhammad Hafiz Bin Salleh', status: 'Ready', weapon: 'SPIKE SR', lane: 'Lane 11' },
      { no: 12, rank: 'MAJ', name: 'Nur Aisyah Binte Ismail', status: 'Ready', weapon: 'GPMG', lane: 'Lane 12' },
      { no: 13, rank: 'MAJ', name: 'Deepa Krishnan', status: 'Ready', weapon: 'GPMG', lane: 'Lane 13' },
      { no: 14, rank: '1SG', name: 'Rohan Patel', status: 'Ready', weapon: 'GPMG, DRONE', lane: 'Lane 14' },
      { no: 15, rank: 'LCP', name: 'Meera Subramaniam', status: 'Ready', weapon: 'MATADOR', lane: 'Lane 15' },
    ],
  },
  {
    code: 'SWT-02',
    bookingCode: '20260715-SWT-04',
    mode: 'Collective',
    courseware: 'Blockforce Training',
    unit: '41SAB',
    startTime: '01:00 PM',
    endTime: '06:00 PM',
    rows: [
      { no: 1, rank: '2SG', name: 'Deepa Krishnan', status: 'Ready', weapon: 'M203', lane: 'Lane 1' },
      { no: 2, rank: '2SG', name: 'Rohan Patel', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
      { no: 3, rank: 'CPT', name: 'Meera Subramaniam', status: 'Ready', weapon: 'SPIKELR', lane: 'Lane 3' },
      { no: 4, rank: '3SG', name: 'Sanjay Pillai', status: 'Ready', weapon: 'M110, CLAYMORE', lane: 'Lane 4' },
      { no: 5, rank: '3WO', name: 'Nicole Pereira', status: 'Ready', weapon: 'LMG', lane: 'Lane 5' },
      { no: 6, rank: 'CPT', name: 'Marcus Fernandez', status: 'Ready', weapon: 'SAR21', lane: 'Lane 6' },
      { no: 7, rank: '2LT', name: 'Brandon Goh', status: 'Ready', weapon: 'SAR21', lane: 'Lane 7' },
      { no: 8, rank: 'MAJ', name: 'Rachel Lim', status: 'Ready', weapon: 'SAR21, COMD BINO', lane: 'Lane 8' },
      { no: 9, rank: '1WO', name: 'Jason Ong', status: 'Ready', weapon: 'SAR21, DRONE', lane: 'Lane 9' },
      { no: 10, rank: '1SG', name: "Adrian D'Cruz", status: 'Ready', weapon: 'LMG', lane: 'Lane 10' },
      { no: 11, rank: 'LCP', name: 'Chloe Martin', status: 'Ready', weapon: 'SPIKE SR', lane: 'Lane 11' },
      { no: 12, rank: 'MAJ', name: 'Michelle Gomes', status: 'Ready', weapon: 'GPMG', lane: 'Lane 12' },
      { no: 13, rank: 'MAJ', name: "Ashley D'Souza", status: 'Ready', weapon: 'GPMG', lane: 'Lane 13' },
      { no: 14, rank: '1SG', name: 'Daniel Rodrigues', status: 'Ready', weapon: 'GPMG, DRONE', lane: 'Lane 14' },
      { no: 15, rank: 'LCP', name: 'Ethan Pereira', status: 'Ready', weapon: 'MATADOR', lane: 'Lane 15' },
    ],
  },
  {
    code: 'SWT-03',
    courseware: 'M203',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    isLeaderboardCapable: true,
    // Placeholder roster shown while the session is still running — no
    // real roster was supplied for the "not yet ended" state, so this
    // falls back to the same generic list every other layout uses.
    rows: detailList,
    leaderboardRows: [
      { no: 1, rank: '2SG', name: 'Sanjay Pillai', weapon: 'M203', score: '30/30' },
      { no: 2, rank: '2SG', name: 'Aishwarya Nair', weapon: 'M203', score: '30/30' },
      { no: 3, rank: 'CPT', name: 'Harish Chandran', weapon: 'M203', score: '30/30' },
      { no: 4, rank: '3SG', name: "Ashley D'Souza", weapon: 'M203', score: '30/30' },
      { no: 5, rank: '3WO', name: 'Daniel Rodrigues', weapon: 'M203', score: '30/30' },
      { no: 6, rank: 'CPT', name: 'Liew Kai Xin', weapon: 'M203', score: '29/30' },
      { no: 7, rank: '2LT', name: 'Nicole Pereira', weapon: 'M203', score: '29/30' },
      { no: 8, rank: 'MAJ', name: 'Marcus Fernandez', weapon: 'M203', score: '29/30' },
      { no: 9, rank: '1WO', name: 'Toh Wei Jie', weapon: 'M203', score: '29/30' },
      { no: 10, rank: '1SG', name: 'Quek Jun Wei', weapon: 'M203', score: '29/30' },
      { no: 11, rank: 'LCP', name: 'Liew Kai Xin', weapon: 'M203', score: '29/30' },
      { no: 12, rank: 'MAJ', name: 'Nur Aisyah Binte Ismail', weapon: 'M203', score: '28/30' },
      { no: 13, rank: 'MAJ', name: 'Deepa Krishnan', weapon: 'M203', score: '28/30' },
      { no: 14, rank: '1SG', name: 'Melissa Gomes', weapon: 'M203', score: '28/30' },
      { no: 15, rank: 'LCP', name: 'Meera Subramaniam', weapon: 'M203', score: '28/30' },
    ],
  },
  {
    code: 'SWT-04',
    bookingCode: '20260715-SWT-05',
    mode: 'Judgemental',
    courseware: 'Scenario 5',
    unit: '41SAB',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    rows: [
      { no: 1, rank: '3SG', name: 'Low Shi Hui', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
      { no: 2, rank: '3SG', name: 'Liew Kai Xin', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
      { no: 3, rank: 'CPT', name: 'Sim Wen Qi', status: 'Ready', weapon: 'P30', lane: 'Lane 3' },
      { no: 4, rank: '3SG', name: 'Muhammad Amir Bin Rahman', status: 'Ready', weapon: 'P30', lane: 'Lane 4' },
      { no: 5, rank: '3WO', name: 'Muhammad Amir Bin Rahman', status: 'Ready', weapon: 'LMG', lane: 'Lane 5' },
    ],
  },
  {
    code: 'SWT-05',
    bookingCode: '20260715-SWT-05',
    mode: 'Judgemental',
    courseware: 'Scenario 5',
    unit: '41SAB',
    startTime: '01:00 PM',
    endTime: '06:00 PM',
    rows: [
      { no: 1, rank: '2SG', name: 'Tan Wei Ming', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
      { no: 2, rank: '2SG', name: 'Lim Jia Hui', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
      { no: 3, rank: 'CPT', name: 'Lee Kai Wen', status: 'Ready', weapon: 'P30', lane: 'Lane 3' },
      { no: 4, rank: '3SG', name: 'Goh Yi Xuan', status: 'Ready', weapon: 'P30', lane: 'Lane 4' },
      { no: 5, rank: '3WO', name: 'Ng Zheng Hao', status: 'Ready', weapon: 'LMG', lane: 'Lane 5' },
    ],
  },
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
    endTime: '03:00 PM',
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
    endTime: '03:00 PM',
    instructor: 'CPT Darren Lim',
    status: 'Ongoing',
  },
  {
    unit: '10SIR',
    code: '20260715-CTT-03',
    platformType: 'ICV Storm',
    level: 'L3',
    startTime: '08:00 AM',
    endTime: '03:00 PM',
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
    id: 'training-photo',
    hasImage: true,
  },
  {
    id: 'rules',
    title: 'Rules',
    bullets: [
      {
        label: 'Ballistic Compliance',
        text: 'Servicemen must wear issued equipment. They must stay in marked firing lanes.',
      },
      {
        label: 'Firearms Control',
        text: 'Weapons must only be loaded or cleared at designated points under the supervision of a Range Safety Officer.',
      },
      {
        label: 'Protective Gear',
        text: 'Eye and ear protection are strictly mandatory at all times on the range.',
      },
      {
        label: 'Restricted Access',
        text: 'The Singapore Armed Forces (SAF) restricts entry to authorized personnel only. Trespassing constitutes a serious offense.',
      },
      {
        label: 'Identification',
        text: 'Personnel must carry valid identification, such as their SAF 11B, NRIC, or Work Pass.',
      },
    ],
  },
]

// The Notice card (below) is operator-editable at runtime, so it isn't
// part of the static `announcements` list above — this is only the
// default text shown before an operator has typed their own.
export const DEFAULT_NOTICE_TEXT = [
  'Level 3 range closed for maintenance on 21 August, 0800-1200.',
  'New booking slots for September now open at the reception counter.',
].join('\n')
