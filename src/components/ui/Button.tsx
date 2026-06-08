import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'text-primary' | 'text-secondary' | 'danger'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed'

  const variants: Record<ButtonVariant, string> = {
    // Botón principal — Coral pill (Merlin Primary)
    primary: 'bg-[#FF2947] text-white rounded-[32px] hover:bg-[#E4102E] focus:ring-[#FF2947] disabled:bg-[#F3F3F3] disabled:text-[#969696]',
    // Botón secundario — Blanco con borde coral (Merlin Secondary)
    secondary: 'bg-white text-[#FF2947] border border-[#FF2947] rounded-[32px] hover:bg-[#FEF1F3] focus:ring-[#FF2947] disabled:border-[#969696] disabled:text-[#969696]',
    // Botón terciario — Fondo page con texto azul (Merlin Tertiary)
    tertiary: 'bg-[#F7F8FB] text-[#121E6C] rounded-[32px] hover:bg-[#F1F2F6] focus:ring-[#121E6C] disabled:text-[#969696]',
    // Texto primario — Sin fondo, texto coral (Merlin Text Primary)
    'text-primary': 'bg-transparent text-[#FF2947] hover:underline focus:ring-[#FF2947] rounded-lg',
    // Texto secundario — Sin fondo, texto azul (Merlin Text Secondary)
    'text-secondary': 'bg-transparent text-[#121E6C] hover:underline focus:ring-[#121E6C] rounded-lg',
    // Destructivo — alias de primary para acciones de eliminación
    danger: 'bg-[#FF2947] text-white rounded-[32px] hover:bg-[#E4102E] focus:ring-[#FF2947] disabled:bg-[#F3F3F3] disabled:text-[#969696]',
  }

  const sizes = {
    sm:  'h-9  px-5  text-sm',
    md:  'h-12 px-6  text-base',   // 48px altura, Merlin L
    lg:  'h-14 px-8  text-lg',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ fontSize: size === 'md' ? '16px' : undefined, fontWeight: size === 'md' ? 500 : undefined }}
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
