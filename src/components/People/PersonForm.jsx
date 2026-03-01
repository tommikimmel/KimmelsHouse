import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useNotification } from '../../context/NotificationContext';
import { X, Loader2 } from 'lucide-react';

const PersonForm = ({ onClose, person = null }) => {
  const { addPerson, updatePerson } = useApp();
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    name: person?.name || '',
    email: person?.email || '',
    phone: person?.phone || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      if (person) {
        await updatePerson(person.id, formData);
        showSuccess('Persona actualizada correctamente');
      } else {
        await addPerson(formData);
        showSuccess('Persona creada correctamente');
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar persona:', error);
      showError('Error al guardar la persona. Intenta nuevamente.');
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

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {person ? 'Editar Persona' : 'Nueva Persona'}
          </h2>
          <button className="btn btn-secondary" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
            />
            {errors.name && <p>{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@email.com"
            />
          </div>

          <div className="form-group">
            <label>
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+54 9 11 1234-5678"
            />
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 />
                  Guardando...
                </>
              ) : (
                person ? 'Actualizar' : 'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonForm;
