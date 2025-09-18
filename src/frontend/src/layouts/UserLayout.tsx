import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ChatWidget from '../components/ChatWidget/ChatWidget';

const UserLayout: React.FC = () => {
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const plan = user?.subscription?.plan;
  const status = user?.subscription?.status;
  const isPremium = plan !== 'free' && status === 'active';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main > {/* Padding top to account for fixed header */}
        <Outlet />
      </main>
      <Footer />

      {isPremium && <ChatWidget />}
    </div>
  );
};

export default UserLayout;
