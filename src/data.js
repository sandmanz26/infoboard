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

// The "Leaderboard" floor — its own booking/podium/table content, kept
// separate from `podium`/`leaderboard` above (which stay in use for the
// existing Layouts 1-3 sidebar panel) so tweaking one doesn't affect
// the other.
export const leaderboardFloorInfo = {
  title: 'IMT Training For Unit 1SIR',
  bookingId: '260722-PLC001',
  unitName: '1SIR',
  courseware: 'Day Test For SAR21/M16 BTP',
  weaponType: 'SAR21',
}

export const leaderboardFloorPodium = {
  first: { names: ['3SG Danyial Lizam Bin Mustafa'], score: '20', total: '20', mpi: 'MPI: 1.00 mm' },
  second: { names: ['3SG Mohamad Anuar Bin Kassim'], score: '20', total: '20', mpi: 'MPI: 2.00 mm' },
  third: {
    names: ['3SG Huang Cheng Hao', '3SG Yang Zheng Min', 'REC Guo Guo Qiang'],
    score: '20',
    total: '20',
    mpi: 'MPI: 3.00 mm',
  },
}

// The full local ranking, 1st through 9 — when the podium switcher is on
// (the default), LocalLeaderboardPanel filters the medal (1st-3rd) rows
// back out since the podium above already covers them; with the podium
// hidden, the table shows every rank instead.
export const leaderboardFloorLocalRows = [
  { ranking: '1st', medal: 'gold', rank: '3SG', name: 'Danyial Lizam Bin Mustafa', score: '20 / 20', mpi: '1.00' },
  { ranking: '2nd', medal: 'silver', rank: '3SG', name: 'Mohamad Anuar Bin Kassim', score: '20 / 20', mpi: '2.00' },
  { ranking: '3rd', medal: 'bronze', rank: '3SG', name: 'Huang Cheng Hao', score: '20 / 20', mpi: '3.00' },
  { ranking: '3rd', medal: 'bronze', rank: '3SG', name: 'Yang Zheng Min', score: '20 / 20', mpi: '3.00' },
  { ranking: '3rd', medal: 'bronze', rank: 'REC', name: 'Guo Guo Qiang', score: '20 / 20', mpi: '3.00' },
  { ranking: '4', medal: null, rank: 'REC', name: 'Khairul Azmi Bin Izhar Iskandar', score: '20 / 20', mpi: '5.00' },
  { ranking: '5', medal: null, rank: '3SG', name: 'Law Yong Rui', score: '19 / 20', mpi: '1.00' },
  { ranking: '6', medal: null, rank: 'REC', name: 'Thamizhavel G. Sarangapani', score: '19 / 20', mpi: '2.00' },
  { ranking: '6', medal: null, rank: '3SG', name: 'Kishan Kumar s/o P. Ravindran', score: '19 / 20', mpi: '2.00' },
  { ranking: '7', medal: null, rank: '3SG', name: 'Choong Yi Min', score: '18 / 20', mpi: '2.00' },
  { ranking: '8', medal: null, rank: '3SG', name: 'Kwa Xuan Ming', score: '18 / 20', mpi: '4.00' },
  { ranking: '9', medal: null, rank: 'REC', name: 'Rajesh Gunalan a/l Thanabalan', score: '17 / 20', mpi: '2.00' },
]

// Global panel aggregates across units — no podium, ties are common at
// the top so 1st/2nd/3rd each list every trainee who hit that MPI, not
// just one per medal.
// Kept for the single-courseware sidebar version elsewhere — the
// Leaderboard floor's Global panel now covers 4 courseware at once (see
// leaderboardFloorGlobalCoursewares below) instead of just this one.
export const leaderboardFloorGlobalRows = [
  { ranking: '1st', medal: 'gold', rank: '3SG', name: 'Isabella White', unitName: '1SIR', score: '20 / 20', mpi: '1.00' },
  { ranking: '1st', medal: 'gold', rank: '3SG', name: 'Elijah Lewis', unitName: '1SIR', score: '20 / 20', mpi: '1.00' },
  {
    ranking: '1st',
    medal: 'gold',
    rank: '3SG',
    name: 'Danyial Lizam Bin Mustafa',
    unitName: '1SIR',
    score: '20 / 20',
    mpi: '1.00',
  },
  { ranking: '1st', medal: 'gold', rank: '3SG', name: 'Amelia Adams', unitName: '1SIR', score: '20 / 20', mpi: '1.00' },
  { ranking: '2nd', medal: 'silver', rank: 'REC', name: 'Balaji Sadasivan', unitName: '1SIR', score: '20 / 20', mpi: '2.00' },
  {
    ranking: '2nd',
    medal: 'silver',
    rank: '3SG',
    name: 'Mohamad Anuar Bin Kassim',
    unitName: '1SIR',
    score: '20 / 20',
    mpi: '2.00',
  },
  { ranking: '2nd', medal: 'silver', rank: '3SG', name: 'Alex Adams', unitName: '1SIR', score: '20 / 20', mpi: '2.00' },
  { ranking: '3rd', medal: 'bronze', rank: '3SG', name: 'Huang Cheng Hao', unitName: '1SIR', score: '20 / 20', mpi: '3.00' },
  { ranking: '3rd', medal: 'bronze', rank: '3SG', name: 'Yang Zheng Min', unitName: '1SIR', score: '20 / 20', mpi: '3.00' },
  { ranking: '3rd', medal: 'bronze', rank: 'REC', name: 'Ibrahim Abdul Halim', unitName: '1SIR', score: '20 / 20', mpi: '3.00' },
]

