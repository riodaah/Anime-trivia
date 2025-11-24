# 🤖 Guía: Automatización de Blog con Make.com + ChatGPT + RSS

## 📋 Resumen
Este escenario automáticamente:
1. 📡 Lee el RSS de noticias de anime
2. 🤖 Usa ChatGPT para crear un artículo en español
3. 📝 Publica el artículo en tu blog vía API

---

## 🎯 Paso 1: Crear Nuevo Escenario en Make.com

1. Ve a https://make.com
2. Click en **"Create a new scenario"**
3. Nombre sugerido: `"Auto-Publicar Noticias Anime"`

---

## 🔧 Paso 2: Módulo 1 - RSS Feed (Trigger)

### Configuración:

1. **Buscar módulo:** `RSS`
2. **Seleccionar:** `Watch RSS feed items`
3. **Configurar:**
   - **URL:** `https://rss.app/feeds/tkzvqcGwyEeIbRil.xml`
   - **Maximum number of returned items:** `1`
   - **Interval:** `Every 6 hours` (para no saturar)

**¿Qué hace?** Lee el feed RSS cada 6 horas y detecta nuevos artículos.

---

## 🤖 Paso 3: Módulo 2 - OpenAI (ChatGPT)

### Configuración:

1. **Buscar módulo:** `OpenAI`
2. **Seleccionar:** `Create a Completion (GPT-3, GPT-4, GPT-4o)`
3. **Configurar:**

