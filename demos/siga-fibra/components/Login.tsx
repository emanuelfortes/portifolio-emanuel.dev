'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface LoginProps {
  onLogin: () => void
}

export function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Réplica: a senha real do painel não vem para cá. Qualquer senha entra,
    // e o campo vazio ainda mostra o estado de erro do original.
    if (password.trim().length > 0) {
      sessionStorage.setItem('sf_auth', 'true')
      onLogin()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setError(false), 3000)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #e4f8f3 0%, #f9fafb 60%, #edfaf6 100%)' }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <img
              src="/demos/siga-fibra/logosiga.png"
              alt="Siga Fibra"
              className="h-14 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.removeAttribute('style')
              }}
            />
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl"
              style={{ display: 'none', background: 'linear-gradient(135deg, #27CAA3, #03C2C3)' }}
            >
              <span className="text-white font-extrabold text-xl">SF</span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#111827' }}>Painel de Controle</h1>
          <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>Siga Fibra — Acesso restrito</p>
        </div>

        <div
          className={`bg-white rounded-2xl p-8 transition-all ${shake ? 'animate-pulse' : ''}`}
          style={{ border: '1px solid rgba(39,202,163,0.2)', boxShadow: '0 8px 32px rgba(39,202,163,0.1)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#27CAA3' }}>
                Senha de acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all"
                  style={{
                    border: error
                      ? '1.5px solid #ef4444'
                      : '1.5px solid rgba(39,202,163,0.25)',
                  }}
                  onFocus={(e) => {
                    if (!error) e.currentTarget.style.border = '1.5px solid #27CAA3'
                  }}
                  onBlur={(e) => {
                    if (!error) e.currentTarget.style.border = '1.5px solid rgba(39,202,163,0.25)'
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#9ca3af' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">Senha incorreta. Tente novamente.</p>}
            </div>

            <button
              type="submit"
              className="w-full text-white font-bold py-3 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #27CAA3, #03C2C3)', boxShadow: '0 4px 16px rgba(39,202,163,0.3)' }}
            >
              Entrar
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#9ca3af' }}>
          Siga Fibra © {new Date().getFullYear()} — Uso interno
        </p>
      </div>
    </div>
  )
}
