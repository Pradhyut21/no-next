import { describe, expect, it } from 'vitest';
import pending from '../../src/content/pilot-results.json';
import { formatRate, getPilotMetrics } from '../../src/domain/pilot-metrics';
import { parsePilotResults, type PilotResults } from '../../src/domain/pilot-schema';

// Synthetic values are confined to the automated test suite.
function fixture(): PilotResults {
  return {
    schemaVersion: 1,
    status: 'complete',
    dates: { start: '2026-10-29', end: '2026-10-30' },
    recruitment: {
      description: 'Synthetic test cohort.',
      uniqueInvited: 20,
      invitationDeliveries: 25,
      volunteered: 12,
      consented: 10,
      started: 8,
      completed: 6,
    },
    usability: { yes: 3, no: 1, notAsked: 2 },
    reuse: { yes: 2, no: 3, notAsked: 1 },
    devices: [{ label: 'Windows', count: 10 }],
    languages: [{ label: 'English', count: 10 }],
    creativeExposures: [{ label: 'A', count: 10 }],
    friction: [],
    limitations: ['Synthetic test only.'],
    lessons: [],
    nextTest: null,
  };
}

describe('public pilot data contract', () => {
  it('accepts the truthful pending manifest without turning missing counts into zero', () => {
    const parsed = parsePilotResults(pending);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.recruitment.started).toBeNull();
    expect(
      getPilotMetrics(pending as PilotResults).every(
        (metric) => metric.display === 'Not available',
      ),
    ).toBe(true);
  });

  it('accepts a consistent cohort', () => expect(parsePilotResults(fixture()).success).toBe(true));

  it.each([-1, 1.5, Number.NaN, Infinity])('rejects invalid count %s', (value) => {
    const pilot = fixture();
    pilot.recruitment.started = value;
    expect(parsePilotResults(pilot).success).toBe(false);
  });

  it('rejects impossible funnels', () => {
    const pilot = fixture();
    pilot.recruitment.completed = 9;
    expect(parsePilotResults(pilot).success).toBe(false);
  });

  it('checks known stages across an unknown intermediate stage', () => {
    const pilot = fixture();
    pilot.recruitment.volunteered = null;
    pilot.recruitment.consented = null;
    pilot.recruitment.started = 21;
    expect(parsePilotResults(pilot).success).toBe(false);
  });

  it('does not confuse invitation deliveries with unique people', () => {
    const pilot = fixture();
    pilot.recruitment.invitationDeliveries = 19;
    expect(parsePilotResults(pilot).success).toBe(false);
  });

  it.each(['usability', 'reuse'] as const)(
    'rejects %s responses beyond completed participants',
    (field) => {
      const pilot = fixture();
      pilot[field].yes = 7;
      pilot[field].no = null;
      pilot[field].notAsked = null;
      expect(parsePilotResults(pilot).success).toBe(false);
    },
  );

  it.each(['usability', 'reuse'] as const)(
    'bounds %s feedback by known upstream stages when completion is unknown',
    (field) => {
      const pilot = fixture();
      pilot.recruitment.completed = null;
      pilot[field] = { yes: 9, no: 0, notAsked: 0 };
      expect(parsePilotResults(pilot).success).toBe(false);
      pilot.recruitment.started = null;
      pilot[field].yes = 11;
      expect(parsePilotResults(pilot).success).toBe(false);
    },
  );

  it('rejects extra participant-level fields', () => {
    expect(parsePilotResults({ ...fixture(), participants: [{ name: 'PRIVATE' }] }).success).toBe(
      false,
    );
  });

  it('rejects reversed dates and nonexistent calendar dates', () => {
    const pilot = fixture();
    pilot.dates.end = '2026-10-28';
    expect(parsePilotResults(pilot).success).toBe(false);
    pilot.dates.end = '2026-02-30';
    expect(parsePilotResults(pilot).success).toBe(false);
  });

  it('rejects a category count larger than the consenting cohort', () => {
    const pilot = fixture();
    pilot.devices.push({ label: 'macOS', count: 11 });
    expect(parsePilotResults(pilot).success).toBe(false);
  });

  it('allows participants to test more than one language', () => {
    const pilot = fixture();
    pilot.languages.push({ label: 'Hinglish', count: 8 });
    expect(parsePilotResults(pilot).success).toBe(true);
  });
});

describe('pilot metrics', () => {
  it('uses consenting adults and unique invitations for participation', () => {
    const metrics = getPilotMetrics(fixture());
    expect(metrics.find((metric) => metric.id === 'participation')?.display).toBe(
      '10 of 20 · 50.0%',
    );
    expect(metrics.find((metric) => metric.id === 'activation')?.display).toBe('6 of 8 · 75.0%');
    expect(metrics.find((metric) => metric.id === 'invitation-completion')?.display).toBe(
      '6 of 20 · 30.0%',
    );
  });

  it('excludes Not asked from both feedback denominators', () => {
    const metrics = getPilotMetrics(fixture());
    expect(metrics.find((metric) => metric.id === 'usability')?.display).toBe('3 of 4 · 75.0%');
    expect(metrics.find((metric) => metric.id === 'reuse')?.display).toBe('2 of 5 · 40.0%');
  });

  it('keeps usability available if the Not asked count is unknown', () => {
    const pilot = fixture();
    pilot.usability.notAsked = null;
    expect(getPilotMetrics(pilot).find((metric) => metric.id === 'usability')?.display).toBe(
      '3 of 4 · 75.0%',
    );
  });

  it('does not invent a respondent denominator when No is unknown', () => {
    const pilot = fixture();
    pilot.usability.no = null;
    expect(getPilotMetrics(pilot).find((metric) => metric.id === 'usability')?.display).toBe(
      'Not available',
    );
  });

  it('distinguishes an observed zero from missing data', () => {
    expect(formatRate(0, 8)).toBe('0 of 8 · 0.0%');
    expect(formatRate(null, 8)).toBe('Not available');
  });

  it('never divides by zero or uses an impossible ratio', () => {
    expect(formatRate(0, 0)).toBe('Not available');
    expect(formatRate(5, 4)).toBe('Not available');
    expect(formatRate(1, null)).toBe('Not available');
  });

  it('rounds to one decimal while retaining the raw fraction', () =>
    expect(formatRate(1, 3)).toBe('1 of 3 · 33.3%'));
});
