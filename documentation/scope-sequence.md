# Learning Scope & Sequence

**Version**: 1.0  
**Design methodology**: Backward design (UbD) — enduring understandings first, evidence of mastery second, game experiences third  
**Research basis**: `research.md`, `research-scope-sequence.md`

---

## Design Principles

1. **Concept-first, variant-second.** The prerequisite dependency graph of probability concepts drives the sequence. Poker variants are assigned to tables based on which variant best exposes each concept at the right level of sophistication. A variant is a vehicle, not a destination.

2. **Spiral curriculum.** Every core concept appears at minimum three times: introduced informally, focused formally, then applied as a tool for learning something new. The spiral is planned explicitly — see the Concept Spiral Map below.

3. **Experimental before formal.** Formal probability numbers (fractions assigned to outcomes) do not appear until students have built a frequentist intuition through experimental observation. Early tables observe and record before they compute.

4. **90% mastery threshold, three-component gate.** Every competency gate requires evidence across three dimensions: procedural fluency (can compute), conceptual understanding (can explain, can detect errors), and transfer (can apply to a novel context). 90% correct across 2–3 encounters, including at least one transfer task. Retakes use parallel-form problems, not identical ones.

5. **Chief Dodo is the formative assessment mechanism.** Gates feel like game challenges. Chief Dodo's in-hand coaching is the formative loop — surfacing patterns, asking questions, directing students back to specific concepts before they reach the gate.

---

## Four Enduring Understandings

These thread through Chief Dodo's coaching language at every table. They are never stated as definitions — they are the implicit conclusions students should draw from the game.

1. **Probability quantifies uncertainty.** It is not intuition, not luck, not a feeling — it is computable from a defined sample space.
2. **When information changes, probability must be updated.** Conditioning on evidence is the fundamental operation of probabilistic reasoning.
3. **Decisions should be grounded in expected value, not outcome feeling.** A good decision can have a bad outcome. A bad decision can have a good outcome. Quality is in the reasoning, not the result.
4. **The same mathematical structure applies across different contexts.** The counting logic that explains flush probabilities applies to any situation involving finite, equally-likely outcomes.

---

## Concept Spiral Map

Each concept is tracked through three appearances: **I** = introduced (informal, no notation), **F** = primary focus (formal, gated), **A** = applied as a tool for learning something new.

| Concept | Introduced (I) | Primary Focus (F) | Applied as Tool (A) |
| --- | --- | --- | --- |
| Sample space | 1A | 1A | 2A–5B (foundation of all calculations) |
| Likelihood language (impossible → certain) | 1A | 1A | 1B |
| Experimental probability | 1A | 1B | 2A, 3A, Surveillance Room |
| Law of Large Numbers (intuitive) | 1B | 1B + Surveillance Room | 5A |
| Classical probability P = f/t | 2A | 2A | 3A–5B |
| Complementary events P(not A) = 1 − P(A) | 2A | 2A | 4B |
| Tree diagrams | 2B | 2B | 3A, 4A |
| Compound events (independent) | 2B | 2B | 3B–4C |
| Combinations C(n,r) | 2C | 2C | 4B, 5B |
| Conditional probability (informal) | 3A | 3B | 4A–5A |
| Conditional probability P(A\|B) (formal) | 3B | 4A–4B | 5A |
| Dead card tracking | 4A | 4A | 5A |
| Independence: P(A\|B) = P(A) (formal) | 3B | 4B | 5A |
| Mutually exclusive events | 2B | 2B | 4B |
| Addition Rule P(A or B) | 2B (ME case) | 4B | 5A |
| Multiplication Rule (dependent events) | 3B | 4A | 5A |
| Expected value | 3C (informal) | 4C | 5A–5B |
| Pot odds as applied EV | 4C | 4C | 5A |
| EV with embedded conditional probability | 4C | 5A | — |
| Combinatorics for altered sample spaces | 2C | 5B | — |
| Wild card paradox (Gadbois) | 5C (enrichment) | 5C | — |

---

## The Nest Layout

The Nest is organized into four rooms, each deeper into the club:

- **The Front Room** — Tables 1A and 1B. Entry level. Stakes are seeds only. Chief Dodo is nearby at all times.
- **The Main Room** — Tables 2A, 2B, 2C. The heart of the club. This is where most members play.
- **The Back Room** — Tables 3A, 3B, 3C, 4A, 4B, 4C. More serious. Chief Dodo checks in less often; students are expected to think more independently.
- **The High Stakes Room** — Tables 5A, 5B, 5C. Chief Dodo introduces students here after mastery of the Back Room is demonstrated.

**The Surveillance Room** — Accessible from a side hallway off the Front Room. Chief Dodo introduces it during Table 1B at the right pedagogical moment. After that, students may return independently. Supports fast-simulation of 1,000–10,000 hands; displays running observed frequencies against theoretical probabilities the student has computed.

---

## Phase 1: Qualitative & Experimental Foundation

**Core concepts**: Sample space, likelihood language, experimental probability, Law of Large Numbers (intuitive)  
**Entering assumption**: Zero prior knowledge — no poker, no probability  
**CCSS targeted**: 7.SP.C.5, 7.SP.C.6, 7.SP.C.7b, 7.SP.C.8c  
**Room**: The Front Room

---

### Table 1A — The Entry Table

**Variant**: Five Card Draw (simplified — draw mechanic and fixed-bet betting included; no variable bet sizing, no raises)

**Why this variant, not another**: Five Card Draw's sample space is the cleanest in the set: 52 cards, C(52,5) equally likely hands, all private, no sequential updating required. There is no community information to track, no opponent-visible cards to condition on, no wild cards to complicate the space. No other variant gives a more direct, uncluttered demonstration that some outcomes are more likely than others and that the deck does not have memory.

**Implementation simplifications at Table 1A**: The draw mechanic is included — it gives the student agency and creates observational data about card exchange decisions. Betting is included but simplified: bets are fixed at 5 seeds (open or call), there is no raise option. Chief Dodo names the fixed amount upfront. Variable bet sizing is introduced when it becomes the concept under study.

**Learning Objectives**

