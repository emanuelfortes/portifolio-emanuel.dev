'use client'

import { useState } from 'react'
import { useQueryClient } from '@/demos/kanban-cev/lib/query'
import { FileText, Upload, Trash2, ExternalLink } from 'lucide-react'
import clsx from 'clsx'
import { MAX_ATTACHMENT_BYTES } from '@/demos/kanban-cev/shared'
import { ApiError, qk } from '@/demos/kanban-cev/lib/api'
import { enviarAtaCliente, removerAtaCliente, type Ata } from '@/demos/kanban-cev/lib/hooks'
import { Spinner } from '@/demos/kanban-cev/components/ui'

export function atasDoCliente(secao: any): Ata[] {
  const arquivos = secao?.content?.arquivos
  return Array.isArray(arquivos) ? arquivos : []
}

function tamanho(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/**
 * A ata da reunião, lida ao lado do briefing.
 *
 * O social media transcreve a conversa para os blocos enquanto lê o PDF na
 * mesma tela — sem isso, o trabalho é alternar entre duas janelas o tempo
 * todo, e é onde a informação se perde.
 *
 * O visor é um `<iframe>` apontando para a URL assinada, ou seja, quem
 * renderiza é o leitor de PDF do próprio navegador. Uma biblioteca de PDF em
 * JavaScript custaria centenas de KB para fazer pior.
 */
export function AtaReuniao({
  clientId,
  secao,
  podeEditar,
  ataAberta,
  onAbrir,
}: {
  clientId: string
  secao: any
  podeEditar: boolean
  ataAberta: Ata | null
  onAbrir: (ata: Ata | null) => void
}) {
  const qc = useQueryClient()
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const atas = atasDoCliente(secao)

  async function aoEscolher(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // permite reenviar o mesmo arquivo depois de um erro
    if (!file) return

    setErro(null)
    if (file.type !== 'application/pdf') {
      setErro('A ata precisa ser um PDF')
      return
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setErro(`O limite é ${Math.round(MAX_ATTACHMENT_BYTES / 1024 / 1024)} MB`)
      return
    }

    setEnviando(true)
    try {
      await enviarAtaCliente(clientId, file, atas)
      await qc.invalidateQueries({ queryKey: qk.client(clientId) })
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível enviar')
    } finally {
      setEnviando(false)
    }
  }

  async function remover(ata: Ata) {
    await removerAtaCliente(clientId, ata.fileKey, atas)
    if (ataAberta?.fileKey === ata.fileKey) onAbrir(null)
    await qc.invalidateQueries({ queryKey: qk.client(clientId) })
  }

  return (
    <div className="rounded-xl border border-ink-200 bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-ink-400" />
          <h3 className="text-[15px] font-semibold text-ink-800">Ata da reunião</h3>
        </div>

        {podeEditar && (
          <label
            className={clsx(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-ink-200 px-2.5 py-1.5 text-[13px] font-medium text-ink-700 transition hover:bg-ink-100',
              enviando && 'pointer-events-none opacity-60',
            )}
          >
            {enviando ? <Spinner /> : <Upload className="size-3.5" />}
            {enviando ? 'Enviando…' : 'Anexar PDF'}
            <input type="file" accept="application/pdf" className="hidden" onChange={aoEscolher} />
          </label>
        )}
      </div>

      {atas.length === 0 ? (
        <p className="text-[13px] text-ink-500">
          Nenhuma ata anexada. Anexe o PDF da reunião para lê-lo ao lado enquanto preenche.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {atas.map((a) => {
            const aberta = ataAberta?.fileKey === a.fileKey
            return (
              <li
                key={a.fileKey}
                className={clsx(
                  'group flex items-center gap-2 rounded-lg px-2.5 py-2 transition',
                  aberta ? 'bg-brand-600/15 ring-1 ring-inset ring-brand-600/30' : 'hover:bg-ink-100',
                )}
              >
                <button
                  onClick={() => onAbrir(aberta ? null : a)}
                  className="min-w-0 flex-1 text-left"
                  title={aberta ? 'Fechar a ata' : 'Ler ao lado'}
                >
                  <p className="truncate text-[14px] font-medium text-ink-800">{a.fileName}</p>
                  <p className="text-[12px] text-ink-500">
                    {tamanho(a.fileSize)} · {aberta ? 'aberta ao lado' : 'clique para ler'}
                  </p>
                </button>

                {a.url && (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abrir em outra aba"
                    className="shrink-0 rounded p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                )}

                {podeEditar && (
                  <button
                    onClick={() => remover(a)}
                    title="Remover"
                    className="shrink-0 rounded p-1.5 text-ink-400 opacity-0 transition hover:bg-red-500/12 hover:text-red-300 focus:opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {erro && <p className="mt-2 text-[13px] text-red-300">{erro}</p>}
    </div>
  )
}

/**
 * O visor, na coluna da direita.
 *
 * `sticky` para a ata acompanhar a rolagem: os doze blocos são bem mais altos
 * que o PDF, e sem isso ela sumiria da tela no terceiro bloco — justamente
 * quando ainda se precisa dela.
 */
export function VisorAta({ ata, onFechar }: { ata: Ata; onFechar: () => void }) {
  return (
    <div className="sticky top-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[13px] font-medium text-ink-700">{ata.fileName}</p>
        <button
          onClick={onFechar}
          className="shrink-0 text-[13px] text-ink-500 transition hover:text-ink-800"
        >
          Fechar
        </button>
      </div>

      {ata.url ? (
        /*
         * Altura pela viewport, não pelo conteúdo: o PDF tem a própria
         * rolagem, e um visor alto é o que evita rolar a página inteira para
         * ler o parágrafo seguinte da ata.
         */
        <iframe
          src={ata.url}
          title={ata.fileName}
          className="h-[calc(100vh-6rem)] w-full rounded-xl border border-ink-200 bg-surface"
        />
      ) : (
        <div className="rounded-xl border border-ink-200 bg-surface p-6 text-[13px] text-ink-500">
          O armazenamento de arquivos não está configurado, então a ata não pode ser exibida.
        </div>
      )}
    </div>
  )
}
