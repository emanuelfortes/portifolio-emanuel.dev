import type { Noticia } from '@/demos/dr-erico/types/noticia'

/**
 * noticias.ts
 * ---------------------------------------------------------------------------
 * Conteúdo da seção /noticias.
 *
 * ── A regra que não se quebra ─────────────────────────────────────────────
 * O texto aqui é original. Nenhuma frase é copiada do veículo que publicou o
 * assunto primeiro. Conteúdo repetido de outro site tende a ficar como
 * "Rastreada, mas não indexada", e aí a notícia não só deixa de ranquear como
 * disputa com a matéria original em vez de reforçá-la.
 *
 * O que entra é a leitura do médico sobre o assunto, com o link para a origem.
 *
 * ── A outra regra ─────────────────────────────────────────────────────────
 * "Dr. Érico realizou mais uma cirurgia" é publicidade, não é notícia, nem
 * para o Google nem para o CFM (Resolução 2.336/2023). Notícia é o que
 * interessa ao paciente: um estudo novo, uma decisão regulatória, uma
 * campanha, uma tecnologia que chegou a Fortaleza, um alerta de saúde.
 *
 * Por isso as duas matérias de janeiro sobre o perfil profissional do médico,
 * que estão em /midias, não viraram notícia aqui: elas falam dele, não de um
 * assunto de saúde.
 *
 * ── Como publicar uma notícia nova ────────────────────────────────────────
 * 1. Acrescente um item ao array, com `fonte` preenchida e conferida
 * 2. `publishedAt` é a data de hoje, não a da matéria de origem
 * 3. A capa precisa de 1.200px de largura no mínimo, exigência do NewsArticle
 * 4. Linke para as páginas do site que tratam do tema: é o que faz a notícia
 *    trabalhar pelo resto do site, e não só por si
 * 5. `npm run build` e conferir
 */

const AUTOR = 'Dr. Érico Diógenes'

