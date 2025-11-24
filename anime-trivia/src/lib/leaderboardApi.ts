import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { API_ENDPOINTS } from '@/config/apiConfig';

export interface LeaderboardEntry {
  id?: string;
  nickname: string;
  score: number;
  country?: string;
  anime?: string;
  timestamp: any;
  createdAt?: any;
}

export interface LeaderboardFilters {
  period?: 'global' | 'month';
  anime?: string;
  limit?: number;
}

// Función compatible con la firma antigua (anime, period, limit)
export const getLeaderboard = async (
  anime: string = 'all',
  period: 'global' | 'month' = 'global',
  limitCount: number = 100
): Promise<LeaderboardEntry[]> => {
  try {
    console.log('Fetching leaderboard from Firestore...', { anime, period, limitCount });
    
    let q = query(collection(db, 'scores'), orderBy('score', 'desc'));

    // Filtrar por período
    if (period === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      q = query(
        collection(db, 'scores'),
        where('timestamp', '>=', Timestamp.fromDate(oneMonthAgo)),
        orderBy('timestamp', 'desc'),
        orderBy('score', 'desc')
      );
    }

    // Filtrar por anime (si no es 'all' o 'Todos')
    if (anime && anime !== 'all' && anime !== 'Todos') {
      q = query(
        collection(db, 'scores'),
        where('anime', '==', anime),
        orderBy('score', 'desc')
      );
    }

    // Limitar resultados
    q = query(q, limit(limitCount));

    const querySnapshot = await getDocs(q);
    const entries: LeaderboardEntry[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      entries.push({
        id: doc.id,
        nickname: data.playerName || data.nickname || 'Anónimo',
        score: data.score || 0,
        country: data.country || '',
        anime: data.anime || '',
        timestamp: data.timestamp || data.createdAt,
      } as LeaderboardEntry);
    });

    console.log(`Found ${entries.length} entries in leaderboard`);
    return entries;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

export const submitScore = async (payload: {
  nickname: string;
  score: number;
  country?: string;
  anime?: string;
}): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(API_ENDPOINTS.submitScore, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, ...data };
  } catch (error) {
    console.error('Error submitting score:', error);
    return { success: false, message: 'Error al guardar puntuación' };
  }
};

export const getTopScores = async (count: number = 5): Promise<LeaderboardEntry[]> => {
  try {
    const entries = await getLeaderboard('all', 'global', count);
    return entries;
  } catch (error) {
    console.error('Error fetching top scores:', error);
    return [];
  }
};

