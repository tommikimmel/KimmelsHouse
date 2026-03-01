import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { Edit2, Trash2, ArrowUpCircle, ArrowDownCircle, ArrowRightLeft } from 'lucide-react';

const TransactionList = ({ onEdit }) => {
  const { transactions, categories, accounts, people, deleteTransaction } = useApp();
  const [filter, setFilter] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('es-AR');
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? `${category.icon} ${category.name}` : 'Sin categoría';
  };

  const getAccountName = (accountId) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? account.name : 'Sin cuenta';
  };

  const getPersonName = (personId) => {
    const person = people.find(p => p.id === personId);
    return person ? person.name : 'Sin persona';
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta transacción?')) {
      await deleteTransaction(id);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className="bg-gradient-to-br from-dark-card to-dark-hover rounded-lg p-4 sm:p-6 border border-accent-primary/30 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Transacciones</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
              filter === 'all'
                ? 'bg-accent-primary text-white'
                : 'bg-dark-hover text-gray-300 hover:bg-dark-border'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
              filter === 'income'
                ? 'bg-blue-400 text-white'
                : 'bg-dark-hover text-gray-300 hover:bg-dark-border'
            }`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
              filter === 'expense'
                ? 'bg-blue-600 text-white'
                : 'bg-dark-hover text-gray-300 hover:bg-dark-border'
            }`}
          >
            Egresos
          </button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No hay transacciones registradas</p>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-2 text-white">Tipo</th>
                <th className="text-left py-3 px-2 text-white">Fecha</th>
                <th className="text-left py-3 px-2 text-white">Categoría</th>
                <th className="text-left py-3 px-2 text-white">Cuenta</th>
                <th className="text-left py-3 px-2 text-white">Persona</th>
                <th className="text-left py-3 px-2 text-white">Descripción</th>
                <th className="text-right py-3 px-2 text-white">Monto</th>
                <th className="text-right py-3 px-2 text-white">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id} className="border-b border-dark-border hover:bg-dark-hover transition-colors">
                  <td className="py-3 px-2">
                    {transaction.type === 'income' ? (
                      <ArrowUpCircle className="w-5 h-5 text-blue-400" />
                    ) : transaction.type === 'transfer' ? (
                      <ArrowRightLeft className="w-5 h-5 text-accent-primary" />
                    ) : (
                      <ArrowDownCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </td>
                  <td className="py-3 px-2 text-gray-300">{formatDate(transaction.date)}</td>
                  <td className="py-3 px-2 text-gray-300">{getCategoryName(transaction.categoryId)}</td>
                  <td className="py-3 px-2 text-gray-300">{getAccountName(transaction.accountId)}</td>
                  <td className="py-3 px-2 text-gray-300">{getPersonName(transaction.personId)}</td>
                  <td className="py-3 px-2 text-gray-300">{transaction.description || '-'}</td>
                  <td className={`py-3 px-2 text-right font-bold ${
                    transaction.type === 'income' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => onEdit(transaction)}
                        className="text-accent-primary hover:text-accent-hover"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
