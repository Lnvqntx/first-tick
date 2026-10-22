/**
 * First Tick: everything the club edits lives in this file.
 *
 * You should not need to touch any component to update dates, links,
 * resources or FAQ answers. After editing, run `npm run build` to check
 * nothing is broken, then push.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type DayNumber = 1 | 2 | 3 | 4

export interface EventDay {
  day: DayNumber
  /** ISO date-time with IST offset, e.g. '2026-10-27T00:00:00+05:30'. */
  date: string
  /** Short title shown under the schedule candle. */
  title: string
  /** Up to 3 short bullets, shown when the day is selected. */
  topics: string[]
  /** 'learning' days are theory sessions; 'assignment' is the submission day. */
  kind: 'learning' | 'assignment'
}

export interface ResourceItem {
  /** Stable id, used in URLs and React keys. Do not change once live. */
  id: string
  title: string
  /** Short line under the title. */
  description: string
  /** Which tab it lives under on /resources. */
  tab: ResourceTab
  /** The day it belongs to (null for the optional Python track). */
  day: DayNumber | null
  /** When the item is expected to unlock (ISO, IST). Shown as "Unlocks on …". */
  availableOn: string
  /**
   * Path to the file under /public, e.g. '/resources/day-1.pdf'.
   * null = locked / coming soon. Set this only once the file is committed.
   */
  file: string | null
}

export type ResourceTab = 'day-1' | 'day-2' | 'day-3' | 'assignment' | 'python'

export interface FaqItem {
  question: string
  answer: string
}

export interface EventConfig {
  name: string
  tagline: string
  /** One line under the hero wordmark. Keep it to 12 words or fewer. */
  heroLine: string
  /** The two scrolling bands under the hero. */
  marquee: {
    /** Bold band: the big themes. */
    primary: string[]
    /** Outlined band: the specific skills. */
    secondary: string[]
  }
  about: {
    /** Two short sentences. */
    intro: string[]
    /** Three one-line benefits. */
    benefits: { title: string; body: string }[]
  }
  clubName: string
  collegeName: string
  /** Club logo (circular seal on a transparent background). Regenerate with `npm run logo`. */
  clubLogo: { src: string; alt: string }
  collegeFullName: string
  campus: string
  datesConfirmed: boolean
  timezoneLabel: string
  submissionDeadline: string
  submissionDeadlineConfirmed: boolean
  days: EventDay[]
  links: {
    registrationForm: string
    whatsappCommunity: string
    submissionForm: string
  }
  resources: ResourceItem[]
  recordingUrl: string | null
  faq: FaqItem[]
}

/* ------------------------------------------------------------------ */
/* Event                                                               */
/* ------------------------------------------------------------------ */

