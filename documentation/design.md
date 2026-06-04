# Game & Experience Design

---

## Concept

An educational poker game that teaches probability and statistics through play. The student learns by doing — making decisions, observing outcomes, and receiving coaching from their guide. The math is the game.

The experience is grounded in a bird-themed world set in Los Angeles. This originated as a nod to Jacob Kantor's "DODO" professional brand (district office door opener) and his love of poker. It is a serious educational product with a playful skin.

---

## Setting: The Nest

**The Nest** is a members-only bird social club in Los Angeles — the poker venue where all play takes place. Think: warm, connected, a little exclusive, distinctly West Coast. The aesthetic is a bird social club, not a casino. Characters, flavor text, and references should all feel at home here.

The Nest is organized around **tables**, each running a different poker variant. Tables map to curriculum phases — as the student masters the concepts at one table, Chief Dodo suggests they move to the next.

### The Backroom: The Surveillance Room

A special room accessible through Chief Dodo's connections. The Nest's surveillance footage can be played back at high speed — 100, 1,000, or 10,000 draws in seconds. Chief Dodo introduces the student to this room at the right pedagogical moment. After that, the student can return independently whenever they want to run a fast simulation. The 100-draw option scaffolds the lesson: short runs are visibly noisy before committing to long-run convergence.

This room is the primary tool for demonstrating the Law of Large Numbers — showing that long-run relative frequency converges to theoretical probability in a way no single session can. All simulations are card-based and unlocked progressively as the student demonstrates mastery:

- **Table 1B (unlocked)** — Single card draw with replacement, tracking suit color (red vs. black). P(red) = 26/52 = ½. Theoretical probability is verifiable by counting before any formula is introduced.
- **Future unlock** — Single card draw: suit distribution (hearts / diamonds / clubs / spades). P(heart) = 13/52 = ¼. Introduces convergence at a non-50% target.
- **Future unlock** — Rank distribution (Ace through King). P(Ace) = 4/52 = 1/13. Rarer events converge more slowly; same LLN principle at lower probabilities.
- **Future unlock** — Short-hand poker: 2, 3, or 4 cards dealt to one or more players; students track hand-type frequencies and compare against theoretical probabilities as those are learned at later tables. (Two cards: P(pair); three cards: P(three of a kind), P(one pair); four cards: P(two pair), P(four of a kind); multiplayer high-card.)

All simulations use sampling with replacement to maintain a stable theoretical probability across draws.

---

## The Player

- Picks a **bird species** as their avatar at the start
- No prior poker knowledge assumed; no prior math knowledge assumed
- Competency, not age, drives progression

### Starting Avatars

Five species available at the start — all birds a player might actually encounter in Los Angeles:

| Species | Personality flavor |
| --- | --- |
| Seagull | Scrappy and opportunistic. Always looking for an angle. |
| Finch | Cheerful and curious. Asks a lot of questions. |
| Quail | Calm and methodical. Doesn't rush. (California's state bird.) |
| Sparrow | Understated and relatable. Easy to underestimate. |
| Crow | Sharp and a little edgy. Remembers everything. |

### Prestige Avatars (future)

Additional species unlocked as the student advances through the club. Placeholder — species TBD. Design constraint: prestige avatar species must not overlap with any named NPC species. Single-word NPC nicknames (Hawk, Stork, etc.) are reserved for NPCs; prestige avatars should use full species names if there is any risk of confusion.

---

## Chief Dodo

The player's guide, coach, and narrator. A dodo bird. Full name: **Chief Dodo**.

### Background & Character

By day, Chief Dodo sells educational technology solutions to schools and school districts — he's a connector, a door-opener, a relationship person. He's been around. He knows everybody at The Nest and everybody knows him. He loves Nike shoes, LA sports, and hip-hop. His energy is warm, fast, and real — he doesn't talk down to anyone.

The student enters The Nest as if they already know Chief Dodo. They've made plans. Chief Dodo greets them like an old friend picking up a conversation: "Like I told you last night, The Nest is the best." This drops the student into an existing relationship — no cold introduction, no awkward first-meeting energy. Chief Dodo can reference prior "conversations" to establish concepts without exposition.

