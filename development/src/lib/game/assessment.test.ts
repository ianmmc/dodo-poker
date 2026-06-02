import { describe, it, expect, beforeEach } from 'vitest'
import {
  evaluateChecklist,
  evaluateNumeric,
  recordAssessment,
  getAssessmentLog,
  restoreAssessmentLog,
  resetAttemptCount,
} from './assessment'

const CHECKLIST_FEEDBACK = {
  correct: 'node-correct',
  attempt1Wrong: 'node-hint1',
  attempt2Wrong: 'node-hint2',
  attempt3Wrong: 'node-reveal',
}

const NUMERIC_FEEDBACK = {
  correct: 'node-correct',
  tooHigh: 'node-too-high',
  tooLow: 'node-too-low',
  attempt3Wrong: 'node-reveal',
}

const CORRECT_IDS = ['a', 'c', 'e']

// ── Checklist ──────────────────────────────────────────────────────────────

describe('evaluateChecklist', () => {
  beforeEach(() => resetAttemptCount('check-node'))

  it('correct on first attempt', () => {
    const r = evaluateChecklist('check-node', ['a', 'c', 'e'], CORRECT_IDS, CHECKLIST_FEEDBACK)
    expect(r.correct).toBe(true)
    expect(r.attemptNumber).toBe(1)
    expect(r.feedbackNodeId).toBe('node-correct')
    expect(r.exhausted).toBe(false)
  })

  it('correct regardless of selection order', () => {
    const r = evaluateChecklist('check-node', ['e', 'a', 'c'], CORRECT_IDS, CHECKLIST_FEEDBACK)
    expect(r.correct).toBe(true)
  })

  it('routes to attempt1Wrong on first wrong answer', () => {
    const r = evaluateChecklist('check-node', ['a', 'b'], CORRECT_IDS, CHECKLIST_FEEDBACK)
    expect(r.correct).toBe(false)
    expect(r.feedbackNodeId).toBe('node-hint1')
    expect(r.exhausted).toBe(false)
  })

  it('routes to attempt2Wrong with quantity hints on second wrong answer', () => {
    evaluateChecklist('check-node', ['a', 'b'], CORRECT_IDS, CHECKLIST_FEEDBACK)
    const r = evaluateChecklist('check-node', ['a', 'b'], CORRECT_IDS, CHECKLIST_FEEDBACK)
    expect(r.feedbackNodeId).toBe('node-hint2')
    expect(r.templateVars?.needToCheck).toBe(2)  // c and e missing
    expect(r.templateVars?.needToUncheck).toBe(1) // b doesn't belong
    expect(r.exhausted).toBe(false)
  })

  it('routes to attempt3Wrong and marks exhausted on third wrong answer', () => {
    evaluateChecklist('check-node', ['a'], CORRECT_IDS, CHECKLIST_FEEDBACK)
    evaluateChecklist('check-node', ['a'], CORRECT_IDS, CHECKLIST_FEEDBACK)
    const r = evaluateChecklist('check-node', ['a'], CORRECT_IDS, CHECKLIST_FEEDBACK)
    expect(r.feedbackNodeId).toBe('node-reveal')
    expect(r.exhausted).toBe(true)
  })

  it('correct=true on second attempt resets exhausted', () => {
    evaluateChecklist('check-node', ['a'], CORRECT_IDS, CHECKLIST_FEEDBACK)
    const r = evaluateChecklist('check-node', ['a', 'c', 'e'], CORRECT_IDS, CHECKLIST_FEEDBACK)
    expect(r.correct).toBe(true)
    expect(r.exhausted).toBe(false)
  })

  it('needToCheck and needToUncheck are 0 when only extra items selected', () => {
    const r = evaluateChecklist('check-node', ['a', 'c', 'e', 'b'], CORRECT_IDS, CHECKLIST_FEEDBACK)
    expect(r.templateVars?.needToCheck).toBe(0)
    expect(r.templateVars?.needToUncheck).toBe(1)
  })
})

