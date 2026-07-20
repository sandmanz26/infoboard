# Infoboard — Handoff / Session Notes

This document recaps the work done on this repo in the recent session(s), in
enough technical detail that a new Claude session (possibly under a different
account) can pick up where things left off without re-deriving context from
scratch. It covers **what exists now** (current behavior + the logic behind
it), not a chronological commit log — run `git log --oneline` for that.

Repo: `sandmanz26/infoboard` — branch `claude/frontend-duplication-9a77fl`.
Frontend-only React + Vite app, no backend, all data is static in
`src/data.js`. Deployed on Vercel (auto-deploys from the branch).

## Running it

```bash
npm install
npm run dev        # dev server
npm run build       # production build -> dist/
npm run preview     # serve the built dist/ (used for verification, see below)
```

## What this app is

A simulated military training-range LCD signage system ("Training Resource
Management System" / TRMS). It has 4 **Levels** (physical floors/screens) and,
for the training levels, 5 **Layouts** (different visual arrangements of the
same underlying data). Everything is controlled live via a draggable
**Controls** panel (bottom-right "Controls" button) — every switcher writes to
`localStorage` so settings persist across reloads.

- **Level 1** — Lobby: today's booking list + Announcements sidebar (no
  Layout switcher; single fixed view).
- **Level 2** — CMT (`CmtBoard.jsx`)
- **Level 3** — CTT (`CttBoard.jsx`)
- **Level 4** — SWT / Specialized Weapon Trainer (`SwtBoard.jsx`)

Levels 2-4 all currently render through the same shared
`TrainingRangeBoard.jsx` wrapper (they're separate files so each can diverge
later without touching the others — right now they're identical).

Layouts (selectable for levels 2-4 via the Layout switcher):
- **Layout 1** — single detail list + optional right sidebar
- **Layout 2** — 3 detail lists side by side + sidebar
- **Layout 3** — combined detail table + sidebar
- **Layout 4** — overview grid of all 4 base stations
- **Layout 5** — 5 base-station columns, no sidebar (this is where almost
  all of this session's work happened, and it's the current **default**
  layout — see `useState` default in `App.jsx`)

**Default on fresh load: Level 4 + Layout 5.**

## The big picture: `App.jsx`

Everything lives in one large file, `src/App.jsx` (~1400 lines). It holds:
- All the switcher option constants (arrays of `{id, label, description}`)
- All the `localStorage`-backed `useState` + persistence `useEffect` pairs
- All the small icon components (inline SVGs)
- The layout components (`LayoutOne`..`LayoutFive`, `LayoutFive` being the
  big one)
- The `switcherGroups` array assembled at the bottom of the `App` component
  and handed to `<LayoutSwitcher groups={switcherGroups} />`

The persistence pattern used everywhere:
```js
const [x, setX] = useState(() => {
  const saved = localStorage.getItem(X_STORAGE_KEY)
  return X_OPTIONS.some((o) => o.id === saved) ? saved : 'default-id'
})
useEffect(() => {
  localStorage.setItem(X_STORAGE_KEY, x)
}, [x])
```
Follow this exact pattern for any new switcher — it's what every existing one
does.

---

## Layout 5 + Level 4 (SWT) — the deep-dive area

This is where nearly every request this session landed. Level 4 uses **real
per-station data** (`swtStations` in `data.js`); Levels 2/3's Layout 5 use a
**shared placeholder roster** (`detailList`) — two genuinely different code
paths inside `LayoutFive`, both described below.

### Data model: `swtStations` (data.js)

Each of the 5 stations (`SWT-01`..`SWT-05`) is an object:
```js
{
  code: 'SWT-01',
  bookingCode: '20260715-SWT-04',   // shown top-right of the card header
  mode: 'Collective',                // shown in the info line ("mode, courseware")
  courseware: 'Blockforce Training',
  unit: '41SAB',                     // shown on its own line above "Detail 1"
  startTime: '01:00 PM',
  endTime: '06:00 PM',
  details: [                         // see "Multi-Detail rotation" below
    { status: 'Ongoing', rows: [ ...15 real trainees... ] },   // Detail 1
    { status: 'Ready',   rows: [ ...15 dummy trainees... ] },  // Detail 2
    { status: 'Ready',   rows: [ ...15 dummy trainees... ] },  // Detail 3
  ],
}
```
Each row: `{ no, rank, name, status, weapon, lane }`. `status` here is the
**per-trainee** Ready/Queue pill in the table body — unrelated to the
Detail-group-level `status` ("Ongoing"/"Ready") shown in the card's title row.

**All 5 stations now have 3 Detail groups each.** Detail 1 is always each
station's real original roster (status "Ongoing"); Detail 2 and 3 are
newly-generated dummy rosters (status "Ready"), sized to match that station's
own real row count (15 for SWT-01/02/03, 5 for SWT-04/05, since SWT-04/05's
real bookings only ever had 5 trainees).

**SWT-03 is special**: it also has `isLeaderboardCapable: true` and a
`leaderboardRows` array (10 scored trainees). When the "SWT-03 Session"
switcher is set to "Ended", SWT-03 renders `StationGlobalLeaderboard` instead
of its normal Detail rotation entirely (bypasses the `details` array). Its
Detail 1 (`status: 'Ongoing'`) still uses the shared placeholder `detailList`
as a stand-in roster (no real "not yet ended" roster was ever supplied), but
Detail 2/3 are still real dummy data generated for it.

Stations without a `details` array (none currently — this is legacy/fallback
support) would be treated as a single implicit Detail 1 group with status
`'Ready'` — see `buildStationSteps`'s fallback: `station.details ?? [{
status: 'Ready', rows: station.rows }]`.

Unit for SWT-04/SWT-05 is `'41SAR'` (was `'41SAB'`, corrected per explicit
request). All other stations are `'41SAB'`.

### Multi-Detail rotation logic (`App.jsx`)

Core building blocks (all near the top of `App.jsx`):

```js
const DATA_COUNT_PAGE_SIZES = {
  '10-5': [10, 5],
  '15': [Infinity],
  '5-5-5': [5, 5, 5],
}

