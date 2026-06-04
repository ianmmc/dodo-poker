import { describe, it, expect } from 'vitest'
import { runCardDrawSim } from './simulationEngine'

describe('runCardDrawSim', () => {
  it('returns the correct totalDraws', () => {
    expect(runCardDrawSim(100).totalDraws).toBe(100)
    expect(runCardDrawSim(1000).totalDraws).toBe(1000)
  })

  it('redCount + blackCount equals totalDraws', () => {
    const sim = runCardDrawSim(500)
    expect(sim.redCount + sim.blackCount).toBe(500)
  })

  it('results array has one entry per draw', () => {
    const sim = runCardDrawSim(200)
    expect(sim.results.length).toBe(200)
  })

  it('runningFreq stays in [0, 1]', () => {
    const sim = runCardDrawSim(300)
    for (const r of sim.results) {
      expect(r.runningFreq).toBeGreaterThanOrEqual(0)
      expect(r.runningFreq).toBeLessThanOrEqual(1)
    }
  })

  it('sampledPoints length does not exceed 500', () => {
    expect(runCardDrawSim(10000).sampledPoints.length).toBeLessThanOrEqual(500)
    expect(runCardDrawSim(100).sampledPoints.length).toBeLessThanOrEqual(500)
  })

  it('finalFreq converges near 0.5 over 100k draws (LLN sanity check)', () => {
    const sim = runCardDrawSim(100000)
    expect(sim.finalFreq).toBeGreaterThan(0.47)
    expect(sim.finalFreq).toBeLessThan(0.53)
  })
})
