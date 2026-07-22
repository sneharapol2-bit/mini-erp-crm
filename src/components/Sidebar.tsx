import React from 'react';
import { Role } from '../types';
import { LayoutDashboard, Users, Package, FileText, History, Terminal, Server, CheckCircle2 } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: Role;
  onOpenArchitecture?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  onOpenArchitecture
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      roles: ['Admin', 'Sales', 'Warehouse', 'Accounts']
    },
    {
      id: 'customers',
      label: 'Customer CRM',
      icon: Users,
      roles: ['Admin', 'Sales', 'Accounts']
    },
    {
      id: 'products',
      label: 'Products & Inventory',
      icon: Package,
      roles: ['Admin', 'Warehouse', 'Sales', 'Accounts']
    },
    {
      id: 'challans',
      label: 'Sales Challans',
      icon: FileText,
      roles: ['Admin', 'Sales', 'Accounts', 'Warehouse']
    },
    {
      id: 'stock_logs',
      label: 'Stock Movement Logs',
      icon: History,
      roles: ['Admin', 'Warehouse', 'Accounts']
    },
    {
      id: 'api_runner',
      label: 'REST API Console',
      icon: Terminal,
      roles: ['Admin', 'Sales', 'Warehouse', 'Accounts']
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-title">NAVIGATION MODULES</div>
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isPermitted = item.roles.includes(userRole);

          return (
            <a
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-link ${isActive ? 'active' : ''}`}
              style={{
                opacity: isPermitted ? 1 : 0.6,
                position: 'relative'
              }}
            >
              <Icon className="icon" />
              <span style={{ flex: 1 }}>{item.label}</span>
              {!isPermitted && (
                <span title={`View Only for ${userRole}`} style={{ fontSize: '0.65rem', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-muted)' }}>
                  View
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Cloud & Architecture Docs Button */}
      {onOpenArchitecture && (
        <button
          onClick={onOpenArchitecture}
          className="btn btn-secondary"
          style={{ width: '100%', marginBottom: '1rem', justifyContent: 'flex-start', padding: '0.75rem 1rem', fontSize: '0.85rem' }}
        >
          <Server size={18} color="var(--primary)" />
          <span>System Architecture</span>
        </button>
      )}

      {/* Role Capabilities Summary Box */}
      <div className="card" style={{ padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <CheckCircle2 size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{userRole} Role Permissions</span>
        </div>
        <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
          {userRole === 'Admin' && (
            <>
              <li>Full System Admin Access</li>
              <li>Manage Customers, Stock & Challans</li>
              <li>Confirm Sales & Adjust Inventory</li>
            </>
          )}
          {userRole === 'Sales' && (
            <>
              <li>Create & Edit Customers & Notes</li>
              <li>Generate Sales Challans (Draft/Confirm)</li>
              <li>View Product Prices & Availability</li>
            </>
          )}
          {userRole === 'Warehouse' && (
            <>
              <li>Add & Edit Products & SKUs</li>
              <li>Perform Stock IN / Stock OUT</li>
              <li>Track Stock Movement Log History</li>
            </>
          )}
          {userRole === 'Accounts' && (
            <>
              <li>View Customer Accounts & GST Details</li>
              <li>Export Official PDF Invoices</li>
              <li>Audit Confirmed Sales & Movements</li>
            </>
          )}
        </ul>
      </div>
    </aside>
  );
};

