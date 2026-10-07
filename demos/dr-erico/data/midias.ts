/**
 * midias.ts
 * ---------------------------------------------------------------------------
 * Aparições do Dr. Érico Diógenes na imprensa, em TV e em outros veículos.
 *
 * Cada item vira um card clicável em /midias. A imagem é o print da matéria e
 * o clique abre o link original, em nova aba.
 *
 * ── Como adicionar uma mídia ──────────────────────────────────────────────
 * 1. Salve o print em public/img/midias/ , de preferência em .webp
 * 2. Acrescente um item ao array abaixo
 * 3. Rode `npm run build` para conferir
 *
 * ── Sobre o tamanho do card ───────────────────────────────────────────────
 * O campo `tamanho` controla quanto espaço o card ocupa no mosaico:
 *
 *   'grande'  ocupa 2 colunas e 2 linhas
 *   'alto'    ocupa 1 coluna e 2 linhas
 *   'largo'   ocupa 2 colunas e 1 linha
 *   'normal'  ocupa 1 coluna e 1 linha
 *
 * Deixar sem `tamanho` faz a página distribuir sozinha, por um padrão que
 * alterna e produz o mosaico irregular sem ninguém precisar decidir item a
 * item. Use o campo apenas quando quiser forçar destaque para uma mídia
 * específica.
 *
 * ── Sobre os links ────────────────────────────────────────────────────────
 * Só entram URLs reais das matérias. Card que leva a lugar nenhum, ou a uma
 * página que saiu do ar, prejudica mais do que ajuda: quem clica e não
 * encontra nada duvida do resto.
 *
 * Vale conferir os links de tempos em tempos, porque veículo de notícia
 * reorganiza site e derruba URL antiga com frequência.
 */

export type TamanhoMidia = 'grande' | 'alto' | 'largo' | 'normal'

export type Midia = {
  /** Título da matéria, como aparece no veículo. */
  titulo: string
  /** Nome do veículo: Diário do Nordeste, TV Verdes Mares, O Povo... */
  veiculo: string
  /** URL original da matéria. */
  url: string
  /** Caminho do print, a partir de /img/midias/ */
  imagem: string
  /** Mês e ano, opcional. Ex: 'agosto de 2026' */
  data?: string
  /** Força o tamanho do card no mosaico. Sem isso, é distribuído automaticamente. */
  tamanho?: TamanhoMidia
}

export const midias: Midia[] = [
  // A ordem aqui é a ordem no mosaico, e os tamanhos foram escolhidos um a um
  // para caber no recorte de cada foto. O padrão automático serve para quando
  // as mídias forem muitas; com oito, dá para desenhar à mão e fechar as
  // quatro linhas sem buraco nenhum.
  {
    titulo: 'Participação no programa Ponto de Vista',
    veiculo: 'TV Câmara Fortaleza',
    url: 'https://www.youtube.com/watch?v=w8LOzNFGFlE',
    imagem: '/demos/dr-erico/img/midias/camara-fortaleza-ponto-de-vista.webp',
    data: 'julho de 2026',
    tamanho: 'grande',
  },
  {
    titulo: 'Dr. Érico Diógenes se destaca na urologia com atuação em cirurgia robótica e a laser',
    veiculo: 'Espaço VIP Online',
    url: 'https://espacoviponline.com.br/2026/01/22/dr-erico-diogenes-se-destaca-na-urologia-com-atuacao-em-cirurgia-robotica-e-a-laser/',
    imagem: '/demos/dr-erico/img/midias/espaco-vip-online-cirurgia-robotica-laser.webp',
    data: 'janeiro de 2026',
    tamanho: 'alto',
  },
  {
    titulo: 'Tecnologia robótica ganha protagonismo na urologia e oferece novos caminhos para pacientes com câncer',
    veiculo: 'ACEV News',
    url: 'https://acevnews.com/post/tecnologia-robotica-ganha-protagonismo-na-urologia-e-oferece-novos-caminhos-para-pacientes-com-cancer-explica-o-urologista-dr-erico-diogenes',
    imagem: '/demos/dr-erico/img/midias/acevnews-tecnologia-robotica-cancer.webp',
    data: 'julho de 2026',
    tamanho: 'normal',
  },
  {
    titulo: 'Tratamento a laser para crescimento da próstata ganha espaço no Brasil',
    veiculo: 'ACEV News',
    url: 'https://acevnews.com/post/tratamento-a-laser-para-crescimento-da-prostata-ganha-espaco-no-brasil-afirma-dr-erico-diogenes',
    imagem: '/demos/dr-erico/img/midias/acevnews-tratamento-laser-prostata.webp',
    data: 'março de 2026',
    tamanho: 'normal',
  },
  {
    titulo: 'Dr. Érico Diógenes se destaca na urologia com atuação em cirurgia robótica e a laser',
    veiculo: 'Portal RBN',
    url: 'https://portalrbn.com.br/dr-erico-diogenes-se-destaca-na-urologia-com-atuacao-em-cirurgia-robotica-e-a-laser/',
    imagem: '/demos/dr-erico/img/midias/portal-rbn-cirurgia-robotica-laser.webp',
    data: 'janeiro de 2026',
    tamanho: 'largo',
  },
  {
    titulo: 'Urologista pioneiro em cirurgia robótica participa do programa Questão de Ordem, da Alece TV',
    veiculo: 'ACEV News',
    url: 'https://acevnews.com/post/dr-erico-diogenes-urologista-pioneiro-em-cirurgia-robotica-participa-do-programa-questao-de-ordem-da-alece-tv',
    imagem: '/demos/dr-erico/img/midias/acevnews-questao-de-ordem-alece.webp',
    data: 'setembro de 2026',
    tamanho: 'largo',
  },
  {
    titulo: 'Prostatectomia robótica passa a integrar SUS e planos de saúde e amplia acesso a tratamento avançado no Brasil',
    veiculo: 'Cacto Mídia',
    url: 'https://cactomidia.com.br/prostatectomia-robotica-passa-a-integrar-sus-e-planos-de-saude-e-amplia-acesso-a-tratamento-avancado-no-brasil/',
    imagem: '/demos/dr-erico/img/midias/cactomidia-prostatectomia-robotica-sus.webp',
    data: 'abril de 2026',
    tamanho: 'largo',
  },
  {
    titulo: 'Aumento de diagnósticos de câncer de próstata reforça importância da prevenção e do acesso a tratamentos modernos',
    veiculo: 'Repórter Ceará',
    url: 'https://reporterceara.com.br/2026/01/07/aumento-de-diagnosticos-de-cancer-de-prostata-reforca-importancia-da-prevencao-e-do-acesso-a-tratamentos-modernos/',
    imagem: '/demos/dr-erico/img/midias/reporter-ceara-cancer-prostata-prevencao.webp',
    data: 'janeiro de 2026',
    tamanho: 'largo',
  },
]
