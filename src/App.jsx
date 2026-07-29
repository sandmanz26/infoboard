import { useEffect, useMemo, useRef, useState } from 'react'
import {
  detailList,
  podium,
  leaderboard,
  stations,
  swtStations,
  cmtStations,
  cmtStationColumns,
  cttStations,
  cttStationColumnsByZone,
  cttZones,
} from './data.js'
import Header from './components/Header.jsx'
import InfoBanner from './components/InfoBanner.jsx'
import DetailList from './components/DetailList.jsx'
import DetailListTable2 from './components/DetailListTable2.jsx'
import DetailListCards from './components/DetailListCards.jsx'
import DetailListCompact from './components/DetailListCompact.jsx'
import TopThree from './components/TopThree.jsx'
import Directory from './components/Directory.jsx'
import CmtDirectory from './components/CmtDirectory.jsx'
import CttDirectory from './components/CttDirectory.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import LeaderboardCompact from './components/LeaderboardCompact.jsx'
import LeaderboardCards from './components/LeaderboardCards.jsx'
import LeaderboardTicker from './components/LeaderboardTicker.jsx'
import CombinedDetailList from './components/CombinedDetailList.jsx'
import StationsOverview from './components/StationsOverview.jsx'
import LobbyBoard from './components/LobbyBoard.jsx'
import LeaderboardFloorBoard from './components/LeaderboardFloorBoard.jsx'
import LayoutSwitcher from './components/LayoutSwitcher.jsx'
import PageDots from './components/PageDots.jsx'
import usePagedRows from './hooks/usePagedRows.js'
import { LEVELS } from './levels/levelConfig.js'
import CmtBoard from './levels/CmtBoard.jsx'
import CttBoard from './levels/CttBoard.jsx'
import SwtBoard from './levels/SwtBoard.jsx'

// Global (every level) — this board runs on both a 65" TV (fixed
// resolution, no keyboard/mouse, must never scroll — any overflow just
// gets cut off on a real signage screen) and a laptop browser (fine to
// scroll like a normal page). "TV" scales the whole board down to fit
// the viewport exactly instead of overflowing — see FitToScreen below.
const DISPLAY_OPTIONS = [
  { id: 'laptop', label: 'Laptop', description: 'Normal browser window — scrolls if content is taller than the viewport' },
  { id: 'tv', label: 'TV (65")', description: 'Scales the whole board down to fit the screen exactly — never scrolls' },
]

const LEADERBOARD_PAGE_SIZE = 5
const LEADERBOARD_PAGE_INTERVAL_MS = 6000
const DETAIL_GROUPS_PER_PAGE = 3
const DETAIL_GROUP_PAGE_INTERVAL_MS = 6000
const DETAIL_ROWS_PER_PAGE = 10
const DETAIL_ROWS_PAGE_INTERVAL_MS = 5000

// Levels 2-4 (CMT/CTT/SWT) all render the same board today but live in
// separate files under src/levels/ so each can grow its own rules.
const TRAINING_BOARD_COMPONENTS = {
  'level-2': CmtBoard,
  'level-3': CttBoard,
  'level-4': SwtBoard,
}

// Each level is a separate physical LCD (one per floor). This app renders
// whichever one is selected — Level 1 is the lobby, Levels 2-4 (CMT/CTT/SWT)
// all show the same training range board. Nothing here auto-advances; the
// Level switcher is how a demo viewer picks which floor's screen to look at.

const LAYOUTS = [
  { id: 'layout-1', label: 'Layout 1', description: 'Default — single detail list' },
  { id: 'layout-2', label: 'Layout 2', description: '3 detail lists + podium + directory' },
  { id: 'layout-3', label: 'Layout 3', description: 'Combined detail list + directory + leaderboard' },
  { id: 'layout-4', label: 'Layout 4', description: 'Overview of all 4 base stations at once' },
  { id: 'layout-5', label: 'Layout 5', description: '5 base station columns, no directory/leaderboard sidebar' },
]

// Layout 5: one column per base station (no Directory/Leaderboard sidebar
// here — each station is its own self-contained detail board).
// Level 2/3 still use a shared placeholder roster that flips
// Detail 1 (10 rows) -> Detail 1 (5 rows) -> Detail 2 (10) -> Detail 2 (5).
// Level 4 uses swtStations' real per-station data instead — see
// LayoutFive below.
// Unit + courseware are shown under each column's base station name so
// the booking that station is currently running is clear at a glance.
const LAYOUT_FIVE_STATIONS = [
  { name: 'Base Station 1', unit: '2 SIR', courseware: 'ATP (SAR21)' },
  { name: 'Base Station 2', unit: '2 SIR', courseware: 'CSM (SAR21)' },
  { name: 'Base Station 3', unit: '3 SIR', courseware: 'APS (SAR21)' },
  { name: 'Base Station 4', unit: '4 SIR', courseware: 'BTP (SAR21)' },
  { name: 'Base Station 5', unit: '4 SIR', courseware: 'ATP (SAR21)' },
]
const LAYOUT_FIVE_DETAILS = [
  { title: 'Detail 1', status: 'Ready' },
  { title: 'Detail 2', status: 'Queue' },
]
// One shared cadence for every Layout 5 column (Level 2/3's placeholder
// rotation and Level 4's per-station rotation both flip on this same
// beat now, driven by a single tick — see `flipTick` in the App
// component and the single progress bar rendered under the header).
const LAYOUT_FIVE_STEP_INTERVAL_MS = 8000

// Level 3 (CTT) only — how long each Zone "page" stays on screen before
// auto-advancing to the next one (Zone A -> B -> C -> D1 -> D2 -> repeat),
// like an airport board cycling through gates. Independent from
// LAYOUT_FIVE_STEP_INTERVAL_MS, which keeps flipping each cabin's own
// Detail rotation *within* whichever Zone page is currently showing.
const CTT_ZONE_ROTATE_INTERVAL_MS = 20000

function layoutFiveSteps(rows) {
  return LAYOUT_FIVE_DETAILS.flatMap((detail) => [
    { detail, rows: rows.slice(0, DETAIL_ROWS_PER_PAGE), paginated: true },
    { detail, rows: rows.slice(DETAIL_ROWS_PER_PAGE), paginated: true },
  ])
}

const TABLE_MODELS = [
  { id: 'default', label: 'Default Table', description: 'Original detail list table' },
  { id: 'card', label: 'Card Model', description: 'Compact card grid per trainee' },
  { id: 'table2', label: 'Table 2.0', description: 'Merged rank + name, no status column' },
  { id: 'compact', label: 'Compact (No Scroll)', description: 'All 15 rows in one dense table, no rotation or scrolling' },
]

const LEADERBOARD_MODELS = [
  { id: 'table', label: 'Table', description: 'Full ranking table with columns' },
  { id: 'compact', label: 'Compact List', description: 'Dense single-line ranked list' },
  { id: 'cards', label: 'Stat Cards', description: 'One card per trainee with score + MPI' },
  { id: 'ticker', label: 'Ticker', description: 'Dark departures-board style strip' },
]

const SLIDESHOW_INTERVALS = [
  { id: '0', label: 'Off', description: 'Stay on the current base station' },
  { id: '5', label: '5s', description: 'Advance to the next station every 5 seconds' },
  { id: '10', label: '10s', description: 'Advance to the next station every 10 seconds' },
  { id: '15', label: '15s', description: 'Advance to the next station every 15 seconds' },
  { id: '30', label: '30s', description: 'Advance to the next station every 30 seconds' },
]

// Level 1 (Lobby) only — how often the booking table rotates to the next
// training level (Level 2 -> 3 -> 4 -> repeat).
const LOBBY_INTERVAL_OPTIONS = [
  { id: '5', label: '5s', description: 'Rotate to the next level every 5 seconds' },
  { id: '8', label: '8s', description: 'Rotate to the next level every 8 seconds' },
  { id: '10', label: '10s', description: 'Rotate to the next level every 10 seconds' },
  { id: '15', label: '15s', description: 'Rotate to the next level every 15 seconds' },
  { id: '30', label: '30s', description: 'Rotate to the next level every 30 seconds' },
  { id: '45', label: '45s', description: 'Rotate to the next level every 45 seconds' },
]

// Leaderboard floor only — 5-way column width ratio: Local Leaderboard,
// then each of the 4 Global courseware panels. Values are plain fr-unit
// weights (they don't need to sum to 100 — CSS grid normalizes them),
// entered as given: (a) doesn't need adjusting, (b) and (c) are used
// exactly as specified even though (b)'s 4 remainder shares (17 each)
// don't add back up to a clean 100 with the 30 share.
const LEADERBOARD_PROPORTION_OPTIONS = [
  { id: 'a', label: '40 : 15 : 15 : 15 : 15', description: 'Local 40%, each Global courseware panel 15%', ratios: [40, 15, 15, 15, 15] },
  { id: 'b', label: '30 : 17 : 17 : 17 : 17', description: 'Local 30%, each Global courseware panel 17%', ratios: [30, 17, 17, 17, 17] },
  {
    id: 'c',
    label: '25 : 18.75 : 18.75 : 18.75 : 18.75',
    description: 'Local 25%, each Global courseware panel 18.75%',
    ratios: [25, 18.75, 18.75, 18.75, 18.75],
  },
]

// Leaderboard floor only — hide the Local panel's Top 3 podium and show
// its table starting from rank 1 instead.
const LEADERBOARD_PODIUM_OPTIONS = [
  { id: 'visible', label: 'Visible', description: 'Show the Top 3 podium above the Local table' },
  { id: 'hidden', label: 'Hidden', description: 'Hide the podium — the Local table covers every rank' },
]

// Leaderboard floor only — how many of the 4 Global courseware panels
// show. Fewer panels stretch to fill the row instead of leaving a gap
// (see LeaderboardFloorBoard's gridTemplateColumns — it only takes as
// many ratio weights as there are panels on screen, so CSS grid's fr
// units re-normalize against that smaller total on their own).
const LEADERBOARD_GLOBAL_COUNT_OPTIONS = [
  { id: '1', label: '1', description: 'Show only the first Global courseware panel, stretched full width' },
  { id: '2', label: '2', description: 'Show 2 Global courseware panels, each stretched wider' },
  { id: '3', label: '3', description: 'Show 3 Global courseware panels' },
  { id: '4', label: '4', description: 'Show all 4 Global courseware panels' },
]

// Leaderboard floor only — one scale factor multiplies every panel's
// banner/info/podium/table text sizes via calc() (see the .layout-
// leaderboard-floor rules in index.css), keeping their relative
// proportions instead of needing a separate absolute size per element.
const LEADERBOARD_FONT_SIZE_OPTIONS = [
  { id: 'small', label: 'Small', description: 'Shrink all text on this floor', scale: 0.85 },
  { id: 'medium', label: 'Medium', description: 'Default text size', scale: 1 },
  { id: 'large', label: 'Large', description: 'Enlarge all text on this floor', scale: 1.2 },
]

// Leaderboard floor only — how many winners each Global courseware panel
// shows. Every courseware carries 15 rows of data, so picking one count
// here shows that many rows on every panel at once — keeping their
// heights equal instead of each panel sizing to its own row count.
const LEADERBOARD_GLOBAL_ROWS_OPTIONS = [
  { id: '5', label: 'Top 5', description: 'Show the top 5 winners on every Global panel' },
  { id: '10', label: 'Top 10', description: 'Show the top 10 winners on every Global panel' },
  { id: '15', label: 'Top 15', description: 'Show the top 15 winners on every Global panel' },
]

