# Infoboard — Full Technical Handoff

This document is a complete recap of this repo's logic, terminology, and
architecture, written so a new session (a different Claude account, or a
human) can continue work with **zero prior context**. It documents what the
code does *now* and *why*, not a chronological diff — use `git log --oneline`
for history. Written at a point where the previous session's context was
nearly exhausted, so it errs on the side of over-explaining.

Repo: `sandmanz26/infoboard` — branch `claude/frontend-duplication-9a77fl`.
Deployed on Vercel, auto-deploys from this branch. Frontend-only React 18 +
Vite app — **no backend, no API, no database**. Every piece of displayed data
is a JS literal in `src/data.js`. "Live" data updates in this app mean
`localStorage` + timers simulating real-time behavior, not a real feed.

```bash
npm install
npm run dev        # dev server, hot reload
npm run build       # production build -> dist/
npm run preview     # serve the built dist/ — used for verification (see below)
```

---

## Part 0 — Domain vocabulary (read this first)

The app simulates a **TRMS** (Training Resource Management System) — LCD
signage boards at a military training facility. These terms recur constantly
in both the code and in the user's requests (often in Bahasa Indonesia) —
knowing them prevents misreading a request:

| Term | Meaning |
|---|---|
| **Level** | One physical floor / one physical LCD screen. There are 4: Level 1 (Lobby), Level 2 (CMT), Level 3 (CTT), Level 4 (SWT). Selected via the "Level" switcher. In code: `level` state, values `'level-1'`..`'level-4'`. |
| **Layout** | A *visual arrangement* of whatever level's data — independent of Level. 5 exist (`Layout 1`..`Layout 5`). Selectable for levels 2-4 (Level 1/Lobby has no Layout concept, it's one fixed view). In code: `layout` state, values `'layout-1'`..`'layout-5'`. |
| **CMT** | Company Tactical Mission Trainer — Level 2. Vehicle-crew training (Terrex vehicles). Cabins have a crew **Role** (VC/VO/PC/SC/SO), not a weapon. |
| **CTT** | Company Tactical Trainer — Level 3. Currently uses a shared placeholder roster (no real per-station data was ever supplied for this level — out of scope so far). |
| **SWT** | Specialized Weapon Trainer — Level 4. Firing-range training. Stations have Weapon + Lane per trainee. |
| **Station** (SWT) / **Cabin** (CMT) | One bookable physical bay on the range floor — SWT-01..SWT-05, CMT-01..CMT-11. Each renders as one card in Layout 5. |
| **Booking** | One scheduled training session at a station/cabin — has a start/end time, a unit, an instructor, a status. Shown as one row in Level 1's booking table, or as the top info on a Layout 5 card. |
| **Detail** (as in "Detail 1", "Detail 2") | One *sub-session* / rotation group within a single station's booking — e.g. "Detail 1" might be the currently-Ongoing group of trainees, "Detail 2" the next group queued up. A station's card cycles through its Details over time. Not to be confused with "detail" as a generic English word — in this codebase capital-D "Detail N" always means this specific domain concept. |
| **Data Count** | The pattern controlling how many rows of a Detail group show at once before flipping to the rest — `"10-5"` (10 then remaining 5), `"15"` (all at once, no flip), `"5-5-5"` (5, then next 5, then next 5). |
| **Start Detail** | Per-station setting for which Detail number a station's rotation *begins* on when the page loads, instead of always Detail 1. |
| **Session Leaderboard** (SWT) / **Global Leaderboard** (also SWT, same thing) | A special alternate view for specific stations (SWT-03, CMT-01, CMT-03) — instead of a normal trainee roster, shows a ranked scoreboard (Rank/Name/Score). Toggled by an "Ongoing"/"Ended" switcher per station. "Ended" means the session has ended and the board should now show final rankings. |
| **Rank** | Military rank abbreviation (2LT, 3SG, MAJ, REC, etc.) — a column in every trainee table, not related to "ranking" in a leaderboard sense (that's called Score there). |
| **Role** (CMT only) | Vehicle crew position: VC (Vehicle Commander), VO (Vehicle Operator... actually treat these as opaque 2-letter codes — the exact meaning was never specified, just reproduce the abbreviations as given: VC/VO/PC/SC/SO), one per trainee row. |
| **Lane** (SWT only) | Firing lane number assigned to a trainee — a column in SWT's trainee table, narrow, center-aligned, shows just the number (the literal word "Lane" is stripped from the cell text, kept only in the column header). |
| **Weapon** (SWT only) | Weapon(s) assigned to a trainee — can be multiple, comma-separated in source data, rendered as stacked lines (`\n`-joined) in the table. |
| **Unit** | A military unit code (e.g. `41SAB`, `2SIR`) — appears both in Level 1's booking table (its own column) and on each Layout 5 SWT card (its own line above the Detail title). |
| **Booking ID / Booking Code** | The literal code string like `20260715-SWT-04` or `20260715-CMT-01, 2SIR` — shown top-right of a station's card header, and as its own column in Level 1's table. |
| **Directory** | The floor-plan diagram shown under the Layout 5 station cards — different implementations per level (see Directory section below). |
| **Flip / Rotation** | The periodic automatic change of displayed content (advancing to the next Detail, or the next page within a Detail). Driven by a single shared timer (`flipTick`) for the whole Layout 5 screen — see the Synchronized Flip section. |
| **Controls panel** | The draggable floating panel (bottom-right "Controls" button) exposing every switcher. Implemented by `LayoutSwitcher.jsx`, fed by the `switcherGroups` array assembled at the bottom of `App.jsx`. |
| **Switcher** | One control group in the Controls panel — a labeled set of mutually-exclusive options (radio-button-like) or, for a couple of them, a multi-select toggle list. Every switcher persists its value to `localStorage` and rehydrates on reload. |

---

## Part 1 — App-wide structure

### Levels and their boards

- **Level 1 (Lobby)** — no Layout switcher, single fixed view: stat cards +
  booking table (`BookingList.jsx`, driven by `LobbyBoard.jsx`) on the left,
  Announcements + Notice on the right (`AnnouncementPanel.jsx`).
- **Level 2 (CMT)**, **Level 3 (CTT)**, **Level 4 (SWT)** — all render through
  the *same* `TrainingRangeBoard.jsx` wrapper component (imported by
  `CmtBoard.jsx`/`CttBoard.jsx`/`SwtBoard.jsx` respectively, which today are
  just 3-line pass-through wrappers: `export default function CmtBoard(props)
  { return <TrainingRangeBoard {...props} /> }`). They're kept as separate
  files specifically so each level *can* diverge later without touching the
  others — as of now Level 2 has real diverging behavior (see Part 3), Level
  3 does not (still the shared placeholder).
- `TRAINING_BOARD_COMPONENTS = { 'level-2': CmtBoard, 'level-3': CttBoard,
  'level-4': SwtBoard }` maps level id → board component.

### Layouts

`LAYOUT_COMPONENTS = { 'layout-1': LayoutOne, ..., 'layout-5': LayoutFive }`.
Layout 1-4 are effectively level-agnostic (same generic detail-list/podium/
directory/leaderboard sidebar patterns, driven by shared placeholder data
`detailList`/`leaderboard`/`podium`). **Layout 5 is where all the
level-specific real data lives** — it branches internally by `level` to
render completely different sub-trees for Level 2, Level 4, vs. everything
else. This is the single biggest, most complex component in the codebase.

**Default on a fresh browser (no localStorage): Level 4 + Layout 5.**

### `App.jsx` — the orchestrator (~1600 lines after this session)

Single file holding almost everything:
- Every switcher's option array (e.g. `const DATA_COUNT_OPTIONS = [{id, label,
  description}, ...]`)
- Every switcher's `localStorage`-backed state + persistence effect (see
  pattern below — dozens of near-identical blocks)
- All the small inline icon components (`function XIcon() { return <svg>...
  </svg> }`)
- The 5 Layout components (`LayoutOne`..`LayoutFive`)
- SWT-specific components (`SwtStationInfo`, `SwtStationColumn`, `StationGlobalLeaderboard`)
- CMT-specific components (`CmtStationInfo`, `CmtDetailTable`, `CmtStationColumn`)
- Shared helpers (`chunkStationRows`, `buildStationSteps`, `formatStationRows`, `FlipProgressBar`)
- The `switcherGroups` array (assembled at the very bottom of the `App`
  function body, right before the JSX `return`) — this is what actually
  populates the Controls panel, built as a flat array with lots of
  conditional spreads: `...(condition ? [ {switcher}, {switcher} ] : [])`

**The universal persistence pattern** — every single switcher in this app
follows this exact shape. When adding a new one, copy it verbatim:
```js
const X_STORAGE_KEY = 'infoboard-some-key'
const X_OPTIONS = [
  { id: 'a', label: 'A', description: '...' },
  { id: 'b', label: 'B', description: '...' },
]
// inside App():
const [x, setX] = useState(() => {
  const saved = localStorage.getItem(X_STORAGE_KEY)
  return X_OPTIONS.some((o) => o.id === saved) ? saved : 'a' // fallback default
})
useEffect(() => {
  localStorage.setItem(X_STORAGE_KEY, x)
}, [x])
```
For switchers keyed **per station** (Start Detail, per-station Session
Leaderboard), the state is a single **object** instead, keyed by station
code, JSON-serialized:
```js
const [xByStation, setXByStation] = useState(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(X_STORAGE_KEY))
    if (saved && typeof saved === 'object') return saved
  } catch { /* ignore malformed saved value */ }
  return {}
})
useEffect(() => {
  localStorage.setItem(X_STORAGE_KEY, JSON.stringify(xByStation))
}, [xByStation])
// updating one station's value:
setXByStation((prev) => ({ ...prev, [stationCode]: newValue }))
```
And the switcher entries themselves are generated with `.map()` over the
relevant station list:
```js
...someStationList.map((station) => ({
  id: `x-${station.code}`,
  label: `${station.code} X`,
  icon: <SomeIcon />,
  options: X_OPTIONS,
  active: xByStation[station.code] ?? 'default',
  onChange: (value) => setXByStation((prev) => ({ ...prev, [station.code]: value })),
}))
```

---

## Part 2 — Layout 5 + Level 4 (SWT) — the original deep-dive

Level 4 uses **real per-station data** (`swtStations` in `data.js`, 5
stations). Levels 2/3 originally shared one generic placeholder path inside
`LayoutFive`; Level 2 has since been given its *own* real data path (Part 3)
— only Level 3 still falls into the old placeholder.

### Data model: `swtStations`

```js
{
  code: 'SWT-01',
  bookingCode: '20260715-SWT-04',   // shown top-right of the card header
  mode: 'Collective',                 // + courseware -> info line, e.g. "Collective, Blockforce Training"
  courseware: 'Blockforce Training',
  unit: '41SAB',                      // own line, above the Detail title
  startTime: '01:00 PM',
  endTime: '06:00 PM',
  details: [                          // see "Multi-Detail rotation" below
    { status: 'Ongoing', rows: [ ...15 real trainees... ] },   // Detail 1
    { status: 'Ready',   rows: [ ...15 dummy trainees... ] },  // Detail 2
    { status: 'Ready',   rows: [ ...15 dummy trainees... ] },  // Detail 3
  ],
}
```
Each trainee row: `{ no, rank, name, status, weapon, lane }`.
**Important distinction — two unrelated things are both called "status":**
1. `row.status` — per-trainee pill in the table body (almost always
   `'Ready'` in the seed data).
2. `details[i].status` — per-**Detail-group** pill next to the Detail
   title in the card header (`'Ongoing'` / `'Ready'` / `'In Queue'` for
   CMT — see below). This is the one that matters for "Ongoing" amber
   styling etc.

**All 5 SWT stations have exactly 3 Detail groups.** Detail 1 is always the
station's real original roster (status `'Ongoing'`); Detail 2/3 are
newly-generated dummy rosters (status `'Ready'`), row-count-matched to that
station's real scale (15 rows for SWT-01/02/03, 5 rows for SWT-04/05, since
those two only ever had 5 real trainees booked).

**SWT-03 is the one Session-Leaderboard-capable SWT station** —
`isLeaderboardCapable: true` + a separate `leaderboardRows` array (10 scored
trainees, `{no, rank, name, weapon, score}`). Its Detail 1 uses the shared
placeholder `detailList` as a stand-in roster (no real "not yet ended" roster
was ever supplied for it), Detail 2/3 are real generated dummy data like
every other station.

**Fallback for a station without `details`** (none currently in the data,
kept for safety): treated as one implicit Detail 1 group, `status: 'Ready'`,
rows from `station.rows` — see `buildStationSteps`'s `station.details ?? [{
status: 'Ready', rows: station.rows }]`.

Unit values: SWT-04/SWT-05 = `'41SAR'` (corrected from `'41SAB'` per explicit
request); all other SWT stations = `'41SAB'`.

### The chunking/rotation engine — `chunkStationRows` + `buildStationSteps`

These two pure functions (top of `App.jsx`) are the shared engine behind
*every* multi-Detail rotation in this app, for both SWT and CMT:

```js
const DATA_COUNT_PAGE_SIZES = {
  '10-5': [10, 5],
  '15': [Infinity],
  '5-5-5': [5, 5, 5],
}

