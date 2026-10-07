/**
 * depoimentos.ts
 * ---------------------------------------------------------------------------
 * PLANO DE RECUPERAÇÃO · ITEM 14 · Levar depoimentos para a home.
 *
 * Avaliações reais do perfil do Google do Dr. Érico Diógenes, transcritas
 * manualmente em 16/09/2026 a partir do próprio perfil.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ NÃO MARCAR ESTES DADOS COMO Review OU aggregateRating NO JSON-LD.       │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * As diretrizes do Google proíbem marcação de avaliações vindas de terceiros,
 * e avaliação que o próprio negócio publica sobre si mesmo não é elegível para
 * LocalBusiness ou Organization. Em conteúdo médico isso é risco de ação
 * manual sobre a entidade inteira, não só sobre a página.
 *
 * O site holep.drericodiogenes.com.br já erra exatamente nisso: declara
 * aggregateRating de 5,0 com 40 avaliações, número que não corresponde ao
 * perfil real. Ver docs/plano-recuperacao-dev.md.
 *
 * Aqui os depoimentos entram como CONTEÚDO VISUAL, com atribuição e link para
 * o perfil, e nada no schema.
 *
 * ── Sobre as datas ────────────────────────────────────────────────────────
 * O Google exibe data relativa ("4 meses atrás"). Transcrever assim
 * congelaria uma informação que envelhece: em dois meses estaria errada.
 * Por isso foram convertidas para mês e ano absolutos, calculados a partir da
 * data da captura.
 *
 * ── Quando isto deixa de valer ────────────────────────────────────────────
 * Esta lista é um retrato estático e não se atualiza sozinha. O item 17 do
 * plano prevê 15 a 20 avaliações novas por mês, então ela envelhece rápido.
 * A solução definitiva é a integração ao vivo com a Places API, que hoje está
 * quebrada no repositório dr-erico-holep. Enquanto ela não volta, revisar esta
 * lista a cada trimestre.
 */

export type Depoimento = {
  /** Nome como aparece no perfil do Google. */
  autor: string
  /** Nota em estrelas, de 1 a 5. */
  nota: number
  /** Mês e ano da publicação, já convertido da data relativa do Google. */
  quando: string
  /** Contexto do avaliador, como o Google exibe. Ex: "Local Guide · 23 avaliações". */
  perfil: string
  texto: string
}

/** Place ID do perfil do Dr. Érico Diógenes no Google Maps. */
export const GOOGLE_PLACE_ID = 'ChIJ-RHmBn5IxwcRyI2kNHjMWKA'

/** Link canônico para o perfil, usado na atribuição obrigatória. */
export const GOOGLE_PERFIL_URL = `https://www.google.com/maps/place/?q=place_id:${GOOGLE_PLACE_ID}`

export const depoimentos: Depoimento[] = [
  {
    autor: 'Odnan Feitosa',
    nota: 5,
    quando: 'julho de 2026',
    perfil: 'Local Guide · 23 avaliações',
    texto:
      'Dr. Erico Diogenes é um excelente profissional, top 1 de Fortaleza, me consultou com muita atenção e foi muito preciso no diagnóstico. Tinha sofrido um acidente de moto e ele me atendeu super bem e hoje 100% melhor. Recomendo sem medo.',
  },
  {
    autor: 'Hyan Pereira da Silva',
    nota: 5,
    quando: 'maio de 2026',
    perfil: '1 avaliação',
    texto:
      'Quero deixar registrado o quanto o Dr. Erico foi extraordinário em todo o processo da cirurgia do meu pai. Um profissional altamente gabaritado e capacitado, desde a primeira consulta até o pós-operatório. Em um momento tão delicado, contar com um profissional de tamanho know-how faz toda a diferença e é fundamental para transmitir segurança e confiança à família. Muito obrigado por toda dedicação, atenção e excelência. Parabéns pelo trabalho impecável!',
  },
  {
    autor: 'José Oliveira',
    nota: 5,
    quando: 'março de 2026',
    perfil: '10 avaliações',
    texto:
      'Sou atendido pelo Dr. Érico há algum tempo. Profissional super diferenciado. Competente, atencioso, dedicado e paciente. O ambiente do consultório é bem agradável e confortável. Pra complementar tem uma equipe de atendentes, começando pela Malu, que são excelentes, educadas e atenciosas. Recomendo muito!',
  },
  {
    autor: 'Reinaldo Pereira',
    nota: 5,
    quando: 'março de 2026',
    perfil: '2 avaliações',
    texto:
      'Dr. Érico é um profissional renomado e experiente, atencioso e humano, características que fazem toda a diferença pra quem busca ajuda muitas vezes com problemas de saúde que afetam seu psicológico. Fiz vários procedimentos de saúde com ele, cirurgia, exames de controle e diagnósticos, todos sempre bem sucedidos. Graças ao bom Deus temos o Dr. Érico pra nos cuidar.',
  },
  {
    autor: 'Alcids Jose',
    nota: 5,
    quando: 'março de 2026',
    perfil: '3 avaliações',
    texto:
      'Foi maravilhosa! O Dr. Erico é nota mil, super competente! Ele explica com grande categoria e conhecimento no assunto! A partir de hoje, sem sombra de dúvida, será o médico! Nota mil.',
  },
  {
    autor: 'Suzanne Grangeiro',
    nota: 5,
    quando: 'fevereiro de 2026',
    perfil: '1 avaliação',
    texto:
      'Dr. Érico é um médico excepcional, que alia competência, atenção e humanidade. Transmite confiança e cuidado em cada atendimento. Minha gratidão.',
  },
]
