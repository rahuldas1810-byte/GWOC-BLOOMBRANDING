'use client'

import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const content = (
    <div className="text-center py-12 px-4">
      <div className="mx-auto w-16 h-16 bg-earl-gray rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-dark-choc/40" />
      </div>
      <h3 className="text-lg font-semibold text-dark-choc mb-2">{title}</h3>
      <p className="text-dark-choc/60 mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && (actionHref || onAction) && (
        <div>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-lg hover:bg-electric-blue/90 transition-colors font-medium"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-2 bg-electric-blue text-white px-6 py-3 rounded-lg hover:bg-electric-blue/90 transition-colors font-medium"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )

  return <div className="bg-white rounded-lg border border-dark-choc/10">{content}</div>
}

