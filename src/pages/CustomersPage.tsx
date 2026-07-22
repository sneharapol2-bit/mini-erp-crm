import React, { useState } from 'react';
import { Customer, CustomerType, CustomerStatus, User } from '../types';
import { saveCustomer, addFollowUpNote } from '../services/storage';
import { Users, Search, Plus, Edit2, Eye, Calendar, Phone, Mail, Building2, FileText, CheckCircle2, MessageSquare, Clock, X } from 'lucide-react';

interface CustomersPageProps {
  customers: Customer[];
  onRefresh: () => void;
  currentUser: User;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  customers,
  onRefresh,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);

  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Filtering
  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mobile.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'ALL' || c.type === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingCustomer({
      name: '',
      mobile: '',
      email: '',
      businessName: '',
      gstNumber: '',
      type: 'Wholesale',
      address: '',
      status: 'Lead',
      followUpDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsAddEditOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer?.name || !editingCustomer?.mobile || !editingCustomer?.businessName) {
      alert('Please fill in required fields: Name, Mobile, and Business Name');
      return;
    }

    saveCustomer(editingCustomer as any);
    onRefresh();
    setIsAddEditOpen(false);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailCustomer || !newNoteText.trim()) return;

    const updated = addFollowUpNote(detailCustomer.id, newNoteText.trim());
    if (updated) {
      setDetailCustomer(updated);
      setNewNoteText('');
      onRefresh();
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer CRM Portal</h1>
          <p className="page-subtitle">Manage client profiles, business details, credit accounts, and sales follow-up histories.</p>
        </div>
        <div>
          {(currentUser.role === 'Admin' || currentUser.role === 'Sales') && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} /> Add New Customer
            </button>
          )}
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
              placeholder="Search by customer name, business, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <select
              className="form-control"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ minWidth: 140 }}
            >
              <option value="ALL">All Types</option>
              <option value="Retail">Retail</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Distributor">Distributor</option>
            </select>

            <select
              className="form-control"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ minWidth: 140 }}
            >
              <option value="ALL">All Statuses</option>
              <option value="Lead">Lead</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer List Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer / Business</th>
                <th>Contact Information</th>
                <th>Type</th>
                <th>Status</th>
                <th>Follow-up Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No customers found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.businessName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Contact: {c.name} {c.gstNumber && `• GST: ${c.gstNumber}`}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={13} color="var(--text-muted)" /> {c.mobile}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={13} color="var(--text-muted)" /> {c.email}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'var(--bg-tertiary)' }}>
                        {c.type}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${c.status === 'Active' ? 'success' : c.status === 'Lead' ? 'warning' : 'danger'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} color="var(--primary)" /> {c.followUpDate}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setDetailCustomer(c)}
                          title="View Customer Details & History"
                        >
                          <Eye size={14} /> View
                        </button>
                        {(currentUser.role === 'Admin' || currentUser.role === 'Sales') && (
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleOpenEdit(c)}
                            title="Edit Customer Details"
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isAddEditOpen && editingCustomer && (
        <div className="modal-overlay" onClick={() => setIsAddEditOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingCustomer.id ? 'Edit Customer Details' : 'Add New CRM Customer'}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsAddEditOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Customer Contact Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={editingCustomer.name || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Business / Company Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={editingCustomer.businessName || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, businessName: e.target.value })}
                      placeholder="e.g. Apex Hardware Supplies"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={editingCustomer.mobile || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, mobile: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={editingCustomer.email || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Customer Type</label>
                    <select
                      className="form-control"
                      value={editingCustomer.type || 'Wholesale'}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, type: e.target.value as CustomerType })}
                    >
                      <option value="Retail">Retail</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Distributor">Distributor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Account Status</label>
                    <select
                      className="form-control"
                      value={editingCustomer.status || 'Lead'}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, status: e.target.value as CustomerStatus })}
                    >
                      <option value="Lead">Lead</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Next Follow-up Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editingCustomer.followUpDate || ''}
                      onChange={(e) => setEditingCustomer({ ...editingCustomer, followUpDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">GST Number (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingCustomer.gstNumber || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, gstNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. 27AAACA123411Z5"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={editingCustomer.address || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                    placeholder="Full business street address..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Follow-up / Remarks</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={editingCustomer.notes || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, notes: e.target.value })}
                    placeholder="Customer requirements, credit terms discussion, meeting notes..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddEditOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Customer Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Customer Details & Follow-up Timeline Modal */}
      {detailCustomer && (
        <div className="modal-overlay" onClick={() => setDetailCustomer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <div>
                <span className={`badge badge-${detailCustomer.status === 'Active' ? 'success' : detailCustomer.status === 'Lead' ? 'warning' : 'danger'}`}>
                  {detailCustomer.status}
                </span>
                <h3 className="modal-title" style={{ marginTop: '0.25rem' }}>{detailCustomer.businessName}</h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setDetailCustomer(null)}>
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>CONTACT PERSON</div>
                  <div style={{ fontWeight: 700 }}>{detailCustomer.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{detailCustomer.mobile}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{detailCustomer.email}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>BUSINESS SPECIFICATIONS</div>
                  <div style={{ fontSize: '0.85rem' }}><strong>Type:</strong> {detailCustomer.type}</div>
                  <div style={{ fontSize: '0.85rem' }}><strong>GST:</strong> {detailCustomer.gstNumber || 'N/A'}</div>
                  <div style={{ fontSize: '0.85rem' }}><strong>Next Follow-up:</strong> {detailCustomer.followUpDate}</div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>REGISTERED ADDRESS</div>
                  <div style={{ fontSize: '0.85rem' }}>{detailCustomer.address || 'No address specified'}</div>
                </div>
              </div>

              {/* Add Follow-up Note Form */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MessageSquare size={16} color="var(--primary)" /> Add Follow-up Note
                </h4>
                <form onSubmit={handleAddNoteSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter call notes, quote details, or follow-up outcome..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    Post Note
                  </button>
                </form>
              </div>

              {/* Follow-up Timeline */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={16} color="var(--accent)" /> Follow-up Notes Timeline ({detailCustomer.followUpHistory?.length || 0})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(!detailCustomer.followUpHistory || detailCustomer.followUpHistory.length === 0) ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No follow-up notes recorded yet.
                    </div>
                  ) : (
                    detailCustomer.followUpHistory.map((fn) => (
                      <div
                        key={fn.id}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-secondary)'
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                          "{fn.note}"
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Logged by <strong>{fn.createdBy}</strong></span>
                          <span>{fn.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDetailCustomer(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
