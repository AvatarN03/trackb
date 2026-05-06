'use client'

import React from 'react'
import clsx from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass'
}

export function Card({ variant = 'default', className, children, ...rest }: CardProps) {
  const base = 'rounded-[var(--radius-lg)] p-4 transition-all md-transition'
  const variantCls = clsx({
    'bg-[color:var(--color-card)] text-[color:var(--color-card-foreground)] shadow-sm hover:shadow-md': variant === 'default',
    'md-glass': variant === 'glass',
  })
  return (
    <div {...rest} className={clsx(base, variantCls, className)}>
      {children}
    </div>
  )
}
