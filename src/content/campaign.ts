export const campaignCreatives = [
  {
    id: 'a',
    name: 'Creative A',
    title: 'BOLO. TYPE MAT.',
    subtitle: 'Your next first draft starts with your voice.',
    audience: 'Students comfortable with English and Hinglish.',
    hypothesis: 'A familiar phrase may make voice dictation feel easier to try.',
    question: 'Does a locally familiar invitation encourage someone to start?',
  },
  {
    id: 'b',
    name: 'Creative B',
    title: 'That draft you’ve been avoiding? Say it.',
    subtitle: 'An internship intro. A project update. One less blank page.',
    audience: 'Students putting off a short writing task.',
    hypothesis: 'The pain of getting started may be a stronger invitation than novelty.',
    question: 'Does naming the blank-page problem encourage someone to start?',
  },
] as const;

export const writingScenarios = [
  {
    id: 'internship',
    label: 'Internship introduction',
    prompt: 'Introduce yourself without staring at an empty draft.',
    task: 'Try a short, fictional introduction: the kind of work you enjoy, a project you can explain, and what you want to learn.',
    learn: 'Would speaking help someone find their first sentence?',
  },
  {
    id: 'project',
    label: 'Project explanation',
    prompt: 'Explain what you built in words someone else can follow.',
    task: 'Describe a made-up project in three parts: the problem, one decision, and a limitation. Use throwaway details.',
    learn: 'Does a spoken explanation produce a useful starting draft?',
  },
  {
    id: 'campus',
    label: 'Campus announcement',
    prompt: 'Get the important details out of your head and onto the page.',
    task: 'Dictate an announcement for an imaginary campus event. Include what it is, when it happens, and how someone can take part.',
    learn: 'Can someone capture the essentials without losing details?',
  },
] as const;

type OnboardingStage = {
  id: string;
  title: string;
  question: string;
  observation: string | null;
  friction: string | null;
  whyItMatters: string | null;
  proposedImprovement: string | null;
  evidence: { label: string; href: string } | null;
};

const pendingObservation = {
  observation: null,
  friction: null,
  whyItMatters: null,
  proposedImprovement: null,
  evidence: null,
};

export const onboardingStages: readonly OnboardingStage[] = [
  {
    id: 'discover',
    title: 'Discover Flow',
    question: 'What made someone interested enough to try?',
    ...pendingObservation,
  },
  {
    id: 'install',
    title: 'Install the application',
    question: 'Could they get Flow running on an available device?',
    ...pendingObservation,
  },
  {
    id: 'permissions',
    title: 'Grant permissions',
    question: 'Did they understand the permissions needed to start?',
    ...pendingObservation,
  },
  {
    id: 'dictation',
    title: 'Complete a first dictation',
    question: 'Could they finish one real dictation using throwaway text?',
    ...pendingObservation,
  },
  {
    id: 'hinglish',
    title: 'Find and select Hinglish',
    question: 'Could they find the language setting they wanted to test?',
    ...pendingObservation,
  },
];
