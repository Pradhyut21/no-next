import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Proof over promises.');
});

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
}

test('three distinct challenges reveal evidence-backed answers and working next actions', async ({
  page,
}) => {
  const challengeCases = [
    {
      question: 'Can you actually build things?',
      title: 'Inspect a decision the software really makes.',
      action: 'Try the decision',
      href: '#decision',
    },
    {
      question: 'What happens when your first attempt fails?',
      title: 'Keep the critique. Change the implementation.',
      action: 'Inspect the evidence',
      href: '#decision',
    },
    {
      question: 'Why should a growth team hire someone with a technical background?',
      title: 'A useful build is the start of a question.',
      action: 'Explore the experiment',
      href: '#campaign',
    },
  ];
  const answers = page.locator('#challenge-answer');
  const responses = new Set<string>();
  for (const item of challengeCases) {
    const choice = page.locator('.challenge-choice').filter({ hasText: item.question });
    await choice.click();
    await expect(choice).toHaveAttribute('aria-pressed', 'true');
    await expect(answers.getByRole('heading', { name: item.title, exact: true })).toBeVisible();
    responses.add(await answers.innerText());
    await expect(answers.getByText('Recording pending', { exact: true })).toBeVisible();
    const action = answers.getByRole('link', { name: item.action, exact: true });
    await expect(action).toHaveAttribute('href', item.href);
    await action.click();
    await expect(page).toHaveURL(new RegExp(`${item.href}$`));
  }
  expect(responses.size).toBe(3);
});

test('all three hypothetical decisions explain consequences and retain the documented UNKNOWN rule', async ({
  page,
}) => {
  const options = [
    { label: 'Send an urgent warning', principle: 'Urgency does not make old evidence current.' },
    {
      label: 'Mark UNKNOWN. Get a fresh reading.',
      principle: 'Missing evidence deserves an explicit state.',
    },
    {
      label: 'Ignore the issue indefinitely',
      principle: 'Uncertainty needs a next action, not silence.',
    },
  ];
  await expect(page.locator('.simulation-label')).toHaveText('SIMULATED');
  for (const option of options) {
    const choice = page.locator('.decision-option').filter({ hasText: option.label });
    await choice.click();
    await expect(choice).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#decision-result')).toContainText(option.principle);
    await expect(page.locator('#decision-result')).toContainText(
      'The choice above is hypothetical.',
    );
    await expect(page.locator('#decision-result')).toContainText(
      'UNKNOWN, with projections withheld',
    );
  }
  await expect(
    page.getByText('These choices trigger no operational actions.', { exact: false }),
  ).toBeVisible();
});

test('evidence dialog loads real evidence, traps keyboard focus, and restores focus on Escape', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'Inspect the real evidence', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole('button', { name: 'Close evidence', exact: true });
  await expect(close).toBeFocused();
  const screenshot = dialog.getByRole('img');
  await expect(screenshot).toBeVisible();
  await expect
    .poll(() =>
      screenshot.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
    )
    .toBe(true);
  await expect(dialog.getByText(/SIMULATED DEMO · Actual interface/)).toBeVisible();
  await expect(dialog).toContainText('fictional tank data and synthetic narration');
  await expect(dialog.getByRole('link', { name: 'Inspect repository' })).toHaveAttribute(
    'href',
    'https://github.com/Pradhyut21/jalrakshak',
  );
  await expect(dialog.getByRole('link', { name: 'Watch recorded demo' })).toHaveAttribute(
    'href',
    'https://youtu.be/zM4BsdQfPdg',
  );

  const returnButton = dialog.getByRole('button', { name: 'Return to the decision', exact: true });
  await page.keyboard.press('Shift+Tab');
  expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await returnButton.focus();
  await page.keyboard.press('Tab');
  expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  for (let count = 0; count < 10; count += 1) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await returnButton.click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await close.click();
  await expect(dialog).not.toBeVisible();
});