// Leaderboard floor only — how many local trainees the Local panel shows
// in total (podium positions count toward this when it's visible, same
// as LEADERBOARD_GLOBAL_ROWS_OPTIONS does for the Global panels).
const LEADERBOARD_LOCAL_ROWS_OPTIONS = [
  { id: '5', label: 'Top 5', description: 'Show the top 5 local trainees' },
  { id: '10', label: 'Top 10', description: 'Show the top 10 local trainees' },
  { id: '15', label: 'Top 15', description: 'Show the top 15 local trainees' },
]

// Leaderboard floor only — only meaningful when Global Panels is set to
// 2 (so there are 4 courseware split into 2 pairs). When on, the 2
// visible panels swap to the other pair of courseware every
// LEADERBOARD_SLIDE_INTERVAL_MS, cycling pair 1/2 -> pair 3/4 -> repeat,
// instead of always showing the same first 2 courseware.
const LEADERBOARD_SLIDE_OPTIONS = [
  { id: 'off', label: 'Off', description: 'Always show the same 2 courseware panels' },
  { id: 'on', label: 'On', description: 'Swap to the other 2 courseware panels every 8 seconds' },
]
const LEADERBOARD_SLIDE_INTERVAL_MS = 8000

// The blue info strip under the header (Levels 2-4 only).
const INFO_BANNER_OPTIONS = [
  { id: 'visible', label: 'Visible', description: 'Show the info banner below the header' },
  { id: 'hidden', label: 'Hidden', description: 'Hide the info banner below the header' },
]

// Level 2 (CMT) only — how a "No Booking" cabin's disabled card looks.
const CMT_NOT_AVAILABLE_STYLE_OPTIONS = [
  { id: 'muted', label: 'Muted', description: 'Grey, slightly faded card background (default)' },
  { id: 'white', label: 'White', description: 'Plain white card background, same as a booked card' },
]

// Level 4 + Layout 5 only — hide the row-number column in each station's
// detail table.
const NO_COLUMN_OPTIONS = [
  { id: 'visible', label: 'Visible', description: 'Show the No. column' },
  { id: 'hidden', label: 'Hidden', description: 'Hide the No. column' },
]

// Level 4 + Layout 5 only — SWT-03 doubles as a Global Leaderboard once
// its session ends; while a session is still running it looks like any
// other station.
const SWT03_SESSION_OPTIONS = [
  { id: 'ongoing', label: 'Ongoing', description: 'SWT-03 shows its trainee roster like every other station' },
  { id: 'ended', label: 'Ended', description: 'SWT-03 shows the Global Leaderboard instead' },
]

// Level 4 + Layout 5 only — the Directory map spans the full row below
// the 5 station columns; Level 2/3's own Layout 5 always shows it.
const DIRECTORY_OPTIONS = [
  { id: 'visible', label: 'Visible', description: 'Show the Directory map below the station columns' },
  { id: 'hidden', label: 'Hidden', description: 'Hide the Directory map' },
]

// Level 3 (CTT) only — the Start Zone switcher only lists zones that
// actually have station data (see cttStationColumnsByZone in data.js) as
// a starting point for the auto-rotation. Zone B/C/D2 will show up here
// automatically once their data is added — until then the rotation still
// pages through them (see zoneTick in App), just showing an empty page.
const CTT_ZONES_WITH_DATA = cttZones.filter((z) => cttStationColumnsByZone[z.id])

// The source floor sheet shows each physical column of cabins already
// mid-way through a different point in its own Detail 1/Detail 2 cycle
// (column 1 on Detail 1's leaderboard, column 2 on Detail 2's roster,
// column 3 already on Detail 2's leaderboard) rather than every cabin
// starting from Detail 1 in lockstep. Seeding these as the default Start
// Detail (still fully overridable via the per-station switcher) makes the
// board match that reference on first load instead of needing manual setup.
const CTT_DEFAULT_START_DETAIL = Object.fromEntries(
  ['A05', 'A06', 'A07', 'A08', 'A09', 'A10', 'A11', 'A12', 'D05', 'D06', 'D07', 'D08', 'D09', 'D10', 'D11', 'D12'].map(
    (code) => [code, '2']
  )
)

// Level 4 + Layout 5 only — which Detail group a station's rotation
// begins from on page load (e.g. SWT-01 opens straight into Detail 2
// instead of always starting at Detail 1), one switcher per station.
const START_DETAIL_OPTIONS = [
  { id: '1', label: 'Detail 1', description: "Start this station's rotation from Detail 1" },
  { id: '2', label: 'Detail 2', description: "Start this station's rotation from Detail 2" },
  { id: '3', label: 'Detail 3', description: "Start this station's rotation from Detail 3" },
]

// Level 4 + Layout 5 only — swaps each station's "Detail 1" title for
// its own unit code (e.g. "41SAB"). Real per-station data has no second
// detail group to flip to, so "Unit" isn't a variant of the flip — it
// replaces it, always showing the one static label.
const DETAIL_LABEL_OPTIONS = [
  { id: 'detail', label: 'Detail', description: 'Show "Detail 1" above each station\'s roster' },
  { id: 'unit', label: 'Unit', description: 'Show the station\'s unit code (e.g. "41SAB") instead of "Detail 1"' },
]

// Level 4 + Layout 5 only — how each station's own roster pages/flips
// over time, independent of how many rows that station actually has.
// A station with fewer rows than a page needs just skips the empty
// page (e.g. a 5-row station never flips under "10 - 5" or "5-5-5").
const DATA_COUNT_OPTIONS = [
  { id: '10-5', label: '10 - 5', description: 'Show 10 rows, then flip to the remaining rows a few seconds later' },
  { id: '15', label: '15', description: 'Show every row at once, no flip' },
  { id: '5-5-5', label: '5 - 5 - 5', description: 'Show 5 rows, then flip to the next 5, then the next 5' },
]

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
    if (page.length > 0) pages.push(page)
    offset += size
  }
  return pages.length > 0 ? pages : [rows]
}

// Stations without a `details` array are treated as a single implicit
// Detail 1 group (status "Ready"), matching every station's behavior
// before multi-Detail rotation existed. Each group is paginated by the
// same Data Count pattern, then all groups' pages are concatenated into
// one flat step sequence — e.g. 3 groups under "10 - 5" is 6 steps:
// Detail 1 x10, Detail 1 x5, Detail 2 x10, Detail 2 x5, Detail 3 x10,
// Detail 3 x5 — so a single per-station pagination timer drives both the
// within-Detail flip and the Detail-to-Detail flip.
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

// Layout 5 only — independent font-size controls for the 3 text sizes
// on screen: the trainee table, the "Detail N" title, and the base
// station name at the top of each column.
const TABLE_FONT_SIZE_OPTIONS = [
  { id: 'small', label: 'Small', value: '10px' },
  { id: 'medium', label: 'Medium', value: '12px' },
  { id: 'large', label: 'Large', value: '15px' },
]
const DETAIL_FONT_SIZE_OPTIONS = [
  { id: 'xsmall', label: 'X-Small', value: '11px' },
  { id: 'small', label: 'Small', value: '13px' },
  { id: 'medium', label: 'Medium', value: '15px' },
  { id: 'large', label: 'Large', value: '19px' },
]
const STATION_FONT_SIZE_OPTIONS = [
  { id: 'small', label: 'Small', value: '9px' },
  { id: 'medium', label: 'Medium', value: '11px' },
  { id: 'large', label: 'Large', value: '14px' },
]

// Left container (combined detail list) vs. right container (directory
// map + leaderboard) width split — only Layout 3 pairs those two panels.
const PANEL_RATIOS = [
  { id: '55-45', label: '55 : 45', description: 'Detail list 55% / Directory + Leaderboard 45%', left: 55, right: 45 },
  { id: '60-40', label: '60 : 40', description: 'Detail list 60% / Directory + Leaderboard 40%', left: 60, right: 40 },
  { id: '65-35', label: '65 : 35', description: 'Detail list 65% / Directory + Leaderboard 35%', left: 65, right: 35 },
  { id: '70-30', label: '70 : 30', description: 'Detail list 70% / Directory + Leaderboard 30%', left: 70, right: 30 },
]

// How many "Detail N" columns the Layout 3 combined table carries.
// 1-3 all fit side by side; 4-6 page 3-at-a-time on the same rotating
// pattern as the Leaderboard, instead of squeezing extra columns in.
const DETAIL_COUNTS = [
  { id: '1', label: '1', description: 'Single detail column' },
  { id: '2', label: '2', description: 'Two detail columns side by side' },
  { id: '3', label: '3', description: 'Three detail columns side by side' },
  { id: '4', label: '4', description: 'Pages 3 at a time, like the leaderboard' },
  { id: '5', label: '5', description: 'Pages 3 at a time, like the leaderboard' },
  { id: '6', label: '6', description: 'Pages 3 at a time, like the leaderboard' },
]

// Which panels show in the right-hand column — Layouts 1-3 all share the
// same sidebar, just with different components hardcoded on previously.
// Now it's one shared choice instead of baked into each layout.
const RIGHT_PANEL_COMPONENTS = [
  { id: 'top3', label: 'Top 3 Leaderboard', description: 'Podium-style top 3 finishers' },
  { id: 'leaderboard', label: 'Table Leaderboard', description: 'Full ranked leaderboard (Table/Compact/Cards/Ticker)' },
  { id: 'directory', label: 'Directory', description: 'Base station map' },
]

const SYSTEM_STACK = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

// All three are self-hosted (bundled with the build, no font CDN) and
// picked specifically for on-screen reading at a distance rather than
// for decoration — this board is read, not admired.
const FONTS = [
  {
    id: 'system',
    label: 'System Default',
    description: "Uses the display device's own UI font",
    stack: SYSTEM_STACK,
  },
  {
    id: 'inter',
    label: 'Inter',
    description: 'Tall x-height, open counters — built for dense on-screen data',
    stack: `"Inter", ${SYSTEM_STACK}`,
  },
  {
    id: 'atkinson',
    label: 'Atkinson Hyperlegible',
    description: 'Designed by the Braille Institute to maximize character clarity at a distance',
    stack: `"Atkinson Hyperlegible", ${SYSTEM_STACK}`,
  },
  {
    id: 'public-sans',
    label: 'Public Sans',
    description: 'US federal design-system typeface, tuned for civic signage',
    stack: `"Public Sans", ${SYSTEM_STACK}`,
  },
]

