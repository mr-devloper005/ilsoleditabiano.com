import Link from 'next/link'
import { ArrowLeft, ArrowRight, HelpCircle, Pause, Play, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function pickPosts(posts: SitePost[], count: number) {
  return posts.filter(Boolean).slice(0, count)
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feature = posts[0]
  const image = getEditablePostImage(feature)
  const summary = getEditableExcerpt(feature, 170) || pagesContent.home.hero.description

  return (
    <section className="relative min-h-[calc(100vh-112px)] overflow-hidden bg-black text-white">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-58 blur-[1px] saturate-[0.9]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.46)_0%,rgba(0,0,0,0.34)_46%,rgba(0,0,0,0.84)_100%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-112px)] max-w-[var(--editable-container)] flex-col items-center justify-center px-5 py-20 text-center sm:px-8 lg:px-24">
        <h1 className="max-w-6xl text-5xl font-black uppercase leading-[0.86] tracking-[-0.03em] sm:text-7xl lg:text-[5.8rem]">
          Where Visual Stories <span className="text-[var(--slot4-accent)]">Find</span> Their Next Audience
        </h1>
        <p className="mt-7 max-w-3xl text-lg font-semibold leading-8 text-white/78 sm:text-xl">{summary}</p>
        <div className="mt-9 flex items-center justify-center gap-4 text-white/70">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur"><ArrowLeft className="h-5 w-5" /></span>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/12 backdrop-blur"><Pause className="h-6 w-6 fill-current" /></span>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur"><ArrowRight className="h-5 w-5" /></span>
        </div>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href={feature ? postHref(primaryTask, feature, primaryRoute) : primaryRoute} className={dc.button.primary}>Explore Feature <ArrowRight className="h-5 w-5" /></Link>
          <Link href={primaryRoute} className={dc.button.secondary}>Find A Post</Link>
        </div>
      </div>
      <div className="relative mx-auto -mt-28 hidden max-w-[1208px] grid-cols-3 bg-[#171717] text-white lg:grid">
        {[
          ['Build Your Profile', 'Create a polished home for your strongest visuals.'],
          ['Request A Feature', 'Bring new work into the discovery flow.'],
          ['Find A Collaborator', 'Browse creative profiles and portfolio stories.'],
        ].map(([titleText, body]) => (
          <Link key={titleText} href={primaryRoute} className="border-r border-white/12 p-10 transition hover:bg-[var(--slot4-accent)]">
            <h2 className="text-3xl font-black uppercase leading-none">{titleText}</h2>
            <p className="mt-5 text-base font-semibold leading-7 text-white/72">{body}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = pickPosts(posts, 8)
  if (!railPosts.length) return null
  return (
    <section className="bg-[#101010] px-0 py-24 text-white">
      <div className="mx-auto max-w-[var(--editable-container)] text-center">
        <p className={dc.type.eyebrow}>2026 Lineup</p>
        <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] sm:text-5xl">Choose Your Adventure</h2>
      </div>
      <div className="mt-12 flex snap-x gap-12 overflow-hidden">
        {railPosts.map((post, index) => (
          <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className={`group relative h-[520px] shrink-0 snap-center overflow-hidden bg-black ${index === 0 ? 'ml-[12vw] w-[74vw]' : 'w-[32vw] min-w-[320px] opacity-72'}`}>
            <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(0,0,0,0.78))]" />
            <div className="absolute bottom-0 left-0 p-8 sm:p-12">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
              <h3 className="mt-5 max-w-2xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.03em]">{index === 0 ? taskLabel(primaryTask) : post.title}</h3>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-9 flex items-center justify-center gap-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55"><ArrowLeft className="h-5 w-5" /></span>
        <span className="h-3 w-9 rounded-full bg-[var(--slot4-accent)]" />
        <span className="h-3 w-3 rounded-full bg-white/45" />
        <span className="h-3 w-3 rounded-full bg-white/45" />
        <span className="h-3 w-3 rounded-full bg-white/45" />
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55"><ArrowRight className="h-5 w-5" /></span>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feature = posts[1] || posts[0]
  const details = pickPosts(posts.slice(2), 5)
  if (!feature) return null
  return (
    <section className="bg-[#f7f7f7] py-24 text-black">
      <div className="mx-auto max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-24">
        <div className="text-center">
          <p className={dc.type.eyebrow}>No boxes left unchecked</p>
          <h2 className="mt-4 text-4xl font-black uppercase leading-[0.9] sm:text-5xl">Standard Features</h2>
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="relative flex min-h-[570px] items-center justify-center">
            <img src={getEditablePostImage(feature)} alt="" className="max-h-[520px] w-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)]" />
            {[['25%', '45%'], ['48%', '35%'], ['72%', '50%'], ['82%', '62%']].map(([left, top]) => (
              <span key={`${left}-${top}`} className="absolute flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--slot4-accent)] bg-white/75 text-2xl font-light text-[var(--slot4-accent)]" style={{ left, top }}>+</span>
            ))}
          </div>
          <aside className="border-l border-black/12 pl-8">
            <div className="grid">
              {details.map((post, index) => (
                <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className={`px-5 py-4 text-sm font-black uppercase tracking-[0.04em] ${index === 0 ? 'border-l-4 border-[var(--slot4-accent)] bg-[#e9e9e9] text-black' : 'text-[#8a929c] hover:text-black'}`}>
                  {post.title}
                </Link>
              ))}
            </div>
            <img src={getEditablePostImage(details[0] || feature)} alt="" className="mt-8 aspect-[4/3] w-full object-cover" />
            <h3 className="mt-5 text-2xl font-black uppercase leading-none">{details[0]?.title || feature.title}</h3>
            <p className="mt-3 text-base leading-7 text-[#676767]">{getEditableExcerpt(details[0] || feature, 180)}</p>
          </aside>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sectionPosts = timeSections.flatMap((section) => section.posts).length ? timeSections.flatMap((section) => section.posts) : posts
  const newPosts = pickPosts(sectionPosts, 4)
  const newsPosts = pickPosts(posts.slice(4), 3)
  return (
    <>
      <section className="bg-[#101010] text-white">
       
        <div className="grid md:grid-cols-4">
          {newPosts.map((post) => (
            <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group relative h-[340px] overflow-hidden">
              <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/40" />
              <Play className="absolute bottom-6 left-6 h-8 w-8 text-white opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f7f7] px-5 py-24 text-center text-black sm:px-8">
        <HelpCircle className="mx-auto h-16 w-16 rounded-full bg-[#f0c8d1] p-4 text-[var(--slot4-accent)]" />
        <h2 className="mx-auto mt-8 max-w-3xl text-5xl font-black uppercase leading-[0.9]">Need help finding <span className="text-[var(--slot4-accent)]">the right post?</span></h2>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#344154]">Search by topic, role, image style, or category to compare creative work side by side.</p>
        <form action="/search" className="mx-auto mt-10 flex max-w-2xl border border-black">
          <input name="q" placeholder="Search profiles and visuals" className="min-w-0 flex-1 px-5 py-4 outline-none" />
          <button className="bg-[var(--slot4-accent)] px-7 text-sm font-black uppercase text-white"><Search className="h-5 w-5" /></button>
        </form>
      </section>

      {newsPosts.length ? (
        <section className="bg-black py-24 text-white">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-24">
            <div className="text-center">
              <h2 className="text-5xl font-black uppercase leading-[0.9]">Latest Updates</h2>
              <p className="mt-5 text-lg text-white/68">Stay up to date with the latest from {SITE_CONFIG.name}.</p>
            </div>
            <div className="mt-14 grid gap-8 lg:grid-cols-3">
              {newsPosts.map((post) => (
                <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group block">
                  <div className="aspect-[16/10] overflow-hidden bg-[#151515]">
                    <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <p className="mt-6 text-xs font-black uppercase tracking-[0.14em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
                  <h3 className="mt-4 line-clamp-2 text-2xl font-black uppercase leading-[1.05]">{post.title}</h3>
                  <p className="mt-4 line-clamp-2 text-base leading-7 text-white/70">{getEditableExcerpt(post, 145)}</p>
                </Link>
              ))}
            </div>
            <div className="mt-14 text-center">
              <Link href={primaryRoute} className="text-sm font-black uppercase tracking-[0.08em] text-[var(--slot4-accent)]">View All Posts {'->'}</Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

export function EditableHomeCta() {
  return null
}
