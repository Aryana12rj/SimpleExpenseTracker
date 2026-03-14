import React, { useState } from 'react';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import { Category, Expense } from '../types';
import { parseExpenseFromText } from '../services/gemini';
import { cn } from '../lib/utils';

interface ExpenseFormProps {
  onAdd: (expense: Omit<Expense, 'id'>) => void;
}

const CATEGORIES: Category[] = [
  'Food', 'Transport', 'Bills', 'Health', 'Education', 'Entertainment', 'Groceries', 'Other'
];

export function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [aiInput, setAiInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    
    onAdd({
      amount: parseFloat(amount),
      category,
      description,
      date
    });
    
    setAmount('');
    setDescription('');
  };

  const handleAiParse = async () => {
    if (!aiInput.trim()) return;
    setIsParsing(true);
    const result = await parseExpenseFromText(aiInput);
    if (result) {
      if (result.amount) setAmount(result.amount.toString());
      if (result.category) setCategory(result.category as Category);
      if (result.description) setDescription(result.description);
      setAiInput('');
    }
    setIsParsing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          Quick Add with AI
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g., 'Spent 15 on lunch today'"
            className="flex-1 px-4 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiParse()}
          />
          <button
            onClick={handleAiParse}
            disabled={isParsing}
            className="bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {isParsing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Magic Add"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 space-y-4">
        <h2 className="text-lg font-semibold mb-2">Manual Entry</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full px-4 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</label>
            <select
              className="w-full px-4 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</label>
            <input
              type="date"
              required
              className="w-full px-4 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </form>
    </div>
  );
}
