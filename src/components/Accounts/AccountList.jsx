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
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">🏦 Mis Cuentas Bancarias</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            Administra tus cuentas y saldos • {accounts.length} {accounts.length === 1 ? 'cuenta' : 'cuentas'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary"
            onClick={handleRecalculate}
            disabled={recalculating}
            title="Recalcular todos los balances"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={16} className={recalculating ? 'spinning' : ''} />
            <span>Recalcular</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Nueva Cuenta</span>
          </button>
        </div>
      </div>

      {accounts.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏦</div>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>
            No hay cuentas registradas
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>
            Agrega tu primera cuenta para comenzar a gestionar tus finanzas
          </p>
        </div>
      ) : (
        <div className="grid grid-2">
          {accounts.map(account => (
            <div key={account.id} className="stat-card" style={{ 
              position: 'relative',
              borderLeft: `4px solid ${account.balance >= 0 ? '#28a745' : '#dc3545'}`
            }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px' }}>💳</span>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>{account.name}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(account)}
                      title="Editar cuenta"
                      style={{ padding: '6px', minWidth: 'auto' }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleDelete(account.id)}
                      title="Eliminar cuenta"
                      style={{ padding: '6px', minWidth: 'auto' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {account.description && (
                  <p style={{ margin: '0 0 0 32px', fontSize: '13px', color: '#6b7280' }}>
                    {account.description}
                  </p>
                )}
              </div>
              <div style={{ 
                padding: '16px', 
                backgroundColor: account.balance >= 0 ? '#f0fdf4' : '#fef2f2',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 4px 0' }}>Saldo actual</p>
                <p className={`stat-value ${account.balance >= 0 ? 'success' : 'danger'}`} style={{ margin: 0 }}>
                  {formatCurrency(account.balance)}
                </p>
              </div>
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
