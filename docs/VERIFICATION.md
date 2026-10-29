# Executed verification

Verified on **October 29, 2026**, on Windows with **Node 22.18.0**, npm **10.2.5**, and Playwright Chromium. These are executed local results, not claims about a hosted Emergent application.

## Final complete run

`npm run check` completed with **exit code 0** after the implementation fixes.

| Check                               | Actual result                                                                             |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| Strict TypeScript                   | Passed                                                                                    |
| ESLint with zero warnings permitted | Passed                                                                                    |
| Prettier verification               | Passed                                                                                    |
| Vitest                              | **59 passed**, 6 files; 41 domain/manifest tests and 18 React integration tests           |
| Aggregate and media validation      | Passed; pilot status `planned`, genuine recordings absent, referenced screenshots present |
| Production compilation              | Passed; Vite 8.3.5                                                                        |
| Playwright                          | **15 passed** in one final run, 38.1 seconds                                              |

Production output: JavaScript 344.28 kB / 104.45 kB gzip; CSS 27.68 kB / 6.32 kB gzip. These build sizes are not a performance benchmark.

## Coverage actually exercised

- All three challenges reveal distinct source-backed responses and working next actions.
- All three simulated decision branches preserve the documented UNKNOWN rule.
- Evidence drawer opens, loads the real screenshot, traps keyboard focus, closes through Escape/close/return controls, and restores focus.
- Keyboard skip link moves focus to the decision section; anchor and guided navigation connect the three experiences.
- Both creatives and all three student writing scenarios work.
- Initial pilot, media, onboarding, and voice-log states disclose missing evidence.
- React tests render synthetic completed, partial, zero, missing, and invalid aggregates, including usability/reuse respondent denominators. Synthetic observations stay inside the tests.
- Domain tests reject impossible funnels and feedback totals, including missing intermediate counts and unknown completion counts; preserve zero versus null; and verify deterministic rates and rounding.
- Media tests exercise transcripts, captions, controls, no autoplay, missing/invalid media, load failure, and replacement after a failure.
- Chromium viewport checks at **360, 390, 768, and 1440 pixels** found no horizontal overflow in the exercised page and drawer states.
- Reduced-motion checks confirmed no smooth scrolling or transition/animation effects.
- axe scans found **zero automated violations** for the initial page, expanded campaign, and open drawer using WCAG 2 A/AA and 2.1 A/AA tags.
- The tested journey had no uncaught runtime errors or failed local assets.

## Separate production smoke check

Served the actual `dist/` build through `npm run preview` on a separate local port. Checked the three sections, challenge response, UNKNOWN choice, drawer opening/dismissal, creative and scenario selection, pending results, and 390px reflow. Result: **PASS**. Observed console/asset errors: **0**. Requests outside that local origin: **0**. Both display fonts are self-hosted.

Desktop, mobile, and drawer screenshots were visually inspected. The delivered preview is an actual capture of the application, not a mockup.

## Defects found and fixed

- Feedback totals could bypass a known cohort bound when completed was null. Validation now checks every known upstream bound, with regression tests.
- Opening/footer readiness could contradict validated campaign data. They now share validated readiness logic.
- Two small-text colors failed contrast checks. They were darkened and rescanned.
- Accessible names overrode parts of visible button labels. The wordmark now matches its label; creative buttons derive their names from visible content.
- Keyboard tabbing could leave the drawer's internal cycle. Explicit boundary wrapping now passes forward/reverse focus tests.

The initial dependency installation also warned that the newest jsdom required a later runtime. It was replaced with pinned **jsdom 26.1.0** before the final verification.

## Limits and remaining work

Automated accessibility scans do not establish full accessibility compliance. No manual screen-reader audit, physical-device session, Firefox/WebKit run, or timed recruiter study was conducted. The configured GitHub Actions workflow has not run remotely.

There is **no verified Emergent import or public deployment**. No genuine Flow recordings or real participant results were supplied. The private workbook remains outside this project and unchanged. External links are explicit source/product references; the final hosted journey and public access still require verification after a real Emergent deployment.

Builds 1 and 2 meet their local exit gates. Build 3 has a concrete handoff and remains open for its actual account session, voice proof, pilot fieldwork, and signed-out deployment verification.
