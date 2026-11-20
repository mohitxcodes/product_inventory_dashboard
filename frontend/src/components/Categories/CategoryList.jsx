import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../api/axios';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import CategoryForm from './CategoryForm';
import './CategoryList.css';

export default function CategoryList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCatId, setDeletingCatId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/categories');
      setCategories(res.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateOrUpdate = async (catData) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await API.put(`/api/categories/${editingCategory.id}`, catData);
        toast.success('Category updated successfully');
      } else {
        await API.post('/api/categories', catData);
        toast.success('Category created successfully');
      }
      setIsFormOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCatId) return;
    try {
      await API.delete(`/api/categories/${deletingCatId}`);
      toast.success('Category deleted successfully');
      setDeletingCatId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Cannot delete category with associated products');
    }
  };

  return (
    <div className="categories-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Product Categories</h1>
          <p className="page-subtitle">Group, segment, and organize catalog classifications</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingCategory(null);
            setIsFormOpen(true);
          }}
        >
          <Plus size={16} />
          <span>New Category</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching inventory categories..." />
      ) : categories.length === 0 ? (
        <div className="card empty-state">
          <FolderOpen size={48} className="empty-state-icon" />
          <h3>No categories created</h3>
          <p>Get started by creating your first category hierarchy.</p>
        </div>
      ) : (
        <div className="category-cards-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="card category-card">
              <div className="category-card-top">
                <div className="category-icon-wrapper">
                  <FolderOpen size={20} color="var(--accent-light)" />
                </div>
                <div className="category-actions">
                  <button
                    className="action-btn edit-btn"
                    title="Edit Category"
                    onClick={() => {
                      setEditingCategory(cat);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    title="Delete Category"
                    onClick={() => setDeletingCatId(cat.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="category-card-body">
                <h3 className="category-title">{cat.name}</h3>
                <p className="category-desc">
                  {cat.description || 'No description provided for this classification.'}
                </p>
              </div>

              <div className="category-card-footer">
                <div className="category-stats-pill">
                  <Package size={14} />
                  <span>{cat.productCount || 0} products</span>
                </div>
                <button
                  className="category-view-link"
                  onClick={() => navigate('/products')}
                >
                  <span>Explore</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <CategoryForm
          initialData={editingCategory}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingCategory(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingCatId}
        onClose={() => setDeletingCatId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? If there are active products inside it, deletion will be blocked to maintain referential integrity."
      />
    </div>
  );
}
