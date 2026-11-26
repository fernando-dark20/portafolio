
export const PERFIL = {
  nombre: 'Fernando Cofre',
  rol: 'Futuro diseñador de videojuegos · Artista 3D',
  intro: 'Diseño personajes, modelo mundos y doy vida a ideas a través de experiencias interactivas.',
  modeloHero: 'modelos/Cube.glb',
  sobreMi: [
    'Soy estudiante de tercer año de Ingeniería en Realidad Virtual y Diseño de Videojuegos en la Universidad Bernardo O’Higgins, en Santiago de Chile.',
    'Me interesa especialmente el modelado y la animación 3D, el diseño de personajes y escenarios, y su aplicación en videojuegos. Me considero una persona dedicada, colaborativa y con muchas ganas de crear junto a otros.',
    'Mi objetivo a largo plazo es fundar mi propio estudio de videojuegos y desarrollar mundos y experiencias que conecten con las personas.'
  ],
  ficha: [
    { campo: 'Formación universitaria', valor: 'Ingeniería en Realidad Virtual y Diseño de Videojuegos · 3.er año' },
    { campo: 'Institución', valor: 'Universidad Bernardo O’Higgins' },
    { campo: 'Formación técnica', valor: 'Técnico de Nivel Medio en Telecomunicaciones' },
    { campo: 'Ubicación', valor: 'Santiago, Chile' },
    { campo: 'Intereses', valor: 'Modelado 3D, animación y videojuegos' },
    { campo: 'Meta profesional', valor: 'Crear mi propio estudio de videojuegos' }
  ],
  enlaces: [
    { texto: 'GitHub', url: 'https://github.com/fernando-dark20' },
    { texto: 'LinkedIn', url: 'https://www.linkedin.com/in/fernando-cofre-311839381/' },
    { texto: 'YouTube', url: 'https://www.youtube.com/@fernandocofre6684' },
    { texto: 'Correo', url: 'mailto:fernandosepulvedacofre@gmail.com' }
  ],
  correo: 'fernandosepulvedacofre@gmail.com'
};

export const HABILIDADES = [
  { grupo: 'Motores y desarrollo', items: [
    { nombre: 'Unity', nivel: 4 },
    { nombre: 'Unreal Engine', nivel: 4 },
    { nombre: 'GitHub', nivel: 4 },
    { nombre: 'Visual Studio', nivel: 4 },
    { nombre: 'Visual Studio Code', nivel: 4 }
  ]},
  { grupo: 'Programación', items: [
    { nombre: 'C++', nivel: 4 },
    { nombre: 'C#', nivel: 4 },
    { nombre: 'Python', nivel: 4 }
  ]},
  { grupo: 'Arte y diseño 3D', items: [
    { nombre: 'Blender', nivel: 4 },
    { nombre: 'Modelado y texturizado 3D', nivel: 4 },
    { nombre: 'Animación 3D', nivel: 4 },
    { nombre: 'Diseño de personajes y escenarios', nivel: 4 },
    { nombre: 'Photoshop', nivel: 4 }
  ]},
  { grupo: 'Competencias', items: [
    { nombre: 'Diseño de videojuegos', nivel: 4 },
    { nombre: 'Trabajo en equipo y compañerismo', nivel: 5 },
    { nombre: 'Creatividad y resolución de problemas', nivel: 4 }
  ]}
];

export const PROYECTOS = [
  {
    titulo: 'La espada en la piedra',
    tipo: 'foto',
    src: 'img/espada-en-la-piedra.png',
    descripcion: 'Proyecto de modelado y animación 3D realizado en Blender. El trabajo contempla la creación y el texturizado de la espada y la piedra, además de una animación en la que la espada sale de la roca y realiza movimientos en el aire. La imagen muestra el modelo desarrollado; no se incluye video de la animación.',
    herramientas: ['Blender', 'Modelado 3D', 'Texturizado', 'Animación'],
    anio: 2026
  },
  {
    titulo: 'Espada en la piedra (modelo 3D)',
    tipo: 'modelo',
    src: 'modelos/Cube.glb',
    miniatura: 'img/espada-en-la-piedra.png',
    descripcion: 'Modelo 3D interactivo: arrastra para girarlo y usa la rueda para acercarte.',
    herramientas: ['Blender', 'Modelado 3D'],
    anio: 2026
  },
  {
    titulo: 'Diorama Pokémon',
    tipo: 'modelo',
    src: 'modelos/pokemon.glb',
    miniatura: 'img/diorama-pokemon.png',
    descripcion: 'Terreno con Centro Pokémon, gimnasio y pinos. Modelo 3D interactivo: arrastra para girarlo y usa la rueda para acercarte.',
    herramientas: ['Blender', 'Modelado 3D'],
    anio: 2026
  },
  {
    titulo: 'Doom',
    tipo: 'modelo',
    src: 'modelos/doom.glb',
    miniatura: 'img/doom-miniatura.png',
    descripcion: 'Modelo 3D interactivo: arrastra para girarlo y usa la rueda para acercarte.',
    herramientas: ['Blender', 'Modelado 3D'],
    anio: 2026
  },
  {
    titulo: 'Diorama Pokémon — render',
    tipo: 'render',
    src: 'img/diorama-pokemon.png',
    descripcion: 'Render del diorama con Centro Pokémon, gimnasio y bosque.',
    herramientas: ['Blender', 'Render'],
    anio: 2026
  },
  {
    titulo: 'Agujero negro',
    tipo: 'render',
    src: 'img/agujero-negro.png',
    descripcion: 'Render de un agujero negro con su disco de acreción.',
    herramientas: ['Blender', 'Render'],
    anio: 2026
  },
  {
    titulo: 'Animación EV3',
    tipo: 'video',
    src: 'videos/animacion-ev3.mp4',
    miniatura: 'img/animacion-ev3-miniatura.jpg',
    descripcion: 'Animación 3D de un personaje cuadrúpedo.',
    herramientas: ['Animación 3D'],
    anio: 2026
  },
  {
    titulo: 'Paisaje apocalíptico',
    tipo: 'video',
    src: 'https://www.youtube.com/watch?v=LXXEn3xmies&t=8s',
    miniatura: 'img/paisaje-apocaliptico.jpg',
    descripcion: 'Animación 3D de un escenario del fin del mundo.',
    herramientas: ['Animación 3D', 'Unity'],
    anio: 2026
  }
    // Para otro proyecto: agrega una coma después de la llave anterior y copia un bloque como el de arriba.
];
