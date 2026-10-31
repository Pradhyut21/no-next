# Contributing

Keep the portfolio within its three experiences: Challenge Me; One Decision, Real Evidence; and BOLO. DON'T TYPE. Keep domain calculations separate from factual content and presentation. Do not add accounts, a backend, analytics, or visitor microphone capture.

## Set up and verify

Use **Node 22.18.0**, pinned in `.nvmrc` and `.node-version`.

```sh
npm ci
npx playwright install chromium
npm run dev
```

Before proposing a change, run:

```sh
npm run check
```

This runs type checking, linting, formatting, unit/integration tests, the validated production build, and Playwright. On a fresh Linux machine, Playwright may also need its documented operating-system dependencies. Report the commands actually executed and their results; list blocked or unexecuted checks separately. Local tests do not verify an Emergent deployment.

## Change factual content deliberately

| Content                                       | File                                                               |
| --------------------------------------------- | ------------------------------------------------------------------ |
| Public pilot aggregates                       | [`src/content/pilot-results.json`](src/content/pilot-results.json) |
| Project facts and source links                | [`src/content/projects.ts`](src/content/projects.ts)               |
| Challenge responses                           | [`src/content/challenges.ts`](src/content/challenges.ts)           |
| Campaign concepts and onboarding observations | [`src/content/campaign.ts`](src/content/campaign.ts)               |
| Genuine media and development entries         | [`src/content/voice-evidence.ts`](src/content/voice-evidence.ts)   |

Use `npm run validate:content` while editing these files. Follow the [pilot data dictionary](docs/PILOT_DATA_DICTIONARY.md): `null` means unknown, zero means an observed zero, and invitation deliveries are separate from deduplicated invited adults. Never publish test cohorts as real findings.

Attach recordings only from actual, permitted activity, with accurate transcripts and video captions. Keep missing recordings and observations pending. Metadata validation cannot establish that an event occurred. The showcase in `docs/media/` is an edited product film; it must not be entered in the voice-evidence manifest as genuine Wispr Flow development proof.

Retain source attribution and licenses. Update the [evidence manifest](docs/EVIDENCE_MANIFEST.md) when evidence changes, and record hosted checks separately in the [delivery status](docs/DELIVERY_STATUS.md). Do not infer personal authorship from repository ownership.

Keep participant-level records, contact details, private submission answers, the pilot workbook, tokens, and unpermitted media out of commits and screenshots. Publish reviewed aggregates and anonymized observations only. See [SECURITY.md](SECURITY.md) for reporting concerns.

## Make the review reproducible

Describe the concrete behavior before and after the change. Add or update meaningful tests when behavior changes, inspect affected layouts and keyboard interactions, and identify the evidence that supports factual updates. Preserve existing verification dates; add a new dated record rather than turning historical results into claims about current code or hosting.