- Identify the sample space for a draw from a standard deck
- Use likelihood language correctly: impossible, unlikely, equally likely, likely, certain
- Observe that some card outcomes appear more often than others across multiple deals
- Understand probability as a property of the random process, not a guarantee about any single hand
- Recognize the gambler's fallacy as a named, common error — before any formal probability instruction

**Chief Dodo's Focus**: Surfacing the gambler's fallacy before formal numbers arrive. When a student shows disappointment after several "bad" deals, Chief Dodo observes that the deck does not remember what just happened. Actively confronting this intuition before fractions appear is research-supported (Fischbein's primary intuitions are persistent and must be named, not ignored).

**Assessment sequencing at Table 1A**: Following the predict→observe→compare cycle from research, coaching moments are interleaved with play — never batched. At hand 3, Chief Dodo prompts the student to describe Hank's pattern (checklist). Play resumes. At hand 8, Chief Dodo surfaces the gambler's fallacy directly (coaching + conceptual checklist), then immediately bridges to a transfer scenario (colored-seeds bag, same reasoning applied to a new context). Completing both assessments — correctly or after three attempts — triggers the gate-passed sequence and unlocks Table 1B.

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Hank | California Condor | Always bets, never folds | Plays entirely without reference to probability — shows what action-driven play with zero mathematical reasoning looks like |

**CCSS**: 7.SP.C.5 — *introduced* (probability as a number between 0 and 1; the student encounters the concept before the formal number is assigned)

**Competency Gate** *(implemented)*

- *Procedural*: Given a described scenario (a draw from a standard deck), correctly classify the event as impossible, possible, or certain *(scaffolded via the Hank pattern checklist — hand 3)*
- *Conceptual*: Explain why getting five poor hands in a row does not make a good hand more likely next time *(gambler's fallacy checklist — hand 8; 3-attempt ladder with directional and quantitative hints)*
- *Transfer*: Apply the same reasoning to a non-card scenario (drawing from a bag of colored seeds with replacement) *(transfer checklist — fires immediately after conceptual, same coaching session)*

Completing both the conceptual and transfer checklists (correctly or after three attempts on each) triggers Chief Dodo's gate-passed sequence and surfaces the "Move to Table 1B" control.

---

### Table 1B — The Frequency Table

**Variant**: Five Card Draw (repeated dealing; student tracks outcomes across many hands using a frequency table)

**Why this variant, not another**: The pedagogical goal is building the frequentist foundation — that relative frequency converges toward a stable value over many trials. Five Card Draw's uniform sample space provides a known theoretical probability to compare against once it is introduced: there is a "correct" frequency to converge toward, which makes the comparison between observed and theoretical probability meaningful. No other variant maintains this uniformity while remaining simple enough for a student with no formal probability yet.

**Learning Objectives**

- Record outcomes in a frequency table across repeated deals
- Compute relative frequency as a fraction: observed / total trials
- Observe convergence: more trials → frequency closer to the theoretical probability
- Understand the Law of Large Numbers as a long-run behavioral claim, not a guarantee about any specific hand
- Distinguish experimental probability (what happened) from theoretical probability (what the math predicts)

**Chief Dodo's Focus**: The Surveillance Room introduction. After the student has tracked enough hands to see convergence begin but before it fully clicks, Chief Dodo takes them to the Surveillance Room to run 1,000 hands instantly. The contrast between 20 observed hands and 10,000 simulated hands is the moment that makes LLN concrete. "You tracked twenty hands and it was starting to look right. Look what happens when we run ten thousand."

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Hank | California Condor | Always bets (returns from 1A) | With frequency data in hand, the student can now see that Hank's always-bet strategy loses in the long run |
| Lucky | Rock Pigeon | Gambler's fallacy | After several losses: "I'm due, man. Five bad hands in a row — the cards owe me." Chief Dodo points at the frequency table: does the deck know? |

**CCSS**: 7.SP.C.6 (approximate probability through repeated experiments; observe long-run relative frequency — **focus**); 7.SP.C.7b (non-uniform probability model from observed frequencies); 7.SP.C.8c (simulation — Surveillance Room)

**Competency Gate**

- *Procedural*: Given 50 observed deals, compute the relative frequency of a specified hand type as a fraction and as a decimal
- *Conceptual*: Use the frequency table to explain specifically why Lucky's reasoning is incorrect — point to the data
- *Transfer*: Given a Surveillance Room chart showing 10,000 coin flips, explain what the running-frequency graph shows, what it means for any single flip, and what it says about what will happen over the next 10,000 flips

---

## Phase 2: Classical Probability & Simple Compound Events

**Core concepts**: Classical probability model, complementary events, compound events, tree diagrams, combinations C(n,r)  
**Entry requirement**: Phase 1 gate passed  
**CCSS targeted**: 7.SP.C.5, 7.SP.C.7a, 7.SP.C.8a, 7.SP.C.8b, S-CP.B.9  
**Room**: The Main Room

---

### Table 2A — The Fraction Table

**Variant**: Five Card Draw (single deal; no draw mechanic; focus is on formal probability computation)

**Why this variant, not another**: For the first formal introduction of probability as a fraction (favorable outcomes / total outcomes), Five Card Draw's uniform sample space is essential. Every card is equally likely to be drawn. The classical probability model — which Laplace formalized and which underlies every introductory probability course — requires equally-likely outcomes, and Five Card Draw delivers this cleanly. No other variant maintains this uniformity: Texas Hold'Em has known vs. unknown cards that complicate the sample space, Stud has player-visible upcards, and any game state with partial information breaks the classical model. This fraction is the computational foundation for the next six tables; it must be introduced in the cleanest possible context.

**Learning Objectives**

- Define probability as a fraction: P(A) = favorable outcomes / total outcomes
- Enumerate outcomes for one-card events: P(ace), P(heart), P(face card)
- Define complementary events and compute P(not A) = 1 − P(A)
- Distinguish theoretical probability from the experimental probability observed at Table 1B
- Understand when the classical model applies: equally likely outcomes only

**Chief Dodo's Focus**: Connecting back to the frequency table from 1B. The fraction they are computing now is the value their observed frequencies were converging toward. "Remember when Lucky said he was due? Here's what the deck actually says. Here's the number."

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Lucky | Rock Pigeon | Gambler's fallacy (returns) | Student can now compute exactly why Lucky's reasoning fails — the fraction says the next card does not depend on the last ten |
| Vivian | Flamingo | Hot hand fallacy | Recent wins make her raise: "I'm running hot, the cards are on my side." Mirror image of gambler's fallacy — same structural error, opposite sign |

**CCSS**: 7.SP.C.5 (probability as a number between 0 and 1 — **focus**); 7.SP.C.7a (uniform probability model — **focus**)

**Competency Gate**

- *Procedural*: Compute P(drawing an ace), P(drawing a red card), P(drawing a face card) from a standard 52-card deck
- *Conceptual*: Explain what "equally likely" means and why it matters for the classical model to apply; explain why P(not ace) = 1 − P(ace) without doing additional enumeration
- *Transfer*: Apply the classical probability formula to a non-card scenario with the same structure — drawing colored marbles from a bag of known composition

---

### Table 2B — The Tree Table

**Variant**: Five Card Draw (two sequential cards dealt explicitly; student enumerates the two-stage sample space)

**Why this variant, not another**: The deal of two sequential cards from a single deck creates a natural two-stage process where stage-two outcomes depend on stage one — the deck has one fewer card. This is the cleanest introduction to compound events using a physical process the student already understands. Tree diagrams emerge directly from the branching structure of the deal: what are all the possible first cards? For each, what are all the possible second cards? The "drawing without replacement reduces the deck" mechanic is a simple, concrete first version of dependent events without requiring conditional probability formalism yet.

**Learning Objectives**

- Enumerate two-stage sample spaces using organized lists and tree diagrams
- Compute probabilities of compound events by multiplying across branches
- Distinguish mutually exclusive events: P(A or B) = P(A) + P(B)
- Recognize that drawing without replacement creates dependent stages: the second draw's probability changes based on the first
- Connect tree diagram branch multiplication to the multiplication of fractions

**Chief Dodo's Focus**: Making the tree diagram a thinking tool, not a memorized procedure. "When you see the tree, you're seeing all the ways things can go. Once you see all the ways, you can count the ones you want."

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Lucky | Rock Pigeon | Gambler's fallacy (continues) | Now analyzable at the compound event level using the tree |
| Vivian | Flamingo | Hot hand fallacy (continues) | |
| Rico | Sulfur-crested Cockatoo | Base rate neglect + recency bias | Adjusts bets based on the last 2–3 hands; ignores the long-run tree structure. "What just happened" dominates his reasoning. Chief Dodo: where in the tree does "what just happened" live? |

**CCSS**: 7.SP.C.8a (compound event probability using organized lists, tables, tree diagrams — **focus**); 7.SP.C.8b (sample spaces for compound events — **focus**)

**Competency Gate**

- *Procedural*: Draw the complete tree diagram for two sequential card draws without replacement; compute the probability of drawing an ace followed by a king
- *Conceptual*: Explain why the probability of the second draw changes after the first card is removed; identify Rico's specific reasoning error using the tree as evidence
- *Transfer*: Apply tree diagram reasoning to a two-stage non-card scenario (drawing two seeds from a bag of known composition without replacement)

---

### Table 2C — The Counting Table

**Variant**: Five Card Draw (full five-card deal; student enumerates and counts hand types)

**Why this variant, not another**: Five Card Draw's full five-card sample space contains C(52,5) = 2,598,960 equally likely hands — a number large enough that enumeration by hand is impossible and combinations are required, yet derived from a single familiar process. All hand probabilities — P(flush), P(full house), P(one pair) — are combinatorics problems computable from C(n,r). No other variant creates this natural, high-count combinatorics problem while maintaining the clean classical model. Texas Hold'Em's partial public information would complicate the counting; Stud's sequential reveals would require conditional counting. This table is where combinations move from a convenience to a necessity.

**Learning Objectives**

- Apply the Fundamental Counting Principle to multi-stage processes
- Compute combinations using C(n,r) = n! / (r! × (n−r)!)
- Use combinations to count specific poker hand types (flushes, full houses, pairs)
- Compute P(hand type) = (count of that hand type) / C(52,5)
- Recognize that rarer hands have smaller combinatorial counts — rarity has a mathematical cause

**Chief Dodo's Focus**: The reference card upgrade. When the student demonstrates they understand why the combinatorial counts are what they are, Chief Dodo hands them an upgraded reference card: the basic hand rankings now show the combination count and probability for each hand type. This is an earned reveal — the student can now explain every number on the card rather than treating it as a given.

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Rico | Sulfur-crested Cockatoo | Base rate neglect (continues) | Doesn't realize how rare his current hand type actually is; the combination count puts a number on his error |
| Vivian | Flamingo | Hot hand fallacy (continues) | |
| Maestro | Great Blue Heron | Equiprobability bias — assumes common hands are rarer than they are | Appears for the first time; acts over-cautiously with strong hands because he has not computed the actual probability. A subtle version of treating all hands as equally likely. |

**CCSS**: S-CP.B.9 (permutations and combinations to compute probabilities — **focus**)

**Competency Gate**

- *Procedural*: Compute C(13,3) and C(4,2); use these values to count the number of full house hands; divide by C(52,5) to find P(full house)
- *Conceptual*: Explain what C(52,5) counts and why it is the correct denominator for all five-card hand probabilities; explain what Maestro gets wrong about one-pair hands
- *Transfer*: Given a modified deck (remove all 2s: 48 cards), compute C(48,5) and use it to find P(dealt at least one ace in a 5-card hand from this deck)

---

## Phase 3: Conditional Probability — Transparent to Complex

**Core concepts**: Informal conditional probability → formal P(A|B), multi-stage updating, outs and draws  
**Entry requirement**: Phase 2 gate passed  
**CCSS targeted**: S-CP.A.3, S-CP.B.6, S-CP.B.8 (introduced in this phase; focused in Phase 4)  
**Room**: The Back Room (entry)

The pedagogical risk in this phase: conditional probability is the concept most likely to be introduced too early and understood too shallowly. Jones et al. (1997) found that conditional probability emerges last in students' probabilistic thinking development. Phase 3 approaches it in three steps — first in a fully transparent variant where every card is public (No Peek), then in a single-conditioning-event scenario (Five Card Draw draw mechanic), then in Texas Hold'Em's regular three-stage structure. Each step reduces the transparency of the conditioning information while increasing the structural regularity of the updating process.

---

### Table 3A — No Peek

**Variant**: No Peek (all seven cards are dealt face-down; players cannot see their own cards; each player reveals one card at a time; anyone whose showing hand beats the current leader continues)

**Why this variant, not another**: No Peek is the only poker variant where no player holds private information. Every card that appears is a conditioning event visible to every player simultaneously. Chief Dodo can narrate the probability calculation in real time as cards are revealed because there is nothing hidden. This is the only table where the conditional probability question — "given all the cards I can see, what is the probability my next revealed card beats the current leader?" — is public, checkable, and demonstrable in front of the whole table. The limitation of No Peek (no player agency, almost no strategic depth) is precisely what makes it pedagogically valuable as the first conditional probability environment: students are not distracted by strategy; they are focused entirely on the probability structure.

**Learning Objectives**

- Understand that seeing a card revealed changes what is left in the remaining deck
- Ask and answer: "Given the cards I can see, what is still possible?"
- Understand the conditioning event as a sample space reduction: the denominator changes when cards are removed
- Compute P(beat current leader | all cards currently visible) for simple cases

**Chief Dodo's Focus**: Making the conditioning visible and narrating it out loud. "Before that card flipped: 47 cards remaining, 9 of them beat the current leader. After it flipped and it wasn't one of those 9: still 9 that beat the leader, but now the denominator is 46 instead of 47. What changed? What didn't?" Chief Dodo can ask the whole table to solve the probability together — No Peek is the only table where this is possible.

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Maestro | Great Blue Heron | Anchoring — never updates probability estimate after cards are revealed | Assesses his starting position and never recomputes as cards flip. Because No Peek makes all cards public, students can observe Maestro's estimate staying frozen while the actual probability changes. |
| Rico | Sulfur-crested Cockatoo | Recency bias in visible cards | Over-weights the most recently flipped card; ignores the full set of what has been revealed |
| Vivian | Flamingo | Hot hand fallacy (continues) | |

**CCSS**: S-CP.A.3 (conditional probability — *introduced* informally here)

**Competency Gate**

- *Procedural*: Given a No Peek hand where 12 specific cards have been revealed, compute P(next card beats the current leader) with the correct numerator and reduced denominator
- *Conceptual*: Explain what specifically changes in the probability calculation when a new card is revealed and why; identify Maestro's error and name what he failed to update
- *Transfer*: Apply the same "remaining possible outcomes" reasoning to a non-card scenario involving sequential draws without replacement where the outcomes of earlier draws are known

---

### Table 3B — The Draw

**Variant**: Five Card Draw (draw mechanic: student holds four cards to a flush or straight, discards one, draws one replacement)

**Why this variant, not another**: The draw mechanic creates the simplest possible conditional probability scenario with private information: one conditioning event (the four cards in the student's hand), one reduced sample space (the remaining 47 cards), and one clear question (how many of those 47 complete the hand?). This is P(A|B) in its most literal form — "given that I hold these four specific cards, what is the probability the draw gives me the card I need?" Formal notation is introduced here for the first time. Unlike No Peek (fully public sample space), this is the first time the student is reasoning about private information — they alone know what they hold. This transition from public to private reasoning is the essential step toward Texas Hold'Em's full complexity.

**Learning Objectives**

- Identify the conditioning event (the four cards held) and the reduced sample space (remaining 47 cards)
- Compute P(completing flush) = 9/47, P(completing open-ended straight) = 8/47, and similar draws
- Write and interpret formal conditional probability notation: P(flush | holding four to a flush)
- Distinguish the numerator (favorable cards remaining) from the denominator (all cards remaining)
- Recognize this as a dependent compound event: the draw's probability depends on what was already dealt

**Chief Dodo's Focus**: "If you held different cards, would the denominator change? Would the numerator? Why?" This is the conceptual understanding check embedded in coaching before the formal gate. Chief Dodo is testing whether the student understands the formula or is applying a memorized procedure.

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Carlos | Keel-billed Toucan | Independence fallacy | Computes P(flush card) from the full 52-card deck rather than the reduced 47-card deck — treats the draw as if it were independent of what has already been dealt |
| Maestro | Great Blue Heron | Anchors on initial hand assessment (continues) | |
| Pharaoh | African Sacred Ibis | Counts only his own cards' contribution | First appearance; a preview of his deeper error — he ignores that what he discarded affects the remaining deck |

**CCSS**: S-CP.A.3 (conditional probability — **primary focus** for informal-to-formal bridge); S-CP.B.8 (Multiplication Rule for dependent events — *introduced*)

**Competency Gate**

- *Procedural*: Given "you hold the 4♠ 7♠ 9♠ J♠ and draw one card from the remaining 47," compute P(completing the flush); then compute P(completing an open-ended straight) with specific cards defined
- *Conceptual*: Explain why the denominator is 47 and not 52; explain exactly what mistake Carlos makes and what it represents mathematically; write the formal conditional notation P(flush | holding four spades)
- *Transfer*: Given a novel draw scenario — "you hold three of a kind and one unrelated card; you discard the unrelated card and draw one" — compute P(four of a kind) using the same reasoning

---

### Table 3C — The Flop Table

**Variant**: Texas Hold'Em (community card reveal as multi-stage conditional probability engine)

**Why this variant, not another**: Texas Hold'Em's three-stage community card reveal (flop → turn → river) creates the most pedagogically regular structure for multi-stage conditional probability in the variant set. Each stage is a discrete conditioning event with a fixed, predictable decrement: 47 cards unseen after the flop, 46 after the turn, resolved at the river. This regularity — always exactly three stages, a defined number of community cards at each — makes it easier to track probability updating than Seven Card Stud's variable-denominator structure (driven by however many opponent upcards have been dealt). Texas Hold'Em also carries cultural familiarity for many students, which Chief Dodo can use as a resource — naming concepts the student has seen intuitively while correcting systematic errors that prior informal exposure often introduces.

**Learning Objectives**

- Count outs: the number of remaining cards that improve the student's hand
- Compute and update probability estimates at each street: P(improving | flop shown), P(improving | turn shown)
- Apply the Rule of 2 and 4 as an approximation; explain when it is valid and when the exact calculation is needed
- Observe that information accumulates sequentially and probability estimates must update at each step

**Chief Dodo's Focus**: The Rule of 2 and 4 as a meta-mathematical lesson — "Here's a shortcut poker players use. Let's figure out exactly when it's good enough and when you need the precise number." This is Bloom's Apply → Evaluate in a single coaching exchange.

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Maestro | Great Blue Heron | Anchoring on pre-flop assessment | Evaluates hand strength before the flop and does not recompute when community cards land. In Hold'Em, this means ignoring the game's most significant information. |
| Carlos | Keel-billed Toucan | Independence fallacy (continues) | Still treating each community card as if it were drawn from the full 52-card deck |
| Pelican Pete | Brown Pelican | Outs miscounting | Double-counts outs by not removing cards already visible in the community — counts a card as an "out" when it is already face-up on the board |

**CCSS**: S-CP.A.3 (**applied** at multi-stage level); S-CP.B.8 (Multiplication Rule — *applied*)

**Competency Gate**

- *Procedural*: Given a specific Hold'Em hand with the flop shown, count the outs and compute P(improving on the turn); after the turn is revealed, recompute P(improving on the river)
- *Conceptual*: Explain why the probability estimate changes between the flop and the turn even when the outs count does not change; explain Pelican Pete's error using the specific board cards as evidence
- *Transfer*: Given a Hold'Em hand where an opponent's betting pattern allows an inference about their likely holding, explain qualitatively how that inference should update your probability estimate — informal range-narrowing that prepares for Phase 4

---

## Phase 4: Formal Conditional Probability, Independence & Expected Value

**Core concepts**: Formal P(A|B), independence, addition rule, dead card tracking, expected value, pot odds  
**Entry requirement**: Phase 3 gate passed  
**CCSS targeted**: S-CP.A.1–5, S-CP.B.6–8, S-MD.A.1–2, S-MD.B.5  
**Room**: The Back Room (deeper)

---

### Table 4A — The Stud Table

**Variant**: Seven Card Stud (dead card tracking as primary mechanic)

**Why this variant, not another**: Seven Card Stud is the only variant where the conditional probability calculation has a continuously-shrinking, publicly-observable denominator driven by how many opponent face-up cards have been dealt. In Texas Hold'Em, the community cards reduce the deck for all players equally — the denominator shrinks by a predictable 1 per street. In Stud, the rate of shrinkage depends on how many upcards have appeared, which varies from hand to hand. When a card the student needs appears as an opponent's face-up card, it is a dead card: the numerator drops and the denominator shrinks. The dead cards are literally on the table — the conditioning event is directly visible. No other variant creates this tracking challenge as concretely.

**Learning Objectives**

- Define dead cards: opponent face-up cards that are permanently removed from the remaining pool
- Compute the correct denominator as a function of all visible cards (not a fixed 47 or 46)
- Recompute P(needed card | all cards currently visible) as each opponent upcard is dealt
- Recognize that when a needed card appears as a dead card, both the numerator and denominator change
- Apply the Multiplication Rule for dependent events in a live-game context: P(two specific sequential cards) = P(first) × P(second | first dealt)

**Chief Dodo's Focus**: Making the tracking visible. Chief Dodo keeps a running count during the hand of which cards have appeared. "Three Aces showing across opponent hands. How many Aces were we hoping to find? How many are even left in the deck now?" This is the Multiplication Rule for dependent events made concrete: each dead card is a conditioning event.

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Pharaoh | African Sacred Ibis | Ignores dead cards; counts from the full deck | His primary table. Computes P(needed card) against the full 52-card pool, never adjusting for opponent upcards. His denominator is always wrong. |
| Maestro | Great Blue Heron | Anchoring (continues) | Does not recompute when opponents show new cards |
| Pelican Pete | Brown Pelican | Outs miscounting (continues) | Does not subtract dead cards from his out count |
| Grace | Great Egret | Addition Rule error | First appearance; appears here as a preview before her primary table at 4B |

**CCSS**: S-CP.A.3 (conditional probability — **advanced** application); S-CP.B.6 (conditional probability using context — **focus**); S-CP.B.8 (Multiplication Rule — **focus**)

**Competency Gate**

- *Procedural*: Given a Stud hand where 3 of the 4 Aces have appeared as opponent upcards and the student holds a pair of Kings hoping for a third, compute P(three Kings | visible cards) with the correct reduced denominator
- *Conceptual*: Explain why using 52 as the denominator is wrong in this context; explain what "dead card" means and how it affects both the numerator and denominator; identify the specific error in Pharaoh's calculation
- *Transfer*: Apply the same dead card reasoning to a Hold'Em scenario where an opponent's likely hole cards can be inferred — explain what changes when the conditioning information is inferred rather than directly observed

---

### Table 4B — The Range Table

**Variant**: Texas Hold'Em (hand ranges and two-way frequency tables)

**Why this variant, not another**: Texas Hold'Em is the right vehicle for formal independence and the Addition Rule because hand ranges — probability distributions over opponent hand combinations — are the natural poker context for both concepts. The Addition Rule error (adding overlapping probabilities without subtracting the intersection) occurs most naturally in Hold'Em when students add P(opponent has flush draw) + P(opponent has straight draw) without subtracting the overlap. Two-way frequency tables, which CCSS 8.SP.4 introduces as the visual precursor to conditional probability, map directly onto the frequency of starting hand combinations and board-texture outcomes in Hold'Em. The independence test — compare P(won) to P(won | had flush draw) — is directly readable from a two-way table of hand histories.

**Learning Objectives**

- Construct a two-way frequency table from a hand history dataset
- Use a two-way table to compute P(A|B) as (cell count) / (row total)
- Apply the Addition Rule correctly: P(A or B) = P(A) + P(B) − P(A and B)
- Define independence formally: P(A|B) = P(A); use a two-way table to test independence
- Apply set language: union, intersection, complement (S-CP.A.1)

**Chief Dodo's Focus**: The double-counting error — Grace's characteristic mistake. Chief Dodo can present Grace's recent calculation and ask: "She added those two probabilities together. Did she get a number bigger than 1? What does that tell you? If it can't be right, where did she go wrong?"

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Grace | Great Egret | Addition Rule error — double-counts overlapping probabilities | Her primary table. A subtle error that requires identifying that the events she is adding overlap in a specific subset of outcomes. |
| Maestro | Great Blue Heron | Anchoring (continues) | |
| Pharaoh | African Sacred Ibis | Ignores opponent information (continues) | |
| Hawk | Osprey | Resulting bias — judges decisions by outcome | First appearance; preview for 4C. Calls a -EV decision that happens to win and says he played it correctly. |

**CCSS**: S-CP.A.1 (events as subsets; union, intersection, complement — **focus**); S-CP.A.2 (independence: P(A and B) = P(A)·P(B) — **focus**); S-CP.A.4 (two-way frequency tables — **focus**); S-CP.A.5 (independence and conditional probability in everyday language — **focus**); S-CP.B.7 (Addition Rule — **focus**)

**Competency Gate**

- *Procedural*: Given a two-way frequency table of hand outcomes, compute P(won | had flush draw) and P(won); determine whether the events are independent; apply the Addition Rule to compute P(flush draw or straight draw) on a given board
- *Conceptual*: Explain Grace's error; identify which term she omitted from the Addition Rule and why it matters; explain what it means for two events to be independent and provide an example of two events that are independent and two that are not
- *Transfer*: Apply the independence test to a non-poker two-way table — a survey of students' study habits and test scores — and draw a conclusion about whether studying and passing are independent events

---

### Table 4C — The EV Table

**Variant**: Texas Hold'Em (full game with betting; pot odds as applied expected value)

**Why this variant, not another**: Texas Hold'Em's pot odds calculation is the cleanest natural expression of applied expected value in any card game. The comparison — the student's computed equity (probability of winning) vs. the pot odds (cost / (pot + cost)) — directly answers the question "is this call a positive expected value decision?" Hold'Em's defined betting structure creates well-formed decision points at each street: the student has a computed probability and a concrete bet to evaluate. No other variant makes the "translate a probability into a decision" link as explicit. This is the curriculum's central intellectual payoff: the pivot from probability computation to decision theory.

**Learning Objectives**

- Understand expected value as a weighted average: EV = Σ (outcome × P(outcome))
- Compute the EV of a simple discrete random variable with two or three outcomes
- Apply pot odds: compare P(winning) to the pot-odds ratio (cost / (pot + cost))
- Determine the break-even equity for a given bet size
- Evaluate decisions by expected value rather than by whether they worked out
- Articulate the difference between a correct decision and a correct outcome

**Chief Dodo's Focus**: The outcome vs. decision distinction. After Hawk makes a -EV call that happens to win, Chief Dodo asks: "Did Hawk make a good decision? What would happen if Hawk made that same call 1,000 times?" This is the law of large numbers applied to decision quality — and it is the single most transferable idea in the curriculum.

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Hawk | Osprey | Resulting bias — judges decisions by outcomes | His primary table. Makes -EV calls that sometimes win; makes +EV decisions that sometimes lose. Lesson: outcome and decision quality are orthogonal. |
| Grace | Great Egret | Double-counts, overestimates calling equity (continues) | |
| Carlos | Keel-billed Toucan | Independence fallacy — doesn't track cumulative EV (continues) | |
| The Professor | Common Raven | Rational EV reasoning | First appearance. At this table The Professor is another player whose decisions can be observed. Students begin recognizing his method without needing to beat him yet. |

**CCSS**: S-MD.A.1 (random variable and probability distribution — **focus**); S-MD.A.2 (expected value — **focus**); S-MD.B.5 (weigh outcomes using probabilities; evaluate decisions — **focus**); S-MD.B.6 (use probabilities to make fair decisions — *introduced*)

**Competency Gate**

- *Procedural*: Given a Hold'Em scenario with a defined pot size, bet size, and the student's computed equity, determine whether calling is +EV or -EV; compute the exact break-even equity for that pot-odds ratio
- *Conceptual*: Explain why Hawk's +EV decision that lost was still the correct decision; explain what would happen if Hawk repeated that same decision 1,000 times; explain what "expected value" means for a one-time decision when you cannot repeat it
- *Transfer*: Apply the EV framework to a non-poker decision — should you buy an extended warranty? Given: cost = $50, probability of failure in warranty period = 8%, average repair cost = $400. Compute the EV and make a recommendation.

---

## Phase 5: Capstone — Advanced Probabilistic Reasoning

**Core concepts**: Multi-street EV, law of total probability, combinatorics for altered sample spaces, deriving from first principles, wild card paradox (enrichment)  
**Entry requirement**: Phase 4 gate passed  
**CCSS targeted**: S-MD.A.2, S-MD.A.3, S-MD.B.5, S-MD.B.7, S-CP.B.9 (advanced)  
**Room**: The High Stakes Room

---

### Table 5A — The Full Board

**Variant**: Texas Hold'Em (multi-street EV; equity as a sum over all possible runouts)

**Why this variant, not another**: Multi-street expected value in Texas Hold'Em requires the law of total probability: EV = Σ P(runout k) × EV(outcome on runout k). This is the most mathematically complete expression of expected value — it requires conditional probability (the probability of different runouts), the Multiplication Rule (each runout probability involves sequential events), and the EV framework from Phase 4, combined into a single unified calculation. The three-street community card structure provides a concrete enumeration scaffold: the student can explicitly list possible turn and river combinations, compute the EV conditional on each, and sum them. This is the intended synthesis point of the full curriculum.

**Learning Objectives**

- Compute EV when the outcome probability depends on future community cards (equity as a sum over runouts)
- Apply the Law of Total Probability: P(A) = Σ P(A|B_k) × P(B_k)
- Distinguish short-run variance from long-run expected value in a multi-street context
- Understand why a correct call on the flop can become incorrect on the turn after an opponent's action changes the pot size (EV updates mid-hand)
- Recognize The Professor's reasoning process and replicate it: explicit EV calculation at each decision point

**Chief Dodo's Focus**: The Law of Total Probability — without naming it formally until the student has seen it in action. "We've been computing probability of completing the hand on the turn alone, or the river alone. What if we want to know: what's the probability we improve somewhere across both? We can't just add those numbers — they share outcomes. Here's how we account for that." This is Phase 3's conditional probability, Phase 4's EV, and Phase 2's compound events, woven together.

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Hawk | Osprey | Resulting bias (continues) | |
| Grace | Great Egret | Double-counts across streets (continues) | |
| Maestro | Great Blue Heron | Anchoring (continues) | |
| Stork | Marabou Stork | Single-street reasoning | First appearance. Correct on single-street EV, but cannot combine across streets — treats the turn and river as independent decisions rather than a joint calculation requiring the law of total probability. |
| The Professor | Common Raven | Rational EV reasoning | Competes head-to-head here. Beating The Professor requires matching his multi-street EV calculations. The goal at this table is not to find The Professor's error — it is to match his method. |

**CCSS**: S-MD.A.2 (expected value — **advanced** application); S-MD.B.5 (multi-street weighting — **advanced**); S-MD.B.7 (analyze decisions using probability — **focus**)

**Competency Gate**

- *Procedural*: Given a Hold'Em hand with specific equity on the flop and specific pot conditions, compute the EV of calling vs. folding accounting for both turn and river outcomes
- *Conceptual*: Explain why Stork's single-street EV calculation is insufficient; explain what the multi-street version accounts for that the single-street version misses; state the Law of Total Probability in plain language without notation
- *Transfer*: Apply the same multi-event EV framework to a non-poker decision tree — a business decision where profitability depends on two sequential uncertain outcomes (a market condition and a cost outcome). Set up the full EV calculation.

---

### Table 5B — The Pinochle Table

**Variant**: Pinochle Poker (48-card deck: two copies each of 9, 10, J, Q, K, A in four suits; no 2–8)

**Why this variant, not another**: Pinochle Poker is the most direct probe of conceptual understanding vs. procedural mimicry available in the variant set. The altered deck invalidates all memorized hand frequencies from standard poker — the sample space size is C(48,5), not C(52,5), and the presence of duplicate cards changes which hands are possible and how frequently they occur. A student who understands the classical probability model can re-derive hand frequencies from first principles. A student who memorized the standard frequencies will fail immediately. This is the Wroughton (2012, Journal of Statistics Education) recommendation implemented as a game table: the conceptual understanding test is built into the variant itself. You cannot pass this table by memory alone.

**Learning Objectives**

- Recognize that the standard hand probability table does not apply to a non-standard deck — and explain precisely why
- Compute C(48,5) as the correct total sample space for this deck
- Derive the count of specific hand types in the Pinochle deck (pairs, straights, and flushes all require re-analysis due to duplicate cards and missing low ranks)
- Compute P(hand type) = derived count / C(48,5)
- Articulate why the combinatorial logic transfers even when the numbers change

**Chief Dodo's Focus**: "The math didn't change. The deck changed. The math doesn't care what deck you're using — it cares about how many cards there are and how the rules define a hand. Let's re-derive." This framing — separating the mathematical structure from the specific numbers — is the deepest expression of Enduring Understanding 4.

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Brother | Southern Yellow-billed Hornbill | Procedural mimicry — applies memorized standard poker probabilities | His primary table. Uses the standard P(flush) = 0.00197 without checking whether it applies to this deck. Gets beaten because he is playing by the wrong model. |
| Stork | Marabou Stork | Can't adapt multi-street framework to the altered deck (continues) | |
| The Professor | Common Raven | Re-derives correctly | The Professor takes time before the first hand to check his counts for this deck. Students can observe the process and replicate it. |
| Hawk | Osprey | Resulting bias (continues) | |

**CCSS**: S-CP.B.9 (combinations — **advanced** application and transfer); S-MD.A.3 (develop probability distribution from derived data — **focus**)

**Competency Gate**

- *Procedural*: Compute C(48,5); compute the number of four-of-a-kind hands in the Pinochle deck (note: with duplicate cards, quads are more frequent than in standard poker); compute P(four of a kind) in the Pinochle deck
- *Conceptual*: Explain why Brother's standard probabilities are wrong — identify the specific assumption that breaks down; explain why the formula P = favorable/total still works in this context; explain why the mathematical principle is the same even though the numbers are different
- *Transfer*: For a hypothetical 60-card deck (one standard deck plus all face cards duplicated), set up — without completing — the calculation for P(full house) by identifying the correct total and the correct count structure

---

### Table 5C — The Baseball Table (Enrichment / Optional)

**Variant**: Baseball Poker (Seven Card Stud with wild cards: threes and nines wild; fours dealt face-up entitle the player to an additional face-up card)

**Why this variant, not another**: Baseball is the only variant in the set that produces the Gadbois Wild Card Paradox — a genuine mathematical contradiction that arises from the intuitively-reasonable premise that hand rankings should reflect rarity. The paradox: with wild cards in play, three-of-a-kind becomes more probable than two pair (because rational players use wilds to create three-of-a-kind). If rankings reflect rarity, three-of-a-kind should therefore be ranked below two pair. But if three-of-a-kind ranks below two pair, rational players will use their wilds to create two pair instead — making three-of-a-kind rarer again, invalidating the original ranking reversal. The ranking assumption changes the distribution, which invalidates the assumption. This cannot be resolved. It is a genuine logical paradox suitable for advanced mathematical discussion, and it is Phase 5 enrichment material precisely because encountering it before the standard probability hierarchy is solid produces confusion rather than insight.

**Learning Objectives**

- Analyze how wild cards restructure the sample space and hand frequency distribution
- Compute the expected number of wild cards dealt: X ~ Hypergeometric(N=52, K=8, n=7), with E[X] = 7 × 8/52 ≈ 1.08
- Articulate the Gadbois Paradox: explain why consistent ranking by rarity is logically impossible when wild cards are present
- Understand that probability rankings are model-dependent, not mathematical absolutes — the standard ranking is correct under the standard rules, not universally
- Connect this to the broader principle: mathematical models are constructed, not discovered

**Chief Dodo's Focus**: The philosophical payoff of the whole curriculum. "You've been playing poker this whole time assuming the hand rankings are just how it is. But look — it turns out they're only 'how it is' as long as we all agree on the rules. Change the rules, change the math. And here's a case where the rules make the math break. What does that tell you about all models?"

**NPCs**

| NPC | Bird | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- |
| Brother | Southern Yellow-billed Hornbill | Applies standard rankings to wild card probabilities | Fails dramatically when the standard hierarchy stops applying |
| Stork | Marabou Stork | Single-frame reasoning — doesn't see the paradox structure | Treats each calculation in isolation; cannot follow the circular logic of the paradox |
| Pharaoh | African Sacred Ibis | Ignores wild card implications when counting (continues) | |
| The Professor | Common Raven | Correctly identifies the paradox | At this table The Professor explicitly names the paradox if the student hasn't gotten there first. Hearing it from a game character rather than a tutorial gives it weight. |

**CCSS**: No direct CCSS standard for the wild card paradox — this is enrichment beyond the S-MD scope. Relevant to S-MD.B.7 (analyze decisions) and to mathematical modeling literacy beyond the standards.

**Competency Gate** (enrichment credit — not required to complete the curriculum)

- *Conceptual*: Explain in three to four sentences why the wild card paradox makes self-consistent ranking by rarity logically impossible when wilds are present — use three-of-a-kind and two pair as the specific example
- *Transfer*: Identify a real-world context where changing the rules of a system changes the behavior of rational actors in a way that invalidates the original ranking or assumption (any defensible example accepted — this is a philosophical transfer, not a calculation)

---

## NPC Roster

| NPC | Bird | Phases | Tables | Reasoning Pattern | Flaw / Lesson |
| --- | --- | --- | --- | --- | --- |
| Hank | California Condor | 1 | 1A, 1B | Always bets, never folds | Complete disregard for probability — shows what purely action-driven play looks like |
| Lucky | Rock Pigeon | 1–2 | 1B, 2A, 2B | Gambler's fallacy | After losses: "I'm due." Believes losing streaks make future wins more probable. |
| Vivian | Flamingo | 1–3 | 1B, 2A, 2B, 2C, 3A | Hot hand fallacy | Recent wins make her bet larger. Mirror image of gambler's fallacy — opposite sign, same structure. |
| Rico | Sulfur-crested Cockatoo | 2–3 | 2B, 2C, 3A, 3B | Base rate neglect + recency bias | Only attends to what just happened; ignores long-run base rates entirely |
| Maestro | Great Blue Heron | 2–5 | 2C, 3A, 3B, 3C, 4A, 4B, 5A | Anchoring — never updates | Assesses initial hand strength; does not revise as new information appears. Appears across the most tables of any NPC. |
| Carlos | Keel-billed Toucan | 2–4 | 2B, 3B, 3C, 4C | Independence fallacy | Treats every card draw as independent of what has already been dealt; always uses the wrong denominator |
| Pelican Pete | Brown Pelican | 3–4 | 3C, 4A | Outs miscounting | Double-counts outs by not removing cards already visible on the board or in opponent upcards |
| Pharaoh | African Sacred Ibis | 3–5 | 3B, 4A, 5B, 5C | Ignores dead cards / opponent information | Counts from the full deck; never adjusts denominator for opponent-visible cards |
| Grace | Great Egret | 4–5 | 4A, 4B, 4C, 5A | Addition Rule error | Double-counts probability of overlapping events: P(A or B) = P(A) + P(B) without subtracting P(A and B) |
| Hawk | Osprey | 4–5 | 4B, 4C, 5A, 5B | Resulting bias | Judges decisions by outcomes. A bad call that won was a "good call." Confuses outcome quality with decision quality. |
| Stork | Marabou Stork | 5 | 5A, 5B, 5C | Single-street reasoning | Correct EV on individual streets; cannot combine across streets or handle multi-step probability calculations |
| Brother | Southern Yellow-billed Hornbill | 5 | 5B, 5C | Procedural mimicry | Applies memorized values from standard poker to non-standard contexts; cannot re-derive from first principles |
| The Professor | Common Raven | 4–5 | 4C, 5A, 5B, 5C | Rational EV reasoning — correct | The model of correct probabilistic thinking. The goal at 4C is to recognize his method; at 5A–5B, to match it. |

---

## CCSS Alignment

CCSS is a reference map, not the curriculum driver. Every table connects to at least one standard, but the sequence is designed for coherent learning, not standards compliance.

| Standard | Description | Table(s) |
| --- | --- | --- |
| 7.SP.C.5 | Probability as a number between 0 and 1 | 1A (intro), 2A (focus) |
| 7.SP.C.6 | Approximate probability through repeated experiments; long-run frequency | 1B |
| 7.SP.C.7a | Uniform probability model | 2A |
| 7.SP.C.7b | Non-uniform probability model; observed frequencies | 1B, Surveillance Room |
| 7.SP.C.8a | Compound event probability; organized lists, tables, tree diagrams | 2B |
| 7.SP.C.8b | Sample spaces for compound events | 2B |
| 7.SP.C.8c | Simulation to estimate probabilities of compound events | 1B, Surveillance Room |
| S-CP.A.1 | Events as subsets of a sample space; union, intersection, complement | 4B |
| S-CP.A.2 | Independence: P(A and B) = P(A)·P(B) | 4B |
| S-CP.A.3 | Conditional probability; interpret in context | 3A (intro), 3B (focus), 3C, 4A (advanced) |
| S-CP.A.4 | Two-way frequency tables | 4B |
| S-CP.A.5 | Independence and conditional probability in everyday language | 4B |
| S-CP.B.6 | Find conditional probability using two-way tables or tree diagrams | 3A, 4A |
| S-CP.B.7 | Addition Rule: P(A or B) = P(A) + P(B) – P(A and B) | 4B |
| S-CP.B.8 | Multiplication Rule: P(A and B) = P(A)·P(B\|A) | 3B (intro), 4A (focus) |
| S-CP.B.9 | Permutations and combinations to compute probabilities | 2C (focus), 5B (advanced) |
| S-MD.A.1 | Random variable; graph its probability distribution | 4C |
| S-MD.A.2 | Expected value; interpret in context | 4C (focus), 5A (advanced) |
| S-MD.A.3 | Probability distribution from empirical or derived data | 5B |
| S-MD.B.5 | Weigh outcomes using probabilities; expected value; evaluate decisions | 4C, 5A |
| S-MD.B.6 | Use probabilities to make fair decisions | 4C (intro) |
| S-MD.B.7 | Analyze decisions using probability concepts | 5A, 5C (enrichment) |
