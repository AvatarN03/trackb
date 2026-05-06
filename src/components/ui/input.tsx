'use client'

import React from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className, ...rest }: InputProps) {
  return (
    <label className="block">
      {label && <span className="block text-sm mb-2 text-[color:var(--color-muted-foreground)]">{label}</span>}
      <input
        {...rest}
        className={clsx('w-full bg-[color:var(--color-muted)] border-b-2 border-[color:var(--color-input)] rounded-t-[12px] rounded-b-0 h-14 px-4 py-2 focus:outline-none focus:border-[color:var(--color-primary)] focus:ring-0', className)}
      />
    </label>
  )
}
