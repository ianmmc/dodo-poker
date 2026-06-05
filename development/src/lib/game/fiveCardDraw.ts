import { makeDeck, shuffle } from './card'
import { evaluateHand, pickWinner } from './hand'
import type { Card } from './card'
import type { DrawDecision } from './npc'
import type { ScriptedDeal } from './scriptedHands'

export type Phase =
  | 'idle'       // between hands
  | 'bet1'       // first betting round
  | 'draw'       // player selects discards
  | 'bet2'       // second betting round
  | 'done'       // hand complete (fold or showdown)

export type NpcAction = 'bet' | 'call' | 'check' | null

export interface HandResult {
  winner: 'player' | 'npc' | 'tie'
  playerHandName: string
  npcHandName: string
  potWon: number
  playerFolded: boolean
  npcFolded?: boolean
}

export interface GameState {
  phase: Phase
  deck: Card[]
  playerHand: Card[]
  npcHand: Card[]
  playerSeeds: number
  npcSeeds: number
  pot: number
  betAmount: number
  ante: number
  // True when the NPC has bet in the current round and player must call or fold
  npcPendingBet: boolean
  npcLastAction: NpcAction
  npcDrawCount: number
  playerDrawCount: number   // -1 = folded/bet out before draw; 0 = stood pat; 1–5 = drawn
  handNumber: number
  handsPlayed: number
  result: HandResult | null
  // Indices (0–4) of the cards the NPC discarded in the most recent draw.
  // Set by playerDraw(); reset to [] by startHand(). Used by the draw animation
  // in App.svelte so it knows which card slots to animate without re-invoking
  // the NPC decider.
  npcDiscardIndices: number[]
  // Amount the player must put in to call the NPC's pending bet.
  // Equals betAmount in fixed-limit games; tracked explicitly so future
  // variable-bet tables (raises, pot-limit) don't require a structural change.
  callAmount: number
  // When true, bet1 resolves directly to showdown — no draw phase.
  // Used for no-draw Five Card Draw (Table 2A).
  noDraw: boolean
  // When true, the NPC opens betting this hand; the app enqueues the NPC's
  // opening decision before showing the player action menu.
  // Alternates each hand (odd handNumber = NPC first) from Table 2A onward.
  npcActsFirst: boolean
}

export function createGame(
  startingSeeds = 100,
  betAmount = 5,
  ante = 5
): GameState {
  return {
    phase: 'idle',
    deck: [],
    playerHand: [],
    npcHand: [],
    playerSeeds: startingSeeds,
    npcSeeds: startingSeeds,
    pot: 0,
    betAmount,
    ante,
    npcPendingBet: false,
    npcLastAction: null,
    npcDrawCount: 0,
    playerDrawCount: -1,
    handNumber: 0,
    handsPlayed: 0,
    result: null,
    callAmount: 0,
    npcDiscardIndices: [],
    noDraw: false,
    npcActsFirst: false,
  }
}

export function startHand(state: GameState): GameState {
  const deck = shuffle(makeDeck())
  // Rotation: in no-draw mode, NPC opens on odd hands (1, 3, 5…).
  // state.handNumber is still the PREVIOUS hand's number before the +1 below.
  const nextHandNumber = state.handNumber + 1
  const npcActsFirst = state.noDraw && nextHandNumber % 2 === 1
  return {
    ...state,
    phase: 'bet1',
    deck: deck.slice(10),
    playerHand: deck.slice(0, 5) as Card[],
    npcHand: deck.slice(5, 10) as Card[],
    pot: state.ante * 2,
    playerSeeds: state.playerSeeds - state.ante,
    npcSeeds: state.npcSeeds - state.ante,
    npcActsFirst,
    npcPendingBet: false,
    npcLastAction: null,
    npcDrawCount: 0,
    playerDrawCount: -1,
    handNumber: state.handNumber + 1,
    result: null,
    callAmount: 0,
    npcDiscardIndices: [],
  }
}

export function startScriptedHand(state: GameState, deal: ScriptedDeal): GameState {
  const usedCards = new Set([...deal.playerCards, ...deal.npcCards])
  const remainingDeck = shuffle(makeDeck().filter(c => !usedCards.has(c)))
  const nextHandNumber = state.handNumber + 1
  const npcActsFirst = state.noDraw && nextHandNumber % 2 === 1
  return {
    ...state,
    phase: 'bet1',
    deck: remainingDeck,
    playerHand: deal.playerCards,
    npcHand: deal.npcCards,
    pot: state.ante * 2,
    playerSeeds: state.playerSeeds - state.ante,
    npcSeeds: state.npcSeeds - state.ante,
    npcActsFirst,
    npcPendingBet: false,
    npcLastAction: null,
    npcDrawCount: 0,
    playerDrawCount: -1,
    handNumber: nextHandNumber,
    result: null,
    callAmount: 0,
    npcDiscardIndices: [],
  }
}

// Player checks; NPC responds with a bet, creating a pending bet for the player.
export function playerCheck(state: GameState): GameState {
  const npcBet = state.betAmount
  return {
    ...state,
    pot: state.pot + npcBet,
    npcSeeds: state.npcSeeds - npcBet,
    npcPendingBet: true,
    npcLastAction: 'bet',
    callAmount: npcBet,
  }
}

// Both players check. Advances to draw (bet1 → draw) or resolves showdown.
// In noDraw mode, bet1 goes directly to showdown.
export function playerCheckNpcCheck(state: GameState): GameState {
  const base = {
    ...state,
    npcPendingBet: false,
    npcLastAction: 'check' as NpcAction,
    callAmount: 0,
  }
  if (state.phase === 'bet2' || state.noDraw) return resolveShowdown(base)
  return { ...base, phase: 'draw' }
}

