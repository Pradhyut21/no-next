import { useEffect, useRef, useState } from 'react';
import { projectEvidence } from '../content/projects';
import Arrow from './Arrow';

export default function EvidenceDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  const screenshot = projectEvidence.screenshots[0];
  return (
    <dialog
      ref={dialogRef}
      className="evidence-drawer"
      aria-labelledby="evidence-title"
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), audio[controls], video[controls], summary, [tabindex="0"]',
          ),
        );
        const first = controls[0];
        const last = controls.at(-1);
        if (!first || !last) return;
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === event.currentTarget)
        ) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="drawer-inner">
        <div className="drawer-top">
          <span className="eyebrow">THE EVIDENCE / 01</span>
          <button
            autoFocus
            type="button"
            className="close-button"
            onClick={onClose}
            aria-label="Close evidence"
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <h2 id="evidence-title">
          One tank.
          <br />
          Real constraints.
        </h2>
        <p className="drawer-lead">{projectEvidence.summary}</p>
        <span className="status-pill">Local prototype · simulated scenarios</span>
        {screenshot && !imageFailed ? (
          <figure className="evidence-figure">
            <img
              src={screenshot.src}
              alt={screenshot.alt}
              onError={() => setImageFailed(true)}
              width="1440"
              height="1000"
            />
            <figcaption>{screenshot.caption}</figcaption>
          </figure>
        ) : (
          <p className="media-pending">
            Screenshot unavailable. The source repository and demonstration remain available below.
          </p>
        )}
        <div className="evidence-links">
          <a
            className="button button-dark"
            href={projectEvidence.repositoryUrl}
            target="_blank"
            rel="noreferrer"
          >
            Inspect repository <Arrow diagonal />
          </a>
          <a className="text-link" href={projectEvidence.demoUrl} target="_blank" rel="noreferrer">
            Watch recorded demo <Arrow diagonal />
          </a>
        </div>
        <p className="source-note">
          The demo records the actual interface using fictional tank data and synthetic narration.
          It is separate from Wispr Flow development evidence.
        </p>
        <section className="drawer-section">
          <h3>What it implements</h3>
          <ul>
            {projectEvidence.implements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="drawer-section">
          <h3>The decision underneath</h3>
          <p>{projectEvidence.principle}</p>
        </section>
        <section className="drawer-section">
          <h3>Where the evidence stops</h3>
          <ul>
            {projectEvidence.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="drawer-section">
          <h3>Trace it to the source</h3>
          {projectEvidence.sources.map((source) => (
            <a
              className="source-link"
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              {source.label} <Arrow diagonal />
            </a>
          ))}
        </section>
        <button type="button" className="button button-outline drawer-return" onClick={onClose}>
          Return to the decision <Arrow />
        </button>
      </div>
    </dialog>
  );
}
