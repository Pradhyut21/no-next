/** Factual project content. See docs/EVIDENCE_MANIFEST.md for pinned provenance. */
export const projectEvidence = {
  title: 'JalRakshak',
  repositoryUrl: 'https://github.com/Pradhyut21/jalrakshak',
  demoUrl: 'https://youtu.be/zM4BsdQfPdg',
  summary:
    'A working local water-supply planning prototype for one hostel caretaker and one tank. It connects timestamped observations, supply lead time, and human review.',
  implements: [
    'Timestamped storage observations and supply-planning calculations.',
    'An UNKNOWN state when readings are missing, stale, or insufficient.',
    'Simulated incidents, evidence-bound approval, and recovery supported by fresh observations.',
  ],
  principle:
    'When the evidence is insufficient, withhold a confident forecast. Request a fresh reading and keep the human decision visible.',
  limitations: [
    'A local prototype, not a field-validated water-management deployment.',
    'The demonstration uses fictional tank data and synthetic narration. It is not Wispr Flow voice-build evidence.',
    'Real sensor accuracy, caretaker usefulness, and measured water savings remain unvalidated.',
    'Tank-level changes cannot locate a physical leak. Synthetic stress cases still contain late predictions and false alerts.',
    'Approval saves a local notice. It does not contact suppliers or book water delivery.',
  ],
  screenshots: [
    {
      src: '/evidence/jalrakshak-dashboard.png',
      alt: 'Actual JalRakshak interface with a simulated tank reading and supply-planning deadline.',
      caption:
        'SIMULATED DEMO · Actual interface captured October 11, 2026. Fictional hostel and readings; the screen date is the fixture clock.',
    },
    {
      src: '/evidence/jalrakshak-unknown.png',
      alt: 'Actual empty JalRakshak workspace with no tank reading, no forecast, and no planning deadline.',
      caption:
        'EMPTY CAPTURE WORKSPACE · Actual interface captured October 11, 2026. No real tank log was imported. Missing evidence stays UNKNOWN.',
    },
  ],
  sources: [
    {
      label: 'Implementation and limitations',
      url: 'https://github.com/Pradhyut21/jalrakshak/blob/c40896b9a24ea66c08e9857e61b6fb15da4e985e/README.md',
    },
    {
      label: 'Review, revisions, and remaining failures',
      url: 'https://github.com/Pradhyut21/jalrakshak/blob/c40896b9a24ea66c08e9857e61b6fb15da4e985e/docs/REVIEW_RESPONSE.md',
    },
    {
      label: 'Screenshot provenance',
      url: 'https://github.com/Pradhyut21/jalrakshak/blob/c40896b9a24ea66c08e9857e61b6fb15da4e985e/docs/images/README.md',
    },
    {
      label: 'Demonstration and narration disclosure',
      url: 'https://github.com/Pradhyut21/jalrakshak/blob/c40896b9a24ea66c08e9857e61b6fb15da4e985e/docs/DEMO_VIDEO.md',
    },
  ],
} as const;
