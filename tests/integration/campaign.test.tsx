import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { PilotResults } from '../../src/domain/pilot-schema';

const state = vi.hoisted(() => ({ pilot: {} as Record<string, unknown> }));
vi.mock('../../src/content/pilot-results.json', () => ({ default: state.pilot }));

import Campaign from '../../src/components/Campaign';

// Synthetic values are kept in this test file and never exported into public data.
function fixture(status: PilotResults['status'] = 'complete'): PilotResults {
  return {
    schemaVersion: 1,
    status,
    dates: {
      start: status === 'planned' ? null : '2026-10-29',
      end: status === 'complete' ? '2026-10-30' : null,
    },
    recruitment: {
      description: status === 'planned' ? null : 'Synthetic test cohort only.',
      uniqueInvited: status === 'planned' ? null : 20,
      invitationDeliveries: status === 'planned' ? null : 25,
      volunteered: status === 'planned' ? null : 12,
      consented: status === 'planned' ? null : 10,
      started: status === 'planned' ? null : 8,
      completed: status === 'planned' ? null : 6,
    },
    usability:
      status === 'planned'
        ? { yes: null, no: null, notAsked: null }
        : { yes: 3, no: 1, notAsked: 2 },
    reuse:
      status === 'planned'
        ? { yes: null, no: null, notAsked: null }
        : { yes: 2, no: 3, notAsked: 1 },
    devices: [],
    languages: [],
    creativeExposures: [],
    friction: [],
    limitations: [],
    lessons: [],
    nextTest: null,
  };
}

function setPilot(value: unknown) {
  for (const key of Object.keys(state.pilot)) delete state.pilot[key];
  if (typeof value === 'object' && value !== null) Object.assign(state.pilot, value);
}

beforeEach(() => setPilot(fixture('planned')));

describe('campaign interactions and truthful pending states', () => {
  it('renders both creative concepts and switches their hypotheses', async () => {
    const user = userEvent.setup();
    render(<Campaign />);
    const creativeA = screen.getByRole('button', { name: /Creative A.*BOLO\. TYPE MAT\./ });
    const creativeB = screen.getByRole('button', {
      name: /Creative B.*That draft you’ve been avoiding\? Say it\./,
    });
    expect(creativeA).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByText('A familiar phrase may make voice dictation feel easier to try.'),
    ).toBeVisible();
    await user.click(creativeB);
    expect(creativeB).toHaveAttribute('aria-pressed', 'true');
    expect(creativeA).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.getByText('The pain of getting started may be a stronger invitation than novelty.'),
    ).toBeVisible();
    await user.click(creativeA);
    expect(
      screen.getByText('A familiar phrase may make voice dictation feel easier to try.'),
    ).toBeVisible();
  });

  it.each([
    ['Internship introduction', 'Introduce yourself without staring at an empty draft.'],
    ['Project explanation', 'Explain what you built in words someone else can follow.'],
    ['Campus announcement', 'Get the important details out of your head and onto the page.'],
  ])('selects the %s proposed task', async (label, prompt) => {
    const user = userEvent.setup();
    render(<Campaign />);
    const choice = screen.getByRole('button', { name: label });
    await user.click(choice);
    expect(choice).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { name: prompt })).toBeVisible();
    expect(screen.getByText('Proposed pilot task')).toBeVisible();
  });

  it('shows pending results without invented rates or participant counts', () => {
    render(<Campaign />);
    const results = screen.getByRole('generic', { name: 'Pilot results' });
    expect(within(results).getByRole('heading', { name: 'Experiment in progress.' })).toBeVisible();
    expect(results.textContent).not.toContain('%');
    expect(screen.queryByRole('heading', { name: 'Reported usable text' })).not.toBeInTheDocument();
    expect(within(results).getByText('10–15 adult volunteers')).toBeVisible();
    expect(within(results).getByText('Planned sample')).toBeVisible();
  });

  it('provides a genuine product link and a pending demonstration', () => {
    render(<Campaign />);
    const link = screen.getByRole('link', { name: /Explore Wispr Flow/ });
    expect(link).toHaveAttribute('href', 'https://wisprflow.ai/india');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('Recording pending')).toBeVisible();
    expect(
      screen.getByText(/A genuine Wispr Flow demonstration will appear here when recorded/),
    ).toBeVisible();
  });

  it('opens the five-stage onboarding log without claiming observations', async () => {
    const user = userEvent.setup();
    render(<Campaign />);
    await user.click(screen.getByText('From “looks interesting” to a first dictation'));
    expect(screen.getAllByText('Pending', { exact: true })).toHaveLength(5);
    await user.click(screen.getByText('Find and select Hinglish', { exact: true }));
    expect(
      screen.getByText(/Flow’s documentation says to select Hinglish explicitly/),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: /Read the language guidance/ })).toHaveAttribute(
      'href',
      'https://docs.wisprflow.ai/articles/3191899797',
    );
    expect(screen.getAllByText('Awaiting a real session.')).toHaveLength(5);
  });

  it('expands the compact voice log and discloses missing genuine evidence', async () => {
    const user = userEvent.setup();
    render(<Campaign />);
    await user.click(screen.getByText('Built Out Loud', { exact: false }));
    expect(
      screen.getByText(/Genuine voice-build recordings have not been supplied yet/),
    ).toBeVisible();
    expect(
      screen.getByText(/This portfolio does not run a Wispr speech-recognition API/),
    ).toBeVisible();
  });
});

