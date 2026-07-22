import React from 'react';
import { Customer, Product, Challan, StockLog, User } from '../types';
import {
  IndianRupee,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Plus,
  FileText,
  Activity,
  Boxes,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowDownRight
} from 'lucide-react';

interface DashboardProps {
  customers: Customer[];
  products: Product[];
  challans: Challan[];
  stockLogs: StockLog[];
  currentUser: User;
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  customers,
  products,
  challans,
  stockLogs,
  currentUser,
  onNavigate
}) => {
  const confirmedChallans = challans.filter(c => c.status === 'Confirmed');
  const totalRevenue = confirmedChallans.reduce((sum, c) => sum + c.totalAmount, 0);
  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const leadCustomers = customers.filter(c => c.status === 'Lead').length;
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStockAlert);
  const totalStockUnits = products.reduce((acc, p) => acc + p.currentStock, 0);

  return (
    <div>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Operations Executive Hub
            </h1>
            <span className="badge badge-emerald">
              <ShieldCheck size={14} /> Active Session ({currentUser.role})
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Welcome back, <strong style={{ color: 'var(--text-main)' }}>{currentUser.name}</strong>. Enterprise wholesale telemetry & live CRM feeds.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {(currentUser.role === 'Admin' || currentUser.role === 'Sales') && (
            <button className="btn btn-primary" onClick={() => onNavigate('challans')}>
              <Plus size={16} /> New Sales Challan
            </button>
          )}
          {(currentUser.role === 'Admin' || currentUser.role === 'Warehouse') && (
            <button className="btn btn-secondary" onClick={() => onNavigate('products')}>
              <Package size={16} /> Manage Inventory
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="card card-gradient-top kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon" style={{ background: 'var(--emerald-light)', color: 'var(--emerald)' }}>
              <IndianRupee size={24} />
            </div>
            <span className="badge badge-emerald">
              <TrendingUp size={12} /> +24.8% YoY
            </span>
          </div>
          <div>
            <div className="kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="kpi-label">Confirmed Distribution Sales</div>
          </div>
          <div className="progress-bg">
            <div className="progress-fill" style={{ width: '82%', background: 'var(--emerald)' }} />
          </div>
        </div>

        <div className="card card-gradient-top kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Users size={24} />
            </div>
            <span className="badge badge-indigo">
              {leadCustomers} Active Leads
            </span>
          </div>
          <div>
            <div className="kpi-value">{activeCustomers} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Accounts</span></div>
            <div className="kpi-label">CRM Client Accounts</div>
          </div>
          <div className="progress-bg">
            <div className="progress-fill" style={{ width: '68%', background: 'var(--primary)' }} />
          </div>
        </div>

        <div className="card card-gradient-top kpi-card">
          <div className="kpi-header">
            <div className="kpi-icon" style={{ background: 'var(--violet-light)', color: 'var(--violet)' }}>
              <Boxes size={24} />
            </div>
            <span className="badge badge-indigo">
              {products.length} Active SKUs
            </span>
          </div>
          <div>
            <div className="kpi-value">{totalStockUnits.toLocaleString()}</div>
            <div className="kpi-label">Warehouse On-Hand Units</div>
          </div>
          <div className="progress-bg">
            <div className="progress-fill" style={{ width: '75%', background: 'var(--violet)' }} />
          </div>
        </div>

        <div className="card card-gradient-top kpi-card" style={{ borderColor: lowStockProducts.length > 0 ? 'var(--amber)' : undefined }}>
          <div className="kpi-header">
            <div className="kpi-icon" style={{ background: lowStockProducts.length > 0 ? 'var(--amber-light)' : 'var(--bg-tertiary)', color: lowStockProducts.length > 0 ? 'var(--amber)' : 'var(--text-muted)' }}>
              <AlertTriangle size={24} />
            </div>
            {lowStockProducts.length > 0 && (
              <span className="badge badge-amber">
                Requires Restock
              </span>
            )}
          </div>
          <div>
            <div className="kpi-value" style={{ color: lowStockProducts.length > 0 ? 'var(--amber)' : undefined }}>
              {lowStockProducts.length}
            </div>
            <div className="kpi-label">Low Stock Reorders</div>
          </div>
          <div className="progress-bg">
            <div className="progress-fill" style={{ width: `${Math.min(100, (lowStockProducts.length / (products.length || 1)) * 100)}%`, background: 'var(--amber)' }} />
          </div>
        </div>
      </div>

      {/* Low Stock Urgent Reorder Banner */}
      {lowStockProducts.length > 0 && (
        <div className="card" style={{ marginBottom: '1.75rem', background: 'var(--amber-light)', border: '1px solid var(--amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <AlertTriangle size={22} color="var(--amber)" />
              <div>
                <strong style={{ fontSize: '0.95rem' }}>Stock Alert Notice:</strong>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                  {lowStockProducts.map(p => `${p.name} (${p.currentStock} remaining)`).join(', ')}
                </span>
              </div>
            </div>
            <button className="btn btn-sm btn-secondary" onClick={() => onNavigate('products')}>
              Reorder Inventory <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Two Column Grid */}
      <div className="grid-2">
        {/* Recent Challans Panel */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--primary)" /> Recent Sales Delivery Challans
            </h3>
            <button className="btn btn-sm btn-secondary" onClick={() => onNavigate('challans')}>
              View All
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Challan #</th>
                  <th>Customer</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {challans.slice(0, 5).map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                      {c.challanNumber}
                    </td>
                    <td style={{ fontWeight: 700 }}>{c.customerName}</td>
                    <td>₹{c.totalAmount.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge badge-${c.status === 'Confirmed' ? 'emerald' : c.status === 'Draft' ? 'amber' : 'rose'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Movement Stream Panel */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="var(--accent)" /> Real-Time Stock Movement Stream
            </h3>
            <button className="btn btn-sm btn-secondary" onClick={() => onNavigate('stock_logs')}>
              Full Logs
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stockLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800 }}>{log.productName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {log.reason} • {log.timestamp}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${log.movementType === 'IN' ? 'emerald' : 'amber'}`}>
                    {log.movementType === 'IN' ? '+' : '-'}{log.quantityChanged} Units ({log.movementType})
                  </span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                    by {log.createdBy}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
