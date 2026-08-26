import { useStore } from '../../store/useStore';
import { FileText, Download } from 'lucide-react';
import { EmptyState } from '../UI/EmptyState';
import { exportTableToPDF } from '../../utils/exportPDF';

export function PrLog() {
  const { state } = useStore();

  const activePrs = state.purchaseRequests.filter(p => p.status === 'Submitted');
  const totalUnits = state.purchaseRequests.reduce((sum, pr) => sum + pr.reorderQty, 0);

  const handleExport = () => {
    const headers = ['PR Number', 'SKU', 'Description', 'Quantity', 'Vendor', 'Status', 'Est. Delivery', 'Submitted'];
    const rows = state.purchaseRequests.map(pr => [
      pr.id,
      pr.itemId,
      pr.description,
      pr.reorderQty,
      pr.vendorName,
      pr.status,
      pr.estimatedDelivery,
      new Date(pr.submittedAt).toLocaleDateString(),
    ]);
    exportTableToPDF('Purchase Request Log', headers, rows);
  };

  if (state.purchaseRequests.length === 0) {
    return (
      <div className="page-container">
        <div className="page-title-row">
          <h2 className="page-title">Purchase Request Log</h2>
        </div>
        <EmptyState
          icon={FileText}
          title="No Purchase Requests"
          description="Submitted reorder requests will appear here."
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-title-row">
        <h2 className="page-title">Purchase Request Log</h2>
        <button className="action-btn btn-export" onClick={handleExport} title="Download PDF">
          <Download size={14} />
          <span>PDF</span>
        </button>
      </div>
      <div className="pr-summary-bar">
        <div className="pr-summary-item">
          <span className="pr-summary-value">{activePrs.length}</span>
          <span className="pr-summary-label">Active PR{activePrs.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="pr-summary-divider" />
        <div className="pr-summary-item">
          <span className="pr-summary-value">{totalUnits.toLocaleString()}</span>
          <span className="pr-summary-label">Total Units Requested</span>
        </div>
      </div>
      <div className="table-desktop">
        <table className="sap-table">
          <thead>
            <tr>
              <th>PR Number</th>
              <th>SKU</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Vendor</th>
              <th>Status</th>
              <th>Est. Delivery</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {state.purchaseRequests.map(pr => (
              <tr key={pr.id}>
                <td className="td-sku"><span className="sku-badge pr-badge">{pr.id}</span></td>
                <td className="td-sku"><span className="sku-badge">{pr.itemId}</span></td>
                <td className="td-desc">{pr.description}</td>
                <td className="td-number">{pr.reorderQty}</td>
                <td>{pr.vendorName}</td>
                <td><span className="status-badge status-submitted">{pr.status}</span></td>
                <td>{pr.estimatedDelivery}</td>
                <td>{new Date(pr.submittedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-mobile">
        {state.purchaseRequests.map(pr => (
          <div key={pr.id} className="mobile-card">
            <div className="card-header-row">
              <span className="sku-badge pr-badge">{pr.id}</span>
              <span className="status-badge status-submitted">{pr.status}</span>
            </div>
            <p className="card-desc">{pr.description}</p>
            <div className="card-stats">
              <div className="card-stat">
                <span className="stat-label">Qty</span>
                <span className="stat-value">{pr.reorderQty}</span>
              </div>
              <div className="card-stat">
                <span className="stat-label">Vendor</span>
                <span className="stat-value">{pr.vendorName}</span>
              </div>
              <div className="card-stat">
                <span className="stat-label">Delivery</span>
                <span className="stat-value">{pr.estimatedDelivery}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
