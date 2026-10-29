# Security and privacy

This application is a static portfolio. It has no backend, visitor accounts, database, microphone capture, browser persistence, paid AI integration, or analytics. Public results are reviewed aggregates validated before bundling and again before rendering.

Never commit the private participant tracker, contact information, participant dictation, credentials, or unpermitted footage. Genuine evidence must be reviewed before publication. A schema verifies structure and consistency; it cannot prove that an observation actually occurred.

## Verification

Run `npm run check` and `npm audit --audit-level=low`. GitHub workflows perform the engineering checks, dependency auditing, and CodeQL analysis. Pull requests additionally receive dependency review. Workflow actions are pinned to verified full commit hashes and use explicit job permissions. A passing scan is not a guarantee that all defects have been found.

## Reporting a concern

For an ordinary, non-sensitive defect, open an issue with reproduction steps and expected behavior. Do not include credentials, participant information, or exploit details that expose private data. For a sensitive concern, use GitHub's private vulnerability reporting option if it is enabled for this repository; otherwise contact the repository owner privately before sharing details.

Only the current repository version is maintained. No hosted Emergent deployment or security review of such a deployment is claimed until it is actually created and verified.
