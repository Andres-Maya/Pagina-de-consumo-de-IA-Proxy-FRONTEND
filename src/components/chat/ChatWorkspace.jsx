import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../../hooks/useChat.js';
import { useRateLimitContext } from '../../context/RateLimitContext.jsx';
import { useUserContext } from '../../context/UserContext.jsx';
import { useUIContext } from '../../context/UIContext.jsx';
import { MessageThread } from './MessageThread.jsx';
import { PromptInput } from './PromptInput.jsx';
import { TokenEstimator } from './TokenEstimator.jsx';
import { PlanUsageIndicator } from '../plan/PlanUsageIndicator.jsx';
import { RateLimitCountdown } from '../plan/RateLimitCountdown.jsx';
import { UpgradeModal } from '../modals/UpgradeModal.jsx';

export function ChatWorkspace() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();
  const { isBlocked, requestsUsedThisMinute, retryAfterSeconds } = useRateLimitContext();
  const { plan } = useUserContext();
  const { activeModal } = useUIContext();
  const [draft, setDraft] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async () => {
    if (!draft.trim()) return;
    const text = draft;
    setDraft('');
    await sendMessage(text);
  };

  return (
    <div style={styles.workspace}>
      {/* Sidebar metrics panel */}
      <aside style={styles.metrics}>
        <PlanUsageIndicator
          used={plan.tokensUsed}
          total={plan.monthlyTokenLimit}
          plan={plan.type}
        />
        <RateLimitCountdown
          requestsUsed={requestsUsedThisMinute}
          requestsMax={plan.requestsPerMinute}
          retryAfter={isBlocked ? retryAfterSeconds : null}
        />
        <button style={styles.clearBtn} onClick={clearMessages}>
          Limpiar chat
        </button>
      </aside>

      {/* Main chat column */}
      <div style={styles.chatColumn}>
        <div style={styles.thread}>
          <MessageThread messages={messages} isLoading={isLoading} />
          <div ref={bottomRef} />
        </div>

        {error && (
          <div style={styles.errorBanner} role="alert">
            <span style={styles.errorIcon}>⚠</span>
            {error}
          </div>
        )}

        <div style={styles.inputArea}>
          <TokenEstimator text={draft} monthlyLimit={plan.monthlyTokenLimit} />
          <PromptInput
            value={draft}
            onChange={setDraft}
            onSubmit={handleSubmit}
            isDisabled={isBlocked}
            isLoading={isLoading}
          />
          {isBlocked && (
            <p style={styles.blockedHint}>
              Envío deshabilitado — reintentando en {retryAfterSeconds}s
            </p>
          )}
        </div>
      </div>

      {activeModal === 'upgrade' && <UpgradeModal />}
    </div>
  );
}

const styles = {
  workspace: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    height: '100%',
  },
  metrics: {
    width: 240,
    flexShrink: 0,
    borderRight: '1px solid var(--color-border)',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    background: 'var(--color-surface)',
    overflowY: 'auto',
  },
  chatColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
  },
  thread: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  errorBanner: {
    margin: '0 28px 8px',
    padding: '10px 14px',
    background: 'rgba(248,113,113,0.1)',
    border: '1px solid rgba(248,113,113,0.25)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-danger)',
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  errorIcon: {
    fontSize: 15,
  },
  inputArea: {
    padding: '0 28px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flexShrink: 0,
  },
  blockedHint: {
    fontSize: 12,
    color: 'var(--color-danger)',
    textAlign: 'center',
    fontFamily: 'var(--font-mono)',
  },
  clearBtn: {
    padding: '7px 12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
    background: 'transparent',
    color: 'var(--color-text3)',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
    marginTop: 'auto',
  },
};
