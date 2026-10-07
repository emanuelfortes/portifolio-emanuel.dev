'use client'

import React, { useState } from 'react'
import { CartAddon, CartState } from './CheckoutFlow'
import {
  CheckoutAddonCategory,
  InternetPlan,
  StreamingTier,
  CAMPANHA,
  CHIP_PLANS,
  STREAMING_TIERS,
} from '@/demos/siga-fibra-site/lib/plans'

// ─── Icons ────────────────────────────────────────────────────────────────────

const ICONS: Record<string, React.ReactNode> = {
  superwifi: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
  fixo: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  celular: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  seguranca: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  entretenimento: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  saude: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  cart: CartState
  internetPlans: InternetPlan[]
  categories: CheckoutAddonCategory[]
  campanhaDisponivel: boolean
  onChangePlan: (plan: InternetPlan) => void
  onRestoreCampanha: () => void
  onSelectPlanApp: (appName: string) => void
  onToggleAddon: (addon: CartAddon) => void
  onSelectExclusive: (addon: CartAddon, prefix: string) => void
  onUpdateAddonApp: (tierId: string, appName: string) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StepPedido({ cart, internetPlans, categories, campanhaDisponivel, onChangePlan, onRestoreCampanha, onSelectPlanApp, onToggleAddon, onSelectExclusive, onUpdateAddonApp }: Props) {
  const emCampanha = cart.plan.campanhaId === CAMPANHA.id
  const getInitialOpen = () => {
    if (cart.addons.some(a => a.id.startsWith('movel-'))) return 'celular'
    if (cart.addons.some(a => a.id.startsWith('entretenimento-'))) return 'entretenimento'
    return null
  }

  const [openCategory, setOpenCategory] = useState<string | null>(getInitialOpen)
  const [planOpen, setPlanOpen] = useState(false)
  const [selectedApps, setSelectedApps] = useState<Record<string, string>>({})
  const [expandedMoreTier, setExpandedMoreTier] = useState<string | null>(null)

  const toggleOpen = (id: string) => {
    setOpenCategory(prev => (prev === id ? null : id))
  }

  const isSimpleAdded = (id: string) => cart.addons.some(a => a.id === id)
  const selectedChipId = cart.addons.find(a => a.id.startsWith('movel-'))?.id
  const isStreamingAdded = (id: string) => cart.addons.some(a => a.id === id)
  const selectedStreamingTiers = cart.addons.filter(a => a.id.startsWith('entretenimento-'))

  const handleAppClick = (tier: StreamingTier, appName: string) => {
    const currentApp = selectedApps[tier.id]
    const tierInCart = isStreamingAdded(tier.id)

    if (currentApp === appName) {
      // mesma seleção → deseleciona e remove o tier do carrinho
      setSelectedApps(prev => { const next = { ...prev }; delete next[tier.id]; return next })
      onToggleAddon({ id: tier.id, name: `Playhub ${tier.name}`, price: tier.price })
    } else {
      setSelectedApps(prev => ({ ...prev, [tier.id]: appName }))
      if (!tierInCart) {
        // adiciona o tier com o app já selecionado
        onToggleAddon({ id: tier.id, name: `Playhub ${tier.name}`, price: tier.price, selectedApp: appName })
      } else {
        // tier já no carrinho, só atualiza o app
        onUpdateAddonApp(tier.id, appName)
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Combo da campanha — vendido como linha única, o app não tem preço avulso */}
      {emCampanha && (
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3">Sua promoção</p>
          <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(15,45,34,0.22)' }}>

            <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, #0f2d22 0%, #15543c 100%)' }}>
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#3ddcbc' }}>
                {CAMPANHA.name}
              </p>
              <p className="text-lg font-extrabold text-white leading-tight mt-0.5">
                {CAMPANHA.speed} {CAMPANHA.unit} + 1 streaming
              </p>
              <div className="flex items-end gap-2 mt-2 flex-wrap">
                <span className="text-xs line-through mb-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  R$ {CAMPANHA.priceFrom.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-2xl font-black leading-none" style={{ color: '#3ddcbc' }}>
                  R$ {CAMPANHA.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  /mês por {CAMPANHA.months} meses
                </span>
              </div>
            </div>

            <div className="bg-white px-5 py-4">
              <p className="text-sm font-bold text-gray-800 mb-1">Escolha seu streaming</p>
              <p className="text-xs text-gray-500 mb-3">Já incluso no valor da promoção — escolha um dos dois.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAMPANHA.apps.map(app => {
                  const escolhido = cart.plan.selectedApp === app.name
                  return (
                    <button
                      key={app.name}
                      onClick={() => {
                        onSelectPlanApp(app.name)
                      }}
                      className="flex items-center gap-3 rounded-xl p-3 border-2 transition-all duration-150 text-left"
                      style={escolhido
                        ? { borderColor: '#27CAA3', background: 'rgba(39,202,163,0.07)' }
                        : { borderColor: '#e5e7eb', background: '#fafafa' }
                      }
                    >
                      <div
                        className="w-11 h-11 rounded-xl overflow-hidden shrink-0"
                        style={{ boxShadow: escolhido ? '0 0 0 2.5px #27CAA3' : '0 1px 4px rgba(0,0,0,0.12)' }}
                      >
                        <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: escolhido ? '#27CAA3' : '#111827' }}>
                          {app.name}
                        </p>
                        {app.hasAds && (
                          <span
                            className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap mt-0.5"
                            style={{ background: '#f3f4f6', color: '#6b7280' }}
                          >
                            c/ anúncio
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {!cart.plan.selectedApp && (
                <p className="text-xs font-semibold mt-3" style={{ color: '#6b7280' }}>
                  Escolha um app para concluir a promoção.
                </p>
              )}

              <p className="text-[11px] text-gray-400 mt-3 leading-snug">{CAMPANHA.disclaimer}</p>

              <button
                onClick={() => onChangePlan(internetPlans.find(p => p.id === CAMPANHA.planId) ?? internetPlans[0])}
                className="text-xs font-semibold underline mt-3 text-gray-500"
              >
                Prefiro escolher outro plano, sem a promoção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saiu da promoção — atalho para voltar */}
      {!emCampanha && campanhaDisponivel && (
        <button
          onClick={onRestoreCampanha}
          className="rounded-2xl px-5 py-3 text-left text-sm font-bold"
          style={{ background: 'rgba(39,202,163,0.1)', color: '#0f2d22', border: '1px dashed #27CAA3' }}
        >
          ← Voltar para a promoção {CAMPANHA.name}: {CAMPANHA.speed} {CAMPANHA.unit} + 1 streaming por R$ {CAMPANHA.price.toFixed(2).replace('.', ',')}/mês
        </button>
      )}

      {/* Internet plan accordion */}
      {!emCampanha && (
      <div>
        <p className="text-sm font-bold text-gray-700 mb-3">Seu plano base</p>
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)', borderLeft: '4px solid #03C2C3' }}
        >
          {/* Header */}
          <button
            className="w-full flex items-center gap-4 px-5 py-4 text-left"
            onClick={() => setPlanOpen(o => !o)}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(3,194,195,0.1)' }}>
              <svg className="w-5 h-5" fill="none" stroke="#03C2C3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">{cart.plan.name}</p>
              <p className="text-xs text-gray-500">{cart.plan.detail}</p>
            </div>
            <div className="text-right mr-3">
              <p className="text-xs text-gray-400">por</p>
              <p className="text-base font-extrabold text-gray-900">
                R$ {cart.plan.price.toFixed(2).replace('.', ',')}
                <span className="text-xs font-normal text-gray-400">/mês</span>
              </p>
            </div>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
              style={{
                background: planOpen ? 'rgba(3,194,195,0.1)' : '#f3f4f6',
                color: planOpen ? '#03C2C3' : '#9ca3af',
                transform: planOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Plan options */}
          <div style={{
            display: 'grid',
            gridTemplateRows: planOpen ? '1fr' : '0fr',
            transition: 'grid-template-rows 280ms cubic-bezier(0.4,0,0.2,1)',
          }}>
            <div style={{ overflow: 'hidden' }}>
              <div className="px-5 pb-5 border-t border-gray-100">
                <p className="text-xs text-gray-400 mt-3 mb-3">Clique para trocar seu plano</p>
                <div className="flex flex-col gap-2">
                  {internetPlans.map(plan => {
                    const active = cart.plan.detail === plan.detail
                    return (
                      <button
                        key={plan.id}
                        onClick={() => { onChangePlan(plan); setPlanOpen(false) }}
                        className="flex items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-150 border-2"
                        style={active
                          ? { borderColor: '#03C2C3', background: 'rgba(3,194,195,0.06)' }
                          : { borderColor: '#e5e7eb', background: '#fafafa' }
                        }
                      >
                        <div className="flex-1">
                          <p className="text-sm font-bold" style={{ color: active ? '#03C2C3' : '#111827' }}>
                            {plan.detail}
                          </p>
                        </div>
                        <p className="text-sm font-extrabold" style={{ color: active ? '#03C2C3' : '#374151' }}>
                          R$ {plan.price.toFixed(2).replace('.', ',')}
                          <span className="text-xs font-normal text-gray-400">/mês</span>
                        </p>
                        {active && (
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="#03C2C3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Add-on categories */}
      <div>
        <p className="text-sm font-bold text-gray-700 mb-3">Turbine seu plano</p>
        <div className="flex flex-col gap-2">
          {categories.map(cat => {
            const isOpen = openCategory === cat.id
            const hasExpand = cat.type === 'chip' || cat.type === 'streaming'

            const hasSelection =
              cat.type === 'simple'
                ? isSimpleAdded(cat.id)
                : cat.type === 'chip'
                ? !!selectedChipId
                : selectedStreamingTiers.length > 0

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                  borderLeft: hasSelection ? '4px solid #03C2C3' : '4px solid transparent',
                }}
              >
                {/* Header row. No original é um <button> com outro <button>
                    dentro (Telefone Fixo), HTML inválido que quebra a
                    hidratação no React 18; aqui é um div com papel de botão. */}
                <div
                  role="button"
                  tabIndex={0}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                  onClick={() => hasExpand ? toggleOpen(cat.id) : undefined}
                  style={{ cursor: hasExpand ? 'pointer' : 'default' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      background: hasSelection ? 'rgba(3,194,195,0.1)' : '#f3f4f6',
                      color: hasSelection ? '#03C2C3' : '#6B7280',
                    }}
                  >
                    {ICONS[cat.id]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-800">{cat.name}</p>
                      {hasSelection && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(3,194,195,0.1)', color: '#03C2C3' }}
                        >
                          {cat.type === 'chip'
                            ? CHIP_PLANS.find(c => c.id === selectedChipId)?.name.replace('Chip Móvel ', '')
                            : cat.type === 'streaming'
                            ? selectedStreamingTiers.length === 1
                              ? selectedStreamingTiers[0].name.replace('Playhub ', '') + ' selecionado'
                              : `${selectedStreamingTiers.length} tiers selecionados`
                            : 'Adicionado'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-snug mt-0.5">{cat.description}</p>
                  </div>

                  {/* Right side */}
                  {cat.type === 'simple' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleAddon({ id: cat.id, name: cat.name, price: cat.price! })
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 shrink-0"
                      style={hasSelection
                        ? { background: 'rgba(3,194,195,0.1)', color: '#03C2C3', border: '1px solid #03C2C3' }
                        : { background: '#03C2C3', color: 'white' }
                      }
                    >
                      {hasSelection ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Adicionado
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                          R$ {cat.price!.toFixed(2).replace('.', ',')}
                        </>
                      )}
                    </button>
                  )}

                  {hasExpand && (
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200"
                      style={{
                        background: isOpen ? 'rgba(3,194,195,0.1)' : '#f3f4f6',
                        color: isOpen ? '#03C2C3' : '#9ca3af',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Accordion content */}
                <div style={{
                  display: 'grid',
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                  transition: 'grid-template-rows 280ms cubic-bezier(0.4,0,0.2,1)',
                }}>
                  <div style={{ overflow: 'hidden' }}>
                    {cat.type === 'chip' && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <p className="text-xs text-gray-400 mt-3 mb-3">
                          Todos incluem ligações ilimitadas, WhatsApp e Waze liberados
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {CHIP_PLANS.map(chip => {
                            const selected = selectedChipId === chip.id
                            return (
                              <button
                                key={chip.id}
                                onClick={() => {
                                  onSelectExclusive({ id: chip.id, name: chip.name, price: chip.price }, 'movel-')
                                  setOpenCategory(null)
                                }}
                                className="relative flex flex-col items-center gap-1 rounded-xl py-3 px-2 transition-all duration-150 border-2"
                                style={selected
                                  ? { borderColor: '#03C2C3', background: 'rgba(3,194,195,0.08)' }
                                  : { borderColor: '#e5e7eb', background: '#fafafa' }
                                }
                              >
                                {chip.badge && (
                                  <span
                                    className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white whitespace-nowrap"
                                    style={{ background: '#03C2C3' }}
                                  >
                                    {chip.badge}
                                  </span>
                                )}
                                <span className="text-2xl font-black leading-none" style={{ color: selected ? '#03C2C3' : '#111827' }}>
                                  {chip.gb}
                                </span>
                                <span className="text-xs font-bold" style={{ color: selected ? '#03C2C3' : '#6B7280' }}>
                                  GB
                                </span>
                                <span className="text-xs font-semibold mt-0.5" style={{ color: selected ? '#03C2C3' : '#374151' }}>
                                  R$ {chip.price.toFixed(2).replace('.', ',')}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {cat.type === 'streaming' && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <div
                          className="flex items-center gap-2 mt-3 mb-3 px-3 py-2 rounded-xl text-xs font-semibold"
                          style={{ background: 'rgba(3,194,195,0.08)', color: '#03C2C3', border: '1px solid rgba(3,194,195,0.2)' }}
                        >
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Escolha um app por categoria, só pode escolher um de cada.
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {STREAMING_TIERS.map(tier => {
                            const tierSelected = isStreamingAdded(tier.id)
                            const chosenApp = selectedApps[tier.id]
                            const orderedApps = chosenApp
                              ? [
                                  tier.apps.find(a => a.name === chosenApp)!,
                                  ...tier.apps.filter(a => a.name !== chosenApp),
                                ]
                              : tier.apps
                            const featuredApps = orderedApps.slice(0, 4)
                            const moreApps = orderedApps.slice(4)
                            const moreOpen = expandedMoreTier === tier.id

                            return (
                              <div
                                key={tier.id}
                                className="flex flex-col gap-3 rounded-xl p-4 transition-all duration-150 border-2"
                                style={tierSelected
                                  ? { borderColor: tier.color, background: `rgba(${hexToRgb(tier.color)},0.05)` }
                                  : { borderColor: '#e5e7eb', background: '#fafafa' }
                                }
                              >
                                {/* Header: badge + price */}
                                <div className="flex items-center justify-between">
                                  <span
                                    className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                                    style={{ background: `rgba(${hexToRgb(tier.color)},0.12)`, color: tier.color }}
                                  >
                                    {tier.name}
                                  </span>
                                  <div>
                                    <span className="text-sm font-extrabold text-gray-900">
                                      R$ {tier.price.toFixed(2).replace('.', ',')}
                                    </span>
                                    <span className="text-xs text-gray-400">/mês</span>
                                  </div>
                                </div>

                                {/* Featured app icons + more button */}
                                <div className="flex items-start gap-2 flex-wrap">
                                  {featuredApps.map((app) => {
                                    const appChosen = chosenApp === app.name
                                    return (
                                      <button
                                        key={app.name}
                                        onClick={() => handleAppClick(tier, app.name)}
                                        className="flex flex-col items-center gap-1 transition-all duration-150"
                                      >
                                        <div
                                          className="w-11 h-11 rounded-xl overflow-hidden shrink-0 transition-all duration-150"
                                          style={{
                                            boxShadow: appChosen
                                              ? `0 0 0 2.5px ${tier.color}`
                                              : '0 1px 4px rgba(0,0,0,0.12)',
                                            opacity: tierSelected && !appChosen ? 0.4 : 1,
                                          }}
                                        >
                                          <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="h-4 flex items-center justify-center">
                                          {app.hasAds && (
                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                                              style={{ background: '#f3f4f6', color: '#6b7280' }}>
                                              c/ anúncio
                                            </span>
                                          )}
                                        </div>
                                      </button>
                                    )
                                  })}

                                  {/* +X more button */}
                                  {moreApps.length > 0 && (
                                    <button
                                      onClick={() => setExpandedMoreTier(moreOpen ? null : tier.id)}
                                      className="flex flex-col items-center gap-1"
                                    >
                                      <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150"
                                        style={moreOpen
                                          ? { background: `rgba(${hexToRgb(tier.color)},0.15)`, color: tier.color }
                                          : { background: '#27CAA3', color: 'white', boxShadow: '0 2px 8px rgba(39,202,163,0.45)' }
                                        }
                                      >
                                        <span className="text-xs font-bold">
                                          {moreOpen ? '▲' : `+${moreApps.length}`}
                                        </span>
                                      </div>
                                      <div className="h-4 flex items-center">
                                        <span className="text-[9px] font-semibold" style={{ color: moreOpen ? '#6B7280' : '#27CAA3' }}>
                                          {moreOpen ? 'fechar' : 'ver mais'}
                                        </span>
                                      </div>
                                    </button>
                                  )}
                                </div>

                                {/* More apps panel */}
                                <div style={{
                                  display: 'grid',
                                  gridTemplateRows: moreOpen ? '1fr' : '0fr',
                                  transition: 'grid-template-rows 260ms cubic-bezier(0.4,0,0.2,1)',
                                }}>
                                  <div style={{ overflow: 'hidden' }}>
                                    <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                                      {moreApps.map((app) => {
                                        const appChosen = chosenApp === app.name
                                        return app.icon ? (
                                          <button
                                            key={app.name}
                                            onClick={() => handleAppClick(tier, app.name)}
                                            className="flex flex-col items-center gap-1 transition-all duration-150"
                                          >
                                            <div
                                              className="w-11 h-11 rounded-xl overflow-hidden shrink-0"
                                              style={{
                                                boxShadow: appChosen
                                                  ? `0 0 0 2.5px ${tier.color}`
                                                  : '0 1px 4px rgba(0,0,0,0.12)',
                                                opacity: tierSelected && !appChosen ? 0.4 : 1,
                                              }}
                                            >
                                              <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="h-4 flex items-center justify-center">
                                              {app.hasAds && (
                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                                                  style={{ background: '#f3f4f6', color: '#6b7280' }}>
                                                  c/ anúncio
                                                </span>
                                              )}
                                            </div>
                                          </button>
                                        ) : (
                                          <button
                                            key={app.name}
                                            onClick={() => handleAppClick(tier, app.name)}
                                            className="flex items-center px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-150"
                                            style={appChosen
                                              ? { borderColor: tier.color, color: tier.color, background: `rgba(${hexToRgb(tier.color)},0.06)` }
                                              : { borderColor: '#e5e7eb', color: '#374151', background: '#fafafa' }
                                            }
                                          >
                                            {app.name}
                                          </button>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>

                                {/* Selected app indicator */}
                                {chosenApp && (
                                  <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: tier.color }}>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {chosenApp} selecionado
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

// hex → "r,g,b" para usar em rgba()
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
