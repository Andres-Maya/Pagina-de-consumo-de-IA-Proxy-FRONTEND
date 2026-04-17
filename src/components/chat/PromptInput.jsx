import React, { useRef, useEffect } from 'react';

export function PromptInput({ value, onChange, onSubmit, isDisabled, isLoading }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isDisabled && !isLoading && value.trim()) onSubmit();
    }
  };

  const canSend = !isDisabled && !isLoading && value.trim().length > 0;

  return (
    <div style={{ ...styles.container, ...(isDisabled ? styles.containerDisabled : {}) }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isDisabled ? 'Envío deshabilitado por rate limit…' : 'Escribe tu prompt… (Enter para enviar, Shift+Enter para nueva línea)'}
        disabled={isDisabled}
        rows={1}
        style={{
          ...styles.textarea,
          ...(isDisabled ? styles.textareaDisabled : {}),
        }}
      />
      <button
        onClick={onSubmit}
        disabled={!canSend}
        style={{
          ...styles.sendBtn,
          ...(canSend ? styles.sendBtnActive : styles.sendBtnDisabled),
        }}
        aria-label="Enviar mensaje"
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        )}
      </button>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 10,
    background: 'var(--color-surface2)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '10px 12px',
    transition: 'border-color 0.15s',
  },
  containerDisabled: {
    opacity: 0.6,
    borderColor: 'rgba(248,113,113,0.2)',
  },
  textarea: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    resize: 'none',
    fontSize: 14,
    lineHeight: 1.6,
    color: 'var(--color-text)',
    minHeight: 24,
    maxHeight: 200,
    overflowY: 'auto',
  },
  textareaDisabled: {
    cursor: 'not-allowed',
    color: 'var(--color-text3)',
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.15s, opacity 0.15s, transform 0.1s',
    border: 'none',
    cursor: 'pointer',
  },
  sendBtnActive: {
    background: 'var(--color-accent)',
    color: '#fff',
  },
  sendBtnDisabled: {
    background: 'var(--color-surface)',
    color: 'var(--color-text3)',
    cursor: 'not-allowed',
  },
};
