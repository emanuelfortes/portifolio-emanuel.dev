/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Permite subir mais de um servidor de desenvolvimento ao mesmo tempo
     (um por réplica), cada um com a própria pasta de build. */
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
