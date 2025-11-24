export const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  'https://anime-trivia-production.up.railway.app';

export const API_ENDPOINTS = {
  webhookAnimeNews: `${API_BASE_URL}/webhooks/anime-news`,
  submitScore: `${API_BASE_URL}/api/leaderboard`,
};

export const WEBHOOK_SECRET = import.meta.env.VITE_WEBHOOK_SECRET || '';