### Voice & Tone

- Chatty and energetic — this is a person, not a tutorial
- Direct and clear, never condescending
- Lively when the moment calls for it; quiet when it doesn't
- Occasionally dry humor; never at the student's expense
- Hip-hop and LA cultural references feel natural, never forced
- Works for an 11-year-old and a 48-year-old with a Master's degree — the register is human, not academic

### Coaching Philosophy

Chief Dodo is a **guide on the side**: just-in-time support, not front-loaded instruction. He speaks when the pedagogical moment warrants it — not at a fixed schedule, not constantly. He is as likely to praise a well-reasoned fold or a good decision to take a break as to flag an error.

Chief Dodo does not give away answers. He surfaces patterns, asks questions, and points at things the student might have missed. The student does the reasoning.

The underlying principle: **know when to hold 'em, know when to fold 'em**. Good decisions include knowing when not to play. Chief Dodo praises correct fold decisions and correct exits as much as correct bets.

### Coaching Touchpoints

Chief Dodo has defined moments in each hand when he can (but doesn't always) speak:

| Moment | What Chief Dodo Does |
| --- | --- |
| Approaching a table | Brief orientation: game plan, what to watch for, what's different about this variant |
| Start of each hand | Optional: observations on opponent patterns, advice on how to approach this hand |
| During each betting round (others' turns) | Brief, conversational — noticing things as they happen |
| During each betting round (student's turn) | More space to talk through observations and options |
| After each hand | Debrief: what happened, what the math says, what the NPCs showed us |
| After a pattern across several hands | Chief Dodo may name a misconception he's been watching develop |

### The Reference Card System

Chief Dodo hands the student a **basic reference card** as part of the Table 1A introduction — not at the start of the game, but in a natural coaching moment once the student is seated and oriented. The card is a persistent UI element that stays with the student for the rest of their session.

#### UI: Sliding Panel

The reference card lives in a **sliding panel** on the right side of the table screen. It is not a modal — it overlays the game without replacing it. A toggle control is always visible so the student can show or hide the panel at will. The student can have the panel open while actively playing: choosing which cards to draw, deciding whether to bet, watching Hank's response — all with the reference card in view.

Chief Dodo can also open the panel **programmatically**, as part of his coaching dialog. A `openReferenceCard: true` flag in a dialog node's `followUp` payload triggers the panel to slide open. This lets Chief Dodo draw the student's attention to the card mid-coaching without requiring a separate player action.

#### Content at Table 1A

The Table 1A reference card contains the **nine poker hand rankings**, from highest to lowest, with a **qualitative rarity descriptor** for each. No probability fractions or combinatorial counts appear yet — those are earned at later tables, after the student has built intuition through observation.

Rarity descriptors are qualitative only: terms like "common," "uncommon," "rare," and "very rare." The framing is relative and experiential, not mathematical.

| Hand | Rarity |
| --- | --- |
| Straight Flush | Very rare |
| Four of a Kind | Very rare |
| Full House | Rare |
| Flush | Rare |
| Straight | Uncommon |
| Three of a Kind | Uncommon |
| Two Pair | Common |
| One Pair | Common |
| High Card | Common |

#### Card Progression

As the student acquires knowledge and demonstrates competency, Chief Dodo hands them additional cards. Later cards add:

- Probability of each hand
- Combinatorial counts (how many ways each hand can be made)
- Pot odds and equity reference
- Other advanced information TBD per phase

This staged reveal serves a pedagogical purpose: students encounter hand probabilities *after* they've worked through why some hands are rarer than others. The card reflects earned knowledge, not front-loaded content.

---

## NPCs

All opponents are birds. Each NPC embodies a **specific reasoning pattern** — a common cognitive approach to probability that is either flawed, naive, or instructive. NPC complexity tracks the curriculum progression.

### Design Principles

- NPCs are not random; their behavior is deterministic enough to be analyzed
- Each NPC is a "lesson in disguise" — understanding their pattern is what lets you beat them
- Chief Dodo can name and explain the pattern after the student encounters it
- Early NPCs: obvious, exploitable errors → build confidence and intuition
- Later NPCs: subtler errors or more sophisticated reasoning → require deeper analysis
- NPCs are sequenced deliberately — the progression of opponents tracks the curriculum
- **Betting behavior reflects personality**: NPC fold/bet decisions are driven by their specific reasoning pattern, not a flat strategy. Lucky (gambler's fallacy) folds when she's been winning — she thinks she's "due" to lose, so she protects her stack. This creates a gameplay advantage for students who understand the fallacy. Future NPCs should follow the same principle: behavior that is consistent with the character's error and exploitable by students who understand it.

### Backup NPC Pool

When a planned NPC is bankrupt, Chief Dodo introduces a replacement from a pool of 10 backup members of The Nest. These replacements are not pedagogical NPCs — they are world-building characters who sit in for gameplay continuity. They use the same dialog and behavioral pattern as the NPC they replace.

Chief Dodo's introduction follows a four-beat structure: acknowledge the bust, announce the arrival, share an anecdote, confirm readiness ("Alright. [name], you're up."). Each backup has a name, bird species, and a short Chief Dodo anecdote.

**Current backup roster** (10 members, used in order, never reused within a session):

| Name | Species | CD's anecdote hook |
| --- | --- | --- |
| Morty | Monk Parakeet | "Been at this table longer than the felt. I once watched him bluff a golden eagle off a full house with nothing but a straight face." |
| Blanche | Australian white ibis | "Word is she won a car in gin rummy, drove it to the coast, and pushed it into the ocean. Never confirmed. She never denied it." |
| Dex | Hoopoe | "Tells everyone he's a professor of something. He narrates every hand like he's giving a lecture to an invisible classroom." |
| Ines | Secretary Bird | "Walked out of a hedge fund one morning, left her badge on the desk, came straight here. That was four years ago." |
| Clyde | Atlantic Puffin | "Flies in every winter from up north. Happiest loser I've ever seen — I think he just likes being somewhere warm." |
| Margot | Roseate Spoonbill | "Was here before the card tables. She talked the owner into installing them. Brings it up every time she sits down." |
| Theo | Shoebill Stork | "Doesn't say much. There's something about the way he sits. I asked him once what he was thinking. He said 'enough.'" |
| Pearl | Sulphur-Crested Cockatoo | "Performed at a resort in the Cayman Islands for three years. Still plays like she's got an audience — because in her head she always does." |
| Benny | European Roller | "Claims he's played in casinos on six continents. Showed up with a rolling suitcase one night and it's still in the coat check." |
| Ruthie | Southern Cassowary | "Never raises her voice. She's got a look. Once you understand the look, you understand Ruthie." |

If all 10 are exhausted, the game offers a "Play again" reset instead of a continuation.

### NPC Roster

Full phase and table assignments in `scope-sequence.md`. Summary:

| NPC | Bird | Phases | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- | --- |
| Hank | California Condor | 1 | Always bets, never folds | Complete disregard for probability |
| Lucky | Rock Pigeon | 1–2 | Gambler's fallacy | "I'm due." Believes losing streaks make future wins more probable. |
| Vivian | Flamingo | 1–3 | Hot hand fallacy | Recent wins make her bet bigger. Mirror image of gambler's fallacy. |
| Rico | Sulfur-crested Cockatoo | 2–3 | Base rate neglect + recency bias | Only attends to what just happened; ignores long-run base rates. |
| Maestro | Great Blue Heron | 2–5 | Anchoring — never updates | Assesses initial hand strength; does not revise as new information arrives. |
| Carlos | Keel-billed Toucan | 2–4 | Independence fallacy | Treats every card draw as independent of what has already been dealt. |
| Pelican Pete | Brown Pelican | 3–4 | Outs miscounting | Double-counts outs by not removing cards already visible on the board. |
| Pharaoh | African Sacred Ibis | 3–5 | Ignores dead cards | Counts from the full deck; never adjusts for opponent-visible cards. |
| Grace | Great Egret | 4–5 | Addition Rule error | Adds overlapping probabilities without subtracting the intersection. |
| Hawk | Osprey | 4–5 | Resulting bias | Judges decisions by outcomes, not by whether the EV was positive. |
| Stork | Marabou Stork | 5 | Single-street reasoning | Correct EV on individual streets; cannot combine across multiple streets. |
| Brother | Southern Yellow-billed Hornbill | 5 | Procedural mimicry | Applies memorized values from standard poker to non-standard contexts. |
| The Professor | Common Raven | 4–5 | Rational EV reasoning | The model of correct probabilistic thinking — the goal is to match his method. |

---

## Game Mechanics

### Format

- Single-player to start; multiplayer planned for a future phase
- Player faces 1–5 NPCs depending on progression level
- Text-based interface in Phase 1; graphical version planned later

### Input Model

All player interaction is button-driven. There are four interaction types:

**1. Action menu** — game decisions (call, bet, fold, check, draw, etc.) rendered as clickable buttons.

**2. Navigation** — table advancement, reference card toggle, Surveillance Room entry are each contextual single-purpose buttons that appear when the relevant action is available.

**3. Checklist response** — used when Chief Dodo asks a reflective question. Player sees 4–7 statements — a mix of correct reasoning and common misconceptions — and clicks any that match their thinking. Chief Dodo's follow-up uses a 3-attempt scaffold (directional hint → quantitative hint → reveal), branching on attempt count. *Note: per-option adaptive feedback (follow-up keyed to which specific items were selected) is a planned future enhancement; current implementation branches on attempt count only.*

**4. Numeric input** — used when Chief Dodo asks a quantitative question. Single number field; Chief Dodo's follow-up branches on correct / too high / too low. Numeric assessment is introduced at Table 1A (t1a-assess-hank-numeric: how many of the next 5 hands will Hank bet on?) and used throughout.

**Assessment timing:** Assessment questions are interleaved with gameplay — never batched at the end. The principle: Chief Dodo reacts to moments as they arise, not on a fixed schedule. At Table 1A, the Hank pattern checklist fires after 3 completed hands (the student has seen Hank's always-bet behavior on every hand; 3 is enough to notice). Play then resumes uninterrupted. The gambler's fallacy coaching and its two checklists fire separately at hand 8+ — after the student has experienced enough hands to have encountered a streak — but only when Hank is demonstrably on a losing streak (CD's coaching must be factually true). Real gameplay separates each coaching moment; assessment never clusters.

**Rare-event teaching moments:** In addition to planned coaching sequences, genuinely rare game events trigger their own one-time teaching moment when they first occur. The example in the current build is a *tie* — two players holding identical hand ranks. The first tie a student encounters pauses gameplay for a brief CD explanation, and the Tie row appears in the frequency table for the first time (it is hidden until then). The row's sudden appearance is itself part of the lesson: the student sees, in their own data, what "rare" actually looks like over time. Subsequent ties receive a brief acknowledgment only — the teaching moment fires once. At Table 2A, a scripted hand guarantees the student encounters a tie at the moment when exact probability calculation (P = favorable outcomes / total outcomes) is the lesson, whether or not they have seen a natural tie before. This planned-rare-event pattern is the preferred design for future rare mechanics as well.

### Assessment System

The game assesses the student through multiple modes. The overarching principle: **assessment follows observation**. Students are never asked to reason about something they haven't had the chance to watch first.

#### Assessment modes

| Mode | Description | Status |
| --- | --- | --- |
| Gameplay observation | Passive — the system records bets, draws, and fold decisions to build a picture of the student's probability reasoning without interrupting play | Planned |
| Checklist | Chief Dodo presents 4–7 statements (correct reasoning and common errors); student checks all that apply; 3-attempt scaffold; per-option adaptive follow-up is a planned enhancement | Live |
| Numeric input | Chief Dodo asks a quantitative question; student enters a number; feedback branches on correct / too high / too low | Live |
| Single-select decision | One best answer from 3–4 options; used for "what's the right move here?" moments | Planned |
| Qualitative estimate | Student picks a probability bucket (very likely / possible / unlikely / very unlikely); bridges intuition and formal probability | Planned |
| Prediction + reveal | Student commits to a prediction before an outcome resolves; the hand plays out and the result is the feedback | Planned |

#### Checklist scaffolding

Three-attempt ladder — built into the assessment engine, parameterized via each node's `feedback` field in the dialog JSON:

- **Attempt 1 wrong** → directional hint ("look at what he does every time")
- **Attempt 2 wrong** → quantitative hint: how many checked statements don't belong, how many correct ones are unchecked — without naming them
- **Attempt 3 wrong** → Chief Dodo reveals the answer; student continues

#### Assessment record

Final outcomes (node ID, response type, attempts taken, correct/incorrect) are persisted alongside game state in `localStorage`. The competency gate queries this record. Chief Dodo's adaptive coaching can also query it to avoid repeating material the student has already demonstrated.

#### Scripted hands (planned)

To assess specific concepts reliably, the system needs to be able to override the random deck and deal predetermined cards — placing the student in a specific situation. This is triggered via dialog (Chief Dodo says "let me show you something") and handled at the game layer, not the assessment layer.

### Club Structure & Progression

- The Nest is organized into tables, each running a different poker variant
- Each table maps to a curriculum phase with specific learning objectives
- When the student demonstrates mastery across all lessons at a table, Chief Dodo suggests moving to the next table
- Competency-gated: advancement requires demonstrated understanding, not a hand count
- Competency is assessed through decision quality, not win/loss record

### Token Values

In The Nest, the token used for placing bets is seeds (rather than chips). The values for the seeds are as follows:

| Seed Color   | Denomination |
| ------------ | ------------ |
| White        | 1            |
| Red          | 5            |
| Brown        | 10           |
| Green        | 25           |
| Black        | 100          |
| Blue         | 500          |
| Yellow       | 1,000        |
| Orange       | 5,000        |
| Big Green    | 25,000       |
| Big Lavender | 100,000      |
| Big Red      | 500,000      |
| Big Yellow   | 1,000,000    |

### Poker Variants by Phase

The poker variant at each table is selected to best serve the mathematical concepts of that phase. Chief Dodo walks the student through new variant rules when they arrive at a new table. See `scope-sequence.md` for the full mapping.

### Fixed-Bet Tables

Some early tables use a fixed bet amount rather than variable sizing. At Table 1A, bets are fixed at 5 seeds (open or call); there is no raise option. This is intentional:

- The learning focus at Table 1A is observing Hank's pattern and building probability intuition — not optimizing bet sizing
- Fixed amounts eliminate a dimension of complexity at the wrong pedagogical moment
- Equal-sized bets make win/loss patterns easy to track and compare across hands
- Chief Dodo names the fixed amount upfront so it reads as a deliberate rule, not a missing feature

Variable bet sizing is introduced when it becomes the concept under study, not before.

### Know When to Hold 'Em, Know When to Fold 'Em

A core design motif: correct decisions include knowing when *not* to play. The game is designed to create situations where folding is the mathematically sound choice. Chief Dodo praises these decisions explicitly. Students learn that good judgment — not aggression — is the skill.

### CCSS Alignment

CCSS standards are a reference map, not the curriculum driver. The game follows its own learning logic; standards are checked against it to confirm coverage. Every game mechanic maps to at least one standard, but the progression is designed for coherent learning, not standards compliance.

---

## Future Design Considerations

- **Graphical version**: Bird avatar art, table design, seed animations — all future
- **Teacher dashboard**: Assign phases, view student progress — future
- **Multiplayer**: Students play against each other; NPCs may still appear — future
- **UI/UX direction**: To be added to this document when graphical design begins
- **Chief Dodo voice samples**: Write several sample lines to establish voice before implementation
