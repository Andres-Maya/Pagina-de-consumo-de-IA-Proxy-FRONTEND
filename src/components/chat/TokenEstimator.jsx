import React from 'react';
import { useTokenEstimator } from '../../hooks/useTokenEstimator.js';

const SEVERITY_STYLES = {
  low:    { color: 'var(--color-success)', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.2)'  },
  medium: { color: 'var(--color-warning)', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)'  },
  high:   { color: 'var(--color-danger)',  bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
};

export function TokenEstimator({ text, monthlyLimit }) {
  const { estimated, severity } = useTokenEstimator(text);
  const s = SEVERITY_STYLES[severity];

  if (!text || text.trim().length === 0) return null;

  return (
    <div style={{ ...styles.badge, background: s.bg, border: `1px solid ${s.border}` }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span style={{ ...styles.label, color: s.color }}>
        ~{estimated.toLocaleString('es-ES')} tokens estimados
      </span>
      {monthlyLimit && (
        <span style={styles.pct}>
          ({((estimated / monthlyLimit) * 100).toFixed(2)}% de tu cuota)
        </span>
      )}
    </div>
  );
}

const styles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 12,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 500,
  },
  pct: {
    color: 'var(--color-text3)',
    fontSize: 11,
  },
};
