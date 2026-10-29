import { z } from 'zod';

const publicMediaPath = z
  .string()
  .min(1)
  .refine(
    (value) => value.startsWith('/') && !value.startsWith('//') && !value.includes('..'),
    'Use a local public media path, such as /media/recording.mp4.',
  );

export const mediaEvidenceSchema = z
  .object({
    type: z.enum(['audio', 'video']),
    src: publicMediaPath,
    title: z.string().min(1),
    transcript: z.string().min(1),
    captionsSrc: publicMediaPath.nullable().optional(),
  })
  .strict()
  .superRefine((media, context) => {
    if (media.type === 'video' && !media.captionsSrc) {
      context.addIssue({
        code: 'custom',
        path: ['captionsSrc'],
        message: 'Video needs a caption track.',
      });
    }
  });

export type MediaAsset = z.infer<typeof mediaEvidenceSchema>;

export const voiceEvidenceEntrySchema = z
  .object({
    id: z.string().min(1),
    date: z.iso.date(),
    spokenIntention: z.string().min(1),
    dictatedInstruction: z.string().min(1),
    emergentChange: z.string().min(1),
    acceptedOrCorrected: z.string().min(1),
    media: mediaEvidenceSchema,
  })
  .strict();

export const voiceEvidenceSchema = z.array(voiceEvidenceEntrySchema);
export type VoiceEvidenceEntry = z.infer<typeof voiceEvidenceEntrySchema>;

// Add only original, permitted recordings from actual Wispr Flow / Emergent work.
// Keeping this empty is intentional: missing evidence is not a completed entry.
export const voiceEvidenceEntries: VoiceEvidenceEntry[] = [];
export const campaignDemonstration: MediaAsset | null = null;
export const challengeVoiceClips: Record<'build' | 'failure' | 'growth', MediaAsset | null> = {
  build: null,
  failure: null,
  growth: null,
};
