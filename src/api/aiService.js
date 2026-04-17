import { httpClient } from './client.js';

// ─── AI Service ──────────────────────────────────────────────
export const aiService = {
  /**
   * Send a prompt to the AI proxy.
   * Returns: { message, tokensUsed, requestsRemaining, resetAt }
   */
  sendMessage: (payload) =>
    httpClient.post('/ai/chat', payload),

  /**
   * Fetch usage history for the last N days.
   * Returns: DailyUsage[] — [{ date, tokensUsed, requestCount }]
   */
  getUsageHistory: (days = 7) =>
    httpClient.get('/ai/usage/history', { params: { days: String(days) } }),
};

// ─── Mock for local development (no backend needed) ──────────
export const mockAiService = {
  sendMessage: async ({ prompt }) => {
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    // Simulate occasional rate limit for testing
    if (Math.random() < 0.05) {
      const { RateLimitError } = await import('./client.js');
      throw new RateLimitError(30);
    }

    const words = prompt.split(' ').length;
    const tokensUsed = Math.ceil(prompt.length / 4) + 20 + Math.floor(Math.random() * 80);

    return {
      message: `Respuesta simulada para: "${prompt.slice(0, 60)}${prompt.length > 60 ? '…' : ''}".\n\nEsta es una respuesta mock generada localmente para desarrollo. En producción, aquí aparecerá la respuesta real del modelo de IA conectado al proxy backend.`,
      tokensUsed,
      requestsRemaining: Math.floor(Math.random() * 15) + 1,
      resetAt: Date.now() + 60_000,
    };
  },

  getUsageHistory: async (days = 7) => {
    await new Promise((r) => setTimeout(r, 300));
    return Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      return {
        date: d.toISOString().slice(0, 10),
        tokensUsed: Math.floor(Math.random() * 8000) + 500,
        requestCount: Math.floor(Math.random() * 40) + 5,
      };
    });
  },
};

// Switch between real and mock based on env flag
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.DEV;
export const activeAiService = USE_MOCK ? mockAiService : aiService;
