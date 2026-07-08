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

// Layout 3's three detail groups each run the full 15-trainee roster
// (their own relay of the same range), matching Layout 2's approach.
export const detailGroups = [detailList, detailList, detailList]

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
