import React from 'react';

export function MessageThread({ messages, isLoading }) {
  if (messages.length === 0 && !isLoading) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p style={styles.emptyTitle}>Comienza una conversación</p>
        <p style={styles.emptySubtitle}>Escribe un prompt y presiona enviar.</p>
      </div>
    );
  }

  return (
    <>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && <TypingIndicator />}
    </>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ ...styles.row, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && <div style={styles.avatar}>AI</div>}
      <div style={{ ...styles.bubble, ...(isUser ? styles.userBubble : styles.aiBubble) }}>
        <p style={styles.content}>{message.content}</p>
        <div style={styles.meta}>
          <span style={styles.time}>
            {new Date(message.timestamp).toLocaleTimeString('es-ES', {
              hour: '2-digit', minute: '2-digit',
            })}
          </span>
          {message.tokensUsed != null && (
            <span style={styles.tokens}>{message.tokensUsed} tokens</span>
          )}
        </div>
      </div>
      {isUser && <div style={{ ...styles.avatar, ...styles.userAvatar }}>Tú</div>}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ ...styles.row, justifyContent: 'flex-start' }}>
      <div style={styles.avatar}>AI</div>
      <div style={{ ...styles.bubble, ...styles.aiBubble, ...styles.typing }}>
        <span style={styles.dot} />
        <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
        <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}

const styles = {
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 40,
    color: 'var(--color-text3)',
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 'var(--radius-lg)',
    background: 'var(--color-surface2)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--color-text2)',
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'var(--color-text3)',
  },
  row: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'var(--color-surface2)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--color-accent)',
    flexShrink: 0,
    letterSpacing: '0.3px',
  },
  userAvatar: {
    color: 'var(--color-text2)',
  },
  bubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  aiBubble: {
    background: 'var(--color-surface2)',
    border: '1px solid var(--color-border)',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    background: 'rgba(108,138,255,0.15)',
    border: '1px solid rgba(108,138,255,0.25)',
    borderBottomRightRadius: 4,
  },
  content: {
    fontSize: 14,
    lineHeight: 1.65,
    color: 'var(--color-text)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 11,
    color: 'var(--color-text3)',
    fontFamily: 'var(--font-mono)',
  },
  tokens: {
    fontSize: 11,
    color: 'var(--color-accent)',
    fontFamily: 'var(--font-mono)',
    background: 'rgba(108,138,255,0.1)',
    padding: '1px 6px',
    borderRadius: 4,
  },
  typing: {
    flexDirection: 'row',
    gap: 6,
    padding: '14px 18px',
  },
  dot: {
    display: 'inline-block',
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: 'var(--color-text3)',
    animation: 'bounce 1.2s infinite',
  },
};
