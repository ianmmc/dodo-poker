# dodo-poker

## Project Overview

Educational web application that teaches probability and statistics through poker-based gameplay set in The Nest, a bird social club in Los Angeles. Target audience is grades 6–12, but progression is competency-driven — any adult with no prior knowledge can play. The game maps to Common Core State Standards (CCSS) for mathematics, but CCSS is a reference map, not the curriculum driver; the game follows its own learning logic.

The student's guide and coach is **Chief Dodo** — a dodo bird who by day sells edtech to school districts, loves Nike shoes, LA sports, and hip-hop. He greets the student as a familiar friend from the first moment and coaches just-in-time, not by lecture. All NPC opponents are birds whose behavior embodies specific probability reasoning patterns (correct or flawed), deliberately sequenced to track the curriculum.

## Target Audience

- Students: Grades 6–12 (ages 11–18), but open to any age with no prior knowledge
- Curriculum alignment: Common Core Mathematics (Statistics & Probability strand) — used as alignment reference, not progression driver

## Tech Stack

- **Phase 1**: Client-side only — runs in the browser, no server required, state via `localStorage`
- **Phase 2**: Backend added when multiplayer is needed — Docker locally, Railway/Supabase/GCloud/AWS for deployment
- **Stack**: TBD — decided after scope/sequence planning
- See `documentation/tech-spec.md` for architecture details and open decisions

## Key Constraints

- Content must be age-appropriate for middle and high school students, but voice must also work for an adult
- Game mechanics must require mathematical reasoning to succeed — students cannot win by pattern-matching or luck alone
- CCSS standards are a reference check, not the curriculum structure
- No monetary framing, no gambling aesthetics — poker as math context, not gambling instruction
- Chief Dodo is a guide on the side: just-in-time coaching, not front-loaded instruction

## Documentation

| File | Contents |
| --- | --- |
| `documentation/requirements.md` | User stories with status tracking (source of truth for TDD acceptance criteria) |
| `documentation/design.md` | Game and experience design: world, Chief Dodo, NPCs, mechanics, progression |
| `documentation/scope-sequence.md` | Curriculum phases, CCSS standards mapping, poker variant per phase, NPC sequence |
| `documentation/tech-spec.md` | Architecture decisions, stack choices, open technical decisions |
| `documentation/handoff.md` | Session context — read this first at the start of any new Claude session |
| `documentation/research.md` | Full research report: CCSS progression, pedagogy, poker precedents, game-based learning |
| `documentation/research-scope-sequence.md` | Research report: scope/sequence design, variant-to-concept mapping, competency gate design |

## Development Workflow

- Use conventional commits (`feat:`, `fix:`, `chore:`, etc.)
- Follow TDD: write tests before implementing features
- No features beyond what's required
- No comments unless the WHY is non-obvious

## Dev Mode

- **Enabled**: automatically in `npm run dev`; in any environment via `?devmode=1` URL parameter
- **Access**: bottom-left DEV badge (fixed, low opacity), or `Ctrl+Alt+D`
- **Panel sections**: Jump to Hand (with `handsPlayed=3` and `handsPlayed=8` presets), Jump to Table/Screen, Assessment State (per-checkpoint pass + "Pass all + set gate"), State Tools (dump state → console, clear localStorage), Force Dialog Node (enqueue any node ID by chain)
