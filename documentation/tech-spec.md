# Technical Specification

**Status: STUB** — Architecture direction set; stack decisions pending planning session.

---

## Architecture Philosophy

Build the simplest thing that works for Phase 1, designed so the backend can be added cleanly when Phase 2 (multiplayer) requires it. Avoid over-engineering for features that don't exist yet.

---

## Phase 1: Client-Side Only

The initial text-based experience runs entirely in the browser. No server calls, no backend required.

### What this means
- All game logic runs in the browser (JavaScript)
- Game state persists via `localStorage`
- No authentication in Phase 1
- Deployable as static files to any CDN or hosting service

### Constraints
- Must be accessible in a standard browser, no install required
- Text-based UI only (graphics layer planned for a future phase)

---

## Phase 2: Backend (when multiplayer is needed)

### Local Development
- **Docker** for local containerized services
- Database container(s) managed via `docker-compose`

### Deployment Options (to be decided)
- Railway
- Supabase (includes Postgres + auth out of the box)
- Google Cloud
- AWS

### Likely Backend Requirements
- Real-time game state synchronization (WebSockets)
- User accounts and auth
- Persistent progress storage
- Possibly: teacher dashboard, assignment management

---

## Stack Decisions

### Decided
| Concern | Decision | Notes |
|---------|----------|-------|
| Phase 1 rendering | Browser (static) | No server required |
| State persistence (P1) | `localStorage` | Sufficient for single-player |
| Local dev (P2) | Docker | Already running locally |
| Deployment (P2) | TBD | Railway / Supabase / GCloud / AWS |

### Pending
| Concern | Options | Notes |
|---------|---------|-------|
| Frontend framework | Vanilla JS, React, Svelte, Vue | TBD after planning |
| Backend language | Node.js, Python, Go | TBD; Go is a strength |
| Backend framework | Express, Fastify, FastAPI, Gin | TBD |
| Database | Postgres, SQLite | TBD; Supabase simplifies this |
| Real-time layer | WebSockets, Supabase Realtime | TBD |
| Auth | Supabase Auth, Auth.js, custom | TBD |
| CSS approach | TBD | Text-based P1 may not need much |

---

## Key Architectural Considerations

### Separating game logic from presentation
Game logic (hand evaluation, probability calculations, NPC behavior, progression state) should be framework-agnostic from day one. This makes the eventual graphical upgrade a presentation-layer swap, not a rewrite.

### NPC behavior as a module
Each NPC's decision logic should be a discrete, testable module. This makes it possible to write unit tests against specific probability concepts.

### Chief Dodo as a rule engine
Chief Dodo's feedback triggers are rules applied to game events. This layer should be separable from the UI so it can eventually be replaced or augmented with an LLM-backed coaching layer.

---

## Open Decisions

- Frontend framework choice (deferred until post-planning)
- Whether Phase 1 uses a lightweight framework or vanilla JS/HTML
- Module/package structure for game logic vs. UI
- Testing approach for probability-heavy game logic
