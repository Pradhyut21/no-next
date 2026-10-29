import { useState } from 'react';
import pilotData from '../content/pilot-results.json';
import { campaignCreatives, writingScenarios, onboardingStages } from '../content/campaign';
import {
  campaignDemonstration,
  voiceEvidenceEntries,
  voiceEvidenceSchema,
} from '../content/voice-evidence';
import { pilotResultsSchema, type PilotResults } from '../domain/pilot-schema';
import { getPilotMetrics } from '../domain/pilot-metrics';
import { getEvidenceReadiness } from '../domain/evidence-readiness';
import MediaEvidence from './MediaEvidence';

function ExperimentResults({ results }: { results: PilotResults }) {
  const hasResults = getEvidenceReadiness(results, []).hasPilotObservations;

  if (!hasResults) {
    return (
      <div className="pilot-pending">
        <div className="pilot-pending-heading">
          <span className="pending-indicator" aria-hidden="true" />
          <h4>Experiment in progress.</h4>
        </div>
        <p>The plan is ready. Participant results have not been supplied yet.</p>
        <div className="pilot-plan-grid">
          <div>
            <span className="eyebrow">Planned sample</span>
            <p>10–15 adult volunteers</p>
          </div>
          <div>
            <span className="eyebrow">Recruitment plan</span>
            <p>Existing campus and personal networks</p>
          </div>
          <div>
            <span className="eyebrow">What counts</span>
            <p>One real dictation, then honest feedback</p>
          </div>
        </div>
        <p className="fine-print">
          A small convenience sample. A way to learn what to test next, with no claim to represent
          all Indian students.
        </p>
      </div>
    );
  }

  const counts = [
    ['Unique adults invited', results.recruitment.uniqueInvited],
    ['Invitation deliveries', results.recruitment.invitationDeliveries],
    ['Volunteered', results.recruitment.volunteered],
    ['Consented', results.recruitment.consented],
    ['Started Flow', results.recruitment.started],
    ['Completed dictation', results.recruitment.completed],
  ] as const;
  const breakdowns = [
    { title: 'Devices observed', items: results.devices },
    { title: 'Language settings tested', items: results.languages },
    { title: 'Creative exposure', items: results.creativeExposures },
  ];

  return (
    <div className="pilot-observed">
      <p className="eyebrow">
        {results.status === 'complete' ? 'Pilot findings' : 'Pilot findings so far'}
      </p>
      {results.recruitment.description && <p>{results.recruitment.description}</p>}
      <p className="fine-print">
        Observed period: {results.dates.start ?? 'Start not recorded'} to{' '}
        {results.dates.end ?? (results.status === 'complete' ? 'End not recorded' : 'In progress')}
      </p>
      <dl className="pilot-counts">
        {counts.map(([label, count]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{count ?? 'Not available'}</dd>
          </div>
        ))}
      </dl>
      <div className="metric-grid">
        {getPilotMetrics(results).map((metric) => (
          <article className="metric-card" key={metric.id}>
            <h4>{metric.label}</h4>
            <p className="metric-value">{metric.display}</p>
            <p className="fine-print">{metric.detail}</p>
          </article>
        ))}
      </div>
      <div className="experiment-notes">
        {breakdowns.map(({ title, items }) => (
          <div key={title}>
            <h4>{title}</h4>
            {items.length > 0 ? (
              <ul>
                {items.map((item) => (
                  <li key={item.label}>
                    {item.label}: {item.count ?? 'Not available'}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Not recorded.</p>
            )}
          </div>
        ))}
      </div>
      <p className="fine-print">
        Creative comparisons are observational unless assignment was randomized. Self-reported
        usability is not a transcription accuracy measure. Reuse answers express intention, not
        observed return use.
      </p>
    </div>
  );
}

export default function Campaign() {
  const [creativeId, setCreativeId] = useState<(typeof campaignCreatives)[number]['id']>('a');
  const [scenarioId, setScenarioId] =
    useState<(typeof writingScenarios)[number]['id']>('internship');
  const creative = campaignCreatives.find((item) => item.id === creativeId) ?? campaignCreatives[0];
  const scenario = writingScenarios.find((item) => item.id === scenarioId) ?? writingScenarios[0];
  const parsedPilot = pilotResultsSchema.safeParse(pilotData);
  const parsedVoice = voiceEvidenceSchema.safeParse(voiceEvidenceEntries);
  const results = parsedPilot.success ? parsedPilot.data : null;
  const observedResults =
    results && getEvidenceReadiness(results, []).hasPilotObservations ? results : null;

  return (
    <section
      id="campaign"
      tabIndex={-1}
      className="campaign-section section-shell"
      aria-labelledby="campaign-title"
    >
      <div className="section-kicker">
        <span>03 / THE GROWTH EXPERIMENT</span>
        <span>INDIA · SMALL BY DESIGN</span>
      </div>
      <header className="campaign-header">
        <p className="eyebrow">A first draft is a good place to start.</p>
        <h2 id="campaign-title">
          BOLO.
          <br />
          <span>DON’T TYPE.</span>
        </h2>
        <div className="campaign-intro">
          <p>Could speaking make it easier for students to start the writing they put off?</p>
          <p>
            {observedResults
              ? 'Two campaign ideas. Three everyday tasks. The recorded observations are below.'
              : 'Two campaign ideas. Three everyday tasks. A small, real pilot to find out.'}
          </p>
        </div>
      </header>

      <div className="campaign-step-heading">
        <span className="step-number">01</span>
        <h3>Two ways to say “give it a try.”</h3>
        <span className="fine-print">
          {observedResults
            ? 'Campaign concepts · observations below'
            : 'Campaign concepts · awaiting field observations'}
        </span>
      </div>
      <div className="creative-picker" aria-label="Campaign creative selection">
        {campaignCreatives.map((item) => (
          <button
            type="button"
            className={`creative-button ${creativeId === item.id ? 'is-selected' : ''}`}
            key={item.id}
            aria-pressed={creativeId === item.id}
            onClick={() => setCreativeId(item.id)}
          >
            <span className="creative-caption">
              <span id={`creative-name-${item.id}`}>{item.name}:</span>
              <span>
                {creativeId === item.id ? 'Selected' : 'Explore'} <span aria-hidden="true">↗</span>
              </span>
            </span>
            <span className={`creative-poster creative-poster--${item.id}`}>
              <span className="creative-brand">BOLO. DON’T TYPE.</span>
              <span className="creative-title" id={`creative-title-${item.id}`}>
                {item.title}
              </span>
              <span className="creative-subtitle">{item.subtitle}</span>
              <span className="creative-footer">
                A VOICE-FIRST CAMPUS EXPERIMENT <span aria-hidden="true">↗</span>
              </span>
            </span>
          </button>
        ))}
      </div>
      <div className="creative-meta" aria-live="polite" aria-atomic="true">
        <div>
          <span className="eyebrow">Intended audience</span>
          <p>{creative.audience}</p>
        </div>
        <div>
          <span className="eyebrow">Hypothesis to test</span>
          <p>{creative.hypothesis}</p>
        </div>
        <p className="creative-question">{creative.question}</p>
      </div>

      <div className="campaign-step-heading">
        <span className="step-number">02</span>
        <h3>Start with something familiar.</h3>
      </div>
      <div className="scenario-picker" aria-label="Student writing situation">
        {writingScenarios.map((item) => (
          <button
            type="button"
            className="scenario-button"
            aria-pressed={scenarioId === item.id}
            key={item.id}
            onClick={() => setScenarioId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="scenario-detail" aria-live="polite" aria-atomic="true">
        <div>
          <span className="eyebrow">Proposed pilot task</span>
          <h4>{scenario.prompt}</h4>
        </div>
        <div>
          <p>{scenario.task}</p>
          <p className="fine-print">What we want to learn: {scenario.learn}</p>
        </div>
      </div>
      <div className="campaign-demonstration">
        <MediaEvidence
          title="See a real Flow demonstration"
          media={campaignDemonstration}
          pendingText="A genuine Wispr Flow demonstration will appear here when recorded. Until then, explore the official product."
        />
        <a
          className="button button-primary"
          href="https://wisprflow.ai/india"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore Wispr Flow <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>

      <div className="campaign-step-heading">
        <span className="step-number">03</span>
        <h3>Show the denominators. Keep the doubts.</h3>
      </div>
      <div className="pilot-results" aria-label="Pilot results">
        {results ? (
          <ExperimentResults results={results} />
        ) : (
          <div className="pilot-pending">
            <h4>Results unavailable.</h4>
            <p>The supplied aggregate data failed validation. No rates are displayed.</p>
          </div>
        )}
      </div>

      <details className="onboarding-teardown">
        <summary>
          <span>From “looks interesting” to a first dictation</span>
          <span className="fine-print">Five-stage onboarding observation log</span>
        </summary>
        <p>
          Each stage will connect an actual observation to a practical improvement. No friction is
          assumed in advance.
        </p>
        <div className="onboarding-stages">
          {onboardingStages.map((stage, index) => (
            <details className="onboarding-stage" key={stage.id}>
              <summary>
                <span className="step-number">0{index + 1}</span>
                <span>{stage.title}</span>
                <span className="status-label">{stage.observation ? 'Observed' : 'Pending'}</span>
              </summary>
              <p>{stage.question}</p>
              <dl>
                <div>
                  <dt>Observation</dt>
                  <dd>{stage.observation ?? 'Awaiting a real session.'}</dd>
                </div>
                <div>
                  <dt>Friction</dt>
                  <dd>{stage.friction ?? 'Not yet observed.'}</dd>
                </div>
                <div>
                  <dt>Why it matters</dt>
                  <dd>{stage.whyItMatters ?? 'Pending evidence.'}</dd>
                </div>
                <div>
                  <dt>Proposed improvement</dt>
                  <dd>{stage.proposedImprovement ?? 'Pending evidence.'}</dd>
                </div>
                <div>
                  <dt>Evidence source</dt>
                  <dd>
                    {stage.evidence ? (
                      <a href={stage.evidence.href} target="_blank" rel="noopener noreferrer">
                        {stage.evidence.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      'Not supplied.'
                    )}
                  </dd>
                </div>
              </dl>
              {stage.id === 'hinglish' && (
                <p className="fine-print">
                  Flow’s documentation says to select Hinglish explicitly. Auto-detect or selecting
                  Hindi and English does not request Hinglish.{' '}
                  <a
                    href="https://docs.wisprflow.ai/articles/3191899797"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read the language guidance<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  . Accuracy still needs testing.
                </p>
              )}
            </details>
          ))}
        </div>
      </details>

      <div className="experiment-notes lessons-grid">
        <div>
          <span className="eyebrow">What worked / what failed</span>
          <h3>
            {observedResults && observedResults.lessons.length > 0
              ? 'What the sessions revealed.'
              : observedResults
                ? 'Lessons not yet recorded.'
                : 'The findings come after the fieldwork.'}
          </h3>
          {observedResults && observedResults.lessons.length > 0 ? (
            <ul>
              {observedResults.lessons.map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          ) : (
            <p>
              {observedResults
                ? 'An interpretation has not been supplied. Counts alone do not explain what worked or failed.'
                : 'Lessons will be published after real sessions. An unexpected result belongs here too.'}
            </p>
          )}
          {observedResults && (
            <>
              <h4>Observed friction</h4>
              {observedResults.friction.length > 0 ? (
                <ul>
                  {observedResults.friction.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>Not recorded.</p>
              )}
            </>
          )}
        </div>
        <div>
          <span className="eyebrow">Who we reached / who we missed</span>
          <h3>A small sample needs clear limits.</h3>
          {observedResults && observedResults.limitations.length > 0 ? (
            <ul>
              {observedResults.limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>
              {observedResults
                ? 'Recruitment limitations and groups not reached have not been recorded.'
                : 'The planned recruitment relies on existing networks. Actual reach, missing groups, device constraints, and sampling bias will be reported with the results.'}
            </p>
          )}
          <h4>What to test next</h4>
          <p>
            {observedResults?.nextTest ??
              (observedResults
                ? 'No follow-up test has been recorded.'
                : 'Choose the next test from observed friction and feedback, rather than inventing a conclusion now.')}
          </p>
        </div>
      </div>

      <details className="built-out-loud">
        <summary>
          <span>
            <span className="voice-mark" aria-hidden="true">
              ııı
            </span>{' '}
            Built Out Loud
          </span>
          <span className="fine-print">Wispr Flow → Emergent · development evidence</span>
        </summary>
        <p>
          This log is reserved for actual Wispr Flow instructions dictated into Emergent. This
          portfolio does not run a Wispr speech-recognition API.
        </p>
        {parsedVoice.success && parsedVoice.data.length > 0 ? (
          <div className="voice-entries">
            {parsedVoice.data.map((entry) => (
              <article key={entry.id}>
                <time dateTime={entry.date}>{entry.date}</time>
                <h4>{entry.spokenIntention}</h4>
                <dl>
                  <div>
                    <dt>Dictated instruction</dt>
                    <dd>{entry.dictatedInstruction}</dd>
                  </div>
                  <div>
                    <dt>Emergent change</dt>
                    <dd>{entry.emergentChange}</dd>
                  </div>
                  <div>
                    <dt>Accepted or corrected</dt>
                    <dd>{entry.acceptedOrCorrected}</dd>
                  </div>
                </dl>
                <MediaEvidence title="Original development recording" media={entry.media} />
              </article>
            ))}
          </div>
        ) : (
          <p className="voice-log-pending">
            {parsedVoice.success
              ? 'Genuine voice-build recordings have not been supplied yet. No completed entries are claimed.'
              : 'Development evidence is unavailable because its manifest failed validation.'}
          </p>
        )}
      </details>
    </section>
  );
}
