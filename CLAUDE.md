# dodo-poker

## Project Overview

Educational web application that teaches probability and statistics to American students in grades 6–12 through poker-based gameplay. Curriculum is anchored in the Common Core State Standards (CCSS) for mathematics.

## Target Audience

- Students: Grades 6–12 (ages 11–18)
- Curriculum alignment: Common Core Mathematics (Statistics & Probability strand)

## Tech Stack

- **Phase 1**: Client-side only — runs in the browser, no server required, state via `localStorage`
- **Phase 2**: Backend added when multiplayer is needed — Docker locally, Railway/Supabase/GCloud/AWS for deployment
- **Stack**: TBD — decided after scope/sequence planning
- See `documentation/tech-spec.md` for architecture details and open decisions

## Key Constraints

- Content must be age-appropriate for middle and high school students
- Game mechanics should reinforce, not obscure, the math concepts
- Must map to specific Common Core standards (see planning docs when available)

## Documentation

| File | Contents |
| --- | --- |
| `documentation/requirements.md` | User stories with status tracking (source of truth for TDD acceptance criteria) |
| `documentation/design.md` | Game and experience design: world, Chief Dodo, NPCs, mechanics, progression |
| `documentation/scope-sequence.md` | Curriculum phases, CCSS standards mapping, poker variant per phase, NPC sequence |
| `documentation/tech-spec.md` | Architecture decisions, stack choices, open technical decisions |
| `documentation/handoff.md` | Session context — read this first at the start of any new Claude session |

## Development Workflow

- Use conventional commits (`feat:`, `fix:`, `chore:`, etc.)
- Follow TDD: write tests before implementing features
- No features beyond what's required
- No comments unless the WHY is non-obvious
