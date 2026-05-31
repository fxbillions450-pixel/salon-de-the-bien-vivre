import { cn } from '@/lib/utils'

interface FormFieldProps {
  id: string
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  hint?: string
  className?: string
}

export function FormField({ id, label, error, required, children, hint, className }: FormFieldProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-sm font-medium text-charcoal">
        {label}
        {required && (
          <span className="text-terracotta ml-1" aria-hidden="true">
            *
          </span>
        )}
        {!required && (
          <span className="text-brown/50 ml-1 text-xs font-normal">(facultatif)</span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-brown/60">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
