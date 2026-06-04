import { makeDeck, shuffle } from './card'
import { evaluateHand, pickWinner } from './hand'
import { hank } from './npc'
import type { Card } from './card'
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
    result: null
  }
}

export function startHand(state: GameState): GameState {
  const deck = shuffle(makeDeck())
  return {
    ...state,
    phase: 'bet1',
    deck: deck.slice(10),
    playerHand: deck.slice(0, 5) as Card[],
    npcHand: deck.slice(5, 10) as Card[],
    pot: state.ante * 2,
    playerSeeds: state.playerSeeds - state.ante,
    npcSeeds: state.npcSeeds - state.ante,
    npcPendingBet: false,
    npcLastAction: null,
    npcDrawCount: 0,
    playerDrawCount: -1,
    handNumber: state.handNumber + 1,
    result: null
  }
}

export function startScriptedHand(state: GameState, deal: ScriptedDeal): GameState {
  const usedCards = new Set([...deal.playerCards, ...deal.npcCards])
  const remainingDeck = shuffle(makeDeck().filter(c => !usedCards.has(c)))
  return {
    ...state,
    phase: 'bet1',
    deck: remainingDeck,
    playerHand: deal.playerCards,
    npcHand: deal.npcCards,
    pot: state.ante * 2,
    playerSeeds: state.playerSeeds - state.ante,
    npcSeeds: state.npcSeeds - state.ante,
    npcPendingBet: false,
    npcLastAction: null,
    npcDrawCount: 0,
    playerDrawCount: -1,
    handNumber: state.handNumber + 1,
    result: null,
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
    npcLastAction: 'bet'
  }
}

// Both players check. Advances to draw (bet1) or resolves showdown (bet2).
export function playerCheckNpcCheck(state: GameState): GameState {
  const base = {
    ...state,
    npcPendingBet: false,
    npcLastAction: 'check' as NpcAction
  }
  if (state.phase === 'bet2') return resolveShowdown(base)
  return { ...base, phase: 'draw' }
}

// Player bets; NPC calls.
export function playerBet(state: GameState): GameState {
  const amount = state.betAmount
  const nextPhase: Phase = state.phase === 'bet1' ? 'draw' : 'done'
  const base = {
    ...state,
    pot: state.pot + amount * 2, // player bet + npc call
    playerSeeds: state.playerSeeds - amount,
    npcSeeds: state.npcSeeds - amount,
    npcPendingBet: false,
    npcLastAction: 'call' as NpcAction
  }
  return nextPhase === 'done' ? resolveShowdown(base) : { ...base, phase: 'draw' }
}

// Player calls the NPC's pending bet.
export function playerCall(state: GameState): GameState {
  const amount = state.betAmount
  const nextPhase: Phase = state.phase === 'bet1' ? 'draw' : 'done'
  const base = {
    ...state,
    pot: state.pot + amount,
    playerSeeds: state.playerSeeds - amount,
    npcPendingBet: false,
    npcLastAction: null as NpcAction
  }
  return nextPhase === 'done' ? resolveShowdown(base) : { ...base, phase: 'draw' }
}

// Player folds. NPC takes the pot.
export function playerFold(state: GameState): GameState {
  return {
    ...state,
    phase: 'done',
    npcSeeds: state.npcSeeds + state.pot,
    handsPlayed: state.handsPlayed + 1,
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
export function playerDraw(state: GameState, discardIndices: number[]): GameState {
  const deck = [...state.deck]
  const playerHand = [...state.playerHand] as Card[]

  for (const idx of discardIndices) {
    playerHand[idx] = deck.pop()!
  }

  const npcDrawDecision = hank.decideDraw(state.npcHand)
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
    playerDrawCount: discardIndices.length,
    npcPendingBet: false,
    npcLastAction: null
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
    result: {
      winner: outcome === 'opponent' ? 'npc' : outcome,
      playerHandName,
      npcHandName,
      potWon,
      playerFolded: false
    }
  }
}
