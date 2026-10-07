import localFont from 'next/font/local'

/**
 * Sora nos títulos (no original vem do next/font/google). O arquivo é o mesmo
 * subconjunto latino que o build do original baixa, guardado aqui para não
 * depender da rede. A Manrope do corpo vem do @fontsource-variable.
 */
export const sora = localFont({
  src: '../fonts/sora-latin.woff2',
  weight: '100 800',
  display: 'swap',
  fallback: ['ui-sans-serif', 'sans-serif'],
})
