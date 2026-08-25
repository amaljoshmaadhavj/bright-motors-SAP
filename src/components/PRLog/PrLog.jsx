import { useStore } from '../../store/useStore';
import { FileText } from 'lucide-react';
import { EmptyState } from '../UI/EmptyState';

export function PrLog() {
  const { state } = useStore();

  if (state.purchaseRequests.length === 0) {
    return (
      <div className="page-container">
        <h2 className="page-title">Purchase Request Log</h2>
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
      <h2 className="page-title">Purchase Request Log</h2>
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