function chunkStationRows(rows, dataCount) {
  const sizes = DATA_COUNT_PAGE_SIZES[dataCount] ?? DATA_COUNT_PAGE_SIZES['15']
  const pages = []
  let offset = 0
  for (const size of sizes) {
    const page = rows.slice(offset, offset + size)
    if (page.length > 0) pages.push(page)   // drop empty pages — a 5-row
    offset += size                            // station under "10-5" just
  }                                            // gets ONE 5-row page, not
  return pages.length > 0 ? pages : [rows]    // a 10-row + an empty page
}

function buildStationSteps(station, dataCount) {
  const groups = station.details ?? [{ status: 'Ready', rows: station.rows }]
  return groups.flatMap((group, detailIndex) =>
    chunkStationRows(formatStationRows(group.rows), dataCount).map((rows) => ({
      rows,
      status: group.status,
      detailIndex,
    }))
  )
}
```
`chunkStationRows` is **row-shape-agnostic** — it doesn't care whether a row
has `weapon`/`lane` (SWT) or `role` (CMT), it just slices arrays. This is why
it could be reused as-is for CMT without any modification.

`buildStationSteps` returns a **flat array of steps**, each `{rows, status,
detailIndex}`. For a 3-Detail-group station under `"10-5"`: 6 steps —
`[D1×10, D1×5, D2×10, D2×5, D3×10, D3×5]`. Under `"15"`: 3 steps (one per
Detail, no sub-paging). Under `"5-5-5"`: 9 steps.

`formatStationRows(rows)` (also top of `App.jsx`) maps over rows applying:
- `truncateStationName` — cuts `name` to 30 chars + `…` if longer
  (`STATION_NAME_MAX_CHARS = 30`)
- `wrapStationWeapon` — turns `"SAR21, MATADOR"` into `"SAR21\nMATADOR"` so
  CSS `white-space: pre-line` renders it as stacked lines. No-ops
  (`undefined`) safely if the row has no `.weapon` field (CMT rows) — this is
  why `buildStationSteps`/`formatStationRows` work unmodified for CMT.

### "Data Count" switcher

`id: 'station-data-count'`, options `10-5`/`15`/`5-5-5` (`DATA_COUNT_OPTIONS`
constant + description strings), storage key
`infoboard-station-data-count`. **Default `'15'`** (show every row at once,
no flip) — this was explicitly confirmed with the user; they once asked for
a default of `"14"`, which matches no real option, and on clarification
meant the existing `'15'` default (no code change was needed for that).
**Shared** between Level 2 and Level 4 (same global state, same switcher —
see Part 3 for how the switcher list is generated per active level).

### "Start Detail" switcher (per station)

`id: start-detail-${code}`, label `${code} Start Detail`, options Detail
1/2/3 (`START_DETAIL_OPTIONS`), storage key `infoboard-layout5-start-detail`,
state shape `{ 'SWT-01': '2', 'CMT-04': '3', ... }` (default `{}` = everyone
starts at Detail 1). One entry generated per station in whichever list is
active (`swtStations` for Level 4, `cmtStations.filter(s => !s.noBooking)`
for Level 2 — CMT's no-booking cabins don't get this switcher since they have
no `details` to rotate through).

Resolved inside the station-column component:
```js
const startDetailIndex = Number(startDetail) - 1   // '1' -> 0, '2' -> 1, '3' -> 2
const initialStepIndex = steps.findIndex((s) => s.detailIndex === startDetailIndex)
// (idx === -1 ? 0 : idx) — falls back to step 0 if the station doesn't
// actually have that many Detail groups
```

### Synchronized flip — the single shared `flipTick`

**This is the most important architectural fact about Layout 5's rotation.**
Individual stations do **not** run their own independent timers. There's
exactly **one** shared counter, `flipTick`, owned by the top-level `App`
component:
```js
const [flipTick, setFlipTick] = useState(0)
useEffect(() => {
  if (layout !== 'layout-5') return
  const id = setInterval(() => setFlipTick((t) => t + 1), LAYOUT_FIVE_STEP_INTERVAL_MS) // 8000ms
  return () => clearInterval(id)
}, [layout])
```
`flipTick` is threaded down through every layer: `App` → `TrainingBoard`
(`TrainingRangeBoard.jsx`) → `ActiveLayout` (`LayoutFive`) → every individual
station column component (`SwtStationColumn`, `CmtStationColumn`), and used
directly inside `LayoutFive` itself for the Level 3 placeholder branch.

Each station computes **its own** current step via simple modulo against the
*same shared* tick:
```js
const pageIndex = steps.length > 0 ? (initialStepIndex + flipTick) % steps.length : 0
```
Because every station reads the identical `flipTick` value, **every column on
screen changes at the exact same moment** — but since different stations can
have different `steps.length` (a 5-row station has fewer steps than a
15-row one under the same Data Count) and different `initialStepIndex` (from
Start Detail), **the Detail label shown can legitimately differ between
stations at any given instant.** This is intentional, confirmed with the
user: only the *timing* of the flip is synchronized, not the displayed
content. (E.g. a 6-step station and a 3-step station both flip on tick
boundaries, but `6-step-tick % 6` and `3-step-tick % 3` land on different
semantic Details.)

This replaced an earlier per-station-independent-timer design (each station
had its own `usePagedRows(...)` call). That's why `usePagedRows` (see Part 5)
still has an `initialIndex` 4th parameter that this particular call site no
longer uses (replaced by the modulo arithmetic above) but every *other*
caller in the codebase still relies on — **do not remove it.**

**There is exactly one progress bar for the whole mechanism** —
`<FlipProgressBar tick={flipTick} intervalMs={LAYOUT_FIVE_STEP_INTERVAL_MS} />`,
rendered once in `App.jsx` directly after `<Header />`, shown whenever
`isTrainingLevel && layout === 'layout-5'`. Originally there were 5 separate
bars (one per station card); the user explicitly asked for this to become
one bar under the navbar, "so everything flips together" — both the visual
consolidation and the behavioral synchronization happened in that same
request.

`FlipProgressBar` is a pure CSS animation, not a JS ticking re-render:
```js
function FlipProgressBar({ tick, intervalMs }) {
  return (
    <div className="flip-progress-track" aria-hidden="true">
      <div key={tick} className="flip-progress-fill" style={{ animationDuration: `${intervalMs}ms` }} />
    </div>
  )
}
```
`key={tick}` forces React to unmount+remount the fill `<div>` every time
`tick` changes, which restarts its CSS `@keyframes flip-progress-fill`
animation (`width: 0% -> 100%`) from scratch — no per-frame state updates
needed. CSS: `.flip-progress-track` (height 4px, full width, sits flush
under `.header`'s bottom border, normal document flow) / `.flip-progress-fill`.

### Height-lock — columns don't shrink/grow when their own page flips

CSS Grid `align-items: stretch` on `.layout-five` makes all 5 SWT columns in
a *row* match the tallest one automatically — but that only solves height
consistency *across* columns, not the problem of a *single* column's content
changing height between its own pages (e.g. "10-5" mode flips 10 rows ↔ 5
rows within the same station).

Fix, inside `SwtStationColumn` (and mirrored in `CmtStationColumn`):
```js
const hasUnevenPages = steps.length > 1 && steps.some((s) => s.rows.length !== steps[0].rows.length)
const columnRef = useRef(null)
const [minHeight, setMinHeight] = useState(0)
useEffect(() => {
  if (!hasUnevenPages || !columnRef.current) return
  const el = columnRef.current
  const observer = new ResizeObserver(() => {
    setMinHeight((prev) => Math.max(prev, el.getBoundingClientRect().height))
  })
  observer.observe(el)
  return () => observer.disconnect()
}, [hasUnevenPages])
// <section ref={columnRef} style={hasUnevenPages ? { minHeight } : undefined}>
```
**Why `ResizeObserver` and not one `getBoundingClientRect()` snapshot on
mount** — this was debugged live this session. The very first browser paint
can happen *before* the self-hosted webfonts finish loading, so a snapshot
taken then captures fallback-font (shorter) metrics and locks in an
undersized floor. `ResizeObserver` keeps ratcheting the floor upward at
whatever height the element has *actually* reached, including after the
font swap causes a reflow. A flat hardcoded px constant was tried first and
also found insufficient (didn't track font-size-switcher changes). **Do not
regress to either of those two approaches.**

`"15"` (single page) and `"5-5-5"` (uniform page sizes) modes never trigger
`hasUnevenPages` — no floor needed, correctly.

### `SwtStationColumn` render structure

```
<section class="station-column [station-column-leaderboard]">
  <StationColumnHead>            // code (left) + bookingCode (right)
  [if session leaderboard mode:]
    <StationGlobalLeaderboard>   // replaces everything below entirely
  [else:]
    <SwtStationInfo>             // mode+courseware (left) / startTime-endTime (right)
    <p class="station-column-unit">Unit: <strong>X</strong></p>   // own line, conditional
    <DetailPanel>                // the actual trainee table
