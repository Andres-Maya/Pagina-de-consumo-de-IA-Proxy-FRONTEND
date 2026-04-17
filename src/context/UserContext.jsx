import React, { createContext, useContext, useReducer, useCallback } from 'react';

// ─── Plan defaults ───────────────────────────────────────────
const PLAN_DEFAULTS = {
  FREE:       { monthlyTokenLimit: 50_000,    requestsPerMinute: 5  },
  PRO:        { monthlyTokenLimit: 500_000,   requestsPerMinute: 20 },
  ENTERPRISE: { monthlyTokenLimit: 5_000_000, requestsPerMinute: 60 },
};

const initialState = {
  plan: {
    type: 'FREE',
    tokensUsed: 0,
    ...PLAN_DEFAULTS.FREE,
  },
};

function userReducer(state, action) {
  switch (action.type) {
    case 'CONSUME_TOKENS':
      return {
        ...state,
        plan: { ...state.plan, tokensUsed: state.plan.tokensUsed + action.payload },
      };
    case 'UPGRADE_PLAN':
      return {
        ...state,
        plan: { ...state.plan, type: action.payload, ...PLAN_DEFAULTS[action.payload] },
      };
    default:
      return state;
  }
}

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const consumeTokens = useCallback(
    (count) => dispatch({ type: 'CONSUME_TOKENS', payload: count }),
    []
  );
  const upgradePlan = useCallback(
    (plan) => dispatch({ type: 'UPGRADE_PLAN', payload: plan }),
    []
  );

  return (
    <UserContext.Provider value={{ ...state, consumeTokens, upgradePlan }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be inside UserProvider');
  return ctx;
}

export { PLAN_DEFAULTS };
