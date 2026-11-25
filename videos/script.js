import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PERFIL, HABILIDADES, PROYECTOS } from './datos.js';

const ULTRAMAR = 0x3437f2;
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================
   VISOR 3D (se usa en la portada y en la ventana de modelos)
   ========================================================== */
function crearVisor(container, ruta, { arcilla = false, zoom = false, autoRotar = true } = {}) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  if (arcilla) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
  container.appendChild(renderer.domElement);

  const estado = document.createElement('div');
  estado.className = 'visor-estado';
  estado.textContent = 'Cargando modelo…';
  container.appendChild(estado);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.rotateSpeed = 0.8;
  controls.enablePan = false;
  controls.enableZoom = zoom;
  controls.autoRotate = autoRotar && !reducirMovimiento;
  controls.autoRotateSpeed = 1.4;
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = Math.PI - 0.2;
  // En la portada se permite hacer scroll vertical con el dedo sobre el modelo
  renderer.domElement.style.touchAction = zoom ? 'none' : 'pan-y';

  // Iluminación
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8bcc6, arcilla ? 1.1 : 1.4));
  const sol = new THREE.DirectionalLight(0xffffff, arcilla ? 2.2 : 1.6);
  sol.position.set(4, 7, 5);
  if (arcilla) {
    sol.castShadow = true;
    sol.shadow.mapSize.set(1024, 1024);
    sol.shadow.radius = 8;
    sol.shadow.bias = -0.0005;
    Object.assign(sol.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 });
  }
  scene.add(sol);

  let modelo = null;
  const sombraPlano = arcilla ? new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.22 })) : null;
  if (sombraPlano) {
    sombraPlano.rotation.x = -Math.PI / 2;
    sombraPlano.receiveShadow = true;
    scene.add(sombraPlano);
  }

  const loader = new GLTFLoader();
  loader.load(
    ruta,
    (gltf) => {
      estado.remove();
      modelo = gltf.scene;

      modelo.traverse((hijo) => {
        if (!hijo.isMesh) return;
        if (arcilla) {
          // Material de arcilla mate + aristas ultramar
          hijo.material = new THREE.MeshStandardMaterial({ color: 0xf1f2f4, roughness: 0.85, metalness: 0 });
          hijo.castShadow = true;
          const aristas = new THREE.LineSegments(
            new THREE.EdgesGeometry(hijo.geometry, 25),
            new THREE.LineBasicMaterial({ color: ULTRAMAR })
          );
          hijo.add(aristas);
          const interior = new THREE.LineSegments(
            new THREE.EdgesGeometry(hijo.geometry, 25),
            new THREE.LineBasicMaterial({ color: ULTRAMAR, transparent: true, opacity: 0.35 })
          );
          interior.scale.setScalar(0.55);
          hijo.add(interior);
        } else if (hijo.material) {
          const m = hijo.material;
          if (m.map) m.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
          // Modelos sin material ni textura (como el cubo de Blender por defecto): se aclaran
          if (!m.map && !m.name && m.metalness !== undefined) { m.metalness = 0.1; m.roughness = 0.6; m.color.set(0xe9eaee); }
        }
      });

      scene.add(modelo);

      // Centrar en el origen
      const caja = new THREE.Box3().setFromObject(modelo);
      const centro = caja.getCenter(new THREE.Vector3());
      const tam = caja.getSize(new THREE.Vector3());
      modelo.position.sub(centro);

      const maxDim = Math.max(tam.x, tam.y, tam.z) || 1;
      distancia = (maxDim / 2 / Math.tan((camera.fov * Math.PI) / 360)) * 2.1;
      if (sombraPlano) sombraPlano.position.y = -tam.y / 2 - maxDim * 0.55;
      ajustarCamara(true);
      if (arcilla) container.classList.add('listo');
    },
    undefined,
    (error) => {
      console.error(`No se pudo cargar el modelo "${ruta}":`, error);
      estado.innerHTML = `No se encontró el modelo.<br>Revisa que exista <code>${ruta}</code>`;
    }
  );

  let distancia = 6;
  function ajustarCamara(inicial) {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // En pantallas verticales se aleja la cámara para que el modelo quepa de ancho
    const factor = camera.aspect < 1 ? 1 / camera.aspect : 1;
    if (inicial) {
      camera.position.set(0.6, 0.45, 1).normalize().multiplyScalar(distancia * Math.min(factor, 2.2));
      controls.target.set(0, 0, 0);
    }
    camera.updateProjectionMatrix();
    controls.update();
  }

  const ro = new ResizeObserver(() => ajustarCamara(false));
  ro.observe(container);

  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(container);

  let activo = true;
  const reloj = new THREE.Clock();
  (function animar() {
    if (!activo) return;
    requestAnimationFrame(animar);
    if (!visible) return;
    const t = reloj.getElapsedTime();
    // El modelo flota suavemente en la portada
    if (modelo && arcilla && !reducirMovimiento) modelo.position.y = Math.sin(t * 0.9) * 0.12;
    controls.update();
    renderer.render(scene, camera);
  })();

  return {
    dispose() {
      activo = false;
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      renderer.dispose();
      container.replaceChildren();
    },
  };
}

