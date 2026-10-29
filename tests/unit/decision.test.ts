import { describe, expect, it } from 'vitest';
import { decisions, evaluateDecision } from '../../src/domain/decision-model';

describe('JalRakshak portfolio decision', () => {
  it('provides exactly three distinct educational branches', () => {
    expect(decisions.map((entry) => entry.id)).toEqual(['warn', 'unknown', 'ignore']);
    expect(new Set(decisions.map((entry) => entry.consequence)).size).toBe(3);
  });

  it.each(decisions)('returns the same documented reasoning for $id', (decision) => {
    expect(evaluateDecision(decision.id)).toEqual(decision);
    expect(evaluateDecision(decision.id)).toEqual(evaluateDecision(decision.id));
  });

  it('explains UNKNOWN as the documented missing-evidence behavior', () => {
    const result = evaluateDecision('unknown');
    expect(result.summary).toContain('stale or missing readings yield UNKNOWN');
    expect(result.consequence).toContain('caretaker');
  });
});
