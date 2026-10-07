'use client'

import { useEffect, useState } from 'react'

const CHANNEL_ID = 'UCITORRpgYFysxixfAa623yQ'
const MAX_RESULTS = 9

interface Video {
  id: string
  titulo: string
  imagem: string
  publicadoEm: string
  descricao: string
}

/* Na réplica os vídeos não vêm da YouTube Data API, que exige a chave do
   cliente. São os 9 envios mais recentes do canal, lidos do feed público
   em 07/10/2026, no mesmo formato que fetchVideos() montava. */
const VIDEOS: Video[] = [
  {
    "id": "y3v2y37QP0w",
    "titulo": "Sangue na urina sem dor não é coincidência.",
    "imagem": "https://i.ytimg.com/vi/y3v2y37QP0w/maxresdefault.jpg",
    "publicadoEm": "2026-09-17T20:15:28+00:00",
    "descricao": "Sangue na urina sem dor não é coincidência. É o principal sinal de alerta do câncer de bexiga, e o sintoma que menos deve ser ignorado.\n\nO tabagismo é o fator de risco número um para essa doença. Dado clínico consolidado que precisa ser de conhecimento público.\n\nNeste caso, realizamos a ressecção em bloco com laser de túlio pulsado, técnica que remove o tumor de forma íntegra, com menor lesão tecidual e peça cirúrgica de qualidade superior para o patologista. Diagnóstico mais preciso. Decisão terapêutica mais assertiva.\n\nSe você apresentou sangramento urinário, não adie a investigação. Agende sua avaliação pelo link na bio ou WhatsApp: (85) 98170-1020 ou (85) 98178-1020\n\nDr. Érico Diógenes — Médico Urologista\nCRM: 9540/CE | RQE: 6232\n\n#CâncerDeBexiga #Hematúria #DrÉricoDiógenes #UrologistaFortaleza\n3 d"
  },
  {
    "id": "t8ELbXMsmp4",
    "titulo": "A hiperplasia prostática benigna é progressiva.",
    "imagem": "https://i.ytimg.com/vi/t8ELbXMsmp4/maxresdefault.jpg",
    "publicadoEm": "2026-09-17T20:10:13+00:00",
    "descricao": "A hiperplasia prostática benigna é progressiva. O que começa como um incômodo noturno evolui para obstrução real do canal urinário. Jato fraco, urgência, esvaziamento incompleto, acordar várias vezes à noite. Sintomas que muitos homens normalizam como coisa da idade.\n\nNão são. Têm diagnóstico, têm causa e têm tratamento.\nQuando o medicamento não é mais suficiente, a cirurgia entra em cena. E a técnica escolhida define a durabilidade do resultado e a velocidade da recuperação.\nA enucleação prostática a laser remove o tecido obstrutivo por completo, pelo canal natural da uretra, sem corte externo, sem violar o abdômen. Recuperação mais rápida e resultados mais duradouros do que as técnicas convencionais.\n\nDr. Érico Diógenes — Médico Urologista\nCRM: 9540/CE | RQE: 6232\n\n#HiperplasiaProstática #HoLEP #DrÉricoDiógenes #UrologistaFortaleza"
  },
  {
    "id": "qwtyIYnnGug",
    "titulo": "câncer de próstata é o tipo de câncer mais comum entre os homens brasileiros, descontando o de pele.",
    "imagem": "https://i.ytimg.com/vi/qwtyIYnnGug/maxresdefault.jpg",
    "publicadoEm": "2026-09-17T20:02:24+00:00",
    "descricao": "O câncer de próstata é o tipo de câncer mais comum entre os homens brasileiros, descontando o de pele. Só no Ceará, são mais de 3 mil novos casos por ano.\n\nO dado que mais preocupa não é a incidência. É o silêncio. Nas fases iniciais, esse câncer não dá sintoma nenhum. Não dói, não incomoda, não avisa. Quando os sintomas aparecem, a doença muitas vezes já avançou.\nE é justamente por isso que o rastreamento é inegociável. Detectado cedo, o câncer de próstata tem índice de cura entre 90% e 95%. Detectado tarde, o tratamento deixa de ter intenção curativa.\n\nSe você tem mais de 45 anos e não faz acompanhamento regular, agende sua avaliação. Link na bio ou WhatsApp:\n(85) 98170-1020 ou (85) 98178-1020\nDr. Érico Diógenes — Médico Urologista\nCRM: 9540/CE | RQE: 6232"
  },
  {
    "id": "8n9gCFQwq_U",
    "titulo": "Na medicina, técnica e conhecimento são a base.",
    "imagem": "https://i.ytimg.com/vi/8n9gCFQwq_U/maxresdefault.jpg",
    "publicadoEm": "2026-08-21T18:13:42+00:00",
    "descricao": "Trabalhador, artesão ou artista. A diferença está no quanto de si cada um coloca no que faz.\nNa medicina, técnica e conhecimento são a base. Mas o cuidado com quem confia a própria saúde é o que dá sentido a cada procedimento.\nDr. Érico Diógenes — Médico Urologista\nCRM: 9540/CE | RQE: 6232"
  },
  {
    "id": "SgmK8JFDcSc",
    "titulo": "Junho Verde: Dr. Érico Diógenes destaca os cuidados contra o câncer de rim.",
    "imagem": "https://i.ytimg.com/vi/SgmK8JFDcSc/maxresdefault.jpg",
    "publicadoEm": "2026-07-28T18:45:24+00:00",
    "descricao": "Junho Verde: Dr. Érico Diógenes destaca os cuidados contra o câncer de rim.\n\nO câncer de rim pode evoluir de forma silenciosa. Durante a entrevista, o Dr. Érico Diógenes explica a importância dos cuidados com a saúde, da investigação médica e do acompanhamento especializado.\n\nAcompanhe mais informações em @dreericodiogenes.\n\n#JunhoVerde #CâncerDeRim #SaúdeDosRins #Urologia #CorpoEEstiloDeVida"
  },
  {
    "id": "eMYO5C1gVig",
    "titulo": "YOUTUBE CIRURGIA ENUCLEAÇÃO",
    "imagem": "https://i.ytimg.com/vi/eMYO5C1gVig/maxresdefault.jpg",
    "publicadoEm": "2026-07-22T18:09:47+00:00",
    "descricao": "O Dr. Érico Diógenes acompanha uma cirurgia de enucleação de tumor de bexiga com laser, mostrando como a lesão é retirada em bloco, com precisão e preservação da amostra para análise. Uma técnica moderna indicada para casos selecionados.\n\n#CâncerDeBexiga #Enucleação #CirurgiaALaser #Urologia #DrÉricoDiógenes"
  },
  {
    "id": "f45mckSUfrU",
    "titulo": "Ressecção em bloco com laser no tratamento do tumor de bexiga",
    "imagem": "https://i.ytimg.com/vi/f45mckSUfrU/maxresdefault.jpg",
    "publicadoEm": "2026-07-22T17:59:36+00:00",
    "descricao": "O Dr. Érico Diógenes mostra como a ressecção em bloco com laser permite retirar o tumor de bexiga com mais precisão, preservando a profundidade da lesão e oferecendo uma amostra mais adequada para a análise do patologista.\n\n#CâncerDeBexiga #Urologia #CirurgiaALaser #DrÉricoDiógenes"
  },
  {
    "id": "-C0Qbt_YoWw",
    "titulo": "Câncer de bexiga: como funciona a retirada do tumor em bloco?",
    "imagem": "https://i.ytimg.com/vi/-C0Qbt_YoWw/maxresdefault.jpg",
    "publicadoEm": "2026-07-22T17:53:54+00:00",
    "descricao": "O Dr. Érico Diógenes explica como a cirurgia pode retirar o tumor de bexiga em bloco, com mais precisão e preservação da lesão para análise. O sangue na urina é um dos principais sinais de alerta e deve ser investigado.\n\n#CâncerDeBexiga #Urologia #CirurgiaUrológica #DrÉricoDiógenes"
  },
  {
    "id": "OC3dR16Y11U",
    "titulo": "Enucleação de tumor de bexiga: mais precisão no tratamento",
    "imagem": "https://i.ytimg.com/vi/OC3dR16Y11U/maxresdefault.jpg",
    "publicadoEm": "2026-07-22T17:45:35+00:00",
    "descricao": "O Dr. Érico Diógenes explica como funciona a enucleação do tumor de bexiga, técnica que permite retirar a lesão em bloco e preservar uma amostra de melhor qualidade para análise. A indicação depende das características de cada caso.\n\n#CâncerDeBexiga #Urologia #Enucleação #DrÉricoDiógenes"
  }
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 18, 14, 0.92)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          background: '#f5f0e8',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '860px',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          animation: 'modalPop 0.2s ease',
        }}
      >
        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-display text-base font-semibold text-brand-navy leading-snug">
              {video.titulo}
            </p>
            <p className="text-xs text-brand-muted mt-1">
              {formatDate(video.publicadoEm)}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy no-underline"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.03 0 12 0 12s0 3.97.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.97 24 12 24 12s0-3.97-.5-5.81zM9.75 15.52V8.48L15.5 12l-5.75 3.52z" />
              </svg>
              Ver no YouTube
            </a>

            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-brand-navy cursor-pointer border-none text-base"
              style={{ background: '#e8e2d4' }}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#ffffff',
        border: '1px solid #e0d9cc',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 20px 50px rgba(26, 46, 34, 0.15)'
          : '0 2px 12px rgba(26, 46, 34, 0.06)',
        borderColor: hovered ? '#0B2239' : '#e0d9cc',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#0B2239' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.imagem}
          alt={video.titulo}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.35s ease',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10, 18, 14, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'rgba(245, 240, 232, 0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0B2239">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4 pb-5">
        <p
          className="font-display text-sm font-semibold text-brand-navy leading-snug mb-2"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {video.titulo}
        </p>
        <p className="text-xs text-brand-muted">
          {formatDate(video.publicadoEm)}
        </p>
      </div>
    </article>
  )
}

