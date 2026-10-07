import { MessageCircle } from 'lucide-react'

export default function FloatingWhatsapp() {
  return (
    <a
      href="https://wa.me/5585981781020"
      target="_blank"
      rel="noopener noreferrer"
      className="floating-wa"
      aria-label="Fale no WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  )
}
