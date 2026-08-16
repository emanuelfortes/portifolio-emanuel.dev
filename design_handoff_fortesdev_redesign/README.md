# Handoff: Redesign do site Fortes Dev (fortesdev.com)

## Overview
Redesign completo do portfolio de Emanuel Fortes (Full Stack Developer). Estética "aurora" escura inspirada em reactbits.dev: fundo quase preto com granulado (film grain), aurora roxa animada no hero, janela de código decorativa, grid bento, skills com abas interativas, água 3D em three.js no card de contato e header que se recolhe em pílula ao scrollar.

## About the Design Files
Os arquivos deste pacote são **referências de design criadas em HTML** — protótipos que mostram o visual e o comportamento pretendidos, NÃO código de produção para copiar diretamente. A tarefa é **recriar estes designs no codebase existente do projeto (Next.js + Tailwind CSS)** usando seus padrões e componentes. Exceção: `wave-bg.js` (three.js) pode ser portado quase 1:1 como componente React com `useEffect`.

## Fidelity
**High-fidelity (hifi).** Cores, tipografia, espaçamentos, animações e interações são finais. Recriar pixel-perfect.

## Design Tokens

### Cores
- Fundo da página: `#08060d`
- Fundo de cards: `rgba(18,14,30,0.6)` (bento/projetos) e `rgba(14,11,24,0.65)` (card de skills)
- Card CTA: `#0b0814`
- Bordas: `rgba(167,139,250,0.14)` padrão · `rgba(167,139,250,0.4–0.5)` no hover
- Roxo primário: `#8b5cf6` · hover `#9d74f8`
- Lilás: `#a78bfa` · claro `#c4b5fd` · muito claro `#e9d5ff`
- Texto: principal `#ece9f7` · secundário `#b3abd0` · muted `#8b84a8` · labels `#7d7599`
- Gradiente de destaque: `linear-gradient(135deg,#a78bfa,#8b5cf6)` (botões pill, aba ativa — texto escuro `#0a0812` por cima)
- Barras de skill: `linear-gradient(90deg,#5b3df0,#a78bfa,#e9d5ff)` + `box-shadow:0 0 12px rgba(139,92,246,0.8)`

### Tipografia
- Display/corpo: **Space Grotesk** (400–700), letter-spacing negativo em títulos (−0.03em a −0.035em)
- Mono (labels, código, badges): **JetBrains Mono** (400–500), uppercase, letter-spacing 0.1–0.14em, 10–12px
- H1 hero: `clamp(38px, 4.6vw, 64px)`, peso 600, line-height 1.06
- H2 seções: `clamp(26px, 3vw, 38px)`, peso 600
- CTA H2: `clamp(30px, 4vw, 52px)`

### Outros tokens
- Border radius: cards 18–24px, janelas 16px, botões 12px, pills 999px
- Container: `max-width:1200px`, padding lateral `5vw`
- Grain: textura PNG tile 256×256 (`grain.png`) como `background-image` do body, `background-attachment:fixed`, sobre `background-color:#08060d`

## Screens / Views (página única, seções em ordem)

### 1. Header fixo com colapso no scroll
- Fixo no topo, z-index 50. Duas aparências com transição `all .45s cubic-bezier(.4,0,.2,1)`:
  - **Topo (scrollY ≤ 40):** largura 100%, fundo transparente, padding `16px 5vw`, sem borda.
  - **Scrollado (scrollY > 40):** vira pílula centralizada — largura `min(1000px, 94vw)`, margin-top 12px, `border-radius:999px`, fundo `rgba(14,10,24,0.72)` + `backdrop-filter:blur(20px)`, borda `1px rgba(167,139,250,0.18)`, sombra `0 16px 50px rgba(0,0,0,0.5)`, padding `10px 12px 10px 24px`.
- Esquerda: logo `</> Fortes Dev` (mono roxo + bold) e links SOBRE / SKILLS / PROJETOS (mono 11px uppercase, cinza `#8b84a8`, hover branco). Direita: botão "Falar comigo" (pill, gradiente lilás→roxo, texto escuro) e "GitHub" (pill ghost com borda).
- Mobile (≤900px): esconder o grupo de links central.