test('keyboard skip link and guided navigation connect all three experiences', async ({ page }) => {
  await page.keyboard.press('Tab');
  const skip = page.locator('.skip-link');
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#decision$/);
  await expect(page.locator('#decision')).toBeFocused();
  await page.getByRole('link', { name: 'Now take the idea to people', exact: true }).click();
  await expect(page).toHaveURL(/#campaign$/);
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  for (const [label, hash] of [
    ['01Challenge me', '#challenge'],
    ['02The decision', '#decision'],
    ['03The experiment', '#campaign'],
  ]) {
    if (!label || !hash) throw new Error('Missing test navigation case.');
    await nav.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
  }
  await page.getByRole('link', { name: 'Continue to one real decision', exact: true }).click();
  await expect(page).toHaveURL(/#decision$/);
});

test('both creatives reveal their audiences and hypotheses', async ({ page }) => {
  const a = page.getByRole('button', { name: /Creative A.*BOLO\. TYPE MAT\./ });
  const b = page.getByRole('button', {
    name: /Creative B.*That draft you’ve been avoiding\? Say it\./,
  });
  await b.click();
  await expect(b).toHaveAttribute('aria-pressed', 'true');
  await expect(a).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.creative-meta')).toContainText(
    'Students putting off a short writing task.',
  );
  await expect(page.locator('.creative-meta')).toContainText('The pain of getting started');
  await a.click();
  await expect(a).toHaveAttribute('aria-pressed', 'true');
  await expect(b).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.creative-meta')).toContainText(
    'Students comfortable with English and Hinglish.',
  );
  await expect(page.locator('.creative-meta')).toContainText('A familiar phrase');
});

test('all three writing situations work without collecting dictation or requesting a microphone', async ({
  page,
}) => {
  const scenarios = [
    {
      label: 'Internship introduction',
      prompt: 'Introduce yourself without staring at an empty draft.',
    },
    {
      label: 'Project explanation',
      prompt: 'Explain what you built in words someone else can follow.',
    },
    {
      label: 'Campus announcement',
      prompt: 'Get the important details out of your head and onto the page.',
    },
  ];
  for (const scenario of scenarios) {
    const button = page.getByRole('button', { name: scenario.label, exact: true });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.scenario-detail')).toContainText(scenario.prompt);
    await expect(page.locator('.scenario-detail')).toContainText('What we want to learn:');
  }
  await expect(page.locator('textarea,input,audio,video')).toHaveCount(0);
  const flowLink = page.getByRole('link', { name: 'Explore Wispr Flow', exact: false });
  await expect(flowLink).toHaveAttribute('href', 'https://wisprflow.ai/india');
  await expect(flowLink).toHaveAttribute('target', '_blank');
  await expect(page.locator('.campaign-demonstration')).toContainText(
    'A genuine Wispr Flow demonstration will appear here when recorded.',
  );
});

test('public pilot state makes no invented outcome or participant-count claim', async ({
  page,
}) => {
  const results = page.getByLabel('Pilot results');
  await expect(
    results.getByRole('heading', { name: 'Experiment in progress.', exact: true }),
  ).toBeVisible();
  await expect(results).toContainText('Participant results have not been supplied yet.');
  await expect(results).toContainText('Planned sample');
  await expect(results).toContainText('10–15 adult volunteers');
  await expect(results).toContainText('no claim to represent all Indian students');
  await expect(results.locator('.metric-card,.pilot-counts')).toHaveCount(0);
  expect(await results.innerText()).not.toMatch(/\d+(?:\.\d+)?%/);
  await expect(page.locator('.lessons-grid')).toContainText(
    'Lessons will be published after real sessions.',
  );
  await expect(page.locator('.lessons-grid')).toContainText(
    'Actual reach, missing groups, device constraints, and sampling bias will be reported',
  );
});

