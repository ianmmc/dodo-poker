# Chief Dodo — Dialog Samples & Voice Reference

Working reference for dialog authoring. Use these samples to calibrate tone, length, and interaction type before writing JSON trees.

---

## Voice Guardrails

- 1–2 sentences per line; Chief Dodo does not lecture
- Conversational and direct; never condescending
- Dry humor is fine; never at the student's expense
- LA / hip-hop flavor as light seasoning — no metaphors or references that require local knowledge to understand
- Socratic questions are appropriate, but only when the student has enough vocabulary to engage with them (not at Table 1A)
- Incorrect checklist options must be plausible — things a student might actually think, not straw men

---

## Interaction Type Reference

| Type | When to use | Player sees |
| --- | --- | --- |
| `none` | Statement; no response needed | Chief Dodo speaks; game continues |
| `action` | Game decision (call/raise/fold/draw/check) | Numbered action menu |
| `checklist` | Reflective question about reasoning or pattern | 5–7 statements, multi-select; mix of correct and incorrect |
| `numeric` | Quantitative question (outs, pot size, probability) | One or more labeled number fields |

---

## Samples by Coaching Moment

### Entry / First Arrival

**[Table 1A, first time at The Nest]** — `none`
> "Like I told you last night, The Nest is the best. Come on — Hank's already over at Table 1. Don't worry about him yet."

**[Sitting down for the first time]** — `none`
> "Here's all you need to know right now: five cards, best hand wins. I'll fill in the rest as it comes up."

---

### Approaching a New Table

**[Arriving at Table 3A — No Peek]** — `none`
> "This one's different. Nobody looks at their own cards — everything's face up except yours at the end. Sounds weird. It's going to teach you something."

**[Arriving at Table 4A — Seven Card Stud]** — `none`
> "New game. You're going to want to watch the table, not just your own hand. What everyone else is showing matters — and I mean actually matters to your math."

---

### Pre-Hand Observation

**[Before a hand — pointing at Lucky]** — `none`
> "Lucky just lost three in a row. Watch what he does next."

**[Maestro hasn't updated after new cards — reflective question]** — `checklist`
> "Maestro's had the same read since the first card hit. Two new cards later, same bet. What does that tell you?"

*Sample checklist options (correct marked †):*
- He's ignoring the new information. †
- He made his read early and isn't updating it. †
- He probably has a strong hand and doesn't need to adjust.
- That's actually smart — first reads are usually right.
- The new cards haven't changed what he thinks he knows. †
- He's trying to confuse everyone at the table.
- He's being patient, waiting for the right moment.

*Note: the last two are tempting but wrong in different ways — one assigns strategic intent, one confuses patience with anchoring. Both are things students actually think.*

---

### During a Hand (Student's Turn)

**[At a decision point — reflective]** — `checklist`
> "Take a second. What do you actually know right now — and what are you guessing?"

*Sample checklist options:*
- I know my two hole cards and the three community cards.
- I know the pot odds and whether calling is +EV.
- I'm guessing what Maestro is holding.
- I know the probability of hitting my draw.
- I'm guessing whether my hand is the best one right now.
- I know exactly what I need to win.

*Note: some of these are phase-dependent — "pot odds" and "EV" are not valid options at Table 1A. Checklist options must be gated by curriculum phase.*

**[Before a call — quantitative]** — `numeric`
> "What's in the pot? What does it cost you to call?"

*Fields:*
- Seeds in the pot: `[ ]`
- Cost to call: `[ ]`

**[Student is about to chase a draw — quantitative]** — `numeric`
> "Before you decide: how many cards left in the deck actually help you? Count them out."

*Fields:*
- Cards that help me (outs): `[ ]`

*Follow-up branches: correct / too high (double-counting visible cards) / too low (missing suit) / zero (student thinks they have no outs)*

---

### Post-Hand Debrief

**[After a losing call]** — `checklist`
> "That cost you five red seeds. Was it the cards or was it the decision?"

*Sample checklist options:*
- It was bad luck — I made the right call.
- I made the right call but the wrong card came. †
- I shouldn't have called — the odds weren't there.
- The decision was wrong even if a good card had come. †
- I got unlucky; I'd make the same call again.
- I'm not sure — I need to look at the numbers.

**[After hitting a flush — quantitative]** — `numeric`
> "You hit it. Now: what were the chances of that when you decided to call?"

*Fields:*
- My probability of hitting (as a fraction, e.g. 9/47): `[ ]` / `[ ]`

*Note: accept fraction or approximate decimal; follow-up acknowledges the estimate rather than demanding precision.*

**[After a missed fold opportunity — reflective]** — `checklist`
> "The fold was right there. What were you thinking?"

*Sample checklist options:*
- I thought my hand was strong enough to win.
- I didn't want to give up seeds I'd already put in. †
- I thought the other player was bluffing.
- I wasn't sure what the right move was.
- I thought I had better odds than I did. †
- I knew it was probably wrong but went for it anyway.

*Note: "I didn't want to give up seeds I'd already put in" is the sunk cost fallacy — a key misconception worth surfacing explicitly. Mark it as a teachable distractor.*

---

### Praising a Fold

**[Student folds correctly]** — `none`
> "Hold on. You folded that? Yeah. That's exactly right. Most people don't."

**[Particularly disciplined fold]** — `none`
> "Good fold. Seriously — that's not a small thing."

---

### Praising a Decision to Step Away

**[Student says they want to take a break]** — `none`
> "Smart. Stepping away when the table's getting to you is a real skill. Most people don't learn that one until it costs them something."

---

### Naming an NPC's Pattern

**[After several hands against Lucky]** — `none`
> "You see what Lucky does when he's on a losing streak? He bets bigger — he thinks he's 'due.' That's the gambler's fallacy. It's wrong every single time, because the cards don't remember what happened last hand."

**[After Vivian bets big on a hot streak]** — `none`
> "Vivian's riding her last three wins. What she doesn't realize is that those wins have nothing to do with what comes next. Her last hand doesn't change the deck."

**[Introducing The Professor]** — `none`
> "See the raven over at Table 4? That's The Professor. Don't worry about him yet. Start watching how he thinks when it's his turn — not what he bets, how he decides."

---

### Surveillance Room Introduction

**[After Table 1B — student has tracked enough hands]** — `none`
> "You've been tracking hands for a while now. Come with me — there's a room in the back where we can run the surveillance footage at speed. Thousand hands in about thirty seconds. Let's see what Lucky's streak actually looks like over the long run."

---

### Quiet / Texture Lines

**[When student asks a good question]** — `none`
> "I'm not going to give you the answer. But I'll tell you you're asking the right question."

**[Dry aside about Hank]** — `none`
> "Hank's been a member here longer than I have. Doesn't mean he knows what he's doing at the table."

---

## Feedback Notes (from initial review session)

- **Tone and length**: confirmed on target — 1–2 sentences, conversational
- **Socratic questions**: approved; must be gated by phase (no checklist/numeric at Table 1A)
- **Reflective questions** → checklist with plausible distractors; Chief Dodo responds to *which* items were selected, not just right/wrong count
- **Quantitative questions** → labeled numeric fields; follow-up branches on correct / too-high / too-low
- **LA / hip-hop flavor**: light seasoning only; no geographically-bound references
- **Seed denomination** ("five red seeds"): confirmed natural
- **Writing good distractors** is the hard part — incorrect options must reflect things students actually believe, not obvious straw men