/* ==========================================================
   CONTENIDO (todo viene de datos.js)
   ========================================================== */
const $ = (id) => document.getElementById(id);

function pintarPerfil() {
  document.title = `${PERFIL.nombre} · Portafolio`;
  $('marca').textContent = PERFIL.nombre;
  $('pie-nombre').textContent = `© ${new Date().getFullYear()} ${PERFIL.nombre}`;

  $('nombre').innerHTML = PERFIL.nombre
    .split(' ')
    .map((p) => `<span><i></i></span>`)
    .join('');
  PERFIL.nombre.split(' ').forEach((palabra, i) => { $('nombre').children[i].firstChild.textContent = palabra; });
  if ($('nombre').children[1]) $('nombre').children[1].classList.add('nombre-outline');
  $('nombre').setAttribute('aria-label', PERFIL.nombre);

  $('rol').textContent = PERFIL.rol;
  $('intro').textContent = PERFIL.intro;

  $('sobre-texto').replaceChildren(...PERFIL.sobreMi.map((t) => Object.assign(document.createElement('p'), { textContent: t })));

  $('ficha').replaceChildren(...PERFIL.ficha.map((f) => {
    const d = document.createElement('div');
    d.innerHTML = '<dt></dt><dd></dd>';
    d.firstChild.textContent = f.campo;
    d.lastChild.textContent = f.valor;
    return d;
  }));

  $('correo').textContent = PERFIL.correo;
  $('correo').href = `mailto:${PERFIL.correo}`;
  $('enlaces').replaceChildren(...PERFIL.enlaces.map((e) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = e.texto;
    a.href = e.url;
    if (!e.url.startsWith('mailto:')) { a.target = '_blank'; a.rel = 'noopener'; }
    li.append(a);
    return li;
  }));
}

function pintarHabilidades() {
  $('grupos').replaceChildren(...HABILIDADES.map((g) => {
    const art = document.createElement('article');
    art.className = 'grupo';
    const h = document.createElement('h3');
    h.textContent = g.grupo;
    const ul = document.createElement('ul');
    g.items.forEach((it) => {
      const li = document.createElement('li');
      const n = document.createElement('span');
      n.textContent = it.nombre;
      const nivel = document.createElement('span');
      nivel.className = 'nivel';
      nivel.setAttribute('role', 'img');
      nivel.setAttribute('aria-label', `Nivel ${it.nivel} de 5`);
      for (let i = 1; i <= 5; i++) {
        const p = document.createElement('i');
        if (i <= it.nivel) p.className = 'on';
        nivel.append(p);
      }
      li.append(n, nivel);
      ul.append(li);
    });
    art.append(h, ul);
    return art;
  }));
}

