import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import Dashboard from './components/Dashboard/Dashboard';
import TransactionForm from './components/Transactions/TransactionForm';
import TransactionList from './components/Transactions/TransactionList';
import AccountList from './components/Accounts/AccountList';
import TransferForm from './components/Accounts/TransferForm';
import CategoryList from './components/Categories/CategoryList';
import PersonList from './components/People/PersonList';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Wallet, 
  Tags, 
  Users, 
  Plus,
  List,
  Menu,
  X
} from 'lucide-react';

function AppContent() {
  const [activeView, setActiveView] = useState('dashboard');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleCloseTransactionForm = () => {
    setShowTransactionForm(false);
    setSelectedTransaction(null);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transacciones', icon: List },
    { id: 'accounts', label: 'Cuentas', icon: Wallet },
    { id: 'categories', label: 'Categorías', icon: Tags },
    { id: 'people', label: 'Personas', icon: Users },
  ];

  return (
        <div className="app-container">
        {/* Overlay para cerrar sidebar en móvil */}
        {sidebarOpen && (
          <div 
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div>
              <h1 className="sidebar-title">Kimmel's House</h1>
              <p className="sidebar-subtitle">Gestión Financiera</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="btn-icon"
            >
              <X />
            </button>
          </div>
          
          <nav className="sidebar-nav">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`nav-button ${activeView === item.id ? 'active' : ''}`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Contenedor principal */}
        <div className="main-content">
          {/* Header */}
          <header className="header">
            <div className="header-content">
              <div className="header-left">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="btn-icon menu-btn"
                >
                  <Menu />
                </button>
                <h2 className="header-title">
                  {menuItems.find(item => item.id === activeView)?.label || 'Dashboard'}
                </h2>
              </div>
              <div className="header-actions">
                <button
                  onClick={() => setShowTransactionForm(true)}
                  className="btn btn-success"
                >
                  <Plus />
                  <span>Nueva Transacción</span>
                </button>
                <button
                  onClick={() => setShowTransferForm(true)}
                  className="btn btn-primary"
                >
                  <ArrowRightLeft />
                  <span>Transferir</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="content">
            {activeView === 'dashboard' && <Dashboard />}
            {activeView === 'transactions' && (
              <TransactionList onEdit={handleEditTransaction} />
            )}
            {activeView === 'accounts' && <AccountList />}
            {activeView === 'categories' && <CategoryList />}
            {activeView === 'people' && <PersonList />}
          </main>
        </div>

        {/* Modales */}
        {showTransactionForm && (
          <TransactionForm
            transaction={selectedTransaction}
            onClose={handleCloseTransactionForm}
          />
        )}
        {showTransferForm && (
          <TransferForm onClose={() => setShowTransferForm(false)} />
        )}
      </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </NotificationProvider>
  );
}

export default App;

