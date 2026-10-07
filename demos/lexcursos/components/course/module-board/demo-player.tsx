"use client";
import { useEffect, useState } from "react";
import { Play, Pause, Volume2, Maximize, Settings } from "lucide-react";
import { cn } from "@/demos/lexcursos/lib/cn";
import { formatClock } from "./utils";

// Réplica: no original o preview toca o vídeo do Bunny (HLS) no player do aluno.
// Aqui não há vídeo — o player simula a reprodução (tempo correndo, pausa, barra).
export function DemoVideoPlayer({ title, duration, autoPlay = false, className }: { title: string; duration: number | null; autoPlay?: boolean; className?: string }) {
  const total = duration ?? 600;
  const [playing, setPlaying] = useState(autoPlay);
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((v) => (v + 1 >= total ? total : v + 1)), 1000);
    return () => clearInterval(id);
  }, [playing, total]);

  const pct = Math.min(100, (t / total) * 100);

  return (
    <div className={cn("group/player relative aspect-video w-full select-none overflow-hidden bg-black", className)} onClick={() => setPlaying((p) => !p)}>
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_20%,#2a3a50_0%,#0f1620_60%,#05080c_100%)]" />
      <div className="absolute inset-0 bg-grid opacity-[0.06]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center">
        <span className="rounded bg-brand px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-white">LEX</span>
        <p className="line-clamp-2 text-sm font-bold text-white/90">{title}</p>
        {!playing && (
          <span className="mt-1 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-[0_8px_24px_rgba(242,106,27,.45)]">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </span>
        )}
      </div>
      <div className="player-controls absolute inset-x-0 bottom-0 px-3 pb-2 pt-8">
        <div className="h-[3px] rounded-full bg-white/25"><div className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear" style={{ width: `${pct}%` }} /></div>
        <div className="mt-1.5 flex items-center gap-3 text-white/85">
          <button type="button" aria-label={playing ? "Pausar" : "Reproduzir"} onClick={(e) => { e.stopPropagation(); setPlaying((p) => !p); }}>
            {playing ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
          </button>
          <Volume2 className="h-3.5 w-3.5" />
          <span className="text-[10px] tabular-nums">{formatClock(t) || "00:00"} / {formatClock(total)}</span>
          <span className="ml-auto flex items-center gap-3">
            <Settings className="h-3.5 w-3.5" />
            <Maximize className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
