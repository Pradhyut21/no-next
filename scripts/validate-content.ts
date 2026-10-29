import { existsSync, readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePilotResults } from '../src/domain/pilot-schema';
import {
  campaignDemonstration,
  challengeVoiceClips,
  mediaEvidenceSchema,
  voiceEvidenceEntries,
  voiceEvidenceSchema,
  type MediaAsset,
} from '../src/content/voice-evidence';
import { projectEvidence } from '../src/content/projects';

const raw: unknown = JSON.parse(
  readFileSync(new URL('../src/content/pilot-results.json', import.meta.url), 'utf8'),
);
const result = parsePilotResults(raw);
let errorCount = 0;
if (!result.success) {
  console.error(
    'Public pilot data is invalid. Fix the following aggregate fields before building:',
  );
  for (const issue of result.error.issues)
    console.error(`- ${issue.path.join('.')}: ${issue.message}`);
  errorCount += result.error.issues.length;
} else {
  console.log(`Public pilot data validated (${result.data.status}).`);
}

const voiceResult = voiceEvidenceSchema.safeParse(voiceEvidenceEntries);
const media: MediaAsset[] = [campaignDemonstration, ...Object.values(challengeVoiceClips)].filter(
  (asset): asset is MediaAsset => asset !== null,
);
if (!voiceResult.success) {
  console.error('Built Out Loud contains invalid evidence entries.');
  for (const issue of voiceResult.error.issues)
    console.error(`- ${issue.path.join('.')}: ${issue.message}`);
  errorCount += voiceResult.error.issues.length;
} else {
  media.push(...voiceResult.data.map((entry) => entry.media));
}

const publicRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../public');
function verifyPublicAsset(path: string) {
  const resolved = resolve(publicRoot, `.${path}`);
  const relativePath = relative(publicRoot, resolved);
  if (relativePath.startsWith('..') || !existsSync(resolved)) {
    console.error(`- Missing or unsafe public evidence asset: ${path}`);
    errorCount += 1;
  }
}

for (const asset of media) {
  const parsed = mediaEvidenceSchema.safeParse(asset);
  if (!parsed.success) {
    console.error(
      'Invalid recorded media metadata. Every recording needs a transcript; video also needs captions.',
    );
    for (const issue of parsed.error.issues)
      console.error(`- ${issue.path.join('.')}: ${issue.message}`);
    errorCount += parsed.error.issues.length;
  } else {
    verifyPublicAsset(parsed.data.src);
    if (parsed.data.captionsSrc) verifyPublicAsset(parsed.data.captionsSrc);
  }
}
for (const screenshot of projectEvidence.screenshots) verifyPublicAsset(screenshot.src);

if (errorCount > 0) process.exitCode = 1;
else
  console.log(
    'Evidence manifests and referenced files validated. No participant-level workbook is imported.',
  );
