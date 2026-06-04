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
| Fixed bet at Table 1A (5 seeds, no raises) | Focus is on observing Hank's pattern and building probability intuition, not bet sizing; fixed amounts eliminate complexity at the wrong pedagogical moment; Chief Dodo names the rule upfront so it reads as intentional |
| Assessment interleaved with play, not batched | Research (Konold, Shaughnessy): correct probability understanding requires predict→observe→compare cycles at the moment of observation; batching assessment at the end produces quiz behavior, not learning |
| Pot and Bet both visible in the header | Students need to know what each decision costs; Bet is always visible (not just in the action menu) so it's available for decision-making at a glance and scales to tables with variable bet sizes |
| Concept-first, variant-second sequencing | The prerequisite dependency graph of probability concepts drives the sequence; poker variants are vehicles assigned to serve the concepts, not destinations |
| No opening tutorial | Learn-by-doing philosophy; Chief Dodo reacts to moments, doesn't front-load instruction |
| Experimental before formal | Formal probability fractions do not appear until students have built frequentist intuition through observation; early tables observe and record before they compute |
| Five Card Draw → Hold'Em → Stud → Baseball/Omaha/Pinochle | Research-confirmed variant sequence; Five Card Draw's uniform sample space is the cleanest introductory vehicle; Hold'Em's regular three-stage structure is better than Stud for introducing sequential conditional probability |
| 90% mastery threshold, three-component gate | Research directly comparing 80% and 90% thresholds found skill decay at 80%; gates require procedural fluency + conceptual understanding + transfer — procedural performance alone is insufficient |
| NPCs are pedagogical, not random | Each NPC embodies a specific reasoning pattern; defeating them requires understanding the pattern; NPC sequence tracks the curriculum progression across 14 tables |
| Chief Dodo is the formative assessment mechanism | Gates feel like game challenges; Chief Dodo's in-hand coaching is the formative loop before the gate |
| Seeds, not chips | The Nest uses colored seeds as tokens; denomination table in `design.md` |
| Text-based first, SVG cards | Focus on mechanics and learning before investing in full graphics; card assets from `hayeah/playing-cards-assets` in `/assets` |
| Client-side only in Phase 1 | Simplest viable product; backend added when multiplayer requires it |
| CCSS as reference map, not curriculum driver | The game follows its own learning logic; standards are checked against it to confirm coverage, not used to drive sequencing |
| Dialog trees as JSON, not hardcoded logic | Chief Dodo's coaching text is data; engine traverses it — swappable later for an LLM API response conforming to the same schema |
| Menu-driven input only | No free text except wager amounts; all choices are numbered menus or click targets; four interaction types: `none`, `action`, `checklist`, `numeric` |
| Scripted dialog for proof-of-concept | Self-hosted LLM backend is a future possibility; initial version uses JSON dialog trees for simplicity and speed to proof-of-concept |
| Starting stack: 100 seeds, 5 ante, 5 bet | Fixed amounts for Table 1A prototype; calibrated so a session lasts ~20 hands before a player runs out |
| Front room house rule: guest bets first | Tables 1A and 1B are both "the front room"; the student always bets first on every hand; rotation will be introduced at a later table when position becomes the lesson topic |

---

## Current State

**Phase:** Implementation — Table 1A and Table 1B complete end-to-end; Table 1B gate passes to "coming soon" placeholder (Table 2A not yet built).

### Completed

