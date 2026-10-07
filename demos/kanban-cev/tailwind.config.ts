import type { Config } from 'tailwindcss'

/**
 * Tailwind da plataforma ACEV, igual ao do repositório original (kanbancev).
 *
 * O original usa Tailwind 4 (tema em `@theme` no globals.css). O portfólio
 * roda Tailwind 3, então esta config reproduz o que o 4 entrega por padrão e
 * o que as telas usam:
 *
 * - Cores do tema vêm de variáveis CSS (ver styles.css), trocadas pelo
 *   `[data-theme='light']`. A opacidade (`bg-overlay/8`) é aplicada com
 *   `color-mix`, como o Tailwind 4 faz.
 * - Paleta padrão do Tailwind 4 (oklch) nas famílias que as telas usam.
 * - Escala de espaçamento dinâmica (`size-4.5`, `w-88`) e opacidade em
 *   qualquer inteiro (`/8`, `/12`).
 * - Raios, sombras e desfoques com os nomes do Tailwind 4.
 *
 * É carregado por styles.css via `@config`, então só vale para esta réplica.
 */

const mix = (color: string) => `color-mix(in oklab, ${color} calc(<alpha-value> * 100%), transparent)`
const v = (name: string) => mix(`var(--color-${name})`)
const scale = (name: string, steps: (number | string)[]) =>
  Object.fromEntries(steps.map((s) => [s, v(`${name}-${s}`)]))

const V4_PALETTE: Record<string, Record<string, string>> = {"red":{"50":"oklch(97.1% 0.013 17.38)","100":"oklch(93.6% 0.032 17.717)","200":"oklch(88.5% 0.062 18.334)","300":"oklch(80.8% 0.114 19.571)","400":"oklch(70.4% 0.191 22.216)","500":"oklch(63.7% 0.237 25.331)","600":"oklch(57.7% 0.245 27.325)","700":"oklch(50.5% 0.213 27.518)","800":"oklch(44.4% 0.177 26.899)","900":"oklch(39.6% 0.141 25.723)","950":"oklch(25.8% 0.092 26.042)"},"orange":{"50":"oklch(98% 0.016 73.684)","100":"oklch(95.4% 0.038 75.164)","200":"oklch(90.1% 0.076 70.697)","300":"oklch(83.7% 0.128 66.29)","400":"oklch(75% 0.183 55.934)","500":"oklch(70.5% 0.213 47.604)","600":"oklch(64.6% 0.222 41.116)","700":"oklch(55.3% 0.195 38.402)","800":"oklch(47% 0.157 37.304)","900":"oklch(40.8% 0.123 38.172)","950":"oklch(26.6% 0.079 36.259)"},"amber":{"50":"oklch(98.7% 0.022 95.277)","100":"oklch(96.2% 0.059 95.617)","200":"oklch(92.4% 0.12 95.746)","300":"oklch(87.9% 0.169 91.605)","400":"oklch(82.8% 0.189 84.429)","500":"oklch(76.9% 0.188 70.08)","600":"oklch(66.6% 0.179 58.318)","700":"oklch(55.5% 0.163 48.998)","800":"oklch(47.3% 0.137 46.201)","900":"oklch(41.4% 0.112 45.904)","950":"oklch(27.9% 0.077 45.635)"},"yellow":{"50":"oklch(98.7% 0.026 102.212)","100":"oklch(97.3% 0.071 103.193)","200":"oklch(94.5% 0.129 101.54)","300":"oklch(90.5% 0.182 98.111)","400":"oklch(85.2% 0.199 91.936)","500":"oklch(79.5% 0.184 86.047)","600":"oklch(68.1% 0.162 75.834)","700":"oklch(55.4% 0.135 66.442)","800":"oklch(47.6% 0.114 61.907)","900":"oklch(42.1% 0.095 57.708)","950":"oklch(28.6% 0.066 53.813)"},"green":{"50":"oklch(98.2% 0.018 155.826)","100":"oklch(96.2% 0.044 156.743)","200":"oklch(92.5% 0.084 155.995)","300":"oklch(87.1% 0.15 154.449)","400":"oklch(79.2% 0.209 151.711)","500":"oklch(72.3% 0.219 149.579)","600":"oklch(62.7% 0.194 149.214)","700":"oklch(52.7% 0.154 150.069)","800":"oklch(44.8% 0.119 151.328)","900":"oklch(39.3% 0.095 152.535)","950":"oklch(26.6% 0.065 152.934)"},"emerald":{"50":"oklch(97.9% 0.021 166.113)","100":"oklch(95% 0.052 163.051)","200":"oklch(90.5% 0.093 164.15)","300":"oklch(84.5% 0.143 164.978)","400":"oklch(76.5% 0.177 163.223)","500":"oklch(69.6% 0.17 162.48)","600":"oklch(59.6% 0.145 163.225)","700":"oklch(50.8% 0.118 165.612)","800":"oklch(43.2% 0.095 166.913)","900":"oklch(37.8% 0.077 168.94)","950":"oklch(26.2% 0.051 172.552)"},"teal":{"50":"oklch(98.4% 0.014 180.72)","100":"oklch(95.3% 0.051 180.801)","200":"oklch(91% 0.096 180.426)","300":"oklch(85.5% 0.138 181.071)","400":"oklch(77.7% 0.152 181.912)","500":"oklch(70.4% 0.14 182.503)","600":"oklch(60% 0.118 184.704)","700":"oklch(51.1% 0.096 186.391)","800":"oklch(43.7% 0.078 188.216)","900":"oklch(38.6% 0.063 188.416)","950":"oklch(27.7% 0.046 192.524)"},"sky":{"50":"oklch(97.7% 0.013 236.62)","100":"oklch(95.1% 0.026 236.824)","200":"oklch(90.1% 0.058 230.902)","300":"oklch(82.8% 0.111 230.318)","400":"oklch(74.6% 0.16 232.661)","500":"oklch(68.5% 0.169 237.323)","600":"oklch(58.8% 0.158 241.966)","700":"oklch(50% 0.134 242.749)","800":"oklch(44.3% 0.11 240.79)","900":"oklch(39.1% 0.09 240.876)","950":"oklch(29.3% 0.066 243.157)"},"blue":{"50":"oklch(97% 0.014 254.604)","100":"oklch(93.2% 0.032 255.585)","200":"oklch(88.2% 0.059 254.128)","300":"oklch(80.9% 0.105 251.813)","400":"oklch(70.7% 0.165 254.624)","500":"oklch(62.3% 0.214 259.815)","600":"oklch(54.6% 0.245 262.881)","700":"oklch(48.8% 0.243 264.376)","800":"oklch(42.4% 0.199 265.638)","900":"oklch(37.9% 0.146 265.522)","950":"oklch(28.2% 0.091 267.935)"},"indigo":{"50":"oklch(96.2% 0.018 272.314)","100":"oklch(93% 0.034 272.788)","200":"oklch(87% 0.065 274.039)","300":"oklch(78.5% 0.115 274.713)","400":"oklch(67.3% 0.182 276.935)","500":"oklch(58.5% 0.233 277.117)","600":"oklch(51.1% 0.262 276.966)","700":"oklch(45.7% 0.24 277.023)","800":"oklch(39.8% 0.195 277.366)","900":"oklch(35.9% 0.144 278.697)","950":"oklch(25.7% 0.09 281.288)"},"violet":{"50":"oklch(96.9% 0.016 293.756)","100":"oklch(94.3% 0.029 294.588)","200":"oklch(89.4% 0.057 293.283)","300":"oklch(81.1% 0.111 293.571)","400":"oklch(70.2% 0.183 293.541)","500":"oklch(60.6% 0.25 292.717)","600":"oklch(54.1% 0.281 293.009)","700":"oklch(49.1% 0.27 292.581)","800":"oklch(43.2% 0.232 292.759)","900":"oklch(38% 0.189 293.745)","950":"oklch(28.3% 0.141 291.089)"},"pink":{"50":"oklch(97.1% 0.014 343.198)","100":"oklch(94.8% 0.028 342.258)","200":"oklch(89.9% 0.061 343.231)","300":"oklch(82.3% 0.12 346.018)","400":"oklch(71.8% 0.202 349.761)","500":"oklch(65.6% 0.241 354.308)","600":"oklch(59.2% 0.249 0.584)","700":"oklch(52.5% 0.223 3.958)","800":"oklch(45.9% 0.187 3.815)","900":"oklch(40.8% 0.153 2.432)","950":"oklch(28.4% 0.109 3.907)"},"rose":{"50":"oklch(96.9% 0.015 12.422)","100":"oklch(94.1% 0.03 12.58)","200":"oklch(89.2% 0.058 10.001)","300":"oklch(81% 0.117 11.638)","400":"oklch(71.2% 0.194 13.428)","500":"oklch(64.5% 0.246 16.439)","600":"oklch(58.6% 0.253 17.585)","700":"oklch(51.4% 0.222 16.935)","800":"oklch(45.5% 0.188 13.697)","900":"oklch(41% 0.159 10.272)","950":"oklch(27.1% 0.105 12.094)"}}

