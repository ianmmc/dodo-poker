# Session Handoff

This document gives future Claude sessions the context needed to pick up where we left off. Update it at the end of each working session.

---

## What This Project Is

**dodo-poker** is an educational web app that teaches probability and statistics to grades 6–12 students through a bird-themed poker game set in The Nest, a members-only bird social club in Los Angeles. The pedagogical philosophy is learn-by-doing: students play, make decisions, make mistakes, and receive coaching from their guide, Chief Dodo.

The project was inspired by Jacob Kantor — an education technology sales consultant who uses a dodo bird as his professional brand (DODO = "district office door opener") and is an avid poker player. The name and theme are a nod to him, but the product is serious.

---

## Key Design Decisions (and why)

| Decision | Rationale |
| --- | --- |
| Competency-driven progression, not age/grade | A 6th grader and a 48-year-old adult use the same product; depth follows mastery, not birthdate |
| Fixed bet at Table 1A (5 seeds, no raises) | Focus is on observing Hank's pattern and building probability intuition, not bet sizing |
| Assessment interleaved with play, not batched | Research (Konold, Shaughnessy): correct probability understanding requires predict→observe→compare cycles at the moment of observation |
| Pot and Bet both visible in the header | Students need to know what each decision costs |
| Concept-first, variant-second sequencing | Probability concepts drive the sequence; poker variants are vehicles |
| No opening tutorial | Learn-by-doing; Chief Dodo reacts to moments |
| Experimental before formal | Frequency/observation before fractions and formal probability |
| 90% mastery threshold, three-component gate | Research: skill decay at 80%; gates require procedural + conceptual + transfer |
| NPCs are pedagogical, not random | Each NPC embodies a specific reasoning pattern; defeating them requires understanding it |
| Chief Dodo is the formative assessment mechanism | Gates feel like game challenges; CD's in-hand coaching is the formative loop |
| Seeds, not chips | The Nest uses colored seeds as tokens |
| Text-based first, SVG cards | Focus on mechanics and learning before full graphics |
| Client-side only in Phase 1 | Simplest viable product; backend added when multiplayer requires it |
| CCSS as reference map, not curriculum driver | Standards are a coverage check, not the sequence driver |
| Dialog trees as JSON, not hardcoded logic | CD's coaching text is data; swappable for LLM API response conforming to same schema |
| Button-driven input | All choices are clickable buttons; no numbered-list numeral entry |
| Front room house rule: guest bets first | Tables 1A and 1B are "the front room"; rotation introduced at a later table when position becomes the lesson |
| WCAG 2.1 AA accessibility compliance | Educational tool that must serve students with disabilities; edtech procurement commonly requires it |

---

## Current State

