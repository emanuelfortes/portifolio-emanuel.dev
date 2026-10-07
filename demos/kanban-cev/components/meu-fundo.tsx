'use client'

import { useEffect, useState } from 'react'
import { enviarLocal } from '@/demos/kanban-cev/lib/upload'
import { ImagePlus, Trash2 } from 'lucide-react'
import { PREVIEWABLE_IMAGE_MIME } from '@/demos/kanban-cev/shared'
import { api, ApiError } from '@/demos/kanban-cev/lib/api'
import { Spinner } from '@/demos/kanban-cev/components/ui'
import { salvarFundo } from '@/demos/kanban-cev/lib/fundo'

/** O mesmo teto do backend. Papel de parede cobre a tela: cabe mais que avatar. */
const MAX_FUNDO_BYTES = 12 * 1024 * 1024

/**
 * Papel de parede da pessoa.
 *
 * Os três passos são os do anexo e os da foto de perfil: pede a URL assinada,
 * manda o arquivo direto ao S3, confirma. O arquivo não passa pela API.
 *
 * O que este componente tem de diferente é o VÉU. Sem ele o recurso não se
 * sustenta: a interface é densa e o texto fica direto sobre este fundo, então
 * uma foto clara apagaria as letras do tema escuro. O véu é pintado na cor do
 * tema ativo, então a mesma imagem serve aos dois — e como quem regula vê o
 * efeito na hora, na tela inteira e não numa miniatura, a régua do que está
 * legível é a própria tela.
 */
