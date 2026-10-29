export type Challenge = {
  id: 'build' | 'failure' | 'growth';
  question: string;
  title: string;
  body: string;
  cta: string;
  target: '#decision' | '#campaign';
  sourceUrl?: string;
};

export const challenges: readonly Challenge[] = [
  {
    id: 'build',
    question: 'Can you actually build things?',
    title: 'Inspect a decision the software really makes.',
    body: 'JalRakshak is a working local prototype with public source and a real interface demonstration. Try one decision about stale evidence, then inspect what the project implements and where its evidence ends.',
    cta: 'Try the decision',
    target: '#decision',
    sourceUrl: 'https://github.com/Pradhyut21/jalrakshak',
  },
  {
    id: 'failure',
    question: 'What happens when your first attempt fails?',
    title: 'Keep the critique. Change the implementation.',
    body: 'JalRakshak’s review identified a forecast that could warn too late. The documented revisions added historical demand and explicit uncertainty assumptions. Stress cases still fail; those limits remain public rather than becoming a success story.',
    cta: 'Inspect the evidence',
    target: '#decision',
    sourceUrl:
      'https://github.com/Pradhyut21/jalrakshak/blob/c40896b9a24ea66c08e9857e61b6fb15da4e985e/docs/REVIEW_RESPONSE.md',
  },
  {
    id: 'growth',
    question: 'Why should a growth team hire someone with a technical background?',
    title: 'A useful build is the start of a question.',
    body: 'The next question is whether people try it, complete the first task, and find a reason to return. BOLO. DON’T TYPE. turns that question into a small campus experiment with two messages, visible denominators, and room for an uncomfortable result.',
    cta: 'Explore the experiment',
    target: '#campaign',
  },
];
