import React, { useState, useEffect } from 'react';
import { User, Role } from './types';
import {
  getCurrentUser,
  getCustomers,
  getProducts,
  getChallans,
  getStockLogs,
  DEMO_USERS,
  setCurrentUser as persistCurrentUser,
  resetStorage
} from './services/storage';

import {
  Boxes,
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Activity,
  Terminal,
  Code2,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  Layers,
  Bell,
  ShieldAlert
} from 'lucide-react';

import { Dashboard } from './pages/Dashboard';
import { CustomersPage } from './pages/CustomersPage';
import { ProductsPage } from './pages/ProductsPage';
import { ChallansPage } from './pages/ChallansPage';
import { StockLogsPage } from './pages/StockLogsPage';
import { ApiRunnerPage } from './pages/ApiRunnerPage';
import { ArchitectureModal } from './components/ArchitectureModal';
import { AuthModal } from './components/AuthModal';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [currentUser, setCurrentUser] = useState<User>(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);

  // Core Data
  const [customers, setCustomers] = useState(() => getCustomers());
  const [products, setProducts] = useState(() => getProducts());
  const [challans, setChallans] = useState(() => getChallans());
  const [stockLogs, setStockLogs] = useState(() => getStockLogs());

  const roles: Role[] = ['Admin', 'Sales', 'Warehouse', 'Accounts'];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const refreshData = () => {
    setCustomers(getCustomers());
    setProducts(getProducts());
    setChallans(getChallans());
    setStockLogs(getStockLogs());
  };

  const handleRoleSwitch = (role: Role) => {
    const selected = DEMO_USERS[role];
    persistCurrentUser(selected);
    setCurrentUser(selected);
    refreshData();
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'customers', label: 'Customer CRM', icon: Users, roles: ['Admin', 'Sales', 'Accounts'] },
    { id: 'products', label: 'Inventory SKUs', icon: Package, roles: ['Admin', 'Warehouse', 'Sales'] },
    { id: 'challans', label: 'Sales Challans', icon: FileText, roles: ['Admin', 'Sales', 'Accounts'] },
    { id: 'stock_logs', label: 'Movement Audit', icon: Activity, roles: ['Admin', 'Warehouse', 'Accounts'] },
    { id: 'api_runner', label: 'REST API Tester', icon: Terminal, roles: ['Admin', 'Sales', 'Warehouse', 'Accounts'] },
  ];

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="exec-header">
        <div className="exec-header-top">
          {/* Brand Logo & Name */}
          <div className="brand-badge">
            <div className="brand-icon-box">
              <Boxes size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
                  QUANTUM ERP
                </span>
                <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>
                  v3.0 ENTERPRISE
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Wholesale & CRM Command Suite
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="exec-nav-tabs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isAllowed = !item.roles || item.roles.includes(currentUser.role);
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => isAllowed && setActiveTab(item.id)}
                  disabled={!isAllowed}
                  className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                  style={{
                    opacity: isAllowed ? 1 : 0.45,
                    cursor: isAllowed ? 'pointer' : 'not-allowed'
                  }}
                  title={!isAllowed ? `Access restricted to ${item.roles?.join(', ')}` : undefined}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls Bar */}
          <div className="exec-user-bar">
            {/* Quick Role Tester */}
            <div className="role-switcher-pill" title="Switch role perspective instantly">
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Sparkles size={12} /> TEST ROLE:
              </span>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`role-chip ${currentUser.role === r ? 'active' : ''}`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* System Architecture Modal Trigger */}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsArchModalOpen(true)}
              title="View Architecture & Deployment Docs"
            >
              <Code2 size={16} /> Architecture
            </button>

            {/* Theme Switcher */}
            <button
              className="theme-toggle-btn"
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              title="Toggle Light / Dark Mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Data Reset */}
            <button
              className="theme-toggle-btn"
              onClick={() => {
                if (confirm('Reset all CRM, Inventory & Challan data to default demo state?')) {
                  resetStorage();
                  refreshData();
                }
              }}
              title="Reset Demo Data"
            >
              <RotateCcw size={16} />
            </button>

            {/* User Avatar */}
            <div
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '4px 10px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                {currentUser.name.split(' ')[0]}
                <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 700 }}>
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            customers={customers}
            products={products}
            challans={challans}
            stockLogs={stockLogs}
            currentUser={currentUser}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersPage
            customers={customers}
            onRefresh={refreshData}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'products' && (
          <ProductsPage
            products={products}
            onRefresh={refreshData}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'challans' && (
          <ChallansPage
            challans={challans}
            customers={customers}
            products={products}
            onRefresh={refreshData}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'stock_logs' && (
          <StockLogsPage
            stockLogs={stockLogs}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'api_runner' && (
          <ApiRunnerPage />
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectUser={(u) => {
          setCurrentUser(u);
          refreshData();
        }}
      />

      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />
    </div>
  );
};

export default App;
