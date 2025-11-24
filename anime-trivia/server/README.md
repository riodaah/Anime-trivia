# Backend Express para Railway

Backend Express que replica las Cloud Functions de Firebase para poder desplegar en Railway sin necesitar plan Blaze.

## 🚀 Despliegue en Railway

### 1. Conectar GitHub Repo
1. Ve a [Railway](https://railway.app) y crea un nuevo proyecto
2. Selecciona "Deploy from GitHub Repo" → `riodaah/Anime-trivia`
3. En **Settings** → **Deploy**:
   - Root Directory: `anime-trivia/server`
   - Build Command: `npm run build`
   - Start Command: `npm start`

### 2. Configurar Variables de Entorno

Ve a **Variables** y añade:

```env
PORT=8080
FIREBASE_PROJECT_ID=anime-trivia-a7bb7
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@anime-trivia-a7bb7.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQI...\n-----END PRIVATE KEY-----\n"
WEBHOOK_SECRET=tu-token-secreto-aqui
```

#### 📝 Cómo obtener las credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/project/anime-trivia-a7bb7/settings/serviceaccounts/adminsdk)
2. Haz clic en "Generate New Private Key"
3. Descarga el archivo JSON
4. Extrae los valores:
   - `FIREBASE_PROJECT_ID`: campo `project_id`
   - `FIREBASE_CLIENT_EMAIL`: campo `client_email`
   - `FIREBASE_PRIVATE_KEY`: campo `private_key` (¡IMPORTANTE: mantén los `\n`!)

**Ejemplo de FIREBASE_PRIVATE_KEY:**
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### 3. Deploy

Railway detectará automáticamente `package.json`, instalará dependencias y ejecutará el build. Una vez completado, te dará una URL pública:

```
https://anime-trivia-backend-production.up.railway.app
```

## 📡 Endpoints

### POST /webhooks/anime-news
Recibe posts de anime desde Make (o cualquier webhook).

**Headers:**
```
Authorization: Bearer {WEBHOOK_SECRET}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Título del post",
  "slug": "titulo-del-post",
  "summary": "Resumen...",
  "contentMarkdown": "# Contenido",
  "coverImageUrl": "https://...",
  "tags": ["anime", "news"],
  "publishedAt": "2025-01-23T12:00:00Z",
  "sourceUrl": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "id": "doc-id",
  "message": "Post created successfully"
}
```

### POST /api/leaderboard
Guarda puntuaciones de jugadores.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "nickname": "Usuario123",
  "score": 10,
  "country": "Chile",
  "anime": "One Piece"
}
```

**Response:**
```json
{
  "success": true,
  "id": "doc-id",
  "message": "Score submitted successfully"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-23T12:00:00.000Z"
}
```

## 🔧 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp env.example .env
# Editar .env con tus credenciales

# Modo desarrollo
npm run dev

# Build
npm run build

# Producción
npm start
```

## 🔄 Actualizar Frontend

Una vez desplegado en Railway, actualiza el frontend para usar la nueva URL:

1. Edita `anime-trivia/.env`:
```env
VITE_API_BASE_URL=https://anime-trivia-backend-production.up.railway.app
```

2. Rebuild y redeploy frontend:
```bash
cd anime-trivia
npm run build
firebase deploy --only hosting
```

3. Actualiza el webhook de Make para usar la nueva URL:
```
https://anime-trivia-backend-production.up.railway.app/webhooks/anime-news
```

## 📊 Monitoreo

Railway proporciona logs en tiempo real y métricas automáticas. Puedes ver:
- Logs de requests
- CPU/Memory usage
- Deploy history
- Health checks

## 🐛 Troubleshooting

### Error: "Authentication failed"
- Verifica que `FIREBASE_PRIVATE_KEY` tenga los saltos de línea `\n` correctos
- Asegúrate de que la clave esté entre comillas dobles

### Error: "Unauthorized" en /webhooks/anime-news
- Verifica que el header `Authorization: Bearer {WEBHOOK_SECRET}` coincida con la variable configurada

### Error: "Missing required fields"
- Revisa que el body del POST contenga todos los campos requeridos según la documentación del endpoint

## 📚 Recursos

- [Railway Docs](https://docs.railway.app/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Express.js](https://expressjs.com/)



