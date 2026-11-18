import { PlacementQuestion } from './types';

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // A1 Level
  {
    id: 'pq_1',
    category: 'Grammar',
    targetLevel: 'A1',
    question: 'She _____ English every day at school.',
    options: [
      { id: 'a', text: 'studies' },
      { id: 'b', text: 'studying' },
      { id: 'c', text: 'study' },
      { id: 'd', text: 'is study' }
    ],
    correctOptionId: 'a',
    explanation: 'Present Simple 3rd person singular takes "-s/-ies" (she studies).'
  },
  {
    id: 'pq_2',
    category: 'Vocabulary',
    targetLevel: 'A1',
    question: 'Choose the correct opposite: "My room is very quiet."',
    options: [
      { id: 'a', text: 'noisy' },
      { id: 'b', text: 'clean' },
      { id: 'c', text: 'bright' },
      { id: 'd', text: 'small' }
    ],
    correctOptionId: 'a',
    explanation: 'The opposite of quiet is noisy.'
  },

  // A2 Level
  {
    id: 'pq_3',
    category: 'Grammar',
    targetLevel: 'A2',
    question: 'While I _____ home yesterday, it started to rain heavily.',
    options: [
      { id: 'a', text: 'was walking' },
      { id: 'b', text: 'walked' },
      { id: 'c', text: 'have walked' },
      { id: 'd', text: 'am walking' }
    ],
    correctOptionId: 'a',
    explanation: 'Past Continuous (was walking) describes an action in progress interrupted by Past Simple (started).'
  },
  {
    id: 'pq_4',
    category: 'Vocabulary',
    targetLevel: 'A2',
    question: 'If you want to catch the train, you must arrive at the station _____ time.',
    options: [
      { id: 'a', text: 'on' },
      { id: 'b', text: 'at' },
      { id: 'c', text: 'by' },
      { id: 'd', text: 'in' }
    ],
    correctOptionId: 'a',
    explanation: '"On time" means punctual / at the scheduled time.'
  },

  // B1 Level
  {
    id: 'pq_5',
    category: 'Grammar',
    targetLevel: 'B1',
    question: 'I _____ in this city since 2018, so I know it very well.',
    options: [
      { id: 'a', text: 'have lived' },
      { id: 'b', text: 'lived' },
      { id: 'c', text: 'am living' },
      { id: 'd', text: 'was living' }
    ],
    correctOptionId: 'a',
    explanation: 'Present Perfect (have lived) is used with "since" for actions starting in the past and continuing to the present.'
  },
  {
    id: 'pq_6',
    category: 'Reading & Usage',
    targetLevel: 'B1',
    question: 'If I _____ more free time, I would take up oil painting.',
    options: [
      { id: 'a', text: 'had' },
      { id: 'b', text: 'have' },
      { id: 'c', text: 'would have' },
      { id: 'd', text: 'will have' }
    ],
    correctOptionId: 'a',
    explanation: 'Second Conditional structure: If + Past Simple (had), would + infinitive (would take up).'
  },

  // B2 Level
  {
    id: 'pq_7',
    category: 'Grammar',
    targetLevel: 'B2',
    question: 'By the time the conference starts tomorrow, the manager _____ the presentation.',
    options: [
      { id: 'a', text: 'will have finished' },
      { id: 'b', text: 'finishes' },
      { id: 'c', text: 'will finish' },
      { id: 'd', text: 'is finishing' }
    ],
    correctOptionId: 'a',
    explanation: 'Future Perfect (will have finished) expresses an action completed before a specific point in the future.'
  },
  {
    id: 'pq_8',
    category: 'Vocabulary',
    targetLevel: 'B2',
    question: 'The committee decided to _____ the new policy due to lack of funding.',
    options: [
      { id: 'a', text: 'postpone' },
      { id: 'b', text: 'post' },
      { id: 'c', text: 'propose' },
      { id: 'd', text: 'preserve' }
    ],
    correctOptionId: 'a',
    explanation: 'Postpone means to delay or defer an event or decision.'
  },

  // C1 Level
  {
    id: 'pq_9',
    category: 'Reading & Usage',
    targetLevel: 'C1',
    question: 'Scarcely _____ the stage when the applause burst out from the audience.',
    options: [
      { id: 'a', text: 'had the singer stepped onto' },
      { id: 'b', text: 'the singer had stepped onto' },
      { id: 'c', text: 'did the singer step onto' },
      { id: 'd', text: 'has the singer stepped onto' }
    ],
    correctOptionId: 'a',
    explanation: 'Negative adverbial inversion: Scarcely + had + subject + past participle.'
  },
  {
    id: 'pq_10',
    category: 'Vocabulary',
    targetLevel: 'C1',
    question: 'Her arguments were so _____ that even her opponents had to concede.',
    options: [
      { id: 'a', text: 'cogent' },
      { id: 'b', text: 'redundant' },
      { id: 'c', text: 'superficial' },
      { id: 'd', text: 'ambiguous' }
    ],
    correctOptionId: 'a',
    explanation: '"Cogent" means clear, logical, and convincing.'
  },

  // C2 Level
  {
    id: 'pq_11',
    category: 'Grammar',
    targetLevel: 'C2',
    question: 'Were it not for your timely intervention, the project _____ in complete failure.',
    options: [
      { id: 'a', text: 'would have culminated' },
      { id: 'b', text: 'will culminate' },
      { id: 'c', text: 'had culminated' },
      { id: 'd', text: 'culminates' }
    ],
    correctOptionId: 'a',
    explanation: 'Inverted third conditional: Were it not for X, Y would have + past participle.'
  },
  {
    id: 'pq_12',
    category: 'Reading & Usage',
    targetLevel: 'C2',
    question: 'The author\'s style is marked by an _____ use of metaphor and subtle irony.',
    options: [
      { id: 'a', text: 'exquisite' },
      { id: 'b', text: 'exorbitant' },
      { id: 'c', text: 'erratic' },
      { id: 'd', text: 'expendable' }
    ],
    correctOptionId: 'a',
    explanation: '"Exquisite" indicates extremely beautiful or delicate craftsmanship/style.'
  }
];