const LAYOUT_STORAGE_KEY = 'infoboard-layout'
const TABLE_MODEL_STORAGE_KEY = 'infoboard-table-model'
const LEADERBOARD_MODEL_STORAGE_KEY = 'infoboard-leaderboard-model'
const SLIDESHOW_STORAGE_KEY = 'infoboard-slideshow-interval'
const LOBBY_INTERVAL_STORAGE_KEY = 'infoboard-lobby-interval'
const LEADERBOARD_PROPORTION_STORAGE_KEY = 'infoboard-leaderboard-proportion'
const LEADERBOARD_PODIUM_STORAGE_KEY = 'infoboard-leaderboard-podium'
const LEADERBOARD_GLOBAL_COUNT_STORAGE_KEY = 'infoboard-leaderboard-global-count'
const LEADERBOARD_FONT_SIZE_STORAGE_KEY = 'infoboard-leaderboard-font-size'
const LEADERBOARD_GLOBAL_ROWS_STORAGE_KEY = 'infoboard-leaderboard-global-rows'
const LEADERBOARD_LOCAL_ROWS_STORAGE_KEY = 'infoboard-leaderboard-local-rows'
const LEADERBOARD_SLIDE_STORAGE_KEY = 'infoboard-leaderboard-slide'
const DISPLAY_STORAGE_KEY = 'infoboard-display'
const PANEL_RATIO_STORAGE_KEY = 'infoboard-panel-ratio'
const FONT_STORAGE_KEY = 'infoboard-font'
const DETAIL_COUNT_STORAGE_KEY = 'infoboard-detail-count'
const LEVEL_STORAGE_KEY = 'infoboard-level'
const RIGHT_PANEL_STORAGE_KEY = 'infoboard-right-panel'
const INFO_BANNER_STORAGE_KEY = 'infoboard-info-banner'
const NO_COLUMN_STORAGE_KEY = 'infoboard-no-column'
const DIRECTORY_STORAGE_KEY = 'infoboard-layout5-directory'
const START_DETAIL_STORAGE_KEY = 'infoboard-layout5-start-detail'
const SWT03_SESSION_STORAGE_KEY = 'infoboard-swt03-session'
const CMT_LEADERBOARD_SESSION_STORAGE_KEY = 'infoboard-cmt-leaderboard-session'
const CMT_NOT_AVAILABLE_STYLE_STORAGE_KEY = 'infoboard-cmt-not-available-style'
const DETAIL_LABEL_STORAGE_KEY = 'infoboard-detail-label'
const STATION_DATA_COUNT_STORAGE_KEY = 'infoboard-station-data-count'
const TABLE_FONT_SIZE_STORAGE_KEY = 'infoboard-layout5-table-font-size'
const DETAIL_FONT_SIZE_STORAGE_KEY = 'infoboard-layout5-detail-font-size'
const STATION_FONT_SIZE_STORAGE_KEY = 'infoboard-layout5-station-font-size'
const CTT_ZONE_STORAGE_KEY = 'infoboard-ctt-zone'

function DisplayIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="1.5" y="3" width="17" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 17h6M10 14v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function LayoutIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="currentColor">
      <rect x="2" y="2" width="7" height="16" rx="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function TableModelIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="2" y="3" width="16" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 8h16M8 8v9" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function LeaderboardIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <path
        d="M4 17V9M10 17V3M16 17v-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SlideshowIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 5.5V10l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InfoBannerIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 9v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="10" cy="6.4" r="1.05" fill="currentColor" />
    </svg>
  )
}

function NoColumnIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="2" y="3" width="16" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 8h5M2 13h5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 4.5 5.5 15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function DirectoryIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <path d="M10 2.5 3 5.5v9L10 17.5l7-3v-9L10 2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 2.5v15M3 5.5l7 3 7-3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function DetailLabelIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <path
        d="M3 5.5 8 3l9 4.5-9 4.5-9-4.5 4-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M3 10.5 8 13l9-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 14.5 8 17l9-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function FontSizeIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <path
        d="M2.5 14.5 6 5.5h1L10.5 14.5M3.6 11.5h5.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 14.5V9.2h2a1.65 1.65 0 0 1 0 3.3h-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RatioIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="2" y="4" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="4" width="4" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function DetailCountIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="2" y="4" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="8" y="4" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="4" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function LevelIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="3" y="2" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="8" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="14" width="14" height="4" rx="1" fill="currentColor" />
    </svg>
  )
}

function RightPanelIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <rect x="2" y="3" width="9" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13" y="3" width="5" height="6" rx="1" fill="currentColor" />
      <rect x="13" y="11" width="5" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function TypographyIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" fill="none">
      <path
        d="M4 16 8.2 5h1.1L13.5 16M5.4 12.3h6.5M14 8h3M14 11h3M14 14h2.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// A single detail table only ever shows 10 rows at once — with 15
// trainees in the roster, the last 5 page in on their own rotating page
// a couple seconds later rather than being squeezed into the same table.
// "Compact" is the exception: all 15 rows at once, dense enough to need
// neither rotation nor scrolling — built for TV displays. `fullRows`
// forces that same all-15-at-once behavior for any table model (used by
// Layout 5 / Level 4, where the only flip should be Detail 1 -> Detail 2,
// not a second row-level rotation nested inside it).
function DetailPanel({ tableModel, rows, title, status, hideNo, fullRows, splitRank }) {
  const { page, pageIndex, pageCount } = usePagedRows(rows, DETAIL_ROWS_PER_PAGE, DETAIL_ROWS_PAGE_INTERVAL_MS)
  const displayRows = fullRows ? rows : page
  const displayPageIndex = fullRows ? undefined : pageIndex
  const displayPageCount = fullRows ? undefined : pageCount
  if (tableModel === 'card') {
    return (
      <DetailListCards
        rows={displayRows}
        title={title}
        status={status}
        pageIndex={displayPageIndex}
        pageCount={displayPageCount}
        hideNo={hideNo}
      />
    )
  }
  if (tableModel === 'table2') {
    return (
      <DetailListTable2
        rows={displayRows}
        title={title}
        status={status}
        pageIndex={displayPageIndex}
        pageCount={displayPageCount}
        hideNo={hideNo}
        splitRank={splitRank}
      />
    )
  }
  if (tableModel === 'compact') {
    return <DetailListCompact rows={rows} title={title} status={status} hideNo={hideNo} splitRank={splitRank} />
  }
  return (
    <DetailList
      rows={displayRows}
      title={title}
      status={status}
      pageIndex={displayPageIndex}
      pageCount={displayPageCount}
      hideNo={hideNo}
      splitRank={splitRank}
    />
  )
}

function LeaderboardPanel({ leaderboardModel, rows }) {
  const { page, pageIndex, pageCount } = usePagedRows(
    rows,
    LEADERBOARD_PAGE_SIZE,
    LEADERBOARD_PAGE_INTERVAL_MS
  )
  if (leaderboardModel === 'compact') {
    return <LeaderboardCompact rows={page} pageIndex={pageIndex} pageCount={pageCount} />
  }
  if (leaderboardModel === 'cards') {
    return <LeaderboardCards rows={page} pageIndex={pageIndex} pageCount={pageCount} />
  }
  if (leaderboardModel === 'ticker') {
    return <LeaderboardTicker rows={page} pageIndex={pageIndex} pageCount={pageCount} />
  }
  return <Leaderboard rows={page} pageIndex={pageIndex} pageCount={pageCount} />
}

// Shared right-hand sidebar for Layouts 1-3 — which of the 3 panels show
// (and in this fixed order) is controlled by the Right Panel switcher
// instead of being hardcoded differently per layout. Renders nothing at
// all once every panel is hidden, so the caller can give the table the
// full row width instead of leaving an empty column.
function RightColumn({ components, leaderboardModel, activeStation }) {
  if (components.length === 0) return null
  return (
    <div className="right-col">
      {components.includes('top3') && (
        <section className="panel podium-panel">
          <TopThree data={podium} />
        </section>
      )}
      {components.includes('leaderboard') && (
        <section className="panel leaderboard-panel">
          <LeaderboardPanel leaderboardModel={leaderboardModel} rows={leaderboard} />
        </section>
      )}
      {components.includes('directory') && (
        <section className="panel directory-panel">
          <Directory activeStation={activeStation} />
        </section>
      )}
    </div>
  )
}

function TripleDetailPanels({ tableModel, groups }) {
  return (
    <>
      {groups.map((group) => (
        <section key={group.title} className="panel detail-panel detail-panel-compact">
          <DetailPanel tableModel={tableModel} rows={group.rows} title={group.title} status={group.status} />
        </section>
      ))}
    </>
  )
}

// With no right-panel components enabled, the table takes the full row
// width instead of leaving the ratio's sidebar share empty.
function mainGridStyle(ratio, hasSidebar) {
  return hasSidebar
    ? { '--detail-fr': `${ratio.left}fr`, '--sidebar-fr': `${ratio.right}fr` }
    : { gridTemplateColumns: '1fr' }
}

function LayoutOne({ tableModel, leaderboardModel, panelRatio, rightPanelComponents, activeStation }) {
  const ratio = PANEL_RATIOS.find((r) => r.id === panelRatio) ?? PANEL_RATIOS[1]
  const hasSidebar = rightPanelComponents.length > 0
  return (
    <main className="layout" style={mainGridStyle(ratio, hasSidebar)}>
      <section className="panel detail-panel">
        <DetailPanel tableModel={tableModel} rows={detailList} title="Detail List" status="Ready" />
      </section>
      <RightColumn components={rightPanelComponents} leaderboardModel={leaderboardModel} activeStation={activeStation} />
    </main>
  )
}

function LayoutTwo({ tableModel, activeStation, panelRatio, detailCount, rightPanelComponents, leaderboardModel }) {
  const ratio = PANEL_RATIOS.find((r) => r.id === panelRatio) ?? PANEL_RATIOS[1]
  const count = Number(detailCount) || 3
  // Only the first detail is actively running (Ready); the rest are
  // queued up behind it. Memoized so usePagedRows (which resets to page 0
  // whenever its `rows` reference changes) doesn't see a "new" array —
  // and reset itself — on every tick of its own rotation timer.
  const allGroups = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        title: `Detail ${i + 1}`,
        status: i === 0 ? 'Ready' : 'Queue',
        rows: detailList,
      })),
    [count]
  )
  const { page: groups, pageIndex, pageCount } = usePagedRows(
    allGroups,
    DETAIL_GROUPS_PER_PAGE,
    DETAIL_GROUP_PAGE_INTERVAL_MS
  )
  const hasSidebar = rightPanelComponents.length > 0

  return (
    <main className="layout layout-triple" style={mainGridStyle(ratio, hasSidebar)}>
      <div className="triple-detail-group">
        {pageCount > 1 && (
          <div className="triple-detail-head">
            <PageDots pageIndex={pageIndex} pageCount={pageCount} />
          </div>
        )}
        <div className="triple-detail-columns" style={{ '--triple-detail-count': groups.length }}>
          <TripleDetailPanels tableModel={tableModel} groups={groups} />
        </div>
      </div>
      <RightColumn components={rightPanelComponents} leaderboardModel={leaderboardModel} activeStation={activeStation} />
    </main>
  )
}

function LayoutThree({ tableModel, leaderboardModel, activeStation, panelRatio, detailCount, rightPanelComponents }) {
  const ratio = PANEL_RATIOS.find((r) => r.id === panelRatio) ?? PANEL_RATIOS[1]
  const count = Number(detailCount) || 3
  const groups = Array.from({ length: count }, (_, i) => ({
    title: `Detail ${i + 1}`,
    status: i === 0 ? 'Ready' : 'Queue',
    rows: detailList,
  }))
  const hasSidebar = rightPanelComponents.length > 0
  return (
    <main className="layout layout-combined" style={mainGridStyle(ratio, hasSidebar)}>
      <CombinedDetailList groups={groups} tableModel={tableModel} />
      <RightColumn components={rightPanelComponents} leaderboardModel={leaderboardModel} activeStation={activeStation} />
    </main>
  )
}

