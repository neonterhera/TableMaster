import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './store';
import TableManager from './components/TableManager';
import CheckIn from './components/CheckIn';
import { fetchRestaurant } from './services/formitable';

function ThemeToggle() {
  const { theme, toggleTheme } = useApp();
  return (
    <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle Theme">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

function MainLayout() {
  const [activeTab, setActiveTab] = useState('checkin');
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    fetchRestaurant().then(data => {
      if (data && data.name) {
        setRestaurantName(data.name);
      }
    });
  }, []);

  return (
    <div className="app-container">
      <header style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem 0',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo-new.png" alt="TableMaster" style={{ height: '48px', objectFit: 'contain' }} />

        </div>
        <div style={{ position: 'absolute', right: 0 }}>
          <ThemeToggle />
        </div>
      </header>

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <button
          className={`btn-primary ${activeTab !== 'checkin' ? 'btn-icon' : ''}`}
          style={{ width: 'auto', background: activeTab === 'checkin' ? 'var(--primary)' : 'transparent', color: activeTab === 'checkin' ? '#fff' : 'var(--text-main)' }}
          onClick={() => setActiveTab('checkin')}
        >
          Check In
        </button>
        <button
          className={`btn-primary ${activeTab !== 'manage' ? 'btn-icon' : ''}`}
          style={{ width: 'auto', background: activeTab === 'manage' ? 'var(--primary)' : 'transparent', color: activeTab === 'manage' ? '#fff' : 'var(--text-main)' }}
          onClick={() => setActiveTab('manage')}
        >
          Manage Tables
        </button>
      </nav>

      <main>
        {activeTab === 'checkin' ? <CheckIn /> : <TableManager />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'checkin' ? 'active' : ''}`}
          onClick={() => setActiveTab('checkin')}
        >
          <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H5v-2h7v2zm7 0h-5v-2h5v2zm0-4H5v-2h14v2zm0-4H5V7h14v2z" /></svg>
          <span>Check In</span>
        </button>
        <button
          className={`nav-item ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          <svg viewBox="0 0 24 24"><path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z" /></svg>
          <span>Tables</span>
        </button>
      </nav>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
