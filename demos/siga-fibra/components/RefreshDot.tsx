'use client'

/**
 * Indicador discreto de atualização em andamento.
 *
 * Substitui o estado de "Carregando..." que apagava a tela inteira a cada
 * ciclo: o conteúdo continua visível e só este ponto avisa que há dado novo
 * a caminho.
 */
export function RefreshDot({ active }: { active?: boolean }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
      style={{
        background: '#27CAA3',
        opacity: active ? 1 : 0,
        transition: 'opacity 300ms ease-out',
        animation: active ? 'sf-pulse 1.2s ease-in-out infinite' : undefined,
      }}
      title={active ? 'Atualizando...' : undefined}
    />
  )
}
