'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { Eye, EyeOff } from 'lucide-react'
import { initials, avatarColor } from '@/demos/kanban-cev/lib/format'

export function Avatar({
  name,
  url,
  size = 28,
}: {
  name: string
  url?: string | null
  size?: number
}) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        title={name}
        className="rounded-full object-cover ring-2 ring-surface"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      title={name}
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-semibold ring-2 ring-surface',
        avatarColor(name),
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials(name)}
    </span>
  )
}

export function Badge({
  children,
  className,
  dotColor,
}: {
  children: React.ReactNode
  className?: string
  dotColor?: string
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ring-1 ring-inset lg:px-2 lg:py-0.5 lg:text-[11px]',
        className ?? 'bg-ink-100 text-ink-700 ring-ink-300',
      )}
    >
      {dotColor && (
        <span className="size-1.5 rounded-full" style={{ background: dotColor }} aria-hidden />
      )}
      {children}
    </span>
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md'
}) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
        /* No celular, a altura mínima de toque (44px, ou 40px no "sm") e a
           letra maior; no computador, os tamanhos de sempre. */
        size === 'sm'
          ? 'min-h-10 px-3 py-1.5 text-[14px] lg:min-h-0 lg:px-2.5 lg:text-[13px]'
          : 'min-h-11 px-4 py-2 text-[15px] lg:min-h-0 lg:px-3.5 lg:text-sm',
        // No escuro, texto claro sobre ouro some. O contraste vem do verde
        // profundo por cima do dourado — que é o par da própria marca.
        variant === 'primary' && 'bg-brand-600 text-pine-950 hover:bg-brand-700',
        variant === 'outline' && 'border border-ink-200 bg-surface text-ink-800 hover:bg-ink-100',
        variant === 'ghost' && 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
        variant === 'danger' && 'bg-red-500 text-pine-950 hover:bg-red-400',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[14px] font-medium text-ink-700 lg:text-[13px]">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-[13px] text-ink-500 lg:text-xs">{hint}</span>}
      {error && <span className="mt-1 block text-[13px] text-red-600 lg:text-xs">{error}</span>}
    </label>
  )
}

/**
 * Campo afundado no cartão: no escuro, mais escuro lê como "editável".
 *
 * No celular, 16px e 44px de altura. Os 16px não são gosto: o iPhone amplia
 * a tela ao tocar em qualquer campo com letra menor que isso, e 44px é a
 * altura mínima de toque. No computador, o tamanho de sempre.
 */
export const inputClass =
  'w-full min-h-11 rounded-lg border border-ink-200 bg-pine-900/60 px-3.5 py-2.5 text-[16px] text-ink-900 ' +
  'lg:min-h-0 lg:px-3 lg:py-2 lg:text-sm ' +
  'placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25'

/**
 * Campo de senha com o olho de mostrar e ocultar.
 *
 * Existe como componente, e não como um `useState` repetido em cada tela,
 * porque senha aparece em quatro lugares — login e os três campos da troca de
 * senha. Repetir daria quatro comportamentos que divergem no primeiro ajuste.
 *
 * O botão fica no fluxo de tabulação de propósito. É comum vê-lo com
 * `tabIndex={-1}` para não "atrapalhar" o caminho até o botão de entrar, mas
 * isso o torna inalcançável para quem navega por teclado — justamente quem
 * mais precisa conferir o que digitou.
 */
export function PasswordInput({
  className,
  onVisibilidade,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  /** Avisa quando a senha passa a ser exibida. Opcional: só o login usa. */
  onVisibilidade?: (visivel: boolean) => void
}) {
  const [visivel, setVisivel] = useState(false)
  const rotulo = visivel ? 'Ocultar senha' : 'Mostrar senha'

  return (
    <div className="relative">
      <input
        {...props}
        type={visivel ? 'text' : 'password'}
        // `pr-10` reserva a área do botão: sem isso, uma senha longa passa por
        // baixo do ícone e fica ilegível justamente quando revelada.
        className={clsx(inputClass, 'pr-10 lg:pr-10', className)}
      />
      <button
        type="button" // sem isto, dentro de um <form>, clicar no olho envia o formulário
        onClick={() =>
          setVisivel((v) => {
            onVisibilidade?.(!v)
            return !v
          })
        }
        aria-label={rotulo}
        aria-pressed={visivel}
        title={rotulo}
        className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-3 text-ink-400 transition hover:text-ink-900 focus:text-ink-900 focus:outline-none"
      >
        {visivel ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        'inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent',
        className,
      )}
      aria-label="Carregando"
    />
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-200 bg-surface/60 px-6 py-12 text-center">
      {icon && <div className="mb-3 text-ink-300">{icon}</div>}
      <p className="text-sm font-medium text-ink-800">{title}</p>
      {description && <p className="mt-1 max-w-sm text-[13px] text-ink-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
