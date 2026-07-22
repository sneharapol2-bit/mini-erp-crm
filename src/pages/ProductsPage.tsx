import React, { useState } from 'react';
import { Product, StockMovementType, User } from '../types';
import { saveProduct, adjustStock } from '../services/storage';
import { Package, Search, Plus, Edit2, AlertTriangle, ArrowUpRight, ArrowDownLeft, MapPin, Tag, IndianRupee, Layers, X } from 'lucide-react';

interface ProductsPageProps {
  products: Product[];
  onRefresh: () => void;
  currentUser: User;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  onRefresh,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<StockMovementType>('IN');
  const [adjustQuantity, setAdjustQuantity] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [adjustError, setAdjustError] = useState<string | null>(null);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.warehouseLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingProduct({
      name: '',
      sku: '',
      category: 'Electronics',
      unitPrice: 100,
      currentStock: 50,
      minStockAlert: 10,
      warehouseLocation: 'Main Warehouse'
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsAddEditOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.sku || !editingProduct?.unitPrice) {
      alert('Please fill in required fields');
      return;
    }

    saveProduct(editingProduct as any);
    onRefresh();
    setIsAddEditOpen(false);
  };

  const handleAdjustStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdjustError(null);
    if (!adjustModalProduct) return;

    const res = adjustStock(
      adjustModalProduct.id,
      Number(adjustQuantity),
      adjustType,
      adjustReason
    );

    if (!res.success) {
      setAdjustError(res.message);
      return;
    }

    onRefresh();
    setAdjustModalProduct(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Product & Inventory Management</h1>
          <p className="page-subtitle">Track stock levels, warehouse rack locations, reorder thresholds, and stock adjustments.</p>
        </div>
        <div>
          {(currentUser.role === 'Admin' || currentUser.role === 'Warehouse') && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} /> Add Product
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: 1 }}>
            <Search className="search-icon" />
            <input
              type="text"
              className="form-control"
              placeholder="Search products by title, SKU, warehouse rack location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ minWidth: 160 }}
            >
              <option value="ALL">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product List Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Product & SKU</th>
                <th>Category</th>
                <th>Unit Price</th>
                <th>Stock Level</th>
                <th>Min Alert Qty</th>
                <th>Warehouse Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLowStock = p.currentStock <= p.minStockAlert;
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          SKU: {p.sku}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'var(--bg-tertiary)' }}>
                          {p.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>₹{p.unitPrice.toLocaleString('en-IN')}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: isLowStock ? 'var(--warning)' : 'var(--text-main)' }}>
                            {p.currentStock} units
                          </span>
                          {isLowStock && (
                            <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                              <AlertTriangle size={11} /> Low Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{p.minStockAlert} units</td>
                      <td>
                        <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} color="var(--primary)" /> {p.warehouseLocation}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          {(currentUser.role === 'Admin' || currentUser.role === 'Warehouse') && (
                            <>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => {
                                  setAdjustModalProduct(p);
                                  setAdjustType('IN');
                                  setAdjustQuantity(10);
                                  setAdjustReason('Stock Inward Purchase');
                                  setAdjustError(null);
                                }}
                                title="Adjust Stock Quantity (IN/OUT)"
                              >
                                Stock ±
                              </button>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => handleOpenEdit(p)}
                                title="Edit Product Details"
                              >
                                <Edit2 size={14} /> Edit
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddEditOpen && editingProduct && (
        <div className="modal-overlay" onClick={() => setIsAddEditOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingProduct.id ? 'Edit Product' : 'Add New Inventory Item'}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsAddEditOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. Industrial Controller v4"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">SKU / Item Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      style={{ fontFamily: 'var(--font-mono)' }}
                      value={editingProduct.sku || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value.toUpperCase() })}
                      placeholder="MCU-IND-V4"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingProduct.category || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      placeholder="Electronics, Power, Networking..."
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Unit Price (₹) *</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min={0}
                      value={editingProduct.unitPrice ?? 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, unitPrice: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Current Stock *</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min={0}
                      value={editingProduct.currentStock ?? 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, currentStock: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Min Alert Threshold</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min={1}
                      value={editingProduct.minStockAlert ?? 10}
                      onChange={(e) => setEditingProduct({ ...editingProduct, minStockAlert: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Warehouse Rack / Storage Bay Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingProduct.warehouseLocation || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, warehouseLocation: e.target.value })}
                    placeholder="e.g. Rack A-12, Main Warehouse"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddEditOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Product Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustModalProduct && (
        <div className="modal-overlay" onClick={() => setAdjustModalProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Adjust Stock Level</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setAdjustModalProduct(null)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAdjustStockSubmit}>
              <div className="modal-body">
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 700 }}>{adjustModalProduct.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Current Stock: <strong>{adjustModalProduct.currentStock} units</strong> (SKU: {adjustModalProduct.sku})
                  </div>
                </div>

                {adjustError && (
                  <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--danger-bg)', border: '1px solid var(--danger)', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <strong>Validation Error:</strong> {adjustError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Movement Direction</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className={`btn ${adjustType === 'IN' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setAdjustType('IN')}
                    >
                      <ArrowDownLeft size={16} /> Stock IN (+)
                    </button>
                    <button
                      type="button"
                      className={`btn ${adjustType === 'OUT' ? 'btn-danger' : 'btn-secondary'}`}
                      onClick={() => setAdjustType('OUT')}
                    >
                      <ArrowUpRight size={16} /> Stock OUT (-)
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity to Change</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    min={1}
                    value={adjustQuantity}
                    onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reason / Reference Note</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. Received vendor PO #8812 or Damaged item write-off"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setAdjustModalProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Stock Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
