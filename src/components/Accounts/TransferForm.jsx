import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useNotification } from '../../context/NotificationContext';
import { X, Loader2 } from 'lucide-react';

const TransferForm = ({ onClose }) => {
  const { accounts, addTransfer } = useApp();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fromAccountId) newErrors.fromAccountId = 'Seleccione la cuenta de origen';
    if (!formData.toAccountId) newErrors.toAccountId = 'Seleccione la cuenta de destino';
    if (formData.fromAccountId === formData.toAccountId) {
      newErrors.toAccountId = 'Las cuentas deben ser diferentes';
    }
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Ingrese un monto válido';
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
      await addTransfer(
        formData.fromAccountId,
        formData.toAccountId,
        parseFloat(formData.amount),
        formData.description
      );
      showSuccess('Transferencia realizada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al realizar transferencia:', error);
      showError('Error al realizar la transferencia');
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
          <h2 className="modal-title">Transferencia entre Cuentas</h2>
          <button className="btn btn-secondary" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>
              Cuenta de Origen *
            </label>
            <select
              name="fromAccountId"
              value={formData.fromAccountId}
              onChange={handleChange}
            >
              <option value="">Seleccione una cuenta</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {errors.fromAccountId && <p>{errors.fromAccountId}</p>}
          </div>

          <div className="form-group">
            <label>
              Cuenta de Destino *
            </label>
            <select
              name="toAccountId"
              value={formData.toAccountId}
              onChange={handleChange}
            >
              <option value="">Seleccione una cuenta</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {errors.toAccountId && <p>{errors.toAccountId}</p>}
          </div>

          <div className="form-group">
            <label>
              Monto *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              placeholder="0.00"
            />
            {errors.amount && <p>{errors.amount}</p>}
          </div>

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
                'Transferir'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferForm;