// The Leaderboard floor's Global panel splits into 4 narrower sub-panels,
// one per courseware, instead of one wide table for a single courseware.
export const leaderboardFloorGlobalCoursewares = [
  {
    courseware: 'Day Test For SAR21/M16 BTP',
    weaponType: 'SAR21',
    rows: leaderboardFloorGlobalRows,
  },
  {
    courseware: 'Night Test For SAR21/M16 BTP',
    weaponType: 'SAR21',
    rows: [
      { ranking: '1st', medal: 'gold', rank: '3SG', name: 'Nurul Huda Binte Rashid', unitName: '3SIR', score: '20 / 20', mpi: '1.50' },
      { ranking: '1st', medal: 'gold', rank: 'REC', name: 'Wong Zhi Kai', unitName: '3SIR', score: '20 / 20', mpi: '1.50' },
      { ranking: '2nd', medal: 'silver', rank: '3SG', name: 'Faizal Bin Osman', unitName: '9SIR', score: '19 / 20', mpi: '2.50' },
      { ranking: '2nd', medal: 'silver', rank: 'REC', name: 'Meera Devi', unitName: '3SIR', score: '19 / 20', mpi: '2.50' },
      { ranking: '3rd', medal: 'bronze', rank: 'REC', name: 'Priya Ramasamy', unitName: '9SIR', score: '18 / 20', mpi: '3.50' },
      { ranking: '3rd', medal: 'bronze', rank: '3SG', name: 'Aiman Bin Zulkifli', unitName: '9SIR', score: '18 / 20', mpi: '3.50' },
      { ranking: '4', medal: null, rank: '3SG', name: 'Teo Jia Ming', unitName: '3SIR', score: '17 / 20', mpi: '4.00' },
      { ranking: '5', medal: null, rank: 'REC', name: 'Karthik Selvam', unitName: '9SIR', score: '16 / 20', mpi: '4.50' },
      { ranking: '6', medal: null, rank: '3SG', name: 'Lim Hui Ying', unitName: '3SIR', score: '15 / 20', mpi: '5.00' },
      { ranking: '7', medal: null, rank: 'REC', name: 'Zulkarnain Bin Hassan', unitName: '9SIR', score: '14 / 20', mpi: '5.50' },
    ],
  },
  {
    courseware: 'Day Test For P30/HP BTP',
    weaponType: 'P30',
    rows: [
      { ranking: '1st', medal: 'gold', rank: '3SG', name: 'Marcus Lim Wei Jie', unitName: '2SIR', score: '20 / 20', mpi: '1.00' },
      { ranking: '2nd', medal: 'silver', rank: 'REC', name: 'Hafiz Bin Rahman', unitName: '2SIR', score: '20 / 20', mpi: '2.00' },
      { ranking: '2nd', medal: 'silver', rank: '3SG', name: 'Grace Tan Xin Yi', unitName: '1SIR', score: '20 / 20', mpi: '2.00' },
      { ranking: '3rd', medal: 'bronze', rank: '3SG', name: 'Suresh Kumar', unitName: '1SIR', score: '19 / 20', mpi: '3.00' },
      { ranking: '3rd', medal: 'bronze', rank: 'REC', name: 'Nur Ain Binte Zaini', unitName: '2SIR', score: '19 / 20', mpi: '3.00' },
      { ranking: '4', medal: null, rank: 'REC', name: 'Aishah Binte Yusof', unitName: '2SIR', score: '18 / 20', mpi: '3.50' },
      { ranking: '5', medal: null, rank: '3SG', name: 'Ravi Chandran', unitName: '1SIR', score: '17 / 20', mpi: '4.00' },
      { ranking: '6', medal: null, rank: 'REC', name: 'Lee Jun Hao', unitName: '2SIR', score: '16 / 20', mpi: '4.50' },
      { ranking: '7', medal: null, rank: '3SG', name: 'Farah Diyana Binte Kamal', unitName: '1SIR', score: '15 / 20', mpi: '5.00' },
      { ranking: '8', medal: null, rank: 'REC', name: 'Muthu Kumar', unitName: '2SIR', score: '14 / 20', mpi: '5.50' },
    ],
  },
  {
    courseware: 'Snap Shooting For SAR21',
    weaponType: 'SAR21',
    rows: [
      { ranking: '1st', medal: 'gold', rank: '3SG', name: 'Ryan Chua Kok Wei', unitName: '9SIR', score: '20 / 20', mpi: '1.25' },
      { ranking: '2nd', medal: 'silver', rank: '3SG', name: 'Nadia Zulkifli', unitName: '3SIR', score: '19 / 20', mpi: '2.25' },
      { ranking: '2nd', medal: 'silver', rank: 'REC', name: 'Dinesh Prakash', unitName: '9SIR', score: '19 / 20', mpi: '2.25' },
      { ranking: '3rd', medal: 'bronze', rank: '3SG', name: 'Faridah Binte Salim', unitName: '3SIR', score: '18 / 20', mpi: '3.25' },
      { ranking: '3rd', medal: 'bronze', rank: 'REC', name: 'Vignesh Kumar', unitName: '9SIR', score: '18 / 20', mpi: '3.25' },
      { ranking: '4', medal: null, rank: 'REC', name: 'Jonathan Goh Wei Ming', unitName: '9SIR', score: '17 / 20', mpi: '4.25' },
      { ranking: '5', medal: null, rank: '3SG', name: 'Siti Aminah Binte Rahim', unitName: '3SIR', score: '16 / 20', mpi: '4.75' },
      { ranking: '6', medal: null, rank: 'REC', name: 'Ganesh Balakrishnan', unitName: '9SIR', score: '15 / 20', mpi: '5.25' },
      { ranking: '7', medal: null, rank: '3SG', name: 'Wong Mei Ling', unitName: '3SIR', score: '14 / 20', mpi: '5.75' },
      { ranking: '8', medal: null, rank: 'REC', name: 'Haziq Bin Yaacob', unitName: '9SIR', score: '13 / 20', mpi: '6.25' },
    ],
  },
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
    // SWT-01 is the one station demoing a multi-Detail rotation (Detail
    // 1/2/3, each with its own status) — every other station still just
    // has a flat `rows` list (a single implicit Detail 1).
    details: [
      {
        status: 'Ongoing',
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
        status: 'In Queue',
        rows: [
          { no: 1, rank: 'REC', name: 'Marcus Tan', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
          { no: 2, rank: '2SG', name: 'Priya Nathan', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
          { no: 3, rank: '3SG', name: 'Wong Kai Le', status: 'Ready', weapon: 'M203', lane: 'Lane 3' },
          { no: 4, rank: 'CPT', name: 'Farhan Ismail', status: 'Ready', weapon: 'SPIKELR', lane: 'Lane 4' },
          { no: 5, rank: '2LT', name: 'Xu Wei Ling', status: 'Ready', weapon: 'SAR21', lane: 'Lane 5' },
          { no: 6, rank: 'REC', name: 'Aaron Lim', status: 'Ready', weapon: 'LMG', lane: 'Lane 6' },
          { no: 7, rank: '1SG', name: 'Ganesh Kumar', status: 'Ready', weapon: 'SAR21', lane: 'Lane 7' },
          { no: 8, rank: 'MAJ', name: 'Clara Teo', status: 'Ready', weapon: 'GPMG', lane: 'Lane 8' },
          { no: 9, rank: 'LCP', name: 'Haziq Rahman', status: 'Ready', weapon: 'SAR21, DRONE', lane: 'Lane 9' },
          { no: 10, rank: '3WO', name: 'Serena Goh', status: 'Ready', weapon: 'M110, CLAYMORE', lane: 'Lane 10' },
          { no: 11, rank: '1WO', name: 'Daniel Wong', status: 'Ready', weapon: 'MATADOR', lane: 'Lane 11' },
          { no: 12, rank: '2SG', name: 'Nur Fadhilah', status: 'Ready', weapon: 'SAR21', lane: 'Lane 12' },
          { no: 13, rank: '3SG', name: 'Kevin Ong', status: 'Ready', weapon: 'GPMG, DRONE', lane: 'Lane 13' },
          { no: 14, rank: 'REC', name: 'Amirah Yusof', status: 'Ready', weapon: 'SAR21', lane: 'Lane 14' },
          { no: 15, rank: 'CPT', name: 'Ryan Chua', status: 'Ready', weapon: 'SPIKE SR', lane: 'Lane 15' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Vikram Singh', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
          { no: 2, rank: 'REC', name: 'Michelle Foo', status: 'Ready', weapon: 'M203', lane: 'Lane 2' },
          { no: 3, rank: '3SG', name: 'Aiman Haziq', status: 'Ready', weapon: 'SPIKELR', lane: 'Lane 3' },
          { no: 4, rank: '1SG', name: 'Grace Lau', status: 'Ready', weapon: 'SAR21', lane: 'Lane 4' },
          { no: 5, rank: 'CPT', name: 'Hafiz Osman', status: 'Ready', weapon: 'LMG', lane: 'Lane 5' },
          { no: 6, rank: '2SG', name: 'Wendy Chong', status: 'Ready', weapon: 'SAR21, COMD BINO', lane: 'Lane 6' },
          { no: 7, rank: 'LCP', name: 'Faris Adnan', status: 'Ready', weapon: 'SAR21', lane: 'Lane 7' },
          { no: 8, rank: 'MAJ', name: 'Jasmine Ng', status: 'Ready', weapon: 'GPMG', lane: 'Lane 8' },
          { no: 9, rank: '3WO', name: 'Arun Kumar', status: 'Ready', weapon: 'SAR21, DRONE', lane: 'Lane 9' },
          { no: 10, rank: 'REC', name: 'Kimberly Sim', status: 'Ready', weapon: 'M110, CLAYMORE', lane: 'Lane 10' },
          { no: 11, rank: '1WO', name: 'Zulkifli Rahman', status: 'Ready', weapon: 'MATADOR', lane: 'Lane 11' },
          { no: 12, rank: '2SG', name: 'Natasha Lim', status: 'Ready', weapon: 'SAR21', lane: 'Lane 12' },
          { no: 13, rank: '3SG', name: 'Bilal Hassan', status: 'Ready', weapon: 'GPMG, DRONE', lane: 'Lane 13' },
          { no: 14, rank: 'CPT', name: 'Isabelle Koh', status: 'Ready', weapon: 'SAR21', lane: 'Lane 14' },
          { no: 15, rank: 'REC', name: 'Faisal Ahmad', status: 'Ready', weapon: 'SPIKE SR', lane: 'Lane 15' },
        ],
      },
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
    details: [
      {
        status: 'Ongoing',
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
        status: 'In Queue',
        rows: [
          { no: 1, rank: '3SG', name: 'Aidan Koh', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
          { no: 2, rank: 'REC', name: 'Priya Sundar', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
          { no: 3, rank: '2LT', name: 'Farid Rashid', status: 'Ready', weapon: 'M203', lane: 'Lane 3' },
          { no: 4, rank: 'CPT', name: 'Michelle Tan', status: 'Ready', weapon: 'SPIKELR', lane: 'Lane 4' },
          { no: 5, rank: '1SG', name: 'Kavitha Rao', status: 'Ready', weapon: 'LMG', lane: 'Lane 5' },
          { no: 6, rank: 'MAJ', name: 'Samuel Ong', status: 'Ready', weapon: 'SAR21', lane: 'Lane 6' },
          { no: 7, rank: '3WO', name: 'Nurul Izzah', status: 'Ready', weapon: 'SAR21, COMD BINO', lane: 'Lane 7' },
          { no: 8, rank: 'LCP', name: 'Wei Jian Sim', status: 'Ready', weapon: 'SAR21, DRONE', lane: 'Lane 8' },
          { no: 9, rank: '1WO', name: 'Rachel Yeo', status: 'Ready', weapon: 'M110, CLAYMORE', lane: 'Lane 9' },
          { no: 10, rank: '2SG', name: 'Bala Krishnan', status: 'Ready', weapon: 'MATADOR', lane: 'Lane 10' },
          { no: 11, rank: 'REC', name: 'Charlotte Wee', status: 'Ready', weapon: 'SAR21', lane: 'Lane 11' },
          { no: 12, rank: '3SG', name: 'Haziq Aiman', status: 'Ready', weapon: 'GPMG', lane: 'Lane 12' },
          { no: 13, rank: 'CPT', name: 'Diana Loh', status: 'Ready', weapon: 'GPMG, DRONE', lane: 'Lane 13' },
          { no: 14, rank: '1SG', name: 'Faizal Rahim', status: 'Ready', weapon: 'SAR21', lane: 'Lane 14' },
          { no: 15, rank: 'LCP', name: 'Yasmin Begum', status: 'Ready', weapon: 'SPIKE SR', lane: 'Lane 15' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Timothy Ang', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
          { no: 2, rank: 'REC', name: 'Suria Devi', status: 'Ready', weapon: 'M203', lane: 'Lane 2' },
          { no: 3, rank: '3SG', name: 'Jonathan Koh', status: 'Ready', weapon: 'SPIKELR', lane: 'Lane 3' },
          { no: 4, rank: '1SG', name: 'Amanda Chia', status: 'Ready', weapon: 'SAR21', lane: 'Lane 4' },
          { no: 5, rank: 'CPT', name: 'Ridzwan Hamid', status: 'Ready', weapon: 'LMG', lane: 'Lane 5' },
          { no: 6, rank: '2SG', name: 'Hazel Tan', status: 'Ready', weapon: 'SAR21, COMD BINO', lane: 'Lane 6' },
          { no: 7, rank: 'LCP', name: 'Danish Iskandar', status: 'Ready', weapon: 'SAR21', lane: 'Lane 7' },
          { no: 8, rank: 'MAJ', name: 'Genevieve Foo', status: 'Ready', weapon: 'GPMG', lane: 'Lane 8' },
          { no: 9, rank: '3WO', name: 'Arif Zulkarnain', status: 'Ready', weapon: 'SAR21, DRONE', lane: 'Lane 9' },
          { no: 10, rank: 'REC', name: 'Michelle Ong', status: 'Ready', weapon: 'M110, CLAYMORE', lane: 'Lane 10' },
          { no: 11, rank: '1WO', name: 'Kumaran Suresh', status: 'Ready', weapon: 'MATADOR', lane: 'Lane 11' },
          { no: 12, rank: '2SG', name: 'Farah Liyana', status: 'Ready', weapon: 'SAR21', lane: 'Lane 12' },
          { no: 13, rank: '3SG', name: 'Benjamin Teo', status: 'Ready', weapon: 'GPMG, DRONE', lane: 'Lane 13' },
          { no: 14, rank: 'CPT', name: 'Nadia Aziz', status: 'Ready', weapon: 'SAR21', lane: 'Lane 14' },
          { no: 15, rank: 'REC', name: 'Justin Lau', status: 'Ready', weapon: 'SPIKE SR', lane: 'Lane 15' },
        ],
      },
    ],
  },
  {
    code: 'SWT-03',
    courseware: 'M203',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    isLeaderboardCapable: true,
    // Placeholder rosters shown while the session is still running — no
    // real roster was supplied for the "not yet ended" state, so Detail 1
    // falls back to the same generic list every other layout uses.
    details: [
      { status: 'Ongoing', rows: detailList },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '3SG', name: 'Wong Zhi Yang', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
          { no: 2, rank: 'REC', name: 'Kavya Menon', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
          { no: 3, rank: '2LT', name: 'Shafiq Adnan', status: 'Ready', weapon: 'SAR21', lane: 'Lane 3' },
          { no: 4, rank: '1SG', name: 'Belinda Chan', status: 'Ready', weapon: 'SAR21', lane: 'Lane 4' },
          { no: 5, rank: 'CPT', name: 'Ryan Selvaraj', status: 'Ready', weapon: 'SAR21', lane: 'Lane 5' },
          { no: 6, rank: '3SG', name: 'Nur Shafiqah', status: 'Ready', weapon: 'SAR21', lane: 'Lane 6' },
          { no: 7, rank: 'REC', name: 'Marcus Yeo', status: 'Ready', weapon: 'SAR21', lane: 'Lane 7' },
          { no: 8, rank: 'MAJ', name: 'Preeti Sharma', status: 'Ready', weapon: 'SAR21', lane: 'Lane 8' },
          { no: 9, rank: '3WO', name: 'Dylan Ng', status: 'Ready', weapon: 'SAR21', lane: 'Lane 9' },
          { no: 10, rank: '1WO', name: 'Hafizah Rosli', status: 'Ready', weapon: 'SAR21', lane: 'Lane 10' },
          { no: 11, rank: 'LCP', name: 'Kenji Tanaka', status: 'Ready', weapon: 'SAR21', lane: 'Lane 11' },
          { no: 12, rank: '2SG', name: 'Alicia Goh', status: 'Ready', weapon: 'SAR21', lane: 'Lane 12' },
          { no: 13, rank: '3SG', name: 'Firdaus Rahman', status: 'Ready', weapon: 'SAR21', lane: 'Lane 13' },
          { no: 14, rank: 'REC', name: 'Michelle Koh', status: 'Ready', weapon: 'SAR21', lane: 'Lane 14' },
          { no: 15, rank: 'CPT', name: 'Aaron Lim', status: 'Ready', weapon: 'SAR21', lane: 'Lane 15' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2SG', name: 'Farhana Yusof', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
          { no: 2, rank: 'REC', name: 'Bryan Chua', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
          { no: 3, rank: '3SG', name: 'Ismail Hakim', status: 'Ready', weapon: 'SAR21', lane: 'Lane 3' },
          { no: 4, rank: 'CPT', name: 'Wendy Ho', status: 'Ready', weapon: 'SAR21', lane: 'Lane 4' },
          { no: 5, rank: '1SG', name: 'Vishal Kumar', status: 'Ready', weapon: 'SAR21', lane: 'Lane 5' },
          { no: 6, rank: '3WO', name: 'Grace Tan', status: 'Ready', weapon: 'SAR21', lane: 'Lane 6' },
          { no: 7, rank: 'REC', name: 'Amirul Haziq', status: 'Ready', weapon: 'SAR21', lane: 'Lane 7' },
          { no: 8, rank: 'MAJ', name: 'Denise Lau', status: 'Ready', weapon: 'SAR21', lane: 'Lane 8' },
          { no: 9, rank: '2LT', name: 'Farhan Roslan', status: 'Ready', weapon: 'SAR21', lane: 'Lane 9' },
          { no: 10, rank: '1WO', name: 'Michelle Sim', status: 'Ready', weapon: 'SAR21', lane: 'Lane 10' },
          { no: 11, rank: 'LCP', name: 'Kelvin Ong', status: 'Ready', weapon: 'SAR21', lane: 'Lane 11' },
          { no: 12, rank: '2SG', name: 'Nabilah Rahman', status: 'Ready', weapon: 'SAR21', lane: 'Lane 12' },
          { no: 13, rank: '3SG', name: 'Timothy Goh', status: 'Ready', weapon: 'SAR21', lane: 'Lane 13' },
          { no: 14, rank: 'REC', name: 'Aishah Zainal', status: 'Ready', weapon: 'SAR21', lane: 'Lane 14' },
          { no: 15, rank: 'CPT', name: 'Marcus Teo', status: 'Ready', weapon: 'SAR21', lane: 'Lane 15' },
        ],
      },
    ],
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
    unit: '41SAR',
    startTime: '08:00 AM',
    endTime: '04:00 PM',
    details: [
      {
        status: 'Ongoing',
        rows: [
          { no: 1, rank: '3SG', name: 'Low Shi Hui', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
          { no: 2, rank: '3SG', name: 'Liew Kai Xin', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
          { no: 3, rank: 'CPT', name: 'Sim Wen Qi', status: 'Ready', weapon: 'P30', lane: 'Lane 3' },
          { no: 4, rank: '3SG', name: 'Muhammad Amir Bin Rahman', status: 'Ready', weapon: 'P30', lane: 'Lane 4' },
          { no: 5, rank: '3WO', name: 'Muhammad Amir Bin Rahman', status: 'Ready', weapon: 'LMG', lane: 'Lane 5' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2SG', name: 'Nathaniel Chua', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
          { no: 2, rank: 'REC', name: 'Farah Iskandar', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
          { no: 3, rank: '3SG', name: 'Praveen Kumar', status: 'Ready', weapon: 'P30', lane: 'Lane 3' },
          { no: 4, rank: 'CPT', name: 'Michelle Lau', status: 'Ready', weapon: 'P30', lane: 'Lane 4' },
          { no: 5, rank: '1WO', name: 'Zack Wong', status: 'Ready', weapon: 'LMG', lane: 'Lane 5' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '3SG', name: 'Aidil Hakim', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
          { no: 2, rank: 'REC', name: 'Clara Sim', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
          { no: 3, rank: '2LT', name: 'Farid Osman', status: 'Ready', weapon: 'P30', lane: 'Lane 3' },
          { no: 4, rank: 'MAJ', name: 'Wendy Chua', status: 'Ready', weapon: 'P30', lane: 'Lane 4' },
          { no: 5, rank: '3WO', name: 'Kumar Selvam', status: 'Ready', weapon: 'LMG', lane: 'Lane 5' },
        ],
      },
    ],
  },
  {
    code: 'SWT-05',
    bookingCode: '20260715-SWT-05',
    mode: 'Judgemental',
    courseware: 'Scenario 5',
    unit: '41SAR',
    startTime: '01:00 PM',
    endTime: '06:00 PM',
    details: [
      {
        status: 'Ongoing',
        rows: [
          { no: 1, rank: '2SG', name: 'Tan Wei Ming', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
          { no: 2, rank: '2SG', name: 'Lim Jia Hui', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
          { no: 3, rank: 'CPT', name: 'Lee Kai Wen', status: 'Ready', weapon: 'P30', lane: 'Lane 3' },
          { no: 4, rank: '3SG', name: 'Goh Yi Xuan', status: 'Ready', weapon: 'P30', lane: 'Lane 4' },
          { no: 5, rank: '3WO', name: 'Ng Zheng Hao', status: 'Ready', weapon: 'LMG', lane: 'Lane 5' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2SG', name: 'Isaac Teo', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
          { no: 2, rank: 'REC', name: 'Aishwarya Pillai', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
          { no: 3, rank: 'CPT', name: 'Farhan Aziz', status: 'Ready', weapon: 'P30', lane: 'Lane 3' },
          { no: 4, rank: '3SG', name: 'Michelle Rodrigues', status: 'Ready', weapon: 'P30', lane: 'Lane 4' },
          { no: 5, rank: '3WO', name: 'Daniel Koh', status: 'Ready', weapon: 'LMG', lane: 'Lane 5' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '3SG', name: 'Bella Wong', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
          { no: 2, rank: 'REC', name: 'Haziq Rahman', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
          { no: 3, rank: '2LT', name: 'Priya Nathan', status: 'Ready', weapon: 'P30', lane: 'Lane 3' },
          { no: 4, rank: 'CPT', name: 'Samuel Ong', status: 'Ready', weapon: 'P30', lane: 'Lane 4' },
          { no: 5, rank: '1WO', name: 'Nur Amalina', status: 'Ready', weapon: 'LMG', lane: 'Lane 5' },
        ],
      },
    ],
  },
]

// Level 2 (CMT) + Layout 5 — 11 physical cabins. Unlike SWT's roster
// (Rank/Name/Weapon/Lane), CMT trains vehicle crews so each trainee has
// a crew Role instead (VC/VO/PC/SC/SO) and there's no Weapon/Lane at all.
// `cmtStationColumns` groups the 11 codes into the 5 physical columns
// they actually sit in on the floor — columns 1-3 stack 3 cabins each,
// columns 4-5 have just one — so the on-screen grid matches the real
// layout instead of an even 11-into-5 auto-wrap.
export const cmtStationColumns = [
  ['CMT-01', 'CMT-02', 'CMT-03'],
  ['CMT-04', 'CMT-05', 'CMT-06'],
  ['CMT-07', 'CMT-08', 'CMT-09'],
  ['CMT-10'],
  ['CMT-11'],
]

export const cmtStations = [
  {
    code: 'CMT-01',
    bookingCode: '20260715-CMT-01, 2SIR',
    platformType: 'Terrex 50HMG',
    startTime: '08:00 AM',
    endTime: '03:00 PM',
    // Like SWT-03 on Level 4 — this cabin can toggle into a Session
    // Leaderboard via its own switcher instead of showing its normal
    // Detail rotation.
    isLeaderboardCapable: true,
    leaderboardRows: [
      { no: 1, rank: '2LT', name: 'Tan Wei Ming', score: '80' },
      { no: 2, rank: 'LCP', name: 'Divya Menon', score: '90' },
      { no: 3, rank: 'MAJ', name: 'Ong Jun Hao', score: '100' },
      { no: 4, rank: '1SG', name: 'Lee Kai Wen', score: '50' },
      { no: 5, rank: '3SG', name: 'Siti Nur Afiqah Binte Omar', score: '44' },
    ],
    details: [
      {
        status: 'Ongoing',
        rows: [
          { no: 1, rank: '2LT', name: 'Aiman Haziq', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Farah Iskandar', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Praveen Kumar', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Michelle Lau', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Zack Wong', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Bella Wong', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Haziq Rahman', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Priya Nathan', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Samuel Ong', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Nur Amalina', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Vikram Singh', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Michelle Foo', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Ismail Hakim', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Wendy Ho', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Vishal Kumar', role: 'SO' },
        ],
      },
    ],
  },
  {
    code: 'CMT-02',
    bookingCode: '20260715-CMT-01, 2SIR',
    platformType: 'Terrex 50HMG',
    startTime: '08:00 AM',
    endTime: '03:00 PM',
    details: [
      {
        status: 'Ongoing',
        rows: [
          { no: 1, rank: '2LT', name: 'Marcus Tan', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Wong Kai Le', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Clara Teo', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Ganesh Kumar', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Serena Goh', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Nur Aisyah Binte Ismail', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Rahul Sharma', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Ryan Fernandez', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Ong Jun Hao', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Ahmad Firdaus Bin Rashid', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Kevin Ong', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Amirah Yusof', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Ryan Chua', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Grace Lau', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Ridzwan Hamid', role: 'SO' },
        ],
      },
    ],
  },
  {
    code: 'CMT-03',
    bookingCode: '20260715-CMT-01, 2SIR',
    platformType: 'Terrex 50HMG',
    startTime: '08:00 AM',
    endTime: '03:00 PM',
    isLeaderboardCapable: true,
    leaderboardRows: [
      { no: 1, rank: '2LT', name: 'Kavitha Devi', score: '80' },
      { no: 2, rank: 'LCP', name: 'Chloe Martin', score: '90' },
      { no: 3, rank: 'MAJ', name: 'Lee Kai Wen', score: '100' },
      { no: 4, rank: '1SG', name: 'Danish Bin Zulkifli', score: '50' },
      { no: 5, rank: '3SG', name: 'Vikram Menon', score: '44' },
    ],
    details: [
      {
        status: 'Ongoing',
        rows: [
          { no: 1, rank: '2LT', name: 'Hazel Tan', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Danish Iskandar', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Genevieve Foo', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Arif Zulkarnain', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Kumaran Suresh', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Farah Liyana', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Benjamin Teo', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Nadia Aziz', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Justin Lau', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Timothy Ang', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Suria Devi', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Jonathan Koh', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Amanda Chia', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Michelle Ong', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Kelvin Ong', role: 'SO' },
        ],
      },
    ],
  },
  {
    code: 'CMT-04',
    bookingCode: '20260715-CMT-01, 2SIR',
    platformType: 'Terrex 40 AGL',
    startTime: '08:00 AM',
    endTime: '03:00 PM',
    details: [
      {
        status: 'Ongoing',
        rows: [
          { no: 1, rank: '2LT', name: 'Michelle Gomes', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Goh Yi Xuan', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Syafiq Bin Hassan', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Arjun Kumar', role: 'SC' },
          { no: 5, rank: '3SG', name: "Adrian D'Cruz", role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Farhana Yusof', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Bryan Chua', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Ismail Hakim', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Wendy Ho', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Grace Tan', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Amirul Haziq', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Denise Lau', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Farhan Roslan', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Michelle Sim', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Kelvin Ong', role: 'SO' },
        ],
      },
    ],
  },
  {
    code: 'CMT-05',
    bookingCode: '20260715-CMT-01, 2SIR',
    platformType: 'Terrex 40 AGL',
    startTime: '08:00 AM',
    endTime: '03:00 PM',
    details: [
      {
        status: 'Ongoing',
        rows: [
          { no: 1, rank: '2LT', name: 'Nathaniel Chua', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Farah Iskandar', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Praveen Kumar', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Michelle Lau', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Zack Wong', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Ng Zheng Hao', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Nurul Huda Binte Hamid', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Ananya Iyer', role: 'TC' },
          { no: 4, rank: '1SG', name: "Ashley D'Souza", role: 'SC' },
          { no: 5, rank: '3SG', name: 'Chua Pei Ling', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Aidil Hakim', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Clara Sim', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Farid Osman', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Wendy Chua', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Kumar Selvam', role: 'SO' },
        ],
      },
    ],
  },
  {
    code: 'CMT-06',
    // No booking for this cabin today — header only, no info/detail.
    noBooking: true,
  },
  {
    code: 'CMT-07',
    bookingCode: '20260715-CMT-03, 42SAR',
    platformType: 'Terrex 40 AGL',
    startTime: '08:00 AM',
    endTime: '06:00 PM',
    details: [
      {
        status: 'Ongoing',
        rows: [
          { no: 1, rank: '2LT', name: 'Meera Subramaniam', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Joel Ang Chong Boon', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Teo Jia En', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Haziq Bin Noor', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Ashwin Kumar', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Isaac Teo', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Aishwarya Pillai', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Farhan Aziz', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Michelle Rodrigues', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Daniel Koh', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Farid Rashid', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Suria Devi', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Ridzwan Hamid', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Jasmine Ng', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Dylan Ng', role: 'SO' },
        ],
      },
    ],
  },
  {
    code: 'CMT-08',
    noBooking: true,
  },
  {
    code: 'CMT-09',
    bookingCode: '20260715-CMT-03, 42SAR',
    platformType: 'Terrex 40 AGL',
    startTime: '08:00 AM',
    endTime: '06:00 PM',
    details: [
      {
        status: 'Ongoing',
        rows: [
          { no: 1, rank: '2LT', name: 'Chew Hui Min', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Aqilah Binte Ibrahim', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Sanjay Pillai', role: 'TC' },
          { no: 4, rank: '1SG', name: "Julian D'Silva", role: 'SC' },
          { no: 5, rank: '3SG', name: 'Yeo Jun Kai', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Bilal Hassan', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Isabelle Koh', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Faisal Ahmad', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Wong Zhi Yang', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Kavya Menon', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Shafiq Adnan', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Belinda Chan', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Ryan Selvaraj', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Nur Shafiqah', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Marcus Yeo', role: 'SO' },
        ],
      },
    ],
  },
  {
    code: 'CMT-10',
    bookingCode: '20260715-CMT-03, 42SAR',
    platformType: 'Terrex 40 AGL',
    startTime: '08:00 AM',
    endTime: '06:00 PM',
    details: [
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Preeti Sharma', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Dylan Ng', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Hafizah Rosli', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Kenji Tanaka', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Alicia Goh', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Muhammad Hafiz Bin Salleh', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Harish Chandran', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Sarah Rodrigues', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Seah Yu Ting', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Nabilah Binte Yusof', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Firdaus Rahman', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Michelle Koh', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Aaron Lim', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Farhana Yusof', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Bryan Chua', role: 'SO' },
        ],
      },
    ],
  },
  {
    code: 'CMT-11',
    bookingCode: '20260715-CMT-03, 42SAR',
    platformType: 'Terrex 40 AGL',
    startTime: '08:00 AM',
    endTime: '06:00 PM',
    details: [
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Ismail Hakim', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Wendy Ho', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Vishal Kumar', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Grace Tan', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Amirul Haziq', role: 'SO' },
        ],
      },
      {
        status: 'In Queue',
        rows: [
          { no: 1, rank: '2LT', name: 'Denise Lau', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Farhan Roslan', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Michelle Sim', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Kelvin Ong', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Nabilah Rahman', role: 'SO' },
        ],
      },
      {
        status: 'Ongoing',
        rows: [
          { no: 1, rank: '2LT', name: 'Lakshmi Narayanan', role: 'VC' },
          { no: 2, rank: 'LCP', name: 'Joshua Pereira', role: 'VO' },
          { no: 3, rank: 'MAJ', name: 'Chan Zi Xuan', role: 'TC' },
          { no: 4, rank: '1SG', name: 'Aiman Bin Roslan', role: 'SC' },
          { no: 5, rank: '3SG', name: 'Vivek Raman', role: 'SO' },
        ],
      },
    ],
  },
]

// Level 3 (CTT) + Layout 5 — grouped into physical Zones (Zone A, Zone B,
// Zone C, Zone D1, Zone D2) instead of one flat station list, matching
// the real floor's separate training bays. Only Zone A and Zone D1 have
// real per-station data so far (from the source spreadsheet) — the other
// three exist in `cttZones` for the Directory floor plan but have no
// stations yet, and simply won't appear in the Active Zone switcher until
// they do.
//
// CTT crews run 4 to a cabin (2LT/LCP/MAJ/1SG, roles VO/VC/TC/SO — no SC),
// one fewer than CMT's 5. Each cabin's Detail 1/Detail 2 group can
// independently be a "Session Leaderboard" (Score column, scored once
// that detail's session is live/done) or "(Ready)" (Role column, the next
// group waiting to be called to their cabin) — driven directly by each
// detail's `status`, unlike CMT/SWT where the Leaderboard is a separate
// per-station switcher layered on top of the normal Ongoing/In Queue
// rotation. Which detail a station currently shows on load is still
// controlled by the existing per-station Start Detail switcher.
const CTT_ROSTER_LEADERBOARD_A = [
  { no: 1, rank: '2LT', name: 'Tan Wei Ming', score: '80/100' },
  { no: 2, rank: 'LCP', name: 'Divya Menon', score: '90/100' },
  { no: 3, rank: 'MAJ', name: 'Ong Jun Hao', score: '100/100' },
  { no: 4, rank: '1SG', name: 'Lee Kai Wen', score: '50/100' },
]
const CTT_ROSTER_READY_B = [
  { no: 1, rank: '2LT', name: 'Nur Aisyah Binte Ismail', role: 'VO' },
  { no: 2, rank: 'LCP', name: 'Rahul Sharma', role: 'VC' },
  { no: 3, rank: 'MAJ', name: 'Ryan Fernandez', role: 'TC' },
  { no: 4, rank: '1SG', name: 'Ong Jun Hao', role: 'SO' },
]
const CTT_ROSTER_LEADERBOARD_C = [
  { no: 1, rank: '2LT', name: 'Kavitha Devi', score: '75/100' },
  { no: 2, rank: 'LCP', name: 'Chloe Martin', score: '85/100' },
  { no: 3, rank: 'MAJ', name: 'Lee Kai Wen', score: '95/100' },
  { no: 4, rank: '1SG', name: 'Danish Bin Zulkifli', score: '45/100' },
]
const CTT_DETAIL_LEADERBOARD_A = { status: 'Session Leaderboard', rows: CTT_ROSTER_LEADERBOARD_A }
const CTT_DETAIL_READY_B = { status: '(Ready)', rows: CTT_ROSTER_READY_B }
const CTT_DETAIL_LEADERBOARD_C = { status: 'Session Leaderboard', rows: CTT_ROSTER_LEADERBOARD_C }

function cttStation(code, detail1, detail2) {
  return {
    code,
    bookingCode: '20260715-CMT-01, 2SIR',
    platformType: 'Terrex 50HMG',
    startTime: '08:00 AM',
    endTime: '03:00 PM',
    details: [detail1, detail2],
  }
}

export const cttZones = [
  { id: 'zone-a', label: 'Zone A' },
  { id: 'zone-b', label: 'Zone B' },
  { id: 'zone-c', label: 'Zone C' },
  { id: 'zone-d1', label: 'Zone D1' },
  { id: 'zone-d2', label: 'Zone D2' },
]

// Same idea as cmtStationColumns — each zone's cabins grouped into the
// physical columns they actually sit in on the floor.
export const cttStationColumnsByZone = {
  'zone-a': [
    ['A01', 'A02', 'A03', 'A04'],
    ['A05', 'A06', 'A07', 'A08'],
    ['A09', 'A10', 'A11', 'A12'],
  ],
  'zone-d1': [
    ['D01', 'D02', 'D03', 'D04'],
    ['D05', 'D06', 'D07', 'D08'],
    ['D09', 'D10', 'D11', 'D12'],
    ['D13'],
  ],
}

export const cttStations = [
  // Zone A
  cttStation('A01', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('A02', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('A03', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('A04', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('A05', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('A06', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('A07', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('A08', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('A09', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_LEADERBOARD_C),
  cttStation('A10', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_LEADERBOARD_C),
  cttStation('A11', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_LEADERBOARD_C),
  cttStation('A12', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_LEADERBOARD_C),
  // Zone D1
  cttStation('D01', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('D02', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('D03', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('D04', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('D05', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('D06', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('D07', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('D08', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
  cttStation('D09', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_LEADERBOARD_C),
  cttStation('D10', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_LEADERBOARD_C),
  cttStation('D11', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_LEADERBOARD_C),
  cttStation('D12', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_LEADERBOARD_C),
  cttStation('D13', CTT_DETAIL_LEADERBOARD_A, CTT_DETAIL_READY_B),
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
