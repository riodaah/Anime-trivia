# 📚 Documentación de API - LuffySunny Blog

## 🌐 Base URL
```
https://anime-trivia-production.up.railway.app
```

---

## 📝 Crear Artículo de Blog

### Endpoint
```http
POST /webhooks/anime-news
```

### 🔐 Autenticación
Requiere un token Bearer en el header:

```http
Authorization: Bearer TU_WEBHOOK_SECRET
```

**Nota:** El `WEBHOOK_SECRET` está configurado en las variables de entorno de Railway.

---

### 📦 Body (JSON)

#### Campos Obligatorios:
- `title` (string): Título del artículo
- `slug` (string): URL amigable única (ej: "nuevo-anime-2024")
- `summary` (string): Resumen breve del artículo
- `coverImageUrl` (string): URL de la imagen de portada

#### Campos Opcionales:
- `content` (string): Contenido en texto plano o HTML
- `contentMarkdown` (string): Contenido en formato Markdown
- `tags` (array): Etiquetas del artículo
- `publishedAt` (string): Fecha de publicación (ISO 8601)
- `sourceUrl` (string): URL de la fuente original

---

### 📋 Ejemplo de Request

#### Usando cURL:
```bash
curl -X POST https://anime-trivia-production.up.railway.app/webhooks/anime-news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_WEBHOOK_SECRET" \
  -d '{
    "title": "Las 10 Mejores Peleas de Dragon Ball Super",
    "slug": "mejores-peleas-dragon-ball-super",
    "summary": "Descubre las batallas más épicas y emocionantes de Dragon Ball Super que dejaron a todos sin aliento.",
    "coverImageUrl": "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800",
    "content": "<h2>Las peleas más épicas</h2><p>Dragon Ball Super nos ha regalado momentos inolvidables...</p>",
    "contentMarkdown": "## Las peleas más épicas\n\nDragon Ball Super nos ha regalado momentos inolvidables...",
    "tags": ["Dragon Ball", "Anime", "Peleas", "Goku"],
    "publishedAt": "2024-11-24T10:00:00Z",
    "sourceUrl": "https://ejemplo.com/articulo-original"
  }'
```

#### Usando JavaScript (Fetch):
```javascript
const createBlogPost = async () => {
  const response = await fetch('https://anime-trivia-production.up.railway.app/webhooks/anime-news', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer TU_WEBHOOK_SECRET'
    },
    body: JSON.stringify({
      title: 'Las 10 Mejores Peleas de Dragon Ball Super',
      slug: 'mejores-peleas-dragon-ball-super',
      summary: 'Descubre las batallas más épicas y emocionantes de Dragon Ball Super.',
      coverImageUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800',
      content: '<h2>Las peleas más épicas</h2><p>Dragon Ball Super nos ha regalado momentos inolvidables...</p>',
      tags: ['Dragon Ball', 'Anime', 'Peleas', 'Goku'],
      publishedAt: new Date().toISOString()
    })
  });

  const data = await response.json();
  console.log(data);
};
```

#### Usando Python (requests):
```python
import requests
import json
from datetime import datetime

url = "https://anime-trivia-production.up.railway.app/webhooks/anime-news"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer TU_WEBHOOK_SECRET"
}

payload = {
    "title": "Las 10 Mejores Peleas de Dragon Ball Super",
    "slug": "mejores-peleas-dragon-ball-super",
    "summary": "Descubre las batallas más épicas y emocionantes de Dragon Ball Super.",
    "coverImageUrl": "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800",
    "content": "<h2>Las peleas más épicas</h2><p>Dragon Ball Super...</p>",
    "tags": ["Dragon Ball", "Anime", "Peleas", "Goku"],
    "publishedAt": datetime.utcnow().isoformat() + "Z"
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())
```

---

### ✅ Respuesta Exitosa (200)
```json
{
  "success": true,
  "id": "abc123xyz789"
}
```

### ❌ Errores Posibles

#### 401 - No Autorizado
```json
{
  "error": "No autorizado"
}
```

#### 400 - Campos Faltantes
```json
{
  "error": "Faltan campos obligatorios"
}
```

#### 409 - Slug Duplicado
```json
{
  "error": "Slug ya existe"
}
```

#### 500 - Error del Servidor
```json
{
  "error": "Error interno"
}
```

---

## 🖼️ Imágenes

### Opciones para la Imagen de Portada:

1. **Usar URL de Imagen Externa:**
   ```json
   "coverImageUrl": "https://tuservidor.com/imagen.jpg"
   ```

2. **Usar Unsplash (Gratis):**
   ```json
   "coverImageUrl": "https://images.unsplash.com/photo-ID?w=800"
   ```

3. **Usar Imgur:**
   - Sube tu imagen a https://imgur.com
   - Copia el link directo
   ```json
   "coverImageUrl": "https://i.imgur.com/ABC123.jpg"
   ```

4. **Usar Cloudinary (Recomendado para producción):**
   ```json
   "coverImageUrl": "https://res.cloudinary.com/tucloud/image/upload/v123/imagen.jpg"
   ```

---

## 🎯 Ejemplo Completo con Make.com o Zapier

### 1. Webhook en Make.com:
1. Crea un nuevo Scenario
2. Añade módulo "HTTP Request"
3. Configura:
   - **URL:** `https://anime-trivia-production.up.railway.app/webhooks/anime-news`
   - **Method:** POST
   - **Headers:**
     - `Content-Type`: `application/json`
     - `Authorization`: `Bearer TU_WEBHOOK_SECRET`
   - **Body:** JSON con los datos del artículo

### 2. Desde Postman:
1. Crea nueva request POST
2. URL: `https://anime-trivia-production.up.railway.app/webhooks/anime-news`
3. Headers:
   - Key: `Content-Type`, Value: `application/json`
   - Key: `Authorization`, Value: `Bearer TU_WEBHOOK_SECRET`
4. Body → raw → JSON:
   ```json
   {
     "title": "Mi Artículo de Prueba",
     "slug": "mi-articulo-prueba",
     "summary": "Este es un artículo de prueba",
     "coverImageUrl": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800"
   }
   ```

---

## 🔍 Verificar el Artículo

Después de crear el artículo, puedes verlo en:
- **Lista de blog:** https://luffysunny.com/blog
- **Artículo específico:** https://luffysunny.com/blog/tu-slug-aqui

---

## 💡 Tips

1. **Slug único:** Debe ser único, usa guiones para separar palabras
2. **Imágenes optimizadas:** Usa URLs con `?w=800` para mejor rendimiento
3. **Tags relevantes:** Ayudan con SEO y organización
4. **Markdown vs HTML:** Puedes enviar ambos, se preferirá Markdown si está presente
5. **Fecha de publicación:** Si no la envías, se usa la fecha actual

---

## 🧪 Testing en Local

Si quieres probar localmente primero:

```bash
# Desde la carpeta server/
npm run dev

# La API estará en http://localhost:4000
```

---

## 📞 Contacto

Si tienes problemas con la API, revisa:
1. Que el `WEBHOOK_SECRET` sea correcto
2. Que la URL de Railway esté activa
3. Los logs en Railway Dashboard

¿Necesitas ayuda? Revisa los logs de Railway o contacta al desarrollador.




