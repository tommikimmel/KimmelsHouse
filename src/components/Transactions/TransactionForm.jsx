import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useNotification } from '../../context/NotificationContext';
import { X, Loader2 } from 'lucide-react';

const TransactionForm = ({ onClose, transaction = null }) => {
  const { addTransaction, updateTransaction, categories, accounts, people } = useApp();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: transaction?.type || 'expense',
    amount: transaction?.amount || '',
    categoryId: transaction?.categoryId || '',
    accountId: transaction?.accountId || '',
    personId: transaction?.personId || '',
    description: transaction?.description || '',
    date: transaction?.date?.toDate ? transaction.date.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Ingrese un monto válido';
    if (!formData.categoryId) newErrors.categoryId = 'Seleccione una categoría';
    if (!formData.accountId) newErrors.accountId = 'Seleccione una cuenta';
    if (!formData.personId) newErrors.personId = 'Seleccione una persona';
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
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (transaction) {
        await updateTransaction(transaction.id, transactionData);
        showSuccess('Transacción actualizada exitosamente');
      } else {
        await addTransaction(transactionData);
        showSuccess('Transacción creada exitosamente');
      }
      
      onClose();
    } catch (error) {
      console.error('Error al guardar transacción:', error);
      showError('Error al guardar la transacción');
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

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-gradient-to-br from-dark-card to-dark-hover rounded-lg max-w-2xl w-full p-4 sm:p-6 border border-accent-primary/30 shadow-2xl shadow-accent-primary/20 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {transaction ? 'Editar Transacción' : 'Nueva Transacción'}
          </h2>
          <button onClick={onClose} disabled={loading} className="text-gray-400 hover:text-white transition-colors disabled:opacity-50">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tipo de transacción */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Transacción
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'income', categoryId: '' }))}
                disabled={loading}
                className={`py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  formData.type === 'income'
                    ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg'
                    : 'bg-dark-hover text-gray-300 hover:text-white border border-dark-border'
                }`}
              >
                💰 Ingreso
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense', categoryId: '' }))}
                disabled={loading}
                className={`py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                  formData.type === 'expense'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-dark-hover text-gray-300 hover:text-white border border-dark-border'
                }`}
              >
                💸 Egreso
              </button>
            </div>
          </div>

          {/* Grid de 2 columnas para los campos principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monto */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Monto *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                disabled={loading}
                step="0.01"
                className={`w-full px-3 py-2 bg-dark-hover border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-primary focus:border-transparent disabled:opacity-50 ${
                  errors.amount ? 'border-red-600' : 'border-dark-border'
                }`}
                placeholder="$ 0.00"
              />
              {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount}</p>}
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-white focus:ring-2 focus:ring-accent-primary focus:border-transparent disabled:opacity-50"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Categoría *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-2 bg-dark-hover border rounded-lg text-white focus:ring-2 focus:ring-accent-primary focus:border-transparent disabled:opacity-50 ${
                  errors.categoryId ? 'border-red-600' : 'border-dark-border'
                }`}
              >
                <option value="" className="bg-white text-gray-900">Seleccione una categoría</option>
                {filteredCategories.map(category => (
                  <option key={category.id} value={category.id} className="bg-white text-gray-900">
                    {category.name} ({category.icon})
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-400 text-sm mt-1">{errors.categoryId}</p>}
            </div>

            {/* Cuenta */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Cuenta *
              </label>
              <select
                name="accountId"
                value={formData.accountId}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-2 bg-dark-hover border rounded-lg text-white focus:ring-2 focus:ring-accent-primary focus:border-transparent disabled:opacity-50 ${
                  errors.accountId ? 'border-red-600' : 'border-dark-border'
                }`}
              >
                <option value="" className="bg-white text-gray-900">Seleccione una cuenta</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id} className="bg-white text-gray-900">
                    💳 {account.name}
                  </option>
                ))}
              </select>
              {errors.accountId && <p className="text-purple-400 text-sm mt-1">{errors.accountId}</p>}
            </div>

            {/* Persona - ocupa ambas columnas */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Persona *
              </label>
              <select
                name="personId"
                value={formData.personId}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-2 bg-dark-hover border rounded-lg text-white focus:ring-2 focus:ring-accent-primary focus:border-transparent disabled:opacity-50 ${
                  errors.personId ? 'border-red-600' : 'border-dark-border'
                }`}
              >
                <option value="" className="bg-white text-gray-900">Seleccione una persona</option>
                {people.map(person => (
                  <option key={person.id} value={person.id} className="bg-white text-gray-900">
                    👤 {person.name}
                  </option>
                ))}
              </select>
              {errors.personId && <p className="text-purple-400 text-sm mt-1">{errors.personId}</p>}
            </div>
          </div>

          {/* Descripción - ancho completo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows="2"
              className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-accent-primary focus:border-transparent disabled:opacity-50"
              placeholder="Añade una nota o descripción..."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-dark-border rounded-lg text-gray-300 hover:bg-dark-hover hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-3 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg ${
                formData.type === 'income'
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500 hover:shadow-blue-400/50'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-blue-600/50'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                transaction ? '✓ Actualizar' : '+ Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