**Phase:** Implementation — Tables 1A, 1B, and 2A complete end-to-end, play-tested, and bug-fixed. Table 2B (Texas Hold'Em, Rex the Ruffed Grouse) is the next build target.

### Completed

- All documentation, user stories, game design, and curriculum planning complete
- Dialog trees: `start-of-game.json` (9 nodes), `table-1a.json` (51 nodes), `table-1b.json` (65 nodes)
- **Game logic** (`development/src/lib/game/`):
  - `card.ts` — Card type, deck, shuffle, SVG path mapping, `cardAltText()` (AX-05)
  - `hand.ts` — Hand evaluation via pokersolver
  - `npc.ts` — `hank` (never folds, always bets) and `lucky` (3-state fold/check/bet probability table driven by streak state)
  - `fiveCardDraw.ts` — Complete Five Card Draw state machine; `playerDraw(state, indices, npcDecider)` passes the active NPC's draw function (table-correct); `playerCheckNpcCheck()` for mutual check; all fields use `npc*` prefix
  - `storage.ts` — localStorage save/load/clear with defensive `?? defaults` throughout
  - `assessment.ts` — `evaluateChecklist`, `evaluateNumeric`, 3-attempt scaffolding, `clearAssessmentState()`
  - `observationEngine.ts` — `HandSummary` type, three 1A coaching rules, fired-rules persistence
  - `scriptedHands.ts` — `ScriptedDeal` with `npcCards`, `getScriptedDeal()`
  - `frequencyData.ts` — `FrequencyData` interface, `HAND_NAME_MAP` uses `'Pair'` (pokersolver)
  - `backupNpcs.ts` — 10 backup NPC characters; `getNextBackup(usedIds)`
  - `simulationEngine.ts` — `runCardDrawSim(n)` Phase 1; `SimMode`, `SimulationController<T>` Phase 2 foundations
- **Dialog engine** (`development/src/lib/dialog/engine.ts`): loads all three JSON files; `getStartOfGameChain()`, `getAvatarResponse(id)`, all Table 1A/1B functions, new `getHankRetroAssessment()`
- **UI components**: all WCAG 2.1 AA compliant after code review pass
  - `App.svelte` — full game loop; `isNpc: boolean` on `DisplayLine` drives correct NPC speaker color for backup NPCs; `aria-live` on dialog text; `aria-pressed` on checklist items; `aria-labelledby` on numeric inputs; contrast-fixed throughout
  - `CardImage.svelte` — semantic split: `<button>` for clickable (draw phase), `<div role="img">` for display; human-readable alt text from `cardAltText()`
  - `FrequencyTable.svelte` — `aria-label` + `aria-expanded` on toggle
  - `ReferenceCard.svelte`, `SurveillanceRoom.svelte` — contrast fixed
  - `DevPanel.svelte` — `role="presentation"` on backdrop
- **Table 1A progression complete**:
  - Approach sequence, house rule ("guests always bet first"), pattern reveal at hand 3, gambler's fallacy at hand 8+ (only when Hank is factually on a losing streak; fallback at hand 15), assessments, gate
  - Hank seed refill when busted (`refillNpcAt1A`, `t1a-hank-refill`)
- **Table 1B progression complete**:
  - Approach sequence with Lucky, house rule, frequency table, Lucky's gambler's fallacy coaching
  - Surveillance Room intro at hand 10; 100/1k/10k draw animation with counter + progressive graph + CD commentary
  - **Hank retrospective assessment at hand 14+** (new): CD bridges from Table 1A "always-bet" observation to frequency data — student uses the table to explain why Hank's strategy costs him; incorrect foil deliberately echoes Lucky's gambler's fallacy
  - Gate assessment at hand 18: procedural (relative frequency %) + conceptual (Lucky rebuttal) + transfer (LLN)
  - NPC swap system with 10 backup characters
- **Test suite**: 228 tests across 12 files — all passing
  - `liveData.test.ts` added (16 tests): `buildDataContext`, `renderTemplate`, `resolveKey`, full assessment scenario, NaN-safety edge case

### Key Implementation Details

- `publicDir: '../assets'` in `vite.config.ts` serves card SVGs at `/svg-cards/` and images at root
- Svelte 5 legacy mode (no runes); `mount()` not `new App()` in `main.ts`
- Dialog queue drives game rhythm; `pendingPostAssessment` stash prevents pre-hand nodes from appearing mid-assessment
- **NPC speaker resolution**: `currentNpcSpeakerId` (primary NPC's dialog speaker ID) + `NPC_DISPLAY_NAMES` (static registry). `speakerLabel()`: matches `currentNpcSpeakerId` → `currentNpcName` (handles backup swaps); other speaker IDs → `NPC_DISPLAY_NAMES` lookup (secondary NPCs at multi-player tables). `isNpc: !!speaker && speaker !== 'chief-dodo'` covers all NPCs past and future.
- **`live-numeric` assessment type**: question text and correct answer resolved from current `FrequencyData` at enqueue time via `resolveLiveNode()`. `textTemplate` uses `{{key}}` placeholders; `correctAnswerKey` names a `LiveDataKey`. Resolved to a concrete `numeric` node before entering the queue — assessment system unchanged. `liveData.ts` owns `DataContext`, `buildDataContext`, `renderTemplate`, `resolveKey`.
- **`t1b-lucky-due` timing**: fires at end-of-hand (post-hand dialog, before "Play next hand"), not at start of next hand. `getLuckyDuePostHand(outcome)` checks current win + 2 prior wins in `observationLog` (not yet updated for current hand). Uses `game.result.npcHandName` while Lucky's cards are still face-up. `{{luckyLastHand}}` template var; fallback `'garbage'` when Lucky folded (`npcHandName === '—'`).
- **`doBet()` event guard**: `typeof betAmount === 'number'` check prevents `MouseEvent` (passed by Svelte when using `on:click={doBet}` directly) from producing NaN. Templates use `() => doBet()` arrow functions. Both defenses in place.
- **Pre-commit hook** (`.hooks/pre-commit`, symlinked via `npm run setup-hooks`): runs `tsc --noEmit`, `vitest run`, and `python3 tools/verify-math.py` before every commit. `verify-math.py` has 31 checks: hand frequencies from C(52,5), hole-card probabilities, draw outs, all `correctAnswer` values. `live-numeric` nodes verified by key recognition against `KNOWN_LIVE_DATA_KEYS`.
- `doSave()` in `nextHand1A/1B/2A()` runs BEFORE `startHand()` — avoids double-ante on reload
- `resetGame()` calls `clearFiredOnce()`, `clearFiredRules()`, `clearAssessmentState()` — all module state fully cleared
- Gambler's fallacy coaching requires student's last 3 hands to be wins (Hank factually losing); fallback fires at hand 15
- Assessment nodes marked in `assessmentLog` by `nodeId`; `continueSession` checks specific terminal IDs to determine whether a sequence was completed
- WCAG contrast: all color values >= 4.5:1 against their backgrounds

---

## Code Review Summary (2026-06-03)

A fresh-eyes technical code review was conducted covering architecture, type safety, test coverage, accessibility, dialog graph integrity, localStorage resilience, and documentation consistency. Key outcomes:

- 16 bugs/gaps fixed (see `development/quality-assurance/code-review-2026-06-03.md` for full report — gitignored, lives locally)
- All WCAG accessibility issues addressed (B-1 through B-19)
- Documentation updated to match implementation (A-1/A-3/A-5/A-6/A-7/A-8/A-10)
- Test coverage expanded from 118 to 169 tests (+51)

Known open items from review:
- **AX-06/AX-07**: Full keyboard navigation and focus management on screen transitions — tracked in requirements.md
- **A-3**: Per-option adaptive checklist feedback (CD response keyed to which specific items were wrong) — noted as planned enhancement in design.md
- **A-4**: Hank at Table 1B as described in scope-sequence — addressed via Hank retrospective assessment (hand 14); Hank is not a live opponent at 1B but the lesson is delivered through CD's coaching
- **Schema migration**: Save key `dodo-poker-v1`; strategy is defensive `?? defaults` on optional fields; no versioned migration yet
- **`dealScriptedHand`** infrastructure: wired and plumbed but no dialog node uses it yet — milestone-deferred

---

## Open Questions

- **Session restoration routing** — `continueSession()` routes `gatePassedAt1B → table2a`; add `gatePassedAt2A → table2b` when Table 2B is built.

---

## File Map

| File | Purpose | Status |
| --- | --- | --- |
| `CLAUDE.md` | Project overview, dev workflow, doc pointers | Current |
| `assets/svg-cards/` | SVG playing card assets | Complete |
| `assets/chief-dodo.png` | Chief Dodo portrait | Complete |
| `assets/title-screen-image.png` | Title screen illustration | Complete |
| `documentation/requirements.md` | User stories incl. Accessibility section (AX-01–AX-07) | Current |
| `documentation/design.md` | Game design: world, characters, mechanics, NPC roster | Current |
| `documentation/scope-sequence.md` | Full curriculum: 14 tables, 5 phases, competency gates | Current |
| `documentation/tech-spec.md` | Stack decisions, naming conventions, accessibility standard, open decisions | Current |
| `documentation/handoff.md` | This file | Current |
| `development/dialog/start-of-game.json` | Entry experience (9 nodes) | Current |
| `development/dialog/table-1a.json` | Table 1A — Hank, never-fold pattern, gambler's fallacy | Current |
| `development/dialog/table-1b.json` | Table 1B — Lucky, frequency table, LLN, Surv Room. `t1b-lucky-due` uses `{{luckyLastHand}}` template var; fires end-of-hand | Current |
| `development/dialog/table-2a.json` | Table 2A — Vivian, hot hand fallacy, variable bets, rotation | Current |
| `development/src/lib/game/card.ts` | Card type, deck, shuffle, SVG path, `cardAltText()` | Current |
| `development/src/lib/game/fiveCardDraw.ts` | Five Card Draw state machine; `noDraw`, `npcActsFirst`; `npcOpensBet/npcOpensCheck` | Current |
| `development/src/lib/game/npc.ts` | `hank`, `lucky`, `vivian` NPC modules | Current |
| `development/src/lib/game/liveData.ts` | `DataContext`, `buildDataContext`, `renderTemplate`, `resolveKey` — powers `live-numeric` assessments | Current |
| `development/src/lib/game/storage.ts` | localStorage with defensive defaults | Current |
| `development/src/lib/game/assessment.ts` | Evaluation engine; `clearAssessmentState()` | Current |
| `development/src/lib/game/backupNpcs.ts` | 10 backup NPCs; `getNextBackup()` | Current |
| `development/src/lib/game/simulationEngine.ts` | Card-draw simulation + Phase 2 type foundations | Current |
| `development/src/lib/game/observationEngine.ts` | Observation rules + firedRules persistence | Current |
| `development/src/lib/game/scriptedHands.ts` | `ScriptedDeal`, `getScriptedDeal()` | Current |
| `development/src/lib/game/frequencyData.ts` | Frequency tracking + `HAND_NAME_MAP` | Current |
| `development/src/lib/dialog/engine.ts` | Dialog engine; all Table 1A/1B/2A functions; `live-numeric` responseType | Current |
| `development/src/App.svelte` | Full application shell; `currentNpcSpeakerId` + `NPC_DISPLAY_NAMES`; `resolveLiveNode()` | Current |
| `development/src/lib/components/CardImage.svelte` | Button/div[role=img] split; `cardAltText` | Current |
| `development/src/lib/components/ReferenceCard.svelte` | Sliding reference card panel | Current |
| `development/src/lib/components/FrequencyTable.svelte` | Left-side panel with ARIA toggle | Current |
| `development/src/lib/components/SurveillanceRoom.svelte` | Card-draw simulation with animation | Current |
| `development/src/lib/components/DevPanel.svelte` | Dev tools; Table 2A jump, hand presets, assessment state | Current |
| `development/src/lib/game/*.test.ts` | 9 test files: card, hand, fiveCardDraw, npc, assessment, backupNpcs, frequencyData, liveData, observationEngine, simulationEngine, storage | Current |
| `development/src/lib/dialog/engine.test.ts` | Dialog engine test suite | Current |
| `development/tools/verify-math.py` | Pre-commit math verification (31 checks); `npm run verify-math` | Current |
| `development/.hooks/pre-commit` | Git pre-commit hook: tsc + vitest + verify-math; install via `npm run setup-hooks` | Current |

---

## Recommended Next Steps (in order)

1. **Deploy** — build and push current state to `dodo-poker.mccullough.com`
2. **Table 2B** — Texas Hold'Em, Rex (Ruffed Grouse, independence assumption error). Two-stage hole card deal as dependent sample space; tree diagrams; addition rule before multiplication rule. See scope-sequence.md for full spec including rotation constraint (tree coaching only on student-opens hands).
3. **AX-06/AX-07** — keyboard navigation completeness and focus-on-transition implementation
4. **Session restoration routing** — add `gatePassedAt2A → table2b` to `continueSession()` when Table 2B is built

---

## Last Updated

2026-06-04 (session 2) — Play-testing bug fixes and infrastructure hardening. `live-numeric` assessment type: question text and answer resolved from live `FrequencyData` at enqueue time (`liveData.ts`; `resolveLiveNode()` in App.svelte); `t2a-assess-proc` converted — now reads student's actual High Card count and total hands. `t1b-lucky-due` reworked: fires at end-of-hand (not start of next), uses `{{luckyLastHand}}` template var from `game.result.npcHandName`, fixes hardcoded 'One Pair' and 'four hands straight'. NPC speaker label fix: `currentNpcSpeakerId` + `NPC_DISPLAY_NAMES` registry; `speakerLabel()` now handles all current and future NPCs including multi-NPC tables (3C+); Vivian was showing as 'Narrator'. `doBet()` NaN fix: MouseEvent guard + arrow functions in templates. Pre-commit hook (`.hooks/pre-commit`): tsc + vitest + `verify-math.py` (31 math checks). Table 1B dialog revisions: Lucky's intro voice, lucky-due chain split, `t1b-surv-intro-002` rewritten (Socratic, no broken template var). scope-sequence updated: Rex (Ruffed Grouse) at Table 2B, NPC assignments for 2B/2C/3A/3B corrected, rotation constraint documented. 228 tests across 12 files.

2026-06-04 (session 1) — Table 2A (The Fraction Table) built. 212 tests across 11 files.

2026-06-03 — Code review pass: 16 bugs/gaps fixed. Full WCAG 2.1 AA accessibility pass. Hank retrospective assessment at Table 1B hand 14. 169 tests across 11 files.

2026-06-03 — Code review pass (fresh-eyes agent): 16 bugs/gaps fixed. Full WCAG 2.1 AA accessibility pass. Hank retrospective assessment at Table 1B hand 14. 169 tests across 11 files.
