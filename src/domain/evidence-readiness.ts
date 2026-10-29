import { parsePilotResults } from './pilot-schema';
import { voiceEvidenceSchema } from '../content/voice-evidence';

/** Labels are derived from the same validated aggregates used in the campaign. */
export function getEvidenceReadiness(pilotInput: unknown, voiceInput: unknown) {
  const pilot = parsePilotResults(pilotInput);
  const voice = voiceEvidenceSchema.safeParse(voiceInput);
  const hasPilotObservations =
    pilot.success &&
    pilot.data.status !== 'planned' &&
    Object.entries(pilot.data.recruitment).some(
      ([key, value]) => key !== 'description' && value !== null,
    );
  return {
    hasPilotObservations,
    pilotLabel: !pilot.success
      ? 'Results unavailable'
      : hasPilotObservations
        ? pilot.data.status === 'complete'
          ? 'Pilot findings available'
          : 'Pilot underway · early observations'
        : 'Experiment in progress',
    pilotFooter: !pilot.success
      ? 'Pilot results unavailable: aggregate data needs correction.'
      : hasPilotObservations
        ? 'Pilot findings are reported with their actual denominators.'
        : 'Pilot results pending.',
    voiceFooter: !voice.success
      ? 'Voice-development evidence unavailable: manifest needs correction.'
      : voice.data.length > 0
        ? 'Inspect the original voice-development evidence above.'
        : 'Voice-development evidence pending.',
  };
}
