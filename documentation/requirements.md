# Requirements

User stories organized by theme. Each story will gain acceptance criteria before implementation.

**Status tags:** `draft` | `ready` | `in-progress` | `done`

---

## Student / Player Experience

| # | Story | Status |
| --- | ------- | -------- |
| S-01 | As a student, I want to play poker against bird NPCs so I can learn probability through practice, not instruction. | `done` |
| S-02 | As a student, I want to start with zero prior knowledge of poker and have the rules explained as I need them. | `draft` |
| S-03 | As a student, I want to learn primarily from my mistakes, with feedback delivered after the fact rather than before. | `done` |
| S-04 | As a student, I want to request guidance from Chief Dodo at any point in the game. | `draft` |
| S-05 | As a student, I want to choose a bird species as my avatar so I feel ownership over my character. | `done` |
| S-06 | As a student, I want the game to run in a browser without installing anything. | `done` |
| S-07 | As a student, I want my progress to be saved so I can return to where I left off. | `done` |

---

## Learning Progression

| # | Story | Status |
| --- | ------- | -------- |
| L-01 | As a student, I want to advance to more complex game scenarios only after demonstrating competency at the current level. | `done` |
| L-02 | As a student, I want the number of opponents I face to increase as I progress, from 1 NPC up to 5. | `draft` |
| L-03 | As a student, I want to be introduced to new poker variants gradually, with Chief Dodo explaining the new rules each time. | `draft` |
| L-04 | As a student, I want the poker variant I'm playing to match the mathematical concepts I'm currently learning. | `draft` |
| L-05 | As a student, I want The Nest organized into distinct tables so I always know where I am in my progression and what comes next. | `draft` |
| L-06 | As a student, I want Chief Dodo to suggest when I'm ready to move to the next table, based on what I've demonstrated — not how many hands I've played. | `done` |
| L-07 | As a student, I want to track and record outcomes from my hands so I can compare what I observe to what the math predicts, building intuition about probability before formal numbers are introduced. | `draft` |

---

## Chief Dodo (Coach / Guide)

| # | Story | Status |
| --- | ------- | -------- |
| C-01 | As a student, I want Chief Dodo to notice when I make a probabilistically poor decision and explain why after the hand. | `draft` |
| C-02 | As a student, I want Chief Dodo to point out patterns in how my opponents are playing so I can learn to recognize reasoning errors. | `done` |
| C-03 | As a student, I want Chief Dodo's explanations to be clear and direct without being condescending, regardless of my age. | `draft` |
| C-04 | As a student, I want Chief Dodo to introduce new poker variants with just enough context to start playing, not a full lecture. | `draft` |
| C-05 | As a student, I want Chief Dodo to greet me as a familiar friend from my first moment in The Nest, so I feel immediately at ease rather than like a newcomer. | `done` |
| C-06 | As a student, I want Chief Dodo to briefly orient me when I approach each new table — what's different here, what to watch for. | `done` |
| C-07 | As a student, I want Chief Dodo to be available for a brief check-in during each betting round when it's my turn, without interrupting the flow of the game. | `draft` |
| C-08 | As a student, I want Chief Dodo to recognize and praise a well-reasoned fold, so I learn that not playing is sometimes the correct decision. | `draft` |
| C-09 | As a student, I want Chief Dodo to recognize and praise a decision to take a break, so I learn that stepping away is part of good judgment. | `draft` |

---

## NPCs (Opponents)

| # | Story | Status |
| --- | ------- | -------- |
| N-01 | As a student, I want each NPC to embody a distinct reasoning pattern — correct or flawed — so that beating them teaches me something. | `done` |
| N-02 | As a student, I want early opponents to make obvious, easily-exploitable errors so I can build confidence and intuition. | `done` |
| N-03 | As a student, I want later opponents to model subtler or more sophisticated reasoning, increasing my analytical challenge. | `draft` |
| N-04 | As a student, I want NPC personalities to fit the bird-themed world so the game feels cohesive. | `draft` |
| N-05 | As a student, I want Chief Dodo to name and explain an NPC's reasoning pattern after I've encountered it in play, so I build vocabulary for recognizing common probabilistic errors. | `draft` |

---

## Reference Cards

| # | Story | Status |
| --- | ------- | -------- |
| R-01 | As a student, I want a reference card in a sliding panel I can show or hide at any time while playing, so I can consult it without leaving the game. | `done` |
| R-02 | As a student, I want the reference card panel to stay visible alongside the game so I can refer to it while making decisions, not just before or after. | `done` |
| R-03 | As a student, I want Chief Dodo to be able to open my reference card and draw attention to specific information during coaching moments, so the card becomes part of how he teaches. | `done` |
| R-04 | As a student, I want to earn more advanced reference cards as I demonstrate mastery, so the information I receive matches what I'm ready to use. | `draft` |
| R-05 | As a student, I want my reference cards to eventually show the probability and combinatorial count for each hand, so I can see at a glance why some hands are rarer than others. | `draft` |

---

## Assessment

| # | Story | Status |
| --- | ------- | -------- |
| A-01 | As a student, I want the game to observe and record my betting and drawing decisions so the system can build a picture of my probability reasoning without interrupting play. | `draft` |
| A-02 | As a student, I want Chief Dodo to pause after key learning moments and ask me what I noticed, using a checklist of statements to check my understanding. | `done` |
| A-03 | As a student, I want a second chance if I answer wrong, with a different hint than the first attempt — so I can figure it out rather than just try again blindly. | `done` |
| A-04 | As a student, I want to be told how many of my checked statements are off (without being told which ones) on my second wrong attempt, so I can adjust. | `done` |
| A-05 | As a student, I want Chief Dodo to simply show me the answer after three wrong attempts, so I'm never left stuck. | `done` |
| A-06 | As a student, I want to answer numerical questions about what I'm observing and receive feedback on whether my answer was too high, too low, or correct. | `in-progress` |
| A-07 | As a student, I want my assessment responses to be saved so the system can recognize what I've already demonstrated across sessions. | `done` |
| A-08 | As a student, I want the game to sometimes put me in a specific hand situation to test a concept directly, rather than waiting for it to come up by chance. | `draft` |
| A-09 | As a student, I want assessment questions to arise naturally during gameplay — interleaved with play, not batched at the end — so coaching feels like conversation, not a quiz. | `done` |

---

## Simulation

| # | Story | Status |
| --- | ------- | -------- |
| SIM-01 | As a student, I want access to a fast-simulation mode where I can watch thousands of hands resolve in seconds, so I can see how probability plays out over the long run. | `draft` |
| SIM-02 | As a student, I want Chief Dodo to introduce me to the simulation room when the moment is right, and be able to return to it on my own afterward. | `draft` |

---

## Platform / Technical

| # | Story | Status |
| --- | ------- | -------- |
| T-01 | As a student, I want the game to function fully client-side in Phase 1, with no server required. | `done` |
| T-02 | As a student (future), I want to play against other students in real-time multiplayer sessions. | `draft` |
| T-03 | As a student, I want the game state to persist across browser sessions (local storage in Phase 1). | `done` |
| T-04 | As a student, I want to see the current bet amount alongside the pot so I understand what each decision costs. | `done` |

---

## Curriculum Alignment

| # | Story | Status |
| --- | ------- | -------- |
| M-01 | As a student, I want every game mechanic to connect to a named learning objective tied to Common Core math standards. | `draft` |
| M-02 | As a teacher (future), I want to assign specific game phases to align with classroom curriculum. | `draft` |
