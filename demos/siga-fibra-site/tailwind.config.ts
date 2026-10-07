import type { Config } from 'tailwindcss'

/**
 * Tailwind do site da Siga Fibra, igual ao tailwind.config.ts original.
 *
 * Carregado por styles.css via `@config`, então só vale para esta réplica. A
 * fonte aponta para o pacote @fontsource-variable/montserrat importado no
 * layout da demo ('Montserrat Variable'), com o nome do Google Fonts atrás.
 */
const config: Config = {
  darkMode: 'class',
  content: ['./demos/siga-fibra-site/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat Variable', 'Montserrat', 'sans-serif'],
      },
      colors: {
        siga: {
          primary: '#27CAA3',
          secondary: '#03C2C3',
          dark: '#062f2f',
          mid: '#0a4545',
          light: '#e0f9f6',
        },
      },
    },
  },
  plugins: [],
}

export default config
