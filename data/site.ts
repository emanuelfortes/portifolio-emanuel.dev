/** Configuração central da marca e dos canais de contato. */

/** Domínio de produção. Sobrescreva com NEXT_PUBLIC_SITE_URL se mudar. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://fortesdev.com.br");

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
