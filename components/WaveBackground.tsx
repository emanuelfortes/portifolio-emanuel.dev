"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  varying vec3 vPos;
  varying float vH;
  // ruído de valor + fbm
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for(int i = 0; i < 6; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
  float ridge(vec2 p){
    float v = 0.0, a = 0.55;
    for(int i = 0; i < 4; i++){
      v += a * (1.0 - abs(2.0 * noise(p) - 1.0));
      p *= 2.1; a *= 0.5;
    }
    return v;
  }
  void main(){
    vec3 pos = position;
    vec2 q = pos.xy * 0.22;
    float t = uTime * 0.25;
    float h = fbm(q + vec2(t * 0.6, t * 0.3));
    h += 0.5 * fbm(q * 2.1 - vec2(t * 0.4, t * 0.7));
    h += 0.7 * ridge(q * 1.3 + vec2(t * 0.25, -t * 0.35));   // cristas afiadas
    h += 0.18 * sin(pos.x * 1.4 + uTime * 0.8) * sin(pos.y * 0.9 + uTime * 0.5); // ondulação longa
    float swell = fbm(q * 0.35 + t * 0.1);                    // morros grandes
    h *= 0.8 + swell * 1.1;
    pos.z += h;
    vH = h;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }`;

const fragmentShader = `
  varying vec3 vPos;
  varying float vH;
  void main(){
    vec3 dx = dFdx(vPos), dy = dFdy(vPos);
    vec3 n = normalize(cross(dx, dy));
    vec3 lightDir = normalize(vec3(0.3, 0.8, 0.6));
    float diff = clamp(dot(n, lightDir), 0.0, 1.0);
    vec3 viewDir = normalize(-vPos);
    float spec = pow(clamp(dot(reflect(-lightDir, n), viewDir), 0.0, 1.0), 24.0);
    vec3 deep   = vec3(0.06, 0.03, 0.13);
    vec3 violet = vec3(0.42, 0.25, 0.75);
    vec3 lilac  = vec3(0.78, 0.62, 0.98);
    vec3 col = mix(deep, violet, clamp(vH * 0.9, 0.0, 1.0));
    col = mix(col, lilac, pow(clamp(vH - 0.6, 0.0, 1.0), 1.6));
    col *= 0.35 + 0.85 * diff;
    col += spec * vec3(0.9, 0.8, 1.0) * 0.5;
    // fog para o fundo escuro
    float fog = smoothstep(6.0, 26.0, length(vPos));
    col = mix(col, vec3(0.031, 0.024, 0.051), fog);
    gl_FragColor = vec4(col, 1.0);
  }`;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Graus de inclinação para deslocamento máximo. Baixo de propósito: a ideia
 *  é reagir a um movimento leve do pulso, não exigir virar o aparelho. */
const TILT_MAX = 14;

export default function WaveBackground() {
  const hostRef = useRef<HTMLDivElement>(null);
  /* Alvo da câmera (-1..1). Mouse, giroscópio e scroll escrevem aqui;
     o loop de render só lê. */
  const alvo = useRef({ tx: 0, ty: 0 });
  /* Preenchido pelo efeito de controles quando o iOS exige permissão. */
  const pedirRef = useRef<null | (() => void)>(null);
  const [precisaPermissao, setPrecisaPermissao] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  /* ---------- cena three.js ---------- */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Posição suavizada que persegue o alvo
    let mx = 0;
    let my = 0;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // Sem WebGL: mantém apenas o fundo sólido do card
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x08060d, 6, 30);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 1.6, 8);
    camera.lookAt(0, 0.2, 0);

    const uniforms = { uTime: { value: 0 } };
    const geo = new THREE.PlaneGeometry(60, 30, 220, 110);
    const mat = new THREE.ShaderMaterial({
      uniforms,
      fog: false,
      vertexShader,
      fragmentShader,
      extensions: { derivatives: true } as { derivatives: boolean },
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2.15;
    mesh.position.y = -0.8;
    scene.add(mesh);

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const clock = new THREE.Clock();
    // Tempo próprio: só avança enquanto desenhamos, e o delta é limitado para
    // que uma pausa (aba oculta / card fora de tela) não cause um salto na onda.
    let elapsed = 0;
    const draw = () => {
      elapsed += Math.min(clock.getDelta(), 0.05);
      uniforms.uTime.value = elapsed;
      // suaviza e desloca a câmera na direção do alvo (mouse, giroscópio ou scroll)
      mx += (alvo.current.tx - mx) * 0.05;
      my += (alvo.current.ty - my) * 0.05;
      camera.position.x = mx * 4.5;
      camera.position.y = 1.6 - my * 0.7;
      camera.lookAt(mx * 1.2, 0.2, 0);
      renderer.render(scene, camera);
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    if (reduceMotion) {
      // Um único quadro estático
      draw();
    } else {
      const loop = () => {
        raf = requestAnimationFrame(loop);
        draw();
      };

      // Só anima enquanto o card está visível, para não gastar GPU à toa
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !raf) {
            clock.getDelta(); // zera o delta acumulado durante a pausa
            loop();
          } else if (!entry.isIntersecting && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        },
        { threshold: 0 }
      );
      io.observe(host);

      return () => {
        io.disconnect();
        cancelAnimationFrame(raf);
        ro.disconnect();
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  /* ---------- controles: mouse no desktop, inclinação no celular ---------- */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const t = alvo.current;

    // Ponteiro fino = mouse/trackpad. Celular cai no ramo de inclinação.
    const temMouse = window.matchMedia("(pointer: fine)").matches;

    /* --- desktop: segue o cursor dentro do card --- */
    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      const dentro =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      t.tx = dentro ? ((e.clientX - r.left) / r.width - 0.5) * 2 : 0;
      t.ty = dentro ? ((e.clientY - r.top) / r.height - 0.5) * 2 : 0;
    };

    /* --- celular: inclinação do aparelho --- */
    let recebeuGiro = false;
    let base: { g: number; b: number } | null = null;

    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      recebeuGiro = true;
      // A primeira leitura vira o "neutro", então funciona em qualquer
      // ângulo em que a pessoa esteja segurando o aparelho.
      if (!base) {
        base = { g: e.gamma, b: e.beta };
        return;
      }
      const dg = e.gamma - base.g; // inclinar para os lados
      const db = e.beta - base.b; // inclinar para frente/trás

      // gamma/beta são relativos ao aparelho: remapeia conforme a tela girou
      const ang = window.screen?.orientation?.angle ?? 0;
      let x = dg;
      let y = db;
      if (ang === 90) { x = -db; y = dg; }
      else if (ang === 270 || ang === -90) { x = db; y = -dg; }
      else if (ang === 180) { x = -dg; y = -db; }

      t.tx = clamp(x / TILT_MAX, -1, 1);
      t.ty = clamp(y / TILT_MAX, -1, 1);
    };

    /* --- fallback: sem giroscópio, a onda acompanha o scroll --- */
    const onScroll = () => {
      if (recebeuGiro) return; // giroscópio tem prioridade
      const r = host.getBoundingClientRect();
      const centroCard = r.top + r.height / 2;
      const centroTela = window.innerHeight / 2;
      t.ty = clamp((centroCard - centroTela) / centroTela, -1, 1);
    };

    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<PermissionState | string>;
    };
    const exigePermissao = typeof DOE?.requestPermission === "function";

    let limparCard: (() => void) | null = null;

    if (temMouse) {
      document.addEventListener("mousemove", onMove);
    } else {
      // iOS 13+ só entrega os eventos após permissão vinda de um toque
      if (exigePermissao) {
        setPrecisaPermissao(true);

        const pedir = async () => {
          try {
            const r = await DOE.requestPermission!();
            if (r === "granted") {
              window.addEventListener("deviceorientation", onOrient);
              setPrecisaPermissao(false);
              setAviso(null);
              limparCard?.();
            } else {
              setAviso("Permissão negada para o sensor de movimento.");
            }
          } catch {
            setAviso("Este navegador não liberou o sensor de movimento.");
          }
        };
        pedirRef.current = pedir;

        /* O botão sozinho passa despercebido, então qualquer toque no card
           também dispara o pedido — o iOS exige que venha de um gesto.
           Cliques em links/botões são ignorados para não atrapalhar os CTAs. */
        const card = host.parentElement;
        const aoTocar = (e: Event) => {
          if ((e.target as HTMLElement)?.closest("a,button")) return;
          pedir();
        };
        card?.addEventListener("click", aoTocar);
        limparCard = () => card?.removeEventListener("click", aoTocar);
      } else {
        window.addEventListener("deviceorientation", onOrient);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    return () => {
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("deviceorientation", onOrient);
      window.removeEventListener("scroll", onScroll);
      limparCard?.();
      pedirRef.current = null;
    };
  }, []);

  return (
    <>
      <div
        ref={hostRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      />

      {/* Só aparece no iOS, que exige um toque para liberar o giroscópio.
          z-20 para ficar acima do véu, que vem depois no DOM. */}
      {precisaPermissao && (
        <button
          type="button"
          onClick={() => pedirRef.current?.()}
          className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-lilac/40 bg-ink-cta/85 px-4 py-2.5 text-xs font-semibold text-txt shadow-nav backdrop-blur-sm active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-lilac"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <rect x="7" y="2" width="10" height="20" rx="2" />
            <path d="M2 12h2M20 12h2M4.5 8.5 2.5 12l2 3.5M19.5 8.5l2 3.5-2 3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Toque e incline o celular
        </button>
      )}

      {aviso && (
        <p className="absolute bottom-5 left-1/2 z-20 w-[85%] -translate-x-1/2 text-center text-[11px] leading-snug text-txt-muted">
          {aviso}
        </p>
      )}
    </>
  );
}
