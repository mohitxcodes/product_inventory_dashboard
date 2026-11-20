import { useState, useEffect } from 'react';

export default function TransactionForm({ type, products, initialProductId, onSubmit, onCancel, isSubmitting }) {
  const [productId, setProductId] = useState(initialProductId || '');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const selectedProduct = products.find((p) => String(p.id) === String(productId));

  useEffect(() => {
    if (initialProductId) {
      setProductId(String(initialProductId));
    } else if (products.length > 0 && !productId) {
      setProductId(String(products[0].id));
    }
  }, [initialProductId, products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productId) {
      setError('Please select a product');
      return;
    }
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }
    if (type === 'STOCK_OUT' && selectedProduct && qty > selectedProduct.quantity) {
      setError(`Cannot dispatch ${qty} units. Only ${selectedProduct.quantity} units in stock.`);
      return;
    }

    onSubmit({
      productId: parseInt(productId, 10),
      quantity: qty,
      notes: notes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div className="form-group">
        <label className="form-label">Select Product *</label>
        <select
          className="form-select"
          value={productId}
          onChange={(e) => {
            setProductId(e.target.value);
            setError('');
          }}
        >
          <option value="">Select a product...</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku}) — Current Stock: {p.quantity}
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.25rem',
          fontSize: '0.85rem',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Available Units:</span>
            <strong style={{ color: selectedProduct.quantity > 0 ? 'var(--success)' : 'var(--danger)' }}>
              {selectedProduct.quantity}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            <span>Category:</span>
            <span>{selectedProduct.categoryName || 'N/A'}</span>
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">
          {type === 'STOCK_IN' ? 'Quantity to Receive *' : 'Quantity to Dispatch *'}
        </label>
        <input
          type="number"
          min="1"
          max={type === 'STOCK_OUT' && selectedProduct ? selectedProduct.quantity : undefined}
          className="form-input"
          placeholder="e.g. 50"
          value={quantity}
          onChange={(e) => {
            setQuantity(e.target.value);
            setError('');
          }}
        />
        {error && <span className="field-error" style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.35rem', display: 'block' }}>{error}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Transaction Reference / Reason</label>
        <textarea
          className="form-textarea"
          placeholder="e.g. Supplier invoice PO-2026-908, damage write-off, or return..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button
          type="submit"
          className={`btn ${type === 'STOCK_IN' ? 'btn-success' : 'btn-danger'}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Recording...' : type === 'STOCK_IN' ? 'Confirm Stock In' : 'Confirm Stock Out'}
        </button>
      </div>
    </form>
  );
}
