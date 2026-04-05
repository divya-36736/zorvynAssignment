import { useState } from 'react';
import useFinanceStore from '../../store/useFinanceStore';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'transactions', label: 'Transactions', icon: '⊞' },
  { id: 'insights', label: 'Insights', icon: '◉' },
];

export default function Navbar() {
  const { role, setRole, activeTab, setActiveTab } = useFinanceStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleTabClick = (id) => {
    setActiveTab(id);
    setDrawerOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        
        <div className="navbar-brand">
          <span className="brand-icon">◈</span>
          <span className="brand-name">FinVault</span>
        </div>

        {/* Desktop and Tablet inline tabs */}
        <div className="navbar-tabs">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Desktop role controls */}
        <div className="navbar-actions">
          <div className="role-switcher">
            <label className="role-label">Role</label>
            <select
              className="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="viewer">👁 Viewer</option>
              <option value="admin">⚙ Admin</option>
            </select>
          </div>
          <div className={`role-badge ${role}`}>
            {role === 'admin' ? '⚙ Admin' : '👁 Viewer'}
          </div>
        </div>

        {/* hamburger */}
        <button
          className={`hamburger ${drawerOpen ? 'open' : ''}`}
          onClick={() => setDrawerOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile slide-down drawer */}
      <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="drawer-tabs">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="drawer-role-row">
          <span className="role-label">Role</span>
          <div className="drawer-role-controls">
            <select
              className="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="viewer">👁 Viewer</option>
              <option value="admin">⚙ Admin</option>
            </select>
            <div className={`role-badge ${role}`}>
              {role === 'admin' ? '⚙ Admin' : '👁 Viewer'}
            </div>
          </div>
        </div>
      </div>

      {/* Tap-outside backdrop */}
      {drawerOpen && (
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
      )}
    </>
  );
}
