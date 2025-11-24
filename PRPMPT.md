Quiero que actúes como arquitecto de software y desarrollador full-stack senior.
Tengo un proyecto alojado en Firebase Hosting (dominio luffysunny.com) con base de datos en Cloud Firestore.
El proyecto es un juego de trivia de anime, y deseo convertirlo en una plataforma completa con:

Un sitio visualmente espectacular (modo oscuro, efectos, parallax, motion).

Una página de juego que reuse el juego actual de trivia (sin modificar su lógica).

Una tabla de posiciones (leaderboard) global donde los que más saben de anime aparecen.

Un blog de noticias de anime, donde las entradas se publican automáticamente mediante un webhook desde Make.

Páginas legales e informativas para estar listo para Google AdSense.

0. Stack técnico

Usa React + Vite + TailwindCSS + Framer Motion.

Proyecto single-page app (SPA) o multi-ruta con React Router.

Front-end desplegado en Firebase Hosting, datos en Cloud Firestore, backend ligero con Cloud Functions si es necesario.

No modificar la lógica del juego de trivia actual (barritas, sonidos, preguntas/alternativas).

1. Estructura de archivos y carpetas

Define una estructura clara, por ejemplo:

src/
  main.jsx
  App.jsx
  router.jsx
  config/
    siteConfig.ts
    apiConfig.ts
  pages/
    Home/
    Play/
    Ranking/
    Blog/
    Static/
  components/
    layout/
      Navbar.jsx
      Footer.jsx
    ui/
      Button.jsx
      Card.jsx
      SectionContainer.jsx
    home/
      HeroSection.jsx
      EgoHookSection.jsx
      BlogPreviewSection.jsx
      LeaderboardPreview.jsx
  lib/
    apiClient.ts
    blogApi.ts
    leaderboardApi.ts
  assets/
    images/
    videos/    ← aquí indicar claramente dónde dejo los videos y en qué formato
  styles/
    globals.css


En comentarios dentro del código especifica:

Carpeta para videos (src/assets/videos/ o public/videos/).

Formato recomendado: .mp4, 1920×1080 o 1280×720, H.264, tamaño optimizado (< 10 MB).

Cómo referenciarlos desde componentes: import heroVideo from '@/assets/videos/home-hero-loop.mp4'.

2. Estilo visual y experiencia de usuario

Tema oscuro, inspirado en anime / gaming.

Fondo con gradientes y efectos parallax (capas de estrellas, siluetas de ciudad/toriis).

TailwindCSS + Framer Motion para animaciones:

Hero: fade-slide up.

Botones: hover escala y glow.

Cards: hover levitación, borde glow.

Secciones al scroll: whileInView animado con stagger.

Componente reusable de animación: MotionFadeIn.jsx.

3. Páginas y rutas

/ → HomePage

HeroSection con video loop.

HowItWorksSection (4 pasos).

EgoHookSection (“Tabla de los que más saben”).

LeaderboardPreview (top 5).

BlogPreviewSection (últimos 3).

TikTokPromoSection.

/play → PlayPage

Selector de anime/dificultad.

Componente GameLayoutFrame que integra el juego actual.

Al terminar: modal con puntaje + nickname + botón “Guardar en ranking”.

Llama submitScore() → POST /api/leaderboard.

/ranking → RankingPage

Filtros: periodo (Global, Mes), anime.

Tabla con columnas: pos, nickname, país, anime, puntaje, fecha.

/blog → BlogListPage

Tarjetas de posts: imagen, título, resumen, fecha, tags.

Paginación o “Cargar más”.

/blog/:slug → BlogPostPage

Título, fecha, tags, imagen destacada.

Contenido en HTML o markdown renderizado.

“Volver al blog”.

/how-it-works, /privacy-policy, /terms, /contact, /404 páginas estáticas.

4. API del front-end y configuración

En src/config/apiConfig.ts:

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://<tu-función>.cloudfunctions.net";


En lib/blogApi.ts y lib/leaderboardApi.ts define funciones:

getPosts(page, pageSize)
getPostBySlug(slug)
getLeaderboard(filters)
submitScore(payload)


Si aún no hay backend, implementa mocks locales (src/mock/posts.json, src/mock/leaderboard.json) para poder desarrollar el front.

5. Backend ligero (Firebase Functions)

Crear función HTTP webhookAnimeNews (POST /webhooks/anime-news) para que Make envíe:

{
  "title": "...",
  "slug": "...",
  "summary": "...",
  "contentMarkdown": "...",
  "coverImageUrl": "...",
  "tags": ["anime", "news", "..."],
  "publishedAt": "2025-11-23T12:00:00Z",
  "sourceUrl": "https://..."
}


Se valida secret (token) en la cabecera.

Función escribe en Firestore colección posts.

Crear función submitScore (POST /api/leaderboard) que escriba en leaderboard colección.

Configurar reglas de seguridad de Firestore para que solo funciones puedan escribir directamente, y front solo lectura.

6. Videos y activos multimedia

En Home: video loop home-hero-loop.mp4.

En HowItWorks: video explicativo how-to-play.mp4 en un modal.

Background_parallax: background-anime-loop.mp4 como fondo de secciones.

Comentar en código dónde se ubican (src/assets/videos/).

Formato recomendado: .mp4, H.264, 1920×1080, < 10 MB.

Optimizar con ffmpeg -crf 28 -preset veryfast o similar.

7. Copywriting & Hook al ego otaku

Tono divertido, cercano, estilo gamer/anime.

Frases como:

“¿Eres de verdad fan de anime o solo dices que sí?”

“Solo los verdaderos fans aparecen en la tabla de los que más saben.”

“Demuestra tu nivel, compite globalmente, representa a Chile.”

Lenguaje simple, sin jerga técnica, apelando al orgullo de saber anime.

8. Preparación para Google AdSense

En Home, Blog y Ranking deja zonas sugeridas para bloques de anuncios:

Home: entre secciones, banner al final.

Blog list: entre cada 3 cards o al final del post.

Ranking: banner arriba del fold.

Asegúrate de que el sitio tenga:

/privacy-policy

/terms

/contact

SEO básico: meta tags dinámicos, OpenGraph, canonical.

Evitar copyright directo: usar imágenes/licencias propias o generadas.

9. Entrega esperada

Rutas navegables (/, /play, /ranking, /blog, etc.).

Layout global con Navbar + Footer.

Página de juego reutilizando la lógica actual.

Blog listo para recibir posts auto-publicados.

Comentarios en código indicando cómo y dónde colocar videos, anuncios, URL de API.

Código limpio, modular, reutilizable.

Documentación mínima en README.md que explique variables de entorno, cómo desplegar en Firebase Hosting y configurar funciones.

A partir de estas instrucciones, analiza tu proyecto existente en Firebase Hosting + Firestore, propone la mejor estructura según React/Vite, y haz todos los cambios necesarios para implementar lo descrito.

📌 Cómo usar

Copia el prompt completo.

Pégalo en Cursor y ejecútalo para generar los archivos / actualizaciones.

Revisa los resultados, haz el deploy en Firebase Hosting + Firestore + Functions.

Asegúrate de probar rutas, rendimiento, mobile-first.

Luego ya estás listo para solicitar aprobación de Google AdSense.