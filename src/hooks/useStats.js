import { useMemo } from 'react';
import { useApp } from './useApp';

export const useStats = () => {
  const { transactions, categories, people } = useApp();

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Gastos por categoría
    const expensesByCategory = categories
      .filter(cat => cat.type === 'expense')
      .map(category => {
        const total = transactions
          .filter(t => t.type === 'expense' && t.categoryId === category.id)
          .reduce((sum, t) => sum + t.amount, 0);
        return { ...category, total };
      })
      .filter(cat => cat.total > 0)
      .sort((a, b) => b.total - a.total);

    // Ingresos por categoría
    const incomesByCategory = categories
      .filter(cat => cat.type === 'income')
      .map(category => {
        const total = transactions
          .filter(t => t.type === 'income' && t.categoryId === category.id)
          .reduce((sum, t) => sum + t.amount, 0);
        return { ...category, total };
      })
      .filter(cat => cat.total > 0)
      .sort((a, b) => b.total - a.total);

    // Gastos por persona
    const expensesByPerson = people.map(person => {
      const total = transactions
        .filter(t => t.type === 'expense' && t.personId === person.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...person, total };
    }).filter(p => p.total > 0)
      .sort((a, b) => b.total - a.total);

    // Ingresos por persona
    const incomesByPerson = people.map(person => {
      const total = transactions
        .filter(t => t.type === 'income' && t.personId === person.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...person, total };
    }).filter(p => p.total > 0)
      .sort((a, b) => b.total - a.total);

    return {
      totalIncome,
      totalExpense,
      balance,
      expensesByCategory,
      incomesByCategory,
      expensesByPerson,
      incomesByPerson
    };
  }, [transactions, categories, people]);

  return stats;
};
