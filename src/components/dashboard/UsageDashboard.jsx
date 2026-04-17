import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useUsageHistory } from '../../hooks/useUsageHistory.js';
import { useUserContext } from '../../context/UserContext.jsx';

export function UsageDashboard() {
  const { data, isLoading, error } = useUsageHistory(7);
  const { plan } = useUserContext();

  const totalTokensWeek = data.reduce((s, d) => s + d.tokensUsed, 0);
  const totalRequestsWeek = data.reduce((s, d) => s + d.requestCount, 0);
  const avgTokensDay = data.length
    ? Math.round(totalTokensWeek / data.length)
    : 0;

  return (
    <div style={styles.page}>
      {/* Metric cards */}
      <div style={styles.metricGrid}>
        <MetricCard
          label="Tokens esta semana"
          value={formatTokens(totalTokensWeek)}
          accent="var(--color-accent)"
        />
        <MetricCard
          label="Requests esta semana"
          value={totalRequestsWeek.toLocaleString('es-ES')}
          accent="var(--color-success)"
        />
        <MetricCard
          label="Promedio diario"
          value={formatTokens(avgTokensDay)}
          accent="var(--color-warning)"
        />
        <MetricCard
          label="Cuota restante"
          value={formatTokens(plan.monthlyTokenLimit - plan.tokensUsed)}
          accent={
            plan.tokensUsed / plan.monthlyTokenLimit >= 0.9
              ? 'var(--color-danger)'
              : 'var(--color-info)'
          }
        />
      </div>

      {/* Weekly chart */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Tokens por día — últimos 7 días</h3>
        {isLoading ? (
          <div style={styles.loader}>Cargando datos…</div>
        ) : error ? (
          <div style={styles.err}>Error al cargar historial: {error}</div>
        ) : (
          <WeeklyUsageChart data={data} />
        )}
      </div>

      {/* History table */}
      <div style={styles.tableCard}>
        <h3 style={styles.chartTitle}>Historial detallado</h3>
        <RequestHistoryTable data={data} isLoading={isLoading} />
      </div>
    </div>
  );
}

// ─── WeeklyUsageChart ─────────────────────────────────────────
function WeeklyUsageChart({ data }) {
  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('es-ES', {
      weekday: 'short', day: 'numeric',
    }),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={tooltip.box}>
        <p style={tooltip.label}>{label}</p>
        <p style={tooltip.value}>
          {payload[0].value.toLocaleString('es-ES')} tokens
        </p>
        <p style={tooltip.req}>
          {payload[0].payload.requestCount} requests
        </p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: 'var(--color-text3)', fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--color-text3)', fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar
          dataKey="tokensUsed"
          fill="var(--color-accent)"
          fillOpacity={0.8}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── RequestHistoryTable ──────────────────────────────────────
function RequestHistoryTable({ data, isLoading }) {
  if (isLoading) return <div style={styles.loader}>Cargando…</div>;
  if (!data.length) return <div style={styles.loader}>Sin datos disponibles.</div>;

  return (
    <table style={table.base}>
      <thead>
        <tr>
          {['Fecha', 'Tokens usados', 'Requests', 'Promedio / request'].map((h) => (
            <th key={h} style={table.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...data].reverse().map((row) => (
          <tr key={row.date} style={table.tr}>
            <td style={table.td}>
              {new Date(row.date).toLocaleDateString('es-ES', {
                weekday: 'long', month: 'short', day: 'numeric',
              })}
            </td>
            <td style={{ ...table.td, ...table.mono }}>
              {row.tokensUsed.toLocaleString('es-ES')}
            </td>
            <td style={{ ...table.td, ...table.mono }}>{row.requestCount}</td>
            <td style={{ ...table.td, ...table.mono }}>
              {row.requestCount ? Math.round(row.tokensUsed / row.requestCount).toLocaleString('es-ES') : '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── MetricCard ───────────────────────────────────────────────
function MetricCard({ label, value, accent }) {
  return (
    <div style={styles.metricCard}>
      <span style={styles.metricLabel}>{label}</span>
      <span style={{ ...styles.metricValue, color: accent }}>{value}</span>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
function formatTokens(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

// ─── Styles ───────────────────────────────────────────────────
const styles = {
  page: {
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    overflowY: 'auto',
    height: '100%',
  },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 14,
  },
  metricCard: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--color-text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  metricValue: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    letterSpacing: '-0.5px',
  },
  chartCard: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--color-text2)',
  },
  tableCard: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  loader: {
    padding: '24px',
    textAlign: 'center',
    color: 'var(--color-text3)',
    fontSize: 14,
  },
  err: {
    padding: '16px',
    color: 'var(--color-danger)',
    fontSize: 13,
  },
};

const tooltip = {
  box: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 8,
    padding: '10px 14px',
  },
  label: { fontSize: 12, color: 'var(--color-text2)', marginBottom: 4 },
  value: { fontSize: 14, fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' },
  req: { fontSize: 12, color: 'var(--color-text3)', fontFamily: 'var(--font-mono)' },
};

const table = {
  base: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  },
  th: {
    textAlign: 'left',
    padding: '8px 12px',
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--color-text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid var(--color-border)',
  },
  tr: {
    borderBottom: '1px solid var(--color-border)',
  },
  td: {
    padding: '10px 12px',
    color: 'var(--color-text2)',
  },
  mono: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-text)',
  },
};
