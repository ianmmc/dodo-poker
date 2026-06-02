# Research Report: Scope & Sequence Design for dodo-poker

---

## 1. What Is a Scope and Sequence and How Should It Be Designed?

A scope and sequence is a curriculum blueprint that answers two distinct questions simultaneously: what will be taught (scope) and in what order (sequence). For dodo-poker, this means defining the full set of probability and statistics concepts the game will develop, then arranging them in a pedagogically defensible order where each table builds directly on what students demonstrated at prior tables.

The critical distinction to internalize before design begins is that a scope and sequence is a planning document representing intended instruction. It is not a pacing guide (which adds a calendar dimension and is driven by external time constraints) and not a curriculum map (which tracks what is actually delivered). dodo-poker needs all three eventually — the scope and sequence as the design foundation, a curriculum map as the implementation record, and something analogous to a pacing guide for estimating how long competency gates typically take students to pass. Conflating them early leads to a sequence that is actually a pacing guide masquerading as design, which is one of the most common curriculum failures.

**Backward design is the right design methodology here.** Wiggins and McTighe's Understanding by Design framework reverses the usual planning sequence. Rather than asking "what poker concepts are interesting?" and then building tables around them, the design team should ask Stage 1: what should students understand and be able to do by the end of the game? Then Stage 2: what evidence would prove they understand it? Then Stage 3: what sequence of game experiences builds toward that? This matters for dodo-poker because it prevents the game from being organized around poker variant novelty rather than mathematical learning. A variant like Baseball Poker is fascinating — but the question is not whether it is fun, it is whether it builds toward the enduring understandings defined in Stage 1.

For a probability and statistics curriculum in grades 6-12, the enduring understandings worth anchoring the whole scope and sequence to include:

- Probability quantifies uncertainty; it is not intuition, but it can be computed precisely from a defined sample space.
- When information changes, probability must be updated — conditioning on evidence is the fundamental operation of probabilistic reasoning.
- Statistical decisions should be grounded in expected value, not just gut feeling about outcomes.
- The same mathematical structure (counting, proportions, distributions) applies across wildly different real-world contexts.

These enduring understandings should appear in Chief Dodo's coaching language at every table and serve as the connective tissue across the game.

**The most actionable best practices for the design session:**

Start by mapping prerequisites explicitly. Every concept in the game should have a documented answer to the question "what must students already understand to access this?" Build a directed graph — nodes are concepts, edges are dependencies — before assigning variants to tables. This graph is the scope; the sequence emerges from reading the topological sort of that graph.

Prioritize depth over breadth. Beyer's research on thinking skills applies: a scope and sequence attempting to cover every probability concept produces surface-level exposure to all of them. For a game with competency gates, this is particularly dangerous — shallow coverage cannot support mastery thresholds. Select fewer concepts and teach each to transfer.

Plan for spiraling explicitly. The same concept should appear at multiple tables at increasing sophistication. Sample space, for example, should appear in the earliest tables as concrete enumeration (list the outcomes), return at a middle table as combinatorial calculation (count the outcomes using C(n,r)), and appear again at an advanced table as the foundation for conditional probability (how does conditioning shrink the space). The scope and sequence document should explicitly mark where a concept is introduced, where it is the primary focus, and where it recurs as a tool for new learning.

Treat the scope and sequence as a living system. The first version is a design hypothesis. After students play through early tables, game analytics should feed back into the sequence — if students are consistently failing a particular gate, the prerequisite map was wrong somewhere upstream.

**The single most common pitfall for game-based curriculum design** is organizing content by game variant rather than by mathematical learning progression. The temptation is to say "Five Card Draw table teaches combinatorics, Texas Hold 'Em table teaches expected value." The problem is that this is variant-first design rather than concept-first design. The correct approach is to identify the mathematical concept sequence first, then ask which variant best exposes each concept at that level of the progression. Multiple tables can and should use the same variant; a variant is a vehicle, not a destination.

---

## 2. Mathematics Scope and Sequence: Special Considerations

Mathematics has a structural property that distinguishes it from most other disciplines: strict prerequisite dependency. You cannot understand conditional probability without first understanding what a probability value represents. You cannot compute expected value without understanding both probability and multiplication. These dependencies are not pedagogical preferences — they are logical constraints. A student who has not internalized the concept of equally likely outcomes will not be able to reason correctly about any probability computation built on that foundation, regardless of how many times the formula is shown.

**The five strands of mathematical proficiency** (NRC, Adding It Up, 2001) are the most important framework for understanding what mastery actually means in mathematics. The strands are: conceptual understanding (knowing why), procedural fluency (knowing how), strategic competence (knowing when and how to formulate a problem), adaptive reasoning (being able to justify and explain), and productive disposition (believing math makes sense and is worthwhile). These develop as a braided rope — not sequentially, not independently. A curriculum that sequences for procedural fluency first and conceptual understanding later gets this wrong. A curriculum that teaches concept without fluency leaves students unable to compute. For dodo-poker specifically, this means every table should address both conceptual understanding and procedural fluency in the probability concepts it covers, and the competency gate must test both.

**The procedural/conceptual distinction is the most critical sequencing issue in mathematics.** Research consistently demonstrates that students can execute algorithms correctly while remaining unable to explain what the algorithm computes or when it applies. In the poker context: a student may correctly compute 9/47 for a flush draw completion without understanding why 47 is the denominator, why 9 is the numerator, or why this calculation gives the probability of a single event rather than a guarantee. That student would fail to generalize to any new situation. Because dodo-poker's progression is competency-gated, surface procedural performance will look like mastery without actually being mastery. Gate design must directly address this (see Section 5).

**Bloom's Taxonomy applied to probability** gives the design team a principled framework for sequencing objectives within and across tables. Applied concretely:

- Remember: Recall that probability is a number between 0 and 1
- Understand: Explain why a flush draw has roughly a 20% chance on a single card
- Apply: Calculate the probability of completing a specific draw
- Analyze: Identify why a student's incorrect probability calculation fails
- Evaluate: Judge whether calling a bet has positive or negative expected value given pot odds
- Create: Design a novel probability problem using poker mechanics

The important implication for sequencing is that lower Bloom's levels gate higher ones within a concept, but higher Bloom's thinking should appear from early in the game — not only after all lower-level work is complete. Students should be analyzing and evaluating (in informal ways) even when their conceptual toolkit is still basic. Chief Dodo's coaching should be prompting this kind of reasoning at every table.