</section>
```
The Unit line is only rendered when `station.unit` exists **and**
`detailTitleMode !== 'unit'` (if Detail Title mode is set to show the unit
code as the title itself, a separate Unit line would just repeat it).

Table columns (SWT, `splitRank` mode): No / Rank / Name / Status (only in
`default`/`compact` table models, not `table2`) / Weapon / Lane. Current
widths in `index.css` (`.station-column .table .X-cell`):

| Cell | Width | Notes |
|---|---|---|
| `.no-cell` | 24px | |
| `.rank-cell` | 36px | ⚠️ **known unresolved issue**: at this width "RANK" header text clips to "RA…" in the headless-Chromium verification environment. Flagged to the user (commit `f9135b6`), they haven't given a final decision (keep as-is vs widen). Bring this up again if relevant. |
| `.name-cell` | 90px | |
| `.weapon-cell` | 72px | |
| `.status-cell` | 66px | |
| `.lane-cell` | 40px | + `text-align: center` |
| `.role-cell` (CMT) | 48px | + `text-align: center`, mirrors `.lane-cell` |

**All of these are exact pixel values the user measured live in their own
browser devtools** — not estimates. When given literal devtools-measured px
values again, apply them verbatim. Also note: `table-layout: fixed`
proportionally scales up all explicit widths if their sum is less than the
container's actual rendered width (observed ~1.05×-1.18× across different
verification rounds) — this is expected/harmless browser behavior, not a bug
to chase.

**Lane column text**: the redundant `"Lane "` word-prefix is stripped from
cell values down to just the number (`row.lane.replace(/^Lane\s*/i, '')`),
gated on the `splitRank` prop. `splitRank` is *only* ever passed from Layout
5's SWT/placeholder call sites, so it doubles as an implicit "is this Layout
5" signal in the 3 shared table components that check it
(`DetailList.jsx`/`DetailListTable2.jsx`/`DetailListCompact.jsx` — `DetailListCards.jsx`
shows lane as a card badge and was left untouched/out of scope). Whichever
global `tableModel` switcher value is active (`default`/`card`/`table2`/
`compact`) determines which of these 4 components actually renders for a
given Layout 5 SWT card.

**"Ongoing" / "In Queue" status pill amber styling**: `statusTone.js` maps
status strings to a tone name (`'queue'`/`'done'`/`'ready'`), used for e.g.
`PageDots` coloring:
```js
export function statusTone(status) {
  if (status === 'Queue' || status === 'Ongoing') return 'queue'
  if (status === 'Completed' || status === 'Done') return 'done'
  if (status === 'Ready' || status === 'Upcoming') return 'ready'
  return undefined
}
```
But the actual CSS class applied to a status pill is decided by **separate,
duplicated inline checks** in each table component, e.g.:
```jsx
className={`status-pill${status === 'Queue' || status === 'Ongoing' ? ' status-pill-queue' : ''}`}
```
This was originally only checking `=== 'Queue'` and got fixed this session
to also check `'Ongoing'` (in `DetailList.jsx`/`DetailListTable2.jsx`/
`DetailListCompact.jsx`/`DetailListCards.jsx`) and, separately, `CmtDetailTable`
also checks `=== 'In Queue'` (CMT's third possible Detail status, alongside
Ongoing/Ready). **If you add a new status string that should render amber,
you must update every one of these components individually** — this is
deliberate string duplication matching the existing pattern, not something
that was refactored into a shared `statusTone(status) === 'queue'` call
(would be the cleaner fix if ever revisited).

### Header title

`Header.jsx`'s `title` prop, if it contains `\n`, is split and rendered as
separate `<div>` lines inside `.header-tab`. Per-level titles set in
`App.jsx`'s JSX:
```jsx
title={
  level === 'level-4'
    ? 'Specialized Weapon Trainer\nTraining Information Board'
    : level === 'level-1'
      ? 'Today Bookings'
      : 'Infoboard'   // Level 2/3 still show this generic fallback
}
```
The whole `.header` element is CSS Grid (`grid-template-columns: 1fr auto
1fr`), not flex `space-between` — this makes `.header-tab` (the middle
column) sit **exactly** centered on the bar regardless of how wide the left
(brand/logo) and right (clock/badge/live) groups are, rather than just
filling flex leftover space next to the logo. Verified pixel-exact center
(0px delta from bar midpoint) via Playwright. This grid change affects every
level's header, not just Level 4's.

### Directory map toggle (SWT)

`id: 'directory-visibility'`, options Visible/Hidden, storage key
`infoboard-layout5-directory`, **default `'hidden'`**. Render condition in
`LayoutFive`:
```jsx
{(!(isLevelFour || isLevelTwo) || !hideDirectory) && (
  <section className="panel directory-panel layout-five-directory">
    {isLevelTwo ? <CmtDirectory /> : <Directory activeStation={activeStation} />}
  </section>
)}
```
Reading this condition: Level 3's placeholder view **always** shows its
Directory, unconditionally — the toggle has no effect there. Level 2 and
Level 4 **each** independently respect the (shared) `hideDirectory` flag.

### Leaderboard model switcher — hidden on Layout 5

`id: 'leaderboard-model'` is gated `layout !== 'layout-5'` — it only ever
drove `LeaderboardPanel` in Layouts 1-3's sidebar, which Layout 5 has no
equivalent of (Session/Global Leaderboard is a separate hardcoded component
per leaderboard-capable station, unrelated to this switcher). Was a dead
control on Layout 5 before this fix.

### Font-size switchers (Layout 5 only, any level)

`table-font-size` / `detail-font-size` / `station-font-size` — set CSS
custom properties (`--l5-table-font-size` etc.) inline on the `.layout-five`
element, consumed throughout `index.css`. `detail-font-size` has an
**`X-Small` (11px)** option below the previous smallest (`Small`, 13px).

### Info Banner switcher — default now `'hidden'`

Applies to **all** training levels (2/3/4), not just Layout 5 — was
`'visible'` by default, changed per explicit request.

---

## Part 3 — Level 2 (CMT) — the newest, most structurally different addition

Level 2 gets its **own real-data path** inside `LayoutFive`, parallel to
Level 4's SWT path but structurally different in several ways. This was
built from a spreadsheet-style mockup screenshot the user provided, showing
an actual physical floor layout.

### Why CMT is structurally different from SWT

| | SWT (Level 4) | CMT (Level 2) |
|---|---|---|
| Training type | Firing range (shooting) | Vehicle crew (Terrex vehicles) |
| Stations | 5 (SWT-01..05) | 11 (CMT-01..11) |
| Per-trainee columns | Rank, Name, Weapon, Lane | Rank, Trainee(=Name), **Role** |
| Grid arrangement | 5 uniform columns | 5 physical columns, **uneven stacking** (3+3+3+1+1) |
| Empty/unbooked state | none (all 5 always booked) | **"No Booking"** cabins exist (CMT-06, CMT-08) |
| Leaderboard-capable stations | 1 (SWT-03) | 2 (CMT-01, CMT-03) |
| Directory | isometric SVG, 4 even bays | plain CSS Grid boxes, irregular floor shape |

### Data model: `cmtStations` + `cmtStationColumns` (data.js)

```js
// Physical grouping: which 5 columns the 11 real cabins actually sit in.
// Columns 1-3 stack 3 cabins each; columns 4-5 have just 1 each.
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
    bookingCode: '20260715-CMT-01, 2SIR',   // note: unit is embedded in this one string for CMT, unlike SWT's separate `unit` field
    platformType: 'Terrex 50HMG',            // single info-line field (no mode+courseware split like SWT)
    startTime: '08:00 AM',
    endTime: '03:00 PM',
    isLeaderboardCapable: true,               // only CMT-01 and CMT-03 have this
    leaderboardRows: [ {no, rank, name, score}, ... ],  // 5 rows, real data from the mockup
    details: [
      { status: 'Ongoing', rows: [ {no, rank, name, role}, ... ] },  // Detail 1
      { status: 'Ready', rows: [...] },                                // Detail 2
      { status: 'Ready', rows: [...] },                                // Detail 3
    ],
  },
  ...
  {
    code: 'CMT-06',
    noBooking: true,   // ONLY this field — no bookingCode/platformType/details/anything else
  },
  ...
]
```

**Real vs. invented data**: the source mockup was a live snapshot showing
only ONE Detail's worth of real data per cabin (whichever Detail happened to
be displayed at that moment, with its real status — Ongoing/Ready/In Queue).
That real data was placed at the matching `detailIndex` in each cabin's
`details` array; the other 2 Details per cabin were newly invented (dummy
names, same Rank/Role pattern). E.g. CMT-10's mockup snapshot showed "Detail
2 (In Queue)" as real data — that's `details[1]` with `status: 'In Queue'`
and the real row data; `details[0]` and `details[2]` are invented.

**`noBooking` cabins** (CMT-06, CMT-08): have *only* `{code, noBooking:
true}` — no `bookingCode`, `platformType`, `details`, nothing else. Handled
by a completely separate early-return branch in `CmtStationColumn` (see
below) rather than flowing through the normal rotation logic at all.

**Leaderboard-capable cabins** (CMT-01, CMT-03): same mechanism as SWT-03 —
`isLeaderboardCapable: true` + `leaderboardRows`, toggled by a per-station
switcher (Ongoing/Ended). Unlike SWT-03 (whose Session/Global Leaderboard
entirely bypasses its own Detail rotation while in "Ended" mode), this is
architecturally *identical* to SWT-03's pattern — not a per-Detail toggle,
a whole-station-replacement toggle.

### New status value: `'In Queue'`

CMT introduces a third Detail-group status beyond SWT's Ongoing/Ready:
`'In Queue'`. Styled identically to `'Ongoing'`/`'Queue'` (amber pill) via
`CmtDetailTable`'s own status-class check:
```js
status === 'Queue' || status === 'Ongoing' || status === 'In Queue' ? ' status-pill-queue' : ''
```
This is a CMT-only string — SWT never uses `'In Queue'` (it doesn't need a
third state), but the amber-pill CSS class (`.status-pill-queue`) is shared
infrastructure.

### New components (all inline in `App.jsx` unless noted)

**`CmtStationInfo({ station })`** — mirrors `SwtStationInfo` but only shows
`platformType` (no mode+courseware split):
```jsx
<p className="station-column-info">
  <span>{station.platformType}</span>
  <span>{station.startTime} - {station.endTime}</span>