export const noticias: Noticia[] = [
  {
    id: 'n1',
    slug: 'prostatectomia-robotica-sus-planos-de-saude',
    title: 'Prostatectomia robótica entra no SUS e passa a ter cobertura obrigatória nos planos',
    excerpt:
      'A cirurgia robótica para câncer de próstata foi incorporada ao SUS e tornou-se o primeiro procedimento com robótica no rol obrigatório da ANS. O que isso muda, na prática, para quem precisa operar.',
    category: 'Cirurgia Robótica',
    categories: ['Cirurgia Robótica', 'Próstata'],
    coverImage: '/demos/dr-erico/img/post/imgid01_01.webp',
    image2: '/demos/dr-erico/img/post/imgid19_01.webp',
    author: AUTOR,
    publishedAt: '2026-10-02',
    readingTime: 5,
    metaTitle: 'Prostatectomia robótica no SUS e nos planos: o que muda | Dr. Érico Diógenes',
    metaDescription:
      'A prostatectomia robótica foi incorporada ao SUS e entrou no rol obrigatório da ANS. Urologista em Fortaleza explica indicações, benefícios e os desafios da implementação.',
    fonte: {
      veiculo: 'Cacto Mídia',
      url: 'https://cactomidia.com.br/prostatectomia-robotica-passa-a-integrar-sus-e-planos-de-saude-e-amplia-acesso-a-tratamento-avancado-no-brasil/',
      data: 'abril de 2026',
    },
    content: `A prostatectomia radical assistida por robô passou a integrar o Sistema Único de Saúde e, no mesmo movimento, tornou-se o primeiro procedimento cirúrgico com uso de robótica a entrar no rol de cobertura obrigatória da Agência Nacional de Saúde Suplementar. São duas decisões distintas, de órgãos distintos, que juntas mudam quem pode chegar a essa técnica no Brasil.

A incorporação ao SUS veio após recomendação da Comissão Nacional de Incorporação de Tecnologias (Conitec) e foi formalizada pelo Ministério da Saúde em 2025. A cobertura obrigatória nos planos, decidida pela ANS, passou a valer em 2026.

## O que muda na prática

Até aqui, a cirurgia robótica para câncer de próstata estava concentrada em poucos centros privados. Quem não tinha plano com cobertura específica, ou não podia pagar do próprio bolso, simplesmente não acessava a técnica, mesmo tendo indicação clínica para ela.

Com as duas decisões, o cenário passa a ser:

- **No SUS**, hospitais públicos habilitados podem oferecer o procedimento a pacientes com indicação, especialmente em câncer de próstata localizado ou localmente avançado
- **Nos planos de saúde**, o beneficiário passa a ter direito ao tratamento quando houver indicação médica, sem depender de negociação caso a caso

É uma mudança de patamar no acesso. Antes, esse tipo de procedimento ficava restrito a poucos centros privados. Com a inclusão no SUS e a obrigatoriedade nos planos, dá-se um passo relevante para democratizar o acesso à inovação.

## Por que a técnica importa no câncer de próstata

A próstata fica numa região anatômica difícil, cercada por estruturas que respondem por duas funções que o paciente leva para o resto da vida: o controle urinário e a função sexual. A qualidade da dissecção nessa área não é detalhe técnico, é o que separa um bom resultado de um resultado que o paciente vai sentir todos os dias.

A cirurgia robótica oferece maior precisão ao cirurgião, e isso se traduz em menor trauma cirúrgico, menos sangramento e recuperação mais rápida. A tecnologia também contribui para melhores taxas de preservação da continência urinária e da função sexual.

Vale separar o que é da máquina e o que é de quem opera. O robô não opera sozinho: ele é comandado pelo cirurgião, de um console, com visão tridimensional e instrumentos que articulam em ângulos que a mão humana não alcança dentro do abdome. O ganho vem da soma entre a ferramenta e a experiência de quem a usa.

Quem quiser entender o passo a passo do procedimento encontra isso em [como funciona a cirurgia robótica de próstata na prática](/blog/cirurgia-robotica-prostata-como-funciona-na-pratica), e a comparação técnica com a via anterior está em [cirurgia robótica x laparoscopia](/blog/cirurgia-robotica-x-laparoscopia).

## O que ainda falta

A decisão regulatória é o começo, não o fim. Ainda é necessário investir em infraestrutura, aquisição de equipamentos e capacitação de equipes. A tecnologia por si só não resolve: é preciso garantir que ela chegue de forma estruturada à população.

Um robô cirúrgico exige uma equipe treinada em torno dele — cirurgião, instrumentador, anestesista, enfermagem — e uma curva de aprendizado que não se cumpre em semanas. Hospital que recebe o equipamento sem ter a equipe formada não entrega o resultado que a técnica promete.

## Para o paciente, o que fazer com essa informação

Duas coisas, e nenhuma delas é pedir o robô.

A primeira é saber que a indicação continua sendo individual. Estágio do tumor, idade, condições clínicas e a estratégia definida pela equipe determinam qual via é a melhor para cada caso. Há situações em que a cirurgia robótica é a escolha certa, e há situações em que não é.

A segunda é que o acesso deixou de ser um argumento de exclusão. Se há indicação clínica, o caminho existe, no SUS e no plano. Saber disso muda a conversa no consultório.

Mais sobre a técnica e suas aplicações em [cirurgia robótica de próstata](/tratamentos/cirurgia-robotica/prostata).`,
  },

  {
    id: 'n2',
    slug: 'aumento-diagnosticos-cancer-prostata-prevencao',
    title: 'Diagnósticos de câncer de próstata crescem e o rastreamento volta ao centro da conversa',
    excerpt:
      'O aumento no número de diagnósticos tem uma explicação que não é má notícia: exames adiados na pandemia foram retomados. O que isso diz sobre prevenção e sobre a hora certa de procurar o urologista.',
    category: 'Próstata',
    categories: ['Próstata', 'Urologia Preventiva'],
    coverImage: '/demos/dr-erico/img/post/imgid16_02.webp',
    image2: '/demos/dr-erico/img/post/imgid15_01.webp',
    author: AUTOR,
    publishedAt: '2026-10-02',
    readingTime: 5,
    metaTitle: 'Aumento de diagnósticos de câncer de próstata: o que explica | Dr. Érico Diógenes',
    metaDescription:
      'Diagnósticos de câncer de próstata aumentaram com a retomada dos exames de rotina. Urologista em Fortaleza explica o que muda na prevenção e quando procurar atendimento.',
    fonte: {
      veiculo: 'Repórter Ceará',
      url: 'https://reporterceara.com.br/2026/01/07/aumento-de-diagnosticos-de-cancer-de-prostata-reforca-importancia-da-prevencao-e-do-acesso-a-tratamentos-modernos/',
      data: 'janeiro de 2026',
    },
    content: `O câncer de próstata segue como o tipo de câncer mais comum entre homens no Brasil, excluídos os de pele não melanoma. Nos últimos anos, especialistas têm observado um aumento no número de diagnósticos — e esse dado, lido sozinho, assusta mais do que deveria.

## Por que o número subiu

A explicação mais provável não é que a doença ficou mais frequente. É que os exames de rotina, adiados durante a pandemia, foram retomados.

Quando uma população inteira deixa de fazer rastreamento por dois anos e depois volta, o que aparece é um represamento: casos que existiam e não estavam diagnosticados entram na estatística de uma vez. Some-se a isso a maior conscientização da população masculina, que levou mais homens ao consultório.

A ampliação do rastreamento e essa maior conscientização têm contribuído para identificar a doença em estágios iniciais, o que aumenta de forma significativa as chances de sucesso no tratamento. Em outras palavras: mais diagnósticos, nesse contexto, é sinal de que o sistema está funcionando melhor, não pior.

## O que continua valendo

Nenhuma tecnologia nova substituiu o básico. O exame de PSA e o toque retal continuam sendo fundamentais, e se complementam — um não dispensa o outro.

| Quem | Quando começar |
|---|---|
| Homens em geral | A partir dos 50 anos |
| Histórico familiar de câncer de próstata | A partir dos 45 anos |
| Homens negros | A partir dos 45 anos |

O histórico familiar e a origem étnica antecipam o início do rastreamento porque elevam o risco. Quem tem pai ou irmão com diagnóstico da doença não está no mesmo ponto de partida de quem não tem.

Vale dizer o que o PSA é e o que ele não é: um marcador, não um diagnóstico. PSA alterado não significa câncer, e PSA normal não descarta por completo. O resultado se interpreta junto com o exame físico, a idade, o volume da próstata e a velocidade de variação ao longo do tempo. Esse detalhamento está em [check-up urológico](/blog/check-up-urologico).

## Quando procurar, sem esperar sintoma

Este é o ponto que mais gera confusão. O câncer de próstata em fase inicial costuma não dar sintoma nenhum. Quando aparece dificuldade para urinar, jato fraco ou dor, com frequência a causa é outra — o crescimento benigno da próstata, por exemplo —, e quando é o câncer, já não é mais fase inicial.

Esperar o sintoma para procurar o urologista é, portanto, perder exatamente a janela em que o tratamento tem mais chance. [Quando ir ao urologista pela primeira vez](/blog/quando-ir-ao-urologista) trata disso com mais calma.

## O tratamento também mudou

Em paralelo à prevenção, os avanços tecnológicos vêm transformando o tratamento. Entre eles, a cirurgia robótica, indicada em casos específicos, permite maior precisão durante o procedimento, melhor visualização das estruturas anatômicas e menor agressão aos tecidos. Os benefícios associados incluem menor sangramento, menos dor no pós-operatório, recuperação mais rápida e menor risco de complicações como incontinência urinária e disfunção erétil.

Mas a indicação do tratamento deve ser individualizada, considerando o estágio da doença, a idade e as condições clínicas de cada paciente. Não existe tratamento melhor em abstrato: existe o melhor para aquele caso.

## O tabu ainda custa caro

Ampliar o debate sobre o câncer de próstata é fundamental para quebrar tabus e estimular o autocuidado masculino. O homem que adia a consulta por constrangimento com o toque retal está trocando trinta segundos de desconforto por um risco que não precisa correr.

Informação e acesso a tecnologias avançadas desempenham papel essencial no enfrentamento da doença — mas o primeiro passo continua sendo marcar a consulta.

Mais sobre tumores urológicos e suas abordagens em [uro-oncologia](/condicoes-urologicas/uro-oncologia).`,
  },

  {
    id: 'n3',
    slug: 'cirurgia-robotica-cancer-rim-bexiga',
    title: 'Cirurgia robótica amplia caminhos no tratamento de câncer de rim e de bexiga',
    excerpt:
      'A técnica deixou de ser assunto só de próstata. Em tumores renais e vesicais, a precisão da dissecção muda o que é possível preservar — e isso tem consequência direta na vida do paciente.',
    category: 'Cirurgia Robótica',
    categories: ['Cirurgia Robótica'],
    coverImage: '/demos/dr-erico/img/post/imgid19_02.webp',
    image2: '/demos/dr-erico/img/post/imgid10_02.webp',
    author: AUTOR,
    publishedAt: '2026-10-02',
    readingTime: 5,
    metaTitle: 'Cirurgia robótica em câncer de rim e bexiga | Dr. Érico Diógenes',
    metaDescription:
      'Cirurgia robótica no tratamento de tumores renais e vesicais: o que a técnica permite, quais os benefícios e como se define a indicação. Urologista em Fortaleza.',
    fonte: {
      veiculo: 'ACEV News',
      url: 'https://acevnews.com/post/tecnologia-robotica-ganha-protagonismo-na-urologia-e-oferece-novos-caminhos-para-pacientes-com-cancer-explica-o-urologista-dr-erico-diogenes',
      data: 'julho de 2026',
    },
    content: `Quando se fala em cirurgia robótica na urologia, a próstata domina a conversa. Mas a técnica vem ampliando as possibilidades de tratamento para tumores urológicos de forma mais ampla, em especial nos casos de câncer de rim e de bexiga.

## O que a técnica é, tecnicamente

A cirurgia robótica é considerada uma evolução da laparoscopia, não uma categoria à parte. Ela usa braços robóticos controlados pelo cirurgião a partir de um console, com visão tridimensional e movimentos articulados que ampliam o alcance técnico dentro do campo operatório.

A diferença prática em relação à laparoscopia convencional está em dois pontos:

- **A visão.** Tridimensional e ampliada, contra a imagem bidimensional da laparoscopia
- **O punho.** Os instrumentos articulam dentro do paciente, reproduzindo o movimento do punho do cirurgião; na laparoscopia, as pinças são rígidas e o movimento é limitado

Isso possibilita dissecações mais delicadas e a preservação de estruturas importantes, quando há indicação clínica para preservá-las.

## Por que isso pesa mais no rim

No câncer renal, existe uma decisão que define o resto da vida do paciente: retirar o rim inteiro ou retirar apenas o tumor, preservando o órgão.

A segunda opção, a nefrectomia parcial, exige dissecar o tumor com margem adequada numa estrutura ricamente vascularizada, e em geral com o fluxo sanguíneo interrompido durante parte do procedimento. É uma cirurgia em que precisão e tempo contam ao mesmo tempo.

Quanto mais fina a dissecção possível, mais casos se tornam candidatos à preservação. Preservar função renal importa — e importa mais ainda em quem já tem função comprometida, diabetes ou hipertensão.

## No câncer de bexiga

Nos tumores vesicais que exigem a retirada da bexiga, o procedimento envolve ainda a reconstrução do trânsito urinário, uma das cirurgias mais complexas da urologia. A qualidade da dissecção pélvica e da reconstrução se reflete direto no resultado funcional.

Os benefícios associados à via robótica nesses procedimentos são os mesmos descritos na literatura para cirurgia minimamente invasiva: menor perda sanguínea, redução do tempo de internação e recuperação pós-operatória mais rápida, além de menos dor no período de recuperação, em comparação com a cirurgia aberta tradicional.

Mais sobre as particularidades desse tumor em [câncer de bexiga](/condicoes-urologicas/uro-oncologia/cancer-bexiga).

## O que decide a indicação

Nada disso significa que a via robótica seja sempre a escolha. A indicação do método depende da avaliação individual de cada paciente, considerando o estágio do tumor, as condições clínicas e a estratégia terapêutica definida pela equipe médica.

Há tumores em que a via aberta continua sendo a melhor decisão, e há pacientes cujas condições clínicas desaconselham o tempo cirúrgico mais longo que a montagem robótica pode exigir. A pergunta certa no consultório não é "dá para fazer com robô?", e sim "qual via oferece o melhor resultado oncológico e funcional no meu caso?".

## Onde o Nordeste entra nessa história

A difusão da técnica na região não aconteceu sozinha. Ela dependeu de equipes que se formaram, de hospitais que investiram em equipamento e de cirurgiões que fizeram a curva de aprendizado em procedimentos de alta complexidade voltados a tumores renais e vesicais.

É um dado relevante para o paciente do Ceará: tratamento que antes exigia deslocamento para o Sudeste passou a estar disponível mais perto.

O panorama completo dos tumores urológicos e das abordagens disponíveis está em [uro-oncologia](/condicoes-urologicas/uro-oncologia).`,
  },

  {
    id: 'n4',
    slug: 'tratamento-laser-prostata-ganha-espaco-brasil',
    title: 'Tratamento a laser para próstata aumentada ganha espaço e muda quem pode operar',
    excerpt:
      'A técnica a laser reduz o risco de sangramento e encurta o tempo de sonda. O ganho maior, porém, é outro: ela torna operável um grupo de pacientes que antes era considerado de risco alto demais.',
    category: 'Tratamento a Laser',
    categories: ['Tratamento a Laser', 'HoLEP', 'Próstata'],
    coverImage: '/demos/dr-erico/img/post/imgid18_02.webp',
    image2: '/demos/dr-erico/img/post/imgid12_01.webp',
    author: AUTOR,
    publishedAt: '2026-10-02',
    readingTime: 5,
    metaTitle: 'Laser para próstata aumentada: o que muda no tratamento | Dr. Érico Diógenes',
    metaDescription:
      'Técnicas a laser para hiperplasia prostática benigna: menor sangramento, menos tempo de sonda e indicação para próstatas de maior volume. Urologista em Fortaleza.',
    fonte: {
      veiculo: 'ACEV News',
      url: 'https://acevnews.com/post/tratamento-a-laser-para-crescimento-da-prostata-ganha-espaco-no-brasil-afirma-dr-erico-diogenes',
      data: 'março de 2026',
    },
    content: `O crescimento benigno da próstata, conhecido como hiperplasia prostática benigna (HPB), é uma das alterações urológicas mais comuns em homens acima dos 50 anos. Não é câncer, e isso precisa ficar claro logo no começo — mas atrapalha a vida.

Os sintomas são urinários e progressivos: jato fraco, aumento da frequência para urinar, levantar várias vezes à noite e a sensação de não esvaziar a bexiga por completo.

## Onde o laser entra

Entre as opções terapêuticas, os procedimentos a laser vêm ganhando espaço por oferecerem uma abordagem menos invasiva e com menor risco de sangramento. O método usa energia laser para remover ou vaporizar o tecido prostático aumentado, desobstruindo o canal urinário.

As técnicas a laser costumam proporcionar:

- **Tempo reduzido de sonda** no pós-operatório
- **Menor permanência hospitalar**
- **Recuperação funcional mais rápida**
- **Menor risco de sangramento** durante e depois do procedimento

Esse último item não é um detalhe de conforto. Ele é o que destrava o acesso de um grupo específico de pacientes.

## O que de fato muda: quem pode operar

A vantagem mais relevante das técnicas a laser não aparece na lista de benefícios imediatos. É a possibilidade de tratar casos que antes exigiriam cirurgia aberta.

Dois grupos se beneficiam de forma direta:

**Próstatas de grande volume.** Historicamente, acima de certo tamanho, a ressecção endoscópica convencional deixava de ser viável e a indicação passava a ser a cirurgia aberta, com internação mais longa e recuperação mais pesada. A enucleação a laser não tem esse teto de volume.

**Pacientes de maior risco cirúrgico.** Homens anticoagulados, com doença cardiovascular ou idade avançada enfrentavam uma conta difícil: suspender o anticoagulante para operar traz um risco, manter traz outro. O menor sangramento da técnica a laser muda os termos dessa conta.

A diferença entre as variações da técnica está em [THuLEP x HoLEP](/blog/thulep-vs-holep-diferencas), e a pergunta sobre segurança e riscos é tratada em [laser para próstata é seguro?](/blog/laser-para-prostata-e-seguro-quais-os-riscos).

## O que não muda

A escolha do tratamento depende da intensidade dos sintomas, do tamanho da próstata e das condições clínicas do paciente, sempre após avaliação urológica e exames específicos.

Nem todo homem com próstata aumentada precisa operar. Boa parte dos casos se controla com medicação, e há quem conviva bem com sintomas leves por anos. A cirurgia entra quando o sintoma compromete a rotina, quando o tratamento clínico falha, ou quando aparecem complicações — retenção urinária, infecções de repetição, comprometimento da função renal.

Sobre o que esperar depois do procedimento, incluindo prazos realistas, [recuperação do THuLEP](/blog/recuperacao-thulep-quanto-tempo-dura) traz o detalhamento.

## Sobre a adoção no Nordeste

A chegada dessas técnicas à região seguiu o padrão de toda tecnologia cirúrgica: depende menos do equipamento e mais de quem o opera. A enucleação prostática a laser tem curva de aprendizado reconhecidamente longa, e é essa curva, não a compra do aparelho, que determina quando um serviço passa a oferecer o procedimento com segurança.

O panorama da técnica e suas indicações está em [HoLEP](/holep).`,
  },

  {
    id: 'n5',
    slug: 'cirurgia-robotica-em-debate-na-tv',
    title: 'Cirurgia robótica em debate: as duas entrevistas e o que ficou de cada uma',
    excerpt:
      'Em julho e em setembro, o tema foi à TV em dois programas diferentes. Os pontos que mais geraram pergunta foram os mesmos nas duas conversas — e nenhum deles era sobre o robô.',
    category: 'Cirurgia Robótica',
    categories: ['Cirurgia Robótica'],
    coverImage: '/demos/dr-erico/img/dr-erico-foto-1.webp',
    image2: '/demos/dr-erico/img/post/imgid10_01.webp',
    author: AUTOR,
    publishedAt: '2026-10-02',
    readingTime: 4,
    metaTitle: 'Cirurgia robótica em debate na TV | Dr. Érico Diógenes',
    metaDescription:
      'Participações do urologista Dr. Érico Diógenes em dois programas de TV sobre cirurgia robótica, e os pontos que mais geraram dúvida do público.',
    fonte: {
      veiculo: 'ACEV News',
      url: 'https://acevnews.com/post/dr-erico-diogenes-urologista-pioneiro-em-cirurgia-robotica-participa-do-programa-questao-de-ordem-da-alece-tv',
      data: 'setembro de 2026',
    },
    content: `Em setembro, o programa Questão de Ordem, da Alece TV, apresentado por Renato Abreu, dedicou uma edição às cirurgias robóticas. Em julho, o tema já havia passado pelo Ponto de Vista, da TV Câmara Fortaleza. Dois programas, dois formatos, e um padrão que se repetiu: as perguntas do público não eram sobre a máquina.

## O que o público pergunta

Quando o assunto chega à TV, a expectativa de quem produz costuma ser a demonstração tecnológica — o robô, os braços, o console. Mas as perguntas que de fato aparecem são de outra ordem:

- Quem está operando, o médico ou o robô?
- Isso é para qualquer pessoa ou só para quem pode pagar?
- Dói menos mesmo, ou é marketing?
- Por que meu médico não indicou?

São perguntas boas. E a primeira delas é a que mais merece resposta direta.

## O robô não opera

A cirurgia robótica permite ao cirurgião maior controle dos movimentos, visão tridimensional ampliada e atuação em regiões delicadas com alta precisão. Mas ela associa tecnologia à experiência médica: não substitui uma pela outra.

O equipamento não toma decisão nenhuma. Ele não decide onde cortar, o que preservar, quando mudar de estratégia no meio do procedimento. Cada movimento vem do cirurgião, sentado a alguns metros, comandando os instrumentos a partir de um console.

O que a tecnologia faz é traduzir o movimento da mão com mais estabilidade e alcance do que a via aberta ou a laparoscopia permitem. O que ela não faz é cobrir despreparo.

## Sobre o acesso

A segunda pergunta mudou de resposta recentemente. Até pouco tempo, a cirurgia robótica estava concentrada em poucos centros privados. Com a incorporação da prostatectomia robótica ao SUS e a entrada no rol obrigatório da ANS, o quadro passou a ser outro — o que está detalhado em [prostatectomia robótica entra no SUS](/noticias/prostatectomia-robotica-sus-planos-de-saude).

## Sobre "por que meu médico não indicou"

Essa é a pergunta mais delicada, e a resposta honesta desagrada quem esperava ouvir que a técnica nova é sempre melhor.

A indicação depende do caso. Há tumores e condições clínicas em que outra via oferece resultado igual ou superior. Há situações em que o tempo cirúrgico mais longo da montagem robótica não compensa. E há, no caso da próstata aumentada por crescimento benigno, uma confusão frequente entre duas coisas diferentes: cirurgia robótica e cirurgia a laser tratam problemas distintos, e a comparação entre as opções para HPB está em [melhor tratamento para hiperplasia prostática benigna](/blog/melhor-tratamento-hiperplasia-prostatica-benigna-2026).

Levar o tema à TV serve exatamente para isso: esclarecer dúvida, não vender procedimento. Inovação contribui para tratamentos mais seguros quando o paciente entende o que está sendo proposto e por quê.

As demais participações na imprensa estão reunidas em [Dr. Érico na Mídia](/midias), e o panorama da técnica em [cirurgia robótica](/cirurgia-robotica).`,
  },
]

export function getNoticiaBySlug(slug: string) {
  return noticias.find((n) => n.slug === slug)
}

/** Mais recentes primeiro. Ordem natural de uma seção de notícias. */
export function getNoticiasOrdenadas() {
  return [...noticias].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

/**
 * Outras notícias, para o rodapé da matéria.
 *
 * Prioriza quem compartilha categoria e completa com as mais recentes, para
 * nunca devolver menos que o pedido enquanto houver notícia disponível.
 */
export function getNoticiasRelacionadas(atual: Noticia, limite = 3) {
  const cats = new Set(atual.categories ?? [atual.category])
  const outras = getNoticiasOrdenadas().filter((n) => n.slug !== atual.slug)

  const mesmoTema = outras.filter((n) =>
    (n.categories ?? [n.category]).some((c) => cats.has(c)),
  )
  const resto = outras.filter((n) => !mesmoTema.includes(n))

  return [...mesmoTema, ...resto].slice(0, limite)
}
