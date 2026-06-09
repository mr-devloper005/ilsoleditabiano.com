'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

function FooterBrand() {
  const shortName = SITE_CONFIG.name.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0] || SITE_CONFIG.name
  return <span className="block skew-x-[-13deg] text-4xl font-black uppercase leading-[0.82] tracking-[-0.07em] text-white">{shortName}</span>
}

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const accountLinks = session ? [['Profile link', '/profile']] : [['Sign in', '/login'], ['Sign up', '/signup']]

  return (
    <footer className="bg-black text-white">
      <section className="bg-[var(--slot4-accent-fill)] px-5 py-24 text-center sm:px-8">
        <h2 className="mx-auto max-w-5xl text-5xl font-black uppercase leading-[0.88] tracking-[-0.03em] sm:text-6xl lg:text-7xl">Ready to showcase your work?</h2>
        <p className="mt-6 text-lg font-semibold text-white/84">Discover visual, publish stronger posts, and help new audiences find your work.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="bg-white px-9 py-5 text-sm font-black uppercase tracking-[0.04em] text-black transition hover:bg-black hover:text-white">Contact us</Link>
          <Link href="/login" className="bg-black px-9 py-5 text-sm font-black uppercase tracking-[0.04em] text-white transition hover:bg-white hover:text-black">Sign in</Link>
        </div>
      </section>

      <section className="border-y border-[#17202b]">
        <div className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-24">
          <div>
            <Link href="/" aria-label={`${SITE_CONFIG.name} home`}><FooterBrand /></Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-[#9eb0c3]">A visual discovery hub for portfolios, creative profiles, image stories, and practical resources.</p>
          </div>
          
          <FooterColumn title="Account" links={accountLinks} onLogout={session ? logout : undefined} />
          <FooterColumn title="Explore" links={[['Home', '/'], ['About', '/about'], ['Contact', '/contact'], ['Link', '/profile']]} />
        </div>
      </section>

      <div className="mx-auto flex max-w-[var(--editable-container)] flex-wrap items-center justify-center gap-5 px-5 py-7 text-sm uppercase tracking-[0.06em] text-[#9eb0c3] sm:px-8 lg:px-24">
        <span>Copyright (c) {year}</span>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links, onLogout }: { title: string; links: string[][]; onLogout?: () => void }) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-[0.04em] text-white">{title}</h3>
      <div className="mt-5 grid gap-3">
        {links.map(([label, href]) => (
          <Link key={`${label}-${href}`} href={href} className="inline-flex items-center gap-2 text-sm text-[#9eb0c3] transition hover:text-white">
            {label} <ArrowRight className="h-3.5 w-3.5 opacity-40" />
          </Link>
        ))}
        {onLogout ? <button type="button" onClick={onLogout} className="text-left text-sm text-[#9eb0c3] transition hover:text-white">Logout</button> : null}
      </div>
    </div>
  )
}
