import { useState } from 'react';
import './index.css';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Schedule from './pages/Schedule';
import Players from './pages/Players';
import Standings from './pages/Standings';
import AuctionRoom from './pages/AuctionRoom';
import Predictions from './pages/Predictions';

type Page = 'dashboard' | 'teams' | 'schedule' | 'players' | 'standings' | 'auction' | 'predictions';

const navItems: { id: Page; label: string; icon: string; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'schedule', label: 'Matches', icon: '📅' },
  { id: 'standings', label: 'Standings', icon: '🏆' },
  { id: 'teams', label: 'Teams', icon: '🏏' },
  { id: 'players', label: 'Players', icon: '👤' },
  { id: 'predictions', label: 'Predictions', icon: '🔮' },
  { id: 'auction', label: 'Auction', icon: '🔨' },
];

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-logo">🏏 IPL 2026 Pro</div>
          <div className="nav-links">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-btn ${page === item.id ? 'active' : ''}`}
                onClick={() => setPage(item.id)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="live-badge">{item.badge}</span>}
                {item.id === 'schedule' && (
                  <span className="live-badge">LIVE</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Pages */}
      {page === 'dashboard' && <Dashboard />}
      {page === 'teams' && <Teams />}
      {page === 'schedule' && <Schedule />}
      {page === 'players' && <Players />}
      {page === 'standings' && <Standings />}
      {page === 'auction' && <AuctionRoom />}
      {page === 'predictions' && <Predictions />}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          🏏 IPL 2026 Pro Analyzer · Built with ❤️ · Advanced Cricket Analytics Platform · {new Date().getFullYear()}
        </div>
      </footer>
    </>
  );
}