#### Connection:
- Conecta tu cuenta de OpenAI (necesitas API key de https://platform.openai.com)

#### Settings:
- **Model:** `gpt-4o` o `gpt-4o-mini` (más barato)
- **Max Tokens:** `2000`
- **Temperature:** `0.7`

#### Prompt (Copiar y pegar):
```
Eres un redactor de contenido de anime profesional. 

Tengo esta noticia en japonés:
Título: {{1.title}}
Descripción: {{1.description}}
Link: {{1.link}}

TAREA:
1. Traduce y adapta esta noticia al español
2. Crea un artículo atractivo y entretenido
3. Agrega emojis relevantes
4. Responde SOLO con un JSON válido con este formato exacto:

{
  "title": "Título llamativo en español (máximo 80 caracteres)",
  "slug": "titulo-en-minusculas-con-guiones",
  "summary": "Resumen corto y atractivo de 1-2 líneas",
  "content": "<h2>Subtítulo</h2><p>Contenido del artículo en HTML con varios párrafos. Usa <strong>, <em>, <h3>, etc.</p>",
  "coverImageUrl": "{{1.enclosure.url}}",
  "tags": ["Tag1", "Tag2", "Tag3"]
}

IMPORTANTE:
- El slug debe ser único, usar el título + fecha
- El content debe ser HTML válido
- Incluye al menos 3 párrafos
- Añade contexto y análisis
- Si no hay imagen en {{1.enclosure.url}}, usa: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800"
```

**¿Qué hace?** ChatGPT convierte la noticia japonesa en un artículo en español con formato JSON.

---

## 🔍 Paso 4: Módulo 3 - Parse JSON

### Configuración:

1. **Buscar módulo:** `Tools` > `Parse JSON`
2. **JSON string:** Selecciona `{{2.choices[].message.content}}`

**¿Qué hace?** Convierte el texto JSON de ChatGPT en variables utilizables.

---

## 📡 Paso 5: Módulo 4 - HTTP Request (Webhook)

### Configuración:

1. **Buscar módulo:** `HTTP` > `Make a request`
2. **Configurar:**

#### URL:
```
https://anime-trivia-production.up.railway.app/webhooks/anime-news
```

#### Method:
```
POST
```

#### Headers:
Agregar 2 headers:

| Name | Value |
|------|-------|
| `Content-Type` | `application/json` |
| `Authorization` | `Bearer TU_WEBHOOK_SECRET_AQUI` |

⚠️ **IMPORTANTE:** Reemplaza `TU_WEBHOOK_SECRET_AQUI` con tu secreto real de Railway

#### Body:
Seleccionar **Raw** y pegar:
```json
{
  "title": "{{3.title}}",
  "slug": "{{3.slug}}-{{formatDate(now; "YYYY-MM-DD-HHmm")}}",
  "summary": "{{3.summary}}",
  "content": "{{3.content}}",
  "coverImageUrl": "{{3.coverImageUrl}}",
  "tags": {{3.tags}},
  "sourceUrl": "{{1.link}}"
}
```

**Nota:** El `formatDate(now; "YYYY-MM-DD-HHmm")` agrega timestamp al slug para hacerlo único.

**¿Qué hace?** Envía el artículo formateado a tu API para publicarlo en el blog.

---

## ✅ Paso 6: Verificación y Activación

### Probar el Escenario:

1. **Click en "Run once"** para probar
2. Verifica que cada módulo se ejecute correctamente
3. Revisa los datos que pasan entre módulos

### Activar Automatización:

1. **Click en "Scheduling"** (abajo izquierda)
2. **Activar:** ON
3. **Interval:** Every 6 hours (o el que prefieras)
4. **Click en "OK"**

---

## 📊 Diagrama del Flujo

```
┌─────────────┐
│  RSS Feed   │ Cada 6 horas
│  (Trigger)  │ Lee el feed RSS
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   ChatGPT   │ Convierte noticia
│   (OpenAI)  │ a artículo en español
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Parse JSON  │ Extrae los campos
│   (Tools)   │ del JSON generado
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  HTTP POST  │ Publica en el blog
│  (Webhook)  │ via API de Railway
└─────────────┘
```

---

## 🎨 Mejoras Opcionales

### Filtrar Duplicados:
Agregar entre RSS y ChatGPT:

**Módulo:** `Tools` > `Set Variable`
- Guarda el slug en un Data Store para evitar duplicados

### Notificaciones:
Agregar al final:

**Módulo:** `Email` o `Telegram` o `Slack`
- Te notifica cuando se publica un nuevo artículo

### Revisar antes de publicar:
Agregar antes del HTTP:

**Módulo:** `Tools` > `Sleep`
- Configurar aprobación manual en Make.com

---

## 🧪 Ejemplo de Prompt Mejorado (Opcional)

Si quieres artículos más largos y detallados:

```
Eres un redactor experto de contenido de anime. Escribe artículos informativos y entretenidos.

NOTICIA ORIGINAL:
Título: {{1.title}}
Contenido: {{1.description}}
Link fuente: {{1.link}}
Imagen: {{1.enclosure.url}}

INSTRUCCIONES:
1. Traduce la noticia del japonés al español
2. Expande el contenido a 4-5 párrafos
3. Añade contexto sobre el anime/manga mencionado
4. Usa un tono casual y amigable
5. Incluye emojis relevantes (🎬🔥⭐️🎮)
6. Agrega un llamado a la acción al final

FORMATO DE SALIDA (JSON válido):
{
  "title": "Título atractivo máximo 80 caracteres con emojis",
  "slug": "titulo-url-friendly-sin-emojis",
  "summary": "Resumen de 1-2 líneas que enganche al lector",
  "content": "<h2>Introducción</h2><p>Párrafo 1...</p><h3>Subtítulo</h3><p>Párrafo 2...</p><p>Párrafo 3...</p><h3>Conclusión</h3><p>Párrafo final con CTA...</p>",
  "coverImageUrl": "{{if(empty(1.enclosure.url); "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800"; 1.enclosure.url)}}",
  "tags": ["Anime", "Tag relevante 1", "Tag relevante 2", "Tag relevante 3"]
}

REGLAS:
- El content debe ser HTML válido
- Incluye <h2>, <h3>, <p>, <strong>, <em>
- NO uses comillas dobles dentro del JSON
- El slug debe ser lowercase y usar guiones
- Mínimo 400 palabras en el content
```

---

## 💰 Costos Estimados

### Make.com:
- **Plan Free:** 1,000 operaciones/mes (suficiente para empezar)
- **Plan Básico:** $9/mes - 10,000 operaciones

### OpenAI:
- **GPT-4o-mini:** ~$0.15 por 1M tokens (muy barato)
- **GPT-4o:** ~$2.50 por 1M tokens
- **Estimado:** ~$0.01-0.05 por artículo

**Total mensual:** $0-10 para 50-100 artículos automáticos

---

## 🔍 Troubleshooting

### Error: "Invalid JSON"
- Revisa el output de ChatGPT en el historial de ejecución
- A veces ChatGPT agrega texto extra, usa Parse JSON para limpiarlo

### Error: "401 Unauthorized"
- Verifica el `Authorization` header
- Confirma que el WEBHOOK_SECRET sea correcto

### Error: "409 Slug ya existe"
- El slug está duplicado
- Agrega timestamp: `{{3.slug}}-{{formatDate(now; "YYYY-MM-DD-HHmm")}}`

### No se ejecuta automáticamente:
- Verifica que el Schedule esté ON
- Revisa el historial de ejecuciones

---

## 📱 Alternativa: Zapier

Si prefieres Zapier en lugar de Make.com:

1. **Trigger:** RSS by Zapier
2. **Action:** OpenAI (GPT-4)
3. **Action:** Webhooks by Zapier (POST)

La configuración es similar, solo cambia la interfaz.

---

## 🎉 ¡Listo!

Una vez configurado, tu blog se actualizará automáticamente con las últimas noticias de anime traducidas y adaptadas al español.

**Verifica tus artículos en:**
https://luffysunny.com/blog

---

## 📞 Soporte

Si tienes problemas:
1. Revisa el historial de ejecuciones en Make.com
2. Verifica los logs de Railway
3. Prueba el webhook manualmente con Postman primero

¡Tu blog de anime ahora es automático! 🚀✨


