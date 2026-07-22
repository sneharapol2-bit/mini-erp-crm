import React, { useState } from 'react';
import { User, Role } from '../types';
import { DEMO_USERS, setCurrentUser } from '../services/storage';
import { X, ShieldCheck, KeyRound, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSelectUser
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<Role>('Admin');
  const [loginMessage, setLoginMessage] = useState('');

  const roles: Role[] = ['Admin', 'Sales', 'Warehouse', 'Accounts'];

  const handleSelectRole = (r: Role) => {
    setRole(r);
    const u = DEMO_USERS[r];
    setEmail(u.email);
    setPassword('password123');
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = DEMO_USERS[role];
    setCurrentUser(u);
    onSelectUser(u);
    setLoginMessage(`Authenticated successfully as ${u.name} (${role})`);
    setTimeout(() => {
      onClose();
      setLoginMessage('');
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Role Authentication Sign-In</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enterprise JWT Security Portal</span>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {loginMessage && (
            <div style={{ padding: '0.85rem 1rem', background: 'var(--emerald-light)', color: 'var(--emerald)', border: '1px solid var(--emerald)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} /> {loginMessage}
            </div>
          )}

          {/* Quick Role Preset Pills */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.65rem' }}>
              1-Click Role Login Presets
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
              {roles.map((r) => {
                const u = DEMO_USERS[r];
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSelectRole(r)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: isSelected ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                      color: 'var(--text-main)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={u.avatar} alt={u.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{u.email.split('@')[0]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleFormLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.35rem', display: 'block' }}>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
              Sign In to ERP Portal <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
