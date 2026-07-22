import React, { useState } from 'react';
import { User, Role } from '../types';
import { DEMO_USERS, setCurrentUser, resetStorage } from '../services/storage';
import { ShieldCheck, Moon, Sun, RotateCcw, UserCheck, Bell, Sparkles, Search } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onUserChange,
  theme,
  onToggleTheme,
  onOpenAuth
}) => {
  const roles: Role[] = ['Admin', 'Sales', 'Warehouse', 'Accounts'];
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSwitchRole = (role: Role) => {
    const selectedUser = DEMO_USERS[role];
    setCurrentUser(selectedUser);
    onUserChange(selectedUser);
  };

  return (
    <header className="navbar">
      <div className="brand-header">
        <div className="brand-logo">
          ⚡
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NEXUS
            </span>
            <span style={{ fontSize: '0.65rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>
              v2.0 PRO
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Operations & ERP Intelligence
          </span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Evaluator Quick Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-tertiary)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} /> ROLE TESTER:
          </span>
          {roles.map((r) => {
            const isActive = currentUser.role === r;
            return (
              <button
                key={r}
                onClick={() => handleSwitchRole(r)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-sm)' }}
                title={`Switch perspective to ${r}`}
              >
                {r}
              </button>
            );
          })}
        </div>

        {/* Notifications Drawer Toggle */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-secondary btn-sm"
            style={{ position: 'relative' }}
            title="System Notifications"
          >
            <Bell size={16} />
            <span style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--bg-secondary)' }} />
          </button>

          {showNotifications && (
            <div className="card" style={{ position: 'absolute', right: 0, top: '45px', width: '320px', zIndex: 50, padding: '1rem', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>System Activity Alerts</span>
                <span className="badge badge-success">3 New</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)' }}>
                  <strong>Low Stock Warning:</strong> MCU v4 stock fell below min threshold (18 units left).
                </div>
                <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)' }}>
                  <strong>Sales Challan Confirmed:</strong> CHN-2026-001 issued for Apex Wholesale.
                </div>
                <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)' }}>
                  <strong>CRM Follow-up Due:</strong> Metro Retail follow-up scheduled today.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="btn btn-secondary btn-sm"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Reset Storage */}
        <button
          onClick={() => {
            if (confirm('Reset system data to initial factory demo state?')) {
              resetStorage();
            }
          }}
          className="btn btn-secondary btn-sm"
          title="Reset Demo Data"
        >
          <RotateCcw size={15} />
        </button>

        {/* Active User Avatar */}
        <div
          onClick={onOpenAuth}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Click to manage login"
        >
          <img
            src={currentUser.avatar || 'https://via.placeholder.com/40'}
            alt={currentUser.name}
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ textTransform: 'none', textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, lineHeight: 1.1 }}>
              {currentUser.name.split(' ')[0]}
            </div>
            <span className={`role-badge ${currentUser.role.toLowerCase()}`}>
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
