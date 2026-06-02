import { Hand } from 'pokersolver'
import type { Card } from './card'

export interface EvaluatedHand {
  name: string
  rank: number
}

export function evaluateHand(cards: Card[]): EvaluatedHand {
  const solved = Hand.solve(cards)
  return { name: solved.name, rank: solved.rank }
}

export function pickWinner(
  playerCards: Card[],
  opponentCards: Card[]
): 'player' | 'opponent' | 'tie' {
  const playerHand = Hand.solve(playerCards)
  const opponentHand = Hand.solve(opponentCards)
  const winners = Hand.winners([playerHand, opponentHand])
  if (winners.length > 1) return 'tie'
  return winners[0] === playerHand ? 'player' : 'opponent'
}