/* ---------- Galería ---------- */
const TIPOS = {
  modelo: { etiqueta: 'Modelo 3D', filtro: 'Modelos 3D' },
  render: { etiqueta: 'Render', filtro: 'Renders' },
  video: { etiqueta: 'Video', filtro: 'Videos' },
  foto: { etiqueta: 'Foto', filtro: 'Fotos' },
};
let filtroActual = 'todos';

function placeholder(archivo, tipo) {
  const d = document.createElement('div');
  d.className = 'ph';
  d.innerHTML = '<b></b><span>Falta el archivo</span><code></code>';
  d.querySelector('b').textContent = TIPOS[tipo].etiqueta;
  d.querySelector('code').textContent = archivo || '(sin archivo)';
  return d;
}

function miniaturaDe(p) {
  return p.miniatura || (p.tipo === 'render' || p.tipo === 'foto' ? p.src : null);
}

function pintarGaleria() {
  const filtros = $('filtros');
  const conteo = (t) => PROYECTOS.filter((p) => t === 'todos' || p.tipo === t).length;
  const opciones = [['todos', 'Todos'], ...Object.entries(TIPOS).map(([k, v]) => [k, v.filtro])].filter(([k]) => conteo(k) > 0);
  filtros.replaceChildren(...opciones.map(([clave, texto]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.dataset.filtro = clave;
    b.setAttribute('aria-selected', String(clave === filtroActual));
    b.innerHTML = `${texto}<small>${conteo(clave)}</small>`;
    return b;
  }));
  filtros.onclick = (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    filtroActual = b.dataset.filtro;
    filtros.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    aplicarFiltro();
  };

  $('galeria').replaceChildren(...PROYECTOS.map((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tarjeta';
    b.dataset.tipo = p.tipo;
    b.dataset.indice = i;
    b.setAttribute('aria-label', `${p.titulo}, ${TIPOS[p.tipo].etiqueta}. Abrir`);

    const mini = miniaturaDe(p);
    if (mini) {
      const img = new Image();
      img.src = mini;
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = () => img.replaceWith(placeholder(mini, p.tipo));
      b.append(img);
    } else {
      b.append(placeholder(p.tipo === 'modelo' ? 'Opcional: img/miniatura.jpg' : p.src, p.tipo));
    }

    const pie = document.createElement('div');
    pie.className = 'tarjeta-pie';
    pie.innerHTML = '<h3></h3><span class="tipo"></span>';
    pie.querySelector('h3').textContent = p.titulo;
    const tipo = pie.querySelector('.tipo');
    tipo.textContent = TIPOS[p.tipo].etiqueta;
    tipo.classList.add(p.tipo);
    b.append(pie);
    return b;
  }));

  $('galeria').onclick = (e) => {
    const t = e.target.closest('.tarjeta');
    if (t) abrirModal(Number(t.dataset.indice));
  };
  aplicarFiltro();
}

function aplicarFiltro() {
  let n = 0;
  document.querySelectorAll('.tarjeta').forEach((t) => {
    const ok = filtroActual === 'todos' || t.dataset.tipo === filtroActual;
    t.hidden = !ok;
    t.classList.remove('ancha');
    if (ok) { if (n % 5 === 0) t.classList.add('ancha'); n++; }
  });
}

/* ---------- Ventana de proyecto ---------- */
const modal = $('modal');
let indiceActual = 0;
let visorModal = null;

function indicesVisibles() {
  return PROYECTOS.map((p, i) => i).filter((i) => filtroActual === 'todos' || PROYECTOS[i].tipo === filtroActual);
}

function embedDe(url) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

