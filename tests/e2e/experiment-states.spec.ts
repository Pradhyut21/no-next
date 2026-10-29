import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import type { PilotResults } from '../../src/domain/pilot-schema';

// These are synthetic browser-test cohorts, not pilot observations. They never enter public data.
function completedFixture(): PilotResults {
  return {
    schemaVersion: 1,
    status: 'complete',
    dates: { start: '2026-10-29', end: '2026-10-30' },
    recruitment: {
      description: 'Synthetic browser-test recruitment only. Never publish as fieldwork.',
      uniqueInvited: 15,
      invitationDeliveries: 18,
      volunteered: 12,
      consented: 10,
      started: 9,
      completed: 7,
    },
    usability: { yes: 4, no: 2, notAsked: 1 },
    reuse: { yes: 3, no: 3, notAsked: 1 },
    devices: [{ label: 'Synthetic device group', count: 10 }],
    languages: [{ label: 'Synthetic language setting', count: 7 }],
    creativeExposures: [{ label: 'Synthetic creative exposure', count: 10 }],
    friction: ['Synthetic observed friction for the browser test.'],
    limitations: ['Synthetic recruitment limitation for the browser test.'],
    lessons: ['Synthetic lesson for the browser test.'],
    nextTest: 'Synthetic next experiment for the browser test.',
  };
}

async function openWithAggregate(page: Page, aggregate: unknown) {
  // Intercept only this browser context's development module. The application has no fixture mode.
  await page.route('**/src/content/pilot-results.json*', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `export default ${JSON.stringify(aggregate)};`,
    }),
  );
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
}

function metric(page: Page, label: string) {
  return page.locator('.metric-card').filter({
    has: page.getByRole('heading', { name: label, exact: true }),
  });
}

test('completed aggregates show cohort counts, actual denominators, and supplied findings consistently', async ({
  page,
}) => {
  const pilot = completedFixture();
  await openWithAggregate(page, pilot);
  const results = page.getByLabel('Pilot results');

  await expect(page.locator('.note-status')).toHaveText('Pilot findings available');
  await expect(page.locator('.site-footer')).toContainText(
    'Pilot findings are reported with their actual denominators.',
  );
  await expect(results).toContainText(pilot.recruitment.description!);
  for (const [label, value] of [
    ['Unique adults invited', '15'],
    ['Invitation deliveries', '18'],
    ['Volunteered', '12'],
    ['Consented', '10'],
    ['Started Flow', '9'],
    ['Completed dictation', '7'],
  ] as const) {
    await expect(
      results.locator('.pilot-counts > div').filter({ hasText: label }).locator('dd'),
    ).toHaveText(value);
  }
  await expect(metric(page, 'Invitation → participation')).toContainText('10 of 15 · 66.7%');
  await expect(metric(page, 'Start → completion')).toContainText('7 of 9 · 77.8%');
  await expect(metric(page, 'Invitation → completion')).toContainText('7 of 15 · 46.7%');
  await expect(metric(page, 'Reported usable text')).toContainText('4 of 6 · 66.7%');
  await expect(metric(page, 'Would use again')).toContainText('3 of 6 · 50.0%');
  await expect(results).not.toContainText('4 of 7');
  await expect(results).toContainText('Synthetic device group: 10');
  await expect(results).toContainText('Synthetic language setting: 7');
  await expect(results).toContainText('Synthetic creative exposure: 10');
  await expect(page.locator('.lessons-grid')).toContainText(pilot.friction[0]!);
  await expect(page.locator('.lessons-grid')).toContainText(pilot.limitations[0]!);
  await expect(page.locator('.lessons-grid')).toContainText(pilot.lessons[0]!);
  await expect(page.locator('.lessons-grid')).toContainText(pilot.nextTest!);
  await expect(results).not.toContainText('Participant results have not been supplied yet.');
  await expect(page.locator('#campaign')).not.toContainText(
    'Campaign concepts · awaiting field observations',
  );
  await expect(page.locator('.lessons-grid')).not.toContainText(
    'The findings come after the fieldwork.',
  );
  await expect(page.locator('.voice-entries')).toHaveCount(0);
});

test('partial aggregates retain missing counts while rendering an observed zero feedback result', async ({
  page,
}) => {
  const pilot = completedFixture();
  pilot.status = 'running';
  pilot.dates.end = null;
  pilot.recruitment.completed = null;
  pilot.usability = { yes: 0, no: 4, notAsked: null };
  pilot.reuse = { yes: null, no: null, notAsked: null };
  await openWithAggregate(page, pilot);

  await expect(page.locator('.note-status')).toHaveText('Pilot underway · early observations');
  await expect(
    page.locator('.pilot-counts > div').filter({ hasText: 'Completed dictation' }).locator('dd'),
  ).toHaveText('Not available');
  await expect(metric(page, 'Start → completion').locator('.metric-value')).toHaveText(
    'Not available',
  );
  await expect(metric(page, 'Invitation → completion').locator('.metric-value')).toHaveText(
    'Not available',
  );
  await expect(metric(page, 'Reported usable text').locator('.metric-value')).toHaveText(
    '0 of 4 · 0.0%',
  );
  await expect(metric(page, 'Would use again').locator('.metric-value')).toHaveText(
    'Not available',
  );
});

