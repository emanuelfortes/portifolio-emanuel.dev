import type { ButtonClick } from '../types'

/**
 * Catalogo dos botoes rastreados.
 *
 * O sufixo "· LP" existe porque a landing page antiga e o site novo tem
 * botoes equivalentes: sem ele, "Assinar Agora (Planos)" aparecia duas vezes
 * no ranking com numeros diferentes e parecia erro do painel.
 */
export const BOTOES: Record<string, string> = {
  // Landing page antiga
  navbar_whatsapp: 'Assinar pelo WhatsApp (Topo) · LP',
  hero_cta:        'Quero Minha Internet Rápida Agora · LP',
  plan_subscribe:  'Assinar Agora (Planos) · LP',
  cta_final:       'Quero Instalar Minha Internet Agora · LP',
  fab_whatsapp:    'Falar no WhatsApp (Flutuante) · LP',
  // Site principal
  navbar_fale_conosco:    'Fale Conosco (Topo)',
  hero_ver_planos:        'Ver Planos de Internet (Hero)',
  hero_especialista:      'Falar com Especialista (Hero)',
  hero_contratar:         'Contratar Agora (Card do Hero)',
  plano_assinar:          'Assinar Agora (Planos)',
  checkout_fechar_pedido: 'Fechar Pedido (Checkout)',
  whatsapp_link:          'Link de WhatsApp',
  phone_link:             'Link de Telefone',
  outbound_link:          'Link Externo',
  banner_home:            'Banner da Home',
  // Campanha do mes
  campanha_banner:        'Banner da Campanha',
  campanha_assinar:       'Assinar Promoção (Planos)',
  campanha_app:           'Escolha do Streaming (Promoção)',
}

export const rotuloBotao = (button: string) => BOTOES[button] ?? button

/**
 * Botoes que representam intencao de assinar (etapa 3 do funil).
 * campanha_assinar entra aqui porque e o mesmo gesto do plano_assinar, so que
 * no card da promocao: fora da lista, o funil contaria a campanha a menos.
 */
export const INTENCAO = ['plano_assinar', 'campanha_assinar', 'plan_subscribe', 'hero_contratar', 'hero_cta', 'cta_final']

/** Conclusao do pedido (etapa 4) */
export const CHECKOUT = ['checkout_fechar_pedido']

/** Qualquer caminho que leva a conversa no WhatsApp */
export const WHATSAPP = ['navbar_whatsapp', 'fab_whatsapp', 'whatsapp_link', 'checkout_fechar_pedido']

/** Posicao do botao na pagina, para comparar desempenho por posicao */
export const POSICAO: Record<string, string> = {
  navbar_whatsapp: 'Topo', navbar_fale_conosco: 'Topo',
  hero_cta: 'Hero', hero_ver_planos: 'Hero', hero_especialista: 'Hero', hero_contratar: 'Hero',
  plan_subscribe: 'Planos', plano_assinar: 'Planos', campanha_assinar: 'Planos',
  cta_final: 'CTA final',
  fab_whatsapp: 'Flutuante',
  checkout_fechar_pedido: 'Checkout', campanha_app: 'Checkout',
  banner_home: 'Banner', campanha_banner: 'Banner',
  whatsapp_link: 'Link no texto', phone_link: 'Link no texto', outbound_link: 'Link no texto',
}

/**
 * Unicos botoes cujo rotulo carrega o nome do plano.
 *
 * A lista existe porque olhar so o texto nao serve: os botoes da landing page
 * se chamam "Assinar pelo WhatsApp (Topo)" e "Assinar Agora (Planos)", e um
 * extrator por prefixo transformava isso em "planos" chamados
 * "pelo WhatsApp (Topo)" e "Agora (Planos)".
 */
export const BOTOES_COM_PLANO = ['plano_assinar', 'checkout_fechar_pedido']

/**
 * Extrai o plano do rotulo do clique.
 * Chegam como "Assinar SIGA NITRO 600Mb" e "Fechar pedido - Internet Hipervelocidade".
 */
export function planoDoClique(c: { button: string; label?: string }): string | null {
  if (!BOTOES_COM_PLANO.includes(c.button) || !c.label) return null
  const m =
    c.label.match(/^Assinar\s+(.+)$/i) ||
    c.label.match(/^Fechar pedido\s*[-–—]\s*(.+)$/i)
  if (!m) return null
  const plano = m[1].trim()
  return plano.length > 1 ? plano : null
}

/**
 * Chave de deduplicacao aproximada.
 *
 * O rastreamento nao grava id de visitante, entao nao da para dizer "pessoas
 * unicas" de verdade. Isto agrupa repeticoes do mesmo botao, mesma origem e
 * mesma pagina dentro do mesmo minuto -- que e o caso do clique duplo e do
 * clique nervoso, nao de duas pessoas diferentes.
 */
export const chaveDedup = (c: ButtonClick) =>
  [c.button, c.source, (c as any).campaign ?? '', (c as any).page ?? '', c.timestamp.slice(0, 16)].join('|')

export function contarUnicos(clicks: ButtonClick[]): number {
  return new Set(clicks.map(chaveDedup)).size
}

/** Agrupa repeticoes do mesmo minuto numa linha so, preservando a contagem */
export interface CliqueAgrupado {
  click: ButtonClick
  vezes: number
}

export function agruparRepetidos(clicks: ButtonClick[]): CliqueAgrupado[] {
  const mapa = new Map<string, CliqueAgrupado>()
  for (const c of clicks) {
    const k = chaveDedup(c)
    const existente = mapa.get(k)
    if (existente) existente.vezes++
    else mapa.set(k, { click: c, vezes: 1 })
  }
  return [...mapa.values()]
}

export const SOURCE_CORES: Record<string, string> = {
  organic: '#27CAA3', google_ads: '#0047CC', meta_ads: '#1877F2',
  tiktok_ads: '#FF0050', social: '#06b6d4', direct: '#f97316', other: '#8b5cf6',
}

export const SOURCE_ROTULOS: Record<string, string> = {
  organic: 'Google Orgânico', google_ads: 'Google Ads', meta_ads: 'Meta Ads',
  tiktok_ads: 'TikTok Ads', social: 'Redes Sociais', direct: 'Acesso Direto', other: 'Outros',
}

/** Monta um CSV com separador ";" e BOM, que e o que o Excel pt-BR espera */
export function baixarCSV(nome: string, cabecalho: string[], linhas: (string | number)[][]) {
  const escapar = (v: string | number) => {
    const s = String(v ?? '')
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const csv = [cabecalho, ...linhas].map(l => l.map(escapar).join(';')).join('\r\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nome
  a.click()
  URL.revokeObjectURL(url)
}
