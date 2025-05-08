import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Header from '@/components/Header/Header';
import HomePage from '@/pages/HomePage/HomePage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import MyTicketsPage from '@/pages/MyTicketPage/MyTicketsPage';
import styles from './App.module.scss';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className={styles.app}>
          <Header />
          <main className={styles.main}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-tickets" element={<MyTicketsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
