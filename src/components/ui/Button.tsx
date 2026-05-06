'use client'

import React from 'react'
import clsx from 'clsx'

type Variant = 'filled' | 'tonal' | 'outlined' | 'text' | 'fab'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'filled',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-all md-transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

  const sizeCls = clsx({
    'h-9 px-4 text-sm': size === 'sm',
    'h-10 px-6 text-sm': size === 'md',
    'h-12 px-8 text-base': size === 'lg',
  })

  const variantCls = clsx(
    {
      // Filled primary
      'bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] shadow-sm hover:shadow-md active:scale-95': variant === 'filled',
      // Tonal
      'bg-[color:var(--color-secondary)] text-[color:var(--color-secondary-foreground)] hover:bg-[color:var(--color-secondary)]/90 active:scale-95': variant === 'tonal',
      // Outlined
      'bg-transparent ring-1 ring-[color:var(--color-border)] text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/5 active:scale-95': variant === 'outlined',
      // Text
      'bg-transparent text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10 active:scale-95': variant === 'text',
      // FAB
      'bg-[color:var(--md-tertiary)] text-white rounded-2xl h-14 w-14 p-0 shadow-md hover:shadow-xl active:scale-95': variant === 'fab',
    },
  )

  return (
    <button
      {...rest}
      className={clsx(base, sizeCls, variant === 'fab' ? 'rounded-2xl' : 'rounded-full', variantCls, className)}
    >
      {children}
    </button>
  )
}
