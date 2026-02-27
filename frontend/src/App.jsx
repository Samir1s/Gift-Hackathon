import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Onboard from '@/pages/Onboard';
import Login from '@/pages/Login';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHub from '@/pages/dashboard/DashboardHub';
import Learn from '@/pages/dashboard/Learn';
import Playground from '@/pages/dashboard/Playground';
import DailyUpdates from '@/pages/dashboard/DailyUpdates';
import Portfolio from '@/pages/dashboard/Portfolio';
import Community from '@/pages/dashboard/Community';
import Settings from '@/pages/dashboard/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHub />} />
          <Route path="learn" element={<Learn />} />
          <Route path="playground" element={<Playground />} />
          <Route path="daily-updates" element={<DailyUpdates />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="community" element={<Community />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
