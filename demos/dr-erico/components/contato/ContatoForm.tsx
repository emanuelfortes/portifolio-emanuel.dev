'use client'

import { useState } from 'react'

export default function ContatoForm() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 grid sm:grid-cols-2 gap-4 bg-brand-beige-light rounded-2xl p-6"
      aria-label="Formulário de contato"
    >
      <input
        type="text"
        required
        placeholder="Nome"
        aria-label="Nome completo"
        className="sm:col-span-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
      />
      <input
        type="email"
        required
        placeholder="E-mail"
        aria-label="Endereço de e-mail"
        className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
      />
      <input
        type="tel"
        required
        placeholder="Telefone"
        aria-label="Número de telefone"
        className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
      />
      <textarea
        rows={5}
        placeholder="Como podemos ajudar?"
        aria-label="Mensagem"
        className="sm:col-span-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
      />
      <button type="submit" className="btn-primary sm:col-span-2 justify-center">
        Enviar mensagem
      </button>
      {sent && (
        <p className="sm:col-span-2 text-center text-sm text-brand-green-dark" role="status">
          Mensagem enviada! Em breve retornaremos.
        </p>
      )}
    </form>
  )
}
