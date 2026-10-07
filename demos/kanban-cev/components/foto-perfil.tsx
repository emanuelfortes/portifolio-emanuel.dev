'use client'

import { useState } from 'react'
import { enviarLocal } from '@/demos/kanban-cev/lib/upload'
import { Camera, Trash2 } from 'lucide-react'
import { PREVIEWABLE_IMAGE_MIME } from '@/demos/kanban-cev/shared'
import { api, ApiError } from '@/demos/kanban-cev/lib/api'
import { Avatar, Spinner } from '@/demos/kanban-cev/components/ui'

/** O mesmo limite do backend. Foto de perfil de 25 MB é arquivo errado. */
const MAX_FOTO_BYTES = 5 * 1024 * 1024

/**
 * Trocar a foto de um perfil — de colaborador ou de cliente.
 *
 * Os três passos são os do anexo: pede a URL, manda o arquivo direto ao S3,
 * confirma. O arquivo não passa pela API em momento nenhum.
 *
 * `versao` no `src` força o navegador a buscar de novo depois da troca. Sem
 * isso a foto antiga fica na tela até um recarregamento forçado: o endereço
 * é FIXO (`/api/users/<id>/avatar`), então o cache não tem como saber que o
 * conteúdo mudou.
 */
export function FotoPerfil({
  escopo,
  id,
  nome,
  urlAtual,
  podeEditar,
  size = 96,
  onTrocou,
}: {
  escopo: 'users' | 'clients'
  id: string
  nome: string
  urlAtual: string | null
  podeEditar: boolean
  size?: number
  onTrocou?: () => void
}) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [versao, setVersao] = useState(0)

  const caminho = escopo === 'users' ? 'avatar' : 'logo'
  // Na réplica a foto é um `blob:` do próprio navegador, que não aceita `?v=`.
  const src = urlAtual ? (versao && !urlAtual.startsWith('blob:') ? `${urlAtual}?v=${versao}` : urlAtual) : null

  async function aoEscolher(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // permite reenviar o mesmo arquivo depois de um erro
    if (!file) return

    setErro(null)
    if (!(PREVIEWABLE_IMAGE_MIME as readonly string[]).includes(file.type)) {
      setErro('A foto precisa ser uma imagem (PNG, JPEG, WebP ou GIF)')
      return
    }
    if (file.size > MAX_FOTO_BYTES) {
      setErro(`A foto precisa ter até ${MAX_FOTO_BYTES / 1024 / 1024} MB`)
      return
    }

    setEnviando(true)
    try {
      const assinatura = await api.post<{ uploadUrl: string; fileKey: string }>(
        `/${escopo}/${id}/${caminho}/sign`,
        { fileName: file.name, mimeType: file.type, fileSize: file.size },
      )

      // Sem `credentials`: o cookie de sessão não pode ir para a Amazon.
      const envio = await enviarLocal(assinatura.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'content-type': file.type },
      })
      if (!envio.ok) throw new Error('Falha ao enviar a imagem')

      await api.put(`/${escopo}/${id}/${caminho}`, { fileKey: assinatura.fileKey })
      setVersao((v) => v + 1)
      onTrocou?.()
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível enviar')
    } finally {
      setEnviando(false)
    }
  }

  async function remover() {
    setEnviando(true)
    setErro(null)
    try {
      await api.delete(`/${escopo}/${id}/${caminho}`)
      setVersao((v) => v + 1)
      onTrocou?.()
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível remover')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <Avatar name={nome} url={src} size={size} />

          {podeEditar && (
            /* O rótulo cobre a foto inteira: a área de clique é a imagem, que
               é onde a pessoa tenta clicar antes de procurar um botão. */
            <label
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-pine-950/60 opacity-0 transition hover:opacity-100"
              title="Trocar a foto"
            >
              {enviando ? <Spinner /> : <Camera className="size-5 text-white" />}
              <input
                type="file"
                accept={PREVIEWABLE_IMAGE_MIME.join(',')}
                className="hidden"
                onChange={aoEscolher}
                disabled={enviando}
              />
            </label>
          )}
        </div>

        {podeEditar && (
          <div className="min-w-0">
            <p className="text-[13px] text-ink-600">
              {src ? 'Clique na imagem para trocar.' : 'Clique na imagem para enviar uma foto.'}
            </p>
            <p className="text-[12px] text-ink-400">PNG, JPEG, WebP ou GIF, até 5 MB.</p>

            {src && (
              <button
                type="button"
                onClick={remover}
                disabled={enviando}
                className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-500 transition hover:text-red-300 disabled:opacity-50"
              >
                <Trash2 className="size-3.5" />
                Remover
              </button>
            )}
          </div>
        )}
      </div>

      {erro && <p className="mt-2 text-[13px] text-red-300">{erro}</p>}
    </div>
  )
}
