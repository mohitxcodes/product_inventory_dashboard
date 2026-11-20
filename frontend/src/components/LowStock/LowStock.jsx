import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  Sliders,
  RefreshCw,
  ArrowDownLeft,
  ShieldAlert,
  CheckCircle,
  PackageCheck,
  TrendingDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import './LowStock.css';

export default function LowStock() {
  const [threshold, setThreshold] = useState(10);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Quick Restock Modal
  const [restockModal, setRestockModal] = useState({ isOpen: false, product: null });
  const [restockQty, setRestockQty] = useState('50');
  const [restockNotes, setRestockNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLowStock = useCallback(async () => {
    try {
      const res = await API.get(`/api/products/low-stock?threshold=${threshold}`);
      setLowStockProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch low stock alerts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [threshold]);

  useEffect(() => {
    fetchLowStock();
  }, [fetchLowStock]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLowStock();
  };

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    const qty = parseInt(restockQty, 10);
    if (!qty || qty <= 0) {
      toast.error('Enter valid quantity');
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post('/api/stock-transactions/stock-in', {
        productId: restockModal.product.id,
        quantity: qty,
        notes: restockNotes || `Replenishment order for low-stock item`,
      });

      toast.success(`Successfully replenished ${qty} units for ${restockModal.product.name}`);
      setRestockModal({ isOpen: false, product: null });
      setRestockQty('50');
      setRestockNotes('');
      fetchLowStock();
    } catch (err) {
      toast.error(err.message || 'Replenishment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const outOfStockCount = lowStockProducts.filter((p) => p.quantity === 0).length;
  const criticalCount = lowStockProducts.length;

  return (
    <div className="low-stock-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Low Stock Alert Center</h1>
          <p className="page-subtitle">Proactive replenishment monitor for items at risk of stock-out</p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
          <span>Refresh Scan</span>
        </button>
      </div>

      {/* Threshold Controller Card */}
      <div className="card threshold-card">
        <div className="threshold-inner">
          <div className="threshold-label-group">
            <div className="threshold-icon-box">
              <Sliders size={20} color="var(--warning)" />
            </div>
            <div>
              <h3 className="threshold-title">Alert Threshold: <span>{threshold} Units</span></h3>
              <p className="threshold-desc">
                Products with remaining stock below or equal to this threshold trigger critical warning alerts.
              </p>
            </div>
          </div>
          <div className="threshold-slider-group">
            <input
              type="range"
              min="1"
              max="50"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="threshold-slider"
            />
            <div className="slider-ticks">
              <span>1 unit</span>
              <span>15</span>
              <span>30</span>
              <span>50 units</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="low-stock-kpi-row">
        <div className="card alert-summary-pill" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div className="pill-content">
            <span className="pill-title">Zero Stock Items</span>
            <span className="pill-number" style={{ color: 'var(--danger)' }}>{outOfStockCount}</span>
          </div>
          <ShieldAlert size={26} color="var(--danger)" />
        </div>

        <div className="card alert-summary-pill" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="pill-content">
            <span className="pill-title">Low Stock At Risk</span>
            <span className="pill-number" style={{ color: 'var(--warning)' }}>{criticalCount}</span>
          </div>
          <TrendingDown size={26} color="var(--warning)" />
        </div>

        <div className="card alert-summary-pill" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="pill-content">
            <span className="pill-title">Safety Status</span>
            <span className="pill-number" style={{ color: 'var(--success)', fontSize: '1.15rem' }}>
              {criticalCount === 0 ? 'Healthy' : `${criticalCount} Actionable`}
            </span>
          </div>
          <PackageCheck size={26} color="var(--success)" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="card table-card">
        {loading ? (
          <LoadingSpinner text="Scanning product inventory levels..." />
        ) : lowStockProducts.length === 0 ? (
          <div className="empty-state">
            <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--text-primary)' }}>Healthy Inventory Levels</h3>
            <p>No products are currently under the {threshold}-unit safety threshold.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Stock Level</th>
                  <th>Deficit Level</th>
                  <th style={{ textAlign: 'right' }}>Restock Action</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.map((p) => {
                  const percent = Math.min(100, Math.round((p.quantity / threshold) * 100));
                  const isZero = p.quantity === 0;

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID #{p.id}</div>
                      </td>
                      <td>
                        <span className="sku-badge">{p.sku}</span>
                      </td>
                      <td>
                        <span className="category-pill">{p.categoryName || 'Unassigned'}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>${Number(p.price).toFixed(2)}</td>
                      <td>
                        <Badge variant={isZero ? 'danger' : 'warning'}>
                          {isZero ? '0 - EMPTY' : `${p.quantity} units left`}
                        </Badge>
                      </td>
                      <td style={{ minWidth: 150 }}>
                        <div className="stock-level-bar-container">
                          <div
                            className="stock-level-bar-fill"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: isZero ? 'var(--danger)' : 'var(--warning)',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {percent}% of threshold
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setRestockModal({ isOpen: true, product: p })}
                        >
                          <ArrowDownLeft size={14} />
                          <span>Restock Now</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restock Modal */}
      <Modal
        isOpen={restockModal.isOpen}
        onClose={() => setRestockModal({ isOpen: false, product: null })}
        title={`Restock: ${restockModal.product?.name}`}
      >
        <form onSubmit={handleRestockSubmit} className="restock-form">
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1.25rem',
            border: '1px solid var(--border)',
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Product SKU: <strong style={{ color: 'var(--text-primary)' }}>{restockModal.product?.sku}</strong>
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Current In-Stock: <strong style={{ color: 'var(--warning)' }}>{restockModal.product?.quantity} units</strong>
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Units to Add to Inventory *</label>
            <input
              type="number"
              min="1"
              className="form-input"
              value={restockQty}
              onChange={(e) => setRestockQty(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Restock Notes / PO Number</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Emergency replenishment batch #ER-2026"
              value={restockNotes}
              onChange={(e) => setRestockNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setRestockModal({ isOpen: false, product: null })}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
              {isSubmitting ? 'Replenishing...' : 'Confirm Replenishment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
