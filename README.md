# Portfolio — Full Stack Developer

Portfólio profissional desenvolvido com Next.js 14, TypeScript e Tailwind CSS.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **AOS** (Animate On Scroll)

## Estrutura

```
/app
  page.tsx                    → Home (todas as seções)
  layout.tsx                  → Layout raiz + metadata
  globals.css                 → Estilos globais
  /projeto/[slug]/page.tsx    → Página dinâmica de projeto

/components
  AOSInit.tsx                 → Inicialização do AOS (client)
  Navbar.tsx                  → Navegação fixa com scroll detection
  Hero.tsx                    → Seção principal com canvas animado
  About.tsx                   → Sobre + diferenciais
  Skills.tsx                  → Habilidades por categoria com barras
  Projects.tsx                → Grid de projetos
  ProjectCard.tsx             → Card individual de projeto
  Contact.tsx                 → Contato com copy de email
  Footer.tsx                  → Rodapé

/data
  projects.ts                 → Dados mockados dos projetos (TypeScript)
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
