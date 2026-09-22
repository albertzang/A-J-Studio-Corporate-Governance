# A-J Studio Corporate Governance

A small full-stack corporate governance portal for A-J Studio. It lists the
board of directors and upcoming meetings, and lets the board vote on
resolutions. A resolution passes (or is rejected) once it reaches a majority of
the five-member board.

## Stack

- **API** — Node.js + Express + TypeScript (`server/`)
- **Web** — React + Vite + TypeScript (`web/`)
- **Tests** — Vitest + Supertest (`server/test`)
- npm workspaces tie the two packages together.

## Getting started

```bash
npm install        # installs both workspaces
npm run dev         # runs the API (:4000) and web app (:5173) together
```

Then open http://localhost:5173. The Vite dev server proxies `/api` requests to
the Express API on port 4000.

### Run the pieces individually

```bash
npm run dev:server  # API only, on http://localhost:4000
npm run dev:web     # web app only, on http://localhost:5173
```

## Useful scripts

| Command             | Description                                         |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Run API and web dev servers concurrently            |
| `npm run build`     | Type-check/compile the API and build the web bundle |
| `npm test`          | Run the API test suite (Vitest + Supertest)         |
| `npm run typecheck` | Type-check both workspaces                           |
| `npm run lint`      | Lint the codebase with ESLint                       |

## API

| Method | Path                          | Description                        |
| ------ | ----------------------------- | ---------------------------------- |
| GET    | `/api/health`                 | Health check                       |
| GET    | `/api/board-members`          | List board members                 |
| GET    | `/api/meetings`               | List meetings                      |
| GET    | `/api/resolutions`            | List resolutions with vote tallies |
| POST   | `/api/resolutions/:id/vote`   | Cast a vote (`{ "choice": "for" \| "against" }`) |

## Cloud Agent environment

`.cursor/environment.json` installs dependencies with `npm install` and starts
the `api` and `web` dev servers in named terminals. Ports 4000 (API) and 5173
(web) are exposed.
