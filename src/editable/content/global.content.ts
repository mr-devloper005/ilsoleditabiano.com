import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Visual portfolios and professional profiles',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Visual portfolios and professional profiles',
    primaryLinks: [
      { label: 'Our Story', href: '/about' },
      { label: 'Profiles', href: '/profile' },
      { label: 'Visuals', href: '/image' },
      { label: 'Resources', href: '/article' },
    ],
    actions: {
      primary: { label: 'Find a profile', href: '/profile' },
      secondary: { label: 'Share work', href: '/create' },
    },
  },
  footer: {
    tagline: 'Visual discovery for creative work',
    description: 'A high-contrast discovery surface for portfolios, image stories, creative profiles, and practical resources.',
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Profiles', href: '/profile' },
          { label: 'Images', href: '/image' },
          { label: 'Articles', href: '/article' },
          { label: 'PDF Library', href: '/pdf' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'Our Story', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Built for clean visual discovery.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
