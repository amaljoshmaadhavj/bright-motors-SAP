import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Package, AlertTriangle, CheckCircle, FileText, IndianRupee } from 'lucide-react';

const kpiConfig = [
  { key: 'totalSku', label: 'Total SKUs', icon: Package, color: '#0a6ed1' },
  { key: 'belowRop', label: 'Below ROP', icon: AlertTriangle, color: '#bb0000' },
  { key: 'healthyStock', label: 'Healthy Stock', icon: CheckCircle, color: '#107e3e' },
  { key: 'activePr', label: 'Active PRs', icon: FileText, color: '#e9730c' },
];

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
}

export function KpiCards() {
  const { kpis } = useStore();

  return (
    <div className="kpi-grid">
      {kpiConfig.map((cfg, i) => {
        const Icon = cfg.icon;
        const value = kpis[cfg.key];
        return (
          <motion.div
            key={cfg.key}
            className="kpi-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35, ease: 'easeOut' }}
          >
            <div className="kpi-icon" style={{ backgroundColor: cfg.color + '12', color: cfg.color }}>
              <Icon size={20} />
            </div>
            <div className="kpi-content">
              <span className="kpi-label">{cfg.label}</span>
              <motion.span
                className="kpi-value"
                key={value}
                initial={{ scale: 1.15, color: cfg.color }}
                animate={{ scale: 1, color: '#1a2035' }}
                transition={{ duration: 0.5 }}
              >
                {value}
              </motion.span>
            </div>
          </motion.div>
        );
      })}
      <motion.div
        className="kpi-card kpi-card-wide"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.35, ease: 'easeOut' }}
      >
        <div className="kpi-icon" style={{ backgroundColor: '#0a6ed112', color: '#0a6ed1' }}>
          <IndianRupee size={20} />
        </div>
        <div className="kpi-content">
          <span className="kpi-label">Total Inventory Value</span>
          <motion.span
            className="kpi-value"
            key={kpis.totalInventoryValue}
            initial={{ scale: 1.1, color: '#0a6ed1' }}
            animate={{ scale: 1, color: '#1a2035' }}
            transition={{ duration: 0.5 }}
          >
            {formatCurrency(kpis.totalInventoryValue)}
          </motion.span>
        </div>
      </motion.div>
      <motion.div
        className="kpi-card kpi-card-wide"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.35, ease: 'easeOut' }}
      >
        <div className="kpi-icon" style={{ backgroundColor: '#107e3e12', color: '#107e3e' }}>
          <Package size={20} />
        </div>
        <div className="kpi-content">
          <span className="kpi-label">Total Units in Stock</span>
          <motion.span
            className="kpi-value"
            key={kpis.totalStock}
            initial={{ scale: 1.1, color: '#107e3e' }}
            animate={{ scale: 1, color: '#1a2035' }}
            transition={{ duration: 0.5 }}
          >
            {kpis.totalStock.toLocaleString()}
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}