const palette = Object.fromEntries(
  Object.entries(V4_PALETTE).map(([fam, shades]) => [
    fam,
    Object.fromEntries(Object.entries(shades).map(([k, c]) => [k, mix(c)])),
  ]),
)

const spacing: Record<string, string> = { px: '1px', '0': '0px' }
for (let i = 0.5; i <= 160; i += 0.5) spacing[String(i)] = `${i * 0.25}rem`

const opacity: Record<string, string> = {}
for (let i = 0; i <= 100; i++) opacity[String(i)] = String(i / 100)

const config: Config = {
  content: ['./demos/kanban-cev/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',
      white: mix('#fff'),
      black: mix('#000'),
      ...palette,
      pine: scale('pine', [950, 900, 800, 700, 600]),
      gold: scale('gold', [200, 300, 500]),
      surface: v('surface'),
      ink: scale('ink', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
      brand: scale('brand', [50, 100, 500, 600, 700]),
      overlay: v('overlay'),
      icone: v('icone'),
    },
    spacing,
    opacity,
    borderColor: ({ theme }) => ({ ...theme('colors'), DEFAULT: 'currentColor' }),
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'ui-sans-serif', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: { xs: '0.125rem', sm: '0.25rem', DEFAULT: '0.25rem', '4xl': '2rem' },
      boxShadow: {
        '2xs': '0 1px rgb(0 0 0 / 0.05)',
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
      blur: { xs: '4px', sm: '8px', DEFAULT: '8px' },
      backdropBlur: { xs: '4px', sm: '8px', DEFAULT: '8px' },
      ringWidth: { DEFAULT: '1px' },
    },
  },
  plugins: [],
}

export default config
