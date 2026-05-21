import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-[#121e6c] text-white hover:bg-[#3e4983] focus:ring-[#121e6c] disabled:bg-[#f1f2f6] disabled:text-[#969bbd]',
    secondary: 'bg-white text-[#121e6c] border-2 border-[#121e6c] hover:bg-[#d2d4e1] focus:ring-[#121e6c] disabled:border-[#d2d4e1] disabled:text-[#969bbd]',
    danger: 'bg-[#ee424e] text-white hover:bg-[#c73c53] focus:ring-[#ee424e] disabled:bg-[#f1f2f6] disabled:text-[#969bbd]',
    ghost: 'bg-transparent text-[#121e6c] hover:bg-[#f1f2f6] focus:ring-[#121e6c]',
  }

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-12 px-8 text-base',
    lg: 'h-14 px-10 text-lg',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full spinner" />
      )}
      {children}
    </button>
  )
}
