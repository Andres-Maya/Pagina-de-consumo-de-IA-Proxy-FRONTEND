import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext.jsx';
import { RateLimitProvider } from './context/RateLimitContext.jsx';
import { UIProvider } from './context/UIContext.jsx';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { ChatWorkspace } from './components/chat/ChatWorkspace.jsx';
import { UsageDashboard } from './components/dashboard/UsageDashboard.jsx';

export default function App() {
  return (
    <UserProvider>
      <RateLimitProvider>
        <UIProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate to="/chat" replace />} />
                <Route path="chat" element={<ChatWorkspace />} />
                <Route path="dashboard" element={<UsageDashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UIProvider>
      </RateLimitProvider>
    </UserProvider>
  );
}
