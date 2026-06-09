import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing is published here yet',
  description = 'This section is ready. New profiles, visuals, and resources will appear automatically when content is available.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('border border-dashed border-current/24 bg-black p-10 text-center text-white', className)}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[var(--slot4-accent)]">
        <SearchX className="h-7 w-7" />
      </div>
      <h2 className="mt-7 text-4xl font-black uppercase leading-none">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-7 text-white/64">{description}</p>
      <Link href={actionHref} className="mt-7 inline-flex items-center gap-2 bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.05em] text-black transition hover:bg-[var(--slot4-accent)] hover:text-white">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically. The page keeps its discovery layout ready while the feed is empty.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your message has been saved and is ready for follow-up."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