**Spiral vs. linear progression:** For probability and statistics, a spiral design is both research-supported and practically necessary. Children's probabilistic thinking develops in stages (Piaget, Jones et al.) that cannot be shortcut by direct instruction. A 7th grader encountering conditional probability for the first time cannot simply be told the formula and move on. The concept must be encountered informally, then revisited at a more formal level, then applied in complex contexts. dodo-poker's multi-table structure is an ideal vehicle for spiral design — but only if the design team explicitly plans the spiral rather than assuming that more complex tables will naturally reinforce earlier learning.

**Learning trajectories (Daro, Mosher, Corcoran, 2011) and the CCSS progressions documents** are the most useful external references for building the prerequisite graph. They provide an empirically grounded answer to the question "in what order do students actually develop these ideas?" The CCSS Coherence Map (achievethecore.org) visualizes prerequisite relationships between specific standards and is directly usable for building the dodo-poker concept dependency graph. Designers should not rely on intuition alone to establish prerequisite relationships — this is where most curriculum design errors originate.

---

## 3. Research-Based Sequencing for Probability and Statistics

The research literature converges on a clear informal-to-formal progression. The following ordering is grounded in Piaget and Inhelder (1951), Fischbein (1975), Jones et al. (1997, 2000), NCTM (2000), GAISE (2007, 2020), and CCSS (2010). It is strong evidence, not speculation.

