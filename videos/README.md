# Portafolio de Fernando Cofre

Portafolio personal en español, con opción de cambiar los textos principales al inglés. Incluye perfil, formación, habilidades, proyectos y contacto.

## Estructura
- `index.html`: estructura de la página.
- `styles.css`: diseño adaptable a escritorio, tablet y celular.
- `script.js`: galería, ventana de proyectos y selector de idioma.
- `datos.js`: perfil, habilidades y proyectos editables.
- `img/`: imágenes de proyectos.
- `curriculum/`: currículum PDF.
- `modelos/`: modelos 3D GLB/GLTF para futuras incorporaciones.
- `videos/`: videos de proyectos para futuras incorporaciones.

## Editar el contenido
Modifica `datos.js` para cambiar el perfil, habilidades, enlaces o agregar proyectos. Para añadir imágenes, súbelas a `img/` y utiliza su ruta en el proyecto correspondiente.

## Publicar en GitHub Pages
1. Descomprime este ZIP.
2. Sube todos los archivos y carpetas a la raíz de tu repositorio `fernando-dark20`.
3. En GitHub abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
5. Guarda y espera a que GitHub Pages publique el sitio.

Para probar localmente, inicia un servidor en esta carpeta, por ejemplo `python -m http.server 8000`, y abre `http://localhost:8000`.

## Pendiente de completar
- Incorporar una pista de música ambiental con licencia adecuada. Los navegadores pueden bloquear la reproducción automática; se debe activar tras la primera interacción del visitante.
- Agregar más proyectos, imágenes y videos cuando estén disponibles.
- Completar el nombre del establecimiento y los años de la formación técnico-profesional si se desean mostrar.
