# Open dependency advisory — 31 October 2026

The full dependency audit currently **fails**. The published [engineering workflow](https://github.com/Pradhyut21/no-next/actions/runs/41193737424) passed, and the [security workflow](https://github.com/Pradhyut21/no-next/actions/runs/41193737395) passed its CodeQL job but failed its dependency-audit job. Do not describe the combined security workflow as passing.

## Observed finding

The audit reported **12 moderate dependency findings rooted in one advisory**, [GHSA-g3hv-75wg-m249 / CVE-2026-118764](https://github.com/advisories/GHSA-g3hv-75wg-m249). The lockfile resolves **minimatch 10.2.6** through the development linting stack. The reviewed advisory flags versions below **11.0.1** for potential denial of service from attacker-controlled glob patterns during preprocessing.

The application has no backend or visitor-supplied glob-pattern input. The installed path is development tooling; this distinction does not clear the advisory or guarantee the absence of other risks.

## Supported-update blocker

Registry metadata inspected on 31 October showed:

| Consumer                               | Inspected version | Declared minimatch range |
| -------------------------------------- | ----------------- | ------------------------ |
| Installed ESLint                       | 10.13.0           | `^10.2.5`                |
| Latest stable ESLint                   | 10.14.0           | `^10.2.6`                |
| `@eslint/config-array`                 | 0.23.5            | `^10.2.4`                |
| `@typescript-eslint/typescript-estree` | 8.72.1            | `^10.2.2`                |

The patched major is excluded by these ranges. Node 22.18 can run minimatch 11, but its [upstream changelog](https://github.com/isaacs/minimatch/blob/v11.0.3/changelog.md) documents breaking API removals, including `makeRe()` and `AST`, and changed matcher internals. A forced cross-major override is not treated as an established compatible fix. Updating ESLint to 10.14 alone does not resolve the finding.

Primary package metadata: [ESLint](https://registry.npmjs.org/eslint/10.14.0), [config-array](https://registry.npmjs.org/@eslint%2fconfig-array/0.23.5), [typescript-estree](https://registry.npmjs.org/@typescript-eslint%2ftypescript-estree/8.72.1).

## Verification and next action

No dependency versions, overrides, audit thresholds or ignore rules were changed to conceal this failure. Dependabot, the full locked-dependency audit and CodeQL remain enabled.

The local npm 10.2.5 audit attempts, including an `--omit=dev` attempt, returned a registry HTTP 400 error for the retired quick-audit endpoint. Those are **blocked executions**, not clean audit results. The GitHub runner used npm 10.9.3 and produced the finding above.

When a supported upstream update becomes available, review its declared runtime and dependency ranges, update the exact pins and lockfile, run `npm audit --audit-level=low` and the complete `npm run check`, then inspect the new GitHub workflows. Until that happens, retain this limitation and read the actual workflow result.
