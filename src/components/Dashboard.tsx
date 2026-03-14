import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Expense, Category } from '../types';
import { format, startOfMonth, subMonths, isSameMonth } from 'date-fns';

interface DashboardProps {
  expenses: Expense[];
}

const COLORS = [
  '#f97316', // Food
  '#3b82f6', // Transport
  '#ef4444', // Bills
  '#10b981', // Health
  '#a855f7', // Education
  '#ec4899', // Entertainment
  '#16a34a', // Groceries
  '#6b7280', // Other
];

export function Dashboard({ expenses }: DashboardProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Category Data
  const categoryData = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<Category, number>);

  const pieChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  // Monthly Data (Last 6 months)
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const date = subMonths(startOfMonth(new Date()), i);
    return {
      date,
      name: format(date, 'MMM'),
      total: expenses
        .filter(e => isSameMonth(new Date(e.date), date))
        .reduce((sum, e) => sum + e.amount, 0)
    };
  }).reverse();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-black text-white p-8 rounded-3xl flex flex-col justify-center shadow-xl">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Total Spending</p>
          <h2 className="text-5xl font-light tracking-tight">
            ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <div className="mt-6 flex items-center gap-2 text-emerald-400 text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Tracking
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-black/5 shadow-sm flex flex-col md:flex-row items-center">
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 md:mt-0 md:ml-8 w-full">
            {pieChartData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-gray-500">{item.name}</span>
                </div>
                <span className="font-medium">${item.value.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Summary Chart */}
      <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Monthly Spending Trend</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last6Months}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total Spending']}
              />
              <Bar 
                dataKey="total" 
                fill="#10b981" 
                radius={[6, 6, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
