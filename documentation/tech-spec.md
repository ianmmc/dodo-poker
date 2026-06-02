# Technical Specification

**Status:** Core stack decided; backend details pending until Phase 2.

---

## Architecture Philosophy

Build the simplest thing that works for Phase 1, designed so the backend can be added cleanly when Phase 2 (multiplayer) requires it. Avoid over-engineering for features that don't exist yet.

---

## Phase 1: Client-Side Only

The initial experience runs entirely in the browser. No server calls, no backend required.

### What this means

- All game logic runs in the browser (TypeScript, compiled to JS)
- Game state persists via `localStorage`
- No authentication in Phase 1
- Deployable as static files to any CDN or hosting service

### Constraints

- Must be accessible in a standard browser, no install required
- Text-based UI with SVG card assets; full graphical version planned for a future phase
- No free text input except wager amounts; all choices are presented as numbered menus or arrow-key navigation

### Deployment: Phase 1

- **Hostinger** — deploy as a static site to a subdomain of `mccullough.com`, e.g. `dodo-poker.mccullough.com`, via the Hostinger MCP
- Precedent: `../Development/concordiatra` was deployed this way; use it as a reference for setup
- Self-contained single-page app deployable as static files (`vite build` → `dist/`)

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
| --- | --- | --- |
| Phase 1 rendering | Browser (static) | No server required |
| State persistence (P1) | `localStorage` | Sufficient for single-player |
| Local dev (P2) | Docker | Already running locally |
| Frontend language | TypeScript | Static typing for game state, dialog trees, NPC modules; compiles to vanilla JS |
| Frontend framework | Svelte + Vite | Reactive state model fits game loop; compiles to tiny JS bundle; no runtime overhead |
| Card rendering | SVG assets | `hayeah/playing-cards-assets` in `/assets`; SVG scales perfectly; Surveillance Room shows stats, not card images |
| Dialog system | JSON dialog trees | Chief Dodo coaching and NPC flavor text stored as JSON data; engine traverses it — swappable later for LLM API response conforming to the same schema |

### Pending

| Concern | Options | Notes |
| --- | --- | --- |
| Backend language | Node.js/Bun, Go | Go is a known strength; Node shares TypeScript types with frontend |
| Backend framework | Express, Fastify, Gin | TBD |
| Database | Postgres, SQLite | TBD; Supabase simplifies this |
| Real-time layer | WebSockets, Supabase Realtime | TBD |
| Auth | Supabase Auth, Auth.js, custom | TBD |
| CSS approach | TBD | Text-heavy UI; minimal styling in Phase 1 |

---

## Key Architectural Considerations

### Separating game logic from presentation

Game logic (hand evaluation, probability calculations, NPC behavior, progression state) should be framework-agnostic from day one. This makes the eventual graphical upgrade a presentation-layer swap, not a rewrite.

### NPC behavior as a module

Each NPC's decision logic should be a discrete, testable module. This makes it possible to write unit tests against specific probability concepts.

### Chief Dodo as a rule engine

Chief Dodo's feedback triggers are rules applied to game events. Dialog content lives in JSON trees that the engine traverses — not in TypeScript logic. This separation means the data source can be swapped (e.g., replaced by an LLM API response conforming to the same schema) without touching the engine.

### Dialog tree JSON schema

Each dialog node has a `responseType` that determines what the player sees after Chief Dodo speaks:

```json
{
  "id": "string",
  "speaker": "chief-dodo | npc-id",
  "text": "string",
  "responseType": "none | action | checklist | numeric",

  "options": [
    { "id": "string", "text": "string", "correct": true }
  ],

  "fields": [
    { "id": "string", "label": "string", "min": 0, "max": 47 }
  ],

  "followUp": {
    "default": "dialog-node-id",
    "ifSelected:option-id": "dialog-node-id",
    "ifCorrect": "dialog-node-id",
    "ifLow": "dialog-node-id",
    "ifHigh": "dialog-node-id"
  }
}
```

- `none` — statement only; no response expected; engine advances automatically
- `action` — numbered action menu (call/raise/fold/check/draw); `options` list drives the menu
- `checklist` — 5–7 statements, multi-select; mix of correct reasoning and common misconceptions; `followUp` keys on specific selected option IDs to enable targeted responses to particular misconceptions
- `numeric` — one or more labeled number fields (`fields`); `followUp` branches on correct / too-high / too-low

---

## Open Decisions

- Module/package structure for game logic vs. UI
- Testing approach for probability-heavy game logic
- `localStorage` schema for player state persistence
