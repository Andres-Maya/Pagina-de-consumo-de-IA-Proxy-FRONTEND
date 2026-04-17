# Pagina-de-consumo-de-IA-Proxy-FRONTEND

Plataforma frontend para consumir un servicio de IA a través de un proxy backend.
Construida con **React 18 + JavaScript (JSX)** y **Vite**.

---

## Características

- **Chat interface** — Envía prompts y recibe respuestas en tiempo real
- **Token estimator** — Calcula el costo aproximado antes de enviar
- **Rate limit handling** — Countdown visual cuando se alcanza HTTP 429
- **Quota modal** — Interceptor con simulación de pago al recibir HTTP 402
- **Dashboard** — Gráfica de barras de uso (7 días) + métricas de consumo
- **Plan badges** — FREE / PRO / ENTERPRISE con colores diferenciados
- **Mock mode** — Funciona sin backend en desarrollo

---

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Levantar en modo desarrollo (con mock de IA)
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

---

## Variables de entorno

| Variable           | Descripción                           | Default                  |
|--------------------|---------------------------------------|--------------------------|
| `VITE_API_BASE_URL`| URL base del backend proxy            | `http://localhost:8000`  |
| `VITE_USE_MOCK`    | Usar mock local (sin backend)         | `true` en DEV            |

Para conectar al backend real:
```
VITE_API_BASE_URL=https://tu-backend.com
VITE_USE_MOCK=false
```

---

## Estructura del proyecto

```
src/
├── api/            # Servicios HTTP (client.js, aiService.js)
├── components/
│   ├── chat/       # ChatWorkspace, MessageThread, PromptInput, TokenEstimator
│   ├── dashboard/  # UsageDashboard, WeeklyUsageChart
│   ├── layout/     # AppLayout, Sidebar, TopBar
│   ├── modals/     # UpgradeModal, PaymentSimulator
│   └── plan/       # PlanUsageIndicator, RateLimitCountdown
├── context/        # UserContext, RateLimitContext, UIContext
├── hooks/          # useChat, useCountdown, useTokenEstimator, useUsageHistory
└── utils/          # formatters
```

---

## API esperada del backend

### `POST /api/ai/chat`
```json
// Request
{ "prompt": "string", "conversationId": "string" }

// Response 200
{ "message": "string", "tokensUsed": 123, "requestsRemaining": 15, "resetAt": 1234567890 }

// Response 429 (rate limit)
Headers: Retry-After: 30
{ "error": "Rate limit exceeded" }

// Response 402 (quota exhausted)
{ "error": "Monthly quota exhausted" }
```

### `GET /api/ai/usage/history?days=7`
```json
[
  { "date": "2025-01-01", "tokensUsed": 4200, "requestCount": 18 }
]
```

---

## Despliegue en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. En `vercel.json`, reemplaza `https://your-backend.com` con la URL real del backend
3. Configura las variables de entorno en el panel de Vercel
4. Deploy automático en cada push a `main`

```bash
# Build de producción local
npm run build
npm run preview
```

---

## Tecnologías

- React 18 + JSX
- Vite 5
- React Router v6
- Recharts (gráfica de barras)
- CSS-in-JS (estilos inline + variables CSS globales)
