import { useState, useCallback } from 'react';
import { activeAiService } from '../api/aiService.js';
import { RateLimitError, QuotaExhaustedError } from '../api/client.js';
import { useRateLimitContext } from '../context/RateLimitContext.jsx';
import { useUserContext } from '../context/UserContext.jsx';
import { useUIContext } from '../context/UIContext.jsx';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isBlocked, blockFor, incrementRequests } = useRateLimitContext();
  const { consumeTokens } = useUserContext();
  const { openModal } = useUIContext();

  const sendMessage = useCallback(
    async (prompt) => {
      if (isBlocked || isLoading || !prompt.trim()) return;

      const userMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: prompt,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await activeAiService.sendMessage({
          prompt,
          conversationId: 'session-1',
        });

        const assistantMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.message,
          tokensUsed: response.tokensUsed,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        consumeTokens(response.tokensUsed);
        incrementRequests();
      } catch (err) {
        if (err instanceof RateLimitError) {
          blockFor(err.retryAfter);
          setError(
            `Límite de requests alcanzado. Reintentando en ${err.retryAfter} segundos.`
          );
        } else if (err instanceof QuotaExhaustedError) {
          openModal('upgrade');
        } else {
          setError(err.message ?? 'Error desconocido al conectar con la IA.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isBlocked, isLoading, blockFor, consumeTokens, incrementRequests, openModal]
  );

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
