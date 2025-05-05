import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';

const AppRoutes: React.FC = () => (
  <Suspense fallback={<div>Loading…</div>}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
