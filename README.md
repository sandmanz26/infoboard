# Infoboard

Frontend-only React duplication of the Training Resource Management System infoboard screen
(detail list, top-3 podium leaderboard, directory map, and full leaderboard). All data is
static — there is no backend.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production build is emitted to `dist/`.

## Deploying to Vercel

Import the repository in Vercel — the Vite preset is detected automatically
(build command `npm run build`, output directory `dist`). No environment
variables are required.
