import React from 'react';
import { useLocation } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext.jsx';
import { useRateLimitContext } from '../../context/RateLimitContext.jsx';

const TITLES = {
  '/chat': 'Chat con IA',
  '/dashboard': 'Dashboard de uso',
};

export function TopBar() {
  const { pathname } = useLocation();
  const { plan } = useUserContext();
  const { isBlocked, retryAfterSeconds } = useRateLimitContext();

  const title = TITLES[pathname] ?? 'IA Proxy';
  const usagePct = Math.min((plan.tokensUsed / plan.monthlyTokenLimit) * 100, 100);

  return (
    <header style={styles.bar}>
      <h1 style={styles.title}>{title}</h1>

      <div style={styles.right}>
        {/* Rate-limit alert */}
        {isBlocked && (
          <div style={styles.rateLimitPill}>
            <span style={styles.rateLimitDot} />
            Bloqueado {retryAfterSeconds}s
          </div>
        )}

        {/* Token usage quick stat */}
        <div style={styles.stat}>
          <span style={styles.statLabel}>Tokens</span>
          <span style={styles.statValue}>
            {formatTokens(plan.tokensUsed)}
            <span style={styles.statMax}> / {formatTokens(plan.monthlyTokenLimit)}</span>
          </span>
          <div style={styles.miniBar}>
            <div
              style={{
                ...styles.miniBarFill,
                width: `${usagePct}%`,
                background: usagePct >= 90
                  ? 'var(--color-danger)'
                  : usagePct >= 70
                  ? 'var(--color-warning)'
                  : 'var(--color-success)',
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function formatTokens(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

const styles = {
  bar: {
    height: 56,
    borderBottom: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    flexShrink: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--color-text)',
    letterSpacing: '-0.2px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  rateLimitPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(248,113,113,0.12)',
    border: '1px solid rgba(248,113,113,0.3)',
    color: 'var(--color-danger)',
    borderRadius: 20,
    padding: '4px 12px',
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
  },
  rateLimitDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--color-danger)',
    animation: 'pulse 1s infinite',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'var(--color-text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: 12,
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text)',
  },
  statMax: {
    color: 'var(--color-text3)',
    fontWeight: 400,
  },
  miniBar: {
    width: 80,
    height: 3,
    background: 'var(--color-border)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.4s ease',
  },
};
