import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useNotification } from '../../context/NotificationContext';
import { X, Loader2 } from 'lucide-react';

const AccountForm = ({ onClose, account = null }) => {
  const { addAccount, updateAccount } = useApp();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: account?.name || '',
    description: account?.description || '',
    initialBalance: account?.initialBalance || 0
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
      if (account) {
        await updateAccount(account.id, formData);
        showSuccess('Cuenta actualizada exitosamente');
      } else {
        await addAccount(formData);
        showSuccess('Cuenta creada exitosamente');
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar cuenta:', error);
      showError('Error al guardar la cuenta');
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
            {account ? 'Editar Cuenta' : 'Nueva Cuenta'}
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
              placeholder="Ej: Cuenta Bancaria"
            />
            {errors.name && <p>{errors.name}</p>}
          </div>

          {!account && (
            <div className="form-group">
              <label>
                Balance Inicial
              </label>
              <input
                type="number"
                name="initialBalance"
                value={formData.initialBalance}
                onChange={handleChange}
                step="0.01"
                placeholder="0.00"
              />
            </div>
          )}

          <div className="form-group">
            <label>
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Descripción opcional"
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
                account ? 'Actualizar' : 'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;
