# Trivia de Anime - LuffySunny

Plataforma completa de trivia de anime desarrollada con React, Vite, TypeScript, TailwindCSS y Framer Motion. Desplegada en Firebase Hosting con Cloud Firestore y Cloud Functions.

## 🚀 Características

- ✨ Diseño espectacular con modo oscuro, efectos parallax y animaciones
- 🎮 Juego de trivia con lógica original preservada
- 📊 Ranking global con filtros
- 📝 Blog de noticias de anime con publicación automática vía webhook
- 📱 Diseño responsive y mobile-first
- 🎯 Preparado para Google AdSense
- ⚡ Optimizado con Vite para máximo rendimiento

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.1.0** - Framework UI
- **TypeScript 5.7.2** - Tipado estático
- **Vite 6.0.5** - Build tool
- **TailwindCSS 3.4.17** - Estilos
- **Framer Motion 11.11.17** - Animaciones
- **React Router 6.28.0** - Navegación

### Backend
- **Firebase Hosting** - Hosting estático
- **Cloud Firestore** - Base de datos NoSQL
- **Cloud Functions** - Backend serverless

## 📁 Estructura del Proyecto

```
anime-trivia/
├── src/
│   ├── components/
│   │   ├── layout/          # Navbar, Footer, Layout
│   │   ├── ui/               # Componentes reutilizables
│   │   └── game/             # Componentes del juego (GameScreen, Timer, etc.)
│   ├── pages/
│   │   ├── Home/             # Página principal
│   │   ├── Play/             # Página de juego
│   │   ├── Ranking/          # Página de ranking
│   │   ├── Blog/             # Páginas del blog
│   │   └── Static/           # Páginas estáticas (privacy, terms, etc.)
│   ├── lib/                  # APIs y utilidades
│   ├── config/               # Configuración del sitio
│   ├── styles/               # Estilos globales
│   └── firebase.ts           # Configuración de Firebase
├── functions/                # Cloud Functions
│   └── src/
│       └── index.ts          # webhookAnimeNews, submitScore
├── public/                   # Archivos estáticos
│   └── videos/               # Videos (home-hero-loop.mp4, etc.)
└── build/                    # Build de producción
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Firebase CLI (`npm install -g firebase-tools`)

### Pasos

1. **Instalar dependencias del frontend:**
```bash
cd anime-trivia
npm install
```

2. **Instalar dependencias de Cloud Functions:**
```bash
cd functions
npm install
cd ..
```

3. **Configurar variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_API_BASE_URL=https://us-central1-anime-trivia-a7bb7.cloudfunctions.net
VITE_WEBHOOK_SECRET=tu-secret-aqui
```

4. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

El sitio estará disponible en `http://localhost:5173`

## 🎬 Videos

Los videos deben colocarse en `public/videos/`:

- **home-hero-loop.mp4** - Video de fondo del hero (1920×1080, H.264, < 10 MB)
- **how-to-play.mp4** - Video explicativo (opcional)
- **background-anime-loop.mp4** - Video de fondo parallax (opcional)

### Optimizar videos con ffmpeg:
```bash
ffmpeg -i input.mp4 -crf 28 -preset veryfast -vf scale=1920:1080 output.mp4
```

## 📦 Build y Deploy

### Build del frontend:
```bash
npm run build
```

### Deploy completo (Hosting + Functions):
```bash
npm run deploy
```

### Deploy solo Hosting:
```bash
firebase deploy --only hosting
```