function abrirModal(i) {
  indiceActual = i;
  const p = PROYECTOS[i];
  const medio = $('modal-medio');
  visorModal?.dispose();
  visorModal = null;
  medio.replaceChildren();

  if (p.tipo === 'modelo') {
    const cont = document.createElement('div');
    cont.className = 'visor-modal';
    medio.append(cont);
    visorModal = crearVisor(cont, p.src, { zoom: true });
  } else if (p.tipo === 'video') {
    const embed = embedDe(p.src);
    if (embed) {
      const f = document.createElement('iframe');
      f.src = embed;
      f.title = p.titulo;
      f.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      medio.append(f);
    } else {
      const v = document.createElement('video');
      v.src = p.src;
      v.controls = true;
      v.playsInline = true;
      if (p.miniatura) v.poster = p.miniatura;
      v.onerror = () => medio.replaceChildren(placeholder(p.src, 'video'));
      medio.append(v);
    }
  } else {
    const img = new Image();
    img.src = p.src;
    img.alt = p.titulo;
    img.onerror = () => medio.replaceChildren(placeholder(p.src, p.tipo));
    medio.append(img);
  }

  $('modal-tipo').textContent = `${TIPOS[p.tipo].etiqueta}${p.anio ? `, ${p.anio}` : ''}`;
  $('modal-titulo').textContent = p.titulo;
  $('modal-desc').textContent = p.descripcion || '';
  $('modal-herr').textContent = p.herramientas?.length ? `Hecho con ${p.herramientas.join(', ')}` : '';
  if (!modal.open) modal.showModal();
}

function mover(delta) {
  const lista = indicesVisibles();
  const pos = lista.indexOf(indiceActual);
  abrirModal(lista[(pos + delta + lista.length) % lista.length]);
}

function cerrarModal() {
  modal.close();
}
modal.addEventListener('close', () => {
  visorModal?.dispose();
  visorModal = null;
  $('modal-medio').replaceChildren(); // detiene videos
});
$('modal-cerrar').onclick = cerrarModal;
$('modal-ant').onclick = () => mover(-1);
$('modal-sig').onclick = () => mover(1);
modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
modal.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') mover(-1);
  if (e.key === 'ArrowRight') mover(1);
});

/* ---------- Inicio ---------- */
pintarPerfil();
pintarHabilidades();
pintarGaleria();
// La portada utiliza la imagen real del proyecto de la espada en la piedra.

