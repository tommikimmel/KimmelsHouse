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
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {category ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <button className="btn btn-secondary" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>
              Tipo
            </label>
            <div className="filters">
              <button
                className={`filter-btn ${formData.type === 'income' ? 'active' : ''}`}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
              >
                Ingreso
              </button>
              <button
                className={`filter-btn ${formData.type === 'expense' ? 'active' : ''}`}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
              >
                Egreso
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Alimentación"
            />
            {errors.name && <p>{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>
              Icono
            </label>
            <div>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                maxLength="2"
              />
              <span>o selecciona uno:</span>
            </div>
            <div>
              {commonEmojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>
              Color
            </label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Loader2 />
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
