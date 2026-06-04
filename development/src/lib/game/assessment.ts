export type ResponseType = 'checklist' | 'numeric' | 'single-select' | 'estimate' | 'prediction'

export interface ChecklistFeedback {
  correct?: string
  attempt1Wrong?: string
  attempt2Wrong?: string
  attempt3Wrong?: string
}

export interface NumericFeedback {
  correct?: string
  tooHigh?: string
  tooLow?: string
  attempt3Wrong?: string
}

export interface AssessmentResult {
  correct: boolean
  attemptNumber: number
  feedbackNodeId: string | null
  exhausted: boolean
  templateVars?: Record<string, string | number>
}

export interface AssessmentRecord {
  nodeId: string
  responseType: ResponseType
  attempts: number
  correct: boolean
}

const attemptCounts = new Map<string, number>()
const assessmentLog: AssessmentRecord[] = []

export function evaluateChecklist(
  nodeId: string,
  selectedIds: string[],
  correctIds: string[],
  feedback: ChecklistFeedback
): AssessmentResult {
  const attempt = (attemptCounts.get(nodeId) ?? 0) + 1
  attemptCounts.set(nodeId, attempt)

  const selectedSet = new Set(selectedIds)
  const correctSet = new Set(correctIds)
  const correct =
    selectedIds.length === correctIds.length &&
    correctIds.every(id => selectedSet.has(id))

  if (correct) {
    return { correct: true, attemptNumber: attempt, feedbackNodeId: feedback.correct ?? null, exhausted: false }
  }

  const needToCheck = correctIds.filter(id => !selectedSet.has(id)).length
  const needToUncheck = selectedIds.filter(id => !correctSet.has(id)).length
  const exhausted = attempt >= 3

  let feedbackNodeId: string | null
  if (exhausted)       feedbackNodeId = feedback.attempt3Wrong ?? null
  else if (attempt === 1) feedbackNodeId = feedback.attempt1Wrong ?? null
  else                 feedbackNodeId = feedback.attempt2Wrong ?? null

  return { correct: false, attemptNumber: attempt, feedbackNodeId, exhausted, templateVars: { needToCheck, needToUncheck } }
}

export function evaluateNumeric(
  nodeId: string,
  value: number,
  correctValue: number,
  tolerance: number,
  feedback: NumericFeedback
): AssessmentResult {
  const attempt = (attemptCounts.get(nodeId) ?? 0) + 1
  attemptCounts.set(nodeId, attempt)

  const correct = Math.abs(value - correctValue) <= tolerance

  if (correct) {
    return { correct: true, attemptNumber: attempt, feedbackNodeId: feedback.correct ?? null, exhausted: false }
  }

  const exhausted = attempt >= 3
  let feedbackNodeId: string | null
  if (exhausted && feedback.attempt3Wrong) feedbackNodeId = feedback.attempt3Wrong
  else feedbackNodeId = value > correctValue ? (feedback.tooHigh ?? null) : (feedback.tooLow ?? null)

  return { correct: false, attemptNumber: attempt, feedbackNodeId, exhausted, templateVars: { entered: value, correct: correctValue } }
}

export function recordAssessment(entry: AssessmentRecord): void {
  const idx = assessmentLog.findIndex(r => r.nodeId === entry.nodeId)
  if (idx >= 0) assessmentLog[idx] = entry
  else assessmentLog.push(entry)
}

export function getAssessmentLog(): AssessmentRecord[] {
  return [...assessmentLog]
}

export function restoreAssessmentLog(entries: AssessmentRecord[]): void {
  assessmentLog.length = 0
  entries.forEach(e => assessmentLog.push(e))
}

export function resetAttemptCount(nodeId: string): void {
  attemptCounts.delete(nodeId)
}

export function clearAssessmentState(): void {
  attemptCounts.clear()
  assessmentLog.length = 0
}