function chunkStationRows(rows, dataCount) {
  // slices `rows` into pages per the size pattern above, dropping
  // any resulting empty page (so a 5-row station under "10 - 5" just
  // gets one 5-row page instead of a 10-row page + an empty one)
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

So for a 3-Detail-group station under `"10-5"` Data Count mode, `steps` is a
flat 6-entry array: `[D1×10, D1×5, D2×10, D2×5, D3×10, D3×5]`. Under `"15"`
(show everything, no flip) it's 3 entries (one page per Detail, no
sub-paging). Under `"5-5-5"` it's 9 entries (3 sub-pages per Detail × 3
Details).

**"Data Count"** switcher (`station-data-count`, Level 4 + Layout 5 only)
controls this sizing pattern globally for all 5 stations. Options: `10-5` /
`15` / `5-5-5`. **Default is `'15'`** — show every row at once, no flip —
confirmed with the user as the intended default (they'd asked for a default
of "14" at one point, which doesn't match any real option; clarified with
them that they actually meant the existing `'15'` default, no code change
needed).

**"Start Detail"** switcher — one per station (`start-detail-${station.code}`,
5 separate switcher entries, dynamically generated via
`swtStations.map(...)`). Lets each station's rotation open on Detail 1, 2, or
3 on page load instead of always Detail 1. Stored as one object in
`localStorage` keyed by station code:
```js
startDetailByStation = { 'SWT-01': '2', 'SWT-03': '3', ... }  // default {} = all '1'
```
Resolved in `SwtStationColumn`:
```js
const startDetailIndex = Number(startDetail) - 1
const initialStepIndex = steps.findIndex((s) => s.detailIndex === startDetailIndex) // or 0 if not found
```

### Synchronized flip (single shared tick)

