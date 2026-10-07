export const SITE_URL = 'https://drericodiogenes.com.br'

export const site = {
  siteUrl: SITE_URL,
  name: 'Dr. Érico Diógenes',
  role: 'Urologista em Fortaleza',

  // ─── Registro profissional ────────────────────────────────────────────────
  // FONTE ÚNICA. Alterar aqui reflete no rodapé, no AuthorCard e no JSON-LD.
  //
  // Confirmado pelo cliente em 16/09/2026: CRM-CE 9540 · RQE 6232, nessa ordem.
  // Resolve o item 8 do plano de recuperação, que apontava números divergentes
  // entre as propriedades. Os valores errados que circulavam eram 'CRM-CE 6777'
  // (rodapé de ericodiogenes.com.br) e 'CRM-CE 12.370' (card de autor do blog
  // deste site). Ambos já foram corrigidos.
  //
  // Os outros dois sites do médico têm a mesma fonte única, com estes mesmos
  // valores:
  //   holep-erico    → lib/constants.ts   (ericodiogenes.com.br)
  //   dr-erico-holep → src/constants.ts   (holep.drericodiogenes.com.br)
  //
  // Falta padronizar fora do código: Google Meu Negócio e Doctoralia.
  crm: 'CRM-CE 9540',
  rqe: 'RQE 6232',
  phone: '(85) 98178-1020',
  whatsapp: 'https://wa.me/5585981781020',
  whatsappRaw: '5585981781020',
  email: 'contato@drericodiogenes.com.br',
  instagram: 'https://instagram.com/drericodiogenes',
  // Canal real. O ID confere com o NEXT_PUBLIC_YOUTUBE_CHANNEL_ID usado em
  // components/sections/VideoSection.tsx, que consome a API do YouTube para
  // listar os vídeos da home. Antes aqui havia 'https://youtube.com', que era
  // placeholder e levava o visitante para a página inicial do YouTube.
  youtube: 'https://www.youtube.com/channel/UCITORRpgYFysxixfAa623yQ',
  facebook: 'https://www.facebook.com/drericodiogenes',

  // ─── Perfis oficiais (alimentam o sameAs do JSON-LD) ──────────────────────
  // Só entram aqui URLs confirmadas. Um sameAs apontando para perfil errado ou
  // inexistente enfraquece a consolidação da entidade em vez de reforçar.
  //
  // Origem de cada uma:
  //   Instagram e Doctoralia → já estavam neste repositório
  //   YouTube  → ID do canal em VideoSection.tsx, que busca vídeos reais dele
  //   Facebook → sameAs do JSON-LD de holep.drericodiogenes.com.br
  //              (repositório dr-erico-holep, index.html)
  profiles: [
    'https://instagram.com/drericodiogenes',
    'https://www.facebook.com/drericodiogenes',
    'https://www.youtube.com/channel/UCITORRpgYFysxixfAa623yQ',
    'https://www.doctoralia.com.br/erico-diogenes/urologista/fortaleza',
    // Perfil do Google. O Place ID veio do componente de avaliacoes do
    // repositorio dr-erico-holep, que consultava esse mesmo perfil pela API.
    'https://www.google.com/maps/place/?q=place_id:ChIJ-RHmBn5IxwcRyI2kNHjMWKA',
    // LinkedIn. Identificado por correspondência de quatro dados que batem
    // com o schema deste site: nome, direção do Instituto de Urologia e
    // Robótica (IURO), fellowship no Sírio-Libanês e formação pela USP.
    'https://www.linkedin.com/in/erico-di%C3%B3genes-md-b5b17a32/',
    // Currículo Lattes, informado pelo cliente. Confere com o médico: o CV
    // registra a direção do IURO, o doutorado em Urologia pela USP com pesquisa
    // em câncer de próstata, o fellowship no Sírio-Libanês com o Prof. Miguel
    // Srougi e a atuação no Walter Cantídio, tudo já declarado no schema.
    'https://lattes.cnpq.br/0034241490623370',
  ] as string[],
  address: {
    street: 'Pátio Dom Luís, Av. Dom Luís, 1200, Sl 705, Torre 2',
    district: 'Aldeota',
    city: 'Fortaleza, CE',
    hours: 'Segunda a Sexta: 8h às 18h',
    mapEmbed:
      'https://maps.google.com/maps?q=P%C3%A1tio+Dom+Lu%C3%ADs%2C+Av.+Dom+Lu%C3%ADs%2C+1200%2C+Fortaleza%2C+CE&output=embed&hl=pt-BR&z=17',
  },
  locations: [
    {
      name: 'Pátio Dom Luís',
      street: 'Av. Dom Luís, 1200, Sl 705, Torre 2',
      district: 'Aldeota',
      city: 'Fortaleza, CE',
      hours: 'Segunda a Sexta: 8h às 18h',
      phone: '(85) 98178-1020',
      mapEmbed:
        'https://maps.google.com/maps?q=P%C3%A1tio+Dom+Lu%C3%ADs%2C+Av.+Dom+Lu%C3%ADs%2C+1200%2C+Fortaleza%2C+CE&output=embed&hl=pt-BR&z=17',
    },
    {
      name: 'Pronutrir Oncologia',
      street: 'R. Atilano de Moura, 530',
      district: 'Guararapes',
      city: 'Fortaleza, CE',
      hours: 'Segunda a Sexta: a partir das 7h30',
      phone: '(85) 3262-0183',
      mapEmbed:
        'https://maps.google.com/maps?q=R.+Atilano+de+Moura%2C+530%2C+Guararapes%2C+Fortaleza%2C+CE&output=embed&hl=pt-BR&z=17',
    },
    {
      name: 'Uno Medical & Office',
      street: 'Av. Pontes Vieira, 2340, 3º Andar',
      district: 'Dionísio Torres',
      city: 'Fortaleza, CE',
      hours: 'Segunda a Sábado: 8h às 18h',
      phone: '(85) 3034-8686',
      mapEmbed:
        'https://maps.google.com/maps?q=Av.+Pontes+Vieira%2C+2340%2C+Dion%C3%ADsio+Torres%2C+Fortaleza%2C+CE&output=embed&hl=pt-BR&z=17',
    },
  ],
}