describe('campaign aggregate result rendering', () => {
  it('renders observed fractions with actual response denominators', () => {
    const pilot = fixture();
    pilot.lessons = ['Synthetic lesson for rendering checks.'];
    pilot.friction = ['Synthetic observed obstacle.'];
    pilot.limitations = ['Synthetic cohort limitation.'];
    pilot.nextTest = 'Synthetic next test.';
    setPilot(pilot);
    render(<Campaign />);
    expect(screen.getByText('10 of 20 · 50.0%')).toBeVisible();
    expect(screen.getByText('6 of 8 · 75.0%')).toBeVisible();
    expect(screen.getByText('6 of 20 · 30.0%')).toBeVisible();
    expect(screen.getByText('3 of 4 · 75.0%')).toBeVisible();
    expect(screen.getByText('2 of 5 · 40.0%')).toBeVisible();
    expect(screen.queryByText('3 of 6 · 50.0%')).not.toBeInTheDocument();
    expect(screen.getByText('Synthetic lesson for rendering checks.')).toBeVisible();
    expect(screen.getByText('Synthetic observed obstacle.')).toBeVisible();
    expect(screen.getByText('Synthetic cohort limitation.')).toBeVisible();
    expect(screen.getByText('Synthetic next test.')).toBeVisible();
    expect(screen.getByText('Campaign concepts · observations below')).toBeVisible();
    expect(screen.queryByText(/awaiting field observations/)).not.toBeInTheDocument();
    expect(screen.queryByText('The findings come after the fieldwork.')).not.toBeInTheDocument();
  });

  it('distinguishes an observed zero from unavailable feedback', () => {
    const pilot = fixture('running');
    pilot.usability = { yes: 0, no: 4, notAsked: 2 };
    pilot.reuse = { yes: null, no: null, notAsked: null };
    setPilot(pilot);
    render(<Campaign />);
    expect(screen.getByText('Pilot findings so far')).toBeVisible();
    expect(screen.getByText('0 of 4 · 0.0%')).toBeVisible();
    expect(screen.getByText('Not available', { selector: '.metric-value' })).toBeVisible();
  });

  it('suppresses numbers when the aggregate data fails validation', () => {
    const pilot = fixture();
    pilot.recruitment.completed = 99;
    setPilot(pilot);
    render(<Campaign />);
    const results = screen.getByRole('generic', { name: 'Pilot results' });
    expect(within(results).getByRole('heading', { name: 'Results unavailable.' })).toBeVisible();
    expect(results.textContent).not.toContain('%');
    expect(results.textContent).not.toContain('99');
  });

  it('keeps unobserved planned findings out of the public experience', () => {
    const pilot = fixture('planned');
    pilot.lessons = ['Synthetic unpublished lesson.'];
    pilot.friction = ['Synthetic unpublished friction.'];
    pilot.limitations = ['Synthetic unpublished limitation.'];
    pilot.nextTest = 'Synthetic unpublished follow-up.';
    setPilot(pilot);
    render(<Campaign />);
    expect(screen.getByRole('heading', { name: 'Experiment in progress.' })).toBeVisible();
    expect(screen.queryByText(/Synthetic unpublished/)).not.toBeInTheDocument();
    expect(screen.getByText('Campaign concepts · awaiting field observations')).toBeVisible();
  });

  it('does not describe unknown completed metadata as ongoing or observed zero', () => {
    const pilot = fixture();
    pilot.dates.end = null;
    setPilot(pilot);
    render(<Campaign />);
    expect(screen.getByText(/End not recorded/)).toBeVisible();
    expect(screen.queryByText(/to In progress/)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Lessons not yet recorded.' })).toBeVisible();
    expect(screen.getByText(/Counts alone do not explain what worked or failed/)).toBeVisible();
    expect(
      screen.getByText('Recruitment limitations and groups not reached have not been recorded.'),
    ).toBeVisible();
    expect(screen.getByText('No follow-up test has been recorded.')).toBeVisible();
  });
});
