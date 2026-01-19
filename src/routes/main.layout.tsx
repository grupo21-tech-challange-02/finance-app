import { Header } from '@/components/Header';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// import './MainLayout.css';

function MainLayout({ children }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="main-layout">
      <Header />

      <main className="content">
        {children}
      </main>
    </div>
  );
}

export default MainLayout;