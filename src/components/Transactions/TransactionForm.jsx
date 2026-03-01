import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useNotification } from '../../context/NotificationContext';
import { X, Loader2 } from 'lucide-react';

// Función auxiliar para formatear fecha a YYYY-MM-DD en hora local
const formatDateForInput = (date) => {
  if (!date) return new Date().toLocaleDateString('en-CA'); // en-CA da formato YYYY-MM-DD
  
  const d = date.toDate ? date.toDate() : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
    date: formatDateForInput(transaction?.date)
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
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {transaction ? 'Editar Transacción' : 'Nueva Transacción'}
          </h2>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Tipo de transacción */}
          <div className="form-group">
            <label>
              Tipo de Transacción
            </label>
            <div className="filters">
              <button
                className={`filter-btn ${formData.type === 'income' ? 'active' : ''}`}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'income', categoryId: '' }))}
                disabled={loading}
              >
                💰 Ingreso
              </button>
              <button
                className={`filter-btn ${formData.type === 'expense' ? 'active' : ''}`}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense', categoryId: '' }))}
                disabled={loading}
              >
                💸 Egreso
              </button>
            </div>
          </div>

          {/* Grid de 2 columnas para los campos principales */}
          <div className="grid grid-2">
            {/* Monto */}
            <div className="form-group">
              <label>
                Monto *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                disabled={loading}
                step="0.01"
                placeholder="$ 0.00"
              />
              {errors.amount && <p>{errors.amount}</p>}
            </div>

            {/* Fecha */}
            <div className="form-group">
              <label>
                Fecha *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Categoría */}
            <div className="form-group">
              <label>
                Categoría *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Seleccione una categoría</option>
                {filteredCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p>{errors.categoryId}</p>}
            </div>

            {/* Cuenta */}
            <div className="form-group">
              <label>
                Cuenta *
              </label>
              <select
                name="accountId"
                value={formData.accountId}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Seleccione una cuenta</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    💳 {account.name}
                  </option>
                ))}
              </select>
              {errors.accountId && <p>{errors.accountId}</p>}
            </div>

            {/* Persona - ocupa ambas columnas */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>
                Persona *
              </label>
              <select
                name="personId"
                value={formData.personId}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Seleccione una persona</option>
                {people.map(person => (
                  <option key={person.id} value={person.id}>
                    👤 {person.name}
                  </option>
                ))}
              </select>
              {errors.personId && <p>{errors.personId}</p>}
            </div>
          </div>

          {/* Descripción - ancho completo */}
          <div className="form-group">
            <label>
              Descripción (opcional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows="2"
              placeholder="Añade una nota o descripción..."
            />
          </div>

          {/* Botones */}
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
