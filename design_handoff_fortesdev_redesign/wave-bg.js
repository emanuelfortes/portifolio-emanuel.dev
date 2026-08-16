// <wave-bg> — superfície de "água" roxa animada em three.js
customElements.define('wave-bg', class extends HTMLElement {
  async connectedCallback() {
    this.style.cssText += 'display:block;position:absolute;inset:0;overflow:hidden;pointer-events:none;';
    this._mx = 0; this._my = 0; this._tx = 0; this._ty = 0;
    this._onMove = (e) => {
      const r = this.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        this._tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        this._ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      } else { this._tx = 0; this._ty = 0; }
    };
    document.addEventListener('mousemove', this._onMove);
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    if (!this.isConnected) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    this.appendChild(renderer.domElement);
    this._renderer = renderer;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x08060d, 6, 30);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 1.6, 8);
    camera.lookAt(0, 0.2, 0);

    const uniforms = { uTime: { value: 0 } };
    const geo = new THREE.PlaneGeometry(60, 30, 220, 110);
    const mat = new THREE.ShaderMaterial({
      uniforms, fog: false,
      vertexShader: `
        uniform float uTime;
        varying vec3 vPos;
        varying float vH;
        // simplex-ish noise (value noise fbm)
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
        }`,
      fragmentShader: `
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
        }`
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2.15;
    mesh.position.y = -0.8;
    scene.add(mesh);

    const resize = () => {
      const w = this.clientWidth || 1, h = this.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    this._ro = new ResizeObserver(resize); this._ro.observe(this); resize();

    const clock = new THREE.Clock();
    const loop = () => {
      this._raf = requestAnimationFrame(loop);
      uniforms.uTime.value = clock.getElapsedTime();
      // suaviza e desloca a câmera com o mouse
      this._mx += (this._tx - this._mx) * 0.05;
      this._my += (this._ty - this._my) * 0.05;
      camera.position.x = this._mx * 4.5;
      camera.position.y = 1.6 - this._my * 0.7;
      camera.lookAt(this._mx * 1.2, 0.2, 0);
      renderer.render(scene, camera);
    };
    loop();
  }
  disconnectedCallback() {
    cancelAnimationFrame(this._raf);
    document.removeEventListener('mousemove', this._onMove);
    this._ro && this._ro.disconnect();
    this._renderer && this._renderer.dispose();
  }
});
