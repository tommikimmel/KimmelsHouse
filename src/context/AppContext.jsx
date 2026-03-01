import { createContext, useState, useEffect, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs,
  getDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, DEFAULT_PEOPLE } from '../utils/constants';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Refs para evitar inicialización múltiple
  const categoriesInitialized = useRef(false);
  const peopleInitialized = useRef(false);

  // Inicializar categorías predefinidas
  useEffect(() => {
    const initializeCategories = async () => {
      if (categoriesInitialized.current) return;
      categoriesInitialized.current = true;
      
      try {
        const categoriesQuery = query(collection(db, 'categories'));
        const snapshot = await getDocs(categoriesQuery);
        
        // Obtener las categorías existentes
        const existingCategories = snapshot.docs.map(doc => doc.data());
        const existingIds = new Set(existingCategories.map(cat => cat.id));
        
        // Crear todas las categorías predefinidas
        const allCategories = [
          ...DEFAULT_EXPENSE_CATEGORIES.map(cat => ({ ...cat, type: 'expense' })),
          ...DEFAULT_INCOME_CATEGORIES.map(cat => ({ ...cat, type: 'income' }))
        ];
        
        // Filtrar solo las que no existen
        const missingCategories = allCategories.filter(cat => !existingIds.has(cat.id));
        
        if (missingCategories.length > 0) {
          console.log('Creando categorías faltantes:', missingCategories.length);
          
          for (const category of missingCategories) {
            await addDoc(collection(db, 'categories'), {
              ...category,
              createdAt: Timestamp.now()
            });
          }
          
          console.log('Categorías creadas exitosamente');
        } else {
          console.log('Todas las categorías predefinidas ya existen');
        }
      } catch (error) {
        console.error('Error al inicializar categorías:', error);
      }
    };

    initializeCategories();
  }, []);

  // Listener para categorías
  useEffect(() => {
    const categoriesQuery = query(collection(db, 'categories'));
    const unsubscribe = onSnapshot(categoriesQuery, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  // Inicializar personas predefinidas
  useEffect(() => {
    const initializePeople = async () => {
      if (peopleInitialized.current) return;
      peopleInitialized.current = true;
      
      try {
        const peopleQuery = query(collection(db, 'people'));
        const snapshot = await getDocs(peopleQuery);
        
        // Obtener las personas existentes
        const existingPeople = snapshot.docs.map(doc => doc.data());
        const existingIds = new Set(existingPeople.map(person => person.id));
        
        // Filtrar solo las personas que no existen
        const missingPeople = DEFAULT_PEOPLE.filter(person => !existingIds.has(person.id));
        
        if (missingPeople.length > 0) {
          console.log('Creando personas faltantes:', missingPeople.length);
          
          for (const person of missingPeople) {
            await addDoc(collection(db, 'people'), {
              ...person,
              createdAt: Timestamp.now()
            });
          }
          
          console.log('Personas creadas exitosamente');
        } else {
          console.log('Todas las personas predefinidas ya existen');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al inicializar personas:', error);
        setLoading(false);
      }
    };

    initializePeople();
  }, []);

  // Listener para personas
  useEffect(() => {
    const peopleQuery = query(collection(db, 'people'));
    const unsubscribe = onSnapshot(peopleQuery, (snapshot) => {
      setPeople(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  // Escuchar cambios en transacciones
  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  // Escuchar cambios en cuentas
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'accounts'), (snapshot) => {
      setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  // Funciones para transacciones
  const addTransaction = async (transaction) => {
    try {
      // Crear fecha en hora local, no UTC
      const [year, month, day] = transaction.date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day, 12, 0, 0); // Mediodía para evitar cambios de zona horaria
      
      const transactionData = {
        ...transaction,
        amount: Number(transaction.amount),
        date: Timestamp.fromDate(localDate),
        createdAt: Timestamp.now()
      };
      await addDoc(collection(db, 'transactions'), transactionData);
      
      // Actualizar el balance de la cuenta
      if (transaction.accountId) {
        await updateAccountBalance(transaction.accountId);
      }
    } catch (error) {
      console.error('Error al agregar transacción:', error);
      throw error;
    }
  };

  const updateTransaction = async (id, transaction) => {
    try {
      let dateToSave;
      if (transaction.date instanceof Timestamp) {
        dateToSave = transaction.date;
      } else if (typeof transaction.date === 'string') {
        // Crear fecha en hora local, no UTC
        const [year, month, day] = transaction.date.split('-').map(Number);
        const localDate = new Date(year, month - 1, day, 12, 0, 0); // Mediodía para evitar cambios de zona horaria
        dateToSave = Timestamp.fromDate(localDate);
      } else {
        dateToSave = Timestamp.fromDate(transaction.date);
      }
      
      const transactionData = {
        ...transaction,
        amount: Number(transaction.amount),
        date: dateToSave,
        updatedAt: Timestamp.now()
      };
      await updateDoc(doc(db, 'transactions', id), transactionData);
      
      // Actualizar el balance de la cuenta
      if (transaction.accountId) {
        await updateAccountBalance(transaction.accountId);
      }
    } catch (error) {
      console.error('Error al actualizar transacción:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const transaction = transactions.find(t => t.id === id);
      await deleteDoc(doc(db, 'transactions', id));
      
      // Actualizar el balance de la cuenta
      if (transaction?.accountId) {
        await updateAccountBalance(transaction.accountId);
      }
    } catch (error) {
      console.error('Error al eliminar transacción:', error);
      throw error;
    }
  };

  // Funciones para cuentas
  const addAccount = async (account) => {
    try {
      const initialBalance = Number(account.initialBalance) || 0;
      await addDoc(collection(db, 'accounts'), {
        ...account,
        initialBalance,
        balance: initialBalance,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error al agregar cuenta:', error);
      throw error;
    }
  };

  const updateAccount = async (id, account) => {
    try {
      await updateDoc(doc(db, 'accounts', id), {
        ...account,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error al actualizar cuenta:', error);
      throw error;
    }
  };

  const deleteAccount = async (id) => {
    try {
      await deleteDoc(doc(db, 'accounts', id));
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      throw error;
    }
  };

  const updateAccountBalance = async (accountId) => {
    try {
      // Obtener la cuenta para obtener el saldo inicial
      const accountDocRef = doc(db, 'accounts', accountId);
      const accountSnap = await getDoc(accountDocRef);
      
      if (!accountSnap.exists()) {
        console.error('Cuenta no encontrada:', accountId);
        return;
      }
      
      const accountData = accountSnap.data();
      const initialBalance = Number(accountData.initialBalance) || 0;
      
      console.log('🔹 Actualizando balance para cuenta:', accountId);
      console.log('💰 Saldo inicial:', initialBalance, '(tipo:', typeof initialBalance, ')');
      
      // Obtener transacciones directamente de Firestore para tener datos frescos
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('accountId', '==', accountId)
      );
      const querySnapshot = await getDocs(transactionsQuery);
      
      // También obtener transferencias donde esta cuenta es origen o destino
      const transfersFromQuery = query(
        collection(db, 'transactions'),
        where('fromAccountId', '==', accountId)
      );
      const transfersToQuery = query(
        collection(db, 'transactions'),
        where('toAccountId', '==', accountId)
      );
      
      const transfersFromSnapshot = await getDocs(transfersFromQuery);
      const transfersToSnapshot = await getDocs(transfersToQuery);
      
      // Calcular balance: partir del saldo inicial y sumar/restar transacciones
      let balance = initialBalance;
      
      console.log('📊 Transacciones encontradas:', querySnapshot.size);
      
      // Transacciones normales (income/expense)
      querySnapshot.docs.forEach(doc => {
        const t = doc.data();
        console.log(`  ${t.type === 'income' ? '➕' : '➖'} ${t.type}: $${t.amount} (tipo: ${typeof t.amount})`);
        if (t.type === 'income') balance += Number(t.amount);
        if (t.type === 'expense') balance -= Number(t.amount);
      });
      
      console.log('💸 Transferencias salientes:', transfersFromSnapshot.size);
      // Transferencias salientes (restan)
      transfersFromSnapshot.docs.forEach(doc => {
        const t = doc.data();
        console.log(`  ➖ Transfer out: $${t.amount}`);
        balance -= Number(t.amount);
      });
      
      console.log('💵 Transferencias entrantes:', transfersToSnapshot.size);
      // Transferencias entrantes (suman)
      transfersToSnapshot.docs.forEach(doc => {
        const t = doc.data();
        console.log(`  ➕ Transfer in: $${t.amount}`);
        balance += Number(t.amount);
      });
      
      console.log('✅ Balance final calculado:', balance);
      
      await updateDoc(doc(db, 'accounts', accountId), { balance });
    } catch (error) {
      console.error('Error al actualizar balance:', error);
    }
  };

  // Funciones para categorías
  const addCategory = async (category) => {
    try {
      await addDoc(collection(db, 'categories'), {
        ...category,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error al agregar categoría:', error);
      throw error;
    }
  };

  const updateCategory = async (id, category) => {
    try {
      await updateDoc(doc(db, 'categories', id), {
        ...category,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw error;
    }
  };

  // Funciones para personas
  const addPerson = async (person) => {
    try {
      await addDoc(collection(db, 'people'), {
        ...person,
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error al agregar persona:', error);
      throw error;
    }
  };

  const updatePerson = async (id, person) => {
    try {
      await updateDoc(doc(db, 'people', id), {
        ...person,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error al actualizar persona:', error);
      throw error;
    }
  };

  const deletePerson = async (id) => {
    try {
      await deleteDoc(doc(db, 'people', id));
    } catch (error) {
      console.error('Error al eliminar persona:', error);
      throw error;
    }
  };

  // Función para transferencias
  const addTransfer = async (fromAccountId, toAccountId, amount, description) => {
    try {
      const transferData = {
        type: 'transfer',
        fromAccountId,
        toAccountId,
        amount: Number(amount),
        description,
        date: Timestamp.now(),
        createdAt: Timestamp.now()
      };
      
      await addDoc(collection(db, 'transactions'), transferData);
      
      // Actualizar balances de ambas cuentas
      await updateAccountBalance(fromAccountId);
      await updateAccountBalance(toAccountId);
    } catch (error) {
      console.error('Error al realizar transferencia:', error);
      throw error;
    }
  };

  // Función para recalcular todos los balances
  const recalculateAllBalances = async () => {
    try {
      console.log('🔄 Recalculando todos los balances...');
      const accountsSnapshot = await getDocs(collection(db, 'accounts'));
      
      for (const accountDoc of accountsSnapshot.docs) {
        await updateAccountBalance(accountDoc.id);
      }
      
      console.log('✅ Todos los balances recalculados exitosamente');
    } catch (error) {
      console.error('❌ Error al recalcular balances:', error);
    }
  };

  const value = {
    transactions,
    accounts,
    categories,
    people,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    updateAccount,
    deleteAccount,
    addCategory,
    updateCategory,
    deleteCategory,
    addPerson,
    updatePerson,
    deletePerson,
    addTransfer,
    recalculateAllBalances
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
