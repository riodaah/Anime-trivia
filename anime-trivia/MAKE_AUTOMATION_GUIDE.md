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

#### Prompt OPTIMIZADO PARA SEO (Copiar y pegar):
```
Eres un experto redactor de blogs de anime con conocimientos de SEO.

TAREA:
Convierte esta noticia RSS en un artículo COMPLETO y OPTIMIZADO para SEO en español:

TÍTULO RSS: {{1.title}}
ENLACE: {{1.link}}
DESCRIPCIÓN: {{1.description}}
IMAGEN: {{1.enclosure.url}}

REGLAS ESTRICTAS DE SEO:
1. **Título:** 60-70 caracteres, incluye palabra clave principal (nombre del anime + tema)
2. **Resumen:** 150-160 caracteres, con keyword principal y secundaria
3. **Contenido:** Mínimo 800 palabras, máximo 1500 palabras
4. **Keywords:**
   - Principal: [nombre del anime + tema específico]
   - Secundarias: anime, manga, noticias anime, otaku, streaming, Japón
   - Long-tail: [variaciones naturales]
5. **Estructura:**
   - 1 título H1 (será el title del JSON)
   - 3-5 subtítulos H2
   - 2-4 subtítulos H3
   - Párrafos de 3-5 líneas máximo
   - Listas con viñetas o numeradas cuando sea apropiado
   - Negritas en conceptos clave
   - Cursivas en títulos de animes/películas
6. **Densidad de Keywords:** 1-2% (keyword principal aparece 8-15 veces en 1000 palabras de forma natural)
7. **Enlaces:** Menciona fuente original si es relevante
8. **Tono:** Entusiasta, informativo, accesible para fans del anime

FORMATO DE SALIDA (JSON válido):
{
  "title": "Título SEO optimizado de 60-70 caracteres",
  "slug": "titulo-seo-optimizado-minusculas-sin-tildes",
  "summary": "Resumen de 150-160 caracteres con keyword principal y gancho emocional que invite a hacer clic",
  "contentMarkdown": "# Título H1 con Keyword Principal\n\n![Alt text descriptivo con keyword]({{if(empty(1.enclosure.url); "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800"; 1.enclosure.url)}})\n\n**Lead paragraph de 2-3 líneas con keyword principal que resuma el artículo**...\n\n## Subtítulo H2 Relevante\n\nContenido del párrafo con información valiosa...\n\n## Otro Subtítulo H2\n\nMás contenido...\n\n### Subtítulo H3 si es necesario\n\nDetalles adicionales...\n\n## Conclusión\n\nPárrafo final con llamado a la acción y keyword principal.",
  "coverImageUrl": "{{if(empty(1.enclosure.url); "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800"; 1.enclosure.url)}}",
  "tags": "tag1, tag2, tag3, tag4, tag5"
}

IMPORTANTE PARA MARKDOWN:
- Usa \n para saltos de línea (un solo backslash)
- Usa \n\n para separar párrafos
- NO uses \\n (doble backslash)
- NO uses comillas dentro del contenido, usa comillas simples si es necesario

TAGS:
- Debe incluir: nombre del anime, género, estudio de animación, palabras clave del tema
- Formato: texto plano separado por comas (NO array)
- Ejemplo: "zombieland saga, franchouchou, anime, japon, 4dx, eventos, musica"

SLUG:
- Minúsculas, sin tildes, sin caracteres especiales
- Usa guiones para separar palabras
- Ejemplo: "zombieland-saga-evento-4dx-imari"

Genera el artículo ahora.
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
  "title": "{{17.title}}",
  "slug": "{{17.slug}}-{{formatDate(now; "YYYY-MM-DD-HHmm")}}",
  "summary": "{{17.summary}}",
  "content": "{{17.contentMarkdown}}",
  "coverImageUrl": "{{17.coverImageUrl}}",
  "tags": "{{17.tags}}",
  "sourceUrl": "{{3.link}}"
}
```

**Nota importante sobre los números:** `{{17.xxx}}` es el número del módulo de ChatGPT en tu escenario. Si es diferente, ajústalo. `{{3.link}}` es del módulo RSS (usualmente el primero).

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


