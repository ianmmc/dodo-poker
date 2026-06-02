# Dialog Tree Schema

Dialog trees are stored as JSON files in this directory. Each file covers one context (start of game, a specific table, etc.). The game engine loads and traverses these trees; Chief Dodo's coaching text is never hardcoded in TypeScript.

When the project is scaffolded, these files move to `src/dialog/`.

---

## File Structure

```json
{
  "id": "string",
  "version": "1.0",
  "description": "string",
  "entry": "node-id",
  "nodes": [ ...node objects... ]
}
```

`entry` names the first node the engine loads from this file.

---

## Node Object

```json
{
  "id": "string",
  "speaker": "chief-dodo | hank | npc-id | null",
  "text": "string | null",
  "responseType": "none | action | checklist | numeric",
  "silent": false,
  "pool": "pool-name",
  "weight": 1,
  "trigger": { "handNumber": 1, "minHandsPlayed": 5, "playerDiscards": 3, "once": true },
  "options": [ ...option objects... ],
  "fields": [ ...field objects... ],
  "followUp": { ...followup object... }
}
```

### Fields

| Field | Required | Notes |
| --- | --- | --- |
| `id` | Yes | Unique within the file; use file-prefix convention (e.g. `t1a-approach-001`) |
| `speaker` | Yes | `null` for silent nodes |
| `text` | Yes | `null` for silent nodes |
| `responseType` | Yes | See below |
| `silent` | No | `true` = engine skips display entirely; used for pool placeholders that represent no comment |
| `pool` | No | Assigns this node to a named pool for random selection by the engine |
| `weight` | No | Relative weight for pool selection (default: 1) |
| `trigger` | No | Conditions that must be met for the engine to use this node |
| `options` | Conditional | Required when `responseType` is `action` or `checklist` |
| `fields` | Conditional | Required when `responseType` is `numeric` |
| `followUp` | Yes | Where to go next |

---

## Response Types

### `none`
Chief Dodo speaks; no player response required. Engine advances automatically.

### `action`
Player selects from a numbered list. Used for: game decisions (call/raise/fold/draw), avatar selection, navigation.

### `checklist`
Player sees 5–7 statements and checks any that match their thinking. Mix of correct reasoning and plausible-but-wrong options. Chief Dodo's follow-up is keyed to specific selections. **Not used at Table 1A.**

### `numeric`
Player enters one or more numbers in labeled fields. Chief Dodo's follow-up branches on correct / too-high / too-low. **Not used at Table 1A.**

---

## Option Object

```json
{ "id": "string", "text": "string", "correct": true, "description": "string" }
```

| Field | Notes |
| --- | --- |
| `id` | Referenced in `followUp.ifSelected:id` |
| `text` | Display label for the option |
| `correct` | For `checklist` only: whether this is a correct item; omit for `action` nodes |
| `description` | Optional; shown as subtext (used for avatar selection flavor) |

---

## Field Object

```json
{ "id": "string", "label": "string", "min": 0, "max": 47 }
```

---

## FollowUp Object

```json
{
  "default": "node-id",
  "next": { "tree": "table-1b", "node": "node-id" },
  "returnToGame": true,
  "ifSelected:option-id": "node-id",
  "ifCorrect": "node-id",
  "ifLow": "node-id",
  "ifHigh": "node-id"
}
```

| Key | Notes |
| --- | --- |
| `default` | Next node within this file |
| `next` | Cross-file navigation: `tree` is the file id, `node` is the entry point |
| `returnToGame` | Hand control back to the game engine (used for mid-hand coaching nodes) |
| `ifSelected:option-id` | Branch based on which action or checklist option was selected |
| `ifCorrect` | Branch for numeric answer within acceptable range |
| `ifLow` | Branch for numeric answer below expected |
| `ifHigh` | Branch for numeric answer above expected |

---

## Trigger Object

```json
{
  "handNumber": 1,
  "minHandsPlayed": 5,
  "playerDiscards": 3,
  "playerDiscards": [4, 5],
  "once": true
}
```

| Key | Notes |
| --- | --- |
| `handNumber` | Fire only on this specific hand number |
| `minHandsPlayed` | Fire only after this many hands have been completed |
| `playerDiscards` | Fire when player discards exactly N cards (or any value in an array) |
| `once` | `true` = fire at most once per session; used for pattern-reveal moments |

---

## Pool Selection

When the engine needs a comment at a given moment (e.g., pre-hand), it collects all nodes with a matching `pool` name, applies weights, and randomly selects one. If the selected node has `silent: true`, nothing is displayed.

Example: to get a pre-hand comment, the engine selects from all nodes with `pool: "t1a-pre-hand"`.

---

## Speaker IDs

| ID | Character |
| --- | --- |
| `chief-dodo` | Chief Dodo |
| `hank` | Hank (California Condor, Table 1A) |
| `lucky` | Lucky (Rock Pigeon, Tables 1B–2B) |
| `vivian` | Vivian (Flamingo, Tables 1B–3A) |
| `null` | No speaker (silent node) |
