// Categorías predefinidas para egresos
export const DEFAULT_EXPENSE_CATEGORIES = [
  { id: 'alimentacion', name: 'Alimentación', icon: '🍽️', color: '#f87171' },
  { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#fb923c' },
  { id: 'servicios', name: 'Servicios', icon: '💡', color: '#60a5fa' },
  { id: 'salud', name: 'Salud', icon: '⚕️', color: '#34d399' },
  { id: 'educacion', name: 'Educación', icon: '📚', color: '#a78bfa' },
  { id: 'entretenimiento', name: 'Entretenimiento', icon: '🎬', color: '#f472b6' },
  { id: 'vivienda', name: 'Vivienda', icon: '🏠', color: '#818cf8' },
  { id: 'ropa', name: 'Ropa', icon: '👕', color: '#2dd4bf' },
  { id: 'tecnologia', name: 'Tecnología', icon: '💻', color: '#38bdf8' },
  { id: 'mascotas', name: 'Mascotas', icon: '🐕', color: '#fb7185' },
  { id: 'otros_gastos', name: 'Otros Gastos', icon: '📦', color: '#94a3b8' },
];

// Categorías predefinidas para ingresos
export const DEFAULT_INCOME_CATEGORIES = [
  { id: 'salario', name: 'Salario', icon: '💼', color: '#34d399' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#60a5fa' },
  { id: 'inversiones', name: 'Inversiones', icon: '📈', color: '#a78bfa' },
  { id: 'ventas', name: 'Ventas', icon: '🛍️', color: '#38bdf8' },
  { id: 'alquiler', name: 'Alquiler', icon: '🏠', color: '#fb923c' },
  { id: 'bonificacion', name: 'Bonificación', icon: '🎁', color: '#f472b6' },
  { id: 'otros_ingresos', name: 'Otros Ingresos', icon: '💰', color: '#2dd4bf' },
];

// Personas predefinidas de la casa Kimmel
export const DEFAULT_PEOPLE = [
  { id: 'tomas', name: 'Tomas Kimmel', email: '', phone: '' },
  { id: 'lucia', name: 'Lucia Kimmel', email: '', phone: '' },
  { id: 'gustavo', name: 'Gustavo Kimmel', email: '', phone: '' },
  { id: 'natalia', name: 'Natalia Battaglia', email: '', phone: '' },
];

// Tipos de transacciones
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer'
};
