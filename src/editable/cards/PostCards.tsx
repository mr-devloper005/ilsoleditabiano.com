import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { stripHtmlToText } from '@/editable/shell/html-utils'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const singleImage = ['image', 'featuredImage', 'thumbnail', 'avatar', 'logo'].map((key) => content[key]).find((value): value is string => typeof value === 'string' && Boolean(value))
  return mediaUrl || contentImage || singleImage || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    post?.summary ||
    ''
  const clean = stripHtmlToText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group relative block min-h-[620px] overflow-hidden bg-black text-white">
      <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-64 transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.84))]" />
      <div className="relative z-10 flex min-h-[620px] flex-col justify-end p-8 sm:p-12">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{label}</p>
        <h3 className="mt-5 max-w-4xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.03em] sm:text-7xl">{post.title}</h3>
        <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/72">{getEditableExcerpt(post, 190)}</p>
        <span className="mt-8 inline-flex w-fit items-center gap-3 bg-[var(--slot4-accent)] px-8 py-4 text-sm font-black uppercase text-white">
          Read story <ArrowRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block min-w-0 bg-[#111] text-white">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-5 top-5 bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="border border-white/12 border-t-0 p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
        <h3 className="mt-4 line-clamp-3 text-3xl font-black uppercase leading-[0.98]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid grid-cols-[64px_minmax(0,1fr)] gap-5 border border-white/14 bg-[#0e0e0e] p-5 text-white transition hover:border-[var(--slot4-accent)]">
      <span className="flex h-16 w-16 items-center justify-center bg-white text-lg font-black text-black">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]"><Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-black uppercase leading-tight">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/62">{getEditableExcerpt(post, 105)}</p>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 gap-0 overflow-hidden border border-white/14 bg-[#0f0f0f] text-white transition hover:border-[var(--slot4-accent)] sm:grid-cols-[260px_minmax(0,1fr)]">
      <div className="relative aspect-[16/12] overflow-hidden sm:aspect-auto sm:min-h-[220px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0 p-7">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">Read {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-4 line-clamp-3 text-3xl font-black uppercase leading-[0.98] sm:text-4xl">{post.title}</h2>
        <p className="mt-5 line-clamp-3 text-sm leading-7 text-white/62">{getEditableExcerpt(post, 180)}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.06em] text-white">Open article <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}
