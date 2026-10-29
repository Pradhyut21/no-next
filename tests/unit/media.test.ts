import { describe, expect, it } from 'vitest';
import { mediaEvidenceSchema, voiceEvidenceSchema } from '../../src/content/voice-evidence';

describe('recorded evidence metadata', () => {
  const audio = {
    type: 'audio',
    src: '/media/synthetic-test.mp3',
    title: 'Test recording',
    transcript: 'Synthetic test transcript.',
  };

  it('allows an empty log rather than manufacturing completed voice evidence', () => {
    expect(voiceEvidenceSchema.safeParse([]).success).toBe(true);
  });

  it('requires an accessible transcript for every recording', () => {
    expect(mediaEvidenceSchema.safeParse(audio).success).toBe(true);
    expect(mediaEvidenceSchema.safeParse({ ...audio, transcript: '' }).success).toBe(false);
  });

  it('requires a caption track for video', () => {
    expect(mediaEvidenceSchema.safeParse({ ...audio, type: 'video' }).success).toBe(false);
    expect(
      mediaEvidenceSchema.safeParse({ ...audio, type: 'video', captionsSrc: '/media/test.vtt' })
        .success,
    ).toBe(true);
  });

  it.each(['//example.com/test.mp3', 'https://example.com/test.mp3', '/media/../private.mp3'])(
    'rejects a nonlocal or traversal path: %s',
    (src) => {
      expect(mediaEvidenceSchema.safeParse({ ...audio, src }).success).toBe(false);
    },
  );

  it('rejects a claimed build entry that lacks a date or original recording', () => {
    expect(voiceEvidenceSchema.safeParse([{ spokenIntention: 'Pretend completed.' }]).success).toBe(
      false,
    );
  });
});
