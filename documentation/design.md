# Game & Experience Design

---

## Concept

An educational poker game that teaches probability and statistics through play. The student learns by doing — making decisions, observing outcomes, and receiving coaching after mistakes. There is no opening tutorial. The math is the game.

The experience is grounded in a bird-themed world. This originated as a nod to Jacob Kantor's "DODO" professional brand (district office door opener) and his love of poker. It is a serious educational product with a playful skin.

---

## Setting: The Nest

The poker club where all play takes place is called **The Nest**. All characters, references, and flavor text should be consistent with this world. The aesthetic is a bird social club — think cigar-room energy, but feathered.

---

## The Player

- Picks a **bird species** as their avatar at the start
- Species list TBD (should offer meaningful variety — exotic, common, funny, serious)
- No prior poker knowledge assumed; no prior math knowledge assumed
- Competency, not age, drives progression

---

## Chief Dodo

The player's guide, coach, and narrator. A dodo bird. Full name: **Chief Dodo**.

### Voice & Tone
- Direct and clear, never condescending
- Warmly observational — notices things, offers perspective, doesn't lecture
- Comfortable with silence: doesn't explain everything, lets mistakes breathe
- Occasionally dry humor; never at the student's expense
- Works for an 11-year-old and a 48-year-old with a Master's degree

### Coaching Philosophy
- **Reactive by default**: Chief Dodo speaks after the hand, not before
- **On-demand**: The student can invoke Chief Dodo at any time
- **Observational about NPCs**: Points out what an opponent did and why it matters
- Does not give away correct answers; asks questions, surfaces patterns

### Interaction Triggers
- Player makes a probabilistically poor decision → post-hand note from Chief Dodo
- Player requests help → Chief Dodo responds to the current game state
- New poker variant introduced → Chief Dodo gives a brief rules walkthrough
- NPC demonstrates a notable reasoning pattern → Chief Dodo may comment

---

## NPCs

All opponents are birds. Each NPC embodies a **specific reasoning pattern** — a common cognitive approach to probability that is either flawed, naive, or instructive. NPC complexity tracks the curriculum progression.

### Design Principles
- NPCs are not random; their behavior is deterministic enough to be analyzed
- Each NPC is a "lesson in disguise" — defeating them requires understanding their pattern
- Chief Dodo can name and explain the pattern after the student encounters it
- Early NPCs: obvious, exploitable errors → build confidence and basic intuition
- Later NPCs: subtler errors or sophisticated but incomplete reasoning → require deeper analysis

### NPC Roster (to be fully defined in scope-sequence.md)

Placeholder examples by phase:

| Phase | NPC Name | Bird Species | Reasoning Pattern | Flaw / Lesson |
|-------|----------|--------------|-------------------|---------------|
| 1 | TBD | TBD | Always bets / always calls | Ignores probability entirely — easy to beat once you track outcomes |
| 1 | TBD | TBD | Always folds unless "certain" | Extreme risk aversion — models irrational fear of uncertainty |
| 2 | TBD | TBD | Gambler's Fallacy | Believes a losing streak means a win is "due" |
| 2 | TBD | TBD | Hot Hand Fallacy | Believes recent wins predict future wins |
| 3 | TBD | TBD | Base Rate Neglect | Ignores overall likelihoods, fixates on vivid recent events |
| 4 | TBD | TBD | Overconfidence | Consistently overestimates probability of winning |
| 5 | TBD | TBD | Rational EV player | Correct expected-value reasoning — a model to recognize and respect |

---

## Game Mechanics

### Format
- Single-player to start; multiplayer planned for a future phase
- Player faces 1–5 NPCs depending on progression level
- Text-based interface in Phase 1; graphical version planned later

### Poker Variants by Phase
The poker variant is selected to best serve the mathematical concepts at each phase. Chief Dodo introduces each new variant when it appears. See `scope-sequence.md` for the full mapping.

### Progression
- Competency-gated: the student advances by demonstrating understanding, not by playing enough hands
- Competency is assessed through decision quality, not win/loss record
- Assessment criteria TBD per phase (see `scope-sequence.md`)

### Feedback Loop
1. Student plays a hand
2. If a poor decision was made, Chief Dodo delivers a post-hand note
3. Chief Dodo may also comment on NPC behavior
4. Student can ask follow-up questions
5. Play continues

---

## Future Design Considerations

- **Graphical version**: Bird avatar art, table design, chip animations — all future
- **Teacher dashboard**: Assign phases, view student progress — future
- **Multiplayer**: Students play against each other; NPCs may still appear — future
- **UI/UX direction**: To be added to this document when graphical design begins
