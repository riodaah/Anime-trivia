export const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  'https://us-central1-anime-trivia-a7bb7.cloudfunctions.net';

export const API_ENDPOINTS = {
  webhookAnimeNews: `${API_BASE_URL}/webhookAnimeNews`,
  submitScore: `${API_BASE_URL}/submitScore`,
};

export const WEBHOOK_SECRET = import.meta.env.VITE_WEBHOOK_SECRET || '';

