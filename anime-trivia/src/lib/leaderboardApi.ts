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

export const getLeaderboard = async (filters: LeaderboardFilters = {}): Promise<LeaderboardEntry[]> => {
  try {
    let q = query(collection(db, 'leaderboard'), orderBy('score', 'desc'));

    // Filtrar por período
    if (filters.period === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      q = query(
        collection(db, 'leaderboard'),
        where('timestamp', '>=', Timestamp.fromDate(oneMonthAgo)),
        orderBy('score', 'desc')
      );
    }

    // Filtrar por anime
    if (filters.anime) {
      q = query(
        collection(db, 'leaderboard'),
        where('anime', '==', filters.anime),
        orderBy('score', 'desc')
      );
    }

    // Limitar resultados
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    } else {
      q = query(q, limit(100));
    }

    const querySnapshot = await getDocs(q);
    const entries: LeaderboardEntry[] = [];

    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data(),
      } as LeaderboardEntry);
    });

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
    const entries = await getLeaderboard({ limit: count });
    return entries;
  } catch (error) {
    console.error('Error fetching top scores:', error);
    return [];
  }
};