**The fundamental developmental constraint:** Systematic understanding of probability does not appear reliably before ages 9-12. Before that, children cannot consistently distinguish certainty from uncertainty. This sets a hard lower boundary on what is accessible to 6th graders at the start of the game. Even within the 6-12 grade range, students enter with pre-instructional intuitions (Fischbein's "primary intuitions") — the gambler's fallacy, the representativeness heuristic, the belief that more tries guarantee a certain outcome — that are persistent and resistant to direct correction. The curriculum must actively surface and confront these intuitions rather than ignoring them. Chief Dodo's coaching is the right mechanism for this.

**Stage 1: Qualitative and Experimental Foundation (appropriate for grades 6-7 entry, GAISE Level A/B transition)**

At this stage, the goal is building a correct intuition about what probability means before any numbers are assigned. The core ideas are:

- Some outcomes are more likely than others, and this can be estimated by conducting many trials (frequentist foundation)
- Probability is a property of a random process, not a guarantee about any single outcome
- The sample space is the set of all possible outcomes; listing it completely is the first step in any probability calculation
- Results of repeated trials converge toward the true probability (Law of Large Numbers, conceptually — no formula yet)

The GAISE framework is explicit that probability numbers should not be introduced until the experimental foundation is in place. Students who skip this stage and encounter probability fractions first tend to treat them as facts to be memorized rather than models of uncertainty.

**Stage 2: Theoretical Probability and Simple Compound Events (grades 6-8, GAISE Level B, CCSS 7.SP)**

This is where formal probability as a number 0-1 is introduced and connected to fraction understanding. The key concepts in order:

1. Probability as a fraction: favorable outcomes / total equally likely outcomes (classical probability model)
2. Sample space enumeration: listing all outcomes for one-stage experiments, then using organized lists and tree diagrams for two-stage experiments
3. Complementary events: P(not A) = 1 - P(A) — this is typically the first compound event concept because it requires only one probability value
4. Mutually exclusive events: P(A or B) = P(A) + P(B) when A and B cannot both happen — simpler than the general addition rule
5. Independent compound events: P(A and B) = P(A) x P(B) — multiplication rule for independent events
6. Experimental vs. theoretical probability: why they differ and how they converge

The CCSS places formal probability squarely in Grade 7 (7.SP.C.5-8), which aligns with the developmental research. Students at Grade 6 entry to dodo-poker may not have this foundation yet. The early tables should not assume it.

**Stage 3: Conditional Probability and Dependence (grades 8-10, GAISE Level B/C transition)**

This is the most conceptually demanding stage and the one most likely to be taught too early in a game-based curriculum. The research is unambiguous: conditional probability emerges last in students' probabilistic thinking development (Jones et al., 1997). Prerequisites that must be firmly in place:

- The concept of sample space
- Fraction/ratio reasoning
- Basic compound event probability (stages 1 and 2)
- Two-way table reading (CCSS 8.SP.4 introduces two-way tables, providing the visual precursor to conditional probability)

Once prerequisites are in place, the sequence within conditional probability is:

1. Informal: "Given that we know X happened, how does that change the probability of Y?" — using concrete physical situations before notation
2. Two-way tables as the visual calculation tool: P(A|B) as reading a cell / row total
3. Tree diagrams with conditional branches (probability changes at each branch based on what happened earlier)
4. Formal notation: P(A|B) = P(A and B) / P(B)
5. Independence formally defined: P(A|B) = P(A) — knowing B happened tells you nothing about A
6. General Multiplication Rule for dependent events: P(A and B) = P(A) x P(B|A)

**Stage 4: Expected Value and Decision-Making (grades 9-12, GAISE Level C, CCSS HSS-MD)**

Expected value is the bridge from probability to decision-making under uncertainty. This is the capstone concept for a poker-based curriculum. Prerequisites:

- Solid understanding of probability for both simple and compound events
- Multiplication and addition of fractions/decimals
- Basic understanding of what a weighted average is

The concept ordering:

1. Weighted average as the concrete precursor (before the formal EV definition)
2. EV of a simple discrete random variable: EV = sum of (outcome x probability of outcome)
3. Positive vs. negative expected value: what it means for long-run decision-making
4. Pot odds as the applied EV calculation: connecting a probability to a monetary decision
5. EV with conditional probabilities embedded (equity in poker): requires summing across possible runouts

**Stage 5: Counting Principles and Advanced Combinatorics (can be introduced earlier or later depending on context)**

Permutations and combinations are placed in CCSS at the high school level (HSS-CP.B), but simple combinatorial reasoning (how many ways can X happen?) is accessible earlier and is essential for computing hand probabilities. The practical sequencing recommendation for dodo-poker:

- Introduce the fundamental counting principle concretely (early tables, using small examples)
- Introduce combinations C(n,r) without the formula first, using organized counting
- Introduce the formula and notation at the point where hand probability calculations require it
- Reserve permutations for later tables where order matters (specific card sequences)

**What the GAISE framework adds specifically for a game-based curriculum:**

GAISE Level B recommends simulation as a bridge between experimental and theoretical probability. dodo-poker is naturally a simulation engine — students are running repeated trials. The curriculum should explicitly direct students to compare their observed frequencies to the theoretical probabilities they calculate. This is not just good pedagogy; it directly builds the intuition for the Law of Large Numbers that underlies statistical inference at Level C.

GAISE II (2020) adds data ethics and data science literacy starting at Level A. For dodo-poker, this suggests that even early tables could include discussions of what probability means in terms of fairness, house edge, and informed decision-making — connecting mathematics to the real-world context the game simulates.

**Summary ordering table for designers:**

| Curriculum Phase | Core Probability Concepts | Approx. Grade Level | GAISE Level |
|---|---|---|---|
| Phase 1 (Entry) | Sample space, likelihood language, experimental probability, LLN intuition | 6-7 | A/B |
| Phase 2 (Foundation) | Classical probability (fractions), complementary events, simple compound events, tree diagrams | 7-8 | B |
| Phase 3 (Intermediate) | Conditional probability (informal), two-way tables, dependent compound events, multiplication rule | 8-9 | B/C |
| Phase 4 (Advanced) | Formal conditional probability notation, independence, general multiplication rule, addition rule | 9-11 | C |
| Phase 5 (Capstone) | Expected value, pot odds as applied EV, combinatorics for large sample spaces, decision-making under uncertainty | 10-12 | C |

---

## 4. Poker Variants as Instructional Vehicles: A Mathematical Analysis

### Five Card Draw

**Rules:** Each player is dealt five cards face-down. A betting round occurs, then each player may discard any number of cards and draw replacements from the remaining deck. A second betting round follows showdown. No community cards; all cards are private.

**Mathematical concepts uniquely exposed:** Five Card Draw is the purest vehicle for the classical probability model — a finite, uniform sample space (C(52,5) = 2,598,960 equally likely hands) where every probability is computed as (favorable outcomes)/(total outcomes). No sequential information, no opponent-visible cards, no conditional updating required. The hand probabilities are computable directly from combinations, which makes this the textbook choice for introducing C(n,r) in a poker context. The draw mechanic adds a first, simple conditional probability: given a player holds four cards to a flush, the 47-card reduced deck contains exactly 9 remaining flush cards, so P(completing flush) = 9/47. This is Bayesian updating in its simplest form — one conditioning event, one fraction to recompute.

The hypergeometric distribution governs draw outcomes (drawing without replacement from a known pool), creating a natural contrast with the binomial distribution and a teaching opportunity for when each model applies.

**Appropriate level:** Phase 1-2 (grades 6-8). Best for introducing sample space, combinations, and the classical probability model before any sequential reasoning is needed.

**What it does better than other variants:** No other variant gives a cleaner, direct demonstration of the classical probability model. The sample space is well-defined, finite, and uniform. Every hand probability is a combinatorics problem. This is why Five Card Draw appears in virtually every introductory probability textbook. For first-time learners, the absence of sequential information is a feature, not a limitation.

**Limitations:** Five Card Draw is limited as a teaching vehicle beyond Phase 2 because it does not model sequential Bayesian updating, does not expose expected value calculations in a natural way, and does not involve the interaction between public and private information that characterizes more complex probabilistic reasoning. Students who progress to Phase 3 need a different variant.

---

### Texas Hold 'Em

**Rules:** Each player receives two private hole cards. Five community cards are revealed in three stages: three at once (the flop), one (the turn), one (the river). The best five-card hand using any combination of the seven available cards wins. Betting occurs before the flop, after the flop, after the turn, and after the river.

**Mathematical concepts uniquely exposed:** Texas Hold 'Em is the richest instructional vehicle in the set for Phases 3-5. Its pedagogical advantages:

The three-stage community card reveal (flop/turn/river) creates a clean, regular structure for teaching multi-stage Bayesian updating. Each stage is a discrete conditioning event. After the flop, 47 cards are unseen; after the turn, 46. Students can compute probabilities at each stage and observe how each reveal updates the calculation. This structure is more regular and pedagogically cleaner than Seven Card Stud's variable-denominator problem, making it the preferred vehicle for introducing sequential conditional probability.

Pot odds are the most powerful applied probability concept in the game. The formula — compare P(win) to cost/(pot + cost) — directly connects probability to decision-making under uncertainty. This is not a contrived application; it is how professional poker players make every call decision. For students, the pot odds calculation makes expected value concrete: a hand with 35% equity in a pot offering 20% pot odds is a profitable call. This is the ideal bridge from probability computation to decision theory.

The "Rule of 2 and 4" (multiply outs by 4 after flop, by 2 after turn for approximate completion percentage) provides a natural lesson on when approximations are valid versus when exact calculation is required — a meta-mathematical concept with broad applicability.

Combinatorics at multiple levels: 1,326 starting hand combinations, 19,600 possible flops after two cards are known, blocker effects (if you hold the Ace of spades, the probability an opponent holds a hand containing it drops to zero), and equity as a sum across all possible runouts (law of total probability in action).

**Appropriate level:** Phase 3-5 (grades 8-12). The three-stage structure is accessible at Phase 3 for informal conditional probability. Pot odds and full EV calculations are appropriate for Phase 4-5.

**What it does better than other variants:** Texas Hold 'Em is the best variant for teaching the connection between probability and decision-making (expected value, pot odds). No other variant makes the "translate a probability into an action" link as explicit and natural. The regular three-stage structure also makes it the cleanest vehicle for multi-stage Bayesian updating — cleaner than Stud's variable number of streets.

**Limitations:** Texas Hold 'Em's community card structure means some combinatorial concepts unique to fully private card games (like the hypergeometric draw calculation in Five Card Draw) are not as naturally surfaced. For pure introductory probability, it is more complex than needed. Students should not encounter Texas Hold 'Em tables before they have the Phase 1-2 foundation.

---

### Seven Card Stud

**Rules:** No community cards. Each player is dealt two private hole cards and four face-up cards across four streets (Third through Sixth), plus a final private card (Seventh Street). The best five-card hand from the seven wins. Opponent face-up cards are visible to all players throughout the hand.

**Mathematical concepts uniquely exposed:** Seven Card Stud is the premier variant for teaching sequential Bayesian updating with a continuously shrinking, publicly observable sample space. In an eight-player game, up to 32 cards may be visible by Seventh Street. Every visible card is a dead card — permanently eliminated from the remaining sample space. A player tracking dead cards is computing P(needed card | all cards seen so far), updating the denominator continuously.

This creates the most concrete classroom demonstration of conditional probability in action: the denominator is not a fixed 47 or 46 as in Texas Hold 'Em, but a continuously shrinking variable driven by how many opponent upcards have been dealt. A student who needs one of four Aces, but can see that two Aces have appeared as opponent upcards, updates their calculation from 4/52 to 2/40 to 1/31 as the hand progresses.

The combinatorics of best-hand selection — C(7,5) = 21 ways to choose a five-card hand from seven — is embedded naturally in the game.

**Appropriate level:** Phase 3-4 (grades 8-10). The variable denominator and continuous updating make this harder than Texas Hold 'Em's discrete three-stage structure. Seven Card Stud should follow after Texas Hold 'Em's conditional probability introduction, not precede it.

**What it does better than other variants:** No other variant exposes dead card tracking as directly and continuously as Seven Card Stud. For teaching "probability is relative to information, not absolute," Stud is unmatched. The explicit public visibility of opponent cards makes the conditioning event concrete and visible in a way that Texas Hold 'Em's hidden hole cards do not.

**Limitations:** Seven Card Stud is rarely played today, which means students are less likely to have prior familiarity. The variable denominator (shrinking unpredictably as opponent cards appear) is more computationally demanding than Hold 'Em's regular three-stage structure. This is a variant to use after conditional probability is established, not to introduce it. It is also not ideal for expected value calculations since the bet-sizing dynamics are less cleanly connected to probability than Hold 'Em's pot odds.

---

### Baseball Poker

**Rules:** Played as Seven Card Stud with wild cards: threes and nines are wild (count as any card, including creating five of a kind), and fours dealt face-up entitle the player to an additional face-up card immediately. Because players may receive 8 or more cards, the game supports only about six players before risk of running out of cards. Night Baseball applies these rules with all cards dealt face-down and revealed one at a time.

**Mathematical concepts uniquely exposed:** Baseball is the most mathematically unusual variant in the set because it breaks the standard probability model in instructive ways.

Wild cards fundamentally restructure the sample space. With 8 wild cards (all fours and nines) in the deck, five of a kind becomes possible and becomes the highest-ranked hand. All standard hand frequencies change — some become more common, some less. This forces students to abandon memorized probability values and re-derive hand frequencies from scratch for the altered deck. This is exactly what the Pinochle Poker research (Wroughton, 2012, JSE) identifies as pedagogically powerful: forcing re-derivation from first principles reveals whether students understand the combinatorics or merely memorized results.

The wild card paradox (Gadbois Paradox) is a profound and rare case of a genuine mathematical contradiction arising from an intuitively reasonable premise. With even one wild card, it is impossible to construct a hand ranking system based on rarity that is self-consistent. Three of a kind becomes more common than two pair when wilds are in play, yet ranking three of a kind above two pair (because it was rarer without wilds) causes players to always use their wild as a third-of-a-kind rather than a pair-upgrade — making three of a kind even more common and two pair rarer, invalidating the ranking that assumed three of a kind was rare. This is a genuine logical paradox suitable for advanced classroom discussion.

The hypergeometric distribution governs the expected number of wilds a player receives: X ~ Hypergeometric(N=52, K=8, n=7), with E[X] = 7 x 8/52 approximately 1.08. This is a concrete, computable expectation problem.

Variable hand size from the four-gives-extra-card rule exposes combinatorial scaling: C(9,5) = 126 versus C(7,5) = 21, making the explosion of combinatorial complexity tangible.

**Appropriate level:** Phase 4-5 (grades 10-12) for the wild card paradox and hypergeometric distribution. The altered sample space problem is accessible earlier (Phase 3) as a conceptual exercise.

**What it does better than other variants:** Baseball is the only variant that exposes the wild card paradox, which is a uniquely powerful demonstration that probability rankings are not universal truths but depend on the rules of the probability model. No other variant in the set creates this instructional opportunity. It is also the best vehicle for demonstrating that intuitive probability rankings can fail — a critical lesson for statistical reasoning.

**Limitations:** Baseball's complexity (wild cards plus variable hand size plus the Night Baseball no-peek mechanic if combined) makes it too complex for early tables. The paradox requires students who already understand the standard probability hierarchy well enough to recognize when it breaks. This is strictly a late-game variant. The game also accommodates fewer players, which has game design implications for the number of seats at a Baseball table.

---

### No Peek (and Night Baseball)

**Rules:** All seven cards are dealt face-down and players may not look at their own cards. Starting with the player to the dealer's left, each player flips their top card face-up. If their visible card(s) produce a hand that beats the current best showing, play advances; otherwise they keep flipping cards until they beat the current leader or exhaust their hand and are eliminated. Night Baseball applies Baseball's wild card rules (threes and nines wild, fours give extra cards) to this format.

**Mathematical concepts uniquely exposed:** No Peek is unique in the variant set because it is the only game where players have zero private information about their own hand. All probability is public, visible, and shared. This makes it an ideal vehicle for a specific pedagogical goal: demonstrating probability reasoning in a fully transparent, visible sample space before introducing the complications of private information.

The core calculation — given the current best visible hand, what is the probability my next card beats or ties it? — is pure conditional probability with a fully observable, shrinking sample space. Every conditioning event is visible to every player simultaneously, making the probability calculation something that can be done collectively and transparently.

Order statistics emerge naturally: the relevant random variable is the maximum rank among a subset of revealed cards. What is the expected maximum rank among 3 draws from a 52-card deck? This is a probability concept typically encountered at the undergraduate level, but No Peek makes it concrete.

The game also provides a natural contrast to Texas Hold 'Em and Seven Card Stud, enabling a structured discussion of the information spectrum: chess (perfect information), No Peek (public probability, no private information), Texas Hold 'Em (partial private information), and sealed-envelope betting (full private information). This spectrum is a gateway to game theory and decision theory at the advanced level.

**Appropriate level:** Phase 2-3 (grades 7-9) for the conditional probability with visible sample space; Phase 4-5 for the order statistics discussion and information theory framing.

**What it does better than other variants:** No Peek is the only variant where the sample space is fully public, making it uniquely valuable for group problem-solving and transparent probability demonstration. Chief Dodo can narrate the probability calculation out loud for the entire table because there are no private cards to protect. This makes it excellent for introducing conditional probability in a low-stakes, fully transparent context before moving to variants with private information.

**Limitations:** No Peek has limited strategic depth — there is essentially nothing a player can do to affect outcomes, since they cannot see their own cards. This reduces engagement over extended play and makes it unsuitable as a primary vehicle for expected value and decision-making lessons. It is best used as an instructional demonstration variant rather than a sustained game format.

---

### Omaha Hold 'Em (recommended addition)

**Rules:** Each player receives four private hole cards. Five community cards are revealed in the same three-stage structure as Texas Hold 'Em. Critically, players must use exactly two hole cards and exactly three community cards to form their best hand — no flexibility.

**Mathematical concepts uniquely exposed:** The "exactly two from four" rule is a constrained selection problem that dramatically changes the combinatorics. In Texas Hold 'Em, any combination of hole and community cards is valid, yielding C(7,5) = 21 candidate hands. In Omaha, the player must choose exactly C(4,2) = 6 possible hole card pairs and exactly C(5,3) = 10 possible community card triplets, yielding 60 candidate hand combinations (but actually fewer because of constraint interactions). This constrained combinatorics problem is ideal for teaching that small rule changes have large effects on the probability space — a transferable mathematical insight.

**Appropriate level:** Phase 4-5 (grades 10-12). Best introduced after Texas Hold 'Em so students can make the direct comparison. The constrained selection problem requires solid combinatorics foundation.

---

### Pinochle Poker (recommended addition, as classroom activity)

**Rules:** Played with a Pinochle deck — 48 cards consisting of two copies each of 9, 10, J, Q, K, A in four suits. No 2-8s; no single copies of each card.

**Mathematical concepts uniquely exposed:** The altered deck invalidates all memorized hand frequencies from standard poker. A flush is now possible between two identical cards from different copies, and pairs/quads become more frequent due to card duplication. Students must re-derive all hand probabilities from first principles. Wroughton (2012, Journal of Statistics Education) specifically recommends this for classroom use for exactly this reason: it separates students who understand the combinatorial logic from students who merely memorized results. This is a direct probe of conceptual understanding versus procedural mimicry.

**Appropriate level:** Phase 3-4 (grades 9-11). Best used as a mid-game challenge that forces explicit derivation rather than application of memorized values.

---

### Lowball / Razz (recommended addition, limited use)

**Rules:** Hand rankings are inverted — the lowest hand wins. Different variants have different rules about whether straights and flushes count against a player.

**Mathematical concepts uniquely exposed:** Lowball demonstrates that probability rankings are conventional rather than mathematical absolutes. The same set of 2,598,960 hands can be ranked in any order; rarity depends on the rule system, not on some intrinsic property of the hands. This is a useful philosophical point for advanced students.

**Appropriate level:** Phase 4-5, as a conceptual discussion variant rather than a primary instructional vehicle. Its value is as a contrast to standard rankings, not as a sustained probability curriculum.

---

**Variant-to-phase assignment summary:**

| Phase | Recommended Variant(s) | Primary Concept(s) |
|---|---|---|
| Phase 1 (Entry) | Five Card Draw | Sample space, experimental probability, combinations |
| Phase 2 (Foundation) | Five Card Draw (draw mechanic), No Peek | Classical probability, simple conditional probability, complementary events |
| Phase 3 (Intermediate) | Texas Hold 'Em (flop focus), No Peek | Multi-stage conditional probability, informal expected value |
| Phase 4 (Advanced) | Texas Hold 'Em (EV focus), Seven Card Stud | Formal conditional probability, dead cards, pot odds, EV |
| Phase 5 (Capstone) | Baseball, Omaha, Pinochle | Wild card paradox, constrained combinatorics, deriving from first principles |

---

## 5. Competency Gates: How to Define and Assess Mastery in a Game Context

**The core design challenge:** In a game-based, self-directed context, the gate must be embedded in the game experience rather than appearing as an external test. Students who perceive the gate as a test will engage differently than students who perceive it as the next hand. The best-designed gates are indistinguishable from gameplay.

**Mastery threshold — what the research says:** The research on mastery criteria is specific and important. The commonly used 80% threshold has been found insufficient to promote skill maintenance: students taught to 80% accuracy showed mean maintenance around 76%, exhibiting measurable skill loss. Students taught to 90% accuracy maintained at 91%, showing no loss. The practical recommendation for dodo-poker: set the gate at 90% correct across 2-3 consecutive encounters with the competency, not 80% on a single assessment. The multiple-encounter requirement rules out lucky performance. The 90% threshold prevents skill loss between tables.

However, a percentage-correct threshold alone is insufficient. Research from the NRC and from Creative vs. Algorithmic Reasoning studies establishes that students can hit 90% on procedurally familiar problems without any genuine conceptual understanding — by exploiting surface regularities, keyword matching, and step patterns. dodo-poker's gates must prevent this.

**Three-component gate design:** Every competency gate should require evidence across three dimensions, aligned to the NRC strands:

1. Procedural fluency: Can the student compute the correct probability or EV in a familiar format? (Tests the "can execute" strand)
2. Conceptual understanding: Can the student explain why the answer is correct, or recognize the correct reasoning when presented with multiple explanations? Can they identify why an incorrect approach fails? (Tests the "can explain" strand)
3. Transfer: Can the student apply the concept in a novel situation — a different card configuration, a different numerical context, or a context outside poker? (Tests the "can generalize" strand)

The transfer component is the most important for ruling out procedural mimicry. A student who correctly computes 9/47 for a flush draw must also be able to explain why 9 and 47 are the correct values, and must be able to solve an analogous problem with different numbers (e.g., 6 remaining cards of a needed suit in a 38-card unseen pool).

**Bloom's taxonomy applied to gate progression:**

Early table gates (Phases 1-2) should primarily assess Remember, Understand, and Apply. A student who can correctly identify the sample space for a given five-card deal and compute the probability of a specific hand type has demonstrated Phase 1-2 mastery.

Mid-game gates (Phases 3-4) should require Analyze and Evaluate in addition to Apply. A student must not only compute the probability after the flop but must evaluate whether a call is +EV given the pot odds, explaining the reasoning.

Late-game gates (Phase 5) should require Create: designing a novel problem, constructing an argument about why the wild card paradox makes consistent ranking impossible, or deriving hand frequencies for an altered deck.

**Distinguishing genuine understanding from lucky performance — specific mechanisms:**

Use variant problem types at the gate. Present the same underlying concept in at least two different surface formats. A student who understands conditional probability should be able to apply it to a flush draw scenario and a dead-card scenario in Stud. A student who memorized the flush draw procedure will fail the Stud version.

Use explanation prompts. Chief Dodo should, at the gate, ask the student to explain their reasoning in one or two sentences before confirming the answer. This can be implemented as a multiple-choice explanation matching task ("Which of these explanations is correct?") rather than open-ended writing, which preserves game flow.

Use "detect the error" problems. Present a student-level incorrect calculation and ask the player to identify the error and correct it. This requires Analyze-level thinking and cannot be solved by procedural mimicry.

Require representation shifts. Present the probability scenario as a tree diagram and require the student to translate it to a fraction, or present a fraction and require identification of which tree diagram branch it corresponds to. Students who understand only the symbolic procedure will fail the representation-shift version.

**Formative assessment within the game (before the gate):** The gate should not ambush students. Chief Dodo's coaching role is the formative assessment mechanism — offering in-game prompts that check understanding during play, flagging when a student's reasoning reveals a misconception, and directing students back to specific concepts before they encounter the gate. This is Bloom's mastery learning loop implemented in-game: instruction, formative check, corrective coaching, second check, advance.

The game analytics layer should track which specific sub-skills each student is struggling with and surface this information to Chief Dodo's coaching responses. A student who consistently misidentifies the denominator in conditional probability calculations needs a different correction than a student who correctly computes the probability but cannot explain what it means.

**Multiple attempts on parallel-form assessments:** Following the Bloom mastery learning model, students who do not pass the gate on the first attempt should receive corrective instruction (targeted coaching from Chief Dodo) and then attempt a parallel-form gate — same concept, different numbers, different surface scenario. Retaking the identical gate tests memory of the answers, not mastery of the concept.

**When to advance vs. retain:**

Advance when: 90% correct across 2-3 encounters, including at least one transfer task and one explanation/representation task, across sessions (not within a single session — ruling out lucky streaks).

Keep at current table when: Procedural performance meets threshold but explanation or transfer tasks reveal missing conceptual understanding. The student can execute the algorithm but cannot explain it or generalize it. This is the critical decision point — advancing this student creates a gap that will block all subsequent tables because later concepts build on the conceptual foundation, not just the procedural output.

Add optional challenge when: Student demonstrates mastery well above threshold, including high-Bloom reasoning. These students should have access to extension content at the current table — deeper combinatorial problems, connection to real-world applications, preview of the next phase concept — before advancing. This keeps advanced students engaged without pulling them forward before sequencing allows.

---

## 6. Key Recommendations for dodo-poker's Scope and Sequence Design

**1. Sequence by concept, not by variant.** Build the prerequisite dependency graph for probability concepts first (using the CCSS Coherence Map and GAISE framework as the external validation). Then assign poker variants to tables based on which variant best exposes each concept at the right level of sophistication. A variant is a vehicle; it should not drive the sequence. This is the most important structural recommendation.

**2. Use the five-stage informal-to-formal progression as the game's architecture.** The research-supported ordering (qualitative/experimental → classical probability → simple compound events → conditional probability → expected value and distributions) should map directly onto the game's five curriculum phases. Each phase transition is a major gate. Each table within a phase represents increasing sophistication within the same conceptual zone.

**3. Do not introduce formal probability numbers before the experimental foundation is in place.** This is a counterintuitive constraint for a card game, but it is well-supported by research. The entry tables should be oriented around experimental trials and qualitative likelihood before fractions are assigned to outcomes. Early hands should be played and outcomes recorded before they are computed.

**4. Plan the spiral explicitly — mark introduction, focus, and application for every concept.** Every concept in the game should appear at minimum three times across the full table progression: once as introduction (informal, exploratory, lower stakes), once as primary focus (formal, explicit, gated), and once as a tool applied in service of a new concept. If this cannot be mapped out explicitly, the concept is probably either too early or too shallow in the progression.

**5. Design gates that test conceptual understanding, not just procedural performance.** The 90% correct threshold is necessary but not sufficient. Every gate must include at least one transfer task and one explanation or representation-shift task that cannot be solved by procedural mimicry. Students who can compute 9/47 but cannot explain why 47 is the denominator have not demonstrated mastery of conditional probability — they have demonstrated a memorized procedure.

**6. Use Chief Dodo's coaching as the formative assessment mechanism, not the gate itself.** The gate should feel like a game challenge. Chief Dodo's mid-hand coaching questions are the formative loop. This preserves game immersion while implementing the Bloom mastery learning model. The coaching analytics layer should track specific sub-skill gaps and direct coaching accordingly — not provide generic encouragement.

**7. Sequence Five Card Draw before Texas Hold 'Em, and Hold 'Em before Seven Card Stud.** Despite Texas Hold 'Em's greater cultural familiarity, Five Card Draw's uniform sample space makes it the cleaner introductory vehicle for classical probability. Hold 'Em's regular three-stage structure makes it the right vehicle for introducing sequential conditional probability before the variable-denominator complexity of Seven Card Stud. Baseball and No Peek should appear in later phases. Reversing this order is a sequencing error with documented consequences for student understanding of conditional probability.

**8. Flag the gambler's fallacy and representativeness heuristic as active instructional targets, not background noise.** Fischbein's research on primary intuitions is directly relevant: students entering the game hold misconceptions that are persistent and resistant to simple correction. Chief Dodo's coaching must actively surface and address these — specifically, the belief that a long losing streak makes a win "due," and the belief that a hand that looks balanced is more probable than one that looks extreme. The early tables are the right place to confront these directly, before formal probability instruction, through controlled demonstration rather than explicit correction.

**9. Reserve Baseball and the wild card paradox for Phase 5 students who have demonstrated mastery of the standard probability hierarchy.** The wild card paradox requires solid understanding of the standard hand ranking and frequency system to be meaningful. Encountering it before that foundation is in place produces confusion rather than insight. The paradox is also optional content from a standards perspective — it is not in CCSS or GAISE — but it is a uniquely powerful demonstration that mathematical models are constructed, not discovered. Flag this as enrichment rather than core content.

**10. Build in a data collection mechanic from the first table.** GAISE's first pillar is formulating statistical questions and collecting data. dodo-poker should have students recording outcomes from the earliest tables — not just playing hands, but tracking how often certain events occur and comparing observed frequencies to the theoretical probabilities they learn to compute. This serves two functions: it builds the frequentist foundation that formal probability theory rests on, and it creates the dataset that later tables can analyze with statistical tools. This mechanic also provides the game analytics layer with data about student reasoning patterns that informs Chief Dodo's adaptive coaching.

**Challenges to planning assumptions worth flagging:**

The assumption that Texas Hold 'Em should be the primary game format because it is the most widely known variant may need to be reconsidered if it is being placed earlier in the sequence than the Phase 3-4 range. Hold 'Em's multi-stage conditional probability is not appropriate as an entry-level table. If brand recognition argues for Hold 'Em as the visible face of the game, one solution is to use a simplified Hold 'Em format (fixed community card reveal, no betting complexity) at early tables while progressively unlocking the full probabilistic complexity at later phases.

The assumption that a single mastery threshold applies across all concepts should be revisited. Transfer tasks are harder than familiar-format tasks; the 90% threshold should be applied to performance across both types, not just to familiar-format problems where procedural mimicry is most effective.

The assumption that competency gates will feel natural to students without explicit framing may not hold. Research on mastery-based game progression (IntechOpen taxonomy) shows that skill-based gates feel fair when the gate criteria are visible to learners before they attempt the gate. Chief Dodo should communicate explicitly what demonstrating mastery looks like at each table, not just indicate when a student has passed or failed.

---

## 7. Sources

**Scope and Sequence Design**
- Wiggins, G. & McTighe, J. Understanding by Design (UbD White Paper): https://files.ascd.org/staticfiles/ascd/pdf/siteASCD/publications/UbD_WhitePaper0312.pdf
- McTighe, J. UbD Research Base Summary: https://jaymctighe.com/wp-content/uploads/2011/04/UbD-Research-Base.pdf
- CCSS Coherence Map, Achieve the Core: https://achievethecore.org/page/1118/coherence-map
- CCSS Learning Progressions Documents: https://lincs.ed.gov/professional-development/resource-collections/profile-826
- Hess & Kearns, Learning Progressions Frameworks (K-12 Math), NCIEA: https://www.nciea.org/wp-content/uploads/2022/07/Math_LPF_KH11.pdf
- Sage Encyclopedia of Curriculum Studies, Scope and Sequence: https://sk.sagepub.com/ency/edvol/curriculumstudies/chpt/scope-sequence-curriculum-development
- Acadecraft, Curriculum Sequencing Models: https://www.acadecraft.com/blog/what-is-curriculum-sequencing/
- Edusfere, Curriculum Mapping vs Scope and Sequence: https://edusfere.com/curriculum-mapping-vs-scope-and-sequence-key-differences-explained/
- CCEE K12 Playbook, Scope, Sequence, and Pace: https://k12playbook.ccee-ca.org/learning-acceleration/scope-sequence-and-pace/
- Beyer, B. Developing a Scope and Sequence for Thinking Skills (ASCD, 1988): https://files.ascd.org/staticfiles/ascd/pdf/journals/ed_lead/el_198804_beyer.pdf
- ASCD, Pacing Guides: What Research Says: https://www.ascd.org/el/articles/pacing-guides
- MIT Teaching and Learning Lab, Backward Design: https://tll.mit.edu/teaching-resources/course-design/backward-design/
- Open Up Resources 6-8 Math Scope and Sequence: https://access.openupresources.org/curricula/our6-8math-v3/en/default/grade-6/course_guide/scope-and-sequence.html
- Connecticut SDE, K-12 Universal Curriculum Design Principles: https://portal.ct.gov/-/media/sde/ct-learning-hub/k-12-universal-curriculum-design-principles.pdf
- Head Start, Curriculum Scope and Sequence: https://headstart.gov/publication/curriculum-scope-sequence
- NSW Department of Education, Elements of a Scope and Sequence: https://education.nsw.gov.au/teaching-and-learning/curriculum/planning-programming-and-assessing-k-12/planning-programming-and-assessing-k-6/k-6-scope-and-sequences/elements

**Probability and Statistics Learning Progressions**
- GAISE PreK-12 (2007, full PDF): https://www.amstat.org/asa/files/pdfs/gaise/gaiseprek-12_full.pdf
- GAISE II PreK-12 (2020, full PDF): https://www.amstat.org/docs/default-source/amstat-documents/gaiseiiprek-12_full.pdf
- GAISE II introduction article (HDSR 2020): https://hdsr.mitpress.mit.edu/pub/cqncbp3l
- ASA GAISE page: https://www.amstat.org/education/guidelines-for-assessment-and-instruction-in-statistics-education-(gaise)-reports
- GAISE II ERIC record: https://eric.ed.gov/?id=ED620599
- GAISE Level A engagement article (HDSR 2021): https://hdsr.mitpress.mit.edu/pub/wqoysrrt/release/3
- Jones, L.A. et al. (1997), A Framework for Assessing and Nurturing Young Children's Thinking in Probability: https://link.springer.com/article/10.1023/A:1002981520728
- Jones, L.A. et al. (2000), A Framework for Characterizing Children's Statistical Thinking: https://www.tandfonline.com/doi/abs/10.1207/S15327833MTL0204_3
- Jones, L.A. et al., Middle school conditional probability: https://link.springer.com/article/10.1007/BF03217301
- Watson, J. & Callingham, R. Statistical Literacy Hierarchy: https://iase-pub.org/ojs/SERJ/article/download/223/127
- Watson & Callingham, Measuring Statistical Literacy: https://www.researchgate.net/publication/8030840_Measuring_Statistical_Literacy
- Batanero, C. et al. (2016), ICME-13 Probability Survey: https://link.springer.com/chapter/10.1007/978-3-319-31625-3_1
- Fischbein legacy article (Educational Studies in Mathematics): https://link.springer.com/article/10.1023/A:1013801623755
- NCTM Data Analysis and Probability: https://www.nctm.org/Standards-and-Positions/Principles-and-Standards/Data-Analysis-and-Probability/
- CCSS Grade 7 SP Standards: https://www.thecorestandards.org/Math/Content/7/SP/
- CCSS Grade 8 SP Standards: https://www.thecorestandards.org/Math/Content/8/SP/
- CCSS High School Statistics: https://www.thecorestandards.org/Math/Content/HSS/
- CCSS HS Conditional Probability: https://www.thecorestandards.org/Math/Content/HSS/CP/
- CT DOE, Common Core 6-8 Domain Progressions: https://portal.ct.gov/-/media/SDE/CT-Core-Standards/2014/08/CCSS_math_6_8_Domain_Progressions.pdf
- Washington Statistics Council, CCSS Statistics Standards: https://www.washstat.org/presentations/20141008/CommonCoreStatisticsStandards.pdf
- PCMI brief, Teaching Teachers to Teach Probability: https://projects.ias.edu/pcmi/hstp/sum2017/int/briefs/TeachingTeacherstoTeachProbability.pdf
- ZDM 2023, Teaching and Learning Probability Review: https://link.springer.com/article/10.1007/s11858-023-01511-5

**Poker Variants and Mathematical Concepts**
- Poker Probability, Wikipedia: https://en.wikipedia.org/wiki/Poker_probability
- University of Hawaii, 5-Card Poker Hands: https://math.hawaii.edu/~ramsey/Probability/PokerHands.html
- Cut The Knot, Poker Sample Spaces: https://www.cut-the-knot.org/Probability/PokerSampleSpaces.shtml
- ResearchGate, Mathematical Principles in Texas Hold'em: https://www.researchgate.net/publication/388046662_Mathematical_Principles_in_Texas_Hold'em_Poker
- Iowa State (Duda), Probabilities of Poker Hands with Variations: https://meteor.geol.iastate.edu/~jdduda/portfolio/492.pdf
- Cornell MEC, Texas Hold'em Poker: https://pi.math.cornell.edu/~mec/2006-2007/Probability/Texasholdem.htm
- Medium (Jake Cohen), Using Texas Hold Em to Understand Probability: https://medium.com/@jakecohen212/using-texas-hold-em-to-understand-probability-fc2d21edeeee
- PokerNews, Texas Hold'em as a Tool for Teaching Statistics: https://www.pokernews.com/news/2017/08/texas-hold-em-tool-for-teaching-statistics-28816.htm
- Schoenberg, Introduction to Probability with Texas Hold'em Examples: https://www.amazon.com/Introduction-Probability-Texas-Holdem-Examples/dp/1439827680
- The Poker Bank, How To Work Out Hand Probability: https://www.thepokerbank.com/tools/odds-charts/work-out-probability/
- PokerStrategy, Probabilities in Texas Hold'em: https://www.pokerstrategy.com/strategy/various-poker/texas-holdem-probabilities/
- Simon Fraser University, 7-Card Stud Flush Completion: http://people.math.sfu.ca/~alspach/comp24/
- OnlinePoker.net, Seven Card Stud Odds: https://www.onlinepoker.net/strategy/stud-odds
- Pagat, Rules of Poker Variants: Baseball, No Peek, Night Baseball: https://www.pagat.com/poker/variants/baseball.html
- Baseball (poker), Wikipedia: https://en.wikipedia.org/wiki/Baseball_(poker)
- Wikibooks, Poker/MidnightBaseball: https://en.wikibooks.org/wiki/Poker/MidnightBaseball
- DataGenetics, Poker odds with wild cards: http://datagenetics.com/blog/september32016/index.html
- Durango Bill, 5 Card Poker Probabilities: http://www.durangobill.com/Poker_Probabilities_5_Cards.html
- Mind Your Decisions, Wild card poker paradox: https://mindyourdecisions.com/blog/2010/05/25/wild-card-poker-paradox/
- Harvey Mudd Math Fun Facts, Poker Probability Paradox: https://math.hmc.edu/funfacts/poker-probability-paradox/
- Wroughton, J. (2012), Pinochle Poker, Journal of Statistics Education: https://jse.amstat.org/v20n2/wroughton.pdf
- GTO Wizard, Poker Combinatorics: https://blog.gtowizard.com/a-beginners-guide-to-poker-combinatorics/
- TightPoker, Poker Math Essentials: https://www.tightpoker.com/poker-math-essentials-from-pot-odds-to-expected-value-calculations/
- Casino Barred, The Poker Classroom: https://www.casinobarred.com/the-poker-classroom-enhancing-probability-and-risk-skills-through-card-games/
- Bollman, Intermediate Poker Mathematics (Routledge): https://www.routledge.com/Intermediate-Poker-Mathematics/Bollman/p/book/9781032736785

**Competency Gates and Mastery-Based Progression**
- Daro, P., Mosher, F., Corcoran, T. (2011), Learning Trajectories in Mathematics, CPII: https://cpre.org/sites/default/files/researchreport/1220_learningtrajectoriesinmathcciireport.pdf
- NRC, Adding It Up (2001): https://www.nationalacademies.org/read/9822/chapter/6
- National Academies, Measuring What Counts: https://www.nationalacademies.org/read/2235/chapter/8
- Bloom's Taxonomy for Mathematics, University of Toronto: https://www.math.toronto.edu/writing/BloomsTaxonomy.pdf
- Revised Bloom's for mathematics HOTS research: https://www.researchgate.net/publication/354896458
- Education Endowment Foundation, Mastery Learning: https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/mastery-learning
- Mastery Learning, Wikipedia: https://en.wikipedia.org/wiki/Mastery_learning
- Mastery learning academic thesis, MN State: https://red.mnstate.edu/cgi/viewcontent.cgi?article=1834&context=thesis
- Mastery criteria maintenance (Wiley, 2021): https://onlinelibrary.wiley.com/doi/full/10.1002/bin.1778
- Mastery criteria PMC study: https://pmc.ncbi.nlm.nih.gov/articles/PMC7314871/
- 80% vs 90% criteria PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC5843573/
- Creative vs Algorithmic Reasoning research: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7775304/
- Problem posing for transfer assessment: https://www.sciencedirect.com/science/article/abs/pii/S0193397301001010
- Frontiers in Education, Vertical Scale Formative Assessment: https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2019.00103/full
- Measuring conceptual understanding: https://www.researchgate.net/publication/341317806
- Assessing conceptual understanding (IEEE): https://ieeexplore.ieee.org/document/6685135/
- ST Math, What Is It: https://help.stmath.com/hc/en-us/articles/31147884758935-What-is-ST-Math
- ST Math randomized trial: https://www.researchgate.net/publication/260638069
- Player progression taxonomy, IntechOpen: https://www.intechopen.com/chapters/1221745
- Gating in game design, Number Analytics: https://www.numberanalytics.com/blog/ultimate-guide-gating-game-design
- Michigan Virtual, CBE Mathematics: https://michiganvirtual.org/blog/competency-based-education-in-mathematics/
- C-BEN, Math Pathways guidebook: https://www.c-ben.org/c-ben-releases-new-resource-understanding-designing-for-math-skills-today-a-competency-based-education-math-pathways-case-study-and-guidebook/
- Achieve.org, Learning Progressions in CBP: https://www.achieve.org/files/Achieve-LearningProgressionsinCBP.pdf
- Common Core progressions documents: https://achievethecore.org/page/254/progressions-documents-for-the-common-core-state-standards-for-mathematics
- Aurora Institute, Mastery-Based Math Teacher's Journey: https://aurora-institute.org/cw_post/a-mastery-based-math-teachers-journey-moving-away-from-covering-everything/
- ERIC, Mastery-Based Math Teacher Case Study (ED614995): https://eric.ed.gov/?id=ED614995
- Carnegie Learning, Conceptual Understanding: https://www.carnegielearning.com/blog/conceptual-understanding
- DreamBox Adaptive Math: https://www.discoveryeducation.com/solutions/math/dreambox-math/
- HMH, Conceptual Understanding in Math: https://www.hmhco.com/blog/what-is-conceptual-understanding-in-math
- HMH, Procedural Fluency: https://www.hmhco.com/blog/procedural-fluency-in-mathematics
- Minnesota STEM Teacher Center, Procedural from Conceptual: https://stemtc.scimathmn.org/build-procedural-fluency-conceptual-understanding