import { useState, useEffect } from 'react';

export default function ProductForm({ initialData, categories, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    quantity: '',
    categoryId: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        sku: initialData.sku || '',
        price: initialData.price != null ? initialData.price : '',
        quantity: initialData.quantity != null ? initialData.quantity : '',
        categoryId: initialData.categoryId || (categories.length > 0 ? categories[0].id : ''),
      });
    } else if (categories.length > 0 && !formData.categoryId) {
      setFormData((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [initialData, categories]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required (min 2 chars)';
    if (!formData.sku.trim()) errs.sku = 'SKU is required';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Price must be greater than 0';
    if (formData.quantity === '' || Number(formData.quantity) < 0) errs.quantity = 'Quantity cannot be negative';
    if (!formData.categoryId) errs.categoryId = 'Please select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      sku: formData.sku.trim().toUpperCase(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      categoryId: parseInt(formData.categoryId, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label className="form-label">Product Name *</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Ergonomic Office Chair"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label">SKU (Stock Keeping Unit) *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. FUR-CHR-001"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />
          {errors.sku && <span className="field-error">{errors.sku}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            className="form-select"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className="field-error">{errors.categoryId}</span>}
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label">Unit Price ($) *</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Current Stock Quantity *</label>
          <input
            type="number"
            min="0"
            className="form-input"
            placeholder="0"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          />
          {errors.quantity && <span className="field-error">{errors.quantity}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          placeholder="Detailed product specifications or notes..."
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}
