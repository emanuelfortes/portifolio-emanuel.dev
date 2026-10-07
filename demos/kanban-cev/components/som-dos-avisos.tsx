'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import clsx from 'clsx'
import { SONS_DE_AVISO, SOM_NENHUM, type SomDeAviso } from '@/demos/kanban-cev/shared'
import { ApiError } from '@/demos/kanban-cev/lib/api'
import { useDefinirSons } from '@/demos/kanban-cev/lib/hooks'
import { tocarSom } from '@/demos/kanban-cev/lib/sons'
import { inputClass } from '@/demos/kanban-cev/components/ui'

/**
 * A escolha do som de cada aviso de peça: um para quando chega "revise",
 * outro para quando chega "ajuste".
 *
 * Salva na hora que muda, como o véu do fundo: é uma preferência, não um
 * formulário. E toca ao escolher: a pessoa ouve o que acabou de escolher, e o
 * clique no select é o gesto que o navegador exige para deixar tocar.
 */
export function SomDosAvisos({
  userId,
  revisar,
  ajustar,
}: {
  userId: string
  revisar: SomDeAviso
  ajustar: SomDeAviso
}) {
  const definir = useDefinirSons(userId)
  const [erro, setErro] = useState<string | null>(null)

  async function trocar(campo: 'somRevisar' | 'somAjustar', valor: SomDeAviso) {
    setErro(null)
    tocarSom(valor)
    try {
      await definir.mutateAsync({ [campo]: valor })
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : 'Não foi possível salvar')
    }
  }

  return (
    <div className="space-y-4">
      <Linha
        rotulo="Quando uma peça chega para eu revisar"
        descricao="Alguém da equipe marcou uma peça de um cronograma seu."
        valor={revisar}
        onChange={(v) => trocar('somRevisar', v)}
      />
      <Linha
        rotulo="Quando uma peça minha volta para ajuste"
        descricao="Quem coordena reprovou uma peça sua, com o motivo."
        valor={ajustar}
        onChange={(v) => trocar('somAjustar', v)}
      />

      {erro && <p className="rounded-lg bg-red-500/15 px-3 py-2 text-[12.5px] text-red-200">{erro}</p>}

      <p className="text-[11.5px] leading-snug text-ink-500">
        O som toca quando o aviso chega com o sistema aberto. O navegador só toca depois de você
        clicar em algo na página, então logo depois de abrir ele pode ficar mudo uma vez.
      </p>
    </div>
  )
}

function Linha({
  rotulo,
  descricao,
  valor,
  onChange,
}: {
  rotulo: string
  descricao: string
  valor: SomDeAviso
  onChange: (v: SomDeAviso) => void
}) {
  return (
    <div>
      <p className="text-[13px] font-medium text-ink-900">{rotulo}</p>
      <p className="mb-1.5 text-[11.5px] text-ink-500">{descricao}</p>
      <div className="flex items-center gap-2">
        <select
          value={valor}
          onChange={(e) => onChange(e.target.value as SomDeAviso)}
          className={clsx(inputClass, 'flex-1')}
          aria-label={rotulo}
        >
          <option value={SOM_NENHUM}>Sem som</option>
          {SONS_DE_AVISO.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nome}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => tocarSom(valor)}
          disabled={valor === SOM_NENHUM}
          title="Ouvir"
          aria-label="Ouvir"
          className="rounded-lg p-2 text-ink-500 ring-1 ring-inset ring-overlay/10 transition hover:bg-overlay/10 hover:text-ink-900 disabled:opacity-40"
        >
          <Play className="size-4" />
        </button>
      </div>
    </div>
  )
}
