import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

/**
 * Webhook para recibir posts de anime desde Make
 * 
 * Endpoint: POST /webhookAnimeNews
 * 
 * Headers requeridos:
 * - Authorization: Bearer {WEBHOOK_SECRET}
 * 
 * Body esperado:
 * {
 *   "title": "Título del post",
 *   "slug": "titulo-del-post",
 *   "summary": "Resumen del post",
 *   "contentMarkdown": "Contenido en markdown",
 *   "coverImageUrl": "https://...",
 *   "tags": ["anime", "news"],
 *   "publishedAt": "2025-01-23T12:00:00Z",
 *   "sourceUrl": "https://..."
 * }
 */
export const webhookAnimeNews = functions.https.onRequest(async (req, res) => {
  // Configurar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Validar secret
  const authHeader = req.headers.authorization;
  const expectedSecret = functions.config().webhook?.secret || process.env.WEBHOOK_SECRET;
  
  if (!expectedSecret) {
    console.error('WEBHOOK_SECRET no configurado');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const {
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

    // Validar campos requeridos
    if (!title || !slug || !summary || !coverImageUrl) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Verificar si el post ya existe
    const existingPost = await db.collection('posts').where('slug', '==', slug).get();
    if (!existingPost.empty) {
      res.status(409).json({ error: 'Post with this slug already exists' });
      return;
    }

    // Crear documento en Firestore
    const postData = {
      title,
      slug,
      summary,
      contentMarkdown: contentMarkdown || null,
      content: content || null,
      coverImageUrl,
      tags: tags || [],
      publishedAt: publishedAt || new Date().toISOString(),
      sourceUrl: sourceUrl || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('posts').add(postData);

    res.status(200).json({
      success: true,
      id: docRef.id,
      message: 'Post created successfully',
    });
  } catch (error: any) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * Endpoint para guardar puntuaciones
 * 
 * Endpoint: POST /submitScore
 * 
 * Body esperado:
 * {
 *   "nickname": "Usuario123",
 *   "score": 10,
 *   "country": "Chile",
 *   "anime": "One Piece"
 * }
 */
export const submitScore = functions.https.onRequest(async (req, res) => {
  // Configurar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { nickname, score, country, anime } = req.body;

    // Validar campos requeridos
    if (!nickname || typeof score !== 'number') {
      res.status(400).json({ error: 'Missing required fields: nickname and score' });
      return;
    }

    // Validar score
    if (score < 0) {
      res.status(400).json({ error: 'Score must be non-negative' });
      return;
    }

    // Crear documento en Firestore
    const scoreData = {
      nickname: nickname.trim(),
      score,
      country: country || null,
      anime: anime || null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('leaderboard').add(scoreData);

    res.status(200).json({
      success: true,
      id: docRef.id,
      message: 'Score submitted successfully',
    });
  } catch (error: any) {
    console.error('Error submitting score:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});