// ── Numeric ────────────────────────────────────────────────────────────────

describe('evaluateNumeric', () => {
  beforeEach(() => resetAttemptCount('num-node'))

  it('correct when value matches exactly', () => {
    const r = evaluateNumeric('num-node', 5, 5, 0, NUMERIC_FEEDBACK)
    expect(r.correct).toBe(true)
    expect(r.feedbackNodeId).toBe('node-correct')
  })

  it('correct when value is within tolerance', () => {
    const r = evaluateNumeric('num-node', 6, 5, 1, NUMERIC_FEEDBACK)
    expect(r.correct).toBe(true)
  })

  it('routes to tooHigh when value is above correct', () => {
    const r = evaluateNumeric('num-node', 10, 5, 0, NUMERIC_FEEDBACK)
    expect(r.feedbackNodeId).toBe('node-too-high')
    expect(r.correct).toBe(false)
  })

  it('routes to tooLow when value is below correct', () => {
    const r = evaluateNumeric('num-node', 3, 5, 0, NUMERIC_FEEDBACK)
    expect(r.feedbackNodeId).toBe('node-too-low')
  })

  it('routes to attempt3Wrong on third wrong answer', () => {
    evaluateNumeric('num-node', 10, 5, 0, NUMERIC_FEEDBACK)
    evaluateNumeric('num-node', 10, 5, 0, NUMERIC_FEEDBACK)
    const r = evaluateNumeric('num-node', 10, 5, 0, NUMERIC_FEEDBACK)
    expect(r.feedbackNodeId).toBe('node-reveal')
    expect(r.exhausted).toBe(true)
  })

  it('templateVars carry entered and correct values', () => {
    const r = evaluateNumeric('num-node', 3, 7, 0, NUMERIC_FEEDBACK)
    expect(r.templateVars?.entered).toBe(3)
    expect(r.templateVars?.correct).toBe(7)
  })
})

// ── Assessment log ─────────────────────────────────────────────────────────

describe('assessment log', () => {
  beforeEach(() => restoreAssessmentLog([]))

  it('records an entry', () => {
    recordAssessment({ nodeId: 'n1', responseType: 'checklist', attempts: 1, correct: true })
    expect(getAssessmentLog()).toHaveLength(1)
    expect(getAssessmentLog()[0].nodeId).toBe('n1')
  })

  it('updates existing entry for same nodeId', () => {
    recordAssessment({ nodeId: 'n1', responseType: 'checklist', attempts: 1, correct: false })
    recordAssessment({ nodeId: 'n1', responseType: 'checklist', attempts: 2, correct: true })
    const log = getAssessmentLog()
    expect(log).toHaveLength(1)
    expect(log[0].attempts).toBe(2)
    expect(log[0].correct).toBe(true)
  })

  it('stores multiple distinct entries', () => {
    recordAssessment({ nodeId: 'n1', responseType: 'checklist', attempts: 1, correct: true })
    recordAssessment({ nodeId: 'n2', responseType: 'numeric', attempts: 3, correct: false })
    expect(getAssessmentLog()).toHaveLength(2)
  })

  it('restores log from saved data', () => {
    const saved = [
      { nodeId: 'a1', responseType: 'checklist' as const, attempts: 1, correct: true },
      { nodeId: 'a2', responseType: 'numeric' as const, attempts: 3, correct: false },
    ]
    restoreAssessmentLog(saved)
    expect(getAssessmentLog()).toHaveLength(2)
    expect(getAssessmentLog()[1].nodeId).toBe('a2')
  })

  it('getAssessmentLog returns a copy, not the internal array', () => {
    recordAssessment({ nodeId: 'n1', responseType: 'checklist', attempts: 1, correct: true })
    const log = getAssessmentLog()
    log.pop()
    expect(getAssessmentLog()).toHaveLength(1)
  })
})
