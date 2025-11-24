import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  WEBHOOK_SECRET,
  PORT = 4000,
} = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  throw new Error(
    'Faltan variables de entorno de Firebase. Define FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY.'
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Trivia backend operativo' });
});

app.post('/webhooks/anime-news', async (req, res) => {
  try {
    if (!WEBHOOK_SECRET) {
      return res.status(500).json({ error: 'WEBHOOK_SECRET no configurado' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return res.status(401).json({ error: 'No autorizado' });
    }

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

    if (!title || !slug || !summary || !coverImageUrl) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const existing = await db.collection('posts').where('slug', '==', slug).get();
    if (!existing.empty) {
      return res.status(409).json({ error: 'Slug ya existe' });
    }

    const payload = {
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

    const docRef = await db.collection('posts').add(payload);
    return res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error en webhookAnimeNews', error);
    return res.status(500).json({ error: 'Error interno' });
  }
});

app.post('/api/leaderboard', async (req, res) => {
  try {
    const { nickname, score, country, anime } = req.body;

    if (!nickname || typeof score !== 'number') {
      return res.status(400).json({ error: 'nickname y score son obligatorios' });
    }

    if (score < 0) {
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

    const docRef = await db.collection('leaderboard').add(payload);
    return res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error en submitScore', error);
    return res.status(500).json({ error: 'Error interno' });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`⚡ Backend listo en http://localhost:${PORT}`);
});


