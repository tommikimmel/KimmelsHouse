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

function App() {
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
    <NotificationProvider>
      <AppProvider>
        <div className="min-h-screen bg-dark-bg flex">
        {/* Overlay para cerrar sidebar en móvil - con blur */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar - responsive con efecto glassmorphism en mobile */}
        <aside className={`w-64 bg-gradient-to-b from-dark-card/95 to-dark-hover/95 backdrop-blur-md border-r border-dark-border fixed left-0 top-0 h-screen flex flex-col z-50 transition-transform duration-300 shadow-2xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-6 border-b border-dark-border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">Kimmel's House</h1>
                <p className="text-sm text-gray-400 mt-1">Finance Manager</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-accent-primary to-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-dark-hover hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Contenedor principal con margen izquierdo para el sidebar */}
        <div className="flex-1 lg:ml-64 flex flex-col w-full">
          {/* Header */}
          <header className="bg-gradient-to-r from-dark-card via-dark-hover to-dark-card text-white border-b border-dark-border">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden text-gray-400 hover:text-white"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    {menuItems.find(item => item.id === activeView)?.label || 'Dashboard'}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowTransactionForm(true)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Nueva Transacción</span>
                  </button>
                  <button
                    onClick={() => setShowTransferForm(true)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:shadow-blue-600/50 transition-all"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Transferir</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
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
    </AppProvider>
    </NotificationProvider>
  );
}

export default App;

