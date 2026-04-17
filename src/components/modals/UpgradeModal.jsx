import React, { useState } from 'react';
import { useUIContext } from '../../context/UIContext.jsx';
import { useUserContext } from '../../context/UserContext.jsx';

// ─── Plan data ────────────────────────────────────────────────
const PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    price: 0,
    tokens: '50k tokens/mes',
    rpm: '5 req/min',
    color: '#6b7280',
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 19,
    tokens: '500k tokens/mes',
    rpm: '20 req/min',
    highlight: true,
    color: '#6c8aff',
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 99,
    tokens: '5M tokens/mes',
    rpm: '60 req/min',
    color: '#f59e0b',
  },
];

// ─── UpgradeModal ─────────────────────────────────────────────
export function UpgradeModal() {
  const { closeModal } = useUIContext();
  const { upgradePlan } = useUserContext();
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState('select'); // 'select' | 'payment' | 'success'

  const handleSelectPlan = (planId) => {
    if (planId === 'FREE') return;
    setSelected(planId);
    setStep('payment');
  };

  const handlePaymentSuccess = () => {
    upgradePlan(selected);
    setStep('success');
    setTimeout(closeModal, 2000);
  };

  return (
    <div style={overlay.backdrop} role="dialog" aria-modal="true">
      <div style={overlay.panel}>
        {step === 'select' && (
          <>
            <div style={overlay.header}>
              <div style={overlay.iconWrap}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <h2 style={overlay.title}>Cuota mensual agotada</h2>
                <p style={overlay.subtitle}>Actualiza tu plan para continuar usando la IA.</p>
              </div>
            </div>
            <PlanSelector plans={PLANS} onSelect={handleSelectPlan} />
            <button style={overlay.cancelBtn} onClick={closeModal}>
              No por ahora
            </button>
          </>
        )}

        {step === 'payment' && (
          <PaymentSimulator
            plan={PLANS.find((p) => p.id === selected)}
            onSuccess={handlePaymentSuccess}
            onBack={() => setStep('select')}
          />
        )}

        {step === 'success' && (
          <div style={overlay.success}>
            <div style={overlay.successIcon}>✓</div>
            <h3 style={overlay.successTitle}>¡Plan actualizado!</h3>
            <p style={overlay.successMsg}>Ya tienes acceso a {selected}. Cerrando…</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PlanSelector ─────────────────────────────────────────────
function PlanSelector({ plans, onSelect }) {
  return (
    <div style={planSel.grid}>
      {plans.map((plan) => (
        <button
          key={plan.id}
          onClick={() => onSelect(plan.id)}
          disabled={plan.id === 'FREE'}
          style={{
            ...planSel.card,
            ...(plan.highlight ? planSel.highlight : {}),
            ...(plan.id === 'FREE' ? planSel.disabled : {}),
            borderColor: plan.highlight ? plan.color : undefined,
          }}
        >
          {plan.highlight && (
            <span style={{ ...planSel.badge, background: plan.color }}>
              Popular
            </span>
          )}
          <span style={{ ...planSel.planName, color: plan.color }}>
            {plan.name}
          </span>
          <span style={planSel.price}>
            {plan.price === 0 ? 'Gratis' : `$${plan.price}/mes`}
          </span>
          <span style={planSel.feature}>{plan.tokens}</span>
          <span style={planSel.feature}>{plan.rpm}</span>
          {plan.id !== 'FREE' && (
            <span style={{ ...planSel.cta, background: plan.color }}>
              Elegir {plan.name}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── PaymentSimulator ─────────────────────────────────────────
function PaymentSimulator({ plan, onSuccess, onBack }) {
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (card.number.replace(/\s/g, '').length !== 16) e.number = 'Número inválido';
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.expiry = 'Formato MM/AA';
    if (card.cvc.length < 3) e.cvc = 'CVC inválido';
    return e;
  };

  const handlePay = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));
    setProcessing(false);
    onSuccess();
  };

  const formatCard = (v) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  return (
    <div style={pay.wrap}>
      <button style={pay.back} onClick={onBack}>← Volver</button>
      <h3 style={pay.title}>Pago — Plan {plan?.name}</h3>
      <p style={pay.amount}>${plan?.price} / mes</p>

      <div style={pay.form}>
        <Field
          label="Número de tarjeta"
          value={card.number}
          error={errors.number}
          onChange={(v) => setCard((c) => ({ ...c, number: formatCard(v) }))}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
        />
        <div style={pay.row}>
          <Field
            label="Vencimiento"
            value={card.expiry}
            error={errors.expiry}
            onChange={(v) => setCard((c) => ({ ...c, expiry: formatExpiry(v) }))}
            placeholder="MM/AA"
            maxLength={5}
          />
          <Field
            label="CVC"
            value={card.cvc}
            error={errors.cvc}
            onChange={(v) => setCard((c) => ({ ...c, cvc: v.replace(/\D/g, '').slice(0, 4) }))}
            placeholder="123"
            maxLength={4}
          />
        </div>
      </div>

      <button
        style={{ ...pay.payBtn, opacity: processing ? 0.7 : 1 }}
        onClick={handlePay}
        disabled={processing}
      >
        {processing ? 'Procesando…' : `Pagar $${plan?.price}`}
      </button>

      <p style={pay.disclaimer}>
        Simulación — no se realizará ningún cargo real.
      </p>
    </div>
  );
}

function Field({ label, value, error, onChange, placeholder, maxLength }) {
  return (
    <div style={field.wrap}>
      <label style={field.label}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{ ...field.input, ...(error ? field.inputError : {}) }}
      />
      {error && <span style={field.error}>{error}</span>}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const overlay = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 20,
  },
  panel: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-xl)',
    padding: '28px 24px',
    width: '100%', maxWidth: 560,
    display: 'flex', flexDirection: 'column', gap: 20,
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: 'var(--shadow-lg)',
  },
  header: {
    display: 'flex', alignItems: 'flex-start', gap: 14,
  },
  iconWrap: {
    width: 44, height: 44, borderRadius: 'var(--radius-md)',
    background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  title: { fontSize: 18, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'var(--color-text2)' },
  cancelBtn: {
    alignSelf: 'center', fontSize: 13, color: 'var(--color-text3)',
    background: 'transparent', border: 'none', cursor: 'pointer',
    textDecoration: 'underline', textUnderlineOffset: 3,
  },
  success: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '20px 0',
  },
  successIcon: {
    width: 56, height: 56, borderRadius: '50%',
    background: 'rgba(52,211,153,0.15)', border: '2px solid var(--color-success)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, color: 'var(--color-success)',
  },
  successTitle: { fontSize: 18, fontWeight: 600, color: 'var(--color-text)' },
  successMsg: { fontSize: 14, color: 'var(--color-text2)' },
};

const planSel = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  card: {
    position: 'relative', display: 'flex', flexDirection: 'column', gap: 6,
    background: 'var(--color-surface2)', border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)', padding: '16px 14px',
    cursor: 'pointer', transition: 'border-color 0.15s, transform 0.1s', textAlign: 'left',
  },
  highlight: { borderWidth: 2 },
  disabled: { opacity: 0.45, cursor: 'not-allowed' },
  badge: {
    position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
    fontSize: 10, fontWeight: 700, color: '#fff', padding: '2px 8px', borderRadius: 10,
    letterSpacing: '0.5px',
  },
  planName: { fontSize: 16, fontWeight: 700, marginTop: 6 },
  price: { fontSize: 20, fontWeight: 700, color: 'var(--color-text)' },
  feature: { fontSize: 12, color: 'var(--color-text2)' },
  cta: {
    marginTop: 8, padding: '7px 0', borderRadius: 'var(--radius-sm)',
    fontSize: 13, fontWeight: 600, color: '#fff', textAlign: 'center', border: 'none',
    cursor: 'pointer',
  },
};

const pay = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 14 },
  back: {
    alignSelf: 'flex-start', fontSize: 13, color: 'var(--color-text2)',
    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
  },
  title: { fontSize: 17, fontWeight: 600, color: 'var(--color-text)' },
  amount: { fontSize: 28, fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  payBtn: {
    padding: '13px', borderRadius: 'var(--radius-md)',
    background: 'var(--color-accent)', border: 'none',
    color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  disclaimer: { fontSize: 11, color: 'var(--color-text3)', textAlign: 'center' },
};

const field = {
  wrap: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: 12, fontWeight: 600, color: 'var(--color-text2)' },
  input: {
    background: 'var(--color-surface2)', border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)', padding: '9px 12px',
    fontSize: 14, color: 'var(--color-text)', outline: 'none',
    fontFamily: 'var(--font-mono)', transition: 'border-color 0.15s',
  },
  inputError: { borderColor: 'var(--color-danger)' },
  error: { fontSize: 11, color: 'var(--color-danger)' },
};