**Important architectural point**: stations do **not** each run their own
independent timer anymore. There is exactly **one** shared tick, `flipTick`,
owned by the top-level `App` component:
```js
const [flipTick, setFlipTick] = useState(0)
useEffect(() => {
  if (layout !== 'layout-5') return
  const id = setInterval(() => setFlipTick((t) => t + 1), LAYOUT_FIVE_STEP_INTERVAL_MS) // 8000ms
  return () => clearInterval(id)
}, [layout])
```
`flipTick` is threaded down through `TrainingBoard` → `TrainingRangeBoard.jsx`
→ `ActiveLayout` (`LayoutFive`) → `SwtStationColumn` (Level 4) and used
directly in `LayoutFive`'s Level 2/3 branch. Each station computes its own
current step via simple modulo arithmetic against the *same* tick:
```js
const pageIndex = (initialStepIndex + flipTick) % steps.length
```
Because every station shares the exact same tick, **all columns flip at the
exact same moment** — but since each station can have a different
`steps.length` (a 5-row station has fewer steps than a 15-row one under the
same Data Count mode) and a different `initialStepIndex` (from Start Detail),
**the Detail label shown can still legitimately differ between stations at
any given instant** — that's expected, not a bug. Only the *timing* of the
flip is synchronized, not the displayed content.

This replaced an earlier design where every `SwtStationColumn` ran its own
`usePagedRows(...)` call independently — that's why `usePagedRows` has an
`initialIndex` parameter (4th arg, defaults to 0) that's now effectively
unused by this particular call site but still used by every other caller in
the file (`DetailPanel`, `LeaderboardPanel`, `LayoutTwo`'s triple detail
group) — don't remove it.

There's exactly **one progress bar** for this whole mechanism:
`<FlipProgressBar tick={flipTick} intervalMs={LAYOUT_FIVE_STEP_INTERVAL_MS} />`,
rendered once in `App.jsx` right after `<Header />`, shown whenever
`isTrainingLevel && layout === 'layout-5'`. It's a CSS animation
(`@keyframes flip-progress-fill`, `width: 0% -> 100%` over `intervalMs`), with
`key={tick}` on the fill element so React remounts (and thus restarts) the
animation on every tick — no per-frame JS re-render needed. CSS classes:
`.flip-progress-track` / `.flip-progress-fill`, full width, `height: 4px`,
sits flush under `.header`'s bottom border (in normal document flow, not
absolutely positioned — that was an earlier iteration, now removed).

### Height-lock (no shrink/grow on flip)

A CSS Grid row (`.layout-five { align-items: stretch }`) makes all 5 columns
match the tallest one automatically — but that only helps *across* columns,
not when a *single* column's own content changes height between its own
pages (e.g. "10 - 5" mode: 10 rows vs. 5 rows).

Fix, in `SwtStationColumn`:
```js
const hasUnevenPages = steps.length > 1 && steps.some((s) => s.rows.length !== steps[0].rows.length)
const columnRef = useRef(null)
const [minHeight, setMinHeight] = useState(0)
useEffect(() => {
  if (!hasUnevenPages || !columnRef.current) return
  const observer = new ResizeObserver(() => {
    setMinHeight((prev) => Math.max(prev, columnRef.current.getBoundingClientRect().height))
  })
  observer.observe(columnRef.current)
  return () => observer.disconnect()
}, [hasUnevenPages])
// ...
<section ref={columnRef} style={hasUnevenPages ? { minHeight } : undefined}>
```
**Why `ResizeObserver` and not a one-off `getBoundingClientRect()` on
mount**: the very first paint can happen before webfonts finish loading
(fallback-font metrics are shorter), which would lock in an undersized floor.
`ResizeObserver` keeps ratcheting the floor upward at whatever height the
column has *actually* reached, including after the font swap reflows the
text — verified this bug and the fix live (see git log commit
"Fix Layout 5 station column height consistency..."). Don't go back to a flat
px constant or a single snapshot — both were tried and found insufficient.

`"15"` and `"5-5-5"` Data Count modes don't need this (no flip, or every page
is already the same size) — `hasUnevenPages` naturally comes out `false` for
them.

### Column layout / rendering (`SwtStationColumn`)

Render order inside each `.station-column` card:
1. `StationColumnHead` — station code (left) + booking code (right), same row
2. `SwtStationInfo` — `mode, courseware` (left) + `startTime - endTime`
   (right), `justify-content: space-between` — **no longer 3 items**; Unit
   used to be a 3rd item here but was moved out (see next line)
3. **Unit line** (own paragraph, `.station-column-unit`) — `Unit: <strong>X</strong>`,
   shown only when `station.unit` exists AND `detailTitleMode !== 'unit'`
   (if Detail Title mode is "Unit", the unit *is* the title already, so this
   line would be redundant and is skipped)
