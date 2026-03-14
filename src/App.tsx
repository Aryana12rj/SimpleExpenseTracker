import { useState, useEffect } from 'react';
import { Wallet, Sparkles, BrainCircuit, RefreshCcw } from 'lucide-react';
import { Expense } from './types';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Dashboard } from './components/Dashboard';
import { getFinancialAdvice } from './services/gemini';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [advice, setAdvice] = useState<string>('');
  const [isGettingAdvice, setIsGettingAdvice] = useState(false);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses(prev => [expense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const fetchAdvice = async () => {
    setIsGettingAdvice(true);
    const result = await getFinancialAdvice(expenses);
    setAdvice(result);
    setIsGettingAdvice(false);
  };

  useEffect(() => {
    if (expenses.length > 0 && !advice) {
      fetchAdvice();
    }
  }, [expenses]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-bottom border-black/5 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">SpendWise</h1>
          </div>
          <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">
            Simple Tracking
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Dashboard Section */}
        <section>
          <Dashboard expenses={expenses} />
        </section>

        {/* AI Advice Section */}
        <AnimatePresence>
          {(advice || isGettingAdvice) && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl relative overflow-hidden"
            >
              <div className="relative z-10 flex items-start gap-4">
                <div className="bg-emerald-500 p-2 rounded-xl">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-emerald-900 font-semibold flex items-center gap-2">
                    AI Financial Insight
                    {isGettingAdvice && <RefreshCcw className="w-3 h-3 animate-spin" />}
                  </h3>
                  <p className="text-emerald-800/80 text-sm mt-1 leading-relaxed">
                    {isGettingAdvice ? "Analyzing your spending patterns..." : advice}
                  </p>
                </div>
                {!isGettingAdvice && (
                  <button 
                    onClick={fetchAdvice}
                    className="text-emerald-600 hover:text-emerald-700 p-1 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-200/20 rounded-full blur-2xl" />
            </motion.section>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <ExpenseForm onAdd={handleAddExpense} />
          </div>

          {/* List Section */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                Recent Transactions
                <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {expenses.length}
                </span>
              </h2>
            </div>
            <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
          </div>
        </div>
      </main>

      {/* Footer / Mobile Nav Placeholder */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-black/5 py-4 px-6 md:hidden">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <div className="flex flex-col items-center gap-1 text-black">
            <Wallet className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-tighter">Home</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <Sparkles className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-tighter">AI Help</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
