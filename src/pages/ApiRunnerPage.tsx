import React, { useState } from 'react';
import { Play, Code, CheckCircle, AlertTriangle, Copy, RefreshCw, Send, Database } from 'lucide-react';
import { getCustomers, getProducts, getChallans, getStockLogs, DEMO_USERS } from '../services/storage';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: string;
  description: string;
  defaultPayload?: any;
  queryParams?: Record<string, string>;
}

const ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'auth_login',
    method: 'POST',
    path: '/api/auth/login',
    category: 'Authentication',
    description: 'Authenticate user with role credentials and return JWT bearer token.',
    defaultPayload: {
      email: 'admin@company.com',
      role: 'Admin'
    }
  },
  {
    id: 'get_customers',
    method: 'GET',
    path: '/api/customers',
    category: 'CRM Module',
    description: 'Fetch list of all customer profiles with optional status and search filters.',
    queryParams: {
      status: 'Active',
      search: ''
    }
  },
  {
    id: 'create_customer',
    method: 'POST',
    path: '/api/customers',
    category: 'CRM Module',
    description: 'Create a new customer lead or account with GST & contact details.',
    defaultPayload: {
      name: 'Vanguard Industrial Supplies',
      mobile: '+91 98111 22334',
      email: 'orders@vanguard.in',
      businessName: 'Vanguard Corp',
      gstNumber: '29AAACV9988H1Z4',
      type: 'Wholesale',
      address: 'Plot 88, Electronic City, Bengaluru',
      status: 'Active',
      followUpDate: '2026-08-10',
      notes: 'Initial account created via API client'
    }
  },
  {
    id: 'get_products',
    method: 'GET',
    path: '/api/products',
    category: 'Product & Stock',
    description: 'Retrieve products catalog, current stock levels, and alert thresholds.',
    queryParams: {
      lowStockOnly: 'false'
    }
  },
  {
    id: 'create_product',
    method: 'POST',
    path: '/api/products',
    category: 'Product & Stock',
    description: 'Add a new product SKU into inventory catalog.',
    defaultPayload: {
      name: 'High Voltage Surge Suppressor',
      sku: 'SURGE-HV-2026',
      category: 'Electronics',
      unitPrice: 2850,
      currentStock: 100,
      minStockAlert: 20,
      warehouseLocation: 'Rack C-05'
    }
  },
  {
    id: 'get_challans',
    method: 'GET',
    path: '/api/challans',
    category: 'Sales Challan',
    description: 'Fetch sales challans with total amounts and status filters.',
    queryParams: {
      status: 'Confirmed'
    }
  },
  {
    id: 'create_challan',
    method: 'POST',
    path: '/api/challans',
    category: 'Sales Challan',
    description: 'Create a new Sales Challan (Draft or Confirmed) with stock checks.',
    defaultPayload: {
      customerId: 'cust_1',
      status: 'Draft',
      items: [
        { productId: 'prod_1', quantity: 5 },
        { productId: 'prod_3', quantity: 2 }
      ],
      notes: 'API Test Challan Creation'
    }
  },
  {
    id: 'get_stock_logs',
    method: 'GET',
    path: '/api/stock-logs',
    category: 'Inventory Audit',
    description: 'Retrieve audit logs for stock IN and OUT movements.',
    queryParams: {}
  }
];

