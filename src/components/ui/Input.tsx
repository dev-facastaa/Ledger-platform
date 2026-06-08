import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

export function Input({ label, error, helper, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-[#121E6C]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`h-12 px-4 border text-base font-normal text-[#121E6C] placeholder:text-[#606060] bg-white transition-all duration-150
          focus:outline-none focus:ring-0
          ${error
            ? 'border-2 border-[#910022]'
            : 'border border-[#969696] focus:border-2 focus:border-[#FF2947]'}
          disabled:bg-[#F3F3F3] disabled:text-[#969696] disabled:cursor-not-allowed
          ${className}`}
        style={{ borderRadius: '12px' }}
        {...props}
      />
      {helper && !error && <p className="text-xs text-[#606060]">{helper}</p>}
      {error && <p className="text-xs font-semibold text-[#910022]">{error}</p>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helper?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ label, error, helper, options, placeholder, className = '', id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-[#121E6C]">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`h-12 px-4 border text-base font-normal text-[#121E6C] bg-white transition-all duration-150 cursor-pointer
          focus:outline-none focus:ring-0
          ${error
            ? 'border-2 border-[#910022]'
            : 'border border-[#969696] focus:border-2 focus:border-[#FF2947]'}
          disabled:bg-[#F3F3F3] disabled:text-[#969696]
          ${className}`}
        style={{ borderRadius: '12px' }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {helper && !error && <p className="text-xs text-[#606060]">{helper}</p>}
      {error && <p className="text-xs font-semibold text-[#910022]">{error}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
}

export function Textarea({ label, error, helper, className = '', id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-[#121E6C]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`p-4 border text-base font-normal text-[#121E6C] placeholder:text-[#606060] bg-white resize-none transition-all duration-150
          focus:outline-none focus:ring-0
          ${error
            ? 'border-2 border-[#910022]'
            : 'border border-[#969696] focus:border-2 focus:border-[#FF2947]'}
          ${className}`}
        style={{ borderRadius: '12px' }}
        {...props}
      />
      {helper && !error && <p className="text-xs text-[#606060]">{helper}</p>}
      {error && <p className="text-xs font-semibold text-[#910022]">{error}</p>}
    </div>
  )
}