function FeaturedVideo({ video, onClick }: { video: Video; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  const descricaoTruncada =
    video.descricao.length > 280 ? video.descricao.slice(0, 280).trimEnd() + '…' : video.descricao

  return (
    <div
      className="featured-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        alignItems: 'center',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e0d9cc',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(26,46,34,0.08)',
        animation: 'fadeUp 0.5s ease both',
      }}
    >
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          aspectRatio: '16/9',
          overflow: 'hidden',
          background: '#0B2239',
          cursor: 'pointer',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.imagem}
          alt={video.titulo}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.35s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10,18,14,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: hovered ? 1 : 0.7,
            transition: 'opacity 0.25s ease',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(245,240,232,0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#0B2239">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="featured-info" style={{ padding: '32px 40px 32px 0' }}>
        <p className="eyebrow not-italic text-xs tracking-widest uppercase text-brand-navy mb-3">
          Mais recente
        </p>
        <h3
          className="font-display text-2xl md:text-3xl font-bold text-brand-navy leading-snug mb-3 cursor-pointer"
          onClick={onClick}
        >
          {video.titulo}
        </h3>
        <p className="text-xs text-brand-muted mb-4">
          {formatDate(video.publicadoEm)}
        </p>
        {descricaoTruncada && (
          <p className="text-sm text-brand-muted leading-relaxed mb-6">
            {descricaoTruncada}
          </p>
        )}
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-display text-sm font-semibold text-brand-gold no-underline rounded-lg px-6 py-3 transition-opacity hover:opacity-85"
          style={{ background: '#0B2239' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.03 0 12 0 12s0 3.97.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.97 24 12 24 12s0-3.97-.5-5.81zM9.75 15.52V8.48L15.5 12l-5.75 3.52z" />
          </svg>
          Assistir no YouTube
        </a>
      </div>
    </div>
  )
}

export default function VideoSection() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)

  function fetchVideos() {
    setLoading(true)
    setError(null)

    try {
      if (!VIDEOS.length) throw new Error('Nenhum vídeo encontrado.')
      setVideos(VIDEOS.slice(0, MAX_RESULTS))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Não foi possível carregar os vídeos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  return (
    <>
      <style>{`
        @keyframes modalPop {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 767px) {
          .featured-grid {
            grid-template-columns: 1fr !important;
          }
          .featured-info {
            padding: 24px !important;
          }
        }
      `}</style>

      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}

      <section
        style={{
          background: '#f5f0e8',
          padding: '80px 0 96px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle at 10% 20%, rgba(74, 124, 89, 0.04) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(26, 46, 34, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            position: 'relative',
          }}
        >
          <div className="text-center mb-14">
            <p className="eyebrow">Conteúdo exclusivo</p>
            <h2 className="section-title mt-2">
              Vídeos do{' '}
              <em className="italic text-brand-gold">Dr. Érico Diógenes</em>
            </h2>
            <div
              className="mx-auto mt-4 mb-5 rounded-sm"
              style={{ width: '48px', height: '2px', background: '#0B2239' }}
            />
            <p className="text-brand-muted text-base max-w-lg mx-auto leading-relaxed">
              Informações sobre saúde masculina, cirurgia robótica e tratamentos avançados em urologia.
            </p>
          </div>

          {loading && (
            <div className="flex flex-col items-center gap-4 py-16 text-brand-muted">
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  border: '3px solid #e0d9cc',
                  borderTopColor: '#0B2239',
                  borderRadius: '50%',
                  animation: 'spin 0.75s linear infinite',
                }}
              />
              <p className="text-sm">Carregando vídeos...</p>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-16">
              <p className="text-sm text-brand-muted mb-3">
                Não foi possível carregar os vídeos.
              </p>
              <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed mb-6">
                {error}
              </p>
              <button
                onClick={fetchVideos}
                className="text-sm font-semibold px-6 py-2.5 rounded-lg cursor-pointer border-none text-white"
                style={{ background: '#0B2239' }}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && videos.length > 0 && (
            <>
              {videos[0] && (
                <FeaturedVideo video={videos[0]} onClick={() => setActiveVideo(videos[0])} />
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '24px',
                  marginTop: '48px',
                  animation: 'fadeUp 0.5s ease both',
                }}
              >
                {videos.slice(1).map((video, i) => (
                  <div key={video.id} className={i >= 3 ? 'hidden md:block' : ''}>
                    <VideoCard video={video} onClick={() => setActiveVideo(video)} />
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <a
                  href={`https://www.youtube.com/channel/${CHANNEL_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-display text-sm font-semibold text-brand-navy no-underline rounded-lg px-7 py-3 border border-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.03 0 12 0 12s0 3.97.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.97 24 12 24 12s0-3.97-.5-5.81zM9.75 15.52V8.48L15.5 12l-5.75 3.52z" />
                  </svg>
                  Ver todos os vídeos no YouTube
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
