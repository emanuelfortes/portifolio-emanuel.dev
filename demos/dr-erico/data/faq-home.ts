/**
 * faq-home.ts
 * ---------------------------------------------------------------------------
 * FAQ da home, focado em "urologista em Fortaleza": o que a especialidade faz,
 * onde encontrar e quando procurar.
 *
 * Por que na home: pelo item 5 do plano de recuperação, a home é a página
 * escolhida para o termo "urologista em fortaleza". Ela tinha destaques de
 * tratamento e prova social, mas nenhuma resposta às perguntas básicas de quem
 * está pesquisando a especialidade pela primeira vez.
 *
 * ── Sobre o schema ────────────────────────────────────────────────────────
 * Este conteúdo É marcado como FAQPage, ao contrário dos depoimentos. A
 * diferença: aqui o conteúdo é próprio e está visível na página, que são as
 * duas condições que o Google exige. Depoimento vindo do Google é conteúdo de
 * terceiro, e por isso não entra no JSON-LD. Ver data/depoimentos.ts.
 *
 * Vale a expectativa correta: o Google descontinuou o rich result de FAQ em
 * agosto de 2023 para praticamente todo mundo, então não espere sanfona no
 * resultado de busca. O ganho hoje é de extração por IA (AI Overviews,
 * ChatGPT, Perplexity) e de estrutura de conteúdo.
 *
 * O texto das respostas alimenta ao mesmo tempo a página e o JSON-LD, a partir
 * deste mesmo array, para que nunca divirjam.
 */

export type FaqItem = { q: string; a: string }

export const faqHome: FaqItem[] = [
  {
    q: 'O que faz um urologista?',
    a: 'O urologista cuida do trato urinário de homens e mulheres, que inclui rins, ureteres, bexiga e uretra, e também do sistema reprodutor masculino, com próstata, testículos e pênis. Na prática, é o especialista para infecção urinária de repetição, cálculo renal, próstata aumentada, sangue na urina, incontinência, disfunção erétil, infertilidade masculina e câncer de rim, bexiga, próstata e testículo.',
  },
  {
    q: 'Onde encontrar um urologista em Fortaleza?',
    a: 'O Dr. Érico Diógenes atende em três endereços na cidade: no Pátio Dom Luís, na Av. Dom Luís 1200, sala 705, na Aldeota; na Pronutrir Oncologia, na R. Atilano de Moura 530, no Guararapes; e no Uno Medical & Office, na Av. Pontes Vieira 2340, no Dionísio Torres. O agendamento é feito pelo WhatsApp (85) 98178-1020 e pela página de contato do site.',
  },
  {
    q: 'Quando devo procurar um urologista?',
    a: 'Procure avaliação se notar ardência ou dor ao urinar, vontade frequente de urinar, jato fraco ou interrompido, levantar várias vezes à noite para urinar, sangue na urina ou no sêmen, dor lombar em cólica, caroço ou alteração nos testículos, dificuldade de ereção ou dificuldade para ter filhos. Sangue na urina e dor testicular súbita merecem avaliação sem esperar. Também existe a consulta preventiva, sem sintoma nenhum.',
  },
  {
    q: 'Urologista atende mulheres?',
    a: 'Sim. O trato urinário é o mesmo nos dois sexos, e o urologista trata mulheres em casos de infecção urinária de repetição, cálculo renal, incontinência urinária, bexiga hiperativa e tumores de rim e bexiga. A confusão vem do fato de a especialidade também cuidar do sistema reprodutor masculino, que é exclusivo dos homens.',
  },
  {
    q: 'A partir de que idade o homem deve consultar um urologista?',
    a: 'A primeira consulta pode acontecer ainda na adolescência ou no início da vida adulta, com foco em avaliação testicular, saúde sexual e orientação de autoexame. A avaliação voltada à próstata costuma começar aos 50 anos, ou aos 45 para quem tem histórico familiar de câncer de próstata ou é de população de maior risco. Idade e frequência devem ser definidas na consulta, caso a caso.',
  },
  {
    q: 'Qual a diferença entre urologista e nefrologista?',
    a: 'Os dois cuidam dos rins, por caminhos diferentes. O urologista é cirurgião e trata problemas estruturais, como cálculo renal, obstrução, tumores e malformações. O nefrologista é clínico e trata o funcionamento do rim, como insuficiência renal, doenças glomerulares e acompanhamento de diálise. É comum os dois atuarem juntos no mesmo paciente.',
  },
  {
    q: 'Como saber se o urologista é realmente especialista?',
    a: 'Além do CRM, que todo médico tem, procure o RQE, o Registro de Qualificação de Especialista. É o número que confirma no Conselho Federal de Medicina que aquele profissional é registrado como urologista. Você consulta de graça no portal do CFM, buscando por nome ou CRM. O Dr. Érico Diógenes é CRM-CE 9540 · RQE 6232.',
  },
]
