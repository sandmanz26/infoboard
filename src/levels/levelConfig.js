// Canonical list of physical "Levels" this infoboard can display. The
// header/switcher only ever show the "Level N" naming — CMT/CTT/SWT are
// the training-programme context behind levels 2-4, kept here so each
// programme's own rules can live in its own file under src/levels/
// without the three ever needing to touch one another.
export const LEVELS = [
  {
    id: 'level-1',
    label: 'Level 1',
    shortCode: null,
    context: 'LOBBY',
    description: 'Lobby — booking list + announcements',
  },
  {
    id: 'level-2',
    label: 'Level 2',
    shortCode: 'L2',
    context: 'CMT',
    description: 'CMT training range infoboard',
  },
  {
    id: 'level-3',
    label: 'Level 3',
    shortCode: 'L3',
    context: 'CTT',
    description: 'CTT training range infoboard',
  },
  {
    id: 'level-4',
    label: 'Level 4',
    shortCode: 'L4',
    context: 'SWT',
    description: 'SWT training range infoboard',
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    shortCode: null,
    context: 'LEADERBOARD',
    description: 'Local + Global weapon training leaderboards',
  },
  {
    id: 'imt-l',
    label: 'IMT_L',
    shortCode: null,
    context: 'IMT_L',
    description: 'Fixed replica of the IMT_L leaderboard reference design',
  },
]

export const LEVEL_ORDER = LEVELS.map((level) => level.id)