export const ApiRunnerPage: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(ENDPOINTS[0]);
  const [payloadInput, setPayloadInput] = useState<string>(
    JSON.stringify(ENDPOINTS[0].defaultPayload || {}, null, 2)
  );
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'response' | 'headers' | 'curl'>('response');

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setPayloadInput(ep.defaultPayload ? JSON.stringify(ep.defaultPayload, null, 2) : '{}');
    setResponseOutput(null);
    setResponseStatus(null);
    setResponseTime(null);
  };

  const handleExecute = () => {
    setIsLoading(true);
    const startTime = performance.now();

    setTimeout(() => {
      let result: any = null;
      let status = 200;

      try {
        switch (selectedEndpoint.id) {
          case 'auth_login':
            result = {
              success: true,
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c3JfYWRtaW4iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3MjE2NjQwMDB9...',
              user: DEMO_USERS.Admin,
              expiresIn: '24h'
            };
            break;

          case 'get_customers':
            result = {
              total: getCustomers().length,
              data: getCustomers()
            };
            break;

          case 'create_customer':
            const newCust = JSON.parse(payloadInput);
            result = {
              message: 'Customer profile created successfully',
              customer: { id: `cust_${Date.now()}`, ...newCust, createdAt: new Date().toISOString() }
            };
            status = 201;
            break;

          case 'get_products':
            result = {
              total: getProducts().length,
              data: getProducts()
            };
            break;

          case 'create_product':
            const newProd = JSON.parse(payloadInput);
            result = {
              message: 'Product SKU added to catalog',
              product: { id: `prod_${Date.now()}`, ...newProd }
            };
            status = 201;
            break;

          case 'get_challans':
            result = {
              total: getChallans().length,
              data: getChallans()
            };
            break;

          case 'create_challan':
            const challanReq = JSON.parse(payloadInput);
            result = {
              message: 'Sales Challan generated',
              challanNumber: `CHN-${new Date().getFullYear()}-099`,
              status: challanReq.status || 'Draft',
              itemsCount: challanReq.items?.length || 0,
              totalAmount: 28500
            };
            status = 201;
            break;

          case 'get_stock_logs':
            result = {
              total: getStockLogs().length,
              logs: getStockLogs()
            };
            break;

          default:
            result = { message: 'Endpoint executed' };
        }
      } catch (err: any) {
        status = 400;
        result = { error: 'Invalid JSON body format', details: err.message };
      }

      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime + Math.random() * 40 + 15));
      setResponseStatus(status);
      setResponseOutput(result);
      setIsLoading(false);
    }, 300);
  };

  const getCurlCommand = () => {
    const baseUrl = 'http://localhost:5000';
    let cmd = `curl -X ${selectedEndpoint.method} "${baseUrl}${selectedEndpoint.path}" \\\n  -H "Authorization: Bearer <jwt_token>" \\\n  -H "Content-Type: application/json"`;
    if (selectedEndpoint.method === 'POST') {
      cmd += ` \\\n  -d '${payloadInput.replace(/\n/g, '')}'`;
    }
    return cmd;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Interactive REST API Console</h1>
          <p className="page-subtitle">
            Postman-style interactive suite to inspect, test, and validate backend REST endpoints & JSON schemas.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => handleSelectEndpoint(selectedEndpoint)}>
            <RefreshCw size={16} /> Reset Request
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Endpoint Selector Panel */}
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={16} /> API Endpoints Catalog
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ENDPOINTS.map((ep) => {
              const isSelected = ep.id === selectedEndpoint.id;
              const methodColor = ep.method === 'GET' ? 'var(--primary)' : 'var(--accent)';

              return (
                <div
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                    border: `1px solid ${isSelected ? 'var(--border-highlight)' : 'var(--border-color)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: methodColor + '20',
                      color: methodColor,
                      border: `1px solid ${methodColor}40`
                    }}>
                      {ep.method}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {ep.path}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {ep.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* API Tester Console */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header Request Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span className="badge badge-success" style={{ fontSize: '0.85rem', fontWeight: 800, padding: '0.35rem 0.85rem' }}>
              {selectedEndpoint.method}
            </span>
            <input
              type="text"
              readOnly
              value={`http://localhost:5000${selectedEndpoint.path}`}
              className="form-control"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.9rem', flex: 1, background: 'var(--bg-primary)' }}
            />
            <button
              onClick={handleExecute}
              disabled={isLoading}
              className="btn btn-primary"
              style={{ padding: '0.7rem 1.5rem', whiteSpace: 'nowrap' }}
            >
              {isLoading ? <RefreshCw size={16} className="spin" /> : <Send size={16} />}
              Execute Request
            </button>
          </div>

          {/* Request Payload Editor (For POST requests) */}
          {selectedEndpoint.method === 'POST' && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Request Body (JSON Payload)</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Content-Type: application/json</span>
              </div>
              <textarea
                value={payloadInput}
                onChange={(e) => setPayloadInput(e.target.value)}
                rows={8}
                className="form-control"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.5, background: 'var(--bg-primary)' }}
              />
            </div>
          )}

          {/* Response Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className={`btn btn-sm ${activeTab === 'response' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('response')}
                >
                  JSON Response Body
                </button>
                <button
                  className={`btn btn-sm ${activeTab === 'curl' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setActiveTab('curl')}
                >
                  cURL Equivalent
                </button>
              </div>

              {responseStatus && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: responseStatus < 300 ? 'var(--primary)' : 'var(--danger)', fontWeight: 800 }}>
                    Status: {responseStatus} OK
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Time: {responseTime}ms
                  </span>
                </div>
              )}
            </div>

            {activeTab === 'response' && (
              <div style={{ position: 'relative' }}>
                {responseOutput ? (
                  <pre
                    style={{
                      background: 'var(--bg-primary)',
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      maxHeight: '380px',
                      overflow: 'auto',
                      color: 'var(--primary)'
                    }}
                  >
                    {JSON.stringify(responseOutput, null, 2)}
                  </pre>
                ) : (
                  <div
                    style={{
                      background: 'var(--bg-primary)',
                      padding: '3rem 1.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px dashed var(--border-color)',
                      textAlign: 'center',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <Code size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                    <p style={{ fontWeight: 600 }}>No response rendered yet.</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Click <strong>"Execute Request"</strong> above to send mock API call.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'curl' && (
              <div style={{ position: 'relative' }}>
                <pre
                  style={{
                    background: 'var(--bg-primary)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    overflowX: 'auto',
                    color: 'var(--accent)'
                  }}
                >
                  {getCurlCommand()}
                </pre>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ position: 'absolute', top: 12, right: 12 }}
                  onClick={() => {
                    navigator.clipboard.writeText(getCurlCommand());
                    alert('cURL command copied to clipboard!');
                  }}
                >
                  <Copy size={14} /> Copy cURL
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
