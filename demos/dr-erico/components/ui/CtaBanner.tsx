import { MessageCircle } from 'lucide-react'
import { site } from '@/demos/dr-erico/data/site'

type Props = {
  title?: string
  buttonLabel?: string
}

export default function CtaBanner({
  title = 'Marque agora sua consulta com o Dr. Érico Diógenes',
  buttonLabel = 'Agendar no Whatsapp',
}: Props) {
  return (
    <section className="py-12" data-aos="fade-up">
      <div className="container-site">
        <div className="bg-brand-navy text-white rounded-3xl px-6 py-12 md:px-16 text-center">
          <h3 className="font-display text-2xl md:text-3xl">{title}</h3>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-silver mt-6">
            <MessageCircle size={18} />
            {buttonLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