export function MeuFundo({
  userId,
  urlAtual,
  veuAtual,
  posXAtual,
  posYAtual,
  onTrocou,
}: {
  userId: string
  urlAtual: string | null
  veuAtual: number
  posXAtual: number
  posYAtual: number
  onTrocou: () => void
}) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [veu, setVeu] = useState(veuAtual)
  const [posX, setPosX] = useState(posXAtual)
  const [posY, setPosY] = useState(posYAtual)
  /**
   * A URL já vem versionada da API (`?v=<hash da chave>`), então trocar a
   * imagem troca o endereço e o cache de 50 minutos não entrega a antiga.
   * Nada de sufixo inventado aqui: o servidor é quem sabe quando mudou.
   */
  const src = urlAtual

  /**
   * Arrastar a régua repinta o fundo na hora, antes de qualquer requisição.
   *
   * Sem isso a pessoa arrastaria às cegas e só veria o resultado depois de o
   * servidor responder — que é justamente o momento em que ela já soltou o
   * controle no lugar errado. A gravação vem depois, ao soltar.
   */
  useEffect(() => {
    if (!src) return
    const raiz = document.documentElement.style
    raiz.setProperty('--bg-veu', String(veu / 100))
    raiz.setProperty('--bg-posicao', `${posX}% ${posY}%`)
  }, [veu, posX, posY, src])

  async function aoEscolher(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // permite reenviar o mesmo arquivo depois de um erro
    if (!file) return

    setErro(null)
    if (!(PREVIEWABLE_IMAGE_MIME as readonly string[]).includes(file.type)) {
      setErro('O fundo precisa ser uma imagem (PNG, JPEG, WebP ou GIF)')
      return
    }
    if (file.size > MAX_FUNDO_BYTES) {
      setErro(`A imagem precisa ter até ${MAX_FUNDO_BYTES / 1024 / 1024} MB`)
      return
    }

    setEnviando(true)
    try {
      const assinatura = await api.post<{ uploadUrl: string; fileKey: string }>(
        `/users/${userId}/fundo/sign`,
        { fileName: file.name, mimeType: file.type, fileSize: file.size },
      )

      // Sem `credentials`: o cookie de sessão não pode ir para a Amazon.
      const envio = await enviarLocal(assinatura.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'content-type': file.type },
      })
      if (!envio.ok) throw new Error('Falha ao enviar a imagem')

      /**
       * Imagem nova volta ao enquadramento centrado.
       *
       * Herdar o ajuste da foto anterior é quase sempre errado: o
       * enquadramento foi escolhido para AQUELA composição, e aplicá-lo a
       * outra imagem entrega um recorte torto que ninguém pediu — pior ainda
       * quando a nova é deitada e a antiga era em pé.
       */
      const salvo = await api.put<{ fundoUrl: string }>(`/users/${userId}/fundo`, {
        fileKey: assinatura.fileKey,
        veu,
        posX: 50,
        posY: 50,
      })

      setPosX(50)
      setPosY(50)
      salvarFundo({ url: salvo.fundoUrl, veu, posX: 50, posY: 50 })
      onTrocou()
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível enviar')
    } finally {
      setEnviando(false)
    }
  }

  /**
   * Gravado ao SOLTAR a régua, não a cada pixel: seriam dezenas de PUTs.
   *
   * Manda os três juntos porque o arrasto já repintou a tela com todos eles —
   * gravar só o que mudou deixaria o banco discordando do que está à mostra
   * se duas réguas fossem mexidas antes de a primeira terminar de salvar.
   */
  async function gravarAjustes(forcado?: { posX: number; posY: number }) {
    if (!src) return

    /**
     * Os valores vêm por parâmetro quando quem chama acabou de mudá-los.
     *
     * "Centralizar" chama `setPosX` e grava em seguida: sem o parâmetro, esta
     * função ainda enxerga o `posX` DESTE render — o estado velho —, e
     * gravaria a posição antiga sobre a que a tela acabou de mostrar.
     */
    const x = forcado?.posX ?? posX
    const y = forcado?.posY ?? posY

    if (veu === veuAtual && x === posXAtual && y === posYAtual) return
    try {
      await api.put(`/users/${userId}/fundo`, { veu, posX: x, posY: y })
      salvarFundo({ url: src, veu, posX: x, posY: y })
      onTrocou()
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível salvar')
    }
  }

  async function remover() {
    setEnviando(true)
    setErro(null)
    try {
      await api.delete(`/users/${userId}/fundo`)
      salvarFundo(null)
      onTrocou()
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível remover')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div>
      <label
        className="relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl ring-1 ring-inset ring-overlay/12 transition hover:ring-overlay/25"
        title={src ? 'Trocar o fundo' : 'Enviar uma imagem'}
        /* A miniatura acompanha o enquadramento. Ela tem outra proporção, então
           o recorte não é o mesmo da tela — mas deixá-la parada enquanto o
           fundo se move seria pior: pareceria que a régua não pegou. */
        style={
          src
            ? {
                backgroundImage: `url("${src}")`,
                backgroundSize: 'cover',
                backgroundPosition: `${posX}% ${posY}%`,
              }
            : undefined
        }
      >
        {!src && (
          <div className="flex flex-col items-center gap-1.5 text-ink-400">
            <ImagePlus className="size-6" />
            <span className="text-[13px]">Enviar uma imagem</span>
          </div>
        )}

        {src && (
          <span className="absolute inset-0 flex items-center justify-center bg-pine-950/55 text-[13px] font-medium text-white opacity-0 transition hover:opacity-100">
            {enviando ? <Spinner /> : 'Trocar o fundo'}
          </span>
        )}

        {enviando && !src && <Spinner />}

        <input
          type="file"
          accept={PREVIEWABLE_IMAGE_MIME.join(',')}
          className="hidden"
          onChange={aoEscolher}
          disabled={enviando}
        />
      </label>

      {src ? (
        <>
          <div className="mt-4">
            <div className="mb-1.5 flex items-baseline justify-between">
              <label htmlFor="veu" className="text-[13px] font-medium text-ink-800">
                Suavizar o fundo
              </label>
              <span className="text-[12px] tabular-nums text-ink-500">{veu}%</span>
            </div>
            <input
              id="veu"
              type="range"
              min={0}
              max={100}
              value={veu}
              onChange={(e) => setVeu(Number(e.target.value))}
              onPointerUp={() => gravarAjustes()}
              onKeyUp={() => gravarAjustes()}
              className="w-full accent-brand-500"
            />
            {/* A régua age na tela inteira, ao vivo. O texto explica por que ela
                existe — senão parece só um controle de gosto. */}
            <p className="mt-1.5 text-[12px] text-ink-400">
              Quanto mais alto, mais o fundo recua e mais legível fica o texto. O ajuste
              acompanha o tema: escurece no escuro, clareia no claro.
            </p>
          </div>

          {/**
           * Enquadramento.
           *
           * O fundo é recortado com `cover`: a imagem é ampliada até cobrir a
           * tela, e um dos eixos sempre sobra cortado. Numa foto em pé o corte
           * come o topo e a base, e o assunto raramente está no meio exato.
           *
           * O ajuste vale na TELA, não na miniatura acima. A prévia tem outra
           * proporção, então mostrar o corte nela seria mentira: o que se vê
           * ali não é o que a tela vai mostrar. Por isso as réguas repintam o
           * fundo de verdade enquanto se arrasta, como a do véu.
           */}
          <div className="mt-4">
            <p className="mb-2 text-[13px] font-medium text-ink-800">Enquadramento</p>

            <div className="space-y-2.5">
              <div>
                <div className="mb-1 flex items-baseline justify-between">
                  <label htmlFor="posY" className="text-[12px] text-ink-500">
                    Vertical
                  </label>
                  <span className="text-[12px] tabular-nums text-ink-400">
                    {posY === 0 ? 'topo' : posY === 100 ? 'base' : `${posY}%`}
                  </span>
                </div>
                <input
                  id="posY"
                  type="range"
                  min={0}
                  max={100}
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  onPointerUp={() => gravarAjustes()}
                  onKeyUp={() => gravarAjustes()}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="mb-1 flex items-baseline justify-between">
                  <label htmlFor="posX" className="text-[12px] text-ink-500">
                    Horizontal
                  </label>
                  <span className="text-[12px] tabular-nums text-ink-400">
                    {posX === 0 ? 'esquerda' : posX === 100 ? 'direita' : `${posX}%`}
                  </span>
                </div>
                <input
                  id="posX"
                  type="range"
                  min={0}
                  max={100}
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  onPointerUp={() => gravarAjustes()}
                  onKeyUp={() => gravarAjustes()}
                  className="w-full accent-brand-500"
                />
              </div>
            </div>

            <p className="mt-1.5 text-[12px] text-ink-400">
              A imagem é ampliada até cobrir a tela, então sobra sempre um lado cortado.
              Estas réguas escolhem qual parte fica à mostra — olhe a tela atrás desta
              janela, não a miniatura.
            </p>

            {(posX !== 50 || posY !== 50) && (
              <button
                type="button"
                onClick={() => {
                  setPosX(50)
                  setPosY(50)
                  gravarAjustes({ posX: 50, posY: 50 })
                }}
                className="mt-2 text-[12px] font-medium text-ink-500 transition hover:text-brand-500"
              >
                Centralizar
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={remover}
            disabled={enviando}
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-500 transition hover:text-red-300 disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
            Voltar ao fundo do tema
          </button>
        </>
      ) : (
        <p className="mt-2 text-[12px] text-ink-400">
          PNG, JPEG, WebP ou GIF, até 12 MB. Só você vê o seu fundo.
        </p>
      )}

      {erro && <p className="mt-2 text-[13px] text-red-300">{erro}</p>}
    </div>
  )
}
