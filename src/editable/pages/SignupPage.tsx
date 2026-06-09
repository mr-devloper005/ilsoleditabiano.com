import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, UserPlus } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-black text-white">
        <section className="relative mx-auto grid min-h-[calc(100vh-112px)] max-w-[var(--editable-container)] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1fr] lg:px-24">
          <div className="absolute inset-y-0 left-0 hidden w-[34%] bg-[var(--slot4-accent)] lg:block" />
          <div className="relative bg-white p-7 text-black shadow-[0_34px_110px_rgba(0,0,0,0.48)] sm:p-10">
            <div className="mb-8 flex items-center justify-between border-b border-black/12 pb-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">Creator access</p>
                <h1 className="mt-2 text-4xl font-black uppercase leading-none">Sign up</h1>
              </div>
              <div className="flex h-14 w-14 items-center justify-center bg-black text-white"><UserPlus className="h-6 w-6" /></div>
            </div>
            <EditableLocalSignupForm />
            <p className="mt-6 text-sm font-semibold text-[#667085]">Already have an account? <Link href="/login" className="font-black text-black underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
          </div>
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{pagesContent.auth.signup.badge}</p>
            <h2 className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.86] tracking-[-0.03em] sm:text-7xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-white/72">{pagesContent.auth.signup.description}</p>
            <Link href="/login" className="mt-9 inline-flex items-center gap-3 border border-white px-8 py-4 text-sm font-black uppercase tracking-[0.05em] hover:bg-white hover:text-black">
              Sign in instead <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
