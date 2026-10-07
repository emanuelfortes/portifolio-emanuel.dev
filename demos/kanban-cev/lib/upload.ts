/**
 * O "S3" da réplica.
 *
 * No original o navegador pede uma URL assinada e manda o arquivo direto ao
 * bucket. Aqui o arquivo fica no próprio navegador: a URL "assinada" é só uma
 * chave, e o envio guarda um `blob:` dela para a tela exibir a imagem.
 */
const arquivos = new Map<string, string>()

export async function enviarLocal(uploadUrl: string, init: { body: File; method?: string; headers?: Record<string, string> }) {
  const chave = uploadUrl.replace(/^local:/, '')
  arquivos.set(chave, URL.createObjectURL(init.body))
  return { ok: true }
}

/** URL exibível de um arquivo enviado nesta sessão, ou nula. */
export function urlLocal(fileKey: string | null | undefined): string | null {
  return fileKey ? (arquivos.get(fileKey) ?? null) : null
}
