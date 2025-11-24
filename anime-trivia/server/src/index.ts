import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

const {
  FIREBASE_SERVICE_ACCOUNT,
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  WEBHOOK_SECRET,
  PORT = 4000,
} = process.env;

// Opción 1: Usar service account JSON completo (más fácil)
if (FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    console.log('✅ Firebase inicializado con Service Account JSON');
  } catch (error) {
    console.error('❌ Error parseando FIREBASE_SERVICE_ACCOUNT:', error);
    throw new Error('FIREBASE_SERVICE_ACCOUNT no es un JSON válido');
  }
}
// Opción 2: Usar variables individuales
else if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
  if (!admin.apps.length) {
    try {
      // Intentar diferentes formas de procesar la clave privada
      let privateKey = FIREBASE_PRIVATE_KEY;
      
      // Si tiene \\n literales, reemplazarlos con saltos de línea reales
      if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      
      console.log('🔑 Inicializando Firebase con credenciales individuales...');
      console.log('📝 Project ID:', FIREBASE_PROJECT_ID);
      console.log('📧 Client Email:', FIREBASE_CLIENT_EMAIL);
      console.log('🔐 Private Key length:', privateKey.length);
      console.log('🔐 Private Key starts with:', privateKey.substring(0, 50));
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log('✅ Firebase inicializado con credenciales individuales');
    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error);
      throw error;
    }
  }
} else {
  throw new Error(
    'Faltan variables de entorno de Firebase. Define FIREBASE_SERVICE_ACCOUNT (JSON completo) O (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY).'
  );
}

const db = admin.firestore();
const app = express();

app.use(cors());

