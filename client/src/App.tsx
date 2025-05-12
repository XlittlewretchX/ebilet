import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Header from '@/widgets/Header/Header';
import HomePage from '@/pages/HomePage/ui/HomePage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import MyTicketsPage from '@/pages/MyTicketPage/MyTicketsPage';
import BuyTicketPage from '@/pages/BuyTicketPage';
import styles from './app/styles/App.module.scss';

const basename = process.env.NODE_ENV === 'production' ? '/ebilet' : '';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router basename={basename}>
        <div className={styles.app}>
          <Header />
          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-tickets" element={<MyTicketsPage />} />
              <Route path="/buy/:eventId" element={<BuyTicketPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
