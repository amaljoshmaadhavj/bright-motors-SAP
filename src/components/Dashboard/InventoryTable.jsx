import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { calculateReorderQty, isBelowRop, getVendorById } from '../../data/inventory';
import { Search, Filter, Eye, ShoppingCart, Pencil, Check, X, Download } from 'lucide-react';
import { EmptyState } from '../UI/EmptyState';
import { exportTableToPDF } from '../../utils/exportPDF';

function InlineEditCell({ item }) {
  const { updateQty } = useStore();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(item.currentQty));

  const save = () => {
    const n = parseInt(val, 10);
    if (isNaN(n) || n < 0) return;
    if (n !== item.currentQty) {
      updateQty(item.id, n);
    }
    setEditing(false);
  };

  const cancel = () => {
    setVal(String(item.currentQty));
    setEditing(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  };

  const below = isBelowRop({ ...item, currentQty: parseInt(val, 10) || item.currentQty });

  if (editing) {
    return (
      <div className="inline-edit-wrap">
        <input
          type="number"
          className="inline-edit-input"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={handleKey}
          autoFocus
          min={0}
        />
        <button className="inline-edit-btn" onClick={save} title="Save"><Check size={12} /></button>
        <button className="inline-edit-btn cancel" onClick={cancel} title="Cancel"><X size={12} /></button>
      </div>
    );
  }

  return (
    <div className="inline-edit-wrap">
      <span className={`td-number inline-edit-num ${below ? 'qty-low' : 'qty-ok'}`}>
        {item.currentQty}
      </span>
      <button className="inline-edit-btn" onClick={() => setEditing(true)} title="Edit stock">
        <Pencil size={11} />
      </button>
    </div>
  );
}

function MobileEditCell({ item }) {
  const { updateQty } = useStore();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(item.currentQty));

  const save = () => {
    const n = parseInt(val, 10);
    if (isNaN(n) || n < 0) return;
    if (n !== item.currentQty) updateQty(item.id, n);
    setEditing(false);
  };

  if (!editing) {
    return (
      <button className="inline-edit-btn" onClick={() => setEditing(true)} style={{ marginTop: 4 }}>
        <Pencil size={11} /> Edit stock
      </button>
    );
  }

  return (
    <div className="mobile-edit-wrap">
      <input
        type="number"
        className="mobile-edit-input"
        value={val}
        onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
        autoFocus
        min={0}
      />
      <button className="mobile-edit-btn confirm" onClick={save}>Save</button>
      <button className="mobile-edit-btn" onClick={() => { setVal(String(item.currentQty)); setEditing(false); }}>Cancel</button>
    </div>
  );
}

export function InventoryTable({ onViewItem }) {
  const { state } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = state.inventory.filter(item => {
    const matchSearch = item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    if (filter === 'low') return matchSearch && isBelowRop(item);
    if (filter === 'healthy') return matchSearch && !isBelowRop(item);
    return matchSearch;
  });

  const handleExport = () => {
    const headers = ['SKU', 'Description', 'Category', 'ROP', 'Current Qty', 'Reorder Qty', 'Status', 'Vendor'];
    const rows = state.inventory.map(item => {
      const below = isBelowRop(item);
      const qty = calculateReorderQty(item.rop, item.currentQty);
      const vendor = state.inventory.length ? getVendorById(item.vendorId) : null;
      return [
        item.id,
        item.description,
        item.category,
        item.rop,
        item.currentQty,
        below ? qty : '—',
        below ? 'REORDER' : 'OK',
        vendor?.name || '—',
      ];
    });
    exportTableToPDF('Material Inventory Report', headers, rows);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Material Inventory</h2>
        <div className="table-controls">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search SKU or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <Filter size={14} />
            {['all', 'low', 'healthy'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'low' ? 'Below ROP' : 'Healthy'}
              </button>
            ))}
          </div>
          <button className="action-btn btn-export" onClick={handleExport} title="Download PDF">
            <Download size={14} />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No items found"
          description={search ? `No items match "${search}"` : 'No inventory items in this category.'}
        />
      ) : (
        <>
          <div className="table-desktop">
            <table className="sap-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>ROP</th>
                  <th>Current Qty</th>
                  <th>Reorder Qty</th>
                  <th>Status</th>
                  <th>Vendor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const below = isBelowRop(item);
                  const reorderQty = calculateReorderQty(item.rop, item.currentQty);
                  const vendor = getVendorById(item.vendorId);
                  return (
                    <motion.tr
                      key={item.id}
                      className={`table-row ${below ? 'row-alert' : ''}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <td className="td-sku">
                        <span className="sku-badge">{item.id}</span>
                      </td>
                      <td className="td-desc">{item.description}</td>
                      <td>{item.category}</td>
                      <td className="td-number">{item.rop}</td>
                      <td>
                        <InlineEditCell item={item} />
                      </td>
                      <td className={`td-number ${below ? 'reorder-active' : ''}`}>
                        {below ? reorderQty : '—'}
                      </td>
                      <td>
                        <span className={`status-badge status-badge-sm ${below ? 'status-critical' : 'status-ok'}`}>
                          {below ? 'REORDER' : 'OK'}
                        </span>
                      </td>
                      <td className="td-vendor">{vendor?.name || '—'}</td>
                      <td className="td-actions">
                        <button className="btn-icon-only" onClick={() => onViewItem(item)} data-tooltip="Review" aria-label="Review">
                          <Eye size={14} />
                        </button>
                        {below && (
                          <button className="action-btn btn-reorder" onClick={() => onViewItem(item, true)} title="Reorder">
                            <ShoppingCart size={14} />
                            <span>Reorder</span>
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="table-mobile">
            {filtered.map((item, i) => {
              const below = isBelowRop(item);
              const reorderQty = calculateReorderQty(item.rop, item.currentQty);
              const vendor = getVendorById(item.vendorId);
              return (
                <motion.div
                  key={item.id}
                  className={`mobile-card ${below ? 'card-alert' : ''}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="card-header-row">
                    <span className="sku-badge">{item.id}</span>
                    <span className={`status-badge ${below ? 'status-critical' : 'status-ok'}`}>
                      {below ? 'REORDER' : 'OK'}
                    </span>
                  </div>
                  <p className="card-desc">{item.description}</p>
                  <div className="card-stats">
                    <div className="card-stat">
                      <span className="stat-label">ROP</span>
                      <span className="stat-value">{item.rop}</span>
                    </div>
                    <div className="card-stat">
                      <span className="stat-label">Current</span>
                      <span className={`stat-value ${below ? 'qty-low' : 'qty-ok'}`}>{item.currentQty}</span>
                    </div>
                    <div className="card-stat">
                      <span className="stat-label">Reorder</span>
                      <span className={`stat-value ${below ? 'reorder-active' : ''}`}>{below ? reorderQty : '—'}</span>
                    </div>
                  </div>
                  <div className="card-vendor">{vendor?.name || '—'}</div>
                  <MobileEditCell item={item} />
                  <div className="card-actions">
                    <button className="action-btn btn-view" onClick={() => onViewItem(item)}>
                      <Eye size={13} /> Review
                    </button>
                    {below && (
                      <button className="action-btn btn-reorder" onClick={() => onViewItem(item, true)}>
                        <ShoppingCart size={13} /> Reorder
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