### 2. Hero com aurora
- Padding `150px 5vw 110px`. Grid 2 colunas `minmax(300px,1.15fr) minmax(280px,1fr)`, gap 56px; empilha ≤900px.
- **Aurora de fundo** (atrás, overflow hidden, blur): 3 elipses radiais animadas —
  `rgba(139,92,246,0.55)` blur 60px, `rgba(196,181,253,0.35)` blur 50px, `rgba(59,20,110,0.6)` blur 70px; animação `auroraShift` 16–20s alternando `translateX(±6%) rotate(−8deg→−6deg) scaleY(1→1.15)`.
- Coluna esquerda: badges pill ("Disponível" gradiente / "• Novos projetos" outline com dot pulsando 2s), H1 "Desenvolvo sistemas para **quem precisa de resultado**" (destaque `#c4b5fd`), parágrafo, botões "Ver projetos →" (roxo sólido, sombra `0 4px 30px rgba(139,92,246,0.45)`) e "Entrar em contato" (ghost), linha mono "10+ projetos · 100% full stack · visão de produto".
- Coluna direita: **janela de código** `dev.config.ts` — card `rgba(10,8,18,0.75)`, borda lilás 0.2, blur 16px, sombra `0 40px 100px rgba(0,0,0,0.6)`; topo com 3 dots e chip do nome do arquivo; `<pre>` JetBrains Mono 12.5px/1.85 com código fictício (ver HTML); rodapé com chips react/node/postgres/prisma.
- Entrada: elementos com `riseIn` (fade + translateY 24px→0, ~0.7s, delays escalonados 0.1–0.4s).

### 3. "O que eu entrego" (bento, id sobre)
- Grid 3 colunas, gap 16px (≤1000px: 2 col; ≤640px: 1 col). Glow radial roxo difuso no canto direito da seção.
- Linha 1: três cards iguais — "10+ Projetos entregues", "Solução completa" (chips DB/API/UI), "PO Visão de produto". Números grandes 34px `#c4b5fd`.
- Linha 2: card largo (span 2) com gradiente `linear-gradient(140deg, rgba(124,92,255,0.14), rgba(18,14,30,0.6))` — texto "Não apenas código: soluções completas…" + card "Código que escala" com mini-snippet mono `while (problema) { resolver(); }`.
- Hover em todos: borda sobe para `rgba(167,139,250,0.4)`.

### 4. Stack técnico (id skills, interativo)
- Card único `rgba(14,11,24,0.65)`, radius 22px. Header: segmented control pill (Frontend / Backend / Outros — ativa com gradiente e texto escuro, inativas ghost mono) + label meta à direita (ex.: "07 tecnologias · interface").
- Corpo: grid 2 colunas (`minmax(min(100%,320px),1fr)`, gap 22px 48px) de linhas: nome (14px `#e4e0f2`) + % (mono 11px `#a78bfa`) e barra 6px — trilho `rgba(167,139,250,0.1)`, preenchimento gradiente com glow, `transition: width .7s cubic-bezier(.4,0,.2,1)`.
- **Comportamento:** ao trocar de aba as barras resetam para 0% e animam até o valor (~40ms de delay para re-trigger). Na carga inicial, animar após ~300ms.
- Dados: Frontend — HTML & CSS 90, JavaScript (ES6+) 85, React.js 80, Next.js 75, TypeScript 72, Tailwind CSS 88, UI/UX Principles 78. Backend — Node.js 80, REST APIs 85, PostgreSQL 75, MySQL 72, Autenticação & JWT 78, Regras de Negócio 82, Prisma ORM 70. Outros — Git & GitHub 85, Visão de Produto (PO) 80, Lógica de Programação 90, Metodologias Ágeis 75, Docker (básico) 55, Documentação técnica 78.

