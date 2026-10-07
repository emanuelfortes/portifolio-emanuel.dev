/**
 * Infográfico "a diferença está nas margens" (espaço home-02 de content/paginas/home.md).
 *
 * Desenho em SVG inline em vez de foto: acompanha as cores do site, fica nítido
 * em qualquer tela e pesa quase nada. Só os anéis são SVG; os rótulos e os
 * números são texto de verdade, na mesma tipografia do resto da página — numa
 * coluna de ~290px, texto dentro do SVG sairia com metade do tamanho.
 *
 * Leitura: a peça removida vista de baixo, com o anel da margem em volta. Na
 * cirurgia convencional o laboratório corta a peça em fatias e examina só os
 * cortes — os trechos dourados, uma fração do anel. Na Mohs, o cirurgião examina
 * o anel inteiro, no mesmo dia.
 */

const LEGENDA = "Comparação entre cirurgia convencional e cirurgia de Mohs na análise das margens";

/** Onde cada corte vertical encosta no anel: dois trechos por corte. */
const CORTES = [-28, 0, 28];
const R = 54;
const ABERTURA = 0.1;

export default function MargensInfografico({ alt }: { alt?: string }) {
  return (
    <figure className="not-prose border border-navy bg-paper" role="img" aria-label={alt ?? LEGENDA}>
      <div className="grid grid-cols-2 divide-x divide-line">
        <Painel titulo="Cirurgia convencional" numero="~1%" cor="text-gold">
          <circle cx="80" cy="80" r="48" fill="var(--color-navy-50)" />
          {CORTES.map((dx) => (
            <line
              key={dx}
              x1={80 + dx}
              y1="24"
              x2={80 + dx}
              y2="136"
              stroke="var(--color-navy-300)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          ))}
          <circle cx="80" cy="80" r="18" fill="var(--color-navy-800)" />
          <circle cx="80" cy="80" r={R} fill="none" stroke="var(--color-navy-100)" strokeWidth="11" />
          {CORTES.map((dx) => {
            const a = Math.asin(dx / R);
            return (
              <g key={dx}>
                <Arco meio={-Math.PI / 2 + a} />
                <Arco meio={Math.PI / 2 - a} />
              </g>
            );
          })}
        </Painel>

        <Painel titulo="Cirurgia de Mohs" numero="100%" cor="text-teal">
          <circle cx="80" cy="80" r="48" fill="var(--color-navy-50)" />
          <circle cx="80" cy="80" r="18" fill="var(--color-navy-800)" />
          <circle cx="80" cy="80" r={R} fill="none" stroke="var(--color-teal)" strokeWidth="11" />
        </Painel>
      </div>
      <figcaption className="border-t border-line px-4 py-2.5 text-[11px] leading-snug text-muted">{LEGENDA}</figcaption>
    </figure>
  );
}

/** Metade do desenho: rótulo, anel e o número da margem examinada. */
function Painel({
  titulo,
  numero,
  cor,
  children,
}: {
  titulo: string;
  numero: string;
  cor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-3 pb-4 pt-4 text-center">
      <p className="text-[10px] font-bold uppercase leading-tight tracking-[0.8px] text-navy-700">{titulo}</p>
      <svg viewBox="0 0 160 160" className="mx-auto mt-3 block h-auto w-full max-w-[150px]" aria-hidden="true" focusable="false">
        {children}
      </svg>
      <p className={`mt-3 font-display text-[30px] leading-none ${cor}`}>{numero}</p>
      <p className="mt-1.5 text-[11px] leading-snug text-muted">da margem examinada</p>
    </div>
  );
}

/** Trecho do anel alcançado por um corte. */
function Arco({ meio }: { meio: number }) {
  const p = (ang: number) => `${(80 + R * Math.cos(ang)).toFixed(2)} ${(80 + R * Math.sin(ang)).toFixed(2)}`;
  return (
    <path
      d={`M ${p(meio - ABERTURA)} A ${R} ${R} 0 0 1 ${p(meio + ABERTURA)}`}
      fill="none"
      stroke="var(--color-gold)"
      strokeWidth="11"
    />
  );
}
