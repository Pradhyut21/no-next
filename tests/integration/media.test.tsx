import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MediaEvidence from '../../src/components/MediaEvidence';
import type { MediaAsset } from '../../src/content/voice-evidence';

const audio: MediaAsset = {
  type: 'audio',
  src: '/media/test-only-recording.mp3',
  title: 'Test audio',
  transcript: 'Synthetic test transcript.',
};

describe('optional genuine media rendering', () => {
  it('renders a graceful pending state when no media exists', () => {
    const { container } = render(<MediaEvidence title="Voice response" />);
    expect(screen.getByText('Recording pending')).toBeVisible();
    expect(screen.getByText(/written experience is complete without it/)).toBeVisible();
    expect(container.querySelector('audio, video')).toBeNull();
  });

  it('keeps the provided pending explanation visible', () => {
    render(
      <MediaEvidence
        title="Demo"
        media={null}
        pendingText="Original recording is still pending."
      />,
    );
    expect(screen.getByText('Original recording is still pending.')).toBeVisible();
  });

  it('provides controlled audio without autoplay and an optional transcript', async () => {
    const user = userEvent.setup();
    const { container } = render(<MediaEvidence title="Voice response" media={audio} />);
    const player = container.querySelector('audio');
    expect(player).toHaveAttribute('controls');
    expect(player).toHaveAttribute('preload', 'none');
    expect(player).not.toHaveAttribute('autoplay');
    expect(player).toHaveAttribute('aria-label', 'Test audio');
    await user.click(screen.getByText('Read the transcript'));
    expect(screen.getByText('Synthetic test transcript.')).toBeVisible();
  });

  it('renders video with captions, controls, and no autoplay', () => {
    const { container } = render(
      <MediaEvidence
        title="Build proof"
        media={{
          ...audio,
          type: 'video',
          src: '/media/test-only-recording.mp4',
          captionsSrc: '/media/test-only-recording.vtt',
        }}
      />,
    );
    const player = container.querySelector('video');
    expect(player).toHaveAttribute('controls');
    expect(player).not.toHaveAttribute('autoplay');
    expect(player?.querySelector('track')).toHaveAttribute('kind', 'captions');
    expect(player?.querySelector('track')).toHaveAttribute('src', '/media/test-only-recording.vtt');
    expect(player?.querySelector('track')).toHaveAttribute('default');
  });

  it('does not expose an uncaptained video as playable evidence', () => {
    const { container } = render(
      <MediaEvidence
        title="Build proof"
        media={{ ...audio, type: 'video', src: '/media/test-only-recording.mp4' }}
      />,
    );
    expect(screen.getByText('Recording pending')).toBeVisible();
    expect(container.querySelector('video')).toBeNull();
  });

  it('preserves the transcript after a recording fails to load', async () => {
    const user = userEvent.setup();
    const { container } = render(<MediaEvidence title="Voice response" media={audio} />);
    const source = container.querySelector('source');
    if (!source) throw new Error('Expected an audio source.');
    fireEvent.error(source);
    expect(screen.getByText('Recording unavailable')).toBeVisible();
    expect(container.querySelector('audio')).toBeNull();
    await user.click(screen.getByText('Read the transcript'));
    expect(screen.getByText('Synthetic test transcript.')).toBeVisible();
  });

  it('can replace a failed recording with a new valid recording', () => {
    const { container, rerender } = render(<MediaEvidence title="Voice response" media={audio} />);
    const player = container.querySelector('audio');
    if (!player) throw new Error('Expected an audio player.');
    fireEvent.error(player);
    expect(screen.getByText('Recording unavailable')).toBeVisible();
    rerender(
      <MediaEvidence
        title="Voice response"
        media={{ ...audio, src: '/media/replacement-test-only.mp3' }}
      />,
    );
    expect(container.querySelector('audio source')).toHaveAttribute(
      'src',
      '/media/replacement-test-only.mp3',
    );
    expect(screen.queryByText('Recording unavailable')).not.toBeInTheDocument();
  });
});
