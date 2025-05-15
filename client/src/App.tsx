import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Header from '@/widgets/Header/Header';
import HomePage from '@/pages/HomePage/ui/HomePage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import MyTicketsPage from '@/pages/MyTicketPage/MyTicketsPage';
import BuyTicketPage from '@/pages/BuyTicketPage';
import ProtectedRoute from '@/shared/ui/ProtectedRoute';
import styles from './app/styles/App.module.scss';
import { checkAuth } from '@/features/AuthModal/model/authSlice';

const basename = process.env.NODE_ENV === 'production' ? '/ebilet' : '';

const AppContent: React.FC = () => {
  useEffect(() => {
    store.dispatch(checkAuth());
  }, []);

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute>
                <MyTicketsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/buy/:eventId" element={<BuyTicketPage />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router basename={basename}>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;
