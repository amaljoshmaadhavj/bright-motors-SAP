import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { calculateReorderQty, getVendorById, VENDORS } from '../../data/inventory';
import { useAiRecommendation } from '../../hooks/useAiRecommendation';
import { X, ShoppingCart, Bot, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

export function ReorderPanel({ item, reorderMode, onClose }) {
  const { submitReorder } = useStore();
  const { recommendation, loading: aiLoading, getRecommendation } = useAiRecommendation();

  const [reorderQty, setReorderQty] = useState('');
  const [selectedVendor, setSelectedVendor] = useState(item.vendorId);
  const [notes, setNotes] = useState('');
  const [qtyError, setQtyError] = useState('');
  const [step, setStep] = useState(reorderMode ? 'reorder' : 'review');

  const suggestedQty = calculateReorderQty(item.rop, item.currentQty);
  const vendor = getVendorById(selectedVendor);

  useEffect(() => {
    if (reorderMode) setReorderQty(String(suggestedQty));
  }, [reorderMode, suggestedQty]);

  useEffect(() => {
    getRecommendation(item);
  }, [item, getRecommendation]);

  const validateQty = (val) => {
    const n = parseInt(val, 10);
    if (isNaN(n) || n <= 0) {
      setQtyError('Quantity must be a positive whole number.');
      return false;
    }
    if (n > item.rop * 3) {
      setQtyError(`Quantity exceeds 3× ROP (${item.rop * 3}). This seems unusual.`);
      return false;
    }
    setQtyError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validateQty(reorderQty)) return;
    const success = submitReorder(item.id, parseInt(reorderQty, 10), selectedVendor, notes);
    if (success) {
      setStep('confirmation');
    }
  };

  const handleQtyChange = (e) => {
    const val = e.target.value;
    setReorderQty(val);
    if (val) validateQty(val);
    else setQtyError('');
  };

  return (
    <motion.div
      className="panel-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="reorder-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        {step === 'confirmation' ? (
          <div className="panel-confirm">
            <div className="confirm-icon">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
              >
                <CheckCircle size={64} strokeWidth={1.2} />
              </motion.div>
            </div>
            <h2>Reorder Submitted</h2>
            <p className="confirm-subtitle">Purchase request has been created successfully.</p>
            <div className="confirm-details">
              <div className="confirm-row">
                <span>SKU</span>
                <span className="confirm-value">{item.id}</span>
              </div>
              <div className="confirm-row">
                <span>Quantity</span>
                <span className="confirm-value">{reorderQty} units</span>
              </div>
              <div className="confirm-row">
                <span>Vendor</span>
                <span className="confirm-value">{vendor?.name}</span>
              </div>
              <div className="confirm-row">
                <span>Est. Delivery</span>
                <span className="confirm-value">{vendor?.leadTimeDays} days</span>
              </div>
            </div>
            <button className="panel-btn primary" onClick={onClose}>Return to Dashboard</button>
          </div>
        ) : (
          <>
            <div className="panel-header">
              <button className="panel-back" onClick={onClose}>
                <ArrowLeft size={18} />
              </button>
              <div className="panel-header-text">
                <h2>{item.id}</h2>
                <p>{item.description}</p>
              </div>
              <button className="panel-close" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="panel-body">
              <div className="item-status-bar">
                {item.currentQty < item.rop ? (
                  <div className="status-msg status-msg-alert">
                    <AlertTriangle size={16} />
                    <span>Below Reorder Point — replenishment required</span>
                  </div>
                ) : (
                  <div className="status-msg status-msg-ok">
                    <CheckCircle size={16} />
                    <span>Stock level healthy</span>
                  </div>
                )}
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Plant</span>
                  <span className="detail-value">{item.plant}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Storage Location</span>
                  <span className="detail-value">{item.storageLocation}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Unit Price</span>
                  <span className="detail-value">₹{item.unitPrice.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Received</span>
                  <span className="detail-value">{item.lastReceived}</span>
                </div>
              </div>

              <div className="stock-meters">
                <div className="meter-row">
                  <span className="meter-label">ROP</span>
                  <div className="meter-track">
                    <div className="meter-fill meter-rop" style={{ width: `${Math.min(100, (item.rop / (item.rop * 1.5)) * 100)}%` }} />
                  </div>
                  <span className="meter-val">{item.rop}</span>
                </div>
                <div className="meter-row">
                  <span className="meter-label">Current</span>
                  <div className="meter-track">
                    <motion.div
                      className={`meter-fill ${item.currentQty < item.rop ? 'meter-low' : 'meter-ok'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (item.currentQty / (item.rop * 1.5)) * 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                  <span className={`meter-val ${item.currentQty < item.rop ? 'qty-low' : 'qty-ok'}`}>{item.currentQty}</span>
                </div>
              </div>

              <div className="ai-section">
                <div className="ai-header">
                  <Bot size={18} />
                  <span>AI Reorder Recommendation</span>
                  {aiLoading && <span className="ai-loading">Analyzing...</span>}
                </div>
                {recommendation && !aiLoading && (
                  <div className="ai-content">
                    <p>{recommendation.recommendation}</p>
                    <div className="ai-meta">
                      <span className={`urgency-badge urgency-${recommendation.urgency.toLowerCase()}`}>
                        {recommendation.urgency}
                      </span>
                      <span>Coverage: {recommendation.coverageDays} days</span>
                      <span>Est. Cost: ₹{recommendation.estimatedCost.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {step === 'reorder' && (
                <motion.div
                  className="reorder-form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3>Submit Purchase Request</h3>

                  <div className="form-group">
                    <label className="form-label">Reorder Quantity (suggested: {suggestedQty})</label>
                    <input
                      type="number"
                      className={`form-input ${qtyError ? 'input-error' : ''}`}
                      value={reorderQty}
                      onChange={handleQtyChange}
                      min={1}
                      max={item.rop * 3}
                    />
                    {qtyError && <span className="form-error">{qtyError}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Vendor</label>
                    <select
                      className="form-select"
                      value={selectedVendor}
                      onChange={e => setSelectedVendor(e.target.value)}
                    >
                      {VENDORS.map(v => (
                        <option key={v.id} value={v.id}>{v.name} ({v.leadTimeDays}d lead)</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notes (optional)</label>
                    <textarea
                      className="form-textarea"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Additional notes..."
                      rows={2}
                    />
                  </div>

                  {parseInt(reorderQty, 10) > 0 && !qtyError && (
                    <div className="order-summary">
                      <div className="summary-row">
                        <span>Units</span><span>{parseInt(reorderQty, 10)}</span>
                      </div>
                      <div className="summary-row">
                        <span>Unit Price</span><span>₹{item.unitPrice.toLocaleString()}</span>
                      </div>
                      <div className="summary-row summary-total">
                        <span>Estimated Total</span>
                        <span>₹{(parseInt(reorderQty, 10) * item.unitPrice).toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <div className="panel-actions">
                    <button className="panel-btn secondary" onClick={() => setStep('review')}>Back</button>
                    <button
                      className="panel-btn primary"
                      onClick={handleSubmit}
                      disabled={!reorderQty || !!qtyError}
                    >
                      <ShoppingCart size={16} />
                      Submit Reorder
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'review' && (
                <div className="panel-actions">
                  <button className="panel-btn secondary" onClick={onClose}>Close</button>
                  {item.currentQty < item.rop && (
                    <button className="panel-btn primary" onClick={() => { setReorderQty(String(suggestedQty)); setStep('reorder'); }}>
                      <ShoppingCart size={16} />
                      Reorder ({suggestedQty} units)
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
