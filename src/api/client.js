const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// ─── Custom error classes ────────────────────────────────────
export class RateLimitError extends Error {
  constructor(retryAfter) {
    super('Rate limit exceeded');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class QuotaExhaustedError extends Error {
  constructor() {
    super('Monthly quota exhausted');
    this.name = 'QuotaExhaustedError';
  }
}

// ─── Core fetch wrapper ──────────────────────────────────────
async function request(endpoint, options = {}) {
  const { params, ...init } = options;
  const url = new URL(`${BASE_URL}${endpoint}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...init.headers,
  };

  const response = await fetch(url.toString(), { ...init, headers });

  // 429 — Rate limit: read Retry-After header
  if (response.status === 429) {
    const retryAfter = parseInt(
      response.headers.get('Retry-After') ?? '60',
      10
    );
    throw new RateLimitError(retryAfter);
  }

  // 402 — Quota exhausted
  if (response.status === 402) {
    throw new QuotaExhaustedError();
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${response.status}`);
  }

  return response.json();
}

export const httpClient = {
  get: (endpoint, options) =>
    request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    }),
};
