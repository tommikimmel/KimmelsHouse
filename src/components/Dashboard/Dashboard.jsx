import { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useStats } from '../../hooks/useStats';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const Dashboard = () => {
  const { accounts, transactions, loading } = useApp();
  const stats = useStats();
  const [chartType, setChartType] = useState('income'); // 'income' o 'expense'
  const [chartView, setChartView] = useState('category'); // 'category', 'person', o 'month'

  if (loading) {
    return (
      <div className="card">
        <div>Cargando...</div>
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
    if (chartView === 'category' || chartView === 'person') {
      // Para categoría y persona: solo datos del MES ACTUAL
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const filteredTransactions = transactions.filter(t => {
        if (t.type !== chartType) return false;
        const date = t.date?.toDate ? t.date.toDate() : new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      // Agrupar por categoría o persona
      const groupedData = {};
      
      filteredTransactions.forEach(transaction => {
        if (chartView === 'category') {
          const categoryId = transaction.categoryId;
          if (!groupedData[categoryId]) {
            const category = (chartType === 'income' ? stats.incomesByCategory : stats.expensesByCategory)
              .find(c => c.id === categoryId);
            if (category) {
              groupedData[categoryId] = {
                id: categoryId,
                name: category.name,
                icon: category.icon || '',
                value: 0,
                color: category.color
              };
            }
          }
          if (groupedData[categoryId]) {
            groupedData[categoryId].value += transaction.amount;
          }
        } else {
          const personId = transaction.personId;
          if (!groupedData[personId]) {
            const person = (chartType === 'income' ? stats.incomesByPerson : stats.expensesByPerson)
              .find(p => p.id === personId);
            if (person) {
              groupedData[personId] = {
                id: personId,
                name: person.name,
                value: 0,
                color: person.color || (chartType === 'income' ? '#28a745' : '#dc3545')
              };
            }
          }
          if (groupedData[personId]) {
            groupedData[personId].value += transaction.amount;
          }
        }
      });

      const dataArray = Object.values(groupedData).sort((a, b) => b.value - a.value);

      return {
        type: 'pie',
        data: dataArray,
        keys: null
      };
    } else {
      // Vista por mes (todos los meses del año actual)
      const filteredTransactions = transactions.filter(t => t.type === chartType);
      const monthlyData = {};
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Inicializar estructura de meses (12 meses del año actual)
      for (let i = 0; i < 12; i++) {
        const date = new Date(currentYear, i, 1);
        const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleString('es-AR', { month: 'short' });
        monthlyData[monthKey] = { name: monthName, monthKey: monthKey, total: 0 };
      }

      filteredTransactions.forEach(transaction => {
        const date = transaction.date?.toDate ? transaction.date.toDate() : new Date(transaction.date);
        if (date.getFullYear() === currentYear) {
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (monthlyData[monthKey]) {
            monthlyData[monthKey].total = (monthlyData[monthKey].total || 0) + transaction.amount;
          }
        }
      });

      return {
        type: 'bar',
        data: Object.values(monthlyData),
        keys: [{ name: 'total', color: chartType === 'income' ? '#28a745' : '#dc3545' }]
      };
    }
  };

  const chartDataObj = getChartData();
  const chartData = chartDataObj.data;
  const chartKeys = chartDataObj.keys;
  const chartDisplayType = chartDataObj.type;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '12px', 
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          maxWidth: '250px'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>
            {payload[0].name || label}
          </p>
          {chartDisplayType === 'pie' ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                {formatCurrency(payload[0].value)}
              </span>
            </div>
          ) : (
            payload.map((entry, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: entry.color, borderRadius: '2px' }}></div>
                  <span style={{ fontSize: '13px', color: '#4b5563' }}>{entry.name === 'total' ? 'Total' : entry.name}:</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginLeft: '12px' }}>
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))
          )}
        </div>
      );
    }
    return null;
  };

  // Obtener el nombre del mes actual
  const getCurrentMonthName = () => {
    const now = new Date();
    return now.toLocaleString('es-AR', { month: 'long', year: 'numeric' });
  };

  return (
    <div>
      {/* Título Principal */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Panel de Control Financiero</h1>
        </div>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
          Resumen completo de tus finanzas, cuentas y transacciones
        </p>
      </div>

      {/* Resumen de Balance */}
      <div className="card">
        <h2 className="card-title" style={{ marginBottom: '16px' }}>📊 Resumen Financiero</h2>
        <div className="grid grid-3">
          <div className="stat-card">
            <div>
              <div>
                <p className="stat-label">💰 Ingresos Totales</p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 8px 0' }}>
                  Todo el dinero que has recibido
                </p>
                <p className="stat-value success">
                  {formatCurrency(stats.totalIncome)}
                </p>
              </div>
              <div>
                <TrendingUp size={32} style={{ color: '#28a745' }} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div>
                <p className="stat-label">💸 Gastos Totales</p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 8px 0' }}>
                  Todo el dinero que has gastado
                </p>
                <p className="stat-value danger">
                  {formatCurrency(stats.totalExpense)}
                </p>
              </div>
              <div>
                <TrendingDown size={32} style={{ color: '#dc3545' }} />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div>
              <div>
                <p className="stat-label">🏦 Balance Final</p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 8px 0' }}>
                  Diferencia (Ingresos - Gastos)
                </p>
                <p className={`stat-value ${stats.balance >= 0 ? 'success' : 'danger'}`}>
                  {formatCurrency(stats.balance)}
                </p>
              </div>
              <div>
                <DollarSign size={32} style={{ color: stats.balance >= 0 ? '#28a745' : '#dc3545' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cuentas */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <DollarSign />
            Mis Cuentas Bancarias
          </h2>
        </div>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
          Saldo actual en cada una de tus cuentas
        </p>
        {accounts.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ color: '#6b7280' }}>No hay cuentas registradas</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
              Agrega una cuenta desde el menú "Cuentas" para empezar
            </p>
          </div>
        ) : (
          <div className="grid grid-2">
            {accounts.map(account => (
              <div key={account.id} className="stat-card">
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>🏦</span>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{account.name}</h3>
                  </div>
                  {account.description && (
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0' }}>
                      {account.description}
                    </p>
                  )}
                </div>
                <p className={`stat-value ${account.balance >= 0 ? 'success' : 'danger'}`}>
                  {formatCurrency(account.balance || 0)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gráfico Interactivo */}
      <div className="card">
        {/* Controles del gráfico */}
        <div className="card-header">
          <h2 className="card-title">
            {chartDisplayType === 'pie' ? <PieChartIcon /> : <BarChart3 />}
            Gráfico de Análisis
          </h2>
        </div>
        
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
          {chartDisplayType === 'pie' 
            ? `Visualiza tus ${chartType === 'income' ? 'ingresos' : 'gastos'} del mes actual. Selecciona qué quieres ver:`
            : `Visualiza la evolución de tus finanzas durante todo el año ${new Date().getFullYear()}:`}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* Selector de Tipo */}
          <div className="form-group">
            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              ¿Qué tipo de transacción quieres analizar?
            </label>
            <div className="filters">
              <button
                className={`filter-btn ${chartType === 'income' ? 'active' : ''}`}
                onClick={() => setChartType('income')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <TrendingUp size={16} />
                Ingresos (Dinero que recibí)
              </button>
              <button
                className={`filter-btn ${chartType === 'expense' ? 'active' : ''}`}
                onClick={() => setChartType('expense')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <TrendingDown size={16} />
                Gastos (Dinero que gasté)
              </button>
            </div>
          </div>

          {/* Selector de Vista */}
          <div className="form-group">
            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
              ¿Cómo quieres ver el análisis?
            </label>
            <div className="filters">
              <button
                className={`filter-btn ${chartView === 'category' ? 'active' : ''}`}
                onClick={() => setChartView('category')}
              >
                📁 Por Categoría
                <span style={{ fontSize: '11px', display: 'block', marginTop: '4px', opacity: 0.8 }}>
                  Distribución del mes actual
                </span>
              </button>
              <button
                className={`filter-btn ${chartView === 'person' ? 'active' : ''}`}
                onClick={() => setChartView('person')}
              >
                👤 Por Persona
                <span style={{ fontSize: '11px', display: 'block', marginTop: '4px', opacity: 0.8 }}>
                  Distribución del mes actual
                </span>
              </button>
              <button
                className={`filter-btn ${chartView === 'month' ? 'active' : ''}`}
                onClick={() => setChartView('month')}
              >
                📅 Evolución Mensual
                <span style={{ fontSize: '11px', display: 'block', marginTop: '4px', opacity: 0.8 }}>
                  Todo el año {new Date().getFullYear()}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Título del gráfico actual */}
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#f9fafb', 
          borderRadius: '8px', 
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontWeight: '600', color: '#1f2937' }}>
            {chartDisplayType === 'pie' ? (
              <>
                {chartType === 'income' ? '📈 Ingresos' : '📉 Gastos'} - {
                  chartView === 'category' ? 'Por Categoría' : 'Por Persona'
                }
              </>
            ) : (
              <>
                {chartType === 'income' ? '📈 Ingresos' : '📉 Gastos'} - Evolución Mensual
              </>
            )}
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
            {chartDisplayType === 'pie' ? getCurrentMonthName() : `Año ${new Date().getFullYear()}`}
          </p>
        </div>

        {/* Gráfico */}
        {chartData.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px' }}>
              No hay datos para mostrar
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>
              {chartDisplayType === 'pie' 
                ? `No hay ${chartType === 'income' ? 'ingresos' : 'gastos'} registrados en ${getCurrentMonthName()}`
                : 'Agrega transacciones desde el menú "Transacciones" para ver el gráfico'}
            </p>
          </div>
        ) : chartDisplayType === 'pie' ? (
          <div className="chart-layout">
            {/* Gráfico de torta */}
            <ResponsiveContainer width="100%" height={400}>
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                  outerRadius={140}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>

            {/* Lista de categorías/personas */}
            <div className="chart-sidebar">
              <h3>
                {chartView === 'category' ? '📁 Categorías' : '👤 Personas'}
              </h3>
              {chartData.map((item, index) => {
                const total = chartData.reduce((sum, d) => sum + d.value, 0);
                const percentage = ((item.value / total) * 100).toFixed(1);
                return (
                  <div 
                    key={item.id || index} 
                    className="chart-item"
                    style={{ borderLeft: `4px solid ${item.color}` }}
                  >
                    <div className="chart-item-header">
                      <span className="chart-item-name">
                        {item.icon && `${item.icon} `}{item.name}
                      </span>
                      <span className="chart-item-percentage">
                        {percentage}%
                      </span>
                    </div>
                    <div className="chart-item-value" style={{ color: item.color }}>
                      {formatCurrency(item.value)}
                    </div>
                  </div>
                );
              })}
              <div className="chart-total">
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                  Total:
                </span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: chartType === 'income' ? '#28a745' : '#dc3545' }}>
                  {formatCurrency(chartData.reduce((sum, d) => sum + d.value, 0))}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '11px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="rect"
              />
              {chartKeys.map((key, index) => (
                <Bar 
                  key={key.name} 
                  dataKey={key.name} 
                  fill={key.color} 
                  radius={[4, 4, 0, 0]}
                  name={key.name === 'total' ? 'Total' : key.name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
