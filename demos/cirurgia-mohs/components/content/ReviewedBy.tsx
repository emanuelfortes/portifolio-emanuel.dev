import Markdown from "./Markdown";

/**
 * Bloco "Revisado por" (E-E-A-T e exigência do CFM).
 * O texto vem do próprio conteúdo; o site não exibe datas de publicação ou revisão.
 */
export default function ReviewedBy({ text }: { text: string }) {
  return (
    <div className="not-prose my-6 flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-4 sm:p-5" data-aos="fade-up">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-800 text-paper" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <path d="m9 12 2 2 4-4" />
          <path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6z" />
        </svg>
      </span>
      <div className="text-sm leading-relaxed text-navy-700">
        <Markdown md={text} className="[&_strong]:text-navy-900" />
      </div>
    </div>
  );
}
