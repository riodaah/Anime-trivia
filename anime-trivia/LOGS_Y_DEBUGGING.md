# 🔍 Guía de Logs y Debugging

## 📊 Cómo Ver los Logs en Railway

### Opción 1: Dashboard Web de Railway

1. **Ve a Railway:** https://railway.app/dashboard
2. **Selecciona tu proyecto:** `anime-trivia-production`
3. **Click en el servicio** (donde está desplegado el backend)
4. **Click en la pestaña "Deployments"**
5. **Click en el deployment activo** (el más reciente)
6. **Click en "View Logs"** o directamente en la pestaña **"Logs"**

### Opción 2: Railway CLI (Recomendado para debugging en tiempo real)

```bash
# Instalar Railway CLI (si no lo tienes)
npm install -g @railway/cli

# Login
railway login

# Link al proyecto
railway link

# Ver logs en tiempo real
railway logs --follow
```

---

## 🎯 ¿Qué Verás en los Logs?

Con las mejoras que acabo de hacer, ahora verás logs MUY detallados:

### 1. Para TODAS las peticiones:
```
🔵 ===== NUEVA PETICIÓN =====
📍 POST /webhooks/anime-news
📋 Headers: {
  "content-type": "application/json",
  "authorization": "Bearer tu-secret-aqui"
}
📦 Body: {
  "title": "Título del artículo",
  "slug": "titulo-del-articulo",
  ...
}
🔵 ===========================
```

### 2. Para el Webhook de Anime News:
```
🎬 ===== WEBHOOK ANIME NEWS =====
✅ WEBHOOK_SECRET está configurado
🔑 Authorization Header: Bearer xxxxx
✅ Autorización válida
📝 Campos recibidos:
  - title: ✅ "Título..."
  - slug: ✅ "slug-aqui"
  - summary: ✅ "Resumen..."
  - coverImageUrl: ✅ "https://..."
  - content: ✅ "<h2>Contenido...</h2>..."
✅ Todos los campos obligatorios presentes
🔍 Verificando si el slug ya existe...
✅ Slug es único
💾 Guardando en Firestore...
✅ Guardado exitosamente con ID: abc123
🎬 ===== FIN WEBHOOK =====
```

### 3. Si hay errores:
```
❌ Faltan campos obligatorios: {
  title: false,
  slug: false,
  summary: true,  ← Este falta
  coverImageUrl: false
}
```

---

## 🐛 Debugging del Error 400 Actual

### Paso 1: Desplegar los cambios

```bash
cd server
git add .
git commit -m "feat: agregar logs detallados para debugging"
git push
```

Railway desplegará automáticamente.

### Paso 2: Ver los logs en tiempo real

```bash
railway logs --follow
```

O en el dashboard web: https://railway.app/dashboard

### Paso 3: Hacer una petición de prueba desde Make.com

En Make.com:
1. Click en "Run once"
2. Espera a que se ejecute el escenario
3. Observa los logs en Railway

---

## 🔧 Problemas Comunes y Soluciones

### Error 400: "Bad Request"

**Causa probable:** El campo que Make está enviando no coincide con lo que espera el backend.

**Ejemplo:** Make envía `contentMarkdown` pero el backend espera `content`.

**Solución vista en tu screenshot:**
```json
{
  "title": "17. title",
  "slug": "17. slug",
  "summary": "17. summary",
  "coverImageUrl": "17. coverImageUrl",
  "contentMarkdown": "17. contentMarkdown",  ← Nota el campo
  "tags": "17. tags[]",
  "publishedAt": "17. publishedAt",
  "sourceUrl": "17. sourceUrl"
}
```

**✅ Corrección necesaria en Make.com:**
```json
{
  "title": "{{3.title}}",
  "slug": "{{3.slug}}-{{formatDate(now; \"YYYY-MM-DD-HHmm\")}}",
  "summary": "{{3.summary}}",
  "coverImageUrl": "{{3.coverImageUrl}}",
  "content": "{{3.content}}",  ← Cambiar de contentMarkdown a content
  "tags": {{toJSON(3.tags)}},  ← Usar toJSON para arrays
  "sourceUrl": "{{1.link}}"
}
```

### Error 401: "No autorizado"

**Causa:** El `Authorization` header no coincide con `WEBHOOK_SECRET`.

**Verificar en Railway:**
1. Ve a Variables de entorno
2. Confirma que `WEBHOOK_SECRET` está definido
3. Copia el valor EXACTO
4. En Make.com, asegúrate de usar: `Bearer TU_WEBHOOK_SECRET_AQUI`

### Error 409: "Slug ya existe"

**Causa:** Ya existe un post con ese slug en Firestore.

**Solución:** Agregar timestamp al slug:
```json
"slug": "{{3.slug}}-{{formatDate(now; \"YYYY-MM-DD-HHmm\")}}"
```

---

## 📝 Body Correcto para el Webhook

Basándome en tu screenshot de Make.com, deberías usar este body:

```json
{
  "title": "{{3.title}}",
  "slug": "{{3.slug}}-{{formatDate(now; \"YYYY-MM-DD-HHmm\")}}",
  "summary": "{{3.summary}}",
  "content": "{{3.content}}",
  "coverImageUrl": "{{3.coverImageUrl}}",
  "tags": {{toJSON(3.tags)}},
  "sourceUrl": "{{1.link}}"
}
```

**Nota:** El módulo 3 es el "Parse JSON" que extrae los datos del JSON generado por ChatGPT.

---

## 🧪 Probar el Webhook Manualmente (sin Make)

Si quieres probar el webhook directamente:

```bash
curl -X POST https://anime-trivia-production.up.railway.app/webhooks/anime-news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_WEBHOOK_SECRET_AQUI" \
  -d '{
    "title": "🎬 Test: Artículo de Prueba",
    "slug": "test-articulo-prueba-2025-11-24",
    "summary": "Este es un artículo de prueba para verificar el webhook.",
    "content": "<h2>Título de prueba</h2><p>Este es el contenido del artículo de prueba.</p>",
    "coverImageUrl": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800",
    "tags": ["Test", "Anime", "Prueba"],
    "sourceUrl": "https://example.com"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "id": "abc123xyz",
  "slug": "test-articulo-prueba-2025-11-24"
}
```

---

## 🚀 Desplegar los Cambios

### Opción 1: Git Push (Recomendado)

```bash
cd anime-trivia/server
git add .
git commit -m "feat: agregar logs detallados para debugging"
git push origin main
```

Railway detectará el push y desplegará automáticamente.

### Opción 2: Railway CLI

```bash
cd anime-trivia/server
railway up
```

---

## 📺 Ver Logs en Tiempo Real

### Terminal:
```bash
railway logs --follow
```

### Filtrar logs:
```bash
# Solo errores
railway logs --follow | grep "❌"

# Solo webhook de anime
railway logs --follow | grep "WEBHOOK ANIME"

# Solo scores
railway logs --follow | grep "SUBMIT SCORE"
```

---

## 🎯 Siguiente Paso

1. **Despliega** los cambios que acabo de hacer
2. **Abre los logs** de Railway
3. **Ejecuta "Run once"** en Make.com
4. **Observa** los logs detallados
5. **Compárteme** lo que veas en los logs

¡Con estos logs súper detallados sabremos exactamente qué está fallando! 🔍✨



