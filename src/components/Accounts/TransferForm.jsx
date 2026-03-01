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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-gradient-to-br from-dark-card to-dark-hover border border-blue-500/30 rounded-lg max-w-md w-full p-4 sm:p-6 shadow-2xl shadow-blue-500/20 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Transferencia entre Cuentas</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Cuenta de Origen *
            </label>
            <select
              name="fromAccountId"
              value={formData.fromAccountId}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-dark-hover border rounded-lg focus:ring-2 focus:ring-accent-primary text-white ${
                errors.fromAccountId ? 'border-red-600' : 'border-dark-border'
              }`}
            >
              <option value="" className="bg-white text-gray-900">Seleccione una cuenta</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id} className="bg-white text-gray-900">
                  {account.name}
                </option>
              ))}
            </select>
            {errors.fromAccountId && <p className="text-red-600 text-sm mt-1">{errors.fromAccountId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Cuenta de Destino *
            </label>
            <select
              name="toAccountId"
              value={formData.toAccountId}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-dark-hover border rounded-lg focus:ring-2 focus:ring-accent-primary text-white ${
                errors.toAccountId ? 'border-red-600' : 'border-dark-border'
              }`}
            >
              <option value="" className="bg-white text-gray-900">Seleccione una cuenta</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id} className="bg-white text-gray-900">
                  {account.name}
                </option>
              ))}
            </select>
            {errors.toAccountId && <p className="text-red-600 text-sm mt-1">{errors.toAccountId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Monto *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              className={`w-full px-3 py-2 bg-dark-hover border rounded-lg focus:ring-2 focus:ring-accent-primary text-white placeholder-gray-500 ${
                errors.amount ? 'border-red-600' : 'border-dark-border'
              }`}
              placeholder="0.00"
            />
            {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg focus:ring-2 focus:ring-accent-primary text-white placeholder-gray-500"
              placeholder="Descripción opcional"
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
