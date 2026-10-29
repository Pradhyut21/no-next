import { useEffect, useState } from 'react';
import { challenges } from './content/challenges';
import { decisions, evaluateDecision } from './domain/decision-model';
import Arrow from './components/Arrow';
import Campaign from './components/Campaign';
import EvidenceDrawer from './components/EvidenceDrawer';
import MediaEvidence from './components/MediaEvidence';
import { challengeVoiceClips, voiceEvidenceEntries } from './content/voice-evidence';
import pilotData from './content/pilot-results.json';
import { getEvidenceReadiness } from './domain/evidence-readiness';

export default function App() {
  const [activeSection, setActiveSection] = useState('challenge');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [decisionId, setDecisionId] = useState<'warn' | 'unknown' | 'ignore' | null>(null);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const selectedChallenge = challenges.find((item) => item.id === challengeId);
  const result = decisionId ? evaluateDecision(decisionId) : null;
  const readiness = getEvidenceReadiness(pilotData, voiceEvidenceEntries);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
      },
      { rootMargin: '-15% 0px -50% 0px' },
    );
    document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#decision">
        Skip to evidence
      </a>
      <header className="site-header">
        <a className="wordmark" href="#challenge" aria-label="NO NEXT. Start">
          NO <span aria-hidden="true">↗</span> NEXT<span className="wordmark-period">.</span>
        </a>
        <nav aria-label="Main navigation">
          {[
            { id: 'challenge', number: '01', label: 'Challenge me' },
            { id: 'decision', number: '02', label: 'The decision' },
            { id: 'campaign', number: '03', label: 'The experiment' },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeSection === item.id ? 'location' : undefined}
            >
              <span className="nav-number">{item.number}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className="header-github"
          href="https://github.com/Pradhyut21/no-next"
          target="_blank"
          rel="noreferrer"
        >
          The source <Arrow diagonal />
        </a>
      </header>

      <main>
        <section
          id="challenge"
          className="challenge-section"
          aria-labelledby="hero-title"
          tabIndex={-1}
        >
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="red-line" /> AN INDIA GROWTH APPLICATION
              </p>
              <h1 id="hero-title">
                Proof over <br />
                <em>promises.</em>
              </h1>
              <p className="hero-lead">
                Don’t just read what I claim.
                <br />
                See what I built, tested, and learned.
              </p>
              <a className="hero-cta" href="#challenges">
                Go on. Challenge me. <Arrow />
              </a>
              <a className="hero-skip" href="#decision">
                Skip to evidence <span aria-hidden="true">↘</span>
              </a>
            </div>
            <aside className="work-note" aria-label="About this application">
              <div className="note-meta">
                <span>NO → NEXT</span>
                <span>FIELD NOTES / 2026</span>
              </div>
              <span className="note-stamp">
                OPEN FOR
                <br />
                REVIEW
              </span>
              <div className="note-arrow" aria-hidden="true">
                ↗
              </div>
              <div className="note-title">
                A claim is a start.
                <br />
                The work comes next.
              </div>
              <div className="note-status">
                <span className="status-dot" /> {readiness.pilotLabel}
              </div>
              <p>
                A real engineering decision.
                <br />A small campus voice experiment.
                <br />
                Room to show what changes.
              </p>
              <div className="note-foot">
                BUILD. TEST. LISTEN. REPEAT.<span aria-hidden="true">↗</span>
              </div>
            </aside>
          </div>
          <div className="challenge-room" id="challenges" tabIndex={-1}>
            <div className="section-kicker">
              <span>01 / CHALLENGE ME</span>
              <span>
                Choose your question <span aria-hidden="true">↓</span>
              </span>
            </div>
            <div className="challenge-choices">
              {challenges.map((challenge, index) => (
                <button
                  type="button"
                  key={challenge.id}
                  className="challenge-choice"
                  aria-pressed={challengeId === challenge.id}
                  aria-controls="challenge-answer"
                  onClick={() => setChallengeId(challenge.id)}
                >
                  <span className="choice-number">0{index + 1}</span>
                  <span>{challenge.question}</span>
                  <Arrow diagonal />
                </button>
              ))}
            </div>
            <div
              id="challenge-answer"
              className={`challenge-answer${selectedChallenge ? ' has-answer' : ''}`}
              aria-live="polite"
            >
              {selectedChallenge ? (
                <>
                  <span className="eyebrow">LET’S LOOK AT THE WORK</span>
                  <h2>{selectedChallenge.title}</h2>
                  <p>{selectedChallenge.body}</p>
                  <div className="answer-actions">
                    <a className="text-link" href={selectedChallenge.target}>
                      {selectedChallenge.cta} <Arrow />
                    </a>
                    {selectedChallenge.sourceUrl && (
                      <a
                        className="source-link"
                        href={selectedChallenge.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Read the source <Arrow diagonal />
                      </a>
                    )}
                  </div>
                  <MediaEvidence
                    title="A voice note behind this answer"
                    media={challengeVoiceClips[selectedChallenge.id]}
                  />
                </>
              ) : (
                <p>Pick a question. Follow the answer to its evidence.</p>
              )}
            </div>
          </div>
          <a href="#decision" className="section-continue">
            Continue to one real decision <Arrow />
          </a>
        </section>

        <section
          id="decision"
          className="decision-section"
          aria-labelledby="decision-title"
          tabIndex={-1}
        >
          <div className="section-kicker">
            <span>02 / ONE DECISION, REAL EVIDENCE</span>
            <span>JALRAKSHAK CASE STUDY</span>
          </div>
          <div className="decision-heading">
            <h2 id="decision-title">
              When the data is old,
              <br />
              what do you say?
            </h2>
            <p>
              Trust shows up in the moment a system has to say,
              <br className="desktop-break" /> “I don’t know yet.”
            </p>
          </div>
          <div className="decision-grid">
            <div className="scenario-sheet">
              <div className="scenario-sheet-top">
                <span className="eyebrow">THE SCENARIO</span>
                <span className="simulation-label">SIMULATED</span>
              </div>
              <div className="tank-illustration" aria-hidden="true">
                <div className="tank-water" />
                <span className="tank-marker" />
                <span className="tank-label">LAST OBSERVATION</span>
                <div className="tank-measure">
                  ? <span>now</span>
                </div>
              </div>
              <h3>
                A hostel tank.
                <br />
                An outdated reading.
              </h3>
              <p>
                A caretaker needs to know whether the water supply is at risk. The latest tank
                reading is stale. There isn’t enough current evidence for a confident forecast.
              </p>
              <div className="scenario-question">Would you send an urgent warning?</div>
              <p className="source-note">
                An educational replay of a documented design decision. These choices trigger no
                operational actions.
              </p>
            </div>
            <div className="decision-interaction">
              <p className="eyebrow">YOU MAKE THE CALL</p>
              <div className="decision-options">
                {decisions.map((decision, index) => (
                  <button
                    type="button"
                    className="decision-option"
                    key={decision.id}
                    aria-pressed={decisionId === decision.id}
                    aria-controls="decision-result"
                    onClick={() => setDecisionId(decision.id)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span>{decision.label}</span>
                    <span className="option-indicator" aria-hidden="true">
                      {decisionId === decision.id ? '●' : '○'}
                    </span>
                  </button>
                ))}
              </div>
              <div
                id="decision-result"
                className={`decision-result${result ? ' is-revealed' : ''}`}
                aria-live="polite"
              >
                {result ? (
                  <>
                    <span className="eyebrow">
                      {decisionId === 'unknown'
                        ? 'UNKNOWN IS AN HONEST ANSWER'
                        : 'FOLLOW THE CONSEQUENCE'}
                    </span>
                    <h3>{result.summary}</h3>
                    <p>{result.consequence}</p>
                    <p className="decision-principle">{result.principle}</p>
                    <p className="source-note">
                      The choice above is hypothetical. JalRakshak’s documented behavior with
                      missing or stale evidence is UNKNOWN, with projections withheld until fresh
                      evidence is available.
                    </p>
                  </>
                ) : (
                  <>
                    <span className="result-placeholder" aria-hidden="true">
                      ↳
                    </span>
                    <p>Choose an approach to see the reasoning.</p>
                  </>
                )}
              </div>
              <button
                className="button button-dark evidence-trigger"
                type="button"
                onClick={() => setEvidenceOpen(true)}
              >
                Inspect the real evidence <Arrow diagonal />
              </button>
            </div>
          </div>
          <a href="#campaign" className="section-continue">
            Now take the idea to people <Arrow />
          </a>
        </section>

        <Campaign />
      </main>
      <footer className="site-footer">
        <a className="wordmark" href="#challenge">
          NO <span aria-hidden="true">↗</span> NEXT.
        </a>
        <p>The work is open. So is the next question.</p>
        <a
          className="text-link"
          href="https://github.com/Pradhyut21/no-next"
          target="_blank"
          rel="noreferrer"
        >
          Explore the source <Arrow diagonal />
        </a>
        <div className="footer-note">
          An independent application for Wispr Flow’s India growth team.
          <br />
          {readiness.pilotFooter} {readiness.voiceFooter}
        </div>
      </footer>
      <EvidenceDrawer open={evidenceOpen} onClose={() => setEvidenceOpen(false)} />
    </>
  );
}