test('onboarding and Built Out Loud expand using the keyboard and stay explicitly pending', async ({
  page,
}) => {
  const onboarding = page.locator('.onboarding-teardown');
  await onboarding.locator(':scope > summary').focus();
  await page.keyboard.press('Enter');
  await expect(onboarding).toHaveAttribute('open', '');
  const stages = onboarding.locator('.onboarding-stage');
  await expect(stages).toHaveCount(5);
  for (let index = 0; index < 5; index += 1) {
    const stage = stages.nth(index);
    await stage.locator('summary').click();
    await expect(stage).toHaveAttribute('open', '');
    await expect(stage).toContainText('Awaiting a real session.');
    await expect(stage).toContainText('Not yet observed.');
    await expect(stage.locator('.status-label')).toHaveText('Pending');
  }
  await expect(stages.last()).toContainText('select Hinglish explicitly');
  const voiceLog = page.locator('.built-out-loud');
  await voiceLog.locator(':scope > summary').focus();
  await page.keyboard.press('Space');
  await expect(voiceLog).toHaveAttribute('open', '');
  await expect(voiceLog).toContainText('No completed entries are claimed.');
  await expect(voiceLog).toContainText(
    'This portfolio does not run a Wispr speech-recognition API.',
  );
  await expect(voiceLog.locator('.voice-entries article')).toHaveCount(0);
});

for (const width of [360, 390, 768, 1440]) {
  test(`all experiences and the drawer reflow without horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await expectNoHorizontalOverflow(page);
    await page
      .locator('.challenge-choice')
      .filter({ hasText: 'Why should a growth team hire someone with a technical background?' })
      .click();
    await expectNoHorizontalOverflow(page);
    await page
      .locator('.decision-option')
      .filter({ hasText: 'Mark UNKNOWN. Get a fresh reading.' })
      .click();
    await page.getByRole('button', { name: 'Inspect the real evidence', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? Infinity)).toBeLessThanOrEqual(width + 1);
    expect(await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
    await page.keyboard.press('Escape');
    await page
      .getByRole('button', { name: /Creative B.*That draft you’ve been avoiding\? Say it\./ })
      .click();
    await page.locator('.onboarding-teardown > summary').click();
    await page.locator('.built-out-loud > summary').click();
    await expectNoHorizontalOverflow(page);
  });
}

test('page, expanded campaign, and evidence dialog have no automated WCAG A/AA violations', async ({
  page,
}) => {
  test.setTimeout(60000);
  const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
  const initial = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(initial.violations).toEqual([]);
  await page.locator('.onboarding-teardown > summary').click();
  await page.locator('.onboarding-stage').last().locator('summary').click();
  await page.locator('.built-out-loud > summary').click();
  const campaign = await new AxeBuilder({ page }).include('#campaign').withTags(tags).analyze();
  expect(campaign.violations).toEqual([]);
  await page.getByRole('button', { name: 'Inspect the real evidence', exact: true }).click();
  const drawer = await new AxeBuilder({ page }).include('dialog').withTags(tags).analyze();
  expect(drawer.violations).toEqual([]);
});

test('reduced motion removes smooth scrolling and transition effects', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const styles = await page.evaluate(() => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    transitionDuration: getComputedStyle(document.querySelector('.creative-button')!)
      .transitionDuration,
    animationName: getComputedStyle(document.querySelector('.work-note')!).animationName,
  }));
  expect(styles.scrollBehavior).toBe('auto');
  expect(styles.transitionDuration).toBe('0s');
  expect(styles.animationName).toBe('none');
});

test('the main journey has no uncaught runtime errors or failed local assets', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.url().startsWith('http://127.0.0.1:4173') && response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await page.reload();
  await page
    .locator('.challenge-choice')
    .filter({ hasText: 'Can you actually build things?' })
    .click();
  await page
    .locator('.decision-option')
    .filter({ hasText: 'Mark UNKNOWN. Get a fresh reading.' })
    .click();
  await page.getByRole('button', { name: 'Inspect the real evidence', exact: true }).click();
  await expect
    .poll(() =>
      page
        .getByRole('dialog')
        .getByRole('img')
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Campus announcement', exact: true }).click();
  await page.locator('.built-out-loud > summary').click();
  expect(errors).toEqual([]);
});
