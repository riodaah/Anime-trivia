# 🤖 Prompt CORREGIDO para ChatGPT en Make.com

## ⚠️ Problema Detectado:
El slug está vacío y el JSON tiene caracteres mal escapados.

---

## ✅ Nuevo Prompt (Copia y Pega en Make.com)

```
Eres un experto redactor de blogs de anime con conocimientos de SEO.

NOTICIA ORIGINAL:
Título: {{3.title}}
Enlace: {{3.link}}
Descripción: {{3.description}}
Imagen: {{3.enclosure.url}}

TAREA:
Convierte esta noticia en un artículo COMPLETO en español, optimizado para SEO.

REGLAS ESTRICTAS:
1. **Título:** 60-70 caracteres, con keyword principal (nombre anime + tema)
2. **Slug:** OBLIGATORIO, minúsculas, sin tildes, con guiones
   - Ejemplo: "zombieland-saga-evento-4dx-imari"
   - NUNCA dejes el slug vacío
3. **Resumen:** 150-160 caracteres
4. **Contenido:** 800-1200 palabras en Markdown
5. **Estructura:**
   - 1 título H1
   - 3-5 subtítulos H2
   - 2-4 subtítulos H3
   - Párrafos cortos (3-5 líneas)
   - Usa negritas para conceptos clave
6. **Tags:** 5-7 tags separados por comas

FORMATO DE SALIDA (JSON válido - MUY IMPORTANTE):
{
  "title": "Título optimizado de 60-70 caracteres",
  "slug": "titulo-en-minusculas-con-guiones-sin-tildes",
  "summary": "Resumen de 150-160 caracteres que invite a hacer clic",
  "contentMarkdown": "# Título Principal\n\nPárrafo introductorio...\n\n## Subtítulo H2\n\nContenido...",
  "coverImageUrl": "{{3.enclosure.url}}",
  "tags": "tag1, tag2, tag3, tag4, tag5"
}

REGLAS CRÍTICAS PARA JSON:
- NO uses comillas dobles dentro del contenido (usa comillas simples o evítalas)
- El slug NUNCA debe estar vacío
- Usa \n para saltos de línea (un solo backslash)
- NO uses caracteres especiales en el slug (solo letras, números y guiones)
- Si el título tiene tildes, quítalas en el slug

EJEMPLO DE SLUG CORRECTO:
Título: "Kaede Hondo celebra el estreno 4DX de Zombieland Saga"
Slug: "kaede-hondo-celebra-estreno-4dx-zombieland-saga"

Genera el artículo ahora en español.
```

---

## 📝 Configuración del HTTP Module (Make.com)

### Headers:
| Name | Value |
|------|-------|
| `Content-Type` | `application/json` |
| `Authorization` | `Bearer TU_WEBHOOK_SECRET` |

### Body (Raw):
```json
{
  "title": "{{17.title}}",
  "slug": "{{17.slug}}-{{formatDate(now; "YYYY-MM-DD-HHmm")}}",
  "summary": "{{17.summary}}",
  "content": "{{17.contentMarkdown}}",
  "coverImageUrl": "{{if(empty(17.coverImageUrl); "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800"; 17.coverImageUrl)}}",
  "tags": "{{17.tags}}",
  "sourceUrl": "{{3.link}}"
}
```

**IMPORTANTE:** Cambia `{{17.xxx}}` por el número del módulo de ChatGPT en tu escenario.

---

## 🧪 Test antes de ejecutar:

1. Copia el prompt nuevo
2. Pégalo en el módulo OpenAI
3. Haz clic en "Run once"
4. Verifica el output del módulo OpenAI (debe tener slug completo)
5. Si todo está bien, ejecuta el escenario completo

---

## 🔍 Debugging: Si sigue fallando

### Opción 1: Agregar módulo "Text Parser" antes del HTTP

Después del módulo ChatGPT, agrega:

**Módulo:** `Tools` > `Text Parser` > `Replace`

**Configuración:**
- **Text:** `{{17.contentMarkdown}}`
- **Pattern:** `"`
- **Replace with:** `'`

Esto reemplaza comillas dobles con simples dentro del contenido.

### Opción 2: Generar el slug manualmente

En el HTTP module, cambia:
```json
"slug": "{{if(empty(17.slug); "articulo"; 17.slug)}}-{{formatDate(now; "YYYY-MM-DD-HHmm")}}"
```

Esto pone "articulo" como fallback si el slug está vacío.

---

## ✅ Checklist:

- [ ] Actualizar prompt de ChatGPT
- [ ] Verificar que el módulo de ChatGPT es el número correcto (17 en tu caso)
- [ ] Asegurar que el Body del HTTP usa `{{17.slug}}` (no `{{3.slug}}`)
- [ ] Probar con "Run once"
- [ ] Verificar que el slug tiene contenido antes del timestamp
- [ ] Verificar que el JSON es válido en el output de ChatGPT

---

¡Prueba con este prompt corregido y avísame si funciona! 🚀



