# Security and privacy

This application is a static portfolio. It has no backend, visitor accounts, database, microphone capture, browser persistence, paid AI integration, or analytics. Public results are reviewed aggregates validated before bundling and again before rendering.

Never commit the private participant tracker, contact information, participant dictation, credentials, or unpermitted footage. Genuine evidence must be reviewed before publication. A schema verifies structure and consistency; it cannot prove that an observation actually occurred.

## Verification

Run `npm run check` and `npm audit --audit-level=low`. GitHub workflows perform the engineering checks, dependency auditing, and CodeQL analysis. Pull requests additionally receive dependency review. Workflow actions are pinned to verified full commit hashes and use explicit job permissions. A passing scan is not a guarantee that all defects have been found.

**Current known finding:** the 31 October full audit reports 12 moderate dependency findings rooted in [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) through development-tool minimatch 10.2.6. The [advisory record](docs/DEPENDENCY_ADVISORY.md) explains the unsupported patched-major blocker and executed results. The full audit remains enabled and failing; CodeQL success does not clear dependency findings.

Node and its type definitions stay on the pinned major. jsdom and TypeScript major upgrades require a coordinated runtime/toolchain review; Dependabot still proposes compatible minor/patch updates, and dependency vulnerability audits continue to fail on known advisories. npm enforces declared engine compatibility so an unsupported major cannot silently enter the checked dependency set.

## Reporting a concern

For an ordinary, non-sensitive defect, open an issue with reproduction steps and expected behavior. Do not include credentials, participant information, or exploit details that expose private data. For a sensitive concern, use GitHub's private vulnerability reporting option if it is enabled for this repository; otherwise contact the repository owner privately before sharing details.

Only the current repository version is maintained. Repository checks do not establish the security of the attempted Emergent deployment. Its latest observed preview, earlier runtime failure and current access limits are recorded in [delivery status](docs/DELIVERY_STATUS.md).
