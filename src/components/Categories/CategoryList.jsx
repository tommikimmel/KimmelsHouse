import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { Edit2, Trash2, Plus } from 'lucide-react';
import CategoryForm from './CategoryForm';

const CategoryList = () => {
  const { categories, deleteCategory } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta categoría?')) {
      await deleteCategory(id);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter(cat => {
    if (filter === 'all') return true;
    return cat.type === filter;
  });

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Categorías</h2>
        <div>
          <div className="filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button
              className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
              onClick={() => setFilter('income')}
            >
              Ingresos
            </button>
            <button
              className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
              onClick={() => setFilter('expense')}
            >
              Egresos
            </button>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <Plus />
            <span>Nueva Categoría</span>
            <span>Nueva</span>
          </button>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <p>No hay categorías registradas</p>
      ) : (
        <div className="grid grid-3">
          {filteredCategories.map(category => (
            <div
              key={category.id}
              className="stat-card"
              style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
            >
              <div>
                <span>{category.icon}</span>
                <div>
                  <p>{category.name}</p>
                  <span>
                    {category.type === 'income' ? 'Ingreso' : 'Egreso'}
                  </span>
                </div>
              </div>
              <div>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(category)}
                  title="Editar"
                >
                  <Edit2 />
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleDelete(category.id)}
                  title="Eliminar"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CategoryForm
          category={selectedCategory}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default CategoryList;