// SWT-03's "session ended" variant — a ranked scoreboard instead of a
// trainee detail table. Mirrors DetailListTable2's markup/classes so it
// picks up the same font-size overrides and column styling for free.
function StationGlobalLeaderboard({ rows, courseware, timeRange, hideNo }) {
  return (
    <>
      <div className="detail-panel-head">
        <h2 className="panel-title">Global Leaderboard</h2>
      </div>
      <p className="station-column-info">
        <span>
          Courseware: <strong>{courseware}</strong>
        </span>
        <span>{timeRange}</span>
      </p>
      <table className="table table-two">
        <thead>
          <tr>
            {!hideNo && <th className="no-cell">No</th>}
            <th className="rank-cell">Rank</th>
            <th className="name-cell">Name</th>
            <th className="weapon-cell">Weapon</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.no}>
              {!hideNo && <td className="no-cell">{row.no}</td>}
              <td className="rank-cell">{row.rank}</td>
              <td className="name-cell" title={row.name}>
                {row.name}
              </td>
              <td className="weapon-cell" title={row.weapon}>
                {row.weapon}
              </td>
              <td>{row.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

// Layout 5 only — names longer than this are excerpted with an ellipsis
// (a fixed character count instead of a pixel max-width, so the cutoff
// point stays the same regardless of the Table Font Size setting). The
// Name column gets the lion's share of each row's width (see index.css)
// specifically so 30 characters is realistic to actually show, not just
// a raised ceiling that still gets visually clipped.
const STATION_NAME_MAX_CHARS = 30

function truncateStationName(name) {
  if (!name || name.length <= STATION_NAME_MAX_CHARS) return name
  return `${name.slice(0, STATION_NAME_MAX_CHARS)}…`
}

// "SAR21, MATADOR" -> "SAR21\nMATADOR" so a trainee carrying more than
// one item renders as stacked lines (via white-space: pre-line in CSS)
// instead of one run-on, comma-separated string.
function wrapStationWeapon(weapon) {
  return weapon ? weapon.split(',').map((w) => w.trim()).join('\n') : weapon
}

function formatStationRows(rows) {
  return rows.map((row) => ({
    ...row,
    name: truncateStationName(row.name),
    weapon: wrapStationWeapon(row.weapon),
  }))
}

// The title row above each station's info/table — station name on the
// left, Booking ID (if any) right-aligned on the same row instead of
// buried in the info line below.
function StationColumnHead({ name, bookingCode }) {
  return (
    <div className="station-column-head">
      <span className="station-column-name">{name}</span>
      {/* Always rendered (hidden when there's no bookingCode) so the head
          row's height is identical whether or not a booking code exists —
          the name span uses --l5-station-font-size while this one uses
          --l5-table-font-size, so omitting it entirely (rather than hiding
          it) can leave a No Booking card's head row shorter than a booked
          card's when those two switchers differ. */}
      <span className="station-column-booking" style={bookingCode ? undefined : { visibility: 'hidden' }}>
        {bookingCode || ' '}
      </span>
    </div>
  )
}

// One shared countdown for every Layout 5 column, rendered once under
// the header rather than once per station — a CSS animation rather
// than a JS-driven tick so it doesn't force a re-render every frame.
// `key={tick}` remounts the fill on every shared flip, restarting the
// animation from empty in lockstep across all columns.
function FlipProgressBar({ tick, intervalMs }) {
  return (
    <div className="flip-progress-track" aria-hidden="true">
      <div key={tick} className="flip-progress-fill" style={{ animationDuration: `${intervalMs}ms` }} />
    </div>
  )
}

// TV mode only — scales its children to fill the viewport exactly
// (uniformly, preserving aspect ratio, whichever of width/height is the
// tighter constraint), instead of only ever shrinking. A real 65" TV's
// resolution (e.g. 3180x2160) is much bigger than the ~1920x1080 this
// board was designed against, so its natural content is actually
// *shorter* than the viewport there — capping scale at 1 (shrink-only)
// left a large blank gap below the content instead of filling the
// screen. scrollWidth/scrollHeight are read from the *unscaled* child
// (CSS transform doesn't change layout or scroll size), so recomputing
// after every resize/content change is stable — it never measures its
// own previous scale back into itself. Laptop mode renders children
// directly, completely unaffected — same scroll-if-needed behavior as
// before this existed.
function FitToScreen({ active, children }) {
  const innerRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!active) {
      setScale(1)
      return
    }
    const el = innerRef.current
    if (!el) return
    const recompute = () => {
      const naturalWidth = el.scrollWidth
      const naturalHeight = el.scrollHeight
      if (naturalWidth === 0 || naturalHeight === 0) return
      const widthScale = window.innerWidth / naturalWidth
      const heightScale = window.innerHeight / naturalHeight
      setScale(Math.min(widthScale, heightScale))
    }
    recompute()
    const observer = new ResizeObserver(recompute)
    observer.observe(el)
    window.addEventListener('resize', recompute)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', recompute)
    }
  }, [active])

  if (!active) return children

  return (
    <div className="fit-to-screen-outer">
      <div ref={innerRef} className="fit-to-screen-inner" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  )
}

// A station's booking info — Mode + Courseware, time range, Unit — as
// one wrapped line with " · " separators instead of a stack of
// full-width rows, so a station missing a field (SWT-03 has no real
// booking, only a courseware + time slot) just reads shorter rather than
// leaving the header block a different height from its neighbors.
function SwtStationInfo({ station }) {
  const sessionLabel = [station.mode, station.courseware].filter(Boolean).join(', ')
  return (
    <p className="station-column-info">
      {sessionLabel && <span>{sessionLabel}</span>}
      <span>
        {station.startTime} - {station.endTime}
      </span>
    </p>
  )
}

// One station's column for Level 4 — split out so its row-chunking
// (which depends on stationDataCount and that station's own row count)
// is a per-instance computation, not one called inside the parent's
// .map(). Its position in the rotation still advances on the single
// shared `flipTick` from the App component, so every column (and every
// Level 2/3 placeholder column) flips at the exact same moment.
function SwtStationColumn({
  station,
  tableModel,
  hideNoColumn,
  detailTitleMode,
  stationDataCount,
  startDetail,
  swt03Session,
  flipTick,
}) {
  const showLeaderboard = station.isLeaderboardCapable && swt03Session === 'ended'
  const steps = useMemo(() => buildStationSteps(station, stationDataCount), [station, stationDataCount])
  // The Global Leaderboard is a flat ranked list, not Detail groups, but
  // it still follows the same Data Count switcher — "10 - 5"/"5 - 5 - 5"
  // page it just like a normal station's rows instead of dumping all 15
  // at once regardless of what's selected.
  const leaderboardSteps = useMemo(
    () => (station.leaderboardRows ? chunkStationRows(formatStationRows(station.leaderboardRows), stationDataCount) : []),
    [station, stationDataCount]
  )
  // "Start Detail" picks which Detail group this station's rotation opens
  // on — find that group's first step in the combined sequence. Falls
  // back to step 0 if the station doesn't actually have that many Detail
  // groups (e.g. a single-Detail station ignores this entirely).
  const startDetailIndex = Number(startDetail) - 1
  const initialStepIndex = useMemo(() => {
    const idx = steps.findIndex((s) => s.detailIndex === startDetailIndex)
    return idx === -1 ? 0 : idx
  }, [steps, startDetailIndex])
  const pageIndex = (initialStepIndex + flipTick) % steps.length
  const activeStep = steps[pageIndex]
  const leaderboardPageIndex = leaderboardSteps.length > 0 ? flipTick % leaderboardSteps.length : 0
  const activeLeaderboardRows = leaderboardSteps[leaderboardPageIndex] ?? []
  // "10 - 5" produces two pages of different sizes for a station with
  // more than 10 rows (and a multi-Detail station repeats that per
  // group) — without a height floor, the panel would shrink whenever it
  // flips to a shorter page. "15" and "5 - 5 - 5" don't need this:
  // either there's no flip at all, or every page is already the same
  // size.
  const hasUnevenPages = showLeaderboard
    ? leaderboardSteps.length > 1 && leaderboardSteps.some((s) => s.length !== leaderboardSteps[0].length)
    : steps.length > 1 && steps.some((s) => s.rows.length !== steps[0].rows.length)

  // A flat px floor can't track every font-size combination the
  // switchers allow, so measure instead and floor future renders at the
  // tallest height this column has actually reached. A ResizeObserver
  // (rather than a one-off measurement keyed on the page) is needed
  // because the real content also grows after mount when webfonts
  // finish loading and the text reflows at its real metrics — a single
  // snapshot can lock in an undersized floor from the fallback-font frame.
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

  return (
    <section
      ref={columnRef}
      className={`panel detail-panel-compact station-column${showLeaderboard ? ' station-column-leaderboard' : ''}`}
      style={hasUnevenPages ? { minHeight } : undefined}
    >
      <StationColumnHead name={station.code} bookingCode={station.bookingCode} />
      {showLeaderboard ? (
        <StationGlobalLeaderboard
          rows={activeLeaderboardRows}
          courseware={station.courseware}
          timeRange={`${station.startTime} - ${station.endTime}`}
          hideNo={hideNoColumn}
        />
      ) : (
        <>
          <SwtStationInfo station={station} />
          {/* When Unit is already the Detail title itself (detailTitleMode
              === 'unit'), a separate line here would just repeat it. */}
          {station.unit && detailTitleMode !== 'unit' && (
            <p className="station-column-unit">
              Unit: <strong>{station.unit}</strong>
            </p>
          )}
          <DetailPanel
            tableModel={tableModel}
            rows={activeStep.rows}
            title={detailTitleMode === 'unit' && station.unit ? station.unit : `Detail ${activeStep.detailIndex + 1}`}
            status={activeStep.status}
            fullRows
            hideNo={hideNoColumn}
            splitRank
          />
        </>
      )}
    </section>
  )
}

// Level 2 (CMT) equivalent of SwtStationInfo — a cabin only has one
// Platform Type field (no mode/courseware split like SWT's roster).
function CmtStationInfo({ station }) {
  return (
    <p className="station-column-info">
      <span>{station.platformType}</span>
      <span>
        {station.startTime} - {station.endTime}
      </span>
    </p>
  )
}

