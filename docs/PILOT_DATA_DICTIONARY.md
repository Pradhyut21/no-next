# Pilot data dictionary

The private tracker is a source record, not a website asset. Its participant and reach logs were empty when inspected. The public JSON is manually populated from reviewed aggregates; no automatic workbook import or participant data upload is implemented.

## Counts and populations

| Public field               | Meaning and source                                                                                                                                             |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaVersion`            | `1`; rejects incompatible content formats.                                                                                                                     |
| `status`                   | `planned`, `running`, or `complete`; update only to reflect actual fieldwork.                                                                                  |
| `dates.start`, `dates.end` | Actual observation dates in `YYYY-MM-DD`, otherwise null.                                                                                                      |
| `recruitment.description`  | Actual channels and recruitment method, otherwise null.                                                                                                        |
| `uniqueInvited`            | Deduplicated adult invitees. Maintain a private aggregate tally; do not substitute delivery volume. Leave null when deduplication cannot be established.       |
| `invitationDeliveries`     | Delivered invitations, including any repeats. Reach Log column D.                                                                                              |
| `volunteered`              | Unique adults who expressed interest. Review Reach Log column E for duplicate replies before publishing.                                                       |
| `consented`                | Adults with session consent. Count nonblank valid IDs in Participant Log column A, assigned after consent; blank formatted rows do not count.                  |
| `started`                  | Actual Flow starts, Participant Log G = Yes. Installation alone is insufficient.                                                                               |
| `completed`                | One actual dictation completed, Participant Log H = Yes.                                                                                                       |
| `usability`                | Counts of Yes, No, and Not asked from Participant Log I.                                                                                                       |
| `reuse`                    | Counts of Yes, No, and Not asked from Participant Log J. Stated intention, not retention.                                                                      |
| `devices`, `languages`     | Arrays of label/count aggregates from Participant Log F/E. Categories may overlap if participants tested multiple settings.                                    |
| `creativeExposures`        | Label/count aggregates with the population stated in the label. Distinguish participant exposure (Participant Log D) from outreach deliveries (Reach Log C/D). |
| `friction`                 | Anonymized observed themes from K/L, without dictated text or identifying notes.                                                                               |
| `limitations`              | Actual recruitment bias, unrepresented groups, language/device constraints, and other sample limitations.                                                      |
| `lessons`                  | Supported interpretations, including failures. No causal creative winner from an observational convenience sample.                                             |
| `nextTest`                 | A proposed follow-up based on observations, clearly distinguished from a completed action.                                                                     |

All counts are nonnegative integers or null. Do not fill blank observations with zero. Funnel stages satisfy unique invited ≥ volunteered ≥ consented ≥ started ≥ completed when the relevant values are known. Missing intermediate counts must not permit impossible known totals. Feedback cannot exceed known upstream participant counts. Invitation deliveries can exceed unique adults because invitations may repeat.

## Metrics

| Metric                     | Numerator / denominator           |
| -------------------------- | --------------------------------- |
| Invitation → participation | Consented / unique adults invited |
| Start → completion         | Completed / actual starters       |
| Invitation → completion    | Completed / unique adults invited |
| Reported usable text       | Usability Yes / (Yes + No)        |
| Would use again            | Reuse Yes / (Yes + No)            |

The app prints `X of Y · P.P%`. A missing input or zero denominator produces `Not available`. **Not asked is excluded from the feedback denominator.** The tracker's existing summary divides usable text by completions; do not copy that rate into this app when some completers were not asked. Reconcile the raw feedback categories instead.

## Fieldwork and publication

Recruit approximately 10–15 genuine consenting adults; publish the achieved sample size. Explain the independent hiring-challenge experiment. Use fictional/throwaway dictation and retain no participant text. Participation consent does not permit filming; obtain separate permission for identifiable footage.

Report who was invited, volunteered, consented, started, and completed. Describe whom the channels missed and the limitations of a convenience sample. Explicitly select Hinglish for that setting; selecting Hindi plus English is different. Do not promise untested language accuracy.

Update the JSON, add actual observations to the onboarding content, run `npm run check`, and inspect the results before publishing. Never commit the workbook, contact details, private messages, or participant-level exports.
