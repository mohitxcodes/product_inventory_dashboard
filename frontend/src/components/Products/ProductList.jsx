import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import Badge from '../common/Badge';
import LoadingSpinner from '../common/LoadingSpinner';
import ProductForm from './ProductForm';
import './ProductList.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Sort state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick transaction modal
  const [txModal, setTxModal] = useState({ isOpen: false, product: null, type: 'STOCK_IN' });
  const [txQty, setTxQty] = useState('');
  const [txNotes, setTxNotes] = useState('');

  // Load Categories once
  useEffect(() => {
    API.get('/api/categories')
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // Fetch Products based on current filters
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      if (searchTerm.trim()) {
        const res = await API.get(`/api/products/search?keyword=${encodeURIComponent(searchTerm.trim())}`);
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
        setTotalElements(data.length);
        setTotalPages(1);
      } else if (selectedCategory) {
        const res = await API.get(`/api/products/category/${selectedCategory}`);
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
        setTotalElements(data.length);
        setTotalPages(1);
      } else {
        const res = await API.get(
          `/api/products?page=${page}&size=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
        );
        if (res.data?.content) {
          setProducts(res.data.content);
          setTotalPages(res.data.totalPages || 0);
          setTotalElements(res.data.totalElements || 0);
        } else if (Array.isArray(res.data)) {
          setProducts(res.data);
          setTotalElements(res.data.length);
          setTotalPages(1);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, sortDir, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
    setPage(0);
  };

  const handleCreateOrUpdate = async (productData) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await API.put(`/api/products/${editingProduct.id}`, productData);
        toast.success('Product updated successfully!');
      } else {
        await API.post('/api/products', productData);
        toast.success('Product added successfully!');
      }
      setIsFormOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProductId) return;
    try {
      await API.delete(`/api/products/${deletingProductId}`);
      toast.success('Product deleted successfully');
      setDeletingProductId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  const handleQuickTransaction = async (e) => {
    e.preventDefault();
    if (!txQty || Number(txQty) <= 0) {
      toast.error('Enter a valid quantity');
      return;
    }
    try {
      const endpoint =
        txModal.type === 'STOCK_IN'
          ? '/api/stock-transactions/stock-in'
          : '/api/stock-transactions/stock-out';

      await API.post(endpoint, {
        productId: txModal.product.id,
        quantity: parseInt(txQty, 10),
        notes: txNotes || (txModal.type === 'STOCK_IN' ? 'Manual stock-in' : 'Manual stock-out'),
      });

      toast.success(
        txModal.type === 'STOCK_IN'
          ? `Added ${txQty} units to ${txModal.product.name}`
          : `Dispatched ${txQty} units of ${txModal.product.name}`
      );
      setTxModal({ isOpen: false, product: null, type: 'STOCK_IN' });
      setTxQty('');
      setTxNotes('');
      fetchProducts();
    } catch (err) {
      toast.error(err.message || 'Transaction failed');
    }
  };

  return (
    <div className="products-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Products Inventory</h1>
          <p className="page-subtitle">Manage catalog items, pricing, and active quantities</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card filter-bar-card">
        <div className="filter-bar">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
            />
          </div>

          <div className="filter-controls">
            <div className="select-wrapper">
              <Filter size={15} className="select-icon" />
              <select
                className="category-filter-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSearchTerm('');
                  setPage(0);
                }}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card table-card">
        {loading ? (
          <LoadingSpinner text="Fetching inventory records..." />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <Package size={48} className="empty-state-icon" />
            <h3>No products found</h3>
            <p>Try adjusting your search query or filter options.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')}>
                    <span className="th-content">ID <ArrowUpDown size={12} /></span>
                  </th>
                  <th onClick={() => handleSort('name')}>
                    <span className="th-content">Product Name <ArrowUpDown size={12} /></span>
                  </th>
                  <th onClick={() => handleSort('sku')}>
                    <span className="th-content">SKU <ArrowUpDown size={12} /></span>
                  </th>
                  <th>Category</th>
                  <th onClick={() => handleSort('price')}>
                    <span className="th-content">Price <ArrowUpDown size={12} /></span>
                  </th>
                  <th onClick={() => handleSort('quantity')}>
                    <span className="th-content">Stock <ArrowUpDown size={12} /></span>
                  </th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const qty = p.quantity;
                  let badgeVariant = 'success';
                  let badgeText = 'In Stock';
                  if (qty === 0) {
                    badgeVariant = 'danger';
                    badgeText = 'Out of Stock';
                  } else if (qty <= 10) {
                    badgeVariant = 'warning';
                    badgeText = 'Low Stock';
                  }

                  return (
                    <tr key={p.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{p.id}</td>
                      <td>
                        <div className="product-cell-name">{p.name}</div>
                        {p.description && (
                          <div className="product-cell-desc truncate">{p.description}</div>
                        )}
                      </td>
                      <td>
                        <span className="sku-badge">{p.sku}</span>
                      </td>
                      <td>
                        <span className="category-pill">{p.categoryName || 'Uncategorized'}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>${Number(p.price).toFixed(2)}</td>
                      <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>{qty}</td>
                      <td>
                        <Badge variant={badgeVariant} size="sm">
                          {badgeText}
                        </Badge>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn stock-in-btn"
                            title="Quick Stock In"
                            onClick={() => setTxModal({ isOpen: true, product: p, type: 'STOCK_IN' })}
                          >
                            <ArrowDownLeft size={15} />
                          </button>
                          <button
                            className="action-btn stock-out-btn"
                            title="Quick Stock Out"
                            disabled={qty === 0}
                            onClick={() => setTxModal({ isOpen: true, product: p, type: 'STOCK_OUT' })}
                          >
                            <ArrowUpRight size={15} />
                          </button>
                          <button
                            className="action-btn edit-btn"
                            title="Edit Product"
                            onClick={() => {
                              setEditingProduct(p);
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            title="Delete Product"
                            onClick={() => setDeletingProductId(p.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {!searchTerm && !selectedCategory && totalPages > 1 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, totalElements)} of {totalElements} items
            </span>
            <div className="pagination-buttons">
              <button
                className="btn btn-secondary btn-sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`pagination-num-btn ${page === i ? 'active' : ''}`}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn btn-secondary btn-sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <ProductForm
          initialData={editingProduct}
          categories={categories}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingProductId}
        onClose={() => setDeletingProductId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? All transaction history associated with this item will be affected."
      />

      {/* Quick Stock Transaction Modal */}
      <Modal
        isOpen={txModal.isOpen}
        onClose={() => setTxModal({ isOpen: false, product: null, type: 'STOCK_IN' })}
        title={txModal.type === 'STOCK_IN' ? `Stock In: ${txModal.product?.name}` : `Stock Out: ${txModal.product?.name}`}
      >
        <form onSubmit={handleQuickTransaction} className="quick-tx-form">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Current Available Inventory: <strong style={{ color: 'var(--text-primary)' }}>{txModal.product?.quantity} units</strong>
          </p>
          <div className="form-group">
            <label className="form-label">
              Quantity to {txModal.type === 'STOCK_IN' ? 'Receive' : 'Dispatch'} *
            </label>
            <input
              type="number"
              min="1"
              max={txModal.type === 'STOCK_OUT' ? txModal.product?.quantity : undefined}
              className="form-input"
              placeholder="e.g. 25"
              value={txQty}
              onChange={(e) => setTxQty(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Reason / Reference Notes</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. PO-8492 from supplier, or Customer Order #412"
              value={txNotes}
              onChange={(e) => setTxNotes(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setTxModal({ isOpen: false, product: null, type: 'STOCK_IN' })}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${txModal.type === 'STOCK_IN' ? 'btn-success' : 'btn-danger'}`}
            >
              Confirm {txModal.type === 'STOCK_IN' ? 'Stock In' : 'Stock Out'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
