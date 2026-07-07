export const detailList = [
  { no: 1, rank: '3SG', name: 'Raj Kumar ...', status: 'Ready', weapon: 'SAR21', lane: 'Lane 1' },
  { no: 2, rank: 'REC', name: 'Ashvin Nair...', status: 'Ready', weapon: 'SAR21', lane: 'Lane 2' },
  { no: 3, rank: '3SG', name: 'Leung Kai F...', status: 'Ready', weapon: 'SAR21', lane: 'Lane 3' },
  { no: 4, rank: 'REC', name: 'Lin Zheng ...', status: 'Ready', weapon: 'SAR21', lane: 'Lane 4' },
  { no: 5, rank: '3SG', name: 'Yang Zhen...', status: 'Ready', weapon: 'SAR21', lane: 'Lane 5' },
  { no: 6, rank: '3SG', name: 'Huang Che...', status: 'Ready', weapon: 'SAR21', lane: 'Lane 6' },
  { no: 7, rank: 'REC', name: 'Beh Ming De', status: 'Ready', weapon: 'SAR21', lane: 'Lane 7' },
  { no: 8, rank: 'REC', name: 'Say Wen Kai', status: 'Ready', weapon: 'SAR21', lane: 'Lane 8' },
  { no: 9, rank: '3SG', name: 'Wu Zheng ...', status: 'Ready', weapon: 'SAR21', lane: 'Lane 9' },
  { no: 10, rank: 'REC', name: 'Thamizhav...', status: 'Ready', weapon: 'SAR21', lane: 'Lane 10' },
  { no: 11, rank: '3SG', name: 'Chong Wei L...', status: 'Ready', weapon: 'SAR21', lane: 'Lane 11' },
  { no: 12, rank: 'REC', name: 'Farah Aziz...', status: 'Ready', weapon: 'SAR21', lane: 'Lane 12' },
  { no: 13, rank: '3SG', name: 'Koh Zhi H...', status: 'Ready', weapon: 'SAR21', lane: 'Lane 13' },
  { no: 14, rank: 'REC', name: 'Tan Jun W...', status: 'Ready', weapon: 'SAR21', lane: 'Lane 14' },
  { no: 15, rank: '3SG', name: 'Ng Wei Xu...', status: 'Ready', weapon: 'SAR21', lane: 'Lane 15' },
]

// Splits the roster into distinct groups (one per detail) instead of
// repeating the full list in every panel, and renumbers lanes within
// each group so no trainee/lane pair appears twice on screen.
function splitIntoGroups(rows, sizes) {
  const groups = []
  let start = 0
  for (const size of sizes) {
    groups.push(
      rows.slice(start, start + size).map((row, i) => ({
        ...row,
        no: i + 1,
        lane: `Lane ${i + 1}`,
      }))
    )
    start += size
  }
  return groups
}

// Full roster capacity is 15 trainees, split evenly across 3 details.
export const detailGroups = splitIntoGroups(detailList, [5, 5, 5])

export const podium = {
  first: { names: ['3SG Liu Shu Qi'], score: '20', total: '20', mpi: 'MPI: 2.00 mm' },
  second: { names: ['REC Guo Guo Qiang', '3SG Muhamad Hj ...'], score: '20', total: '20', mpi: 'MPI: 3.00 mm' },
  third: { names: ['REC Lu Ling Hui'], score: '17', total: '20', mpi: 'MPI: 5.00 mm' },
}

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
]