4. `DetailPanel` — the actual trainee table, `title` is
   `detailTitleMode === 'unit' ? station.unit : \`Detail ${activeStep.detailIndex + 1}\``,
   `status={activeStep.status}` (drives the "Ongoing"/"Ready" pill)

Table columns (`splitRank` mode, used only by Layout 5): No / Rank / Name /
Status (only in `default`/`compact` table models) / Weapon / Lane. Widths
(`.station-column .table .X-cell`), current values in `index.css`:
- `.no-cell` — 24px
- `.rank-cell` — 36px ⚠️ **known issue**: at this width the "RANK" header
  clips to "RA…" in at least the headless-Chromium test environment. This
  was explicitly flagged to the user (see commit `f9135b6`'s message) and
  they were asked whether to keep 36px anyway — **not yet resolved**, worth
  raising again if it comes up.
- `.name-cell` — 90px
- `.weapon-cell` — 72px
- `.status-cell` — 66px (only relevant for non-`table2` models)
- `.lane-cell` — 40px, **also `text-align: center`**

All of these were set to *exact pixel values the user tested live in their
own browser devtools* (not estimated) — when the user gives you literal
devtools-measured px values again in the future, just apply them verbatim
rather than re-deriving; `table-layout: fixed` will proportionally scale
explicit widths up slightly if they don't sum to the container's full width
(observed ~1.05-1.18x in different rounds) — that's expected browser
behavior, not a bug to "fix".

**Lane column**: cell text has the redundant `"Lane "` prefix stripped down to
just the number (`row.lane.replace(/^Lane\s*/i, '')`), gated on the
`splitRank` prop (which is *only* ever passed from Layout 5's 2 call sites —
`SwtStationColumn` and the Level 2/3 placeholder branch — so it doubles as an
"is this Layout 5" flag). This same `splitRank`-gated logic is duplicated
across `DetailList.jsx`, `DetailListTable2.jsx`, `DetailListCompact.jsx` (the
3 table-model components Layout 5 can render — `DetailListCards.jsx` shows
lane as a card badge, untouched, out of scope). Whichever `tableModel` is
currently selected (global switcher, `default`/`card`/`table2`/`compact`)
determines which of these actually renders.

**"Ongoing" status pill styling**: `statusTone.js` already mapped `'Ongoing'`
to the same `'queue'` (amber) tone as `'Queue'`, but the inline class checks
in `DetailList.jsx` / `DetailListTable2.jsx` / `DetailListCompact.jsx` /
`DetailListCards.jsx` only checked `status === 'Queue'` literally — fixed to
also check `=== 'Ongoing'` in all 4 files. If you add another status string
that should render as the amber pill, update all 4 (and ideally just use
`statusTone(status) === 'queue'` instead of a duplicated string check next
time — this was left as literal string duplication to match the existing
pattern, not refactored).

### Header title (Level 4 only)

`Header.jsx`'s `title` prop, when it contains `\n`, is split into separate
`<div>` lines inside `.header-tab`. Level 4's title is now the 2-line
`"Specialized Weapon Trainer\nTraining Information Board"` (was the
single-line `"Specialized Weapon Training"`). The whole `.header` was
converted from `display:flex; justify-content:space-between` (2 children) to
a **3-column CSS Grid** (`grid-template-columns: 1fr auto 1fr`) with
`.header-tab` as the middle grid item — this makes the title sit **exactly**
centered on the bar regardless of how wide the left (brand/logo) and right
(clock/badge/live) groups are, rather than just filling the leftover flex
space next to the logo. This affects every level's header, not just Level
4's — verified Level 1's "Infoboard" single-line title also centers
correctly with no regression.

### Directory map toggle

`directory-visibility` switcher, Level 4 + Layout 5 only, **default
`'hidden'`**. Effect: `{(!isLevelFour || !hideDirectory) && <Directory .../>}`
— i.e. the toggle only ever affects Level 4; Level 2/3's own Layout 5 view
always shows the Directory unconditionally, regardless of this switcher's
value (by design, per explicit scoping decision this session).

### Other Layout-5-only switchers (all in the `level === 'level-4' && layout === 'layout-5'` gated group)

| id | label | options | default | effect |
|---|---|---|---|---|
| `no-column` | No Column | Visible/Hidden | Visible | hides the "No." row-number column |
| `directory-visibility` | Directory | Visible/Hidden | **Hidden** | see above |
| `swt03-session` | SWT-03 Session | Ongoing/Ended | Ongoing | Ended → SWT-03 becomes `StationGlobalLeaderboard` (gold-tinted card, `.station-column-leaderboard`) |
| `detail-label` | Detail Title | Detail/Unit | Detail | Unit → each station's title is its own unit code instead of "Detail N" |
| `station-data-count` | Data Count | 10-5/15/5-5-5 | **15** (show all, no flip) | see chunking logic above |
| `start-detail-SWT-0N` (×5) | `SWT-0N Start Detail` | Detail 1/2/3 | Detail 1 | which Detail a station's rotation opens on |

Plus, gated only on `layout === 'layout-5'` (any level):

| id | label | options | default |
|---|---|---|---|
| `table-font-size` | Table Font Size | Small 10px / Medium 12px / Large 15px | Medium |
| `detail-font-size` | Detail Name Font Size | **X-Small 11px** / Small 13px / Medium 15px / Large 19px | Medium |
| `station-font-size` | Base Station Font Size | Small 9px / Medium 11px / Large 14px | Medium |

These set CSS custom properties (`--l5-table-font-size` etc.) inline on
`.layout-five`, consumed throughout `index.css`.

**Leaderboard model switcher is hidden entirely on Layout 5** (`layout !==
'layout-5'` gate) — it only ever drove `LeaderboardPanel` in Layouts 1-3's
sidebar, which Layout 5 doesn't have (SWT-03's Global Leaderboard is a
separate hardcoded component), so it was a dead control there.

