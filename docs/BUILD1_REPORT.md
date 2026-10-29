# Build 1 delivery report

The local functional application is implemented. Local Build 2 verification has also been executed. Build 3 is not complete: actual Emergent construction, real Wispr Flow dictation evidence, pilot fieldwork, and deployment have not occurred in this implementation.

## 1. Actual files created or changed

The source directory contains the runnable application, genuine attributed screenshots, local fonts, validated aggregate content, automated tests, setup scripts, lockfile, and technical documentation. The complete file inventory is below.

This revision changed the campaign's completed/pending rendering, strengthened aggregate validation, added missing-data regression coverage and real-browser experiment-state tests, and strengthened the Emergent handoff. The shipped public pilot JSON and empty voice manifest were preserved.

## 2. Implemented features

- Exactly three main experiences: Challenge Me; One Decision, Real Evidence; BOLO. DON'T TYPE. The campaign remains the visual and narrative centerpiece.
- Complete guided navigation, visible and keyboard skip-to-evidence access, all three challenges, and all three deterministic simulated JalRakshak branches.
- Genuine repository-backed evidence, explicit simulation labels, an accessible modal drawer, actual screenshots and demo links, Escape dismissal, keyboard focus cycling, and focus restoration.
- Both campaign creatives and all three student scenarios; a real product link and a safe pending demonstration slot.
- Pending, completed, and partial aggregate rendering; raw fractions and percentages; honest zero, unknown, and unavailable handling; invalid data suppression. Completed results can display recruitment, counts, friction, limitations, lessons, and next test from reviewed data.
- Five-stage expandable onboarding teardown and compact Built Out Loud log. Missing observations and recordings remain pending. Supplied recordings require controls, transcripts, and video captions, with no autoplay.
- Responsive layouts, reduced motion, strict TypeScript, Zod contracts, pure calculations, and separate content/media modules. No backend, accounts, microphone, imitation transcription, or analytics.

## 3. Run instructions

Use Node **22.18.0**. In the project directory:

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. For the production build, run `npm run build` then `npm run preview`. The source archive excludes dependencies; `npm ci` restores them from the lockfile. No API key is required.

## 4. Actual tests and results

The requested sequence was executed in order and stopped on any nonzero exit: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`, then `npm run test` again. Every command exited successfully. Both Vitest runs passed **66/66 tests** across six files.

Additional executed checks: formatting passed; the complete Playwright suite passed **23/23 tests** in Chromium. Coverage includes completed/pending/partial/zero/missing/invalid aggregates, all interactions, keyboard behavior, reduced motion, and reflow at 360, 390, 768, and 1440px. axe scans of pending and completed campaign states and the open drawer reported zero automated WCAG A/AA violations. See [the verification record](VERIFICATION.md) for detail and limits.

Synthetic cohorts exist only inside the automated tests. Browser-state tests intercept the content module in their own isolated context; the application has no fixture mode or public synthetic results.

## 5. Remaining defects and limits

No failing check or known blocking defect remains in the tested local workflows. Manual screen-reader review, physical devices, Firefox/WebKit, and a timed recruiter study remain unverified. Real-media playback and the actual hosted environment must be checked when authentic recordings and the Emergent deployment exist. Automated scans do not establish complete accessibility compliance.

## 6. Missing authentic evidence

The private tracker was rechecked read-only: zero populated participant rows and zero populated reach rows. No real pilot results, interviews, participant feedback, personal audio, Flow demonstration, or Flow-to-Emergent development recordings were supplied. The public aggregate file remains planned with null measurements, and the voice log remains empty. The private workbook is unchanged and is not included in the application or archive.

## 7. Emergent import readiness

The source and lockfile are prepared for the documented **GitHub import when creating a new Emergent project**. No actual GitHub source upload, Emergent import, project creation, or public deployment is claimed. Import compatibility must be tested in the actual project.

After import, substantive construction, revision, and verification must occur inside that new Emergent project through genuine Wispr Flow dictation. Local Codex development and importing code do not establish those actions. The [handoff](EMERGENT_HANDOFF.md) supplies short spoken-friendly instructions and an evidence checklist. No authenticated Emergent session or genuine user voice evidence is available here to complete that work.

## 8. Next action for Build 2

The initial local Build 2 pass is already executed, including fixes and the expanded browser suite. No additional prerequisite is required to start it. Re-run `npm run check` after genuine data/media or Emergent-specific changes and resolve observed failures before deployment. The next unmet project gate is actual Build 3 work, not another architecture proposal.

## Complete source-file inventory

56 source files (excluding dependencies, build output, browser reports, and private data):

- `.github/workflows/check.yml`
- `.gitignore`
- `.node-version`
- `.nvmrc`
- `.prettierignore`
- `.prettierrc.json`
- `README.md`
- `docs/BUILD1_REPORT.md`
- `docs/EMERGENT_HANDOFF.md`
- `docs/EVIDENCE_MANIFEST.md`
- `docs/PILOT_DATA_DICTIONARY.md`
- `docs/PROJECT_SPEC.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/VERIFICATION.md`
- `eslint.config.js`
- `index.html`
- `package-lock.json`
- `package.json`
- `playwright.config.ts`
- `public/evidence/JALRAKSHAK_LICENSE.txt`
- `public/evidence/jalrakshak-dashboard.png`
- `public/evidence/jalrakshak-unknown.png`
- `public/favicon.svg`
- `public/fonts/dm-sans-OFL.txt`
- `public/fonts/dm-sans-latin.woff2`
- `public/fonts/manrope-OFL.txt`
- `public/fonts/manrope-latin.woff2`
- `public/media/.gitkeep`
- `scripts/validate-content.ts`
- `src/App.tsx`
- `src/components/Arrow.tsx`
- `src/components/Campaign.tsx`
- `src/components/EvidenceDrawer.tsx`
- `src/components/MediaEvidence.tsx`
- `src/content/campaign.ts`
- `src/content/challenges.ts`
- `src/content/pilot-results.json`
- `src/content/projects.ts`
- `src/content/voice-evidence.ts`
- `src/domain/decision-model.ts`
- `src/domain/evidence-readiness.ts`
- `src/domain/pilot-metrics.ts`
- `src/domain/pilot-schema.ts`
- `src/main.tsx`
- `src/styles/global.css`
- `tests/e2e/experiment-states.spec.ts`
- `tests/e2e/portfolio.spec.ts`
- `tests/integration/campaign.test.tsx`
- `tests/integration/media.test.tsx`
- `tests/setup.ts`
- `tests/unit/decision.test.ts`
- `tests/unit/media.test.ts`
- `tests/unit/pilot.test.ts`
- `tests/unit/readiness.test.ts`
- `tsconfig.json`
- `vite.config.ts`