// Player bets; NPC calls.
// In noDraw mode, bet1 goes directly to showdown instead of draw.
export function playerBet(state: GameState, betAmount?: number): GameState {
  const amount = betAmount ?? state.betAmount
  const nextPhase: Phase = (state.phase === 'bet1' && !state.noDraw) ? 'draw' : 'done'
  const base = {
    ...state,
    pot: state.pot + amount * 2, // player bet + npc call
    playerSeeds: state.playerSeeds - amount,
    npcSeeds: state.npcSeeds - amount,
    npcPendingBet: false,
    npcLastAction: 'call' as NpcAction,
    callAmount: 0,
  }
  return nextPhase === 'done' ? resolveShowdown(base) : { ...base, phase: 'draw' }
}

// Player calls the NPC's pending bet.
// In noDraw mode, bet1 goes directly to showdown instead of draw.
export function playerCall(state: GameState): GameState {
  const amount = state.callAmount
  const nextPhase: Phase = (state.phase === 'bet1' && !state.noDraw) ? 'draw' : 'done'
  const base = {
    ...state,
    pot: state.pot + amount,
    playerSeeds: state.playerSeeds - amount,
    npcPendingBet: false,
    npcLastAction: null as NpcAction,
    callAmount: 0,
  }
  return nextPhase === 'done' ? resolveShowdown(base) : { ...base, phase: 'draw' }
}

// NPC opens betting (rotation: NPC acts first). Sets npcPendingBet so the
// player's action menu shows Call/Fold. Amount is the NPC's chosen bet size.
export function npcOpensBet(state: GameState, amount: number): GameState {
  return {
    ...state,
    pot: state.pot + amount,
    npcSeeds: state.npcSeeds - amount,
    npcPendingBet: true,
    npcLastAction: 'bet',
    callAmount: amount,
  }
}

// NPC opens by checking (rotation: NPC acts first). Player can now check/bet/fold.
export function npcOpensCheck(state: GameState): GameState {
  return {
    ...state,
    npcPendingBet: false,
    npcLastAction: 'check',
    callAmount: 0,
  }
}

// Player folds. NPC takes the pot.
export function playerFold(state: GameState): GameState {
  return {
    ...state,
    phase: 'done',
    npcSeeds: state.npcSeeds + state.pot,
    handsPlayed: state.handsPlayed + 1,
    callAmount: 0,
    result: {
      winner: 'npc',
      playerHandName: 'folded',
      npcHandName: '—',
      potWon: 0,
      playerFolded: true
    }
  }
}

// NPC folds. Player takes the pot.
// If folding post-draw (bet2) the player's final hand name is recorded;
// pre-draw folds leave it blank since the hand isn't finalised.
export function npcFold(state: GameState): GameState {
  const playerHandName = state.phase === 'bet2'
    ? evaluateHand(state.playerHand).name
    : ''
  return {
    ...state,
    phase: 'done',
    playerSeeds: state.playerSeeds + state.pot,
    handsPlayed: state.handsPlayed + 1,
    callAmount: 0,
    result: {
      winner: 'player',
      playerHandName,
      npcHandName: '—',
      potWon: state.pot,
      playerFolded: false,
      npcFolded: true,
    }
  }
}

// Player draws. discardIndices is 0-based indices of cards to discard (0–4).
// npcDecider is the active NPC's decideDraw function — caller is responsible
// for passing the correct NPC module so draw behaviour is table-accurate.
export function playerDraw(
  state: GameState,
  discardIndices: number[],
  npcDecider: (hand: Card[]) => DrawDecision
): GameState {
  const deck = [...state.deck]
  const playerHand = [...state.playerHand] as Card[]

  for (const idx of discardIndices) {
    playerHand[idx] = deck.pop()!
  }

  const npcDrawDecision = npcDecider(state.npcHand)
  const npcHand = [...state.npcHand] as Card[]
  for (const idx of npcDrawDecision.discardIndices) {
    npcHand[idx] = deck.pop()!
  }

  return {
    ...state,
    phase: 'bet2',
    deck,
    playerHand,
    npcHand,
    npcDrawCount: npcDrawDecision.discardIndices.length,
    npcDiscardIndices: npcDrawDecision.discardIndices,
    playerDrawCount: discardIndices.length,
    npcPendingBet: false,
    npcLastAction: null,
    callAmount: 0,
  }
}

function resolveShowdown(state: GameState): GameState {
  const outcome = pickWinner(state.playerHand, state.npcHand)
  const playerHandName = evaluateHand(state.playerHand).name
  const npcHandName = evaluateHand(state.npcHand).name

  let potWon = 0
  let playerSeeds = state.playerSeeds
  let npcSeeds = state.npcSeeds

  if (outcome === 'player') {
    potWon = state.pot
    playerSeeds += state.pot
  } else if (outcome === 'opponent') {
    npcSeeds += state.pot
  } else {
    // Tie: split pot (odd seed goes to NPC, consistent rule)
    const half = Math.floor(state.pot / 2)
    potWon = half
    playerSeeds += half
    npcSeeds += state.pot - half
  }

  return {
    ...state,
    phase: 'done',
    playerSeeds,
    npcSeeds,
    handsPlayed: state.handsPlayed + 1,
    callAmount: 0,
    result: {
      winner: outcome === 'opponent' ? 'npc' : outcome,
      playerHandName,
      npcHandName,
      potWon,
      playerFolded: false
    }
  }
}
