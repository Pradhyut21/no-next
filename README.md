# NO → NEXT

A short interactive portfolio: challenge a claim, replay one JalRakshak decision, then explore the **BOLO. DON'T TYPE.** campus voice experiment.

## Run locally

Requires **Node 22.18.0** and npm. From this directory:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. The application needs no account, backend, database, API key, or paid service. To inspect the production build, run `npm run build` followed by `npm run preview`.

## Verify

```sh
npx playwright install chromium
npm run check
```

`check` runs type checking, ESLint, formatting verification, Vitest, validated production build, and Playwright. Individual scripts: `typecheck`, `lint`, `format:check`, `test`, `validate:content`, `build`, and `test:e2e`. Playwright starts its own local server if port 4173 is not already serving the app. Reports are written to `playwright-report/`; failure traces to `test-results/`.

## Implemented

- Exactly three main experiences with anchor navigation, a short guided route, optional deeper evidence, and visible skip-to-evidence access.
- Three distinct credibility challenges and deterministic stale-evidence decision branches.
- Native modal evidence drawer with focus restoration and genuine, attributed JalRakshak screenshots and demonstration links.
- Two authored campaign concepts and three student writing situations, without imitating a transcription product.
- Validated aggregate results, correct respondent denominators, onboarding observation slots, and a compact development log.
- Mobile layouts, keyboard support, reduced motion, and local fonts.

## Current evidence status

The pilot tracker contained no participant or invitation records when inspected. The shipped public data intentionally contains **null observations**, not invented zero-result measurements. The proposed 10–15 adults are a recruitment target, not an achieved sample size.

No genuine Wispr Flow demonstration, personal voice clips, or Emergent development recordings were supplied. Their manifest entries remain empty. JalRakshak's existing video shows its real interface with fictional tank data and synthetic narration; it does not prove Wispr Flow usage.

This is the local implementation. No Emergent project creation, import, public deployment, or challenge submission is claimed. See [the Emergent handoff](docs/EMERGENT_HANDOFF.md) for the supported transfer path and remaining human actions.

## Update factual content

| Content                                       | Source                                                    |
| --------------------------------------------- | --------------------------------------------------------- |
| Aggregate pilot observations                  | `src/content/pilot-results.json`                          |
| Project facts and screenshot provenance       | `src/content/projects.ts` and `docs/EVIDENCE_MANIFEST.md` |
| Challenge responses                           | `src/content/challenges.ts`                               |
| Campaign concepts and onboarding observations | `src/content/campaign.ts`                                 |
| Genuine recordings and Built Out Loud entries | `src/content/voice-evidence.ts`                           |

Every non-null recording needs a local media file, a written transcript, and captions for video. `npm run validate:content` checks schemas and referenced evidence files. Reload after editing content. Re-run the full check after changes.

Never place the private pilot workbook or participant text in `public/` or source control. Publish aggregate counts and anonymized themes only. Synthetic test cohorts live exclusively under `tests/` and are excluded from the application bundle.

## Engineering and handoff

- [Architecture and product behavior](docs/PROJECT_SPEC.md)
- [Pilot data dictionary](docs/PILOT_DATA_DICTIONARY.md)
- [Evidence provenance](docs/EVIDENCE_MANIFEST.md)
- [Executed verification](docs/VERIFICATION.md)
- [Emergent transfer and spoken instructions](docs/EMERGENT_HANDOFF.md)
- [Release checklist](docs/RELEASE_CHECKLIST.md)

The implementation uses React, TypeScript, Vite, Zod, Vitest, Testing Library, Playwright, and axe. Source screenshots retain their original MIT notice; font licenses are included beside the self-hosted fonts.
