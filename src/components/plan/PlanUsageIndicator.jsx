import React from 'react';

const PLAN_ACCENT = {
  FREE:       'var(--plan-free)',
  PRO:        'var(--plan-pro)',
  ENTERPRISE: 'var(--plan-enterprise)',
};

export function PlanUsageIndicator({ used, total, plan }) {
  const pct = Math.min((used / total) * 100, 100);
  const accent = PLAN_ACCENT[plan] ?? 'var(--color-accent)';

  const barColor =
    pct >= 90 ? 'var(--color-danger)' :
    pct >= 70 ? 'var(--color-warning)' :
    accent;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>Cuota mensual</span>
        <span style={{ ...styles.planTag, color: accent }}>
          {plan}
        </span>
      </div>

      {/* Progress bar */}
      <div style={styles.track}>
        <div
          style={{
            ...styles.fill,
            width: `${pct}%`,
            background: barColor,
            boxShadow: `0 0 8px ${barColor}60`,
          }}
        />
      </div>

      {/* Numbers */}
      <div style={styles.numbers}>
        <span style={{ ...styles.used, color: barColor }}>
          {formatTokens(used)}
        </span>
        <span style={styles.slash}>/</span>
        <span style={styles.total}>{formatTokens(total)}</span>
        <span style={styles.pct}>{pct.toFixed(1)}%</span>
      </div>

      {pct >= 90 && (
        <p style={styles.warning}>
          ⚠ Cuota casi agotada
        </p>
      )}
    </div>
  );
}

function formatTokens(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

const styles = {
  card: {
    background: 'var(--color-surface2)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 14px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
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
  planTag: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '1px',
  },
  track: {
    height: 6,
    background: 'var(--color-border)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.5s ease, background 0.3s',
  },
  numbers: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
  },
  used: {
    fontWeight: 700,
    fontSize: 14,
  },
  slash: {
    color: 'var(--color-text3)',
  },
  total: {
    color: 'var(--color-text2)',
    flex: 1,
  },
  pct: {
    fontSize: 11,
    color: 'var(--color-text3)',
  },
  warning: {
    fontSize: 11,
    color: 'var(--color-danger)',
    fontWeight: 500,
  },
};
