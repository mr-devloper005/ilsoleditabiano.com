import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Visual portfolios, image stories, and professional profiles',
      description: 'Discover creative portfolios, image-led posts, profiles, and resources through a bold visual browsing experience.',
      openGraphTitle: 'Visual portfolios, image stories, and professional profiles',
      openGraphDescription: 'Explore profiles, visuals, and useful resources in a high-contrast discovery layout.',
      keywords: ['portfolio discovery', 'creative profiles', 'image gallery', 'professional profiles'],
    },
    hero: {
      badge: 'Profiles, visuals, and resources',
      title: ['Where visual work', 'meets its next audience.'],
      description: 'Explore image-led posts, professional profiles, and practical resources through a bold discovery experience.',
  
      secondaryCta: { label: 'Browse visuals', href: '/image' },
      searchPlaceholder: 'Search profiles, visuals, listings, and resources',
      focusLabel: 'Focus',
      featureCardBadge: 'featured rotation',
      featureCardTitle: 'Recent visuals and profiles shape the front page.',
      featureCardDescription: 'Fresh posts stay at the center of the experience while the original data flow remains intact.',
    },
    intro: {
      badge: 'About the platform',
      title: 'A sharper way to browse creative work and professional profiles.',
      paragraphs: [
        'The site brings together image posts, profile pages, articles, and supporting resources in one connected browsing experience.',
        'Visitors can move from a visual to a profile, from a profile to a resource, and from a resource into related posts without losing context.',
        'The layout is built for fast scanning, strong imagery, and clear next actions on every screen size.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Image-led homepage with strong visual hierarchy.',
        'Profile and gallery routes designed for discovery.',
        'High-contrast navigation, cards, search, and footer.',
        'Safe fallbacks for missing image, category, or summary data.',
      ],
      primaryLink: { label: 'Browse profiles', href: '/profile' },
      secondaryLink: { label: 'See visuals', href: '/image' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Find profiles, visuals, and resources in one connected place.',
      description: 'Move between portfolios, image posts, listings, and resources through one bold visual system.',
      primaryCta: { label: 'Browse Profiles', href: '/profile' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'Our Story',
    title: 'A bold discovery surface for creative work.',
    description: `${slot4BrandConfig.siteName} helps visitors browse visuals, and resources without turning the experience into a generic feed.`,
    paragraphs: [
      'The structure puts imagery, identity, and useful context first so people can understand a post quickly and keep exploring.',
      'Profiles, images, articles, listings, bookmarks, and documents stay connected through shared navigation and related content blocks.',
    ],
    values: [
      {
        title: 'Visual-first discovery',
        description: 'Large imagery, clear labels, and strong contrast help creative work stand out immediately.',
      },
      {
        title: 'Connected profile surfaces',
        description: 'Profiles, galleries, resources, and posts link together so discovery feels natural across the site.',
      },
      {
        title: 'Clear public browsing',
        description: 'Navigation, filters, cards, and detail pages are direct, readable, and designed for repeat use.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Tell us what you want to publish, update, or ask about.',
    description: 'Share the details and the contact workflow will keep the request organized without changing the rest of the site behavior.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search profiles, visuals, articles, listings, and resources across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find profiles, visuals, and resources faster.',
      description: 'Use keywords, categories, and content types to discover posts from every active section of the site.',
      placeholder: 'Search by keyword, role, style, category, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to create new content.',
      description: 'Use your account to open the publishing workspace and create posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your publishing space.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
