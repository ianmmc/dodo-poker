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

---

## Current State

**Phase:** Implementation — Table 1A and Table 1B complete end-to-end; Table 1B gate passes to "coming soon" placeholder (Table 2A not yet built).

### Completed

- Project concept, design principles, and all documentation complete
- User stories: `requirements.md`, 33 stories across 9 themes
- Game design: `design.md`, research docs, scope-sequence, tech-spec, dialog-samples all complete
- Dialog trees: `start-of-game.json`, `table-1a.json` (49 nodes), `table-1b.json` (50 nodes)
- **Project scaffold**: TypeScript + Svelte 5 + Vite 6, Vitest 4; zero vulnerabilities
- **Game logic** (`development/src/lib/game/`):
  - `card.ts` — Card type, 52-card deck, Fisher-Yates shuffle, SVG path mapping
  - `hand.ts` — Hand evaluation wrapper around `pokersolver`
  - `npc.ts` — `hank` (always bets/calls, never folds) and `lucky` (personality-driven fold: 10% baseline, 35% after 2+ consecutive Lucky wins); both use weighted-random draw 0–3 cards
  - `fiveCardDraw.ts` — Complete Five Card Draw state machine; `playerFold`, `npcFold` (player wins pot, `hankFolded: true` in result); `HandResult.hankFolded?` flag
  - `storage.ts` — localStorage save/load/clear; includes assessmentLog, observationLog, frequencyData, handsAt1B, surveillanceRoomVisited, `currentNpcName`, `usedBackupIds`
  - `assessment.ts` — Evaluation engine: `evaluateChecklist`, `evaluateNumeric`, 3-attempt scaffolding, assessment log
  - `observationEngine.ts` — `HandSummary` type, three 1A coaching rules, fired-rules persistence
  - `scriptedHands.ts` — `ScriptedDeal` interface, `getScriptedDeal()`
  - `frequencyData.ts` — `FrequencyData` interface, `createFrequencyData()`, `updateFrequencyData()`, `freqPct()`; `HAND_NAME_MAP` uses `'Pair'` (pokersolver's actual string, not `'One Pair'`)
  - `backupNpcs.ts` — 10 backup NPC characters (name, species, CD intro anecdote); `getNextBackup(usedIds)` filters used entries
- **Dialog engine** (`development/src/lib/dialog/engine.ts`): loads both `table-1a.json` and `table-1b.json`; Table 1A + 1B functions; `openSurveillanceRoom` stop condition; `unmarkFiredOnce()` for dev tools
- **UI components**:
  - `App.svelte` — full Table 1A and 1B game loops, Surveillance Room routing, frequency table, dialog queue, assessment state, reference card; `currentNpcName` drives all NPC name display; NPC swap system
  - `ReferenceCard.svelte` — right-side sliding panel, 9 hand blocks, SVG examples
  - `FrequencyTable.svelte` — left-side sliding panel; tab anchored to panel right edge (24px reserved strip prevents dialog overlap)
  - `SurveillanceRoom.svelte` — coin-flip simulation (100/1k/10k), SVG running-frequency line chart, LLN convergence visualization
  - `DevPanel.svelte` — dev mode panel; table-aware (shows 1A or 1B assessments based on current screen); 1B presets: `handsAt1B=10` (Surv. Room), `handsAt1B=18` (assessment)
  - `CardImage.svelte` — card display (face-up/down, selectable)
- **Table 1B progression complete**:
  - Approach sequence with Lucky introduction
  - Frequency table panel always visible (left side); updates immediately when hand concludes, not on "Play next hand" click
  - Lucky's gambler's fallacy fires at first 3-consecutive-player-win streak (once)
  - Lucky folds based on personality: 10% baseline, 35% when on a winning streak (she thinks she's due to lose); only folds when opening, never folds to a player bet
  - Surveillance Room intro fires at `handsAt1B >= 10` (once)
  - Assessment fires at `handsAt1B >= 18 && surveillanceRoomVisited` (once): procedural numeric → conceptual checklist → transfer checklist
  - Gate-passed sequence → "Coming soon" CTA
  - Surveillance Room re-entry button available after first visit
- **NPC swap system**:
  - When any NPC is bankrupt, "Continue" replaces "Play again"; CD delivers 4-line intro (bust acknowledgment + arrival + anecdote + ready)
  - 10 backup NPCs in roster, never reused within a session; uses same dialog pools as replaced NPC
  - If all 10 exhausted, falls back to "Play again" reset
  - Lucky/replacement NPC starts Table 1B with 200 seeds (enough for 18+ hands); `currentNpcName` persists to save
- **Test suite**: 105 tests across 7 files — all passing
- **Deployed**: live at `dodo-poker.mccullough.com`

### Key Implementation Details

- `publicDir: '../assets'` in `vite.config.ts` serves card SVGs at `/svg-cards/` and title image at `/title-screen-image.png`
- Svelte 5 requires `mount()` not `new App()` — `main.ts` uses `mount`
- Dialog queue drives the game rhythm: all Chief Dodo and NPC text is queued; action menu hidden while queue is non-empty
- Pattern reveal (t1a-pattern-001) fires at hand 3 (`handsPlayed >= 3`); chains into Hank checklist; on resolution returns to game — does NOT chain into gambler's fallacy
- Gambler's fallacy coaching (t1a-fallacy-001) fires separately at hand 8; chains into fallacy checklist → transfer checklist → gate-passed sequence
- `getChain(nodeId)` traverses `followUp.default` chains and stops at `returnToGame`, `advanceTable`, or a non-`none` responseType node
- `gatePassedAt1A` restored on session continue by checking `t1a-assess-transfer-001` in assessmentLog; `gatePassedAt1B` by `t1b-assess-transfer`
- Frequency data updates in action handlers (`doBet`, `doCall`, `doFold`, `doCheck`) the moment the hand concludes — before post-hand dialog fires; `nextHand1B()` no longer touches frequencyData
- Lucky fold check in `doCheck()`: runs BEFORE `playerCheck(game)` so the NPC fold (via `npcFold()`) preempts the normal check→hank-bets flow
- `npcFold()` records empty `playerHandName` pre-draw (hand not finalised); records evaluated hand name post-draw (bet2)
- `pokersolver` returns `'Pair'` not `'One Pair'`; `HAND_NAME_MAP` uses `'Pair'` as the key
- Assessment state machine: interactive nodes activate `assessmentState`; checklist UI shows while `assessmentState !== null && !inDialog`; `assessmentState = null` on correct or exhausted
- `submitChecklist` uses `getChain` for correct/exhausted outcomes; single `getNode` for hint attempts
- Template interpolation: `{{varName}}` placeholders replaced at `DisplayLine` creation time using `result.templateVars`
- FrequencyTable panel: `position: fixed; width: 24px` always reserved for the FREQ tab; expands to `width: 220px` when open; `table-screen` has `margin-left: 24px` always on 1B (`has-freq-panel` class), `220px` when full panel open
- `pokersolver` has no official TypeScript types; declaration file at `src/types/pokersolver.d.ts`

---

## Open Questions

- **Vivian (Flamingo)** — listed in NPC roster for Table 1B (hot hand fallacy) but not yet introduced. Could appear as a table observer with one coaching line after a 3-win streak, or be deferred to Table 2A.
- **Table 1B Surveillance Room scope** — currently shows coin-flip simulation demonstrating LLN. Scope-sequence describes poker hand frequency simulation. Coin flips are pedagogically cleaner; future iteration could add a tab for hand-type frequency simulation.
- **NPC personality beyond reasoning pattern** — fuller speech patterns, flavor text, win/loss reactions not yet written for individual NPCs.
- **Table 2A** — next table to build. Lucky and Vivian; classical probability P = f/t; no-draw Five Card Draw variant; connects frequency table from 1B to formal fractions.
- **Session restoration routing** — `continueSession()` currently routes `gatePassedAt1A → table1b`; when Table 2A exists, add `gatePassedAt1B → table2a`.
- **Backup NPC dialog pools** — current backup NPCs reuse Lucky/Hank's dialog pools. If they need distinct voice lines in the future, each backup would need entries in the dialog JSON.

---

## File Map

| File | Purpose | Status |
| --- | --- | --- |
| `CLAUDE.md` | Project overview, dev workflow, doc pointers | Current |
| `assets/svg-cards/` | SVG playing card assets (52 cards + jokers + back) | Complete |
| `assets/png-cards/` | PNG playing card assets (backup) | Complete |
| `assets/title-screen-image.png` | Title screen illustration | Complete |
| `documentation/requirements.md` | User stories (33 stories across 9 themes) | Current |
| `documentation/design.md` | Game design: world, characters, mechanics, NPC roster (incl. backup pool), avatars | Current |
| `documentation/scope-sequence.md` | Full curriculum: 14 tables, 5 phases, variant justifications, competency gates, CCSS alignment | Current |
| `documentation/tech-spec.md` | Stack decisions, dialog JSON schema, open backend decisions | Current |
| `documentation/dialog-samples.md` | Chief Dodo voice reference: 20 sample lines, interaction type annotations | Current |
| `documentation/research.md` | Full research report: CCSS, pedagogy, poker precedents, game-based learning | Complete |
| `documentation/research-scope-sequence.md` | Research report: scope/sequence methodology, poker variant math, competency gate research | Complete |
| `documentation/handoff.md` | This file | Current |
| `development/dialog/schema.md` | Dialog tree JSON format reference | Current |
| `development/dialog/start-of-game.json` | Entry dialog tree (9 nodes) | Current |
| `development/dialog/table-1a.json` | Table 1A dialog tree (49 nodes — full gate sequence) | Current |
| `development/dialog/table-1b.json` | Table 1B dialog tree (50 nodes — frequency table, LLN, assessment gate) | Current |
| `development/src/lib/game/card.ts` | Card type, deck, shuffle, SVG path mapping | Complete |
| `development/src/lib/game/hand.ts` | Hand evaluation via pokersolver | Complete |
| `development/src/lib/game/npc.ts` | `hank` (never folds) and `lucky` (personality-driven fold) NPCs | Current |
| `development/src/lib/game/fiveCardDraw.ts` | Five Card Draw state machine; `playerFold`, `npcFold`; `HandResult.hankFolded` | Current |
| `development/src/lib/game/storage.ts` | localStorage persistence; includes `currentNpcName`, `usedBackupIds` | Current |
| `development/src/lib/game/assessment.ts` | Evaluation engine: checklist + numeric, 3-attempt scaffolding, assessment log | Complete |
| `development/src/lib/game/backupNpcs.ts` | 10 backup NPC characters; `getNextBackup(usedIds)` | Current |
| `development/src/lib/game/frequencyData.ts` | `FrequencyData` interface, update/create/freqPct; `HAND_NAME_MAP` | Current |
| `development/src/lib/game/observationEngine.ts` | `HandSummary` type, 1A coaching rules, fired-rules persistence | Complete |
| `development/src/lib/game/scriptedHands.ts` | `ScriptedDeal` interface, `getScriptedDeal()` | Complete |
| `development/src/lib/game/assessment.test.ts` | 18 tests — evaluation branches and log | Complete |
| `development/src/lib/game/card.test.ts` | 9 tests — deck creation, shuffle, SVG path mapping | Complete |
| `development/src/lib/game/fiveCardDraw.test.ts` | 22 tests — game state machine including `npcFold` | Current |
| `development/src/lib/game/hand.test.ts` | 14 tests — hand evaluation and ranking | Complete |
| `development/src/lib/game/frequencyData.test.ts` | 17 tests — HAND_NAME_MAP coverage, update logic, freqPct | Current |
| `development/src/lib/game/npc.test.ts` | 6 tests — hank never folds, lucky fold probability and personality behavior | Current |
| `development/src/lib/game/backupNpcs.test.ts` | 6 tests — roster integrity, getNextBackup filtering | Current |
| `development/src/lib/dialog/engine.ts` | Dialog engine: pool selection, triggers, sequences, getNode(), unmarkFiredOnce() | Current |
| `development/src/lib/components/CardImage.svelte` | Card display component (face-up/down, selectable) | Complete |
| `development/src/lib/components/ReferenceCard.svelte` | Sliding reference card panel: 9 hand blocks, SVG examples | Complete |
| `development/src/lib/components/FrequencyTable.svelte` | Left-side sliding panel; 24px reserved strip prevents dialog overlap | Current |
| `development/src/lib/components/SurveillanceRoom.svelte` | Coin-flip LLN simulation with SVG running-frequency chart | Complete |
| `development/src/lib/components/DevPanel.svelte` | Dev panel; table-aware assessment state; 1B jump presets | Current |
| `development/src/App.svelte` | Full application: all screens, game loop, NPC swap, frequency timing | Current |
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

2026-06-03 — Post-playtest round of fixes and features: Lucky NPC personality-driven fold behavior (`npc.ts`, `lucky` export; 10% baseline / 35% on hot streak); `npcFold()` in `fiveCardDraw.ts`; backup NPC pool (`backupNpcs.ts`, 10 characters, CD introduction sequence); NPC swap system in `App.svelte` (`currentNpcName`, `usedBackupIds`, `swapNpc()`); frequency table update timing moved to action handlers (updates when hand concludes, before post-hand dialog); FrequencyTable tab positioning fix (24px reserved panel strip, no dialog overlap); `HAND_NAME_MAP` bug fix (`'Pair'` not `'One Pair'`); Lucky seed inheritance fix (Table 1B NPC starts with 200 seeds, not Hank's depleted count); DevPanel table-aware updates (1B assessments, 1B jump presets). Test suite expanded from 63 to 105 tests across 7 files; 3 new test files (`frequencyData.test.ts`, `npc.test.ts`, `backupNpcs.test.ts`).