### Deploy solo Functions:
```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

## 🔧 Configuración de Firebase

### 1. Configurar Webhook Secret para Cloud Functions:
```bash
firebase functions:config:set webhook.secret="tu-secret-seguro-aqui"
```

O usar variables de entorno:
```bash
firebase functions:config:set webhook.secret="$(echo $WEBHOOK_SECRET)"
```

### 2. Configurar Reglas de Seguridad de Firestore:

En la consola de Firebase, ve a Firestore > Rules y configura:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts: solo lectura pública, escritura solo por funciones
    match /posts/{postId} {
      allow read: if true;
      allow write: if false; // Solo funciones pueden escribir
    }
    
    // Leaderboard: lectura pública, escritura solo por funciones
    match /leaderboard/{scoreId} {
      allow read: if true;
      allow write: if false; // Solo funciones pueden escribir
    }
    
    // Questions: lectura pública
    match /questions/{questionId} {
      allow read: if true;
      allow write: if request.auth != null; // Solo usuarios autenticados
    }
  }
}
```

## 🔗 Webhook de Make

Para configurar el webhook en Make que publique posts automáticamente:

1. **URL del webhook:**
```
https://us-central1-anime-trivia-a7bb7.cloudfunctions.net/webhookAnimeNews
```

2. **Método:** POST

3. **Headers:**
```
Authorization: Bearer {WEBHOOK_SECRET}
Content-Type: application/json
```

4. **Body (ejemplo):**
```json
{
  "title": "Nuevo capítulo de One Piece",
  "slug": "nuevo-capitulo-one-piece",
  "summary": "Resumen de la noticia...",
  "contentMarkdown": "# Contenido en markdown",
  "coverImageUrl": "https://example.com/image.jpg",
  "tags": ["anime", "one-piece", "news"],
  "publishedAt": "2025-01-23T12:00:00Z",
  "sourceUrl": "https://example.com/original-article"
}
```

## 📊 Google AdSense

### Configuración:

1. **Obtener Publisher ID** de AdSense
2. **Reemplazar en `src/components/ui/AdSense.tsx`:**
   - Cambiar `ca-pub-XXXXXXXXXX` por tu Publisher ID
   - Configurar los `adSlot` IDs para cada zona

3. **Zonas de anuncios configuradas:**
   - Home: Banner superior, entre secciones, banner final
   - Play: Banner superior
   - Ranking: Banner superior
   - Blog: Banner superior, entre posts, dentro del post

4. **Descomentar los componentes `<AdSense />`** en las páginas correspondientes

## 🎨 Personalización

### Colores y tema:
Edita `tailwind.config.js` para cambiar los colores del tema.

### Copywriting:
Edita `src/config/siteConfig.ts` para cambiar los textos del sitio.

### Estilos globales:
Edita `src/styles/globals.css` para personalizar estilos base.

## 📝 Estructura de Datos en Firestore

### Colección: `questions`
```json
{
  "question": "¿Cuál es el nombre del protagonista?",
  "options": ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
  "correctAnswer": "Opción 1",
  "anime": "One Piece",
  "difficulty": "fácil"
}
```

### Colección: `posts`
```json
{
  "title": "Título del post",
  "slug": "titulo-del-post",
  "summary": "Resumen...",
  "contentMarkdown": "Contenido...",
  "coverImageUrl": "https://...",
  "tags": ["anime", "news"],
  "publishedAt": "2025-01-23T12:00:00Z",
  "sourceUrl": "https://..."
}
```

### Colección: `leaderboard`
```json
{
  "nickname": "Usuario123",
  "score": 10,
  "country": "Chile",
  "anime": "One Piece",
  "timestamp": "2025-01-23T12:00:00Z"
}
```

## 🐛 Troubleshooting

### Error: "Module not found"
- Ejecuta `npm install` nuevamente
- Verifica que todas las dependencias estén en `package.json`

### Error: "Firebase not initialized"
- Verifica que `firebase.ts` tenga las credenciales correctas
- Asegúrate de que Firebase esté configurado en la consola

### Error: "CORS"
- Verifica que las Cloud Functions tengan CORS configurado
- Revisa los headers en las funciones

## 📄 Licencia

Este proyecto es privado y propiedad de LuffySunny.

## 👥 Contacto

- Email: contacto@luffysunny.com
- TikTok: @luffysunny

---

**¡Disfruta construyendo la mejor trivia de anime! 🎮✨**