// Middleware ROBUSTO para parsear JSON malformado
app.use((req, res, next) => {
  if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'PATCH') {
    return next();
  }

  let rawBody = '';
  
  req.on('data', chunk => {
    rawBody += chunk.toString();
  });

  req.on('end', () => {
    console.log('\n🔵 ===== NUEVA PETICIÓN =====');
    console.log(`📍 ${req.method} ${req.path}`);
    console.log('📋 Content-Type:', req.headers['content-type']);
    console.log('📦 Raw Body (primeros 500 chars):', rawBody.substring(0, 500));

    // Si no hay body, continuar
    if (!rawBody || rawBody.trim() === '') {
      req.body = {};
      console.log('⚠️ Body vacío');
      return next();
    }

    // Si es application/x-www-form-urlencoded
    if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      try {
        const params = new URLSearchParams(rawBody);
        req.body = {};
        for (const [key, value] of params) {
          try {
            req.body[key] = JSON.parse(value);
          } catch {
            req.body[key] = value;
          }
        }
        console.log('✅ Body parseado desde form-urlencoded');
        console.log('📦 Body final:', JSON.stringify(req.body, null, 2));
        return next();
      } catch (error) {
        console.error('❌ Error parseando form-urlencoded:', error);
        return res.status(400).json({ error: 'Form-urlencoded inválido' });
      }
    }

    // Si es JSON, intentar parsearlo con múltiples estrategias
    if (req.headers['content-type']?.includes('application/json')) {
      let parsed = false;

      // Estrategia 1: Parsear directamente
      try {
        req.body = JSON.parse(rawBody);
        console.log('✅ JSON parseado correctamente (estrategia 1)');
        parsed = true;
      } catch (error1) {
        console.warn('⚠️ Estrategia 1 falló, intentando arreglar JSON...');

        // Estrategia 2: Arreglar comillas dobles mal escapadas
        try {
          let fixed = rawBody;

          // Arreglar comillas dentro de valores de string (excepto las de la estructura JSON)
          // Esto es complejo, así que usamos una estrategia: convertir \" a ' dentro de valores
          fixed = fixed.replace(/"content"\s*:\s*"(.*?)"/gs, (match, content) => {
            // Dentro del campo 'content', reemplazar \" con '
            const fixedContent = content
              .replace(/\\"/g, "'")  // \" → '
              .replace(/(?<!\\)"/g, "'");  // " → ' (si no está escapada)
            return `"content":"${fixedContent}"`;
          });

          // Lo mismo para 'contentMarkdown'
          fixed = fixed.replace(/"contentMarkdown"\s*:\s*"(.*?)"/gs, (match, content) => {
            const fixedContent = content
              .replace(/\\"/g, "'")
              .replace(/(?<!\\)"/g, "'");
            return `"contentMarkdown":"${fixedContent}"`;
          });

          // Arreglar saltos de línea literales no escapados
          fixed = fixed.replace(/"(content|contentMarkdown)"\s*:\s*"(.*?)"/gs, (match, field, content) => {
            const fixedContent = content
              .replace(/\n/g, '\\n')
              .replace(/\r/g, '\\r')
              .replace(/\t/g, '\\t');
            return `"${field}":"${fixedContent}"`;
          });

          req.body = JSON.parse(fixed);
          console.log('✅ JSON arreglado y parseado (estrategia 2)');
          parsed = true;
        } catch (error2) {
          console.warn('⚠️ Estrategia 2 falló, intentando estrategia 3...');

          // Estrategia 3: Reconstruir JSON desde cero
          try {
            // Extraer campos uno por uno con regex más robusta
            const extractField = (fieldName: string, defaultValue: any = null) => {
              const regex = new RegExp(`"${fieldName}"\\s*:\\s*"([^]*?)"(?=\\s*,|\\s*})`);
              const match = rawBody.match(regex);
              if (match) {
                let value = match[1];
                // Limpiar escapes incorrectos
                value = value
                  .replace(/\\n/g, '\n')
                  .replace(/\\r/g, '\r')
                  .replace(/\\t/g, '\t')
                  .replace(/\\"/g, '"')
                  .replace(/\\\\/g, '\\');
                return value;
              }
              return defaultValue;
            };

            req.body = {
              title: extractField('title', ''),
              slug: extractField('slug', ''),
              summary: extractField('summary', ''),
              content: extractField('content') || extractField('contentMarkdown', ''),
              contentMarkdown: extractField('contentMarkdown') || extractField('content', ''),
              coverImageUrl: extractField('coverImageUrl', ''),
              tags: extractField('tags', ''),
              sourceUrl: extractField('sourceUrl', ''),
            };

            console.log('✅ JSON reconstruido manualmente (estrategia 3)');
            parsed = true;
          } catch (error3) {
            console.error('❌ Todas las estrategias fallaron');
            console.error('Error 1:', error1);
            console.error('Error 2:', error2);
            console.error('Error 3:', error3);
            return res.status(400).json({ 
              error: 'JSON inválido o malformado',
              details: 'No se pudo parsear el JSON con ninguna estrategia'
            });
          }
        }
      }

      if (parsed) {
        console.log('📦 Body final:', JSON.stringify(req.body, null, 2));
        console.log('🔵 ===========================\n');
        return next();
      }
    }

    // Si no es JSON ni form-urlencoded, intentar como JSON de todos modos
    try {
      req.body = JSON.parse(rawBody);
      console.log('✅ Body parseado como JSON (fallback)');
      return next();
    } catch {
      req.body = { raw: rawBody };
      console.log('⚠️ Body guardado como raw');
      return next();
    }
  });

  req.on('error', (error) => {
    console.error('❌ Error leyendo body:', error);
    res.status(400).json({ error: 'Error leyendo body' });
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Trivia backend operativo' });
});

app.post('/webhooks/anime-news', async (req, res) => {
  console.log('🎬 ===== WEBHOOK ANIME NEWS =====');
  
  try {
    // Validar WEBHOOK_SECRET
    if (!WEBHOOK_SECRET) {
      console.error('❌ WEBHOOK_SECRET no está configurado');
      return res.status(500).json({ error: 'WEBHOOK_SECRET no configurado' });
    }
    console.log('✅ WEBHOOK_SECRET está configurado');

    // Validar Authorization
    const authHeader = req.headers.authorization;
    console.log('🔑 Authorization Header:', authHeader);
    console.log('🔑 Expected:', `Bearer ${WEBHOOK_SECRET}`);
    
    if (!authHeader || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      console.error('❌ Autorización inválida');
      return res.status(401).json({ error: 'No autorizado' });
    }
    console.log('✅ Autorización válida');

    // Extraer campos del body
    let {
      title,
      slug,
      summary,
      contentMarkdown,
      content,
      coverImageUrl,
      tags,
      publishedAt,
      sourceUrl,
    } = req.body;

    console.log('📝 Campos recibidos (raw):');
    console.log('  - title:', title ? '✅' : '❌', title);
    console.log('  - slug:', slug ? '✅' : '❌', slug);
    console.log('  - summary:', summary ? '✅' : '❌', summary);
    console.log('  - coverImageUrl:', coverImageUrl ? '✅' : '❌', coverImageUrl);
    console.log('  - content:', content ? '✅' : '❌', content ? `${content.substring(0, 50)}...` : 'null');
    console.log('  - contentMarkdown:', contentMarkdown ? '✅' : '❌');
    console.log('  - tags (raw):', tags, typeof tags);
    console.log('  - sourceUrl:', sourceUrl);

    // 🔧 Normalizar tags: aceptar string o array
    if (tags) {
      if (typeof tags === 'string') {
        // Si es string, convertir a array separando por comas
        tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        console.log('🔄 Tags convertidos de string a array:', tags);
      } else if (Array.isArray(tags)) {
        // Si ya es array, solo limpiar
        tags = tags.map(tag => String(tag).trim()).filter(tag => tag.length > 0);
        console.log('✅ Tags ya es array:', tags);
      } else {
        // Si no es ni string ni array, convertir a array vacío
        console.log('⚠️ Tags en formato inesperado, usando array vacío');
        tags = [];
      }
    } else {
      tags = [];
    }

    console.log('📝 Tags finales:', tags);

    // 🔧 Normalizar content: aceptar content o contentMarkdown
    let finalContent = content || contentMarkdown || null;
    
    // Convertir \n literales a saltos de línea reales
    if (finalContent && typeof finalContent === 'string') {
      finalContent = finalContent.replace(/\\n/g, '\n');
      finalContent = finalContent.replace(/\\t/g, '\t');
      finalContent = finalContent.replace(/\\"/g, '"');
      console.log('🔄 Content procesado con saltos de línea reales');
    }
    
    console.log('📄 Content final:', finalContent ? `${finalContent.substring(0, 50)}...` : 'null');

    // Validar campos obligatorios
    const missingFields = {
      title: !title,
      slug: !slug,
      summary: !summary,
      coverImageUrl: !coverImageUrl,
      content: !finalContent,
    };

    const hasMissingFields = Object.values(missingFields).some(missing => missing);

    if (hasMissingFields) {
      console.error('❌ Faltan campos obligatorios:', missingFields);
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios',
        missing: missingFields,
        help: 'Asegúrate de enviar: title, slug, summary, coverImageUrl y content (o contentMarkdown)'
      });
    }
    console.log('✅ Todos los campos obligatorios presentes');

    // Verificar si el slug ya existe
    console.log('🔍 Verificando si el slug ya existe...');
    const existing = await db.collection('posts').where('slug', '==', slug).get();
    if (!existing.empty) {
      console.error('❌ Slug ya existe:', slug);
      return res.status(409).json({ error: 'Slug ya existe', slug });
    }
    console.log('✅ Slug es único');

    // Crear el payload
    const payload = {
      title,
      slug,
      summary,
      content: finalContent,
      coverImageUrl,
      tags: tags,
      publishedAt: publishedAt || new Date().toISOString(),
      sourceUrl: sourceUrl || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    console.log('💾 Guardando en Firestore...');
    const docRef = await db.collection('posts').add(payload);
    console.log('✅ Guardado exitosamente con ID:', docRef.id);
    
    return res.json({ success: true, id: docRef.id, slug });
  } catch (error) {
    console.error('❌ Error en webhookAnimeNews:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
    return res.status(500).json({ 
      error: 'Error interno',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    console.log('🎬 ===== FIN WEBHOOK =====\n');
  }
});

app.post('/api/leaderboard', async (req, res) => {
  console.log('🏆 ===== SUBMIT SCORE =====');
  
  try {
    const { nickname, score, country, anime } = req.body;

    console.log('📝 Datos recibidos:');
    console.log('  - nickname:', nickname);
    console.log('  - score:', score);
    console.log('  - country:', country);
    console.log('  - anime:', anime);

    if (!nickname || typeof score !== 'number') {
      console.error('❌ Validación fallida: nickname o score inválidos');
      return res.status(400).json({ error: 'nickname y score son obligatorios' });
    }

    if (score < 0) {
      console.error('❌ Score negativo:', score);
      return res.status(400).json({ error: 'El score debe ser positivo' });
    }

    const payload = {
      nickname: nickname.trim(),
      score,
      country: country || null,
      anime: anime || null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    console.log('💾 Guardando score en Firestore...');
    const docRef = await db.collection('scores').add(payload);
    console.log('✅ Score guardado con ID:', docRef.id);
    
    return res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('❌ Error en submitScore:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
    return res.status(500).json({ 
      error: 'Error interno',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    console.log('🏆 ===== FIN SUBMIT SCORE =====\n');
  }
});

// Endpoint para generar sitemap.xml dinámico
app.get('/sitemap.xml', async (_req, res) => {
  console.log('🗺️ ===== GENERANDO SITEMAP =====');
  
  try {
    // Obtener todos los posts publicados
    const postsSnapshot = await db.collection('posts')
      .orderBy('publishedAt', 'desc')
      .limit(500)
      .get();

    const postUrls = postsSnapshot.docs.map(doc => {
      const data = doc.data();
      const publishedDate = data.publishedAt ? new Date(data.publishedAt).toISOString() : new Date().toISOString();
      
      return `
  <url>
    <loc>https://anime-trivia-a7bb7.web.app/blog/${data.slug}</loc>
    <lastmod>${publishedDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://anime-trivia-a7bb7.web.app/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://anime-trivia-a7bb7.web.app/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://anime-trivia-a7bb7.web.app/play</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://anime-trivia-a7bb7.web.app/ranking</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>${postUrls}
</urlset>`;

    console.log(`✅ Sitemap generado con ${postsSnapshot.size} posts`);
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('❌ Error generando sitemap:', error);
    res.status(500).send('Error generando sitemap');
  } finally {
    console.log('🗺️ ===== FIN SITEMAP =====\n');
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`⚡ Backend listo en http://localhost:${PORT}`);
});