export const event: EventConfig = {
  name: 'First Tick',
  tagline: 'Your first step into financial markets.',
  heroLine: 'A free three-day beginner programme on markets, risk and paper trading.',
  marquee: {
    primary: [
      'Market foundation',
      'Technical analysis',
      'Trading strategy',
      'Risk management',
      'Trading psychology',
      'Final challenge',
      'Certificate',
    ],
    secondary: [
      'Support and resistance',
      'Indicators',
      'Trendlines',
      'Stop-loss',
      'Position sizing',
      'Discipline',
      'Candlesticks',
    ],
  },

  about: {
    intro: [
      'First Tick is a free online programme by the Programming Club, CR Rao AIMSCS, for students who have never traded.',
      'It teaches how markets work and how to manage risk, not tips or promised profits.',
    ],
    benefits: [
      { title: 'Paper trading only', body: 'Practise with simulated money. Mistakes cost nothing.' },
      { title: 'Optional Python track', body: 'Plot a chart and backtest a moving-average crossover.' },
      { title: 'Community and doubts', body: 'One WhatsApp group for updates, one for questions.' },
    ],
  },
  clubName: 'Programming Club',
  collegeName: 'CR Rao AIMSCS',
  clubLogo: { src: '/brand/logo.png', alt: 'Programming Club, CR Rao AIMSCS logo' },
  /** Shown in small print where the full name helps. */
  collegeFullName: 'CR Rao Advanced Institute of Mathematics, Statistics and Computer Science',
  campus: 'University of Hyderabad campus',

  /**
   * false: every date on the site shows a small "Dates to be confirmed" note.
   * Flip to true once dates are final.
   */
  datesConfirmed: false,

  /** Shown on the site as the timezone label for every date. */
  timezoneLabel: 'IST',

  /** Day 4 deadline. Placeholder time until the club decides. */
  submissionDeadline: '2026-10-30T23:59:00+05:30',
  /** false: deadline time is shown with a "time to be confirmed" note. */
  submissionDeadlineConfirmed: false,

  days: [
    {
      day: 1,
      date: '2026-10-27T00:00:00+05:30',
      title: 'Markets and basics',
      kind: 'learning',
      topics: [
        'Stocks, exchanges, brokers and demat accounts',
        'Order types, and trading vs investing',
        'Personal finance basics and your first candlestick chart',
      ],
    },
    {
      day: 2,
      date: '2026-10-28T00:00:00+05:30',
      title: 'Analysis and movers',
      kind: 'learning',
      topics: [
        'Trends, support and resistance',
        'Moving averages and RSI',
        'What moves markets: fundamentals, news and macro',
      ],
    },
    {
      day: 3,
      date: '2026-10-29T00:00:00+05:30',
      title: 'Risk and strategy',
      kind: 'learning',
      topics: [
        'Entry, stop-loss, target and position sizing',
        'Trading psychology, real costs and spotting scams',
        'Guidance for the paper-trade assignment',
      ],
    },
    {
      day: 4,
      date: '2026-10-30T00:00:00+05:30',
      title: 'Assignment',
      kind: 'assignment',
      topics: [
        'Submit one paper trade as a PDF',
        'Annotated chart, entry, stop, target, risk-reward and position size',
        'A short justification of your plan',
      ],
    },
  ],

  /**
   * Links. Leave as '' until ready: any button with an empty link shows
   * as disabled with "Link coming soon" instead of a dead click.
   */
  links: {
    /** Google Form for registration, e.g. 'https://forms.gle/…'. Opens in a new tab. */
    registrationForm: '',
    /** The one WhatsApp community invite link, e.g. 'https://chat.whatsapp.com/…'. Opens in a new tab. */
    whatsappCommunity: '',
    /** Google Form (or similar) for the Day 4 PDF submission. */
    submissionForm: '',
  },

  /**
   * Resources on /resources. To publish a PDF:
   * 1. Put the file in public/resources/ (e.g. public/resources/day-1.pdf)
   * 2. Set `file` below to '/resources/day-1.pdf'
   * 3. Commit and push on the morning of that day.
   */
  resources: [
    {
      id: 'day-1-notes',
      title: 'Day 1 notes: markets and basics',
      description: 'Markets, exchanges, brokers, order types and your first candlestick.',
      tab: 'day-1',
      day: 1,
      availableOn: '2026-10-27T08:00:00+05:30',
      file: null,
    },
    {
      id: 'day-2-notes',
      title: 'Day 2 notes: analysis and market movers',
      description: 'Trends, support and resistance, moving averages, RSI and what moves prices.',
      tab: 'day-2',
      day: 2,
      availableOn: '2026-10-28T08:00:00+05:30',
      file: null,
    },
    {
      id: 'day-3-notes',
      title: 'Day 3 notes: risk, strategy and practice',
      description: 'Stop-loss, targets, position sizing, psychology, costs and scams.',
      tab: 'day-3',
      day: 3,
      availableOn: '2026-10-29T08:00:00+05:30',
      file: null,
    },
    {
      id: 'assignment-brief',
      title: 'Paper-trade assignment brief',
      description: 'What to submit, the format, and how submissions are assessed.',
      tab: 'assignment',
      day: 4,
      availableOn: '2026-10-29T08:00:00+05:30',
      file: null,
    },
    {
      id: 'python-notebook',
      title: 'Python track notebook',
      description: 'Plot a price chart and backtest a simple moving-average crossover.',
      tab: 'python',
      day: null,
      availableOn: '2026-10-28T08:00:00+05:30',
      file: null,
    },
  ],

  /** Recorded session link. null = the "Recorded session" card is hidden. */
  recordingUrl: null,


  faq: [
    {
      question: 'Do I need any prior knowledge?',
      answer: 'No. First Tick starts from zero, and Days 2 and 3 still go deeper if you have traded before.',
    },
    {
      question: 'Does it cost anything?',
      answer: 'No. It is free for all CR Rao AIMSCS students, and you never need real money or a broker account.',
    },
    {
      // TBD: replace once decided, e.g. 'Yes, a 60-minute live session each evening at 7:00 pm IST.'
      question: 'Are there live sessions?',
      answer: 'To be announced in the WhatsApp community before Day 1. Daily notes are always on the Resources page.',
    },
    {
      question: 'What is the final assignment?',
      answer:
        'One paper trade, submitted as a PDF on Day 4: an annotated chart, entry, stop-loss, target, risk-reward, position size and a short justification.',
    },
    {
      question: 'How do certificates work?',
      answer:
        'Every valid submission gets a Certificate of Completion. Top submissions, judged on process and risk rather than profit, also get a Certificate of Merit.',
    },
    {
      question: 'Where are updates shared?',
      answer: 'In the First Tick WhatsApp community. Join right after you register.',
    },
  ],
}
