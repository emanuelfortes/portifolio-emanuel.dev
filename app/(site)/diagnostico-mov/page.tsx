"use client";

/**
 * Página temporária de diagnóstico do sensor de movimento.
 * Serve para descobrir, no aparelho real, por que a inclinação não funciona.
 * Pode apagar a pasta app/diagnostico-mov quando resolvermos.
 */

import { useEffect, useRef, useState } from "react";

type Linha = { rotulo: string; valor: string; ok?: boolean };

export default function DiagnosticoMovimento() {
  const [ambiente, setAmbiente] = useState<Linha[]>([]);
  const [permissao, setPermissao] = useState("ainda não solicitada");
  const [eventos, setEventos] = useState(0);
  const [leitura, setLeitura] = useState<{
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  } | null>(null);
  const [extremos, setExtremos] = useState({ gMin: 0, gMax: 0, bMin: 0, bMax: 0 });
  const ligado = useRef(false);

  useEffect(() => {
    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    setAmbiente([
      {
        rotulo: "HTTPS (contexto seguro)",
        valor: String(window.isSecureContext),
        ok: window.isSecureContext,
      },
      {
        rotulo: "DeviceOrientationEvent existe",
        valor: String(typeof window.DeviceOrientationEvent !== "undefined"),
        ok: typeof window.DeviceOrientationEvent !== "undefined",
      },
      {
        rotulo: "requestPermission existe (iOS 13+)",
        valor: String(typeof DOE?.requestPermission === "function"),
      },
      {
        rotulo: "(pointer: fine) — true seria desktop",
        valor: String(window.matchMedia("(pointer: fine)").matches),
        ok: !window.matchMedia("(pointer: fine)").matches,
      },
      {
        rotulo: "prefers-reduced-motion: reduce",
        valor: String(window.matchMedia("(prefers-reduced-motion: reduce)").matches),
        ok: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      },
      {
        rotulo: "screen.orientation.angle",
        valor: String(window.screen?.orientation?.angle ?? "indisponível"),
      },
      { rotulo: "userAgent", valor: navigator.userAgent },
    ]);

    // Em Android/desktop os eventos vêm sem pedir permissão
    const DOE2 = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DOE2?.requestPermission !== "function") {
      ligar();
    }
    return () => {
      window.removeEventListener("deviceorientation", onOrient);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onOrient = (e: DeviceOrientationEvent) => {
    setEventos((n) => n + 1);
    setLeitura({ alpha: e.alpha, beta: e.beta, gamma: e.gamma });
    setExtremos((x) => ({
      gMin: Math.min(x.gMin, e.gamma ?? 0),
      gMax: Math.max(x.gMax, e.gamma ?? 0),
      bMin: Math.min(x.bMin, e.beta ?? 0),
      bMax: Math.max(x.bMax, e.beta ?? 0),
    }));
  };

  const ligar = () => {
    if (ligado.current) return;
    ligado.current = true;
    window.addEventListener("deviceorientation", onOrient);
  };

  const pedir = async () => {
    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof DOE?.requestPermission !== "function") {
      setPermissao("não é necessária neste navegador");
      ligar();
      return;
    }
    try {
      const r = await DOE.requestPermission();
      setPermissao(`retornou: "${r}"`);
      if (r === "granted") ligar();
    } catch (err) {
      setPermissao(
        `ERRO: ${err instanceof Error ? err.name + " — " + err.message : String(err)}`
      );
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-xl px-5 py-10 font-mono text-[13px] leading-relaxed">
      <h1 className="mb-1 font-sans text-2xl font-semibold">Diagnóstico de movimento</h1>
      <p className="mb-6 text-txt-muted">
        Abra no iPhone, toque no botão e me mande um print desta tela.
      </p>

      <button
        onClick={pedir}
        className="mb-6 w-full rounded-btn bg-violet px-6 py-4 text-center font-sans text-base font-semibold text-white"
      >
        1. Tocar aqui para pedir permissão
      </button>

      <div className="mb-6 rounded-card border border-lilac/20 bg-surface p-4">
        <div className="text-txt-muted">Resultado da permissão</div>
        <div className="mt-1 break-words text-lilac-light">{permissao}</div>
      </div>

      <div className="mb-6 rounded-card border border-lilac/20 bg-surface p-4">
        <div className="mb-2 text-txt-muted">
          2. Agora incline o aparelho para os lados
        </div>
        <div className="text-lg">
          eventos recebidos:{" "}
          <span className={eventos > 0 ? "text-green-400" : "text-red-400"}>
            {eventos}
          </span>
        </div>
        {leitura && (
          <div className="mt-2 space-y-0.5">
            <div>alpha: {leitura.alpha?.toFixed(1) ?? "null"}</div>
            <div>
              beta (frente/trás): {leitura.beta?.toFixed(1) ?? "null"}{" "}
              <span className="text-txt-label">
                [min {extremos.bMin.toFixed(0)} / max {extremos.bMax.toFixed(0)}]
              </span>
            </div>
            <div>
              gamma (lados): {leitura.gamma?.toFixed(1) ?? "null"}{" "}
              <span className="text-txt-label">
                [min {extremos.gMin.toFixed(0)} / max {extremos.gMax.toFixed(0)}]
              </span>
            </div>
          </div>
        )}
        {eventos > 0 && (
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-lilac/10">
            <div
              className="h-full rounded-full bg-grad-skill transition-[margin] duration-100"
              style={{
                width: "12%",
                marginLeft: `${Math.min(88, Math.max(0, ((leitura?.gamma ?? 0) + 45) / 90 * 88))}%`,
              }}
            />
          </div>
        )}
      </div>

      <div className="rounded-card border border-lilac/20 bg-surface p-4">
        <div className="mb-2 text-txt-muted">Ambiente</div>
        {ambiente.map((l) => (
          <div key={l.rotulo} className="mb-2 break-words">
            <span className="text-txt-label">{l.rotulo}:</span>{" "}
            <span
              className={
                l.ok === undefined
                  ? "text-txt"
                  : l.ok
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {l.valor}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