- Project concept, design principles, and all documentation complete
- User stories: `requirements.md`, 35+ stories across 9 themes
- Game design: `design.md`, research docs, scope-sequence, tech-spec, dialog-samples all complete
- Dialog trees: `start-of-game.json`, `table-1a.json` (51 nodes), `table-1b.json` (57 nodes)
- **Project scaffold**: TypeScript + Svelte 5 + Vite 6, Vitest 4; zero vulnerabilities
- **Game logic** (`development/src/lib/game/`):
  - `card.ts` — Card type, 52-card deck, Fisher-Yates shuffle, SVG path mapping
  - `hand.ts` — Hand evaluation wrapper around `pokersolver`
  - `npc.ts` — `hank` (always bets/calls, never folds) and `lucky` (personality-driven: fold/check/bet probabilities vary by winning/losing streak); both use weighted-random draw 0–3 cards
  - `fiveCardDraw.ts` — Complete Five Card Draw state machine; `GameState` uses generic `npc*` fields (`npcHand`, `npcSeeds`, `npcPendingBet`, `npcLastAction`, `npcDrawCount`); `HandResult` uses `npcHandName`, `npcFolded`, `winner: 'npc'`; `playerCheckNpcCheck()` for mutual check (advances to draw or resolves showdown)
  - `storage.ts` — localStorage save/load/clear; includes assessmentLog, observationLog, frequencyData, handsAt1B, surveillanceRoomVisited, `currentNpcName`, `usedBackupIds`, `npcSeeds`
  - `assessment.ts` — Evaluation engine: `evaluateChecklist`, `evaluateNumeric`, 3-attempt scaffolding, assessment log
  - `observationEngine.ts` — `HandSummary` type, three 1A coaching rules, fired-rules persistence
  - `scriptedHands.ts` — `ScriptedDeal` interface with `npcCards` field, `getScriptedDeal()`
  - `frequencyData.ts` — `FrequencyData` interface, update/create/freqPct; `HAND_NAME_MAP` uses `'Pair'` (pokersolver's actual string)
  - `backupNpcs.ts` — 10 backup NPC characters (name, species, CD intro anecdote); `getNextBackup(usedIds)` filters used entries
  - `simulationEngine.ts` — `runCardDrawSim(n)` for card-draw simulation; Phase 2 type foundations: `SimMode`, `SimulationController<T>`, `PokerSimHandResult`, `PokerSimConfig`
- **Dialog engine** (`development/src/lib/dialog/engine.ts`): loads both dialog JSON files; Table 1A + 1B functions; `getTable1bNpcActionNode()`, `getTable1bNpcDrawNode()`; `unmarkFiredOnce()` for dev tools
- **UI components**:
  - `App.svelte` — full game loop; `currentNpcName` drives ALL NPC name display including dialog bubble speaker labels; `speakerLabel()` maps `'hank'|'lucky'` → `currentNpcName` so backups display correctly; `pendingPostAssessment` prevents queued pre-hand nodes from appearing between assessment setup and the assessment UI; `refillNpcAt1A()` resets Hank's seeds when he busts at Table 1A (lesson continuity); `swapNpc()` for Table 1B backup replacement; `getNpcConsecutiveWins/Losses()` drive Lucky's probability table
  - `ReferenceCard.svelte` — right-side sliding panel, 9 hand blocks, SVG examples
  - `FrequencyTable.svelte` — left-side sliding panel; tab anchored to panel right edge (24px reserved strip prevents dialog overlap)
  - `SurveillanceRoom.svelte` — card-draw simulation with 2.4s `requestAnimationFrame` animation: progressive graph draw, hand counter, CSS card stream behind Chief Dodo portrait, completion commentary
  - `DevPanel.svelte` — dev mode panel; table-aware (shows 1A or 1B assessments based on current screen)
  - `CardImage.svelte` — card display (face-up/down, selectable)
- **Table 1A progression complete**:
  - Approach sequence with Hank introduction and house rule ("guests always bet first")
  - Pattern reveal → Hank checklist → gambler's fallacy coaching → fallacy checklist → transfer checklist → gate
  - When Hank busts: `refillNpcAt1A()` resets his seeds to 200; CD says "Hank reached into his jacket. He's still in."
- **Table 1B progression complete**:
  - Approach sequence with Lucky introduction and house rule ("still in the front room, you still bet first")
  - Frequency table always visible; updates immediately at hand conclusion
  - Lucky's behavior: fold/check/bet probabilities shift by streak state (winning: 35/45/20; neutral: 10/30/60; losing: 5/15/80); check only fires when student has checked first (callAmount === 0); always calls a player bet
  - `playerCheckNpcCheck()` handles both-check path; resolves showdown if in bet2
  - Surveillance Room animation: counter ticks up, graph draws progressively, cards stream behind CD portrait, CD delivers convergence commentary
  - Assessment fires at `handsAt1B >= 18 && surveillanceRoomVisited`
  - Gate-passed sequence → "Coming soon" CTA
- **NPC swap system** (Table 1B):
  - When NPC is bankrupt, CD delivers 4-line intro (bust acknowledgment + arrival + anecdote + ready)
  - 10 backup NPCs in roster, never reused within a session
  - If all 10 exhausted, falls back to "Play again" reset
- **Test suite**: 118 tests across 8 files — all passing
- **Deployed**: live at `dodo-poker.mccullough.com`

### Key Implementation Details

- `publicDir: '../assets'` in `vite.config.ts` serves card SVGs at `/svg-cards/` and title image at `/title-screen-image.png`
- Svelte 5 requires `mount()` not `new App()` — `main.ts` uses `mount`
- Dialog queue drives the game rhythm: all CD and NPC text is queued; action menu hidden while queue is non-empty
- **Assessment queue fix**: `advance()` stashes `dialogQueue` to `pendingPostAssessment` and clears it when activating `assessmentState`; restored after submission. Prevents pre-hand nodes (e.g. "Watch Hank.") from appearing between the assessment question text and the assessment UI
- `speakerLabel()` maps `'hank' || 'lucky'` → `currentNpcName`; this ensures dialog bubbles show the correct name even when a backup NPC has replaced the original
- `GameState` field naming: all NPC-facing fields use `npc*` prefix (`npcHand`, `npcSeeds`, etc.); character names only appear in dialog `speaker` fields and in NPC-module exports
- Dialog node naming: `t1b-npc-{call,bet,check,draw-*}` for Table 1B generic NPC nodes; `t1a-hank-*` kept because Hank is permanently Table 1A's opponent
- Pattern reveal (t1a-pattern-001) fires at hand 3; chains into Hank checklist
- Gambler's fallacy coaching (t1a-fallacy-001) fires at hand 8; chains into fallacy checklist → transfer checklist → gate-passed sequence
- `getChain(nodeId)` traverses `followUp.default` chains; stops at `returnToGame`, `advanceTable`, or non-`none` responseType
- `gatePassedAt1A` restored on continue by checking `t1a-assess-transfer-001` in assessmentLog; `gatePassedAt1B` by `t1b-assess-transfer`
- Frequency data updates in action handlers the moment the hand concludes — before post-hand dialog fires
- Lucky fold/check/bet decision in `doCheck()` runs BEFORE `playerCheck(game)`, so NPC fold or mutual check preempts the default check→NPC-bets flow
- `npcFold()` records empty `playerHandName` pre-draw; records evaluated hand name post-draw (bet2)
- `pokersolver` returns `'Pair'` not `'One Pair'`; `HAND_NAME_MAP` uses `'Pair'`
- FrequencyTable panel: 24px always reserved for FREQ tab; expands to 220px when open; table-screen has `margin-left: 24px` always on 1B
- `pokersolver` has no official TypeScript types; declaration file at `src/types/pokersolver.d.ts`

---

## Open Questions

- **Vivian (Flamingo)** — listed in NPC roster for Table 1B (hot hand fallacy) but not yet introduced. Could appear as a table observer with one coaching line after a 3-win streak, or be deferred to Table 2A.
- **Table 1B Surveillance Room scope** — currently shows coin-flip simulation demonstrating LLN. Scope-sequence describes poker hand frequency simulation. Coin flips are pedagogically cleaner for LLN; a future "Cinematic mode" tab could show hand-type frequency simulation using the Phase 2 `SimulationController` infrastructure already defined in `simulationEngine.ts`.
- **NPC personality beyond reasoning pattern** — fuller speech patterns, flavor text, win/loss reactions not yet written for individual NPCs.
- **Table 2A** — next table to build. Lucky and Vivian; classical probability P = f/t; no-draw Five Card Draw variant; connects frequency table from 1B to formal fractions.
- **Session restoration routing** — `continueSession()` currently routes `gatePassedAt1A → table1b`; when Table 2A exists, add `gatePassedAt1B → table2a`.
- **Backup NPC dialog pools** — current backup NPCs reuse Lucky/Hank's dialog pools. If they need distinct voice lines in the future, each backup would need entries in the dialog JSON.
- **Betting rotation** — front room tables (1A, 1B) use "guest bets first" house rule. Position/rotation will be introduced at a later table as its own learning objective.

---

## File Map

| File | Purpose | Status |
| --- | --- | --- |
| `CLAUDE.md` | Project overview, dev workflow, doc pointers | Current |
| `assets/svg-cards/` | SVG playing card assets (52 cards + jokers + back) | Complete |
| `assets/png-cards/` | PNG playing card assets (backup) | Complete |
| `assets/title-screen-image.png` | Title screen illustration | Complete |
| `documentation/requirements.md` | User stories (35+ stories across 9 themes) | Current |
| `documentation/design.md` | Game design: world, characters, mechanics, NPC roster (incl. backup pool), avatars | Current |
| `documentation/scope-sequence.md` | Full curriculum: 14 tables, 5 phases, variant justifications, competency gates, CCSS alignment | Current |
| `documentation/tech-spec.md` | Stack decisions, dialog JSON schema, naming conventions, simulation architecture | Current |
| `documentation/dialog-samples.md` | Chief Dodo voice reference: 20 sample lines, interaction type annotations | Current |
| `documentation/research.md` | Full research report: CCSS, pedagogy, poker precedents, game-based learning | Complete |
| `documentation/research-scope-sequence.md` | Research report: scope/sequence methodology, poker variant math, competency gate research | Complete |
| `documentation/handoff.md` | This file | Current |
| `development/dialog/schema.md` | Dialog tree JSON format reference | Current |
| `development/dialog/start-of-game.json` | Entry dialog tree (9 nodes) | Current |
| `development/dialog/table-1a.json` | Table 1A dialog tree (51 nodes — full gate sequence + house rule + Hank refill) | Current |
| `development/dialog/table-1b.json` | Table 1B dialog tree (57 nodes — frequency table, LLN, assessment gate, house rule, npc-* action nodes) | Current |
| `development/src/lib/game/card.ts` | Card type, deck, shuffle, SVG path mapping | Complete |
| `development/src/lib/game/hand.ts` | Hand evaluation via pokersolver | Complete |
| `development/src/lib/game/npc.ts` | `hank` (never folds) and `lucky` (3-state fold/check/bet probability table) | Current |
| `development/src/lib/game/fiveCardDraw.ts` | Five Card Draw state machine; `npc*` GameState fields; `NpcAction` type; `playerCheckNpcCheck()` | Current |
| `development/src/lib/game/storage.ts` | localStorage persistence; `npcSeeds`, `currentNpcName`, `usedBackupIds` | Current |
| `development/src/lib/game/assessment.ts` | Evaluation engine: checklist + numeric, 3-attempt scaffolding, assessment log | Complete |
| `development/src/lib/game/backupNpcs.ts` | 10 backup NPC characters; `getNextBackup(usedIds)` | Current |
| `development/src/lib/game/frequencyData.ts` | `FrequencyData` interface, update/create/freqPct; `HAND_NAME_MAP` | Current |
| `development/src/lib/game/observationEngine.ts` | `HandSummary` type, 1A coaching rules, fired-rules persistence | Complete |
| `development/src/lib/game/scriptedHands.ts` | `ScriptedDeal` with `npcCards`; `getScriptedDeal()` | Complete |
| `development/src/lib/game/simulationEngine.ts` | `runCardDrawSim(n)` Phase 1; `SimMode`, `SimulationController<T>`, `PokerSimHandResult` Phase 2 foundations | Current |
| `development/src/lib/game/assessment.test.ts` | 18 tests — evaluation branches and log | Complete |
| `development/src/lib/game/card.test.ts` | 9 tests — deck creation, shuffle, SVG path mapping | Complete |
| `development/src/lib/game/fiveCardDraw.test.ts` | 29 tests — game state machine, `playerCheckNpcCheck`, `npcFold`, npc* fields | Current |
| `development/src/lib/game/hand.test.ts` | 14 tests — hand evaluation and ranking | Complete |
| `development/src/lib/game/frequencyData.test.ts` | 17 tests — HAND_NAME_MAP coverage, update logic, freqPct | Current |
| `development/src/lib/game/npc.test.ts` | 10 tests — hank never folds, lucky 3-state probability behavior | Current |
| `development/src/lib/game/backupNpcs.test.ts` | 6 tests — roster integrity, getNextBackup filtering | Current |
| `development/src/lib/game/simulationEngine.test.ts` | 6 tests — draw count, convergence, sampled points | Current |
| `development/src/lib/dialog/engine.ts` | Dialog engine; `getTable1bNpcActionNode()`, `getTable1bNpcDrawNode()`; `unmarkFiredOnce()` | Current |
| `development/src/lib/components/CardImage.svelte` | Card display component (face-up/down, selectable) | Complete |
| `development/src/lib/components/ReferenceCard.svelte` | Sliding reference card panel: 9 hand blocks, SVG examples | Complete |
| `development/src/lib/components/FrequencyTable.svelte` | Left-side sliding panel; 24px reserved strip prevents dialog overlap | Current |
| `development/src/lib/components/SurveillanceRoom.svelte` | Card-draw simulation with rAF animation: counter, progressive graph, CSS card stream, CD commentary | Current |
| `development/src/lib/components/DevPanel.svelte` | Dev panel; table-aware assessment state; 1B jump presets | Current |
| `development/src/App.svelte` | Full application: all screens, game loop, NPC swap, `speakerLabel` → `currentNpcName` | Current |
| `development/src/types/pokersolver.d.ts` | TypeScript declaration for pokersolver | Complete |

---

## Recommended Next Steps (in order)

1. **Collect feedback** — share `dodo-poker.mccullough.com` with Jacob and early testers; test both Table 1A and 1B progressions end-to-end
2. **Table 2A** — Lucky and Vivian; classical probability P = f/t; no-draw Five Card Draw variant; connects frequency table from 1B to formal fractions
3. **Vivian introduction at 1B** — small addition: add Vivian as a table observer with one hot-hand fallacy comment fired after a 3-win streak
4. **Session restoration routing** — add `gatePassedAt1B → table2a` to `continueSession()` when Table 2A exists
5. **NPC personality dialog** — fuller speech patterns and flavor text for Lucky and Hank beyond the coaching/assessment dialog that already exists

---

## Last Updated

2026-06-03 — Naming convention refactor + bug fixes + features:

**Naming convention refactor (complete):** All `hank*` GameState/HandResult fields renamed to `npc*` (`npcHand`, `npcSeeds`, `npcPendingBet`, `npcLastAction`, `npcDrawCount`, `npcHandName`, `npcFolded`, `winner: 'npc'`); `HankAction` type → `NpcAction`; `ScriptedDeal.hankCards` → `npcCards`; `SavedSession.hankSeeds` → `npcSeeds`; `t1b-hank-*` dialog node IDs → `t1b-npc-*`; engine functions `getTable1bHankActionNode/DrawNode` → `getTable1bNpcActionNode/DrawNode`; `getLuckyConsecutiveWins/Losses` → `getNpcConsecutiveWins/Losses`. Review pass confirmed zero stale references.

**Bug fixes:** `speakerLabel()` now maps `'hank'|'lucky'` → `currentNpcName` (backup NPC dialog bubbles now show correct name); assessment queue stash (`pendingPostAssessment`) prevents pre-hand nodes from appearing between assessment text and assessment UI.

**Features:** Lucky's check behavior added (fold/check/bet probability table varies by streak state; check only when student checks first; `playerCheckNpcCheck()` in `fiveCardDraw.ts`; `t1b-npc-check` dialog node); house rule dialog at Table 1A and 1B ("guests bet first in the front room"); Surveillance Room simulation animation (`simulationEngine.ts` with Phase 2 foundations; `SurveillanceRoom.svelte` rewritten with `requestAnimationFrame` counter/graph, CSS card stream, CD commentary); Hank seed refill at Table 1A when busted (`refillNpcAt1A()`, `t1a-hank-refill` dialog node). Test suite expanded to 118 tests across 8 files.