/* Selector de idioma: español predeterminado / inglés opcional */
const languageButton = $('language-toggle');
let currentLanguage = 'es';
const copy = {
  es: {
    nav: ['Sobre mí','Habilidades','Proyectos','Formación','Contacto'],
    heroRole: 'Futuro diseñador de videojuegos · Artista 3D',
    heroIntro: 'Diseño personajes, modelo mundos y doy vida a ideas a través de experiencias interactivas.',
    projectButton: 'Explorar proyectos', aboutButton: 'Conóceme',
    aboutTitle: 'Ideas que toman|forma y movimiento.', about: [
      'Soy estudiante de tercer año de Ingeniería en Realidad Virtual y Diseño de Videojuegos en la Universidad Bernardo O’Higgins, en Santiago de Chile.',
      'Me interesa especialmente el modelado y la animación 3D, el diseño de personajes y escenarios, y su aplicación en videojuegos. Me considero una persona dedicada, colaborativa y con muchas ganas de crear junto a otros.',
      'Mi objetivo a largo plazo es fundar mi propio estudio de videojuegos y desarrollar mundos y experiencias que conecten con las personas.'
    ],
    skillsTitle: 'Mi caja de|herramientas.', skillsLead: 'Tecnología, arte y pensamiento creativo trabajando en conjunto.',
    projectsTitle: 'Proyectos|destacados.', projectsLead: 'Una muestra de procesos, experimentos y creación digital.',
    formationTitle: 'Mi|formación.', contactPre: '¿Tienes una idea o proyecto?', contactTitle: 'Hablemos', contactText: 'Abierto a conectar, aprender y colaborar en nuevos desafíos creativos.',
    scroll: 'DESPLAZAR PARA EXPLORAR', note: 'Este portafolio está en crecimiento. Nuevos proyectos se incorporarán a medida que avance mi proceso creativo.',
    projectName: 'La espada en la piedra', projectDesc: 'Proyecto de modelado y animación 3D realizado en Blender. El trabajo contempla la creación y el texturizado de la espada y la piedra, además de una animación en la que la espada sale de la roca y realiza movimientos en el aire. La imagen muestra el modelo desarrollado; no se incluye video de la animación.'
  },
  en: {
    nav: ['About','Skills','Projects','Education','Contact'],
    heroRole: 'Aspiring Game Designer · 3D Artist',
    heroIntro: 'I design characters, build worlds and bring ideas to life through interactive experiences.',
    projectButton: 'Explore projects', aboutButton: 'About me',
    aboutTitle: 'Ideas that take|shape and motion.', about: [
      'I am a third-year Virtual Reality and Video Game Design Engineering student at Universidad Bernardo O’Higgins in Santiago, Chile.',
      'I am especially interested in 3D modeling and animation, character and environment design, and their application in video games. I consider myself dedicated, collaborative and eager to create alongside others.',
      'My long-term goal is to found my own video game studio and develop worlds and experiences that connect with people.'
    ],
    skillsTitle: 'My creative|toolkit.', skillsLead: 'Technology, art and creative thinking working together.',
    projectsTitle: 'Featured|projects.', projectsLead: 'A selection of processes, experiments and digital creation.',
    formationTitle: 'My|education.', contactPre: 'Have an idea or a project?', contactTitle: 'Let’s talk', contactText: 'Open to connecting, learning and collaborating on new creative challenges.',
    scroll: 'SCROLL TO EXPLORE', note: 'This portfolio is a work in progress. New projects will be added as my creative journey continues.',
    projectName: 'The Sword in the Stone', projectDesc: 'A 3D modeling and animation project created in Blender. It includes modeling and texturing the sword and stone, along with an animation in which the sword rises from the rock and moves through the air. The image shows the finished model; an animation video is not included.'
  }
};
function setLanguage(lang) {
  currentLanguage = lang;
  const t = copy[lang];
  document.documentElement.lang = lang;
  languageButton.innerHTML = lang === 'es' ? 'ES <span>/ EN</span>' : 'EN <span>/ ES</span>';
  document.querySelectorAll('.barra nav a').forEach((a,i)=>{ if(t.nav[i]) a.childNodes[0].textContent = t.nav[i] + (i===4?' ':''); });
  $('rol').textContent = t.heroRole; $('intro').textContent = t.heroIntro;
  document.querySelector('.boton-primary').innerHTML = `${t.projectButton} <span>↗</span>`;
  document.querySelector('.boton-ghost').innerHTML = `${t.aboutButton} <span>↓</span>`;
  const aboutTitle = document.querySelector('#sobre .titulo-seccion'); aboutTitle.innerHTML = t.aboutTitle.replace('|','<br><em>') + '</em>';
  $('sobre-texto').replaceChildren(...t.about.map(x=>Object.assign(document.createElement('p'),{textContent:x})));
  document.querySelector('#habilidades .titulo-seccion').innerHTML = t.skillsTitle.replace('|','<em>') + '</em>';
  document.querySelector('#habilidades .section-lead').textContent = t.skillsLead;
  document.querySelector('#proyectos .titulo-seccion').innerHTML = t.projectsTitle.replace('|','<em>') + '</em>';
  document.querySelector('#proyectos .section-lead').textContent = t.projectsLead;
  document.querySelector('#formacion .titulo-seccion').innerHTML = t.formationTitle.replace('|','<em>') + '</em>';
  document.querySelector('.contact-pre').textContent = t.contactPre;
  document.querySelector('.contacto h2').innerHTML = `${t.contactTitle}<span>.</span>`;
  document.querySelector('.contact-bottom p').textContent = t.contactText;
  document.querySelector('.scroll-cue').innerHTML = `<span></span> ${t.scroll}`;
  document.querySelector('.project-note').textContent = t.note;
  if (PROYECTOS[0]) { PROYECTOS[0].titulo = t.projectName; PROYECTOS[0].descripcion = t.projectDesc; }
  pintarGaleria();
}
languageButton?.addEventListener('click',()=>setLanguage(currentLanguage==='es'?'en':'es'));
