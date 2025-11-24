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
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Middleware de logging para todas las peticiones
app.use((req, _res, next) => {
  console.log('\n🔵 ===== NUEVA PETICIÓN =====');
  console.log(`📍 ${req.method} ${req.path}`);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
  console.log('📦 Body (raw):', JSON.stringify(req.body, null, 2));
  
  // Arreglar body si tiene estructura anidada incorrecta
  if (req.body && typeof req.body === 'object' && req.body.error === undefined) {
    // A veces el body viene anidado en una propiedad extra
    const bodyKeys = Object.keys(req.body);
    if (bodyKeys.length === 1 && typeof req.body[bodyKeys[0]] === 'object') {
      console.log('🔄 Desenredando body anidado...');
      req.body = req.body[bodyKeys[0]];
    }
  }
  
  console.log('📦 Body (procesado):', JSON.stringify(req.body, null, 2));
  console.log('🔵 ===========================\n');
  next();
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

    // Validar campos obligatorios
    if (!title || !slug || !summary || !coverImageUrl) {
      console.error('❌ Faltan campos obligatorios:', {
        title: !!title,
        slug: !!slug,
        summary: !!summary,
        coverImageUrl: !!coverImageUrl,
      });
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios',
        missing: {
          title: !title,
          slug: !slug,
          summary: !summary,
          coverImageUrl: !coverImageUrl,
        }
      });
    }
    console.log('✅ Todos los campos obligatorios presentes');

    // 🔧 Normalizar content: aceptar content o contentMarkdown
    let finalContent = content || contentMarkdown || null;
    console.log('📄 Content final:', finalContent ? `${finalContent.substring(0, 50)}...` : 'null');

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

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`⚡ Backend listo en http://localhost:${PORT}`);
});



