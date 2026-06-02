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

**Phase:** Implementation — proof-of-concept built and running locally; ready for deployment and feedback collection.

### Completed

- Project concept, design principles, and all documentation complete
- User stories: `requirements.md`, 28 stories across 8 themes
- Game design: `design.md` — Chief Dodo persona, 13-NPC roster, seed tokens, input model, 5 starting avatars
- Research: `research.md` and `research-scope-sequence.md` — CCSS, pedagogy, poker variants, competency gates
- Scope and sequence: `scope-sequence.md` — 5 phases, 14 tables, variant justifications, concept spiral map, CCSS alignment
- Tech stack and dialog schema: `tech-spec.md`
- Dialog voice samples and interaction type spec: `dialog-samples.md`
- Dialog trees: `development/dialog/start-of-game.json` and `table-1a.json` (39 nodes total, JSON-validated)
- **Project scaffold**: TypeScript + Svelte 5 + Vite 6, Vitest 4; zero vulnerabilities
- **Game logic** (`development/src/lib/game/`):
  - `card.ts` — Card type, 52-card deck, Fisher-Yates shuffle, SVG path mapping
  - `hand.ts` — Hand evaluation wrapper around `pokersolver`
  - `npc.ts` — Hank decision logic (always bets/calls; weighted-random draw 0–3 cards)
  - `fiveCardDraw.ts` — Complete Five Card Draw state machine (idle → bet1 → draw → bet2 → done)
  - `storage.ts` — localStorage save/load/clear
- **Dialog engine** (`development/src/lib/dialog/engine.ts`): loads `table-1a.json`; serves approach sequence, pre-hand pool, draw comments, post-hand pool, pattern reveal, Hank NPC lines
- **UI** (`development/src/App.svelte`): title (with image), avatar selection, intro, full Table 1A game loop; dialog queue with Space/Enter/click to advance
- **Test suite**: 45 tests across card, hand evaluation, and Five Card Draw state machine — all passing
- **Known issue with pokersolver**: Royal Flush is returned as "Straight Flush" — technically correct, noted in tests

### Key Implementation Details

- `publicDir: '../assets'` in `vite.config.ts` serves card SVGs at `/svg-cards/` and title image at `/title-screen-image.png`
- Svelte 5 requires `mount()` not `new App()` — `main.ts` uses `mount`
- Dialog queue drives the game rhythm: all Chief Dodo and Hank text is queued; action menu hidden while queue is non-empty
- Pattern reveal (t1a-pattern-001 sequence) fires once after 5 completed hands, between deals
- localStorage saves after every completed hand; title screen shows "Continue previous session" when save exists
- `pokersolver` has no official TypeScript types; declaration file at `src/types/pokersolver.d.ts`

---

## Open Questions

- **NPC personality beyond reasoning pattern**: Names and bird species set; fuller speech patterns, flavor text, win/loss reactions not yet written
- **Gate implementation mechanics**: How the three-component competency gate is presented in-game without breaking immersion
- **Analytics layer**: How the system tracks sub-skill gaps to inform Chief Dodo's adaptive coaching
- **Table 1B and beyond**: Lucky (gambler's fallacy), Vivian (hot hand), Surveillance Room — not yet implemented

---

## File Map

| File | Purpose | Status |
| --- | --- | --- |
| `CLAUDE.md` | Project overview, dev workflow, doc pointers | Current |
| `assets/svg-cards/` | SVG playing card assets (52 cards + jokers + back) | Complete |
| `assets/png-cards/` | PNG playing card assets (backup) | Complete |
| `assets/title-screen-image.png` | Title screen illustration | Complete |
| `documentation/requirements.md` | User stories (28 stories) | Current |
| `documentation/design.md` | Game design: world, characters, mechanics, input model, seeds, NPC roster, avatars | Current |
| `documentation/scope-sequence.md` | Full curriculum: 14 tables, 5 phases, variant justifications, competency gates, CCSS alignment | Complete |
| `documentation/tech-spec.md` | Stack decisions, dialog JSON schema, open backend decisions | Current |
| `documentation/dialog-samples.md` | Chief Dodo voice reference: 20 sample lines, interaction type annotations | Current |
| `documentation/research.md` | Full research report: CCSS, pedagogy, poker precedents, game-based learning | Complete |
| `documentation/research-scope-sequence.md` | Research report: scope/sequence methodology, poker variant math, competency gate research | Complete |
| `documentation/handoff.md` | This file | Current |
| `development/dialog/schema.md` | Dialog tree JSON format reference | Current |
| `development/dialog/start-of-game.json` | Entry dialog tree (9 nodes) | Current |
| `development/dialog/table-1a.json` | Table 1A dialog tree (30 nodes) | Current |
| `development/src/lib/game/card.ts` | Card type, deck, shuffle, SVG path mapping | Complete |
| `development/src/lib/game/hand.ts` | Hand evaluation via pokersolver | Complete |
| `development/src/lib/game/npc.ts` | Hank NPC decision logic | Complete |
| `development/src/lib/game/fiveCardDraw.ts` | Five Card Draw state machine | Complete |
| `development/src/lib/game/storage.ts` | localStorage persistence | Complete |
| `development/src/lib/dialog/engine.ts` | Dialog engine: pool selection, triggers, sequences | Complete |
| `development/src/lib/components/CardImage.svelte` | Card display component (face-up/down, selectable) | Complete |
| `development/src/App.svelte` | Full application: all screens, game loop, dialog integration | Current |
| `development/src/types/pokersolver.d.ts` | TypeScript declaration for pokersolver | Complete |

---

## Recommended Next Steps (in order)

1. **Deploy to Hostinger** — `vite build` → static deploy to `dodo-poker.mccullough.com` via Hostinger MCP; share with Jacob and early testers
2. **Collect feedback** — play with Jacob and friends; note what's confusing, what feels good, what's missing
3. **Iterate on dialog and mechanics** — based on feedback; this may include draw UX, Chief Dodo timing, seed amounts
4. **Table 1B** — add Lucky (gambler's fallacy) and Vivian (hot hand); introduce Surveillance Room
5. **Competency gate for Table 1A** — design and implement the transition mechanic

---

## Last Updated

2026-06-02 — Proof-of-concept implementation complete. Full Table 1A game loop running: title screen, avatar selection, Five Card Draw vs Hank, dialog engine wired to JSON trees, localStorage persistence, SVG card display, 45 tests passing. Ready to deploy.
