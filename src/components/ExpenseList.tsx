import React from 'react';
import { Trash2, ShoppingBag, Bus, Receipt, HeartPulse, GraduationCap, Film, ShoppingCart, MoreHorizontal } from 'lucide-react';
import { Expense, Category } from '../types';
import { format } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  Food: <ShoppingBag className="w-5 h-5 text-orange-500" />,
  Transport: <Bus className="w-5 h-5 text-blue-500" />,
  Bills: <Receipt className="w-5 h-5 text-red-500" />,
  Health: <HeartPulse className="w-5 h-5 text-emerald-500" />,
  Education: <GraduationCap className="w-5 h-5 text-purple-500" />,
  Entertainment: <Film className="w-5 h-5 text-pink-500" />,
  Groceries: <ShoppingCart className="w-5 h-5 text-green-600" />,
  Other: <MoreHorizontal className="w-5 h-5 text-gray-500" />,
};

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-black/10">
        <p className="text-gray-400">No expenses yet. Start adding some!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense) => (
        <div
          key={expense.id}
          className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 hover:border-black/10 transition-all shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
              {CATEGORY_ICONS[expense.category]}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{expense.description}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{expense.category}</span>
                <span>•</span>
                <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-900">
              ${expense.amount.toFixed(2)}
            </span>
            <button
              onClick={() => onDelete(expense.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
