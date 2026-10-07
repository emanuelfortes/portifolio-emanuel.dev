'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Trash2, X } from 'lucide-react'

/**
 * A imagem do anexo em tamanho grande, por cima da página.
 *
 * Serve tanto para anexo já enviado (URL assinada do S3) quanto para arquivo
 * ainda por enviar no modal de nova demanda (`blob:` do próprio navegador) —
 * daqui de dentro os dois são só uma `src`.
 */
export function ImageLightbox({
  src,
  alt,
  onClose,
  onRemover,
}: {
  src: string
  alt: string
  onClose: () => void
  /** Quando existe, aparece o botão de remover. Some depois de remover. */
  onRemover?: () => void
}) {
  /**
   * O portal só pode montar no cliente: no servidor não existe `document`.
   *
   * Sem esta espera o primeiro render quebraria a página inteira em vez de só
   * a imagem, porque o Next pré-renderiza componentes de cliente também.
   */
  const [montado, setMontado] = useState(false)
  useEffect(() => setMontado(true), [])

  /**
   * Esc fecha, e o scroll do fundo trava enquanto a imagem está aberta.
   *
   * Sem travar, a roda do mouse rola a demanda atrás da imagem: ao fechar, a
   * pessoa volta para um ponto da página que não é onde ela estava.
   */
  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', aoTeclar)

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = overflowAnterior
    }
  }, [onClose])

  if (!montado) return null

  /**
   * Vai para o `body` por portal, e a razão é a que fazia a imagem abrir torta.
   *
   * Todo modal do projeto é `fixed inset-0 … overflow-y-auto … backdrop-blur`,
   * e `backdrop-filter` cria bloco de contenção para descendentes `fixed`.
   * Renderizada lá dentro, esta camada deixava de se ancorar na TELA e passava
   * a se ancorar no conteúdo rolado do modal: como os anexos ficam no fim de um
   * formulário longo, a imagem nascia acima da área visível. E o fundo clicável
   * ia junto, então clicar fora não fechava — o clique caía na página de trás.
   *
   * No `body` não há ancestral nenhum para distorcer o `fixed`, aqui e em
   * qualquer lugar de onde a imagem venha a ser aberta.
   */
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-pine-950/85 p-4 backdrop-blur-[2px]"
    >
      <div className="absolute right-4 top-4 flex items-center gap-2">
        {onRemover && (
          <button
            type="button"
            onClick={(e) => {
              // Sem o `stopPropagation` o clique também chegaria ao fundo, que
              // fecha — e a ordem entre fechar e remover ficaria por sorte.
              e.stopPropagation()
              onRemover()
            }}
            title="Remover"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-white/70 transition hover:bg-red-500/20 hover:text-red-200"
          >
            <Trash2 className="size-4" />
            Remover
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          title="Fechar (Esc)"
          className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X className="size-5" />
        </button>
      </div>

      {/*
       * O clique no fundo fecha; no conteúdo, não. Sem este `stopPropagation`
       * a imagem some ao ser clicada, que é o gesto de quem quer olhar mais
       * de perto — o oposto de fechar.
       */}
      <figure
        onClick={(e) => e.stopPropagation()}
        className="animate-in flex max-h-full max-w-5xl flex-col items-center gap-3"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- URL assinada e
            efêmera do S3: o otimizador do Next precisaria do domínio liberado
            em next.config e ainda assim cachearia uma URL que expira em 1h. */}
        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
        />
        <figcaption className="max-w-full truncate px-2 text-[13px] text-white/80">
          {alt}
        </figcaption>
      </figure>
    </div>,
    document.body,
  )
}
