import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Resource desk',
    headline: 'Stories and guides for sharper creative work.',
    description: 'Browse practical reads, updates, and perspectives that support stronger portfolios and clearer professional profiles.',
    filterLabel: 'Choose topic',
    secondaryNote: 'Designed for fast scanning and focused reading.',
    chips: ['Guides', 'Editorial', 'Updates'],
  },
  classified: {
    eyebrow: 'Opportunity board',
    headline: 'Fast-moving notices and creative opportunities.',
    description: 'Offers, announcements, and short posts presented with a direct, high-contrast browsing rhythm.',
    filterLabel: 'Filter category',
    secondaryNote: 'Prioritize urgency, summary, and action.',
    chips: ['Offers', 'Notices', 'Quick action'],
  },
  sbm: {
    eyebrow: 'Saved resources',
    headline: 'Curated links and references worth keeping close.',
    description: 'Useful bookmarks arranged for quick discovery across tools, references, and supporting resources.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Resource shelves should stay compact and readable.',
    chips: ['Collections', 'References', 'Tools'],
  },
  profile: {
    eyebrow: 'People and profiles',
    headline: 'Creative profiles built for visual discovery.',
    description: 'Explore freelancers, artists, photographers, designers, influencers, studios, and businesses through identity-first cards.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Make identity, style, and credibility visible quickly.',
    chips: ['Portfolio', 'Identity', 'Discovery'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'Downloads and documents with a clear archive feel.',
    description: 'Browse guides, files, references, and downloadable resources without losing the visual system.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Documents need context and clear actions.',
    chips: ['Documents', 'Guides', 'Archive'],
  },
  listing: {
    eyebrow: 'Professional directory',
    headline: 'Listings built for comparison and discovery.',
    description: 'Business, studio, and service listings with useful metadata and direct browsing paths.',
    filterLabel: 'Filter listing category',
    secondaryNote: 'Prioritize comparison, location, and next action.',
    chips: ['Directory', 'Compare', 'Services'],
  },
  image: {
    eyebrow: 'Visual gallery',
    headline: 'Image posts with a gallery-first experience.',
    description: 'Browse image-led posts through a cinematic grid designed for portfolios, projects, and visual storytelling.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let the visuals carry the page first.',
    chips: ['Gallery', 'Portfolio', 'Image-first'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
