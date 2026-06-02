import { describe, it, expect } from 'vitest'
import { createGame, startHand, playerCheck, playerBet, playerCall, playerFold, playerDraw } from './fiveCardDraw'

describe('startHand', () => {
  it('deals 5 cards to each player', () => {
    const state = startHand(createGame())
    expect(state.playerHand).toHaveLength(5)
    expect(state.hankHand).toHaveLength(5)
  })

  it('no card appears in both hands', () => {
    const state = startHand(createGame())
    const allCards = [...state.playerHand, ...state.hankHand]
    expect(new Set(allCards).size).toBe(10)
  })

  it('takes the ante from both players', () => {
    const game = createGame(100, 5, 5)
    const state = startHand(game)
    expect(state.playerSeeds).toBe(95)
    expect(state.hankSeeds).toBe(95)
    expect(state.pot).toBe(10)
  })

  it('increments the hand number', () => {
    const game = createGame()
    const state = startHand(game)
    expect(state.handNumber).toBe(1)
  })

  it('leaves 42 cards in the deck after dealing', () => {
    const state = startHand(createGame())
    expect(state.deck).toHaveLength(42)
  })
})

describe('playerFold', () => {
  it('gives the pot to Hank', () => {
    const state = startHand(createGame(100, 5, 5))
    const folded = playerFold(state)
    expect(folded.hankSeeds).toBe(state.hankSeeds + state.pot)
  })

  it('sets phase to done', () => {
    const state = startHand(createGame())
    expect(playerFold(state).phase).toBe('done')
  })

  it('records player folded in result', () => {
    const state = startHand(createGame())
    const folded = playerFold(state)
    expect(folded.result?.playerFolded).toBe(true)
    expect(folded.result?.winner).toBe('hank')
  })
})

describe('playerCheck', () => {
  it('sets hankPendingBet to true', () => {
    const state = startHand(createGame())
    expect(playerCheck(state).hankPendingBet).toBe(true)
  })

  it('adds Hank bet to pot', () => {
    const game = createGame(100, 5, 5)
    const state = startHand(game)
    const checked = playerCheck(state)
    expect(checked.pot).toBe(state.pot + game.betAmount)
    expect(checked.hankSeeds).toBe(state.hankSeeds - game.betAmount)
  })
})

describe('playerBet (round 1)', () => {
  it('moves to draw phase', () => {
    const state = startHand(createGame())
    expect(playerBet(state).phase).toBe('draw')
  })

  it('adds both player and Hank bets to pot', () => {
    const game = createGame(100, 5, 5)
    const state = startHand(game)
    const bet = playerBet(state)
    expect(bet.pot).toBe(state.pot + game.betAmount * 2)
  })
})

describe('playerCall', () => {
  it('moves to draw phase from bet1', () => {
    const state = playerCheck(startHand(createGame()))
    expect(playerCall(state).phase).toBe('draw')
  })

  it('adds call amount to pot', () => {
    const game = createGame(100, 5, 5)
    const checked = playerCheck(startHand(game))
    const called = playerCall(checked)
    expect(called.playerSeeds).toBe(checked.playerSeeds - game.betAmount)
    expect(called.pot).toBe(checked.pot + game.betAmount)
  })
})

describe('playerDraw', () => {
  it('replaces the correct number of cards', () => {
    const state = playerBet(startHand(createGame())) // goes to draw phase
    const before = [...state.playerHand]
    const drawn = playerDraw(state, [0, 2, 4])
    expect(drawn.playerHand).toHaveLength(5)
    // cards at indices 1 and 3 should be unchanged
    expect(drawn.playerHand[1]).toBe(before[1])
    expect(drawn.playerHand[3]).toBe(before[3])
  })

  it('keeping all cards leaves the hand unchanged', () => {
    const state = playerBet(startHand(createGame()))
    const before = [...state.playerHand]
    const drawn = playerDraw(state, [])
    expect(drawn.playerHand).toEqual(before)
  })

  it('moves to bet2 phase', () => {
    const state = playerBet(startHand(createGame()))
    expect(playerDraw(state, []).phase).toBe('bet2')
  })

  it('all 10 player + hank cards are unique after draw', () => {
    const state = playerBet(startHand(createGame()))
    const drawn = playerDraw(state, [0, 1, 2])
    const all = [...drawn.playerHand, ...drawn.hankHand]
    expect(new Set(all).size).toBe(10)
  })
})

describe('full hand — player wins at showdown', () => {
  it('resolves with a result and phase done', () => {
    let state = startHand(createGame())
    state = playerBet(state)         // bet1 → draw
    state = playerDraw(state, [])    // keep hand, draw phase → bet2
    state = playerBet(state)         // bet2 → done (showdown)
    expect(state.phase).toBe('done')
    expect(state.result).not.toBeNull()
    expect(['player', 'hank', 'tie']).toContain(state.result?.winner)
  })

  it('total seeds across player + hank equals starting amount', () => {
    let state = startHand(createGame(100, 5, 5))
    state = playerBet(state)
    state = playerDraw(state, [])
    state = playerBet(state)
    expect(state.playerSeeds + state.hankSeeds).toBe(200)
  })
})
