import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useStats } from '../../hooks/useStats';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const { accounts, transactions, loading } = useApp();
  const stats = useStats();
  const [chartType, setChartType] = useState('income'); // 'income' o 'expense'
  const [chartView, setChartView] = useState('category'); // 'category', 'person', o 'month'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  // Preparar datos para el gráfico según tipo y vista
  const getChartData = () => {
    if (chartView === 'category') {
      const data = chartType === 'income' ? stats.incomesByCategory : stats.expensesByCategory;
      return data.map(cat => ({
        name: cat.name,
        value: cat.total,
        color: cat.color
      }));
    } else if (chartView === 'person') {
      const data = chartType === 'income' ? stats.incomesByPerson : stats.expensesByPerson;
      return data.map(person => ({
        name: person.name,
        value: person.total,
        color: chartType === 'income' ? '#60a5fa' : '#3b82f6'
      }));
    } else if (chartView === 'month') {
      // Agrupar por mes
      const monthlyData = {};
      const filteredTransactions = transactions.filter(t => t.type === chartType);
      
      filteredTransactions.forEach(transaction => {
        const date = transaction.date?.toDate ? transaction.date.toDate() : new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleString('es-AR', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { name: monthName, value: 0, date: date };
        }
        monthlyData[monthKey].value += transaction.amount;
      });

      // Ordenar por fecha y tomar los últimos 6 meses
      return Object.values(monthlyData)
        .sort((a, b) => a.date - b.date)
        .slice(-6)
        .map(item => ({
          name: item.name,
          value: item.value,
          color: chartType === 'income' ? '#60a5fa' : '#3b82f6'
        }));
    }
    return [];
  };

  const chartData = getChartData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-accent-primary/50 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold">{payload[0].name}</p>
          <p className={`font-bold ${chartType === 'income' ? 'text-blue-400' : 'text-blue-600'}`}>
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Resumen de Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-l-4 border-blue-400 rounded-lg p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Ingresos Totales</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-400 mt-1">
                {formatCurrency(stats.totalIncome)}
              </p>
            </div>
            <div className="bg-blue-500/20 p-2 sm:p-3 rounded-full">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-700/10 to-blue-800/10 border-l-4 border-blue-600 rounded-lg p-4 sm:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Gastos Totales</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                {formatCurrency(stats.totalExpense)}
              </p>
            </div>
            <div className="bg-blue-600/20 p-2 sm:p-3 rounded-full">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br ${stats.balance >= 0 ? 'from-blue-500/10 to-blue-600/10 border-accent-primary' : 'from-orange-500/10 to-red-500/10 border-orange-500'} border-l-4 rounded-lg p-4 sm:p-6 shadow-lg sm:col-span-2 lg:col-span-1`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Balance</p>
              <p className={`text-xl sm:text-2xl font-bold mt-1 ${stats.balance >= 0 ? 'text-accent-primary' : 'text-orange-500'}`}>
                {formatCurrency(stats.balance)}
              </p>
            </div>
            <div className={`${stats.balance >= 0 ? 'bg-accent-primary/20' : 'bg-orange-500/20'} p-2 sm:p-3 rounded-full`}>
              <DollarSign className={`w-5 h-5 sm:w-6 sm:h-6 ${stats.balance >= 0 ? 'text-accent-primary' : 'text-orange-500'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Cuentas */}
      <div className="bg-gradient-to-br from-dark-card to-dark-hover rounded-lg p-4 sm:p-6 border border-dark-border shadow-xl">
        <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2 text-white">
          <DollarSign className="w-5 h-5 text-accent-primary" />
          Cuentas
        </h2>
        {accounts.length === 0 ? (
          <p className="text-gray-400">No hay cuentas registradas</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map(account => (
              <div key={account.id} className="bg-dark-hover border border-accent-primary/20 rounded-lg p-4 hover:border-accent-primary/50 transition-colors">
                <h3 className="font-semibold text-white">{account.name}</h3>
                <p className={`text-xl sm:text-2xl font-bold mt-2 ${(account.balance || 0) >= 0 ? 'text-blue-400' : 'text-blue-600'}`}>
                  {formatCurrency(account.balance || 0)}
                </p>
                {account.description && (
                  <p className="text-sm text-gray-400 mt-1">{account.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gráfico Interactivo */}
      <div className="bg-gradient-to-br from-dark-card to-dark-hover rounded-lg p-4 sm:p-6 border border-accent-primary/30 shadow-xl">
        {/* Controles del gráfico */}
        <div className="mb-6 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            {chartView === 'month' ? <BarChart3 className="w-5 h-5 text-accent-primary" /> : <PieChart className="w-5 h-5 text-accent-primary" />}
            Análisis Financiero
          </h2>
          
          {/* Selector de Tipo */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Tipo de transacción</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setChartType('income')}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                  chartType === 'income'
                    ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-400/50'
                    : 'bg-dark-hover text-gray-300 hover:bg-dark-border border border-dark-border'
                }`}
              >
                Ingresos
              </button>
              <button
                onClick={() => setChartType('expense')}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                  chartType === 'expense'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/50'
                    : 'bg-dark-hover text-gray-300 hover:bg-dark-border border border-dark-border'
                }`}
              >
                Egresos
              </button>
            </div>
          </div>

          {/* Selector de Vista */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Vista</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setChartView('category')}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                  chartView === 'category'
                    ? 'bg-gradient-to-r from-accent-primary to-blue-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-dark-hover text-gray-300 hover:bg-dark-border border border-dark-border'
                }`}
              >
                Por Categoría
              </button>
              <button
                onClick={() => setChartView('person')}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                  chartView === 'person'
                    ? 'bg-gradient-to-r from-accent-primary to-blue-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-dark-hover text-gray-300 hover:bg-dark-border border border-dark-border'
                }`}
              >
                Por Persona
              </button>
              <button
                onClick={() => setChartView('month')}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                  chartView === 'month'
                    ? 'bg-gradient-to-r from-accent-primary to-blue-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-dark-hover text-gray-300 hover:bg-dark-border border border-dark-border'
                }`}
              >
                Por Mes
              </button>
            </div>
          </div>
        </div>

        {/* Gráfico */}
        {chartData.length === 0 ? (
          <p className="text-gray-400 text-center py-12">No hay datos para mostrar</p>
        ) : (
          <ResponsiveContainer width="100%" height={300} className="sm:!h-[400px]">
            {chartView === 'month' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill={chartType === 'income' ? '#60a5fa' : '#3b82f6'} radius={[8, 8, 0, 0]} />
              </BarChart>
            ) : (
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