// CMT trains vehicle crews, not shooters — no Weapon/Lane, just a crew
// Role (VC/VO/PC/SC/SO) per trainee — so its own dedicated table instead
// of reusing DetailPanel's Weapon/Lane-shaped table models. `leaderboard`
// swaps the last column from Role to Score for a Session Leaderboard.
// Status pill tones mirror Level 1's BookingList STATUS_CLASS mapping
// (Ongoing = amber, base/untoned = blue, done = green) so the same
// status reads as the same color everywhere in the app — "In Queue"
// reads like L1's "Upcoming" (hasn't started, base blue), "Session
// Leaderboard" reads like L1's "Completed" (the session's over, green).
const CMT_STATUS_CLASS = {
  Ongoing: 'status-pill-queue',
  Queue: 'status-pill-queue',
  'In Queue': '',
  '(Ready)': '',
  'Session Leaderboard': 'status-pill-done',
}
function CmtDetailTable({ rows, title, status, hideNo, leaderboard }) {
  return (
    <>
      <div className="detail-panel-head">
        <h2 className="panel-title">{title}</h2>
        {status && <span className={`status-pill${CMT_STATUS_CLASS[status] ? ` ${CMT_STATUS_CLASS[status]}` : ''}`}>{status}</span>}
      </div>
      <table className="table table-two">
        <thead>
          <tr>
            {!hideNo && <th className="no-cell">No</th>}
            <th className="rank-cell">Rank</th>
            <th className="name-cell">Trainee</th>
            <th className="role-cell">{leaderboard ? 'Score' : 'Role'}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.no}>
              {!hideNo && <td className="no-cell">{row.no}</td>}
              <td className="rank-cell">{row.rank}</td>
              <td className="name-cell" title={row.name}>
                {row.name}
              </td>
              <td className="role-cell">{leaderboard ? row.score : row.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

// One cabin's column for Level 2 — mirrors SwtStationColumn's structure
// (steps/height-lock/flipTick) but with CMT's own info/table components.
// A cabin with no booking today (station.noBooking) just shows its
// header, a "No Booking" line, and a blank 5-row table.
function CmtStationColumn({
  station,
  hideNoColumn,
  stationDataCount,
  startDetail,
  leaderboardSession,
  notAvailableStyle = 'muted',
  flipTick,
}) {
  const showLeaderboard = station.isLeaderboardCapable && leaderboardSession === 'ended'
  const steps = useMemo(
    () => (station.noBooking ? [] : buildStationSteps(station, stationDataCount)),
    [station, stationDataCount]
  )
  const startDetailIndex = Number(startDetail) - 1
  const initialStepIndex = useMemo(() => {
    if (steps.length === 0) return 0
    const idx = steps.findIndex((s) => s.detailIndex === startDetailIndex)
    return idx === -1 ? 0 : idx
  }, [steps, startDetailIndex])
  const pageIndex = steps.length > 0 ? (initialStepIndex + flipTick) % steps.length : 0
  const activeStep = steps[pageIndex]
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

  if (station.noBooking) {
    return (
      <section
        className={`panel detail-panel-compact station-column station-column-unavailable station-column-unavailable-${notAvailableStyle}`}
      >
        <StationColumnHead name={station.code} />
        {/* Mirrors a booked card's structure exactly (blank info line +
            a detail-panel-head row) instead of omitting them, so the
            card's natural height matches a booked card's at any font
            size — no JS height measurement needed for a card that never
            changes. */}
        <p className="station-column-info">
          <span>&nbsp;</span>
        </p>
        <div className="detail-panel-head">
          <h2 className="panel-title">No Booking</h2>
          {/* Invisible but same-sized as a real status pill — the pill's
              own box height (padding + its own font-size) can exceed the
              title text's line-height, so without this the row is a few
              px shorter than a booked card's at some font sizes. */}
          <span className="status-pill" style={{ visibility: 'hidden' }}>
            Ready
          </span>
        </div>
        <table className="table table-two">
          <thead>
            <tr>
              {!hideNoColumn && <th className="no-cell">No</th>}
              <th className="rank-cell">Rank</th>
              <th className="name-cell">Trainee</th>
              <th className="role-cell">Role</th>
            </tr>
          </thead>
          <tbody>
            {/* Same 5-row count as a booked card (2 blank + the "Not
                Available" message row + 2 more blank) so this card's
                height still matches a booked card's exactly — only the
                middle row's look changes, not the row count. Blank cells
                need a non-breaking space (not truly empty) or the row
                collapses shorter than a real content row's line-height. */}
            {[1, 2].map((no) => (
              <tr key={no}>
                {!hideNoColumn && <td className="no-cell">&nbsp;</td>}
                <td className="rank-cell">&nbsp;</td>
                <td className="name-cell">&nbsp;</td>
                <td className="role-cell">&nbsp;</td>
              </tr>
            ))}
            <tr>
              <td colSpan={hideNoColumn ? 3 : 4} className="table-not-available-cell">
                Not Available
              </td>
            </tr>
            {[4, 5].map((no) => (
              <tr key={no}>
                {!hideNoColumn && <td className="no-cell">&nbsp;</td>}
                <td className="rank-cell">&nbsp;</td>
                <td className="name-cell">&nbsp;</td>
                <td className="role-cell">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    )
  }

  return (
    <section
      ref={columnRef}
      className={`panel detail-panel-compact station-column${showLeaderboard ? ' station-column-leaderboard' : ''}`}
      style={hasUnevenPages ? { minHeight } : undefined}
    >
      <StationColumnHead name={station.code} bookingCode={station.bookingCode} />
      {showLeaderboard ? (
        <>
          <CmtStationInfo station={station} />
          <CmtDetailTable
            rows={station.leaderboardRows}
            title={`Detail ${activeStep.detailIndex + 1}`}
            status="Session Leaderboard"
            hideNo={hideNoColumn}
            leaderboard
          />
        </>
      ) : (
        <>
          <CmtStationInfo station={station} />
          {/* CTT (Level 3) drives Score-vs-Role straight off each Detail
              group's own status instead of a separate per-station switcher
              — "Session Leaderboard" means that group's session is
              live/scored, "(Ready)" means it's the next group waiting to
              be called. CMT/SWT's statuses (Ongoing/In Queue) never match
              this, so they're unaffected. */}
          <CmtDetailTable
            rows={activeStep.rows}
            title={`Detail ${activeStep.detailIndex + 1}`}
            status={activeStep.status}
            hideNo={hideNoColumn}
            leaderboard={activeStep.status === 'Session Leaderboard'}
          />
        </>
      )}
    </section>
  )
}

function LayoutFive({
  tableModel,
  activeStation,
  level,
  hideNoColumn,
  hideDirectory,
  tableFontSize,
  detailFontSize,
  stationFontSize,
  swt03Session,
  cmtLeaderboardSessionByStation,
  cmtNotAvailableStyle,
  detailTitleMode,
  stationDataCount,
  startDetailByStation,
  activeZone,
  zoneTick,
  flipTick,
}) {
  const isLevelFour = level === 'level-4'
  const isLevelTwo = level === 'level-2'
  const isLevelThree = level === 'level-3'
  // Any level without its own real per-station data (currently none —
  // kept as a safety net) falls back to this shared placeholder roster,
  // flipping Detail 1 (10 rows) -> Detail 1 (5) -> Detail 2 (10) ->
  // Detail 2 (5) across every station in lockstep, like an airport board.
  // All branches advance on the same shared flipTick (see App), so every
  // column across the whole layout changes at the same moment.
  const steps = useMemo(() => layoutFiveSteps(detailList), [])
  const pageIndex = flipTick % steps.length
  const activeStep = steps[pageIndex]
  const fontSizeVars = {
    '--l5-table-font-size': TABLE_FONT_SIZE_OPTIONS.find((o) => o.id === tableFontSize)?.value,
    '--l5-detail-font-size': DETAIL_FONT_SIZE_OPTIONS.find((o) => o.id === detailFontSize)?.value,
    '--l5-station-font-size': STATION_FONT_SIZE_OPTIONS.find((o) => o.id === stationFontSize)?.value,
  }
  // Level 3's Layout 5 pages through Zones like an airport board — Zone A
  // -> B -> C -> D1 -> D2 -> repeat, each on its own CTT_ZONE_ROTATE_
  // INTERVAL_MS beat (zoneTick, from App) — independent of flipTick, which
  // keeps flipping each cabin's own Detail rotation *within* whichever
  // Zone page is currently on screen. The Active Zone switcher just picks
  // which zone the rotation *starts* from, not a fixed pin.
  const cttStartZoneIndex = Math.max(0, cttZones.findIndex((z) => z.id === activeZone))
  const displayedZone = cttZones[(cttStartZoneIndex + zoneTick) % cttZones.length]?.id ?? activeZone
  const cttStationColumns = cttStationColumnsByZone[displayedZone] ?? []
  const activeCttZoneLabel = cttZones.find((z) => z.id === displayedZone)?.label ?? ''
  // Bento layout: each cabin card is placed as its own grid cell (column =
  // its physical column, row = its position within that column) instead
  // of being stacked in a flex column, so the Directory ("pathfinder")
  // can be precisely placed into whatever grid space is actually free.
  // Every zone (A, B, C, D1, D2) shares the same shape on the source
  // floor sheet: some number of full-height columns, then one or more
  // short trailing column(s) with just 1 occupied row — the Directory
  // fills the empty rows left below those short column(s), starting
  // right after their own row.
  // Row 1 is reserved for the full-width Zone banner (see below) — cabin
  // cards start at row 2, so every row index used for placement carries a
  // +2 offset (rowIndex 0 -> grid row 2, etc).
  const cttMaxRows = Math.max(0, ...cttStationColumns.map((c) => c.length))
  // Negative grid line numbers ("-1" for "the last line") only resolve
  // against the *explicit* grid — .layout-five's grid-template-columns
  // has to be declared (not implicit) for "-1" to count from it. Using
  // "-1" for grid-row would be unsafe the same way, since .layout-five
  // never declares grid-template-rows (rows are implicit, sized to
  // content) — a concrete final line number (cttMaxRows + 2, matching the
  // +2 banner offset) sidesteps that for rows. grid-column's "-1" is fine
  // as long as cttGridColumnCount (below) is what's actually rendered as
  // the explicit grid-template-columns.
  const cttLastRowLine = cttMaxRows + 2
  const cttShortColumnIndex = cttStationColumns.findIndex((c) => c.length < cttMaxRows)
  // Most zones only need as many grid columns as they have real station
  // columns (the short trailing column(s) already provide the Directory's
  // full width). Zone D1 has just 1 short column (D13) but the Directory
  // still needs 2 columns of width, so it gets 1 extra unoccupied buffer
  // column beyond its real data.
  const cttGridColumnCount =
    (cttShortColumnIndex !== -1
      ? Math.max(cttStationColumns.length, cttShortColumnIndex + 2)
      : cttStationColumns.length) || 5
  let cttDirectoryStyle
  if (cttShortColumnIndex !== -1) {
    const shortColumnsMaxLength = Math.max(...cttStationColumns.slice(cttShortColumnIndex).map((c) => c.length))
    cttDirectoryStyle = {
      gridColumn: `${cttShortColumnIndex + 1} / -1`,
      gridRow: `${shortColumnsMaxLength + 2} / ${cttLastRowLine}`,
    }
  } else if (cttStationColumns.length > 0 && cttStationColumns.length <= 3) {
    // Fallback shape for a hypothetical zone with no short column at all
    // (every zone with real data today has one) — leftover columns are
    // entirely free, so the Directory only takes their bottom half.
    cttDirectoryStyle = {
      gridColumn: cttStationColumns.length + 1,
      gridRow: `${Math.floor(cttMaxRows / 2) + 2} / ${cttLastRowLine}`,
    }
  }
  const cttUseCornerDirectory = isLevelThree && Boolean(cttDirectoryStyle)
  const cttGridStyle = isLevelThree ? { gridTemplateColumns: `repeat(${cttGridColumnCount}, 1fr)` } : undefined
  return (
    <main
      className={`layout layout-five${isLevelTwo ? ' layout-five-cmt' : ''}`}
      style={{ ...fontSizeVars, ...cttGridStyle }}
    >
      {isLevelThree && (
        <div className="ctt-zone-banner" style={{ gridRow: 1 }}>
          <div className="ctt-zone-label">{activeCttZoneLabel}</div>
          <p className="ctt-zone-instruction">
            Trainee should refer to the detail list below. Please pay close attention to your specific cabin and role
            assignments and proceed promptly to the cabin when instructed.
          </p>
        </div>
      )}
      {isLevelFour ? (
        swtStations.map((station) => (
          <SwtStationColumn
            key={station.code}
            station={station}
            tableModel={tableModel}
            hideNoColumn={hideNoColumn}
            detailTitleMode={detailTitleMode}
            stationDataCount={stationDataCount}
            startDetail={startDetailByStation?.[station.code] ?? '1'}
            swt03Session={swt03Session}
            flipTick={flipTick}
          />
        ))
      ) : isLevelTwo ? (
        // 11 cabins across 5 physical columns (some stack 3, some just
        // 1) instead of 5 uniform columns — see cmtStationColumns.
        cmtStationColumns.map((codes, i) => (
          <div key={i} className="cmt-station-group">
            {codes.map((code) => {
              const station = cmtStations.find((s) => s.code === code)
              return (
                <CmtStationColumn
                  key={code}
                  station={station}
                  hideNoColumn={hideNoColumn}
                  stationDataCount={stationDataCount}
                  startDetail={startDetailByStation?.[code] ?? '1'}
                  leaderboardSession={cmtLeaderboardSessionByStation?.[code] ?? 'ongoing'}
                  notAvailableStyle={cmtNotAvailableStyle}
                  flipTick={flipTick}
                />
              )
            })}
          </div>
        ))
      ) : isLevelThree ? (
        // Same per-station column mechanics as Level 2 (CmtStationColumn
        // handles CTT's Score-vs-Role rendering on its own — see the
        // `leaderboard={activeStep.status === 'Session Leaderboard'}` line
        // above), just grouped by the currently active Zone instead of one
        // flat cabin list. Each card is its own grid cell (column = its
        // physical column, row = its position within that column) rather
        // than a flex-stacked column, so the Directory can share the same
        // row/column coordinate space (see cttDirectoryStyle above).
        cttStationColumns.flatMap((codes, colIndex) =>
          codes.map((code, rowIndex) => {
            const station = cttStations.find((s) => s.code === code)
            return (
              <div key={code} style={{ gridColumn: colIndex + 1, gridRow: rowIndex + 2 }}>
                <CmtStationColumn
                  station={station}
                  hideNoColumn={hideNoColumn}
                  stationDataCount={stationDataCount}
                  startDetail={startDetailByStation?.[code] ?? '1'}
                  leaderboardSession="ongoing"
                  flipTick={flipTick}
                />
              </div>
            )
          })
        )
      ) : (
        LAYOUT_FIVE_STATIONS.map((station) => (
          <section
            key={station.name}
            className={`panel detail-panel-compact station-column${activeStep.paginated ? ' station-column-paginated' : ''}`}
          >
            <StationColumnHead name={station.name} />
            <div className="station-column-info">
              <span>
                Unit: <strong>{station.unit}</strong>
              </span>
              <span>
                Courseware: <strong>{station.courseware}</strong>
              </span>
            </div>
            <DetailPanel
              tableModel={tableModel}
              rows={formatStationRows(activeStep.rows)}
              title={activeStep.detail.title}
              status={activeStep.detail.status}
              fullRows
              splitRank
            />
          </section>
        ))
      )}
      {/* Level 3's Layout 5 always shows the Directory (its own Zone map
          just replaced the old generic map) — Level 2/4 (real per-station
          data) each offer a toggle to hide it. Whenever a Zone has *any*
          leftover grid space (entirely unused columns like Zone A's, or
          empty rows below short columns like Zone D1's D13), the
          Directory sits in that corner instead of a full-width row below
          — see cttDirectoryStyle above for exactly where. Only a Zone
          with zero leftover space anywhere would fall back to the plain
          full-width row (no such zone exists yet, but the fallback stays
          as a safety net). */}
      {(isLevelThree || !(isLevelFour || isLevelTwo) || !hideDirectory) && (
        <section
          className={`panel directory-panel${cttUseCornerDirectory ? ' layout-five-directory-corner' : ' layout-five-directory'}`}
          style={cttDirectoryStyle}
        >
          {isLevelTwo ? (
            <CmtDirectory />
          ) : isLevelThree ? (
            <CttDirectory activeZone={displayedZone} />
          ) : (
            <Directory activeStation={activeStation} />
          )}
        </section>
      )}
    </main>
  )
}

const LAYOUT_COMPONENTS = {
  'layout-1': LayoutOne,
  'layout-2': LayoutTwo,
  'layout-3': LayoutThree,
  'layout-4': StationsOverview,
  'layout-5': LayoutFive,
}

export default function App() {
  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY)
    return LAYOUTS.some((l) => l.id === saved) ? saved : 'layout-5'
  })
  const [tableModel, setTableModel] = useState(() => {
    const saved = localStorage.getItem(TABLE_MODEL_STORAGE_KEY)
    return TABLE_MODELS.some((t) => t.id === saved) ? saved : 'default'
  })
  const [leaderboardModel, setLeaderboardModel] = useState(() => {
    const saved = localStorage.getItem(LEADERBOARD_MODEL_STORAGE_KEY)
    return LEADERBOARD_MODELS.some((l) => l.id === saved) ? saved : 'table'
  })
  const [slideInterval, setSlideInterval] = useState(() => {
    const saved = localStorage.getItem(SLIDESHOW_STORAGE_KEY)
    return SLIDESHOW_INTERVALS.some((s) => s.id === saved) ? saved : '0'
  })
  const [lobbyInterval, setLobbyInterval] = useState(() => {
    const saved = localStorage.getItem(LOBBY_INTERVAL_STORAGE_KEY)
    return LOBBY_INTERVAL_OPTIONS.some((o) => o.id === saved) ? saved : '5'
  })
  const [leaderboardProportion, setLeaderboardProportion] = useState(() => {
    const saved = localStorage.getItem(LEADERBOARD_PROPORTION_STORAGE_KEY)
    return LEADERBOARD_PROPORTION_OPTIONS.some((o) => o.id === saved) ? saved : 'a'
  })
  const [leaderboardPodium, setLeaderboardPodium] = useState(() => {
    const saved = localStorage.getItem(LEADERBOARD_PODIUM_STORAGE_KEY)
    return LEADERBOARD_PODIUM_OPTIONS.some((o) => o.id === saved) ? saved : 'visible'
  })
  const [leaderboardGlobalCount, setLeaderboardGlobalCount] = useState(() => {
    const saved = localStorage.getItem(LEADERBOARD_GLOBAL_COUNT_STORAGE_KEY)
    return LEADERBOARD_GLOBAL_COUNT_OPTIONS.some((o) => o.id === saved) ? saved : '4'
  })
  const [leaderboardFontSize, setLeaderboardFontSize] = useState(() => {
    const saved = localStorage.getItem(LEADERBOARD_FONT_SIZE_STORAGE_KEY)
    return LEADERBOARD_FONT_SIZE_OPTIONS.some((o) => o.id === saved) ? saved : 'medium'
  })
  const [leaderboardGlobalRows, setLeaderboardGlobalRows] = useState(() => {
    const saved = localStorage.getItem(LEADERBOARD_GLOBAL_ROWS_STORAGE_KEY)
    return LEADERBOARD_GLOBAL_ROWS_OPTIONS.some((o) => o.id === saved) ? saved : '5'
  })
  const [leaderboardLocalRows, setLeaderboardLocalRows] = useState(() => {
    const saved = localStorage.getItem(LEADERBOARD_LOCAL_ROWS_STORAGE_KEY)
    return LEADERBOARD_LOCAL_ROWS_OPTIONS.some((o) => o.id === saved) ? saved : '5'
  })
  const [leaderboardSlide, setLeaderboardSlide] = useState(() => {
    const saved = localStorage.getItem(LEADERBOARD_SLIDE_STORAGE_KEY)
    return LEADERBOARD_SLIDE_OPTIONS.some((o) => o.id === saved) ? saved : 'off'
  })
  const [display, setDisplay] = useState(() => {
    const saved = localStorage.getItem(DISPLAY_STORAGE_KEY)
    return DISPLAY_OPTIONS.some((o) => o.id === saved) ? saved : 'laptop'
  })
  const [panelRatio, setPanelRatio] = useState(() => {
    const saved = localStorage.getItem(PANEL_RATIO_STORAGE_KEY)
    return PANEL_RATIOS.some((r) => r.id === saved) ? saved : '60-40'
  })
  const [font, setFont] = useState(() => {
    const saved = localStorage.getItem(FONT_STORAGE_KEY)
    return FONTS.some((f) => f.id === saved) ? saved : 'inter'
  })
  const [detailCount, setDetailCount] = useState(() => {
    const saved = localStorage.getItem(DETAIL_COUNT_STORAGE_KEY)
    return DETAIL_COUNTS.some((d) => d.id === saved) ? saved : '3'
  })
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem(LEVEL_STORAGE_KEY)
    return LEVELS.some((l) => l.id === saved) ? saved : 'level-4'
  })
  // Level 2 (CMT) only ever renders correctly under Layout 5 — force it
  // back whenever Level 2 is (re)selected instead of leaving whatever
  // layout was last picked on another level (the switcher itself is
  // hidden for Level 2, see switcherGroups below, so this is the only
  // place that can still change it).
  useEffect(() => {
    if (level === 'level-2') setLayout('layout-5')
  }, [level])
  const [rightPanelComponents, setRightPanelComponents] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(RIGHT_PANEL_STORAGE_KEY))
      // Empty array is valid — it means every panel was deliberately hidden.
      if (Array.isArray(saved) && saved.every((id) => RIGHT_PANEL_COMPONENTS.some((c) => c.id === id))) {
        return saved
      }
    } catch {
      /* ignore malformed saved value */
    }
    return ['top3', 'leaderboard']
  })
  const [infoBanner, setInfoBanner] = useState(() => {
    const saved = localStorage.getItem(INFO_BANNER_STORAGE_KEY)
    return INFO_BANNER_OPTIONS.some((o) => o.id === saved) ? saved : 'hidden'
  })
  const [noColumn, setNoColumn] = useState(() => {
    const saved = localStorage.getItem(NO_COLUMN_STORAGE_KEY)
    return NO_COLUMN_OPTIONS.some((o) => o.id === saved) ? saved : 'visible'
  })
  const [directoryVisibility, setDirectoryVisibility] = useState(() => {
    const saved = localStorage.getItem(DIRECTORY_STORAGE_KEY)
    return DIRECTORY_OPTIONS.some((o) => o.id === saved) ? saved : 'hidden'
  })
  // Level 3 (CTT) only — which physical Zone's cabins are currently shown.
  // Only Zone A and Zone D1 have real station data so far.
  const [activeZone, setActiveZone] = useState(() => {
    const saved = localStorage.getItem(CTT_ZONE_STORAGE_KEY)
    return CTT_ZONES_WITH_DATA.some((z) => z.id === saved) ? saved : 'zone-a'
  })
  const [startDetailByStation, setStartDetailByStation] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(START_DETAIL_STORAGE_KEY))
      if (saved && typeof saved === 'object') return saved
    } catch {
      /* ignore malformed saved value */
    }
    return CTT_DEFAULT_START_DETAIL
  })
  const [swt03Session, setSwt03Session] = useState(() => {
    const saved = localStorage.getItem(SWT03_SESSION_STORAGE_KEY)
    return SWT03_SESSION_OPTIONS.some((o) => o.id === saved) ? saved : 'ongoing'
  })
  // Level 2 (CMT) equivalent of swt03Session — CMT-01 and CMT-03 can each
  // independently toggle into a Session Leaderboard, so this is keyed by
  // station code instead of being a single flag.
  const [cmtLeaderboardSessionByStation, setCmtLeaderboardSessionByStation] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CMT_LEADERBOARD_SESSION_STORAGE_KEY))
      if (saved && typeof saved === 'object') return saved
    } catch {
      /* ignore malformed saved value */
    }
    return {}
  })
  const [cmtNotAvailableStyle, setCmtNotAvailableStyle] = useState(() => {
    const saved = localStorage.getItem(CMT_NOT_AVAILABLE_STYLE_STORAGE_KEY)
    return CMT_NOT_AVAILABLE_STYLE_OPTIONS.some((o) => o.id === saved) ? saved : 'muted'
  })
  const [detailTitleMode, setDetailTitleMode] = useState(() => {
    const saved = localStorage.getItem(DETAIL_LABEL_STORAGE_KEY)
    return DETAIL_LABEL_OPTIONS.some((o) => o.id === saved) ? saved : 'detail'
  })
  const [stationDataCount, setStationDataCount] = useState(() => {
    const saved = localStorage.getItem(STATION_DATA_COUNT_STORAGE_KEY)
    return DATA_COUNT_OPTIONS.some((o) => o.id === saved) ? saved : '15'
  })
  const [tableFontSize, setTableFontSize] = useState(() => {
    const saved = localStorage.getItem(TABLE_FONT_SIZE_STORAGE_KEY)
    return TABLE_FONT_SIZE_OPTIONS.some((o) => o.id === saved) ? saved : 'medium'
  })
  const [detailFontSize, setDetailFontSize] = useState(() => {
    const saved = localStorage.getItem(DETAIL_FONT_SIZE_STORAGE_KEY)
    return DETAIL_FONT_SIZE_OPTIONS.some((o) => o.id === saved) ? saved : 'medium'
  })
  const [stationFontSize, setStationFontSize] = useState(() => {
    const saved = localStorage.getItem(STATION_FONT_SIZE_STORAGE_KEY)
    return STATION_FONT_SIZE_OPTIONS.some((o) => o.id === saved) ? saved : 'medium'
  })
  const [stationIndex, setStationIndex] = useState(0)

  // One shared tick drives every Layout 5 column's rotation (both
  // Level 4's per-station steps and Level 2/3's placeholder steps) so
  // they all flip at the exact same moment, instead of each column
  // running its own independent timer.
  const [flipTick, setFlipTick] = useState(0)
  useEffect(() => {
    if (layout !== 'layout-5') return
    const id = setInterval(() => setFlipTick((t) => t + 1), LAYOUT_FIVE_STEP_INTERVAL_MS)
    return () => clearInterval(id)
  }, [layout])

  // Level 3 (CTT) only — advances which Zone page is on screen, on its
  // own slower cadence than flipTick's per-cabin Detail rotation.
  const [zoneTick, setZoneTick] = useState(0)
  useEffect(() => {
    if (level !== 'level-3' || layout !== 'layout-5') return
    const id = setInterval(() => setZoneTick((t) => t + 1), CTT_ZONE_ROTATE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [level, layout])

  // Leaderboard floor only — advances which pair of courseware the 2
  // Global panels show, only when the Slide switcher is on (and only
  // meaningful with Global Panels set to 2 — see leaderboardSlidePairIndex
  // below, computed in LeaderboardFloorBoard's caller).
  const [leaderboardSlideTick, setLeaderboardSlideTick] = useState(0)
  useEffect(() => {
    if (level !== 'leaderboard' || leaderboardSlide !== 'on' || leaderboardGlobalCount !== '2') return
    const id = setInterval(() => setLeaderboardSlideTick((t) => t + 1), LEADERBOARD_SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [level, leaderboardSlide, leaderboardGlobalCount])

  useEffect(() => {
    localStorage.setItem(RIGHT_PANEL_STORAGE_KEY, JSON.stringify(rightPanelComponents))
  }, [rightPanelComponents])

  useEffect(() => {
    localStorage.setItem(NO_COLUMN_STORAGE_KEY, noColumn)
  }, [noColumn])

  useEffect(() => {
    localStorage.setItem(DIRECTORY_STORAGE_KEY, directoryVisibility)
  }, [directoryVisibility])

  useEffect(() => {
    localStorage.setItem(CTT_ZONE_STORAGE_KEY, activeZone)
  }, [activeZone])

  useEffect(() => {
    localStorage.setItem(START_DETAIL_STORAGE_KEY, JSON.stringify(startDetailByStation))
  }, [startDetailByStation])

  useEffect(() => {
    localStorage.setItem(SWT03_SESSION_STORAGE_KEY, swt03Session)
  }, [swt03Session])

  useEffect(() => {
    localStorage.setItem(CMT_LEADERBOARD_SESSION_STORAGE_KEY, JSON.stringify(cmtLeaderboardSessionByStation))
  }, [cmtLeaderboardSessionByStation])

  useEffect(() => {
    localStorage.setItem(CMT_NOT_AVAILABLE_STYLE_STORAGE_KEY, cmtNotAvailableStyle)
  }, [cmtNotAvailableStyle])

  useEffect(() => {
    localStorage.setItem(DETAIL_LABEL_STORAGE_KEY, detailTitleMode)
  }, [detailTitleMode])

  useEffect(() => {
    localStorage.setItem(STATION_DATA_COUNT_STORAGE_KEY, stationDataCount)
  }, [stationDataCount])

  useEffect(() => {
    localStorage.setItem(TABLE_FONT_SIZE_STORAGE_KEY, tableFontSize)
  }, [tableFontSize])

  useEffect(() => {
    localStorage.setItem(DETAIL_FONT_SIZE_STORAGE_KEY, detailFontSize)
  }, [detailFontSize])

  useEffect(() => {
    localStorage.setItem(STATION_FONT_SIZE_STORAGE_KEY, stationFontSize)
  }, [stationFontSize])

  useEffect(() => {
    localStorage.setItem(INFO_BANNER_STORAGE_KEY, infoBanner)
  }, [infoBanner])

  useEffect(() => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, layout)
  }, [layout])

  useEffect(() => {
    localStorage.setItem(TABLE_MODEL_STORAGE_KEY, tableModel)
  }, [tableModel])

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_MODEL_STORAGE_KEY, leaderboardModel)
  }, [leaderboardModel])

  useEffect(() => {
    localStorage.setItem(SLIDESHOW_STORAGE_KEY, slideInterval)
  }, [slideInterval])

  useEffect(() => {
    localStorage.setItem(LOBBY_INTERVAL_STORAGE_KEY, lobbyInterval)
  }, [lobbyInterval])

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_PROPORTION_STORAGE_KEY, leaderboardProportion)
  }, [leaderboardProportion])

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_PODIUM_STORAGE_KEY, leaderboardPodium)
  }, [leaderboardPodium])

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_GLOBAL_COUNT_STORAGE_KEY, leaderboardGlobalCount)
  }, [leaderboardGlobalCount])

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_FONT_SIZE_STORAGE_KEY, leaderboardFontSize)
  }, [leaderboardFontSize])

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_GLOBAL_ROWS_STORAGE_KEY, leaderboardGlobalRows)
  }, [leaderboardGlobalRows])

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_LOCAL_ROWS_STORAGE_KEY, leaderboardLocalRows)
  }, [leaderboardLocalRows])

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_SLIDE_STORAGE_KEY, leaderboardSlide)
  }, [leaderboardSlide])

  useEffect(() => {
    localStorage.setItem(DISPLAY_STORAGE_KEY, display)
  }, [display])

  // Backstop for TV mode — FitToScreen's own scaling should already keep
  // everything inside the viewport, but this guarantees no page-level
  // scrollbar can appear regardless (e.g. before the first scale
  // measurement lands on mount).
  useEffect(() => {
    document.body.style.overflow = display === 'tv' ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [display])

  useEffect(() => {
    localStorage.setItem(PANEL_RATIO_STORAGE_KEY, panelRatio)
  }, [panelRatio])

  useEffect(() => {
    localStorage.setItem(FONT_STORAGE_KEY, font)
  }, [font])

  useEffect(() => {
    localStorage.setItem(DETAIL_COUNT_STORAGE_KEY, detailCount)
  }, [detailCount])

  useEffect(() => {
    localStorage.setItem(LEVEL_STORAGE_KEY, level)
  }, [level])

  // Cycles the board through all 4 base stations — this app renders one
  // physical LCD's worth of content, but in reality 4 of these boards
  // exist (IMT-01..04). The interval simulates that rotation for demos.
  useEffect(() => {
    const seconds = Number(slideInterval)
    if (!seconds) return
    const id = setInterval(() => {
      setStationIndex((i) => (i + 1) % stations.length)
    }, seconds * 1000)
    return () => clearInterval(id)
  }, [slideInterval])

  const isTrainingLevel = level !== 'level-1' && level !== 'leaderboard'
  const isLeaderboardFloor = level === 'leaderboard'

  // Toggles one component in/out of the right column. Unchecking all
  // three is allowed on purpose — the table then takes the full row
  // width instead of the sidebar sitting there empty.
  const toggleRightPanelComponent = (id) => {
    setRightPanelComponents((current) => {
      if (current.includes(id)) return current.filter((c) => c !== id)
      return [...current, id]
    })
  }

  const switcherGroups = [
    {
      id: 'level',
      label: 'Level',
      icon: <LevelIcon />,
      options: LEVELS,
      active: level,
      onChange: setLevel,
    },
    // Global, every level — which physical screen this board is running
    // on right now.
    {
      id: 'display',
      label: 'Display',
      icon: <DisplayIcon />,
      options: DISPLAY_OPTIONS,
      active: display,
      onChange: setDisplay,
    },
    {
      id: 'font',
      label: 'Typography',
      icon: <TypographyIcon />,
      options: FONTS,
      active: font,
      onChange: setFont,
    },
    // Level 1 (Lobby) only — how often the booking table rotates to the
    // next training level's data.
    ...(level === 'level-1'
      ? [
          {
            id: 'lobby-interval',
            label: 'Interval',
            icon: <SlideshowIcon />,
            options: LOBBY_INTERVAL_OPTIONS,
            active: lobbyInterval,
            onChange: setLobbyInterval,
          },
        ]
      : []),
    // Leaderboard floor only — column-width ratio across the panels
    // (Local + however many Global courseware panels are showing),
    // whether the Local podium shows, and how many Global panels show.
    ...(isLeaderboardFloor
      ? [
          {
            id: 'leaderboard-global-count',
            label: 'Global Panels',
            icon: <DetailCountIcon />,
            options: LEADERBOARD_GLOBAL_COUNT_OPTIONS,
            active: leaderboardGlobalCount,
            onChange: setLeaderboardGlobalCount,
          },
          {
            id: 'leaderboard-proportion',
            label: 'Panel Proportions',
            icon: <RatioIcon />,
            options: LEADERBOARD_PROPORTION_OPTIONS,
            active: leaderboardProportion,
            onChange: setLeaderboardProportion,
          },
          {
            id: 'leaderboard-podium',
            label: 'Top 3 Podium',
            icon: <LeaderboardIcon />,
            options: LEADERBOARD_PODIUM_OPTIONS,
            active: leaderboardPodium,
            onChange: setLeaderboardPodium,
          },
          {
            id: 'leaderboard-font-size',
            label: 'Font Size',
            icon: <FontSizeIcon />,
            options: LEADERBOARD_FONT_SIZE_OPTIONS,
            active: leaderboardFontSize,
            onChange: setLeaderboardFontSize,
          },
          {
            id: 'leaderboard-local-rows',
            label: 'Local Rows',
            icon: <DetailCountIcon />,
            options: LEADERBOARD_LOCAL_ROWS_OPTIONS,
            active: leaderboardLocalRows,
            onChange: setLeaderboardLocalRows,
          },
          {
            id: 'leaderboard-global-rows',
            label: 'Global Winners Shown',
            icon: <DetailCountIcon />,
            options: LEADERBOARD_GLOBAL_ROWS_OPTIONS,
            active: leaderboardGlobalRows,
            onChange: setLeaderboardGlobalRows,
          },
          // Only meaningful with exactly 2 Global panels showing (4
          // courseware split into 2 pairs to slide between) — hidden
          // otherwise instead of shown as a dead control.
          ...(leaderboardGlobalCount === '2'
            ? [
                {
                  id: 'leaderboard-slide',
                  label: 'Slide',
                  icon: <SlideshowIcon />,
                  options: LEADERBOARD_SLIDE_OPTIONS,
                  active: leaderboardSlide,
                  onChange: setLeaderboardSlide,
                },
              ]
            : []),
        ]
      : []),
    ...(isTrainingLevel
      ? [
          // Level 2 (CMT) only ever renders under Layout 5 (see the effect
          // above that pins it back whenever Level 2 is selected) — the
          // switcher would just be a dead control there, so it's hidden
          // instead of shown alongside a locked-in choice.
          ...(level !== 'level-2'
            ? [
                {
                  id: 'layout',
                  label: 'Layout',
                  icon: <LayoutIcon />,
                  options: LAYOUTS,
                  active: layout,
                  onChange: setLayout,
                },
              ]
            : []),
          {
            id: 'table-model',
            label: 'Table Model',
            icon: <TableModelIcon />,
            options: TABLE_MODELS,
            active: tableModel,
            onChange: setTableModel,
          },
          {
            id: 'slideshow',
            label: 'Slideshow',
            icon: <SlideshowIcon />,
            options: SLIDESHOW_INTERVALS,
            active: slideInterval,
            onChange: setSlideInterval,
          },
        ]
      : []),
    // Leaderboard model only drives LeaderboardPanel in Layouts 1-3's
    // right sidebar — Layout 5 has no such sidebar (SWT-03's own Global
    // Leaderboard variant is a separate, hardcoded component), so the
    // switcher is a dead control there.
    ...(isTrainingLevel && layout !== 'layout-5'
      ? [
          {
            id: 'leaderboard-model',
            label: 'Leaderboard',
            icon: <LeaderboardIcon />,
            options: LEADERBOARD_MODELS,
            active: leaderboardModel,
            onChange: setLeaderboardModel,
          },
        ]
      : []),
    // Container Ratio splits detail list(s) vs. the right sidebar column —
    // Layout 4 (4-station grid) and Layout 5 (5 station columns) have no
    // such split, so the control only applies to Layouts 1-3.
    ...(isTrainingLevel && layout !== 'layout-4' && layout !== 'layout-5'
      ? [
          {
            id: 'panel-ratio',
            label: 'Container Ratio',
            icon: <RatioIcon />,
            options: PANEL_RATIOS,
            active: panelRatio,
            onChange: setPanelRatio,
          },
        ]
      : []),
    // Detail Count applies to Layout 2's side-by-side details and Layout
    // 3's combined detail list — Layout 1 always has exactly one, Layout 4
    // has none.
    ...(isTrainingLevel && (layout === 'layout-2' || layout === 'layout-3')
      ? [
          {
            id: 'detail-count',
            label: 'Detail Count',
            icon: <DetailCountIcon />,
            options: DETAIL_COUNTS,
            active: detailCount,
            onChange: setDetailCount,
          },
        ]
      : []),
    // Right column exists on Layouts 1-3 only — Layout 4 (4-station grid)
    // and Layout 5 (5 station columns) have no sidebar to configure.
    ...(isTrainingLevel && layout !== 'layout-4' && layout !== 'layout-5'
      ? [
          {
            id: 'right-panel',
            label: 'Right Panel',
            icon: <RightPanelIcon />,
            options: RIGHT_PANEL_COMPONENTS,
            active: rightPanelComponents,
            multiSelect: true,
            onToggle: toggleRightPanelComponent,
          },
        ]
      : []),
    ...(isTrainingLevel
      ? [
          {
            id: 'info-banner',
            label: 'Info Banner',
            icon: <InfoBannerIcon />,
            options: INFO_BANNER_OPTIONS,
            active: infoBanner,
            onChange: setInfoBanner,
          },
        ]
      : []),
    // Level 2 (CMT) + Level 3 (CTT) + Level 4 (SWT) + Layout 5 only — the
    // other layouts' tables always show row numbers, and per-station
    // Session Leaderboard/Start Detail variants only exist here.
    ...((level === 'level-4' || level === 'level-2' || level === 'level-3') && layout === 'layout-5'
      ? [
          {
            id: 'no-column',
            label: 'No Column',
            icon: <NoColumnIcon />,
            options: NO_COLUMN_OPTIONS,
            active: noColumn,
            onChange: setNoColumn,
          },
          // Level 3's Directory is always shown (its own Zone map), so the
          // visibility toggle would be a dead control there.
          ...(level !== 'level-3'
            ? [
                {
                  id: 'directory-visibility',
                  label: 'Directory',
                  icon: <DirectoryIcon />,
                  options: DIRECTORY_OPTIONS,
                  active: directoryVisibility,
                  onChange: setDirectoryVisibility,
                },
              ]
            : []),
          ...(level === 'level-3'
            ? [
                {
                  id: 'ctt-zone',
                  label: 'Start Zone',
                  icon: <DirectoryIcon />,
                  options: CTT_ZONES_WITH_DATA,
                  active: activeZone,
                  onChange: setActiveZone,
                },
              ]
            : []),
          ...(level === 'level-4'
            ? [
                {
                  id: 'swt03-session',
                  label: 'SWT-03 Session',
                  icon: <LeaderboardIcon />,
                  options: SWT03_SESSION_OPTIONS,
                  active: swt03Session,
                  onChange: setSwt03Session,
                },
                {
                  id: 'detail-label',
                  label: 'Detail Title',
                  icon: <DetailLabelIcon />,
                  options: DETAIL_LABEL_OPTIONS,
                  active: detailTitleMode,
                  onChange: setDetailTitleMode,
                },
              ]
            : []),
          ...(level === 'level-2'
            ? cmtStations
                .filter((s) => s.isLeaderboardCapable)
                .map((station) => ({
                  id: `cmt-leaderboard-${station.code}`,
                  label: `${station.code} Session`,
                  icon: <LeaderboardIcon />,
                  options: SWT03_SESSION_OPTIONS,
                  active: cmtLeaderboardSessionByStation[station.code] ?? 'ongoing',
                  onChange: (value) =>
                    setCmtLeaderboardSessionByStation((prev) => ({ ...prev, [station.code]: value })),
                }))
            : []),
          ...(level === 'level-2'
            ? [
                {
                  id: 'cmt-not-available-style',
                  label: 'Not Available Style',
                  icon: <TableModelIcon />,
                  options: CMT_NOT_AVAILABLE_STYLE_OPTIONS,
                  active: cmtNotAvailableStyle,
                  onChange: setCmtNotAvailableStyle,
                },
              ]
            : []),
          {
            id: 'station-data-count',
            label: 'Data Count',
            icon: <DetailCountIcon />,
            options: DATA_COUNT_OPTIONS,
            active: stationDataCount,
            onChange: setStationDataCount,
          },
          ...(level === 'level-4'
            ? swtStations
            : level === 'level-3'
              ? cttStations
              : cmtStations.filter((s) => !s.noBooking)
          ).map((station) => ({
            id: `start-detail-${station.code}`,
            label: `${station.code} Start Detail`,
            icon: <DetailCountIcon />,
            options: START_DETAIL_OPTIONS,
            active: startDetailByStation[station.code] ?? '1',
            onChange: (value) =>
              setStartDetailByStation((prev) => ({ ...prev, [station.code]: value })),
          })),
        ]
      : []),
    // Layout 5 only — independent font-size controls, available on any
    // level since they're purely visual, not tied to Level 4's flip logic.
    ...(layout === 'layout-5'
      ? [
          {
            id: 'table-font-size',
            label: 'Table Font Size',
            icon: <FontSizeIcon />,
            options: TABLE_FONT_SIZE_OPTIONS,
            active: tableFontSize,
            onChange: setTableFontSize,
          },
          {
            id: 'detail-font-size',
            label: 'Detail Name Font Size',
            icon: <FontSizeIcon />,
            options: DETAIL_FONT_SIZE_OPTIONS,
            active: detailFontSize,
            onChange: setDetailFontSize,
          },
          {
            id: 'station-font-size',
            label: 'Base Station Font Size',
            icon: <FontSizeIcon />,
            options: STATION_FONT_SIZE_OPTIONS,
            active: stationFontSize,
            onChange: setStationFontSize,
          },
        ]
      : []),
  ]

  const ActiveLayout = LAYOUT_COMPONENTS[layout] ?? LayoutOne
  const activeStation = stations[stationIndex].id
  const activeFont = FONTS.find((f) => f.id === font) ?? FONTS[0]
  const TrainingBoard = TRAINING_BOARD_COMPONENTS[level] ?? SwtBoard
  const currentLevelLabel = LEVELS.find((l) => l.id === level)?.label ?? 'Level 1'

  return (
    <>
      {/* The Leaderboard floor always fits to the screen height (no
          scroll), independent of the Display switcher — its row-count
          switchers (Local Rows / Global Winners Shown) can go up to 15
          rows per panel, and a leaderboard is meant to be read as a
          single static screen rather than scrolled. */}
      <FitToScreen active={display === 'tv' || isLeaderboardFloor}>
        <div className="app" style={{ fontFamily: activeFont.stack }}>
          <Header
            station={currentLevelLabel}
            detailLabel={isLeaderboardFloor ? 'Rankings' : isTrainingLevel ? 'Detail 2' : 'Lobby'}
            title={
              level === 'level-4'
                ? 'Specialized Weapon Trainer\nTraining Information Board'
                : level === 'level-2'
                  ? 'Company Tactical Mission Trainer\nTraining Information Board'
                  : level === 'level-3'
                    ? 'Command Team Trainer\nTraining Information Board'
                    : level === 'level-1'
                      ? 'Today Bookings'
                      : isLeaderboardFloor
                        ? 'Leaderboard'
                        : 'Infoboard'
            }
          />
          {isTrainingLevel && layout === 'layout-5' && (
            <FlipProgressBar tick={flipTick} intervalMs={LAYOUT_FIVE_STEP_INTERVAL_MS} />
          )}
          {isTrainingLevel ? (
            <TrainingBoard
              ActiveLayout={ActiveLayout}
              tableModel={tableModel}
              leaderboardModel={leaderboardModel}
              activeStation={activeStation}
              panelRatio={panelRatio}
              detailCount={detailCount}
              rightPanelComponents={rightPanelComponents}
              showInfoBanner={infoBanner === 'visible'}
              level={level}
              hideNoColumn={noColumn === 'hidden'}
              hideDirectory={directoryVisibility === 'hidden'}
              swt03Session={swt03Session}
              cmtLeaderboardSessionByStation={cmtLeaderboardSessionByStation}
              cmtNotAvailableStyle={cmtNotAvailableStyle}
              detailTitleMode={detailTitleMode}
              stationDataCount={stationDataCount}
              startDetailByStation={startDetailByStation}
              activeZone={activeZone}
              zoneTick={zoneTick}
              flipTick={flipTick}
              tableFontSize={tableFontSize}
              detailFontSize={detailFontSize}
              stationFontSize={stationFontSize}
            />
          ) : isLeaderboardFloor ? (
            <LeaderboardFloorBoard
              columnRatios={LEADERBOARD_PROPORTION_OPTIONS.find((o) => o.id === leaderboardProportion)?.ratios ?? [40, 15, 15, 15, 15]}
              showPodium={leaderboardPodium === 'visible'}
              globalCount={Number(leaderboardGlobalCount)}
              fontScale={LEADERBOARD_FONT_SIZE_OPTIONS.find((o) => o.id === leaderboardFontSize)?.scale ?? 1}
              globalRowCount={Number(leaderboardGlobalRows)}
              localRowCount={Number(leaderboardLocalRows)}
              slidePairIndex={leaderboardGlobalCount === '2' && leaderboardSlide === 'on' ? leaderboardSlideTick : 0}
            />
          ) : (
            <>
              <InfoBanner lead="Level 1 Lobby" message="Today's bookings and facility announcements are shown below." />
              <LobbyBoard intervalMs={Number(lobbyInterval) * 1000} />
            </>
          )}
        </div>
      </FitToScreen>
      <LayoutSwitcher groups={switcherGroups} />
    </>
  )
}
