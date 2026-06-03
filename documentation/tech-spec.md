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

Full reference at `development/dialog/schema.md`. Implemented fields:

```json
{
  "id": "string",
  "speaker": "chief-dodo | npc-id | null",
  "text": "string — supports {{varName}} template interpolation",
  "responseType": "none | checklist | numeric | single-select | estimate | prediction",

  "silent": true,
  "pool": "pool-name",
  "weight": 2,

  "trigger": {
    "handNumber": 1,
    "minHandsPlayed": 5,
    "playerDiscards": 0,
    "once": true
  },

  "options": [
    { "id": "string", "text": "string", "correct": true }
  ],

  "feedback": {
    "correct":       "dialog-node-id",
    "attempt1Wrong": "dialog-node-id",
    "attempt2Wrong": "dialog-node-id",
    "attempt3Wrong": "dialog-node-id",
    "tooHigh":       "dialog-node-id",
    "tooLow":        "dialog-node-id"
  },

  "correctAnswer": 0,

  "followUp": {
    "default":           "dialog-node-id",
    "returnToGame":      true,
    "advanceTable":      true,
    "openReferenceCard": true,
    "openSurveillanceRoom": true
  }
}
```

**responseType values:**

- `none` — statement only; engine advances to `followUp.default` or returns to game
- `checklist` — multi-select from `options`; `feedback` nodes receive `{{needToCheck}}` and `{{needToUncheck}}` template vars
- `numeric` — single number entry; `feedback.tooHigh` / `tooLow` / `correct` routing; feedback nodes receive `{{entered}}` and `{{correct}}` vars
- `single-select`, `estimate`, `prediction` — reserved for future implementation

**Pool / weighted random:** nodes sharing a `pool` name are sampled by weight. `silent: true` nodes return null (no dialog shown) — used to introduce probability of silence.

**followUp.openReferenceCard:** when `true`, the reference card panel opens as the node is displayed. Used when Chief Dodo hands the student the reference card.

**followUp.advanceTable:** when `true`, the chain-traversal stop condition sets the table-gate flag (`gatePassedAt1A`, etc.) in App state when the student advances past that node. The "Move to next table" CTA then appears.

**followUp.openSurveillanceRoom:** when `true`, chain traversal stops at that node; App routes to the Surveillance Room screen.

---

## Assessment Architecture

Three cleanly separated concerns — content, evaluation, and record — so that new assessment modes can be added without touching existing infrastructure.

### Content (dialog JSON)

Interactive nodes carry `options` (with `correct` flags), a `feedback` map (node IDs per attempt outcome), and optional `correctAnswer`. Content authors write questions and flag correct answers; no evaluation logic lives in the JSON.

### Evaluation (`src/lib/game/assessment.ts`)

A standalone module with no dependencies on the dialog engine or UI. Accepts a node ID, response, and correct answer; returns an `AssessmentResult` (correct, attemptNumber, feedbackNodeId, exhausted, templateVars). Tracks attempt counts in memory per session. Fully unit-tested.

Adding a new assessment mode requires: (1) adding the `responseType` string to the `DialogNode` union in `engine.ts`, (2) an evaluation function in `assessment.ts`, (3) a UI block in `App.svelte`. Attempt tracking, record-keeping, and feedback routing are shared infrastructure.

### Record (`assessmentLog` in `localStorage`)

Final outcomes (nodeId, responseType, attempts, correct) persisted alongside game state via `storage.ts`. The competency gate queries this log. Restored on session continue via `restoreAssessmentLog()`.

### Checklist scaffolding (3-attempt ladder)

- Attempt 1 wrong → directional hint node
- Attempt 2 wrong → quantitative hint node (template vars: `{{needToCheck}}`, `{{needToUncheck}}`)
- Attempt 3 wrong → reveal node; `exhausted: true` returned

The ladder behavior is in the engine; the copy is in JSON. The two can evolve independently.

### Module structure (established)

| Path | Contents |
| --- | --- |
| `src/lib/game/` | Game logic: card, hand evaluation, Five Card Draw state machine, NPC, storage, assessment, observationEngine, scriptedHands, frequencyData |
| `src/lib/dialog/` | Dialog engine: node loading, pool selection, trigger logic, `getNode()`, `getChain()`, `firedOnce` registry |
| `src/lib/components/` | Svelte UI components: CardImage, ReferenceCard, FrequencyTable, SurveillanceRoom, DevPanel |
| `src/App.svelte` | Application shell: all screens, game loop, dialog queue, assessment state |
| `dialog/` | JSON dialog trees (content only — no logic) |

---

## Open Decisions

| Concern | Status | Notes |
| --- | --- | --- |
| Gameplay observation (passive assessment) | Done | `observationEngine.ts`: `HandSummary` type, per-session observation log, three 1A coaching rules (fold-streak, loss-streak, max-draw), fired-rule persistence |
| Scripted hands (stacked deck) | Done | `scriptedHands.ts`: `ScriptedDeal` interface, `getScriptedDeal()`; App overrides deal when `pendingScriptedHandId` is set |
| Numeric input UI | Done | `evaluateNumeric` + UI block in `App.svelte`; used for Table 1B procedural assessment |
| CSS approach | Inline `<style>` per component | Working well for Phase 1; no external CSS framework needed |
| Backend language | TBD (Phase 2) | Go is a known strength; Node shares TypeScript types with frontend |
| Backend framework | TBD (Phase 2) | Express, Fastify, or Gin |
| Database | TBD (Phase 2) | Postgres preferred; Supabase simplifies auth + realtime |
| Real-time layer | TBD (Phase 2) | WebSockets or Supabase Realtime |
