import { BookOpen, ArrowRight, Calculator, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export function BusinessRules() {
  return (
    <div className="page-container">
      <h2 className="page-title">
        <BookOpen size={20} />
        How Reorder Planning Works
      </h2>

      {/* Core Formula — hero card */}
      <div className="rules-hero">
        <div className="rules-hero-left">
          <Calculator size={28} />
          <div>
            <h3>Reorder Formula</h3>
            <p className="rules-hero-sub">When stock drops below a threshold, the system calculates how much to order.</p>
          </div>
        </div>
        <div className="formula-box">
          <span className="formula-label">Reorder Qty</span>
          <span className="formula-eq">= (ROP &times; 1.2) &minus; Current Qty</span>
        </div>
      </div>

      {/* 3-step flow */}
      <div className="rules-steps">
        <div className="rules-step">
          <div className="step-num">1</div>
          <div className="step-content">
            <h4>Identify</h4>
            <p>Dashboard shows all items where <strong>Current Qty &lt; ROP</strong> in red.</p>
          </div>
        </div>
        <ArrowRight size={18} className="step-arrow" />
        <div className="rules-step">
          <div className="step-num">2</div>
          <div className="step-content">
            <h4>Review &amp; Adjust</h4>
            <p>Click <strong>Reorder</strong> to see details, AI recommendation, and edit quantity if needed.</p>
          </div>
        </div>
        <ArrowRight size={18} className="step-arrow" />
        <div className="rules-step">
          <div className="step-num">3</div>
          <div className="step-content">
            <h4>Submit</h4>
            <p>Confirm vendor and submit. KPIs and stock update immediately.</p>
          </div>
        </div>
      </div>

      {/* Field Glossary — compact table */}
      <div className="rules-card">
        <h3>Field Reference</h3>
        <table className="rules-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>What it means</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>SKU</code></td>
              <td>Unique material ID, e.g. <strong>PAD-X200</strong></td>
            </tr>
            <tr>
              <td><code>Description</code></td>
              <td>Brake-pad size, type and compound</td>
            </tr>
            <tr>
              <td><code>ROP</code></td>
              <td>Reorder Point &mdash; minimum stock before alert triggers</td>
            </tr>
            <tr>
              <td><code>Current Qty</code></td>
              <td>Physical stock in warehouse right now</td>
            </tr>
            <tr>
              <td><code>Reorder Qty</code></td>
              <td>Suggested order amount = (ROP &times; 1.2) &minus; Current Qty</td>
            </tr>
            <tr>
              <td><code>Plant / Loc</code></td>
              <td>Warehouse plant and storage bin</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Status Indicators */}
      <div className="rules-card">
        <h3>Status Indicators</h3>
        <div className="rules-indicators">
          <div className="rules-indicator">
            <span className="status-badge status-badge-sm status-critical">REORDER</span>
            <span>Current Qty is below ROP. Action required.</span>
          </div>
          <div className="rules-indicator">
            <span className="status-badge status-badge-sm status-ok">OK</span>
            <span>Current Qty meets or exceeds ROP. No action needed.</span>
          </div>
          <div className="rules-indicator">
            <AlertTriangle size={14} className="qty-low" />
            <span>Appears next to Current Qty when stock is low.</span>
          </div>
        </div>
      </div>

      {/* Worked Example */}
      <div className="rules-card">
        <h3>Worked Example</h3>
        <div className="rules-example">
          <div className="example-item">
            <span className="sku-badge">PAD-X200</span>
            <span className="example-desc">Brake Pad 200mm</span>
          </div>
          <div className="example-row">
            <span>ROP</span>
            <span>500</span>
          </div>
          <div className="example-row">
            <span>Current Qty</span>
            <span className="qty-low">380</span>
          </div>
          <div className="example-row example-formula">
            <span>Calculation</span>
            <span>(500 &times; 1.2) &minus; 380 = <strong>220 units</strong></span>
          </div>
          <div className="example-row">
            <span>Status</span>
            <span className="status-badge status-badge-sm status-critical">REORDER</span>
          </div>
        </div>
      </div>

      {/* Stock Editing */}
      <div className="rules-card">
        <h3>Editing Stock</h3>
        <div className="rules-indicators">
          <div className="rules-indicator">
            <CheckCircle size={14} className="qty-ok" />
            <span>Click the <strong>pencil icon</strong> next to Current Qty to update physical counts after a stock check.</span>
          </div>
          <div className="rules-indicator">
            <Clock size={14} style={{ color: 'var(--textMuted)' }} />
            <span>KPIs recalculate instantly &mdash; no page refresh needed.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
