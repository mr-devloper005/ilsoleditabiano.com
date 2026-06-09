import Link from 'next/link'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, Sparkles, Star, UserRound, UsersRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singles = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singles].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body) || 'Details will appear here once available.'
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  article: { icon: FileText, archiveClass: 'grid gap-8 lg:grid-cols-3', promise: 'Long-form perspectives, updates, and practical reads for people building a visual presence.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-8 xl:grid-cols-2', promise: 'Structured business and studio listings with quick contact details.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-8 xl:grid-cols-2', promise: 'Offers and opportunities presented in a direct high-contrast board.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-8 space-y-8 md:columns-2 xl:columns-3', promise: 'Image-led discovery for portfolios, visuals, and creative stories.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Saved resources and bookmarks with fast scanning.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3', promise: 'Downloadable resources and documents kept easy to browse.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-8 md:grid-cols-2 xl:grid-cols-4', promise: 'Creative profiles, freelancers, artists, studios, and public portfolio pages.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const heroImage = posts[0] ? getImage(posts[0]) : placeholder

  if (task === 'profile') {
    return <ProfileArchiveView posts={posts} pagination={pagination} category={category} categoryLabel={categoryLabel} basePath={basePath} />
  }

  return (
    <EditableSiteShell>
      <main className="bg-black text-white">
        <section className="relative min-h-[520px] overflow-hidden">
          <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-44 blur-[1px]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.42),rgba(0,0,0,0.9))]" />
          <div className="relative mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:px-24 lg:py-28">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]"><Icon className="h-4 w-4" /> {label}</p>
              <h1 className="mt-6 max-w-5xl text-5xl font-black uppercase leading-[0.86] tracking-[-0.03em] sm:text-7xl">{voice?.headline || `Browse ${label}`}</h1>
              <p className="mt-7 max-w-3xl text-lg font-semibold leading-8 text-white/72">{voice?.description || deck.promise || SITE_CONFIG.description}</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href={basePath} className="bg-[var(--slot4-accent)] px-8 py-4 text-sm font-black uppercase tracking-[0.05em] text-white">Browse All</Link>
                <Link href="/search" className="border border-white px-8 py-4 text-sm font-black uppercase tracking-[0.05em] text-white">Search Posts</Link>
              </div>
            </div>
            <form action={basePath} className="self-end bg-white p-6 text-black">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em]"><Filter className="h-4 w-4" /> Filter</div>
              <select name="category" defaultValue={category} className="mt-5 h-14 w-full border border-black bg-white px-4 text-sm font-black uppercase outline-none">
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="mt-4 h-14 w-full bg-black text-sm font-black uppercase text-white">Apply</button>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[#697282]">Showing: {categoryLabel}</p>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-20 sm:px-8 lg:px-24">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="border border-dashed border-white/24 bg-[#101010] p-14 text-center">
              <Search className="mx-auto h-10 w-10 text-white/45" />
              <h2 className="mt-6 text-4xl font-black uppercase leading-none">No posts found</h2>
              <p className="mt-3 text-sm text-white/62">Try another category or refresh after new content is published.</p>
            </div>
          )}

          <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="border border-white px-6 py-4 text-sm font-black uppercase">Previous</Link> : null}
            <span className="bg-white px-6 py-4 text-sm font-black uppercase text-black">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="border border-white px-6 py-4 text-sm font-black uppercase">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} index={index} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ProfileArchiveView({ posts, pagination, category, categoryLabel, basePath }: { posts: SitePost[]; pagination: SiteFeedPagination; category: string; categoryLabel: string; basePath: string }) {
  const page = pagination.page || 1
  const featured = posts[0]
  const heroImage = featured ? getImage(featured) : placeholder
  const gridPosts = featured ? posts.slice(1) : posts

  return (
    <EditableSiteShell>
      <main className="bg-black text-white">
        <section className="relative overflow-hidden border-b border-white/12">
          <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-38 blur-[1px]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.74)_52%,rgba(201,15,47,0.82)_100%)]" />
          <div className="relative mx-auto grid max-w-[var(--editable-container)] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_480px] lg:px-24 lg:py-28">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]"><UsersRound className="h-4 w-4" /> Profile gallery</p>
              <h1 className="mt-6 max-w-5xl text-5xl font-black uppercase leading-[0.86] tracking-[-0.03em] sm:text-7xl">Find the faces behind the work.</h1>
              <p className="mt-7 max-w-3xl text-lg font-semibold leading-8 text-white/72">Browse creators, businesses, studios, and professionals through a visual profile directory built to feel as bold as the homepage.</p>
              <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
                {[
                  ['Profiles', String(pagination.total || posts.length || 0)],
                  ['Current view', categoryLabel],
                  ['Layout', 'Visual first'],
                ].map(([label, value]) => (
                  <div key={label} className="border border-white/16 bg-white/8 p-5 backdrop-blur">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/48">{label}</p>
                    <p className="mt-3 truncate text-2xl font-black uppercase leading-none">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="self-end bg-white p-6 text-black shadow-[0_34px_110px_rgba(0,0,0,0.42)]">
              <div className="flex items-center justify-between gap-4 border-b border-black/12 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">Refine profiles</p>
                  <h2 className="mt-2 text-4xl font-black uppercase leading-none">Search by lane.</h2>
                </div>
                <Sparkles className="h-9 w-9 text-[var(--slot4-accent)]" />
              </div>
              <form action={basePath} className="mt-6">
                <select name="category" defaultValue={category} className="h-14 w-full border border-black bg-white px-4 text-sm font-black uppercase outline-none">
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <button className="mt-4 h-14 w-full bg-black text-sm font-black uppercase text-white transition hover:bg-[var(--slot4-accent)]">Apply filter</button>
              </form>
            </aside>
          </div>
        </section>

        {featured ? (
          <section className="mx-auto grid max-w-[var(--editable-container)] gap-0 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:px-24">
            <Link href={`${basePath}/${featured.slug}`} className="group relative min-h-[520px] overflow-hidden bg-[#101010]">
              <img src={getImage(featured)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-72 transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(0,0,0,0.88))]" />
              <div className="absolute bottom-0 left-0 max-w-3xl p-8 sm:p-12">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">Featured profile</p>
                <h2 className="mt-5 text-5xl font-black uppercase leading-[0.86] sm:text-7xl">{featured.title}</h2>
              </div>
            </Link>
            <div className="bg-white p-8 text-black sm:p-12">
              <Star className="h-12 w-12 fill-[var(--slot4-accent)] text-[var(--slot4-accent)]" />
              <h3 className="mt-8 text-5xl font-black uppercase leading-[0.88]">Profile spotlight</h3>
              <p className="mt-6 text-base font-semibold leading-8 text-[#556070]">{getSummary(featured)}</p>
              <Link href={`${basePath}/${featured.slug}`} className="mt-8 inline-flex items-center gap-3 bg-[var(--slot4-accent)] px-7 py-4 text-sm font-black uppercase tracking-[0.05em] text-white">
                Open profile <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-[var(--editable-container)] px-5 pb-20 sm:px-8 lg:px-24">
          {posts.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {gridPosts.map((post, index) => <ProfileArchiveCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} index={index} />)}
            </div>
          ) : (
            <div className="border border-dashed border-white/24 bg-[#101010] p-14 text-center">
              <Search className="mx-auto h-10 w-10 text-white/45" />
              <h2 className="mt-6 text-4xl font-black uppercase leading-none">No profiles found</h2>
              <p className="mt-3 text-sm text-white/62">Try another category or refresh after new profiles are published.</p>
            </div>
          )}

          <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="border border-white px-6 py-4 text-sm font-black uppercase">Previous</Link> : null}
            <span className="bg-white px-6 py-4 text-sm font-black uppercase text-black">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="border border-white px-6 py-4 text-sm font-black uppercase">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block bg-[#101010] text-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={getImage(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-5 top-5 bg-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em]">{getCategory(post, 'Article')}</span>
      </div>
      <div className="border border-white/12 border-t-0 p-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-4 line-clamp-3 text-2xl font-black uppercase leading-[1.02]">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/64">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  return (
    <Link href={href} className="group grid gap-0 border border-white/12 bg-[#101010] text-white sm:grid-cols-[210px_1fr]">
      <div className="flex min-h-52 items-center justify-center bg-white text-black">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-12 w-12" />}
      </div>
      <div className="p-7">
        <span className="bg-[var(--slot4-accent)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em]">Directory</span>
        <h2 className="mt-7 text-4xl font-black uppercase leading-[0.95]">{post.title}</h2>
        {location ? <p className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase text-white/70"><MapPin className="h-4 w-4" /> {location}</p> : null}
        <p className="mt-4 line-clamp-2 text-sm leading-7 text-white/64">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  return (
    <Link href={href} className="group grid overflow-hidden bg-[#101010] text-white sm:grid-cols-[0.74fr_1fr]">
      <div className="relative min-h-72 bg-[var(--slot4-accent)] p-7">
        <span className="bg-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em]">Classified</span>
        <h2 className="mt-12 text-5xl font-black uppercase leading-[0.86]">{price || 'Open offer'}</h2>
        {image ? <img src={image} alt="" className="absolute bottom-6 right-6 h-28 w-28 object-cover" /> : null}
      </div>
      <div className="border border-white/12 p-7">
        <h2 className="text-3xl font-black uppercase leading-[0.96]">{post.title}</h2>
        <p className="mt-5 line-clamp-4 text-sm leading-7 text-white/64">{getSummary(post)}</p>
        <p className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">View listing <ArrowRight className="h-4 w-4" /></p>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group mb-8 block break-inside-avoid bg-[#101010] text-white">
      <div className={index % 3 === 0 ? 'aspect-[3/4] overflow-hidden' : 'aspect-[4/3] overflow-hidden'}>
        <img src={getImage(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="border border-white/12 border-t-0 p-5">
        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-2xl font-black uppercase leading-[1.02]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block border border-white/12 bg-[#101010] p-7 text-white transition hover:bg-white hover:text-black">
      <div className="flex items-center justify-between gap-3">
        <span className="border border-current px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-10 text-3xl font-black uppercase leading-[0.98]">{post.title}</h2>
      <p className="mt-5 line-clamp-4 text-sm leading-7 opacity-70">{getSummary(post)}</p>
      {website ? <p className="mt-6 truncate text-xs font-black uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block border border-white/12 bg-[#101010] p-7 text-white">
      <div className="flex items-start justify-between gap-4">
        <div className="bg-white p-5 text-black"><FileText className="h-8 w-8" /></div>
        <span className="bg-[var(--slot4-accent)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em]">{getCategory(post, 'PDF')}</span>
      </div>
      <h2 className="mt-10 text-3xl font-black uppercase leading-[0.98]">{post.title}</h2>
      <p className="mt-5 line-clamp-4 text-sm leading-7 text-white/64">{getSummary(post)}</p>
      <p className="mt-7 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href, index = 0 }: { post: SitePost; href: string; index?: number }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const variant = index % 4
  return (
    <Link href={href} className={`group block overflow-hidden border border-white/12 text-white transition hover:-translate-y-1 hover:border-[var(--slot4-accent)] ${variant === 1 ? 'bg-white text-black' : variant === 2 ? 'bg-[var(--slot4-accent)]' : 'bg-[#101010]'}`}>
      <div className={`${variant === 3 ? 'aspect-[4/5]' : 'aspect-square'} relative flex w-full items-center justify-center overflow-hidden ${variant === 1 ? 'bg-black' : 'bg-white'} text-black`}>
        {avatar ? <img src={avatar} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <UserRound className="h-16 w-16" />}
        <span className="absolute left-4 top-4 bg-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white">No. {String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="p-6 text-center">
        <h2 className="text-2xl font-black uppercase leading-[1]">{post.title}</h2>
        {role ? <p className={`mt-3 text-xs font-black uppercase tracking-[0.16em] ${variant === 1 ? 'text-[var(--slot4-accent)]' : 'text-white/72'}`}>{role}</p> : null}
        <p className={`mt-4 line-clamp-3 text-sm leading-6 ${variant === 1 ? 'text-black/62' : 'text-white/68'}`}>{getSummary(post)}</p>
      </div>
    </Link>
  )
}
