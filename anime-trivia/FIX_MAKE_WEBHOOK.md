# 🔧 Fix Urgente: Error 400 en Make.com

## ❌ El Problema

En tu screenshot veo que estás enviando esto:

```json
{
  "title": "17. title",
  "slug": "17. slug",
  "summary": "17. summary",
  "coverImageUrl": "17. coverImageUrl",
  "contentMarkdown": "17. contentMarkdown",  ← PROBLEMA
  "tags": "17. tags[]",
  "publishedAt": "17. publishedAt",
  "sourceUrl": "17. sourceUrl"
}
```

**Problemas:**
1. ❌ Estás enviando los **nombres** de los campos en vez de sus **valores**
2. ❌ El backend espera `content`, no `contentMarkdown`
3. ❌ `tags` debe ser un array JSON, no un string

---

## ✅ La Solución

### Paso 1: En el módulo HTTP de Make.com

**Click en el módulo HTTP** (el último, #18 en tu caso)

**Reemplaza el "Request content" con esto:**

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

**Notas importantes:**
- Usa `{{3.title}}` en vez de `"17. title"`
- Usa `{{3.content}}` en vez de `"17. contentMarkdown"`
- Usa `{{toJSON(3.tags)}}` **SIN comillas** para convertir el array
- El `3` se refiere al módulo #3 (Parse JSON)

---

## 📋 Headers (Verificar también)

Asegúrate de tener estos 2 headers:

### Header 1:
- **Name:** `Content-Type`
- **Value:** `application/json`

### Header 2:
- **Name:** `Authorization`  
- **Value:** `Bearer TU_WEBHOOK_SECRET_AQUI`

⚠️ **IMPORTANTE:** Reemplaza `TU_WEBHOOK_SECRET_AQUI` con el valor real de Railway.

**Para obtener el WEBHOOK_SECRET:**
1. Ve a Railway Dashboard
2. Selecciona tu servicio
3. Ve a "Variables"
4. Copia el valor de `WEBHOOK_SECRET`

---

## 🧪 Cómo Probar

### 1. Guarda los cambios en Make.com (Click "Save")

### 2. Abre los logs de Railway

**Opción A - Dashboard Web:**
- https://railway.app/dashboard
- Selecciona tu proyecto
- Click en "Logs"

**Opción B - Terminal:**
```bash
railway logs --follow
```

### 3. Ejecuta "Run once" en Make.com

### 4. Observa los logs

Deberías ver algo como:

```
🔵 ===== NUEVA PETICIÓN =====
📍 POST /webhooks/anime-news
📦 Body: {
  "title": "🎬 Toei Animation Rinde Homenaje...",
  "slug": "toei-homenaje-director-2025-11-24-1530",
  "summary": "En memoria del fallecido director...",
  "content": "<h2>Un Tributo...</h2><p>...</p>",
  ...
}

🎬 ===== WEBHOOK ANIME NEWS =====
✅ WEBHOOK_SECRET está configurado
✅ Autorización válida
✅ Todos los campos obligatorios presentes
✅ Slug es único
💾 Guardando en Firestore...
✅ Guardado exitosamente con ID: abc123
```

---

## 🎯 Diferencia Visual

### ❌ ANTES (Lo que estabas enviando):
```json
{
  "title": "17. title"  ← Esto es un STRING literal
}
```

### ✅ DESPUÉS (Lo correcto):
```json
{
  "title": "{{3.title}}"  ← Esto se reemplaza con el valor real
}
```

Cuando Make procesa `{{3.title}}`, lo reemplaza con el valor real del título que viene del módulo 3 (Parse JSON).

---

## 🔍 ¿Por qué "17." ?

En Make.com, cuando ves `17. title`, significa:
- **17** = Número del módulo anterior (probablemente el RSS o ChatGPT)
- **title** = Campo disponible de ese módulo

Pero si lo pones **como string** (`"17. title"`), Make lo envía literalmente.

**Debes usar la sintaxis correcta:** `{{17.title}}` o `{{3.title}}` dependiendo de qué módulo tenga los datos.

---

## 📊 Estructura Completa del Escenario

```
1. RSS Feed (Trigger)          → Lee noticias
2. ChatGPT (OpenAI)           → Crea artículo en JSON
3. Parse JSON (Tools)         → Extrae campos del JSON
4. HTTP Request               → Envía al webhook ✅
```

En el módulo 4 (HTTP), debes referenciar los campos del módulo 3 así: `{{3.campo}}`

---

## 🚀 Una Vez que Funcione

Cuando veas en los logs:

```
✅ Guardado exitosamente con ID: abc123
```

Tu artículo estará en:
- **Firestore:** Colección `posts`
- **Tu sitio:** https://luffysunny.com/blog

---

## 💡 Pro Tip

Si quieres ver exactamente qué está enviando Make.com antes de arreglarlo:

1. Ve a Railway logs
2. Ejecuta "Run once" en Make
3. Busca en los logs la línea: `📦 Body:`
4. Ahí verás el JSON exacto que se está enviando
5. Compárteme ese JSON y te ayudo a corregirlo

---

¡Haz estos cambios y vuelve a probar! Ahora con los logs detallados sabremos exactamente qué está pasando. 🎯✨



