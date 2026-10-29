# Product behavior and architecture

The audience is a recruiter evaluating practical engineering judgment and India-focused growth thinking. The primary route is: opening → credibility challenge → simulated decision → inspectable evidence → campaign hypothesis → findings or honest pending state. Deeper details are optional; the intended main route takes approximately 90–120 seconds.

## Three experiences

**Challenge Me:** selectable, evidence-backed responses lead to the decision or campaign. Authentic voice clips are optional and never autoplay. The documented JalRakshak review supplies the failure/revision example; no individual authorship or field outcome is inferred.

**One Decision, Real Evidence:** a simulated hostel reading is stale. The visitor may warn, mark UNKNOWN and seek fresh evidence, or ignore the issue. A pure decision model explains consequences. This changes portfolio state only. The native modal provides real screenshots, source links, a genuine project recording, and limitations. Focus returns to the opener after dismissal.

**BOLO. DON'T TYPE.:** two proposed messages and three practical writing tasks make the experiment concrete. No microphone or transcription engine is implemented. Public aggregates, onboarding observations, lessons, and the development log remain pending until supported by actual records. The log stays inside the third experience.

## Boundaries

The app is a client-only Vite build. React state tracks selections and the drawer; nothing persists between visits. There are no accounts, operational notifications, backend, database, LLM calls, or analytics. Fonts and screenshots are local assets. External product/source/video pages are opened deliberately through links; there are no video embeds or autoplay.

UI components own presentation and accessible interactions. Content modules own factual text, proposed campaign material, and genuine-media references. Pure domain functions own validation, rate calculation, deterministic decisions, and evidence-readiness labels. Build-time validation runs before bundling; runtime validation suppresses invalid results with an explicit unavailable state.

## Data and media interfaces

`PilotResults` is inferred from a strict Zod schema. The versioned JSON describes only public aggregates. Unknown fields are rejected. Null means unrecorded; zero means observed none. Funnels and feedback totals are checked against known upper bounds. Fractions and percentages always use matching populations.

`MediaAsset` supplies type, local source, title, transcript, and video caption path. A Built Out Loud entry additionally requires its actual date, intention, dictated instruction, resulting Emergent change, and accepted/corrected account. Invalid/missing media is not represented as completed evidence. Playback failures retain the written transcript.

`getEvidenceReadiness` derives public status labels from validated content, keeping the opening, campaign, and footer consistent.

## Verification strategy

Vitest exercises meaningful domain boundaries and React behavior, including synthetic result fixtures kept solely in tests. Playwright covers the actual guided journey, keyboard/modal behavior, mobile reflow, local assets, console errors, reduced motion, and axe scans. Automated checks do not replace human screen-reader review, real student sessions, genuine voice captures, or signed-out verification of the final Emergent deployment.
