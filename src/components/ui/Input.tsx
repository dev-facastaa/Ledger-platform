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
        <label htmlFor={inputId} className="text-sm font-semibold text-[#121e6c]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`h-12 px-4 rounded-lg border text-base font-normal text-[#121e6c] placeholder:text-[#969bbd] bg-white transition-all duration-150
          focus:outline-none focus:ring-0
          ${error ? 'border-2 border-[#ee424e]' : 'border border-[#d2d4e1] focus:border-2 focus:border-[#121e6c]'}
          disabled:bg-[#f1f2f6] disabled:text-[#969bbd] disabled:cursor-not-allowed
          ${className}`}
        {...props}
      />
      {helper && !error && <p className="text-xs text-[#6c759f]">{helper}</p>}
      {error && <p className="text-xs font-semibold text-[#ee424e]">{error}</p>}
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
        <label htmlFor={inputId} className="text-sm font-semibold text-[#121e6c]">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`h-12 px-4 rounded-lg border text-base font-normal text-[#121e6c] bg-white transition-all duration-150 cursor-pointer
          focus:outline-none focus:ring-0
          ${error ? 'border-2 border-[#ee424e]' : 'border border-[#d2d4e1] focus:border-2 focus:border-[#121e6c]'}
          disabled:bg-[#f1f2f6] disabled:text-[#969bbd]
          ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {helper && !error && <p className="text-xs text-[#6c759f]">{helper}</p>}
      {error && <p className="text-xs font-semibold text-[#ee424e]">{error}</p>}
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
        <label htmlFor={inputId} className="text-sm font-semibold text-[#121e6c]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`p-4 rounded-lg border text-base font-normal text-[#121e6c] placeholder:text-[#969bbd] bg-white resize-none transition-all duration-150
          focus:outline-none focus:ring-0
          ${error ? 'border-2 border-[#ee424e]' : 'border border-[#d2d4e1] focus:border-2 focus:border-[#121e6c]'}
          ${className}`}
        {...props}
      />
      {helper && !error && <p className="text-xs text-[#6c759f]">{helper}</p>}
      {error && <p className="text-xs font-semibold text-[#ee424e]">{error}</p>}
    </div>
  )
}
