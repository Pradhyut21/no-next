import { describe, expect, it } from 'vitest';
import { getEvidenceReadiness } from '../../src/domain/evidence-readiness';
import pending from '../../src/content/pilot-results.json';

describe('consistent evidence readiness across the public page', () => {
  it('labels missing observations as pending', () => {
    const state = getEvidenceReadiness(pending, []);
    expect(state.pilotLabel).toBe('Experiment in progress');
    expect(state.hasPilotObservations).toBe(false);
    expect(state.voiceFooter).toBe('Voice-development evidence pending.');
  });

  it('does not describe invalid aggregates or voice entries as findings', () => {
    const state = getEvidenceReadiness(
      { ...pending, status: 'complete', recruitment: { ...pending.recruitment, consented: -1 } },
      [{ id: 'incomplete' }],
    );
    expect(state.pilotLabel).toBe('Results unavailable');
    expect(state.pilotFooter).toContain('needs correction');
    expect(state.voiceFooter).toContain('needs correction');
  });

  it('keeps a completed but empty manifest pending', () => {
    expect(getEvidenceReadiness({ ...pending, status: 'complete' }, []).hasPilotObservations).toBe(
      false,
    );
  });

  it('shows observed zero and partial findings without claiming completion', () => {
    const state = getEvidenceReadiness(
      { ...pending, status: 'running', recruitment: { ...pending.recruitment, uniqueInvited: 0 } },
      [],
    );
    expect(state.hasPilotObservations).toBe(true);
    expect(state.pilotLabel).toBe('Pilot underway · early observations');
  });

  it('labels a validated complete observation as findings', () => {
    const state = getEvidenceReadiness(
      { ...pending, status: 'complete', recruitment: { ...pending.recruitment, uniqueInvited: 0 } },
      [],
    );
    expect(state.pilotLabel).toBe('Pilot findings available');
    expect(state.pilotFooter).toContain('actual denominators');
  });
});
