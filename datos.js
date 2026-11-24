// Contenido del portafolio de Fernando Cofre
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
  }
];
