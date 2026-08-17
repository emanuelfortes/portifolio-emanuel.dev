/** Configuração central da marca e dos canais de contato. */

/**
 * Domínio público do site.
 *
 * WhatsApp, Facebook e X exigem URL absoluta em og:image, e essa URL precisa
 * ser pública. NÃO usar VERCEL_URL aqui: aquela URL é específica de cada deploy
 * e fica protegida por autenticação, então o robô do WhatsApp recebe um 302 de
 * login em vez da imagem e a prévia não aparece.
 *
 * Sobrescreva com NEXT_PUBLIC_SITE_URL se o domínio mudar.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fortesdev.com"
).replace(/\/$/, "");

/** Telefone no formato internacional, só dígitos (55 + DDD + número). */
export const whatsappNumber = "5585992004530";

/** Telefone formatado para exibição. */
export const whatsappDisplay = "(85) 99200-4530";

/** Mensagem que já vem preenchida ao abrir a conversa. */
export const whatsappMessage =
  "Olá, Emanuel! Vi seu portfólio e gostaria de conversar sobre um projeto.";

/** Link pronto para o WhatsApp (funciona no app e no navegador). */
export const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  whatsappMessage
)}`;

/** Link cru, sem mensagem, usado no header e no rodapé. */
export const whatsappBare = `https://wa.me/${whatsappNumber}`;

/** Perfis sociais. */
export const githubUrl = "https://github.com/emanuelfortes";
export const linkedinUrl = "https://www.linkedin.com/in/emanuel-fortes/";
