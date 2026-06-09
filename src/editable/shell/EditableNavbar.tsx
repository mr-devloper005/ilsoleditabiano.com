'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

function BrandMark() {
  const parts = SITE_CONFIG.name.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')
  const main = parts[0] || SITE_CONFIG.name
  const suffix = parts.slice(1).join('.')
  return (
    <span className="flex items-center gap-4 leading-none text-white">
      
      <span className="block max-w-[48vw] skew-x-[-13deg] truncate text-[2.15rem] font-black uppercase tracking-[-0.07em] sm:text-[3rem] lg:max-w-[520px] lg:text-[3.6rem]">
        {main}
      </span>
      {suffix ? <span className="sr-only">.{suffix}</span> : null}
    </span>
  )
}

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const primaryItems = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    []
  )

  return (
    <header className="sticky top-0 z-50 bg-[#050505] text-white shadow-[0_12px_28px_rgba(0,0,0,0.34)]">
      <nav className="mx-auto flex min-h-[96px] w-full max-w-[var(--editable-container)] items-center gap-5 px-5 sm:px-8 lg:min-h-[112px] lg:px-24">
        <Link href="/" className="mr-auto shrink-0" aria-label={`${SITE_CONFIG.name} home`}>
          <BrandMark />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {primaryItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href} className={`inline-flex items-center gap-1 text-base font-black uppercase tracking-[0.02em] transition ${active ? 'text-[var(--slot4-accent)]' : 'text-white hover:text-[var(--slot4-accent)]'}`}>
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          
          {session ? (
            <>
              <button type="button" onClick={logout} className="px-4 py-3 text-sm font-black uppercase tracking-[0.04em] text-white/70 hover:text-white">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="inline-flex items-center gap-2 px-3 py-3 text-sm font-black uppercase tracking-[0.04em] text-white/72 hover:text-white"><LogIn className="h-4 w-4" /> Sign in</Link>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-[var(--slot4-accent-fill)] px-8 py-4 text-sm font-black uppercase tracking-[0.04em] text-white transition hover:bg-white hover:text-black"><UserPlus className="h-4 w-4" /> Sign up</Link>
            </>
          )}
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-12 w-12 items-center justify-center border border-white/20 lg:hidden" aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/12 bg-[#050505] px-5 pb-6 lg:hidden">
          <div className="grid gap-2">
            {[...primaryItems, { label: 'Link', href: '/profile' }, ...(session ? [] : [{ label: 'Sign in', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="border border-white/14 px-4 py-4 text-sm font-black uppercase tracking-[0.06em] text-white">
                {item.label}
              </Link>
            ))}
            {session ? <button type="button" onClick={logout} className="border border-white/14 px-4 py-4 text-left text-sm font-black uppercase tracking-[0.06em] text-white">Logout</button> : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
