import React from 'react';
import { useCountdown } from '../../hooks/useCountdown.js';

const CIRCUMFERENCE = 2 * Math.PI * 20; // r=20

export function RateLimitCountdown({ requestsUsed, requestsMax, retryAfter }) {
  useCountdown();

  const isBlocked = retryAfter !== null;
  const usedPct = Math.min((requestsUsed / requestsMax) * 100, 100);
  const countdownPct = isBlocked ? (retryAfter / 60) * 100 : 0;
  const strokeDash = (countdownPct / 100) * CIRCUMFERENCE;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>Requests / min</span>
        {isBlocked && <span style={styles.blockedBadge}>BLOQUEADO</span>}
      </div>

      {isBlocked ? (
        /* Circular countdown ring */
        <div style={styles.ringWrap}>
          <svg width="56" height="56" viewBox="0 0 48 48">
            {/* Track */}
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="3"
            />
            {/* Progress */}
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke="var(--color-danger)"
              strokeWidth="3"
              strokeDasharray={`${strokeDash} ${CIRCUMFERENCE}`}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '24px 24px', transition: 'stroke-dasharray 0.9s linear' }}
            />
          </svg>
          <span style={styles.countdownNum}>{retryAfter}s</span>
        </div>
      ) : (
        /* Linear bar */
        <div style={styles.linearWrap}>
          <div style={styles.track}>
            <div
              style={{
                ...styles.fill,
                width: `${usedPct}%`,
                background: usedPct >= 80 ? 'var(--color-danger)' : usedPct >= 60 ? 'var(--color-warning)' : 'var(--color-accent)',
              }}
            />
          </div>
          <div style={styles.counter}>
            <span style={styles.countNum}>{requestsUsed}</span>
            <span style={styles.countMax}> / {requestsMax}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--color-surface2)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--color-text2)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  blockedBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.5px',
    color: 'var(--color-danger)',
    background: 'rgba(248,113,113,0.1)',
    border: '1px solid rgba(248,113,113,0.25)',
    padding: '2px 6px',
    borderRadius: 4,
  },
  ringWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  countdownNum: {
    position: 'absolute',
    fontSize: 13,
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-danger)',
  },
  linearWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  track: {
    height: 5,
    background: 'var(--color-border)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s ease, background 0.3s',
  },
  counter: {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
  },
  countNum: {
    fontWeight: 700,
    color: 'var(--color-text)',
  },
  countMax: {
    color: 'var(--color-text3)',
  },
};
