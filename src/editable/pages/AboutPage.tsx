import Link from 'next/link'
import { ArrowRight, Camera, Grid3X3, ShieldCheck } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  const values = [
    { icon: Camera, title: pagesContent.about.values[0]?.title || 'Visual-first discovery', body: pagesContent.about.values[0]?.description || 'Large imagery and sharp hierarchy help creative work stand out.' },
    { icon: Grid3X3, title: pagesContent.about.values[1]?.title || 'Connected profiles', body: pagesContent.about.values[1]?.description || 'Profiles, images, and resources stay connected across the site.' },
    { icon: ShieldCheck, title: pagesContent.about.values[2]?.title || 'Clear browsing', body: pagesContent.about.values[2]?.description || 'Routes, filters, and content blocks stay direct and readable.' },
  ]

  return (
    <EditableSiteShell>
      <main className="bg-black text-white">
        <section className="relative overflow-hidden border-b border-white/12">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[var(--slot4-accent)] lg:block" />
          <div className="relative mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-24 lg:py-28">
            <article>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{pagesContent.about.badge}</p>
              <h1 className="mt-6 max-w-5xl text-5xl font-black uppercase leading-[0.86] tracking-[-0.03em] sm:text-7xl">
                About {SITE_CONFIG.name}
              </h1>
              <p className="mt-7 max-w-3xl text-lg font-semibold leading-8 text-white/72">{pagesContent.about.description}</p>
              <div className="mt-8 max-w-3xl space-y-4 text-base leading-8 text-white/66">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/profile" className="inline-flex items-center gap-3 bg-[var(--slot4-accent)] px-8 py-4 text-sm font-black uppercase tracking-[0.05em] text-white">Explore Profiles <ArrowRight className="h-5 w-5" /></Link>
                <Link href="/contact" className="inline-flex items-center gap-3 border border-white px-8 py-4 text-sm font-black uppercase tracking-[0.05em] text-white hover:bg-white hover:text-black">Contact</Link>
              </div>
            </article>
            <aside className="relative grid gap-5 self-end lg:pl-10">
              <div className="bg-white p-8 text-black">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">At a glance</p>
                <h2 className="mt-4 text-5xl font-black uppercase leading-[0.88]">Built for visual discovery.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {values.map((value) => (
                  <div key={value.title} className="border border-white/14 bg-[#101010] p-6">
                    <value.icon className="h-7 w-7 text-[var(--slot4-accent)]" />
                    <h3 className="mt-5 text-2xl font-black uppercase leading-none">{value.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/64">{value.body}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
