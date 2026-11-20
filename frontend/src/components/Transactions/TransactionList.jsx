import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Filter,
  Search,
  Calendar,
  Package,
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import TransactionForm from './TransactionForm';
import './TransactionList.css';

export default function TransactionList() {
  const location = useLocation();
  const preselectId = location.state?.preselectProduct;

  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedProductId, setSelectedProductId] = useState(preselectId ? String(preselectId) : '');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchNotes, setSearchNotes] = useState('');

  // Modals
  const [modalType, setModalType] = useState(null); // 'STOCK_IN' | 'STOCK_OUT' | null
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product list for dropdowns
  const fetchProducts = async () => {
    try {
      const res = await API.get('/api/products?page=0&size=100');
      const data = res.data?.content || res.data || [];
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let res;
      if (selectedProductId) {
        res = await API.get(`/api/stock-transactions/product/${selectedProductId}`);
      } else {
        res = await API.get('/api/stock-transactions');
      }
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [selectedProductId]);

  const handleRecordTransaction = async (txData) => {
    setIsSubmitting(true);
    try {
      const endpoint =
        modalType === 'STOCK_IN'
          ? '/api/stock-transactions/stock-in'
          : '/api/stock-transactions/stock-out';

      await API.post(endpoint, txData);
      toast.success(
        modalType === 'STOCK_IN'
          ? 'Stock received and inventory increased!'
          : 'Stock dispatched and inventory adjusted!'
      );
      setModalType(null);
      fetchTransactions();
      fetchProducts(); // Refresh products to update quantities
    } catch (err) {
      toast.error(err.message || 'Transaction failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered transactions in-memory for type & notes
  const filteredTransactions = transactions.filter((tx) => {
    if (typeFilter !== 'ALL' && tx.type !== typeFilter) return false;
    if (searchNotes.trim()) {
      const query = searchNotes.toLowerCase();
      const matchProduct = (tx.productName || '').toLowerCase().includes(query);
      const matchNotes = (tx.notes || '').toLowerCase().includes(query);
      if (!matchProduct && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="transactions-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock Transactions</h1>
          <p className="page-subtitle">Complete ledger of inbound receipts and outbound dispatches</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-success"
            onClick={() => setModalType('STOCK_IN')}
          >
            <ArrowDownLeft size={16} />
            <span>Receive Stock (In)</span>
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setModalType('STOCK_OUT')}
          >
            <ArrowUpRight size={16} />
            <span>Dispatch Stock (Out)</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="card filter-bar-card">
        <div className="tx-filter-bar">
          <div className="tx-search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by product name or notes..."
              value={searchNotes}
              onChange={(e) => setSearchNotes(e.target.value)}
            />
          </div>

          <div className="tx-filter-controls">
            <div className="select-wrapper">
              <Package size={15} className="select-icon" />
              <select
                className="category-filter-select"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">All Products</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="type-toggle-group">
              <button
                className={`type-btn ${typeFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setTypeFilter('ALL')}
              >
                All
              </button>
              <button
                className={`type-btn in ${typeFilter === 'STOCK_IN' ? 'active' : ''}`}
                onClick={() => setTypeFilter('STOCK_IN')}
              >
                Inbound
              </button>
              <button
                className={`type-btn out ${typeFilter === 'STOCK_OUT' ? 'active' : ''}`}
                onClick={() => setTypeFilter('STOCK_OUT')}
              >
                Outbound
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card table-card">
        {loading ? (
          <LoadingSpinner text="Loading transaction audit log..." />
        ) : filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <ArrowLeftRight size={48} className="empty-state-icon" />
            <h3>No transactions recorded</h3>
            <p>Use the action buttons above to record inventory flow.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Movement Type</th>
                  <th>Quantity</th>
                  <th>Reference & Notes</th>
                  <th style={{ textAlign: 'right' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{tx.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {tx.productName || `Product #${tx.productId}`}
                      </div>
                    </td>
                    <td>
                      <Badge variant={tx.type === 'STOCK_IN' ? 'success' : 'danger'}>
                        {tx.type === 'STOCK_IN' ? 'STOCK IN (RECEIPT)' : 'STOCK OUT (DISPATCH)'}
                      </Badge>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: tx.type === 'STOCK_IN' ? 'var(--success)' : 'var(--danger)',
                        }}
                      >
                        {tx.type === 'STOCK_IN' ? `+${tx.quantity}` : `-${tx.quantity}`}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: 280 }}>
                      {tx.notes || <span style={{ color: 'var(--text-muted)' }}>No notes</span>}
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {tx.transactionDate ? new Date(tx.transactionDate).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Stock Modal */}
      <Modal
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        title={modalType === 'STOCK_IN' ? 'Record Inbound Stock Receipt' : 'Record Outbound Dispatch'}
      >
        <TransactionForm
          type={modalType}
          products={products}
          initialProductId={selectedProductId}
          onSubmit={handleRecordTransaction}
          onCancel={() => setModalType(null)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}
