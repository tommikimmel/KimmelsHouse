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
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">💳 Mis Transacciones</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Historial completo de ingresos y gastos
          </p>
        </div>
        <div className="filters" style={{ gap: '8px' }}>
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            📋 Todas
          </button>
          <button
            className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
            onClick={() => setFilter('income')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowUpCircle size={16} /> Ingresos
          </button>
          <button
            className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
            onClick={() => setFilter('expense')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowDownCircle size={16} /> Gastos
          </button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>
            No hay transacciones para mostrar
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>
            {filter === 'all' ? 'Agrega tu primera transacción usando el botón "+" arriba' :
             filter === 'income' ? 'No hay ingresos registrados' : 'No hay gastos registrados'}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#4b5563' }}>
              Mostrando <strong>{filteredTransactions.length}</strong> {filteredTransactions.length === 1 ? 'transacción' : 'transacciones'}
              {filter !== 'all' && ` (${filter === 'income' ? 'Ingresos' : 'Gastos'})`}
            </p>
          </div>
          <div>
            <table>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>💼 Tipo</th>
                <th>📅 Fecha</th>
                <th>📁 Categoría</th>
                <th>🏦 Cuenta</th>
                <th>👤 Persona</th>
                <th>📝 Descripción</th>
                <th style={{ textAlign: 'right' }}>💰 Monto</th>
                <th style={{ textAlign: 'center' }}>⚙️ Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id} style={{ 
                  borderLeft: `4px solid ${transaction.type === 'income' ? '#28a745' : transaction.type === 'transfer' ? '#007bff' : '#dc3545'}` 
                }}>
                  <td style={{ textAlign: 'center' }}>
                    {transaction.type === 'income' ? (
                      <ArrowUpCircle size={20} style={{ color: '#28a745' }} />
                    ) : transaction.type === 'transfer' ? (
                      <ArrowRightLeft size={20} style={{ color: '#007bff' }} />
                    ) : (
                      <ArrowDownCircle size={20} style={{ color: '#dc3545' }} />
                    )}
                  </td>
                  <td style={{ fontWeight: '500' }}>{formatDate(transaction.date)}</td>
                  <td>{getCategoryName(transaction.categoryId)}</td>
                  <td>{getAccountName(transaction.accountId)}</td>
                  <td>{getPersonName(transaction.personId)}</td>
                  <td style={{ color: '#6b7280' }}>{transaction.description || '-'}</td>
                  <td style={{ 
                    textAlign: 'right', 
                    fontWeight: '700',
                    fontSize: '15px',
                    color: transaction.type === 'income' ? '#28a745' : '#dc3545'
                  }}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => onEdit(transaction)}
                        title="Editar transacción"
                        style={{ padding: '6px 12px' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleDelete(transaction.id)}
                        title="Eliminar transacción"
                        style={{ padding: '6px 12px' }}
                      >
                        <Trash2 size={16} />
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
