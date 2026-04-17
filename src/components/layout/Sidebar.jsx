import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext.jsx';

const NAV_ITEMS = [
  {
    to: '/chat',
    label: 'Chat',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
];

export function Sidebar() {
  const { plan } = useUserContext();

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoMark}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <span style={styles.logoText}>IA Proxy</span>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <span style={styles.navIcon}>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Plan badge at bottom */}
      <div style={styles.footer}>
        <div style={{
          ...styles.planBadge,
          background: PLAN_COLORS[plan.type].bg,
          color: PLAN_COLORS[plan.type].text,
          border: `1px solid ${PLAN_COLORS[plan.type].border}`,
        }}>
          <span style={styles.planDot} />
          {plan.type}
        </div>
        <div style={styles.planUsageMini}>
          <div style={styles.planBarTrack}>
            <div
              style={{
                ...styles.planBarFill,
                width: `${Math.min((plan.tokensUsed / plan.monthlyTokenLimit) * 100, 100)}%`,
                background: PLAN_COLORS[plan.type].text,
              }}
            />
          </div>
          <span style={styles.planUsageLabel}>
            {formatTokens(plan.tokensUsed)} / {formatTokens(plan.monthlyTokenLimit)}
          </span>
        </div>
      </div>
    </aside>
  );
}

function formatTokens(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

const PLAN_COLORS = {
  FREE:       { bg: 'rgba(107,114,128,0.15)', text: '#9ca3af', border: 'rgba(107,114,128,0.3)' },
  PRO:        { bg: 'rgba(108,138,255,0.15)', text: '#6c8aff', border: 'rgba(108,138,255,0.3)' },
  ENTERPRISE: { bg: 'rgba(245,158,11,0.15)',  text: '#f59e0b', border: 'rgba(245,158,11,0.3)'  },
};

const styles = {
  sidebar: {
    width: 220,
    flexShrink: 0,
    background: 'var(--color-surface)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 12px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '0 8px',
    marginBottom: 32,
  },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent2))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    flexShrink: 0,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--color-text)',
    letterSpacing: '-0.3px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text2)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    transition: 'background 0.15s, color 0.15s',
  },
  navItemActive: {
    background: 'rgba(108,138,255,0.12)',
    color: 'var(--color-accent)',
  },
  navIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: '12px 8px 0',
    borderTop: '1px solid var(--color-border)',
  },
  planBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.5px',
    alignSelf: 'flex-start',
  },
  planDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'currentColor',
  },
  planUsageMini: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  planBarTrack: {
    height: 3,
    background: 'var(--color-border)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  planBarFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.4s ease',
  },
  planUsageLabel: {
    fontSize: 11,
    color: 'var(--color-text3)',
    fontFamily: 'var(--font-mono)',
  },
};
