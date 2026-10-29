import { useState } from 'react';
import { mediaEvidenceSchema, type MediaAsset } from '../content/voice-evidence';

type MediaEvidenceProps = {
  title: string;
  media?: MediaAsset | null;
  pendingText?: string;
};

function MediaPlayer({ media }: { media: MediaAsset }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="media-pending">
        <p className="eyebrow">Recording unavailable</p>
        <p>The recording could not be loaded. Continue with the written transcript.</p>
        <details className="media-transcript">
          <summary>Read the transcript</summary>
          <p>{media.transcript}</p>
        </details>
      </div>
    );
  }

  return (
    <div className="media-player">
      {media.type === 'video' ? (
        <video aria-label={media.title} controls preload="none" onError={() => setFailed(true)}>
          <source src={media.src} onError={() => setFailed(true)} />
          <track
            kind="captions"
            src={media.captionsSrc ?? undefined}
            srcLang="en"
            label="English captions"
            default
          />
          Your browser cannot play this video. Read the transcript below.
        </video>
      ) : (
        <audio aria-label={media.title} controls preload="none" onError={() => setFailed(true)}>
          <source src={media.src} onError={() => setFailed(true)} />
          Your browser cannot play this audio. Read the transcript below.
        </audio>
      )}
      <details className="media-transcript">
        <summary>Read the transcript</summary>
        <p>{media.transcript}</p>
      </details>
    </div>
  );
}

export default function MediaEvidence({
  title,
  media,
  pendingText = 'A genuine recording has not been supplied yet. The written experience is complete without it.',
}: MediaEvidenceProps) {
  const parsed = mediaEvidenceSchema.safeParse(media);

  return (
    <div className="media-evidence">
      <h4>{title}</h4>
      {parsed.success ? (
        <MediaPlayer key={parsed.data.src} media={parsed.data} />
      ) : (
        <div className="media-pending">
          <span className="pending-indicator" aria-hidden="true" />
          <div>
            <p className="eyebrow">Recording pending</p>
            <p>{pendingText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