</p>
```

**`CmtDetailTable({ rows, title, status, hideNo, leaderboard })`** — CMT's
dedicated trainee table (No/Rank/Trainee/Role, or No/Rank/Trainee/Score when
`leaderboard` is true). Not built on `DetailPanel`/`DetailList*` at all
(those are hardcoded to Weapon/Lane shape) — a from-scratch component reusing
the *same CSS classes* (`.table`, `.table-two`, `.no-cell`, `.rank-cell`,
`.name-cell`, `.role-cell`, `.status-pill`) for visual consistency with
SWT's tables. Renders the status pill only if `status` is truthy (the
leaderboard call omits it, matching `StationGlobalLeaderboard`'s no-pill
look).

**`CmtStationColumn({ station, hideNoColumn, stationDataCount, startDetail,
leaderboardSession, flipTick })`** — mirrors `SwtStationColumn`'s structure
(steps via `buildStationSteps`, height-lock via `ResizeObserver`, `flipTick`-
driven `pageIndex`) but:
- Has an **early return** for `station.noBooking` cabins: renders just
  `StationColumnHead` (code only, no bookingCode), a `"No Booking"` info
  line, and a table with header row + **5 hardcoded blank rows** (no data,
  matching the mockup exactly).
- Otherwise renders `CmtStationInfo` + Unit-line-equivalent is **not**
  present for CMT (no separate Unit field — it's embedded in `bookingCode`)
  + `CmtDetailTable`.
- Reuses `.station-column-leaderboard` (the gold-tinted card CSS class)
  when `leaderboardSession === 'ended'`, exactly like SWT-03.

**`CmtDirectory.jsx`** (own file, `src/components/CmtDirectory.jsx`) —
Level 2's floor-plan panel, replacing `Directory.jsx` for Level 2 only. Not
an isometric SVG like the SWT one (that only makes sense for 4 even bays) —
a plain CSS Grid of labeled boxes approximating the real floor plan's
relative adjacency (not pixel-exact coordinates):
```js
const FLOOR_ITEMS = [
  { id: 'briefing', label: 'Briefing Room', col: '1 / span 3', row: '1' },
  { id: 'CMT-01', label: 'CMT-01', col: '5', row: '1' },
  { id: 'CMT-11', ..., col: '1', row: '2' },
  { id: 'CMT-10', ..., col: '2', row: '2' },
  { id: 'CMT-09', ..., col: '3', row: '2' },
  { id: 'CMT-08', ..., col: '4', row: '2' },
  { id: 'CMT-02', ..., col: '5', row: '2' },
  { id: 'CMT-07', ..., col: '2', row: '3' },
  { id: 'CMT-03', ..., col: '4', row: '3' },
  { id: 'CMT-06', ..., col: '1', row: '4' },
  { id: 'CMT-04', ..., col: '3', row: '4' },
  { id: 'CMT-05', ..., col: '3', row: '5' },
]
```
Each item rendered as a `<div style={{gridColumn: item.col, gridRow:
item.row}}>` inside a `display:grid; grid-template-columns: repeat(5,1fr)`
container (`.cmt-directory-map`). The Briefing Room box gets a distinct
filled/accent-colored style (`.cmt-directory-box-briefing`) vs. plain boxes
for cabins (`.cmt-directory-box`).

### `LayoutFive`'s 3-way branch

```jsx
const isLevelFour = level === 'level-4'
const isLevelTwo = level === 'level-2'
// ...
{isLevelFour ? (
  swtStations.map((station) => <SwtStationColumn ... />)
) : isLevelTwo ? (
  cmtStationColumns.map((codes, i) => (
    <div key={i} className="cmt-station-group">
      {codes.map((code) => {
        const station = cmtStations.find((s) => s.code === code)
        return <CmtStationColumn key={code} station={station} ... />
      })}
    </div>
  ))
) : (
  LAYOUT_FIVE_STATIONS.map((station) => /* Level 3's shared placeholder */)
)}
```
`.cmt-station-group` is `display:flex; flex-direction:column; gap:12px` —
each of the 5 grid columns holds a **stack** of 1-3 cabin cards. Crucially,
`.layout-five-cmt` (added as an extra class on `.layout-five` when
`isLevelTwo`) overrides `align-items: stretch` back to `align-items: start`
— because unlike SWT's 5 uniform columns, CMT's 5 columns have wildly
different natural heights (a 3-cabin-stack column vs. a 1-cabin column), and
stretching the 1-cabin columns to match the 3-cabin ones would leave huge
empty space at the bottom of the shorter cards.

### Switcher generation — now level-aware

The switcher block gated on Layout 5 + (Level 2 or Level 4) generates
different sub-entries depending on which level is active:
```jsx
...((level === 'level-4' || level === 'level-2') && layout === 'layout-5'
  ? [
      { /* No Column — shared */ },
      { /* Directory — shared */ },
      ...(level === 'level-4' ? [
        { /* SWT-03 Session */ },
        { /* Detail Title (SWT-only concept — CMT has no "unit as title" swap) */ },
      ] : []),
      ...(level === 'level-2' ? cmtStations
        .filter((s) => s.isLeaderboardCapable)
        .map((station) => ({ id: `cmt-leaderboard-${station.code}`, label: `${station.code} Session`, ... }))
        : []),
      { /* Data Count — shared, same global state across both levels */ },
      ...(level === 'level-4' ? swtStations : cmtStations.filter((s) => !s.noBooking))
        .map((station) => ({ /* Start Detail for this station */ })),
    ]
  : []),