### 5. Projetos "Veja em ação" (id projetos)
- Grid `auto-fit minmax(min(100%,300px),1fr)`, gap 16px. Dois glows radiais suaves na seção.
- Card (é um link): thumb 150px com gradiente radial roxo e glyph mono central (`{ crm }` / `▲▲▲` / `[ 09:30 ]`), corpo com tipo (mono uppercase lilás) + ano, título 18px, descrição 13.5px, "Ver projeto →" em `#c4b5fd`.
- Hover: `translateY(-4px)` + borda `rgba(167,139,250,0.5)`.
- Conteúdo: CRM Interno (Sistema Web 2026), Painel de Métricas (Dashboard 2026), Sistema de Agendamento (Aplicação Web 2026) — textos exatos no HTML.

### 6. CTA de contato com água 3D (id contato)
- Card radius 24px, fundo `#0b0814`, borda lilás, `overflow:hidden`, padding `90px 8vw` (≤640px: `60px 24px`), conteúdo centralizado.
- **Fundo:** componente three.js `wave-bg` (ver Assets) preenchendo o card + véu por cima `linear-gradient(180deg, rgba(11,8,20,0.85), rgba(11,8,20,0.15) 55%, rgba(11,8,20,0.35))` para legibilidade.
- Conteúdo: H2 "Tem um projeto em mente?", parágrafo, botão branco "Chamar no WhatsApp" (`https://wa.me/5585992004530`) e botão mono "(85) 99200-4530 ⧉" que copia o número (feedback: ícone vira ✓ por 1.8s).

### 7. Footer
- Borda superior sutil, flex space-between com wrap: logo + tagline "Full Stack · Código · Solução · Impacto", links GitHub/LinkedIn/WhatsApp, copyright.

## Interactions & Behavior
- Scroll do header (descrito acima) — listener passivo, threshold 40px.
- Abas de skills com re-animação das barras.
- Copiar telefone via `navigator.clipboard`.
- Hovers: cards (borda + lift), botões (brilho/sombra), links (branco).
- Água 3D: câmera segue o mouse quando o cursor está sobre o card de contato — deslocamento X até ±4.5, Y ±0.7, com easing (lerp 0.05 por frame); volta ao centro quando o mouse sai.
- Âncoras de navegação: #sobre, #skills, #projetos, #contato.

## State Management
- `scrolled: boolean` (header)
- `tab: 0|1|2` + `barsIn: boolean` (skills)
- `copied: boolean` (telefone)
- Sem fetch de dados; tudo estático.

## Assets
- `grain.png` — textura de granulado 256×256 gerada proceduralmente (pontos brancos ~10% opacidade 7–19, lilases, e escuros; densidade total ~24% dos pixels). Usar como tile fixo no body. Pode ser regenerada ou substituída por qualquer film grain sutil equivalente.
- `wave-bg.js` — web component three.js (r160) com a superfície de "água" roxa: plano 60×30 com 220×110 segmentos, ShaderMaterial (fbm + ridged noise + swell no vertex; iluminação por derivadas, specular e fog no fragment), rotação −PI/2.15, câmera em (0, 1.6, 8). Portar como componente React (`useEffect` + cleanup: cancelar RAF, remover listener de mousemove, `renderer.dispose()`).
- Fontes: Google Fonts — Space Grotesk (400,500,600,700) e JetBrains Mono (400,500).

## Files
- `Fortes Dev Aurora.dc.html` — **design final** (referência principal; o markup relevante está entre `<x-dc>...</x-dc>`, estilos inline; a lógica está na classe no `<script>` do final)
- `wave-bg.js` — animação de água three.js (portável quase direto)
- `grain.png` — textura de granulado
- `Fortes Dev Surreal.dc.html` e `Fortes Dev Minimal.dc.html` — explorações anteriores, apenas contexto (não implementar)

## Notas de implementação (Next.js + Tailwind)
- Converter os tokens acima para o `tailwind.config` (cores, radius) ou CSS variables.
- Estilos do protótipo são inline por limitação da ferramenta de design — no projeto real, usar classes Tailwind normalmente.
- `wave-bg` e o header dependem de browser APIs — marcar componentes com `"use client"`.
- Media queries do protótipo: breakpoints 1000px (bento 2 col), 900px (hero empilha, esconde nav links), 640px (tudo 1 col).
