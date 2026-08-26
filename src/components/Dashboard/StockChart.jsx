import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { isBelowRop, calculateReorderQty } from '../../data/inventory';

export function StockChart() {
  const { state } = useStore();
  const maxVal = Math.max(...state.inventory.map(i => Math.max(i.rop, i.currentQty)));
  const scale = 100 / (maxVal * 1.2);

  const belowCount = state.inventory.filter(isBelowRop).length;
  const estimatedValue = state.inventory
    .filter(isBelowRop)
    .reduce((sum, i) => sum + calculateReorderQty(i.rop, i.currentQty) * i.unitPrice, 0);

  return (
    <div className="stock-chart-card">
      <div className="stock-chart-header">
        <div>
          <h3 className="stock-chart-title">Stock Level Overview</h3>
          <p className="stock-chart-subtitle">Current Qty vs Reorder Point</p>
        </div>
        <div className="stock-chart-legend">
          <span className="legend-item"><span className="legend-dot legend-current" /> Current Qty</span>
          <span className="legend-item"><span className="legend-dot legend-rop" /> ROP</span>
        </div>
      </div>
      <div className="stock-chart-summary">
        <span className="stock-chart-summary-text">
          {belowCount === 0
            ? 'All materials are above reorder point'
            : `${belowCount} material${belowCount > 1 ? 's' : ''} need replenishment`}
        </span>
        {belowCount > 0 && (
          <span className="stock-chart-summary-value">
            Est. value: ₹{estimatedValue.toLocaleString()}
          </span>
        )}
        <span className="stock-chart-summary-hint">
          <span className="legend-dot legend-dot-sm bar-red" /> Replenishment required &nbsp;
          <span className="legend-dot legend-dot-sm bar-green" /> Stock healthy
        </span>
      </div>
      <div className="stock-chart-body">
        {state.inventory.map((item, i) => {
          const below = isBelowRop(item);
          const currentWidth = item.currentQty * scale;
          const ropWidth = item.rop * scale;
          return (
            <div key={item.id} className="stock-chart-row">
              <span className="stock-chart-sku">{item.id}</span>
              <div className="stock-chart-bars">
                <div className="stock-chart-bar-track">
                  <motion.div
                    className={`stock-chart-bar ${below ? 'bar-red' : 'bar-green'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${currentWidth}%` }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
                  />
                  <div
                    className="stock-chart-rop-line"
                    style={{ left: `${ropWidth}%` }}
                    title={`ROP: ${item.rop}`}
                  />
                </div>
                <div className="stock-chart-values">
                  <span className={`stock-chart-val ${below ? 'qty-low' : 'qty-ok'}`}>{item.currentQty}</span>
                  <span className="stock-chart-rop-val">{item.rop}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