**Info Banner switcher default is now `'hidden'`** (was `'visible'`) — applies
to all training levels, not just Layout 5.

---

## Level 1 Lobby changes

- Booking data (`bookings` array) corrected against the latest spreadsheet —
  3 `endTime` fixes (CMT-01, CTT-02, CTT-03: 12:00 PM → 03:00 PM).
- **Announcements** (`AnnouncementPanel.jsx` + `announcements` in `data.js`)
  restructured per client feedback:
  - Removed the old "Range Day Highlight" entry entirely.
  - Added a generic photo-only card (`{ id: 'training-photo', hasImage: true
    }` — no caption, renders a decorative inline SVG via `RangeIllustration`).
  - Renamed "Range Do's and Don'ts" → **"Rules"**, with 5 bold-label bullets
    (Ballistic Compliance, Firearms Control, Protective Gear, Restricted
    Access, Identification) — exact copy is in `data.js`.
  - The old "Facility Notice" card was **removed from the static
    `announcements` array entirely** and replaced by a new operator-editable
    component.
- **`NoticeCard.jsx`** (new component) — renders after the static
  announcement cards. Shows "Notice" (not "Facility Notice", per request) with
  an Edit button → textarea → Save/Cancel. Persisted to
  `localStorage['infoboard-notice-text']`, one line per bullet
  (`notice.split('\n').filter(line => line.trim())`). Defaults to
  `DEFAULT_NOTICE_TEXT` (exported from `data.js`) until an operator saves
  their own text. This is the one part of the whole app an "operator" can
  edit live without a code change — it's meant to simulate the
  client's requested "TMRS must have a function where the operator is able
  to key in information... reflected in the Notice area" feature.

---

## Key architectural gotchas / lessons (don't re-learn these the hard way)

1. **`usePagedRows` resets `pageIndex` to 0 whenever its `rows` argument's
   *reference* changes** (its internal `useEffect` is keyed on `[rows,
   pageSize, initialIndex]`). Any array passed to it MUST be memoized
   (`useMemo`) with stable deps, or the rotation will appear frozen /
   reset every render instead of advancing.
2. **Can't call hooks inside `.map()`.** Any component needing its own
   `useState`/`useEffect`/`usePagedRows`/`useRef` per array item (e.g. per
   station) must be extracted into its own component (`SwtStationColumn` is
   exactly this — split out specifically so each station's hooks are valid
   per-instance calls, not calls-inside-a-loop).
