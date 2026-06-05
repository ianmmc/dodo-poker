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
- No free text input except wager amounts; all choices are clickable buttons rendered by Svelte

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
| CSS approach | Inline `<style>` per component | Resolved — no external framework needed; `white-space: pre-line` on `.dialog-text` allows `\n` in JSON node text for mid-line breaks |

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
- `numeric` — single number entry with a static `correctAnswer`; `feedback.tooHigh` / `tooLow` / `correct` routing
- `live-numeric` — numeric assessment where the question text and correct answer are derived from the current `FrequencyData` at enqueue time. Uses `textTemplate` (with `{{key}}` placeholders) and `correctAnswerKey` (a named key from the `LiveDataKey` enum in `liveData.ts`). `resolveLiveNode()` in App.svelte converts it to a concrete `numeric` node before it enters the dialog queue — the assessment system sees only `numeric` nodes; `live-numeric` never reaches the queue directly. Add new keys to `LiveDataKey` in `liveData.ts` and to `KNOWN_LIVE_DATA_KEYS` in `verify-math.py` simultaneously.
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
| `src/lib/game/` | Game logic: card (+ `cardAltText`), hand evaluation, Five Card Draw state machine, NPC, storage, assessment, observationEngine, scriptedHands, frequencyData, simulationEngine, **liveData** |
| `src/lib/dialog/` | Dialog engine: node loading, pool selection, trigger logic, `getNode()`, `getChain()`, `firedOnce` registry, `firedOnceChain()` helper, TABLE_1B_* / TABLE_2A_* threshold constants |
| `src/lib/components/` | Svelte UI components: CardImage (+ `animState` prop), ReferenceCard, FrequencyTable, SurveillanceRoom, DevPanel |
| `src/App.svelte` | Application shell: all screens, game loop, dialog queue, assessment state, `resolveLiveNode()`, NPC draw animation state machine |
| `dialog/` | JSON dialog trees (content only — no logic) |
| `tools/verify-math.py` | Pre-commit math verification: 31 checks covering hand frequencies, hole-card probabilities, draw outs, and all `correctAnswer` values in dialog JSON. Run via `npm run verify-math`. |
| `.hooks/pre-commit` | Git pre-commit hook (symlinked via `npm run setup-hooks`): runs `tsc --noEmit`, `vitest run`, and `verify-math.py` before every commit. Lives in the repo, versioned alongside code. |

---

## Naming Conventions

### NPC fields vs. character names

`GameState` uses generic `npc*` field names (`npcHand`, `npcSeeds`, `npcPendingBet`, `npcLastAction`, `npcDrawCount`) and `HandResult` uses `npcHandName` / `npcFolded` / `winner: 'npc'`. These are table-agnostic: the same game engine handles Table 1A (Hank) and Table 1B (Lucky/backups) without modification.

Character names — `hank`, `lucky` — appear only in: NPC module exports (`npc.ts`), dialog node `speaker` fields, dialog node IDs at the table where that character permanently resides (e.g. `t1a-hank-*` nodes stay Hank-specific because Hank is Table 1A's permanent NPC).

`speakerLabel()` in App.svelte resolves dialog bubble speaker labels using two cooperating mechanisms built for single-NPC and multi-NPC tables:

1. **`currentNpcSpeakerId`** — the dialog JSON `speaker` ID of the primary NPC at the current table (`'hank'`, `'lucky'`, `'vivian'`, `'rex'`, etc.). Any node whose `speaker` matches this ID displays as `currentNpcName`. This preserves backup NPC swap behavior: backup NPCs at Table 1B reuse `speaker: 'lucky'` nodes, so they automatically display as whatever name `currentNpcName` holds (e.g. `'Morty'`).

2. **`NPC_DISPLAY_NAMES`** — a static registry in App.svelte mapping every NPC's speaker ID to their canonical display name. Used for secondary NPCs at multi-player tables (Table 3C+) who have their own speaker IDs and must each show their own name. Add an entry when building each new NPC's table.

Backup NPCs are handled correctly: `swapNpc()` updates `currentNpcName` to the backup's name but leaves `currentNpcSpeakerId` unchanged — their dialog nodes still use the primary NPC's speaker ID.

### Dialog node ID convention

- Table-specific, character-generic: `t1b-npc-call`, `t1b-npc-bet`, `t1b-npc-draw-0` — used wherever the identity of the Table 1B NPC may change
- Table-specific, character-specific: `t1a-hank-*` — used only where Hank is permanently the opponent and the dialog text names him explicitly

### GameState fields — notable additions

Two fields added to `GameState` beyond the standard betting/hand state are worth documenting because they serve cross-cutting concerns:

- **`callAmount: number`** — the amount the player must pay to call the NPC's pending bet. Always equals `betAmount` in current fixed-limit tables; tracked explicitly so future variable-bet tables (raises, pot-limit, Hold'Em multi-street) do not require structural changes. Set by `playerCheck()`, reset by every other state transition.
- **`npcDiscardIndices: number[]`** — indices (0–4) of the cards the NPC discarded in the most recent draw. Set by `playerDraw()`, reset to `[]` by `startHand()`. Used by the draw animation in App.svelte — storing it here avoids calling the NPC decider twice and keeps the animation logic stateless.

### Dialog engine patterns

