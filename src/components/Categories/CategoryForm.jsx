import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useNotification } from '../../context/NotificationContext';
import { X, Loader2 } from 'lucide-react';

const CategoryForm = ({ onClose, category = null }) => {
  const { addCategory, updateCategory } = useApp();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: category?.name || '',
    icon: category?.icon || '📦',
    color: category?.color || '#64748b',
    type: category?.type || 'expense'
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      if (category) {
        await updateCategory(category.id, formData);
        showSuccess('Categoría actualizada exitosamente');
      } else {
        await addCategory(formData);
        showSuccess('Categoría creada exitosamente');
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      showError('Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const commonEmojis = ['💰', '🏠', '🍽️', '🚗', '💡', '⚕️', '📚', '🎬', '👕', '💻', '🐕', '📦', '💼', '📈', '🛍️', '🎁'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-gradient-to-br from-dark-card to-dark-hover border border-accent-primary/30 rounded-lg max-w-md w-full p-4 sm:p-6 shadow-2xl shadow-accent-primary/20 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">
            {category ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  formData.type === 'income'
                    ? 'bg-blue-400 text-white'
                    : 'bg-dark-hover text-gray-300 hover:bg-dark-border'
                }`}
              >
                Ingreso
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  formData.type === 'expense'
                    ? 'bg-blue-600 text-white'
                    : 'bg-dark-hover text-gray-300 hover:bg-dark-border'
                }`}
              >
                Egreso
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-dark-hover border rounded-lg focus:ring-2 focus:ring-accent-primary text-white placeholder-gray-500 ${
                errors.name ? 'border-red-600' : 'border-dark-border'
              }`}
              placeholder="Ej: Alimentación"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Icono
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-20 px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-center text-2xl"
                maxLength="2"
              />
              <span className="text-sm text-gray-300">o selecciona uno:</span>
            </div>
            <div className="grid grid-cols-8 gap-2">
              {commonEmojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                  className={`text-2xl p-2 rounded hover:bg-dark-border transition-colors ${
                    formData.icon === emoji ? 'bg-blue-600/50 ring-2 ring-blue-500' : 'bg-dark-hover'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Color
            </label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full h-10 px-1 py-1 bg-dark-hover border border-dark-border rounded-lg"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-dark-border rounded-lg text-gray-300 hover:bg-dark-hover transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                category ? 'Actualizar' : 'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
