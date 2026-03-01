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
    <div className="bg-gradient-to-br from-dark-card to-dark-hover rounded-lg p-4 sm:p-6 border border-accent-primary/30 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Categorías</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-accent-primary text-white'
                  : 'bg-dark-hover text-gray-300 hover:bg-dark-border'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter === 'income'
                  ? 'bg-blue-400 text-white'
                  : 'bg-dark-hover text-gray-300 hover:bg-dark-border'
              }`}
            >
              Ingresos
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter === 'expense'
                  ? 'bg-blue-600 text-white'
                  : 'bg-dark-hover text-gray-300 hover:bg-dark-border'
              }`}
            >
              Egresos
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors text-sm sm:text-base"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Nueva Categoría</span>
            <span className="sm:hidden">Nueva</span>
          </button>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No hay categorías registradas</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredCategories.map(category => (
            <div
              key={category.id}
              className="bg-dark-hover border border-dark-border rounded-lg p-4 flex items-center justify-between transition-colors"
              style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <p className="font-semibold text-white">{category.name}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    category.type === 'income'
                      ? 'bg-blue-100 text-blue-500'
                      : 'bg-blue-200 text-blue-700'
                  }`}>
                    {category.type === 'income' ? 'Ingreso' : 'Egreso'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-accent-primary hover:text-blue-600"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-700"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
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
