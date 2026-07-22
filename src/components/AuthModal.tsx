import React, { useState } from 'react';
import { User, Role } from '../types';
import { DEMO_USERS, setCurrentUser } from '../services/storage';
import { X, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';

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

  const roles: Role[] = ['Admin', 'Sales', 'Warehouse', 'Accounts'];

  const handleSelectRole = (role: Role) => {
    const u = DEMO_USERS[role];
    setCurrentUser(u);
    onSelectUser(u);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} color="var(--primary)" />
            <h3 className="modal-title">Role Authentication Login</h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Select any role below to simulate JWT token authentication and test specific operational permissions across the Mini ERP + CRM Portal.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {roles.map((r) => {
              const u = DEMO_USERS[r];
              return (
                <div
                  key={r}
                  onClick={() => handleSelectRole(r)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-tertiary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="role-select-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={u.avatar}
                      alt={u.name}
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`role-badge ${r.toLowerCase()}`}>{r}</span>
                    <ArrowRight size={16} color="var(--text-muted)" />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.5rem', padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', border: '1px dashed var(--primary)', fontSize: '0.8rem', color: 'var(--primary)' }}>
            <strong>Demo JWT Credentials Note:</strong> In production backend mode, standard JWT tokens with 24-hour expiration are generated via <code>POST /auth/login</code>.
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
