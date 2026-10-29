import { z } from 'zod';

const count = z.number().int().nonnegative().nullable();
const date = z.iso.date().nullable();
const responseCounts = z.strictObject({ yes: count, no: count, notAsked: count });
const breakdown = z.array(z.strictObject({ label: z.string().trim().min(1), count }));

/** Public aggregate data only. The private participant workbook is never imported. */
export const pilotResultsSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    status: z.enum(['planned', 'running', 'complete']),
    dates: z.strictObject({ start: date, end: date }),
    recruitment: z.strictObject({
      description: z.string().trim().min(1).nullable(),
      uniqueInvited: count,
      invitationDeliveries: count,
      volunteered: count,
      consented: count,
      started: count,
      completed: count,
    }),
    usability: responseCounts,
    reuse: responseCounts,
    devices: breakdown,
    languages: breakdown,
    creativeExposures: breakdown,
    friction: z.array(z.string().trim().min(1)),
    limitations: z.array(z.string().trim().min(1)),
    lessons: z.array(z.string().trim().min(1)),
    nextTest: z.string().trim().min(1).nullable(),
  })
  .superRefine((pilot, ctx) => {
    const stages = ['uniqueInvited', 'volunteered', 'consented', 'started', 'completed'] as const;
    // Compare every known pair: a missing intermediate stage must not hide an impossible funnel.
    for (let before = 0; before < stages.length; before += 1) {
      for (let after = before + 1; after < stages.length; after += 1) {
        const earlierKey = stages[before];
        const laterKey = stages[after];
        if (!earlierKey || !laterKey) continue;
        const earlier = pilot.recruitment[earlierKey];
        const later = pilot.recruitment[laterKey];
        if (earlier !== null && later !== null && later > earlier) {
          ctx.addIssue({
            code: 'custom',
            path: ['recruitment', laterKey],
            message: `${laterKey} cannot exceed ${earlierKey}.`,
          });
        }
      }
    }

    const { uniqueInvited, invitationDeliveries } = pilot.recruitment;
    if (
      uniqueInvited !== null &&
      invitationDeliveries !== null &&
      uniqueInvited > invitationDeliveries
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['recruitment', 'uniqueInvited'],
        message: 'Unique invited adults cannot exceed invitation deliveries.',
      });
    }

    for (const field of ['usability', 'reuse'] as const) {
      const responses = pilot[field];
      const knownTotal = Object.values(responses).reduce<number>(
        (total, value) => total + (value ?? 0),
        0,
      );
      for (const stage of stages) {
        const maximum = pilot.recruitment[stage];
        if (maximum !== null && knownTotal > maximum) {
          ctx.addIssue({
            code: 'custom',
            path: [field],
            message: `${field} responses and not-asked counts cannot exceed ${stage}.`,
          });
        }
      }
    }

    if (
      pilot.dates.start !== null &&
      pilot.dates.end !== null &&
      pilot.dates.end < pilot.dates.start
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['dates', 'end'],
        message: 'End date cannot precede start date.',
      });
    }

    // A participant can test multiple languages or devices; categories may overlap.
    for (const field of ['devices', 'languages'] as const) {
      for (const [index, entry] of pilot[field].entries()) {
        // A missing consent count must not bypass a known recruitment bound.
        // Categories may be recorded before a participant starts dictating.
        for (const stage of ['uniqueInvited', 'volunteered', 'consented'] as const) {
          const maximum = pilot.recruitment[stage];
          if (maximum !== null && entry.count !== null && entry.count > maximum) {
            ctx.addIssue({
              code: 'custom',
              path: [field, index, 'count'],
              message: `${field} category count cannot exceed ${stage}.`,
            });
          }
        }
      }
    }
  });

export type PilotResults = z.infer<typeof pilotResultsSchema>;

export function parsePilotResults(input: unknown) {
  return pilotResultsSchema.safeParse(input);
}
