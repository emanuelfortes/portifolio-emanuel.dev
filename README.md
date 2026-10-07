# Portfolio — Full Stack Developer

Portfólio profissional desenvolvido com Next.js 14, TypeScript e Tailwind CSS.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**

## Estrutura

```text
/app
  /(site)                     → O portfólio (layout raiz, globals.css, home, /projeto/[slug])
  /(demos)                    → Réplicas dos projetos, com layout raiz próprio
    /demo/siga-fibra
    /demo/lexcursos
    /demo/dr-erico

/components
  Projects.tsx                → Grade de projetos
  ProjectCard.tsx             → Card com o monitor e o resumo do projeto
  DemoMonitor.tsx             → Monitor com a réplica num iframe, que amplia ao clicar

/demos/<projeto>              → Código de cada réplica, com tailwind.config.ts e styles.css próprios

/public/demos/<projeto>       → Logos e fotos usados pelas réplicas

/data
  projects.ts                 → Dados dos projetos
```

## Réplicas dos projetos

Cada card da seção "Veja em ação" mostra um monitor com o sistema rodando.
Não é captura de tela: é um iframe apontando para `/demo/<projeto>`, uma
cópia navegável construída a partir do código do projeto original, com a
camada de dados trocada por dados sintéticos (sem API, banco ou credenciais).
Ao clicar, a tela sai do monitor e amplia sobre a página.

Regras para manter as réplicas isoladas do portfólio:

- As rotas ficam no grupo `app/(demos)`, que tem layout raiz próprio e não
  importa o `globals.css` do portfólio.
- Cada réplica tem o próprio `tailwind.config.ts`, carregado no seu
  `styles.css` via `@config`, com `content` limitado à pasta da réplica.
- O `globals.css` do portfólio também declara `@config` explicitamente. Sem
  isso, com várias configs no mesmo build, ele pode ser compilado com a
  config de uma réplica.
- Fontes vêm de pacotes `@fontsource-variable/*`, sem depender do Google
  Fonts no build.

Enquanto a réplica carrega (é um app inteiro), o monitor mostra uma captura
da tela inicial, `public/demos/<projeto>/poster.webp`. Depois de mudar a tela
inicial de uma réplica, gere as capturas de novo com o servidor rodando:

```bash
npm run dev
node scripts/posters.mjs
```

## Setup

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
```

## Personalização

### 1. Seus dados pessoais
- `components/Contact.tsx` → Altere o email e links de GitHub/LinkedIn
- `components/Navbar.tsx` → Altere o logo/nome
- `app/layout.tsx` → Altere título e description do SEO

### 2. Seus projetos
Edite `/data/projects.ts`. Cada projeto tem:

```ts
{
  slug: string           // URL da página (ex: "meu-projeto")
  tag: string            // Categoria (ex: "Sistema Web")
  title: string          // Título do projeto
  shortDescription: string  // Descrição curta para o card
  fullDescription: string   // Descrição completa
  problem: string        // Problema que o projeto resolve
  solution: string       // Como foi resolvido
  result: string         // Resultado obtido
  stack: string[]        // Tecnologias utilizadas
  highlights: string[]   // Lista de funcionalidades
  liveUrl?: string       // URL do projeto (opcional)
  githubUrl?: string     // URL do GitHub (opcional)
  year: string           // Ano do projeto
  demo: {
    path: string         // Rota da réplica (ex: "/demo/meu-projeto")
    label: string        // Texto da barra de endereço na tela ampliada
    secure?: boolean     // Cadeado na barra
  }
}
```

### 3. Suas skills
Edite `components/Skills.tsx` → array `skillCategories`.

## Deploy

O projeto está pronto para deploy na **Vercel**:

```bash
# Via CLI
npx vercel

# Ou conecte o repositório diretamente em vercel.com
```

## Design

- Fundo: `#0B0F19`
- Azul principal: `#3B82F6`
- Azul glow: `#60A5FA`
- Texto: `#E5E7EB`
- Tipografia: Inter (Google Fonts)
