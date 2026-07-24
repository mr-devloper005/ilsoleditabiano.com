import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Sparkles, Star, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { decodeHtmlEntities, hasHtmlTags, stripHtmlToText, escapeHtml as escapeHtmlShared } from '@/editable/shell/html-utils'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const dedupeUrls = (urls: Array<string | null | undefined>): string[] =>
  Array.from(new Set(urls.map((url) => (typeof url === 'string' ? url.trim() : '')).filter((url) => url.length > 0)))

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return dedupeUrls([...media, ...images, ...singleImages]).filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = escapeHtmlShared

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'
const linkifyMarkdown = (value: string) => value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)
const linkifyText = (value: string) => linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)
const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})
const unescapeDoubleEncoded = (value: string) => {
  const looksDoubleEncoded = /&lt;\/?[a-z][\w\-]*[^&]*?&gt;/i.test(value) || /&amp;(?:amp|lt|gt|quot|apos|nbsp|#\d+|#x[0-9a-f]+);/i.test(value)
  return looksDoubleEncoded ? decodeHtmlEntities(value) : value
}
const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))
const formatPlainText = (raw: string) => {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  const value = unescapeDoubleEncoded(trimmed)
  if (hasHtmlTags(value)) return sanitizeHtml(linkifyMarkdown(value))
  const decoded = decodeHtmlEntities(value)
  return decoded.split(/\n{2,}/).map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`).join('')
}

const summaryText = (post: SitePost) => {
  const raw = post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
  return stripHtmlToText(raw)
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main className="bg-black text-white">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 border border-white/22 px-5 py-3 text-sm font-black uppercase tracking-[0.05em] text-white transition hover:bg-white hover:text-black">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function DetailHero({ task, post, label, hideSummary = false }: { task: TaskKey; post: SitePost; label: string; hideSummary?: boolean }) {
  const images = getImages(post)
  return (
    <section className="relative overflow-hidden">
      <img src={images[0] || '/placeholder.svg?height=900&width=1400'} alt="" className="absolute inset-0 h-full w-full object-cover opacity-42 blur-[1px]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.92))]" />
      <div className="relative mx-auto max-w-[var(--editable-container)] px-5 py-20 sm:px-8 lg:px-24 lg:py-28">
        <BackLink task={task} />
        <p className="mt-10 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{label}</p>
        <h1 className="mt-5 max-w-6xl text-5xl font-black uppercase leading-[0.86] tracking-[-0.03em] sm:text-7xl">{post.title}</h1>
        {hideSummary ? null : <p className="mt-7 max-w-3xl text-lg font-semibold leading-8 text-white/72">{summaryText(post) || 'Explore the details, visuals, and related resources for this post.'}</p>}
      </div>
    </section>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <>
      <DetailHero task="article" post={post} label={categoryOf(post, 'Article')} />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-24">
        <article className="min-w-0 bg-white p-7 text-black sm:p-10 lg:p-14">
          <BodyContent post={post} />
          <EditableComments slug={post.slug} comments={comments} />
        </article>
        <RelatedPanel task="article" post={post} related={related} />
      </section>
    </>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <>
      <DetailHero task="listing" post={post} label="Business listing" />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-24">
        <article className="bg-white p-7 text-black sm:p-10">
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Showcase" />
        </article>
        <aside className="space-y-6">{mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}<ContactAction website={website} phone={phone} email={email} /><RelatedPanel task="listing" post={post} related={related} compact /></aside>
      </section>
    </>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-24">
      <aside className="bg-[var(--slot4-accent)] p-8 text-white lg:sticky lg:top-32 lg:self-start">
        <BackLink task="classified" />
        <p className="mt-10 text-xs font-black uppercase tracking-[0.18em] text-white/70">Classified notice</p>
        <h1 className="mt-5 text-5xl font-black uppercase leading-[0.86]">{post.title}</h1>
        <div className="mt-8 grid gap-3">{price ? <BadgeLine label="Price" value={price} /> : null}{condition ? <BadgeLine label="Condition" value={condition} /> : null}{location ? <BadgeLine label="Location" value={location} /> : null}</div>
      </aside>
      <article className="bg-white p-7 text-black sm:p-10">
        <ImageStrip images={images} label="Offer images" large />
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const imageContent = getContent(post)
  const hasDistinctBody = Boolean(asText(imageContent.body) || asText(imageContent.description) || asText(imageContent.details))
  return (
    <>
      <DetailHero task="image" post={post} label="Image story" hideSummary />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:px-24">
        <aside className="border border-white/14 bg-[#101010] p-7 lg:sticky lg:top-32 lg:self-start">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-black"><Camera className="h-4 w-4" /> Visual image</div>
          {hasDistinctBody ? <BodyContent post={post} compact /> : null}
          <RelatedPanel task="image" post={post} related={related} compact />
        </aside>
        <div className="columns-1 gap-8 space-y-8 md:columns-2">
          {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid bg-white text-black">
              <img src={image} alt="" className="w-full object-cover" />
              {index === 0 ? <figcaption className="p-5 text-sm font-black uppercase text-[#697282]">Featured visual</figcaption> : null}
            </figure>
          ))}
        </div>
      </section>
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <DetailHero task="sbm" post={post} label="Saved resource" />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-24">
        <article className="bg-white p-8 text-black sm:p-12">
          <Bookmark className="h-14 w-14" />
          {website ? <Link href={safeUrl(website)} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 bg-black px-6 py-4 text-sm font-black uppercase text-white">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
          <BodyContent post={post} />
        </article>
        <RelatedPanel task="sbm" post={post} related={related} />
      </section>
    </>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <>
      <DetailHero task="pdf" post={post} label="PDF resource" />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-24">
        <article className="bg-white p-8 text-black sm:p-12">
          <FileText className="h-16 w-16" />
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-8 overflow-hidden border border-black/12">
              <div className="flex items-center justify-between gap-3 border-b border-black/12 bg-[#f7f7f7] p-4">
                <span className="text-sm font-black uppercase">Document preview</span>
                <Link href={safeUrl(fileUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-black px-4 py-2 text-xs font-black uppercase text-white">Download <Download className="h-4 w-4" /></Link>
              </div>
              <iframe src={`${safeUrl(fileUrl)}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
            </div>
          ) : null}
        </article>
        <RelatedPanel task="pdf" post={post} related={related} />
      </section>
    </>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const location = getField(post, ['location', 'address', 'city'])
  const heroImage = images[0] || '/placeholder.svg?height=900&width=1200'
  const gallery = images.length > 1 ? images.slice(1, 9) : images.slice(0, 1)
  return (
    <>
      <section className="relative min-h-[620px] overflow-hidden border-b border-white/12">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-42 blur-[1px]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.96)_0%,rgba(0,0,0,0.74)_48%,rgba(201,15,47,0.78)_100%)]" />
        <div className="relative mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:px-24 lg:py-24">
          <div className="flex min-h-[480px] flex-col justify-end">
            <BackLink task="profile" />
            <p className="mt-10 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]"><Sparkles className="h-4 w-4" /> Profile showcase</p>
            <h1 className="mt-6 max-w-5xl text-6xl font-black uppercase leading-[0.84] tracking-[-0.04em] sm:text-8xl">{post.title}</h1>
            {role ? <p className="mt-6 max-w-2xl text-xl font-black uppercase tracking-[0.08em] text-white/72">{role}</p> : null}
          </div>

          <aside className="self-end bg-white p-7 text-black shadow-[0_34px_110px_rgba(0,0,0,0.48)]">
            <div className="aspect-square overflow-hidden bg-black text-white">
              {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><UserRound className="h-24 w-24" /></div>}
            </div>
            <div className="mt-7 flex items-center justify-between gap-4 border-b border-black/12 pb-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">Identity card</p>
                <h2 className="mt-2 text-4xl font-black uppercase leading-none">{post.title}</h2>
              </div>
              <Star className="h-9 w-9 fill-[var(--slot4-accent)] text-[var(--slot4-accent)]" />
            </div>
            <div className="mt-5 grid gap-3 text-sm font-black uppercase tracking-[0.08em] text-[#556070]">
              {role ? <p>{role}</p> : null}
              {location ? <p>{location}</p> : null}
            </div>
            <ContactAction website={website} email={email} />
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-8 lg:px-24">
        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr]">
          <aside className="border border-white/14 bg-[#101010] p-7 lg:sticky lg:top-32 lg:self-start">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">Profile signals</p>
            <div className="mt-6 grid gap-4">
              {[
                ['Role', role || 'Creative profile'],
                ['Location', location || 'Available in profile details'],
                ['Gallery', `${gallery.length || 1} visual${(gallery.length || 1) === 1 ? '' : 's'}`],
              ].map(([label, value]) => (
                <div key={label} className="border border-white/12 bg-black p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/42">{label}</p>
                  <p className="mt-2 text-xl font-black uppercase leading-tight text-white">{value}</p>
                </div>
              ))}
            </div>
          </aside>

          <article className="bg-white p-8 text-black sm:p-12">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">Profile story</p>
            <BodyContent post={post} />
          </article>
        </div>

        {gallery.length ? (
          <section className="mt-10 border border-white/14 bg-[#101010] p-6 sm:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">Profile gallery</p>
                <h2 className="mt-3 text-4xl font-black uppercase leading-none">Visual proof</h2>
              </div>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {gallery.map((image, index) => (
                <figure key={`${image}-${index}`} className={`overflow-hidden bg-white text-black ${index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}>
                  <img src={image} alt="" className={`${index === 0 ? 'aspect-[16/11]' : 'aspect-square'} w-full object-cover`} />
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-10">
          <RelatedPanel task="profile" post={post} related={related} />
        </div>
      </section>
    </>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} opacity-85`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="border border-black/12 bg-[#f7f7f7] p-5">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#697282]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-black leading-6">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{label}</p>
      <div className={`mt-4 grid gap-4 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] object-cover" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden border border-white/14 bg-[#101010]">
      <div className="flex items-center gap-2 p-5 text-sm font-black uppercase"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-6 border border-current/18 p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] opacity-60">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={safeUrl(website)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[var(--slot4-accent)] px-4 py-3 text-sm font-black uppercase text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 border border-current px-4 py-3 text-sm font-black uppercase"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 border border-current px-4 py-3 text-sm font-black uppercase"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 border border-white/24 bg-black/18 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.14em] opacity-68">{label}</span><span className="font-black">{value}</span></div>
}

function RelatedPanel({ task, post: _post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-6">
      {!compact ? (
        <div className="border border-white/14 bg-[#101010] p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/48">About this post</p>
          <div className="mt-5 grid gap-3 text-sm font-bold text-white/70">
            <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Type: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}</p>
           
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="border border-white/14 bg-[#101010] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black uppercase leading-none">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.14em] text-[var(--slot4-accent)]">View all</Link>
          </div>
          <div className="mt-6 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group grid grid-cols-[86px_minmax(0,1fr)] gap-4 border border-white/10 bg-black p-3 transition hover:border-[var(--slot4-accent)]">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-24 w-full object-cover" /> : <div className="flex h-24 items-center justify-center bg-white text-black"><FileText className="h-6 w-6" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black uppercase leading-tight">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/58">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-12 border border-black/12 bg-[#f7f7f7] p-6">
      <div className="flex items-center gap-2 text-xl font-black uppercase"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-6 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="border border-black/12 bg-white p-4">
            <p className="text-sm font-black uppercase">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 text-[#555]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[#666]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
