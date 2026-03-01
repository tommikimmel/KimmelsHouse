import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { Edit2, Trash2, Plus, RefreshCw } from 'lucide-react';
import AccountForm from './AccountForm';

const AccountList = () => {
  const { accounts, deleteAccount, recalculateAllBalances } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [recalculating, setRecalculating] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount || 0);
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta cuenta?')) {
      await deleteAccount(id);
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setSelectedAccount(null);
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      await recalculateAllBalances();
      alert('Balances recalculados correctamente');
    } catch (err) {
      console.error('Error al recalcular:', err);
      alert('Error al recalcular balances');
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-dark-card to-dark-hover rounded-lg shadow-xl p-4 sm:p-6 border border-accent-primary/30">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Cuentas</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleRecalculate}
            disabled={recalculating}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            title="Recalcular todos los balances"
          >
            <RefreshCw className={`w-5 h-5 ${recalculating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Recalcular</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors text-sm sm:text-base"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Nueva Cuenta</span>
            <span className="sm:hidden">Nueva</span>
          </button>
        </div>
      </div>

      {accounts.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No hay cuentas registradas</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(account => (
            <div key={account.id} className="bg-dark-hover border border-dark-border rounded-lg p-4 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg text-white">{account.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(account)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-2xl font-bold text-accent-primary mb-2">
                {formatCurrency(account.balance)}
              </p>
              {account.description && (
                <p className="text-sm text-gray-400">{account.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AccountForm
          account={selectedAccount}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default AccountList;
