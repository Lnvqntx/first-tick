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
  title: string
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
  clubName: string
  collegeName: string
  collegeFullName: string
  campus: string
  datesConfirmed: boolean
  timezoneLabel: string
  submissionDeadline: string
  submissionDeadlineConfirmed: boolean
  days: EventDay[]
  links: {
    whatsappAnnouncements: string
    whatsappDoubts: string
    submissionForm: string
    registrationEndpoint: string
  }
  resources: ResourceItem[]
  recordingUrl: string | null
  clubPhoto: { src: string; alt: string } | null
  faq: FaqItem[]
}

/* ------------------------------------------------------------------ */
/* Event                                                               */
/* ------------------------------------------------------------------ */

export const event: EventConfig = {
  name: 'First Tick',
  tagline: 'Your first step into financial markets.',
  clubName: 'Programming Club',
  collegeName: 'CR Rao AIMSCS',
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
        'What financial markets are and why they exist',
        'Stocks, exchanges, brokers and demat accounts',
        'Order types: market, limit, stop',
        'Trading vs investing',
        'Personal finance basics',
        'An intro to charts and candlesticks',
      ],
    },
    {
      day: 2,
      date: '2026-10-28T00:00:00+05:30',
      title: 'Analysis and market movers',
      kind: 'learning',
      topics: [
        'Reading price charts',
        'Trends, support and resistance',
        'Basic technical analysis: moving averages and RSI',
        'What moves markets: fundamentals, news and macro',
      ],
    },
    {
      day: 3,
      date: '2026-10-29T00:00:00+05:30',
      title: 'Risk, strategy and practice',
      kind: 'learning',
      topics: [
        'Entry, stop-loss and target',
        'Risk-reward and position sizing',
        'Trading psychology and common mistakes',
        'Real-world costs and how to spot scams',
        'Paper-trading assignment guidance',
      ],
    },
    {
      day: 4,
      date: '2026-10-30T00:00:00+05:30',
      title: 'Paper-trade assignment submission',
      kind: 'assignment',
      topics: [
        'Submit one paper trade as a PDF through the submission form',
        'Annotated chart, entry, stop-loss, target, risk-reward, position size and a short justification',
      ],
    },
  ],

  /**
   * Links. Leave as '' until ready: any button with an empty link shows
   * as disabled with "Link coming soon" instead of a dead click.
   */
  links: {
    /** WhatsApp community / announcements group invite link. */
    whatsappAnnouncements: '',
    /** WhatsApp doubts group invite link. */
    whatsappDoubts: '',
    /** Google Form (or similar) for the Day 4 PDF submission. */
    submissionForm: '',
    /**
     * Google Apps Script web app URL that stores registrations.
     * Empty = demo mode (nothing is sent). See docs/registration-setup.md.
     */
    registrationEndpoint: '',
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

  /**
   * Optional real photo of the club for the About section, e.g.
   * { src: '/brand/club-photo.jpg', alt: 'Programming Club members at …' }.
   * null = a typographic placeholder is shown instead. Use a real photo only,
   * never stock or AI-generated images.
   */
  clubPhoto: null,

  faq: [
    {
      question: 'Do I need any prior knowledge?',
      answer:
        'No. First Tick starts from zero: what a market is, what a stock is, how an order works. If you have traded before, Day 2 and Day 3 still go deeper into analysis and risk.',
    },
    {
      question: 'Does it cost anything?',
      answer:
        'No. First Tick is free for all CR Rao AIMSCS students. You will never be asked to pay, open a broker account or put in real money.',
    },
    {
      question: 'Are there live sessions?',
      // TBD: replace once decided, e.g. 'Yes, a 60-minute live session each evening at 7:00 pm IST.'
      answer:
        'To be announced. The format of each day (live session, recorded talk or notes only) will be shared in the WhatsApp community before Day 1. The daily notes are always available on the Resources page.',
    },
    {
      question: 'What is the final assignment?',
      answer:
        'On Day 4 you submit one paper trade as a PDF: an annotated chart, your entry, stop-loss and target, the risk-reward, your position size and a short justification. Paper trading means no real money is used.',
    },
    {
      question: 'How do certificates work?',
      answer:
        'Every valid submission that follows the format gets a Certificate of Completion. The top submissions, judged on a published rubric (process, risk management and clarity, not profit), also receive a Certificate of Merit. Each certificate has an ID you can check on the Verify page.',
    },
    {
      question: 'Do I need to know Python?',
      answer:
        'No. The Python track is optional. If you want to try it, the notebook walks you through plotting a chart and backtesting a moving-average crossover.',
    },
    {
      question: 'Where are updates shared?',
      answer:
        'In the First Tick WhatsApp community. Join the announcements group after registering. Doubts go to the separate doubts group so announcements stay easy to read.',
    },
    {
      question: 'Will you give stock tips?',
      answer:
        'No. First Tick teaches process and risk management. Nothing in the programme is investment advice, and nobody can promise profits.',
    },
  ],
}
