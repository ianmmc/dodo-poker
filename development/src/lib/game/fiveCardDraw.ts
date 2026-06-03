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

export type HankAction = 'bet' | 'call' | 'check' | null

export interface HandResult {
  winner: 'player' | 'hank' | 'tie'
  playerHandName: string
  hankHandName: string
  potWon: number
  playerFolded: boolean
  hankFolded?: boolean
}

export interface GameState {
  phase: Phase
  deck: Card[]
  playerHand: Card[]
  hankHand: Card[]
  playerSeeds: number
  hankSeeds: number
  pot: number
  betAmount: number
  ante: number
  // True when Hank has bet in the current round and player must call or fold
  hankPendingBet: boolean
  hankLastAction: HankAction
  hankDrawCount: number
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
    hankHand: [],
    playerSeeds: startingSeeds,
    hankSeeds: startingSeeds,
    pot: 0,
    betAmount,
    ante,
    hankPendingBet: false,
    hankLastAction: null,
    hankDrawCount: 0,
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
    hankHand: deck.slice(5, 10) as Card[],
    pot: state.ante * 2,
    playerSeeds: state.playerSeeds - state.ante,
    hankSeeds: state.hankSeeds - state.ante,
    hankPendingBet: false,
    hankLastAction: null,
    hankDrawCount: 0,
    playerDrawCount: -1,
    handNumber: state.handNumber + 1,
    result: null
  }
}

export function startScriptedHand(state: GameState, deal: ScriptedDeal): GameState {
  const usedCards = new Set([...deal.playerCards, ...deal.hankCards])
  const remainingDeck = shuffle(makeDeck().filter(c => !usedCards.has(c)))
  return {
    ...state,
    phase: 'bet1',
    deck: remainingDeck,
    playerHand: deal.playerCards,
    hankHand: deal.hankCards,
    pot: state.ante * 2,
    playerSeeds: state.playerSeeds - state.ante,
    hankSeeds: state.hankSeeds - state.ante,
    hankPendingBet: false,
    hankLastAction: null,
    hankDrawCount: 0,
    playerDrawCount: -1,
    handNumber: state.handNumber + 1,
    result: null,
  }
}

// Player checks. Hank always bets in response.
export function playerCheck(state: GameState): GameState {
  const hankBet = state.betAmount
  return {
    ...state,
    pot: state.pot + hankBet,
    hankSeeds: state.hankSeeds - hankBet,
    hankPendingBet: true,
    hankLastAction: 'bet'
  }
}

// Player bets. Hank always calls.
export function playerBet(state: GameState): GameState {
  const amount = state.betAmount
  const nextPhase: Phase = state.phase === 'bet1' ? 'draw' : 'done'
  const base = {
    ...state,
    pot: state.pot + amount * 2, // player + hank call
    playerSeeds: state.playerSeeds - amount,
    hankSeeds: state.hankSeeds - amount,
    hankPendingBet: false,
    hankLastAction: 'call' as HankAction
  }
  return nextPhase === 'done' ? resolveShowdown(base) : { ...base, phase: 'draw' }
}

// Player calls Hank's pending bet.
export function playerCall(state: GameState): GameState {
  const amount = state.betAmount
  const nextPhase: Phase = state.phase === 'bet1' ? 'draw' : 'done'
  const base = {
    ...state,
    pot: state.pot + amount,
    playerSeeds: state.playerSeeds - amount,
    hankPendingBet: false,
    hankLastAction: null as HankAction
  }
  return nextPhase === 'done' ? resolveShowdown(base) : { ...base, phase: 'draw' }
}

// Player folds. Hank takes the pot.
export function playerFold(state: GameState): GameState {
  return {
    ...state,
    phase: 'done',
    hankSeeds: state.hankSeeds + state.pot,
    handsPlayed: state.handsPlayed + 1,
    result: {
      winner: 'hank',
      playerHandName: 'folded',
      hankHandName: '—',
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
      hankHandName: '—',
      potWon: state.pot,
      playerFolded: false,
      hankFolded: true,
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

  const hankDrawDecision = hank.decideDraw(state.hankHand)
  const hankHand = [...state.hankHand] as Card[]
  for (const idx of hankDrawDecision.discardIndices) {
    hankHand[idx] = deck.pop()!
  }

  return {
    ...state,
    phase: 'bet2',
    deck,
    playerHand,
    hankHand,
    hankDrawCount: hankDrawDecision.discardIndices.length,
    playerDrawCount: discardIndices.length,
    hankPendingBet: false,
    hankLastAction: null
  }
}

function resolveShowdown(state: GameState): GameState {
  const outcome = pickWinner(state.playerHand, state.hankHand)
  const playerHandName = evaluateHand(state.playerHand).name
  const hankHandName = evaluateHand(state.hankHand).name

  let potWon = 0
  let playerSeeds = state.playerSeeds
  let hankSeeds = state.hankSeeds

  if (outcome === 'player') {
    potWon = state.pot
    playerSeeds += state.pot
  } else if (outcome === 'opponent') {
    hankSeeds += state.pot
  } else {
    // Tie: split pot (odd seed goes to Hank, consistent rule)
    const half = Math.floor(state.pot / 2)
    potWon = half
    playerSeeds += half
    hankSeeds += state.pot - half
  }

  return {
    ...state,
    phase: 'done',
    playerSeeds,
    hankSeeds,
    handsPlayed: state.handsPlayed + 1,
    result: {
      winner: outcome === 'opponent' ? 'hank' : outcome,
      playerHandName,
      hankHandName,
      potWon,
      playerFolded: false
    }
  }
}