test('observed zero is a count and zero denominators remain unavailable', async ({ page }) => {
  const pilot = completedFixture();
  pilot.recruitment.volunteered = 0;
  pilot.recruitment.consented = 0;
  pilot.recruitment.started = 0;
  pilot.recruitment.completed = 0;
  pilot.usability = { yes: 0, no: 0, notAsked: 0 };
  pilot.reuse = { yes: 0, no: 0, notAsked: 0 };
  pilot.devices = [];
  pilot.languages = [];
  pilot.creativeExposures = [];
  await openWithAggregate(page, pilot);

  await expect(
    page.locator('.pilot-counts > div').filter({ hasText: 'Completed dictation' }).locator('dd'),
  ).toHaveText('0');
  await expect(metric(page, 'Invitation → participation').locator('.metric-value')).toHaveText(
    '0 of 15 · 0.0%',
  );
  await expect(metric(page, 'Invitation → completion').locator('.metric-value')).toHaveText(
    '0 of 15 · 0.0%',
  );
  await expect(metric(page, 'Start → completion').locator('.metric-value')).toHaveText(
    'Not available',
  );
  await expect(metric(page, 'Reported usable text').locator('.metric-value')).toHaveText(
    'Not available',
  );
  await expect(metric(page, 'Would use again').locator('.metric-value')).toHaveText(
    'Not available',
  );
  await expect(page.getByLabel('Pilot results')).not.toContainText('NaN');
  await expect(page.getByLabel('Pilot results')).not.toContainText('Infinity');
});

test('an empty completed manifest does not turn unknown observations into zero results', async ({
  page,
}) => {
  const pilot = completedFixture();
  for (const key of [
    'uniqueInvited',
    'invitationDeliveries',
    'volunteered',
    'consented',
    'started',
    'completed',
  ] as const) {
    pilot.recruitment[key] = null;
  }
  pilot.recruitment.description = null;
  pilot.dates = { start: null, end: null };
  pilot.usability = { yes: null, no: null, notAsked: null };
  pilot.reuse = { yes: null, no: null, notAsked: null };
  pilot.devices = [];
  pilot.languages = [];
  pilot.creativeExposures = [];
  pilot.friction = [];
  pilot.limitations = [];
  pilot.lessons = [];
  pilot.nextTest = null;
  await openWithAggregate(page, pilot);

  await expect(page.locator('.note-status')).toHaveText('Experiment in progress');
  await expect(page.getByLabel('Pilot results')).toContainText('Experiment in progress.');
  await expect(page.locator('.metric-card, .pilot-counts')).toHaveCount(0);
  await expect(page.getByLabel('Pilot results')).not.toContainText('%');
});

for (const invalidCase of [
  'inconsistent funnel',
  'feedback beyond a known cohort',
  'participant-level records',
] as const) {
  test(`invalid ${invalidCase} suppress all public metrics and private fields`, async ({
    page,
  }) => {
    const pilot = completedFixture();
    let input: unknown = pilot;
    if (invalidCase === 'inconsistent funnel') pilot.recruitment.completed = 99;
    if (invalidCase === 'feedback beyond a known cohort') {
      pilot.recruitment.completed = null;
      pilot.usability = { yes: 100, no: 0, notAsked: 0 };
    }
    if (invalidCase === 'participant-level records')
      input = { ...pilot, participants: [{ name: 'PRIVATE_BROWSER_TEST_MARKER' }] };
    await openWithAggregate(page, input);

    await expect(page.locator('.note-status')).toHaveText('Results unavailable');
    await expect(page.getByLabel('Pilot results')).toContainText('Results unavailable.');
    await expect(page.locator('.site-footer')).toContainText('aggregate data needs correction.');
    await expect(page.locator('.metric-card, .pilot-counts')).toHaveCount(0);
    await expect(page.getByLabel('Pilot results')).not.toContainText('%');
    await expect(page.locator('body')).not.toContainText('PRIVATE_BROWSER_TEST_MARKER');
    await expect(page.locator('.lessons-grid')).not.toContainText(
      'Synthetic lesson for the browser test.',
    );
  });
}

test('completed results reflow at required widths and pass an automated accessibility scan', async ({
  page,
}) => {
  test.setTimeout(60000);
  await openWithAggregate(page, completedFixture());
  await expect(page.locator('.metric-card')).toHaveCount(5);
  await page.evaluate(() => document.fonts.ready);
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
    const results = page.getByLabel('Pilot results');
    expect(await results.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
  }
  const scan = await new AxeBuilder({ page })
    .include('#campaign')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(scan.violations).toEqual([]);
});