3. **CSS specificity when overriding a shared rule**: `.station-column
   .table th:last-child` (has a `th`/`td` type selector) has *higher*
   specificity than `.station-column .table .lane-cell` (no type selector)
   even though both have "3 class-level things" — had to match the type
   selector (`th.lane-cell`, `td.lane-cell`) to actually win via source
   order. If a new cell-width override doesn't seem to apply, check this
   first.
4. **`ResizeObserver` beats a single `getBoundingClientRect()` snapshot**
   for "lock in the tallest height this element reaches" — webfont load
   timing means a snapshot taken too early can be wrong. See the height-lock
   section above.
5. **`table-layout: fixed` proportionally scales all explicit column widths
   up** if their sum is less than the container's actual rendered width and
   no column is left `auto` to absorb the slack. Confirmed expected/harmless
   multiple times this session — don't chase it as a bug.
6. **Dev/preview server flakiness in this environment**: the exact sequence
   `pkill -f "vite preview"` → `nohup npx vite preview --port 4173
   --strictPort > /tmp/preview.log 2>&1 & disown` → `sleep 4` → `curl` check
   reliably **fails on the first attempt** (connection refused / exit 144)
   and needs the *exact same* `nohup ... & disown` + `curl` sequence run a
   **second time** to actually succeed. This isn't a bug in your command —
   just re-run it once.
7. **Playwright verification pattern used throughout**: `playwright-core`,
   `executablePath: '/opt/pw-browsers/chromium'`, run via `NODE_PATH=/home/user/infoboard/node_modules
   node <script>.cjs` (the script must NOT live inside the repo — scratch
   scripts go in the session scratchpad dir and get deleted after use).
   Every visual/behavioral change in this session was verified this way
   (DOM assertions + screenshots) before committing — keep doing that.

---

## File map (touched this session)

```
src/
  App.jsx                          — central orchestrator, ~1400 lines, see above
  data.js                          — all static data (bookings, swtStations, announcements, etc.)
  index.css                        — all styling, ~2000 lines, no CSS modules/styled-components
  statusTone.js                    — status string -> CSS tone name mapping
  hooks/
    usePagedRows.js                — generic paged-rotation hook, now takes optional initialIndex
  components/
    Header.jsx                     — 3-column grid header, multi-line title support
    NoticeCard.jsx                 — NEW, operator-editable Notice
    AnnouncementPanel.jsx          — renders announcement cards + <NoticeCard/>
    DetailList.jsx                 — "Default Table" model, now accepts splitRank
    DetailListTable2.jsx           — "Table 2.0" model, now accepts splitRank
    DetailListCompact.jsx          — "Compact" model, now accepts splitRank
    DetailListCards.jsx            — "Card" model (lane badge unaffected by splitRank changes)
    (all the Leaderboard*.jsx, Directory.jsx, BookingList.jsx, LobbyBoard.jsx, etc. — untouched this session)
  levels/
    TrainingRangeBoard.jsx         — shared wrapper for Level 2/3/4, threads all the Layout-5 props through
    CmtBoard.jsx / CttBoard.jsx / SwtBoard.jsx — thin wrappers around TrainingRangeBoard, currently identical
```

## Verification workflow used every time (keep following this)

1. `npm run build` (must succeed, no errors)
2. Restart preview server (expect the flaky-first-attempt pattern above)
3. Playwright: set `localStorage` directly (level/layout/switcher keys),
   reload, assert DOM state / take screenshots, sample at multiple
   timestamps if verifying a rotation/animation
4. Clean up scratch `.cjs`/`.png` files, `pkill -f "vite preview"`
5. `git add` the specific changed files (never `git add -A`), commit with a
   multi-paragraph message explaining the *why*, ending with:
   ```
   Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
   Claude-Session: https://claude.ai/code/session_01AgfEwg3qtfaNHZCx2zuZa8
   ```
6. `git push -u origin claude/frontend-duplication-9a77fl`
7. Reply to the user in Bahasa Indonesia (established language for this
   conversation), concise, confirming what changed and how it was verified.

## Open items / things the user may come back to

- **Rank column clipping at 36px** ("RANK" → "RA…") — flagged, not resolved,
  user hasn't given final direction (keep as-is, or widen slightly).
- No other known open bugs as of the last commit (`ac93753`).
