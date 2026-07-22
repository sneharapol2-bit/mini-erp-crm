import React, { useState } from 'react';
import { StockLog, User } from '../types';
import { History, Search, ArrowDownLeft, ArrowUpRight, Filter } from 'lucide-react';

interface StockLogsPageProps {
  stockLogs: StockLog[];
  currentUser: User;
}

export const StockLogsPage: React.FC<StockLogsPageProps> = ({
  stockLogs,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movementFilter, setMovementFilter] = useState<string>('ALL');

  const filteredLogs = stockLogs.filter(log => {
    const matchesSearch =
      log.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.createdBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMovement = movementFilter === 'ALL' || log.movementType === movementFilter;

    return matchesSearch && matchesMovement;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock Movement Audit Logs</h1>
          <p className="page-subtitle">Complete chronological record of all inventory inward stock and sales outward deductions.</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: 1 }}>
            <Search className="search-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search movement reason, product title, SKU, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              className="form-control"
              value={movementFilter}
              onChange={(e) => setMovementFilter(e.target.value)}
              style={{ minWidth: 150 }}
            >
              <option value="ALL">All Movements</option>
              <option value="IN">Stock IN (+)</option>
              <option value="OUT">Stock OUT (-)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Movement</th>
                <th>Product & SKU</th>
                <th>Quantity Changed</th>
                <th>Reason / Reference</th>
                <th>Logged By</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No stock movement audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {log.timestamp}
                    </td>
                    <td>
                      <span className={`badge badge-${log.movementType === 'IN' ? 'success' : 'warning'}`}>
                        {log.movementType === 'IN' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                        Stock {log.movementType}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{log.productName}</div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        SKU: {log.sku}
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, fontSize: '1rem', color: log.movementType === 'IN' ? 'var(--success)' : 'var(--warning)' }}>
                      {log.movementType === 'IN' ? `+${log.quantityChanged}` : `-${log.quantityChanged}`} units
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{log.reason}</td>
                    <td style={{ fontSize: '0.85rem', fontWeight: 600 }}>{log.createdBy}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