```
New storage key: `infoboard-cmt-leaderboard-session` — object keyed by CMT
station code (`{ 'CMT-01': 'ended', 'CMT-03': 'ongoing' }`), independent from
SWT's single `swt03Session` flag (kept untouched/unrefactored to avoid
risking the already-working SWT-03 mechanism).

### `cmtLeaderboardSessionByStation` threading

New prop threaded the same way as everything else: `App` state → `<TrainingBoard
cmtLeaderboardSessionByStation={...}>` → `TrainingRangeBoard.jsx` → `<ActiveLayout
cmtLeaderboardSessionByStation={...}>` → `LayoutFive` → `<CmtStationColumn
leaderboardSession={cmtLeaderboardSessionByStation?.[code] ?? 'ongoing'}>`.

---

## Part 4 — Level 1 (Lobby) — booking table + announcements

### Booking table structure (`BookingList.jsx`)

Column-driven rendering via a `COLUMN_RENDERERS` map + per-level column-order
arrays (`CMT_CTT_COLUMNS`, and Level 4's own array in `LEVEL_TABLE_COLUMNS`):
```js
const COLUMN_RENDERERS = {
  no: { label: 'No', cell: (row, index) => index + 1 },
  id: { label: 'Booking ID', cell: (row) => <div className="booking-code">{row.code}</div> },
  unit: { label: 'Unit', cell: (row) => <div className="booking-unit">{row.unit}</div> },
  platformType: { label: 'Platform Type', cell: (row) => row.platformType },
  mode: { label: 'Mode', cell: (row) => row.mode },           // SWT/Level 4 only
  courseware: { label: 'Courseware', cell: (row) => row.programme },  // SWT/Level 4 only
  startTime: { label: 'Start Time', ... },
  endTime: { label: 'End Time', ... },
  instructor: { label: 'Instructor', ... },
  status: { label: 'Status', cell: (row) => <span className={`status-pill ${STATUS_CLASS[row.status]}`}>{row.status}</span> },
}
```
**Unit used to be stacked inside the Booking ID cell** (bold unit code above
the booking code, matching an earlier design) — this was changed to give
Unit its **own column**, positioned between End Time and Instructor, because
the source booking spreadsheet has it there as a separate column. Booking ID
now shows *only* the code. Column widths (`%` in `CMT_CTT_COLUMNS`/Level 4's
array) were rebalanced to fit the new column — no other layout logic changed.

`STATUS_CLASS = { Ongoing: 'status-pill-queue', Upcoming: '', Completed:
'status-pill-done', Overdue: 'status-pill-overdue' }` — maps a booking's
status string directly to a pill CSS class (this is Level 1's *own*
separate status-styling mechanism, distinct from the `statusTone.js`/
inline-check duplication used in the Layout 5 table components described in
Part 2 — don't conflate the two).

### Stat cards (top of Level 1)

```js
const STAT_CARDS = [
  { key: 'upcoming', label: 'Ongoing', tone: 'upcoming' },
  { key: 'ready', label: 'Completed', tone: 'ready' },
  { key: 'starting', label: 'Upcoming', tone: 'starting' },   // was 'Starting'
]
```
Computed in `LobbyBoard.jsx`:
```js
const stats = {
  upcoming: rows.filter((b) => b.status === 'Ongoing').length,
  ready: rows.filter((b) => b.status === 'Completed').length,
  starting: rows.filter((b) => b.status === 'Upcoming').length,
}
```
**Important gotcha, already fixed once — watch for it recurring**: the
internal `key`/`tone` names (`upcoming`/`ready`/`starting`) are legacy and
**do not match** what each card actually counts or displays — the card
*labeled* "Ongoing" uses tone `upcoming` and counts `status === 'Ongoing'`
rows; the card *labeled* "Upcoming" uses tone `starting` and counts `status
=== 'Upcoming'` rows. The **CSS colors were originally mismatched** with the
status pills they represent (the "Ongoing" card was blue while the table's
Ongoing pill is amber; "Starting"/now-"Upcoming" was amber while the table's
Upcoming pill is blue) — this was fixed by swapping the CSS color rules
(`.booking-stat-upcoming` → amber, `.booking-stat-starting` → blue,
`.booking-stat-ready` was already correct at green) so every card's color now
exactly matches its corresponding status pill's color in the table below.
**If you ever touch these cards again, verify colors against the table
pills, not against the internal tone/key names** — the naming is actively
misleading.

### Header title

`level === 'level-1' ? 'Today Bookings' : ...` (was `'Infoboard'`) — scoped
to Level 1 only, Level 2/3 still show `'Infoboard'` as a fallback (not
addressed for those levels yet).

### Announcements (`AnnouncementPanel.jsx` + `announcements` in data.js)

Restructured per client feedback (older commit, still current):
- Removed an old "Range Day Highlight" entry entirely.
- Added a generic photo-only card: `{ id: 'training-photo', hasImage: true }`
  (no caption; renders a decorative inline SVG via a local
  `RangeIllustration` component in `AnnouncementPanel.jsx`).
- Renamed "Range Do's and Don'ts" → **"Rules"**: 5 bold-label bullets
  (Ballistic Compliance, Firearms Control, Protective Gear, Restricted
  Access, Identification — exact copy in `data.js`'s `announcements` export).
- The old "Facility Notice" card was removed from the static `announcements`
  array entirely, replaced by:

**`NoticeCard.jsx`** — the **one operator-editable part of the entire app**.
Renders after the static announcement cards. Shows "Notice" (not "Facility
Notice") with an Edit button → textarea → Save/Cancel. Persisted to
`localStorage['infoboard-notice-text']`, rendered as one bullet per
non-empty line (`notice.split('\n').filter(line => line.trim())`). Defaults
to `DEFAULT_NOTICE_TEXT` (exported from `data.js`) until an operator saves
their own text. Simulates the client's requested "operator can key in
information reflected in the Notice area" feature — no backend, purely
`localStorage`.

---

## Part 5 — Shared low-level infrastructure

### `usePagedRows(rows, pageSize, intervalMs, initialIndex = 0)`

`src/hooks/usePagedRows.js` — the generic "split into pages, auto-advance on
a timer" hook, used by many components across the whole app (not just
Layout 5): `DetailPanel`, `LeaderboardPanel`, `LayoutTwo`'s triple-detail
rotation, etc.
```js
export default function usePagedRows(rows, pageSize, intervalMs, initialIndex = 0) {
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const [pageIndex, setPageIndex] = useState(initialIndex)
  useEffect(() => {
    setPageIndex(initialIndex)
  }, [rows, pageSize, initialIndex])   // <-- resets to initialIndex on ANY of these changing
  useEffect(() => {
    if (pageCount <= 1) return           // no interval at all if there's only 1 page
    const id = setInterval(() => setPageIndex((i) => (i + 1) % pageCount), intervalMs)
    return () => clearInterval(id)
  }, [pageCount, intervalMs])
  const safeIndex = Math.min(pageIndex, pageCount - 1)
  const page = rows.slice(safeIndex * pageSize, safeIndex * pageSize + pageSize)
  return { page, pageIndex: safeIndex, pageCount }
}
```
**Critical gotcha #1**: the first `useEffect` resets `pageIndex` whenever the
`rows` **array reference** changes — not just its contents. Any array passed
in **must** be memoized (`useMemo`) with stable dependencies, or the
rotation will silently reset to page 0 every render instead of ever
advancing, looking "frozen." This bit the codebase multiple times across
sessions before this rule was established.

**Critical gotcha #2**: `initialIndex` (4th param) is unused-by-value at the
Layout 5 SWT/CMT station-column call sites now (they compute `pageIndex`
manually via the shared `flipTick` modulo instead of calling this hook at
all for their *own* Detail rotation) — but it's still a real, load-bearing
parameter for every *other* caller. Don't delete it thinking it's dead code.

### `statusTone.js`

```js
export function statusTone(status) {
  if (status === 'Queue' || status === 'Ongoing') return 'queue'
  if (status === 'Completed' || status === 'Done') return 'done'
  if (status === 'Ready' || status === 'Upcoming') return 'ready'
  return undefined
}
```
Used for `PageDots` tone-matching in a few places. **Not** the same
mechanism as the inline `status === 'X' ? 'status-pill-Y' : ''` checks
duplicated across the table components (see Part 2's "Ongoing" pill
section) — those are separate, deliberately-duplicated string checks, not
calls into this function. Don't assume changing `statusTone.js` affects pill
colors anywhere — it currently doesn't, directly.

### Rules of Hooks — why so many components got extracted

React forbids calling hooks (`useState`/`useEffect`/`useRef`/custom hooks
like `usePagedRows`) conditionally or inside loops/`.map()` callbacks. Any
per-item state (one station needing its own height-lock ref, its own
computed step index, etc.) requires that item's rendering logic to live in
its **own component function**, called once per array item via JSX
(`items.map((item) => <ItemComponent key={item.id} item={item} />)`), so
each call is a stable per-instance hook call rather than a call nested
inside the `.map()` iteration itself. This is *why* `SwtStationColumn` and
`CmtStationColumn` exist as separate components instead of inline render
logic inside `LayoutFive`'s `.map()` calls.

### CSS specificity gotcha (cell width overrides)

`.station-column .table th:last-child, .station-column .table td:last-child`
(includes a `th`/`td` **type selector**) has *higher* specificity than
`.station-column .table .lane-cell` (no type selector) even though both
appear to have "3 class-level things" — CSS specificity counts type
selectors as a distinct, lower tier that still needs matching, not skipping,
when trying to override via extra classes alone. Fix pattern used
throughout: match the type selector explicitly (`.station-column .table
th.lane-cell, .station-column .table td.lane-cell`) so the override wins via
equal specificity + later source order. **If a new cell-width override
mysteriously doesn't apply, check this first** — it's happened more than
once.

### `table-layout: fixed` proportional scaling

If a table's explicit column widths don't sum to the container's full
rendered width, and no column is left `auto` to absorb the difference,
browsers proportionally scale *all* explicit widths up to fill the space
(observed ~1.05×-1.18× across different verification rounds in this
session). This is expected, standard browser behavior — confirmed multiple
times, not something to "fix" when a measured width doesn't exactly match
the literal CSS value.

---

## Part 6 — Environment / workflow quirks

### Preview server restart flakiness

The exact sequence:
```bash
pkill -f "vite preview"
nohup npx vite preview --port 4173 --strictPort > /tmp/preview.log 2>&1 & disown
sleep 4
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:4173/
```
**reliably fails on the first attempt** in this environment (curl exit 7 /
144, connection refused) and needs the exact same `nohup ... & disown` +
`curl` sequence run a **second time** to actually succeed. This has been
consistent across the entire session — it isn't something wrong with the
command, just re-run it once more without changing anything.

### Playwright verification pattern

- `playwright-core` (not full `playwright`), `executablePath:
  '/opt/pw-browsers/chromium'`.
- Run scripts via `NODE_PATH=/home/user/infoboard/node_modules node
  <script>.cjs` — the script must live **outside** the repo (in the session
  scratchpad directory), since `node_modules` resolution needs the explicit
  `NODE_PATH` when running from outside the project root.
- Set `localStorage` directly via `page.evaluate(() => localStorage.setItem(...))`
  before `page.reload()` to jump straight to a specific app state (level,
  layout, switcher values) without clicking through the UI.
- For anything involving a rotation/timer, sample DOM state at multiple
  explicit timestamps (`page.waitForTimeout(ms)` between checks) spanning at
  least 1-2 full flip cycles, not just one snapshot.
- Delete scratch `.cjs`/`.png` files and `pkill -f "vite preview"` after
  verification, before committing.

### Every change this session followed this exact loop

1. Make the code edit.
2. `npm run build` — must succeed with no errors.
3. Restart preview server (expect the flaky-first-attempt pattern above).
4. Playwright: set localStorage, reload, assert DOM/computed styles, take
   screenshots, sample across time if relevant.
5. Clean up scratch files, kill the preview server.
6. `git add` the **specific** changed files (never `git add -A`), commit
   with a multi-paragraph message explaining *why* (not just what), ending:
   ```
   Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
   Claude-Session: https://claude.ai/code/session_01AgfEwg3qtfaNHZCx2zuZa8
   ```
7. `git push -u origin claude/frontend-duplication-9a77fl`
8. Reply to the user in **Bahasa Indonesia** (established language for this
   whole conversation), concisely confirming what changed and how it was
   verified.

---

## Part 7 — File map

```
src/
  App.jsx                    — central orchestrator (~1600 lines). Switcher
                                constants, all Layout components, SWT + CMT
                                station-column components, the chunking/
                                rotation engine, flipTick, switcherGroups.
  data.js                    — ALL static data: detailList/podium/leaderboard
                                (generic placeholders), stations (4 physical
                                LCD identities for slideshow), swtStations
                                (5, Level 4 real data), cmtStations +
                                cmtStationColumns (11, Level 2 real data),
                                bookings (Level 1 table), announcements +
                                DEFAULT_NOTICE_TEXT (Level 1 sidebar).
  index.css                  — ALL styling (~2100 lines). No CSS modules, no
                                styled-components, no Tailwind — plain
                                cascading CSS with CSS custom properties for
                                the Layout 5 font-size switchers.
  statusTone.js              — status string -> tone name (queue/done/ready).
  rotationConfig.js           — shared rotation interval constants used by
                                Level 1's booking/level auto-rotation.
  hooks/
    usePagedRows.js           — generic paged-rotation hook (see Part 5).
  components/
    Header.jsx                — 3-column CSS Grid header, multi-line title.
    NoticeCard.jsx             — operator-editable Notice (Level 1).
    AnnouncementPanel.jsx      — Level 1 sidebar cards + <NoticeCard/>.
    BookingList.jsx            — Level 1's booking table (column-driven).
    LobbyBoard.jsx             — Level 1 orchestrator (stats + booking + level rotation).
    Directory.jsx              — SWT's isometric-SVG floor plan (4 even bays).
    CmtDirectory.jsx           — NEW. CMT's plain CSS Grid floor plan (irregular shape).
    DetailList.jsx             — "Default Table" model, accepts splitRank.
    DetailListTable2.jsx       — "Table 2.0" model, accepts splitRank.
    DetailListCompact.jsx      — "Compact" model, accepts splitRank.
    DetailListCards.jsx        — "Card" model (unaffected by splitRank changes).
    LayoutSwitcher.jsx         — renders the Controls panel from switcherGroups.
    (Leaderboard*.jsx, TopThree.jsx, CombinedDetailList.jsx, StationsOverview.jsx,
     Clock.jsx, PageDots.jsx, PageLoadingBar.jsx, InfoBanner.jsx, LevelIndicator.jsx
     — all untouched this session, generic/shared across layouts)
  levels/
    levelConfig.js             — LEVELS array (id/label for the Level switcher).
    TrainingRangeBoard.jsx      — shared wrapper for Level 2/3/4, threads every
                                  Layout-5-related prop through to ActiveLayout.
    CmtBoard.jsx / CttBoard.jsx / SwtBoard.jsx — 3-line pass-through wrappers
                                  around TrainingRangeBoard, currently identical.
```

---

## Part 8 — Known open items

- **Rank column clipping at 36px** (SWT table, "RANK" header renders as
  "RA…" in the verification environment). Flagged to the user once, they
  haven't given a final decision — ask again if it resurfaces, or consider
  proactively widening slightly if it visually bothers them.
- Level 2/3 still show the generic `"Infoboard"` header title — only Level 1
  and Level 4 have been given bespoke titles so far. Not necessarily a bug,
  just unaddressed.
- CMT's `tableModel` switcher (Default/Card/Table2/Compact) has **no effect**
  on Level 2 — `CmtDetailTable` is a single fixed table shape, not wired to
  that switcher at all (out of scope for the CMT build; could be added later
  if requested).
- CMT's Directory floor plan (`CmtDirectory.jsx`) is a **reasonable visual
  approximation** of the mockup's relative box adjacency, not a pixel-exact
  recreation — purely cosmetic, revisit only if the user specifically wants
  it more precise.
- No other known bugs as of the last commit on this branch
  (`a6cba99` — "Add Level 2 (CMT) real per-station board to Layout 5").
