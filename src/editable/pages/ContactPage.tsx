'use client'

import { Mail, MapPin, Send, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function ContactPage() {
  const lanes = [
    { icon: Sparkles, title: 'Creative requests', body: 'Send collaboration notes, resource ideas, or content questions in one direct form.' },
    { icon: MapPin, title: 'Business details', body: 'Share listing, location, or professional information that needs a clear public page.' },
  ]

  return (
    <EditableSiteShell>
      <main className="bg-black text-white">
        <section className="relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-full bg-[linear-gradient(110deg,#050505_0%,#050505_58%,#c90f2f_58%,#c90f2f_100%)]" />
          <div className="relative mx-auto grid max-w-[var(--editable-container)] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-24 lg:py-28">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{pagesContent.contact.eyebrow}</p>
              <h1 className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.86] tracking-[-0.03em] sm:text-7xl">{pagesContent.contact.title}</h1>
              <p className="mt-7 max-w-2xl text-lg font-semibold leading-8 text-white/72">{pagesContent.contact.description}</p>
              <div className="mt-10 grid gap-4">
                {lanes.map((lane) => (
                  <div key={lane.title} className="border border-white/14 bg-[#101010] p-6">
                    <lane.icon className="h-6 w-6 text-[var(--slot4-accent)]" />
                    <h2 className="mt-4 text-2xl font-black uppercase leading-none">{lane.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-white/64">{lane.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-7 text-black shadow-[0_34px_110px_rgba(0,0,0,0.48)] sm:p-10">
              <div className="mb-8 flex items-center justify-between gap-4 border-b border-black/12 pb-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-accent)]">Send message</p>
                  <h2 className="mt-2 text-4xl font-black uppercase leading-none">{pagesContent.contact.formTitle}</h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center bg-black text-white"><Send className="h-6 w-6" /></div>
              </div>
              <EditableContactLeadForm />
              <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#667085]"><Mail className="h-4 w-4" /> We will use the details you send to route the request.</p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
