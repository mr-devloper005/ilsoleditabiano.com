import { slot4BrandConfig } from './brand.config'

export type Slot4VisualPreset =
  | 'performance-black'
  | 'gallery-white'
  | 'redline-editorial'
  | 'profile-grid'
  | 'resource-index'
  | 'visual-rail'
  | 'clean-contrast'

export const visualPresets = {
  'performance-black': {
    label: 'Performance Black',
    mood: 'cinematic, sharp, image-led',
    fontDirection: 'condensed uppercase display with clean sans body',
    colors: {
      background: '#050505',
      foreground: '#ffffff',
      muted: '#8d96a2',
      primary: '#ffffff',
      accent: '#c90f2f',
      surface: '#101010',
    },
    shape: 'hard-edged bands, full-bleed imagery, red action blocks',
  },
  'gallery-white': {
    label: 'Gallery White',
    mood: 'bright product feature band',
    fontDirection: 'bold display headings with precise captions',
    colors: {
      background: '#f7f7f7',
      foreground: '#050505',
      muted: '#6d737b',
      primary: '#050505',
      accent: '#c90f2f',
      surface: '#ffffff',
    },
    shape: 'open white space with thin dividers and image callouts',
  },
  'redline-editorial': {
    label: 'Redline Editorial',
    mood: 'urgent magazine energy',
    fontDirection: 'black uppercase headlines with compact body copy',
    colors: {
      background: '#c90f2f',
      foreground: '#ffffff',
      muted: '#f4c9d1',
      primary: '#ffffff',
      accent: '#050505',
      surface: '#b80d2a',
    },
    shape: 'solid red panels and direct calls to action',
  },
  'profile-grid': {
    label: 'Profile Grid',
    mood: 'premium portfolio directory',
    fontDirection: 'condensed headings and quiet metadata',
    colors: {
      background: '#050505',
      foreground: '#ffffff',
      muted: '#a7b2bd',
      primary: '#ffffff',
      accent: '#c90f2f',
      surface: '#111111',
    },
    shape: 'image cards with strict gutters and no rounded corners',
  },
  'resource-index': {
    label: 'Resource Index',
    mood: 'structured archive',
    fontDirection: 'dense uppercase labels with readable summaries',
    colors: {
      background: '#f7f7f7',
      foreground: '#050505',
      muted: '#6d737b',
      primary: '#050505',
      accent: '#c90f2f',
      surface: '#ffffff',
    },
    shape: 'split panes, filter bars, and bordered cards',
  },
  'visual-rail': {
    label: 'Visual Rail',
    mood: 'wide discovery carousel',
    fontDirection: 'oversized labels over photography',
    colors: {
      background: '#090909',
      foreground: '#ffffff',
      muted: '#a7a7a7',
      primary: '#ffffff',
      accent: '#c90f2f',
      surface: '#111111',
    },
    shape: 'large horizontal media rails',
  },
  'clean-contrast': {
    label: 'Clean Contrast',
    mood: 'simple, legible, polished',
    fontDirection: 'bold headings and restrained text',
    colors: {
      background: '#ffffff',
      foreground: '#050505',
      muted: '#707782',
      primary: '#050505',
      accent: '#c90f2f',
      surface: '#f3f3f3',
    },
    shape: 'white editorial surfaces with crisp black rules',
  },
} as const

export const visualSystem = {
  productKind: slot4BrandConfig.productKind,
  recommendedPreset: 'performance-black',
  radius: {
    sm: '0px',
    md: '0px',
    lg: '0px',
    xl: '0px',
  },
  motion: {
    pageLoad: 'animate-in fade-in duration-500',
    cardHover: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_90px_rgba(0,0,0,0.42)]',
    softHover: 'transition duration-300 hover:opacity-80',
    reduceMotionSafe: 'motion-reduce:transform-none motion-reduce:transition-none',
  },
  typography: {
    eyebrow: 'text-xs font-black uppercase tracking-[0.16em]',
    heroTitle: 'text-5xl font-black uppercase leading-[0.86] sm:text-7xl lg:text-[5.6rem]',
    sectionTitle: 'text-4xl font-black uppercase leading-[0.9] sm:text-5xl lg:text-6xl',
    body: 'text-base leading-8',
    caption: 'text-xs font-black uppercase tracking-[0.16em]',
  },
  surfaces: {
    glass: 'border border-white/15 bg-black/45 backdrop-blur-xl',
    paper: 'border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.12)]',
    quiet: 'border border-white/10 bg-white/5',
    dark: 'border border-white/10 bg-[#101010] shadow-[0_24px_70px_rgba(0,0,0,0.25)]',
  },
  layout: {
    page: 'mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-24',
    sectionY: 'py-16 sm:py-20 lg:py-28',
    cardGrid: 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3',
  },
} as const

export function getVisualPreset(name: Slot4VisualPreset = visualSystem.recommendedPreset as Slot4VisualPreset) {
  return visualPresets[name]
}
