import React, { createContext, useContext, useReducer, useCallback } from 'react';

const initialState = {
  requestsUsedThisMinute: 0,
  isBlocked: false,
  retryAfterSeconds: 0,
};

function rateLimitReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, requestsUsedThisMinute: state.requestsUsedThisMinute + 1 };
    case 'SET_BLOCKED':
      return { ...state, isBlocked: true, retryAfterSeconds: action.payload };
    case 'DECREMENT': {
      const next = state.retryAfterSeconds - 1;
      return next <= 0
        ? { ...state, isBlocked: false, retryAfterSeconds: 0 }
        : { ...state, retryAfterSeconds: next };
    }
    case 'RESET_MINUTE':
      return { ...state, requestsUsedThisMinute: 0 };
    default:
      return state;
  }
}

const RateLimitContext = createContext(null);

export function RateLimitProvider({ children }) {
  const [state, dispatch] = useReducer(rateLimitReducer, initialState);

  const incrementRequests = useCallback(() => dispatch({ type: 'INCREMENT' }), []);
  const blockFor = useCallback(
    (seconds) => dispatch({ type: 'SET_BLOCKED', payload: seconds }),
    []
  );
  const decrementCountdown = useCallback(() => dispatch({ type: 'DECREMENT' }), []);
  const resetMinute = useCallback(() => dispatch({ type: 'RESET_MINUTE' }), []);

  return (
    <RateLimitContext.Provider
      value={{ ...state, incrementRequests, blockFor, decrementCountdown, resetMinute }}
    >
      {children}
    </RateLimitContext.Provider>
  );
}

export function useRateLimitContext() {
  const ctx = useContext(RateLimitContext);
  if (!ctx) throw new Error('useRateLimitContext must be inside RateLimitProvider');
  return ctx;
}
