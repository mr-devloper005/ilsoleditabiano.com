import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-current/12', className)} />
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 text-white sm:px-8 lg:px-24', className)} aria-live="polite" aria-busy="true">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{label}</p>
      <PulseBlock className="mt-6 h-16 w-3/4 max-w-4xl" />
      <PulseBlock className="mt-5 h-6 w-2/3 max-w-2xl" />
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="border border-current/14 p-5">
            <PulseBlock className="h-48 w-full" />
            <PulseBlock className="mt-5 h-6 w-4/5" />
            <PulseBlock className="mt-3 h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-8 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border border-current/14 p-5">
          <PulseBlock className="h-44 w-full" />
          <PulseBlock className="mt-5 h-6 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-2/3" />
          <PulseBlock className="mt-6 h-10 w-36" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading detail', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto grid w-full max-w-[var(--editable-container)] gap-8 px-5 py-16 text-white sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-24', className)} aria-live="polite" aria-busy="true">
      <PulseBlock className="h-96 w-full" />
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{label}</p>
        <PulseBlock className="mt-6 h-16 w-4/5" />
        <PulseBlock className="mt-6 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
        <PulseBlock className="mt-3 h-4 w-2/3" />
      </div>
    </div>
  )
}