**`firedOnceChain(id, condition)`** — private helper in `engine.ts` that extracts the identical four-line guard used by all one-shot sequences (pattern reveal, gambler's fallacy, Lucky due, surveillance room intro, Hank retro, gate assessment). Every trigger function is a single call to this helper.

**TABLE_1B threshold constants** — `TABLE_1B_SURV_THRESHOLD`, `TABLE_1B_HANK_RETRO_THRESHOLD`, `TABLE_1B_GATE_THRESHOLD` are exported from `engine.ts` and referenced in both the engine guard functions and `devJumpToHand()` in App.svelte. Changing a threshold in one place propagates everywhere automatically.

**`getPreHandNode(handNumber)` returns `DialogNode[]`** — pre-hand sequences can be multi-node chains. The engine function returns a chain from the first node (`chain('t1a-hand-1-pre')` for hand 1; pool selection wrapped in array for subsequent hands). All callers spread the result with `...getPreHandNode(n)`. Any future multi-node pre-hand sequence works without touching App.svelte.

### NPC draw animation

The draw animation (`CardImage.svelte`) is driven by `animState: 'idle' | 'slide-out' | 'empty' | 'deal-in'` prop. The sequencing in App.svelte uses a `pendingNpcDrawAnim: boolean` flag:

1. `doDraw()` enqueues the draw-declaration dialog (draw comment + "Two." etc.) immediately and sets `pendingNpcDrawAnim = true`
2. `advance()` checks the flag when the queue empties and starts `startNpcDrawAnimation()`
3. CSS keyframe animations run; `finishNpcAnim()` resets state

This ensures the NPC declares how many cards they want before the animation plays, matching actual poker etiquette. `NPC_DEAL_INTERVAL_MS` (350ms) and `NPC_SLIDE_OUT_MS` (400ms) are configurable constants at the top of App.svelte.

The template uses inlined ternary expressions rather than a helper function call to compute `animState` — this is required in Svelte 5 so that reactive dependencies (`npcAnimPhase`, `npcAnimDealtCount`, `game.npcDiscardIndices`) are tracked directly in the template's reactive scope.

### Tie handling

`resolveHandOutcome(result)` returns `'win' | 'loss' | 'fold' | 'tie'` — ties are a distinct outcome, not collapsed to `'loss'`. `postHandNodesForOutcome(outcome)` routes ties to `getTie1BNodes()` (first-occurrence chain or brief pool) or `getTie1ANode()` (brief pool). `updateFreqForHand()` passes `'tie'` to `updateFrequencyData()` which already tracked `ties: number`. The Tie row in the frequency table is hidden until `data.ties > 0` — its appearance is the pedagogical moment.

### Simulation architecture

`simulationEngine.ts` separates simulation logic from display:

- **Phase 1** (`card-stream` mode): `runCardDrawSim(n)` runs the full card-draw simulation instantly; `SurveillanceRoom.svelte` animates display via `requestAnimationFrame` (counter + progressive graph + CSS card stream).
- **Phase 2 foundation** (`cinematic` mode): `SimMode`, `SimulationController<T>`, `PokerSimHandResult`, `PokerSimConfig` types are defined and stable. The cinematic split-screen (mini table, hand-by-hand replay) will implement `SimulationController` without touching Phase 1 code.

### Accessibility standard

WCAG 2.1 Level AA is the compliance target. Implementation approach:

- **Color contrast**: All text/background pairs meet 4.5:1 (normal) or 3.0:1 (large/UI) ratios. Values are set in component `<style>` blocks; any future color additions must be checked against the relevant background before committing.
- **ARIA semantics**: Interactive controls carry `aria-label` or visible label; dynamic dialog content uses `aria-live="polite" aria-atomic="true"`; checklist options use `aria-pressed`; the frequency table toggle uses `aria-expanded`; card images use human-readable alt text via `cardAltText()` exported from `card.ts`.
- **Semantic HTML**: Non-interactive cards render as `<div role="img">`, interactive (draw-phase) cards as `<button>`. Assessment checklist items are `<button aria-pressed>`, not styled checkboxes.
- **Focus management**: Screen transitions (AX-07) and full keyboard-only gameplay (AX-06) remain in progress; these are tracked in requirements.md.
- **Testing**: Logic-layer properties testable in isolation (e.g., `cardAltText`) are covered in unit tests. DOM-layer properties (contrast ratios, focus behavior, screen reader announcements) require browser-based audit tooling and are verified manually.

---

## Open Decisions

| Concern | Status | Notes |
| --- | --- | --- |
| Gameplay observation (passive assessment) | Done | `observationEngine.ts`: `HandSummary` type, per-session observation log, three 1A coaching rules (fold-streak, loss-streak, max-draw), fired-rule persistence |
| Scripted hands (stacked deck) | Done | `scriptedHands.ts`: `ScriptedDeal` interface, `getScriptedDeal()`; App overrides deal when `pendingScriptedHandId` is set |
| Numeric input UI | Done | `evaluateNumeric` + UI block in `App.svelte`; used for Table 1B procedural assessment |
| CSS approach | Inline `<style>` per component | Working well for Phase 1; no external CSS framework needed |
| Betting rotation (Table 2A+) | Done | `npcActsFirst: boolean` + `noDraw: boolean` in `GameState`; `startHand()` sets `npcActsFirst = noDraw && handNumber % 2 === 1`; `handleNpcOpens()` in App.svelte computes Vivian's opening decision and enqueues it when `npcActsFirst=true`; future rotation rules change only `startHand()` logic |
| Backend language | TBD (Phase 2) | Go is a known strength; Node shares TypeScript types with frontend |
| Backend framework | TBD (Phase 2) | Express, Fastify, or Gin |
| Database | TBD (Phase 2) | Postgres preferred; Supabase simplifies auth + realtime |
| Real-time layer | TBD (Phase 2) | WebSockets or Supabase Realtime |
