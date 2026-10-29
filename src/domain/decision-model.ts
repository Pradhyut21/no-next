export type DecisionId = 'warn' | 'unknown' | 'ignore';

export interface Decision {
  id: DecisionId;
  label: string;
  consequence: string;
  principle: string;
  summary: string;
}

export const decisions: readonly Decision[] = [
  {
    id: 'warn',
    label: 'Send an urgent warning',
    consequence:
      'An urgent message may prompt action, but the stale reading cannot support a confident forecast. It could create unnecessary alarm.',
    principle: 'Urgency does not make old evidence current.',
    summary:
      'The portfolio branch is hypothetical. JalRakshak withholds its forecast when readings are stale or missing.',
  },
  {
    id: 'unknown',
    label: 'Mark UNKNOWN. Get a fresh reading.',
    consequence:
      'Make the uncertainty visible, request a current observation, and ask the caretaker to review the situation before deciding.',
    principle: 'Missing evidence deserves an explicit state.',
    summary:
      'This matches the documented JalRakshak behavior: stale or missing readings yield UNKNOWN, with no confident depletion forecast.',
  },
  {
    id: 'ignore',
    label: 'Ignore the issue indefinitely',
    consequence:
      'Avoiding a false alarm does not resolve the evidence gap. Without a follow-up, a genuine supply problem could remain unexamined.',
    principle: 'Uncertainty needs a next action, not silence.',
    summary:
      'This is a hypothetical consequence, not a real incident. JalRakshak surfaces missing evidence for human review; it does not contact suppliers.',
  },
];

export function evaluateDecision(id: DecisionId): Decision {
  const decision = decisions.find((entry) => entry.id === id);
  if (!decision) throw new Error('Unknown portfolio decision.');
  return decision;
}
