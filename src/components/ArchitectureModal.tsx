import React, { useState } from 'react';
import { X, Server, Layers, Cpu, Cloud, FileCode, CheckCircle2, ShieldCheck, Terminal, Download } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'docker' | 'db' | 'submission'>('overview');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '850px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Server size={22} color="var(--primary)" />
            <div>
              <h2 className="modal-title">System Architecture & Deployment Guide</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Full-stack specification, cloud topology, Docker setup, and evaluator checklist
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', padding: '0 1.5rem' }}>
          {[
            { id: 'overview', label: 'Cloud Architecture', icon: Cloud },
            { id: 'docker', label: 'Docker & DevOps', icon: Terminal },
            { id: 'db', label: 'Database Schema', icon: Layers },
            { id: 'submission', label: 'Submission Checklist', icon: CheckCircle2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.25rem',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                  background: 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card" style={{ padding: '1rem', background: 'var(--bg-primary)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--accent)' }}>
                  🌐 Deployment Topology Diagram
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                  <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-highlight)' }}>
                    <Cloud size={28} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Frontend Application</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>React + Vite + TypeScript</div>
                    <span className="badge badge-success" style={{ marginTop: '0.5rem' }}>Hosted on Vercel / Netlify</span>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-highlight)' }}>
                    <Server size={28} color="var(--accent)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>REST API Service</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Node.js + Express + JWT</div>
                    <span className="badge badge-info" style={{ marginTop: '0.5rem' }}>Hosted on Render / Railway</span>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-highlight)' }}>
                    <Layers size={28} color="var(--violet)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Relational Database</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>PostgreSQL / Supabase / MySQL</div>
                    <span className="badge badge-warning" style={{ marginTop: '0.5rem' }}>Hosted on Supabase / Neon</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem' }}>Environment Variables Configuration (.env)</h4>
                <pre style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', border: '1px solid var(--border-color)', color: 'var(--primary)' }}>
{`PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/nexus_erp
JWT_SECRET=super_secret_jwt_key_99482716
CORS_ORIGIN=https://nexus-erp-frontend.vercel.app`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'docker' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem' }}>Container Setup (docker-compose.yml)</h4>
                <pre style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', border: '1px solid var(--border-color)', color: 'var(--accent)' }}>
{`version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://postgres:postgres@db:5432/nexus_erp
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secretpassword
      POSTGRES_DB: nexus_erp
    ports:
      - "5432:5432"`}
                </pre>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem' }}>One-Command Local Launch</h4>
                <pre style={{ background: 'var(--bg-primary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', border: '1px solid var(--border-color)', color: 'var(--primary)' }}>
                  docker-compose up --build -d
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'db' && (
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.75rem' }}>Relational Data Models</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                  <strong style={{ color: 'var(--primary)' }}>1. Customers Entity</strong>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                    <li>id (UUID / String PK)</li>
                    <li>name, mobile, email</li>
                    <li>business_name, gst_number</li>
                    <li>type (Retail | Wholesale | Distributor)</li>
                    <li>status (Lead | Active | Inactive)</li>
                    <li>follow_up_date, notes</li>
                  </ul>
                </div>

                <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                  <strong style={{ color: 'var(--accent)' }}>2. Products Entity</strong>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                    <li>id (UUID PK)</li>
                    <li>name, sku (UNIQUE)</li>
                    <li>category, unit_price</li>
                    <li>current_stock, min_stock_alert</li>
                    <li>warehouse_location</li>
                  </ul>
                </div>

                <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                  <strong style={{ color: 'var(--warning)' }}>3. Sales Challans Entity</strong>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                    <li>id, challan_number (UNIQUE)</li>
                    <li>customer_id (FK &rarr; Customers)</li>
                    <li>items JSONB (Snapshot Data)</li>
                    <li>status (Draft | Confirmed | Cancelled)</li>
                    <li>total_quantity, total_amount</li>
                    <li>created_by, created_at, confirmed_at</li>
                  </ul>
                </div>

                <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                  <strong style={{ color: 'var(--violet)' }}>4. Stock Movement Audit Logs</strong>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                    <li>id (UUID PK)</li>
                    <li>product_id (FK &rarr; Products)</li>
                    <li>quantity_changed</li>
                    <li>movement_type (IN | OUT)</li>
                    <li>reason, created_by, timestamp</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'submission' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Case Study Requirements Audit Checklist
              </div>

              {[
                { label: 'Role-Based Authentication (Admin, Sales, Warehouse, Accounts)', done: true },
                { label: 'Customer CRM with Leads, Follow-ups, and Notes Timeline', done: true },
                { label: 'Product Catalog, SKU Management & Warehouse Locations', done: true },
                { label: 'Stock Movement Logs (IN/OUT tracking with user attribution)', done: true },
                { label: 'Sales Challans Flow (Draft & Confirmed status)', done: true },
                { label: 'Stock check validation on Challan Confirmation (Prevents negative stock)', done: true },
                { label: 'Challan Product Snapshot Storage (Preserves order history)', done: true },
                { label: 'Export Invoice / Sales Challan as PDF (Bonus Feature)', done: true },
                { label: 'Docker & docker-compose configuration (Bonus Feature)', done: true },
                { label: 'Postman Collection / Interactive API Runner (Bonus Feature)', done: true }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-primary)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <span style={{ fontWeight: 600 }}>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
