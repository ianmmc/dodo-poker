# Session Handoff

This document gives future Claude sessions the context needed to pick up where we left off. Update it at the end of each working session.

---

## What This Project Is

**dodo-poker** is an educational web app that teaches probability and statistics to grades 6–12 students through a bird-themed poker game. The pedagogical philosophy is learn-by-doing: students play, make mistakes, and receive coaching from their guide, Chief Dodo.

The project was inspired by Jacob Kantor — an education technology sales consultant who uses a dodo bird as his professional brand (DODO = "district office door opener") and is an avid poker player. The name and theme are a nod to him, but the product is serious.

---

## Key Design Decisions (and why)

| Decision | Rationale |
|----------|-----------|
| Competency-driven progression, not age/grade | A 6th grader and a 48-year-old adult should use the same product; depth follows mastery, not birthdate |
| No opening tutorial | Learn-by-doing philosophy; Chief Dodo reacts to mistakes, doesn't front-load instruction |
| Poker variant changes per curriculum phase | The game mechanic should match the math complexity; each variant is chosen because it best exposes the target concepts |
| NPCs are pedagogical, not random | Each NPC embodies a specific reasoning pattern (flawed or correct); defeating them requires understanding the pattern; NPC sequence tracks curriculum progression |
| Text-based first | Focus on mechanics and learning before investing in graphics |
| Client-side only in Phase 1 | Simplest viable product; backend added when multiplayer requires it |
| Bird theme throughout | Chief Dodo, player avatar, all NPCs, the club ("The Nest") — consistent world-building |

---

## Current State

**Phase:** Pre-development — defining requirements, design, and scope/sequence.

**Completed:**
- Project concept and design principles established
- Documentation structure created (`requirements.md`, `design.md`, `scope-sequence.md`, `tech-spec.md`)
- User stories drafted (requirements.md)
- Game design outlined (design.md): Chief Dodo persona, NPC design principles, progression model
- CCSS standards identified and mapped to phases (scope-sequence.md stub)
- Tech architecture direction set (tech-spec.md stub)

**In Progress / Next:**
- Scope and sequence planning session: define Phase objectives, competency gates, poker variant per phase, full NPC roster (names, bird species, reasoning patterns)
- Tech stack decision (deferred until after planning)

---

## Open Questions

- What poker variant works best for Phase 1 (pre–full poker)? Consider something simpler that still exposes the sample space of a deck.
- What are the exact competency gate criteria per phase? How does the system distinguish "lucky win" from "correct reasoning"?
- Full NPC roster: names, bird species, personality, reasoning pattern, phase assignment.
- Avatar bird species options for the player.
- Tech stack: frontend framework, backend language (when needed).
- Whether Phase 1 persistence should be localStorage only, or if even a simple backend makes sense early.

---

## File Map

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project overview, dev workflow, doc pointers |
| `documentation/requirements.md` | User stories with status tracking |
| `documentation/design.md` | Game and experience design: world, characters, mechanics |
| `documentation/scope-sequence.md` | Curriculum phases, CCSS mapping, NPC sequence |
| `documentation/tech-spec.md` | Architecture decisions, stack choices, open decisions |
| `documentation/handoff.md` | This file — session context for future Claude instances |

---

## Last Updated

2026-06-01 — Initial documentation session. Requirements, design, and scope structure created from scratch based on founder conversations.
