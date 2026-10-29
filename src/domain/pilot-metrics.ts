import type { PilotResults } from './pilot-schema';

export interface PilotMetric {
  id: 'participation' | 'activation' | 'invitation-completion' | 'usability' | 'reuse';
  label: string;
  numerator: number | null;
  denominator: number | null;
  display: string;
  detail: string;
}

export function formatRate(numerator: number | null, denominator: number | null): string {
  if (numerator === null || denominator === null || denominator === 0) return 'Not available';
  if (
    !Number.isInteger(numerator) ||
    !Number.isInteger(denominator) ||
    numerator < 0 ||
    denominator < 0 ||
    numerator > denominator
  ) {
    return 'Not available';
  }
  return `${numerator} of ${denominator} · ${((numerator / denominator) * 100).toFixed(1)}%`;
}

function respondentCount(responses: PilotResults['usability']): number | null {
  return responses.yes === null || responses.no === null ? null : responses.yes + responses.no;
}

/** Every rate preserves its actual population; "Not asked" is never a negative response. */
export function getPilotMetrics(pilot: PilotResults): PilotMetric[] {
  const { consented, uniqueInvited, completed, started } = pilot.recruitment;
  const definitions: Omit<PilotMetric, 'display'>[] = [
    {
      id: 'participation',
      label: 'Invitation → participation',
      numerator: consented,
      denominator: uniqueInvited,
      detail:
        'Consenting adults / unique adults invited. Invitation deliveries are counted separately.',
    },
    {
      id: 'activation',
      label: 'Start → completion',
      numerator: completed,
      denominator: started,
      detail: 'Completed a real dictation / participants who started Flow.',
    },
    {
      id: 'invitation-completion',
      label: 'Invitation → completion',
      numerator: completed,
      denominator: uniqueInvited,
      detail: 'Completed a real dictation / unique adults invited.',
    },
    {
      id: 'usability',
      label: 'Reported usable text',
      numerator: pilot.usability.yes,
      denominator: respondentCount(pilot.usability),
      detail:
        'Yes / people who answered Yes or No. Participant judgment, not measured transcription accuracy.',
    },
    {
      id: 'reuse',
      label: 'Would use again',
      numerator: pilot.reuse.yes,
      denominator: respondentCount(pilot.reuse),
      detail: 'Yes / people who answered Yes or No. Stated intent, not observed return use.',
    },
  ];
  return definitions.map((metric) => ({
    ...metric,
    display: formatRate(metric.numerator, metric.denominator),
  }));
}
