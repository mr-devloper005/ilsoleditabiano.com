import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#050505',
  '--slot4-page-text': '#f8f8f3',
  '--slot4-panel-bg': '#0b0b0b',
  '--slot4-surface-bg': '#111111',
  '--slot4-muted-text': '#b6bfca',
  '--slot4-soft-muted-text': '#87909a',
  '--slot4-accent': '#c90f2f',
  '--slot4-accent-fill': '#c90f2f',
  '--slot4-accent-soft': '#f3f3f3',
  '--slot4-dark-bg': '#030303',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#1b1b1b',
  '--slot4-cream': '#f4f4f4',
  '--slot4-warm': '#ffffff',
  '--slot4-lavender': '#111111',
  '--slot4-gray': '#f7f7f7',
  '--slot4-body-gradient': 'linear-gradient(180deg, #050505 0%, #050505 42%, #0b0b0b 100%)',
  '--editable-container': '1714px',
  '--editable-border': 'rgba(255,255,255,0.14)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-white/15',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_28px_80px_rgba(0,0,0,0.32)]',
  shadowStrong: 'shadow-[0_34px_110px_rgba(0,0,0,0.48)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.78))]',
} as const

const condensed = 'font-black uppercase tracking-[0.01em]'

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-24',
    sectionY: 'py-16 sm:py-20 lg:py-28',
  },
  layout: {
    safeGrid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center',
    rail: 'flex snap-x gap-8 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[78vw] shrink-0 snap-center sm:w-[520px] lg:w-[760px]',
  },
  type: {
    eyebrow: `text-xs ${condensed} text-[var(--slot4-accent)]`,
    heroTitle: `${condensed} text-5xl leading-[0.86] sm:text-7xl lg:text-[5.6rem]`,
    sectionTitle: `${condensed} text-4xl leading-[0.9] sm:text-5xl lg:text-6xl`,
    body: 'text-base leading-8 text-[var(--slot4-muted-text)]',
  },
  surface: {
    card: `border ${editablePalette.darkBorder} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: 'border border-black/10 bg-white text-black',
    dark: `${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: 'inline-flex items-center justify-center gap-3 bg-[var(--slot4-accent-fill)] px-8 py-4 text-sm font-black uppercase tracking-[0.06em] text-white transition hover:bg-white hover:text-black',
    secondary: 'inline-flex items-center justify-center gap-3 border border-white px-8 py-4 text-sm font-black uppercase tracking-[0.06em] text-white transition hover:bg-white hover:text-black',
    accent: 'inline-flex items-center justify-center gap-3 bg-white px-8 py-4 text-sm font-black uppercase tracking-[0.06em] text-black transition hover:bg-[var(--slot4-accent-fill)] hover:text-white',
  },
  media: {
    frame: `relative overflow-hidden ${editablePalette.mediaBg}`,
    ratio: 'aspect-[16/10]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_90px_rgba(0,0,0,0.42)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Supra-inspired structure: black navigation, red CTAs, large image-led hero, white feature band, black news band, red call-to-action, and black footer.',
  'Only use existing post data and safe fallbacks; never replace routed posts with hard-coded content.',
  'Keep card variety across featured, compact, horizontal, editorial, and image-first formats.',
  'Use strong condensed uppercase type, square edges, red accents, and generous full-width bands.',
  'Keep every supported task route and post detail route wired through the original task props.',
] as const
