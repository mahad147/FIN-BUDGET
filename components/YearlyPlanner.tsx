
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, DollarSign, TrendingUp, TrendingDown, Save } from 'lucide-react';

interface MonthData {
  id: number;
  name: string;
  income: string;
  expenses: string;
}

const INITIAL_DATA: MonthData[] = [
  { id: 1, name: 'Jan', income: '', expenses: '' },
  { id: 2, name: 'Feb', income: '', expenses: '' },
  { id: 3, name: 'Mar', income: '', expenses: '' },
  { id: 4, name: 'Apr', income: '', expenses: '' },
  { id: 5, name: 'May', income: '', expenses: '' },
  { id: 6, name: 'Jun', income: '', expenses: '' },
  { id: 7, name: 'Jul', income: '', expenses: '' },
  { id: 8, name: 'Aug', income: '', expenses: '' },
  { id: 9, name: 'Sep', income: '', expenses: '' },
  { id: 10, name: 'Oct', income: '', expenses: '' },
  { id: 11, name: 'Nov', income: '', expenses: '' },
  { id: 12, name: 'Dec', income: '', expenses: '' },
];

export const YearlyPlanner: React.FC = () => {
  const [data, setData] = useState<MonthData[]>(INITIAL_DATA);

  // Computed totals and chart data
  const { chartData, totals } = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    
    const processedData = data.map(item => {
      const inc = parseFloat(item.income) || 0;
      const exp = parseFloat(item.expenses) || 0;
      
      totalIncome += inc;
      totalExpenses += exp;

      return {
        ...item,
        incNum: inc,
        expNum: exp,
      };
    });

    return {
      chartData: processedData,
      totals: {
        income: totalIncome,
        expenses: totalExpenses,
        savings: totalIncome - totalExpenses,
        savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
      }
    };
  }, [data]);

  const handleUpdate = (id: number, field: 'income' | 'expenses', value: string) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const autofillRemaining = (id: number) => {
    const sourceMonth = data.find(d => d.id === id);
    if (!sourceMonth) return;

    setData(prev => prev.map(item => 
      item.id > id 
        ? { ...item, income: sourceMonth.income, expenses: sourceMonth.expenses } 
        : item
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={80} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Annual Income</p>
          <div className="text-2xl font-bold text-emerald-400">
             ${totals.income.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-red-500/50 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingDown size={80} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Annual Expenses</p>
          <div className="text-2xl font-bold text-red-400">
             ${totals.expenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Save size={80} />
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Net Savings</p>
          <div className={`text-2xl font-bold ${totals.savings >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
             ${totals.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
           <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Savings Rate</p>
           <div className="text-2xl font-bold text-slate-100">
             {totals.savingsRate.toFixed(1)}%
          </div>
           <div className="w-full bg-slate-700 h-1.5 mt-3 rounded-full overflow-hidden">
              <div 
                className={`h-full ${totals.savingsRate > 20 ? 'bg-emerald-500' : totals.savingsRate > 0 ? 'bg-blue-500' : 'bg-red-500'}`} 
                style={{ width: `${Math.max(0, Math.min(100, totals.savingsRate))}%` }}
              ></div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {/* Visual Chart */}
        <div className="lg:col-span-3 bg-slate-800 p-6 rounded-2xl border border-slate-700 min-h-[300px]">
           <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
             <Calendar className="text-primary-500" size={20}/> Annual Overview
           </h3>
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                 <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                 <YAxis stroke="#64748b" tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                 <Tooltip 
                    cursor={{fill: '#1e293b'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                 />
                 <Bar dataKey="incNum" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                 <Bar dataKey="expNum" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Input Grid */}
        <div className="lg:col-span-3 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <DollarSign className="text-primary-500" size={20}/> Monthly Budget
                </h3>
                <span className="text-xs text-slate-500 italic hidden sm:inline">Tip: Click "↓" to autofill subsequent months</span>
             </div>
             
             <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                            <th className="py-3 px-2 font-medium w-24">Month</th>
                            <th className="py-3 px-2 font-medium">Income ($)</th>
                            <th className="py-3 px-2 font-medium">Expenses ($)</th>
                            <th className="py-3 px-2 font-medium text-right">Net Flow</th>
                            <th className="py-3 px-2 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {data.map((month) => {
                             const net = (parseFloat(month.income) || 0) - (parseFloat(month.expenses) || 0);
                             return (
                                <tr key={month.id} className="group hover:bg-slate-800/50 transition-colors">
                                    <td className="py-3 px-2 font-medium text-slate-300">{month.name}</td>
                                    <td className="py-2 px-2">
                                        <input 
                                            type="number" 
                                            value={month.income}
                                            onChange={(e) => handleUpdate(month.id, 'income', e.target.value)}
                                            placeholder="0"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-primary-500 transition-colors placeholder-slate-600"
                                        />
                                    </td>
                                    <td className="py-2 px-2">
                                        <input 
                                            type="number" 
                                            value={month.expenses}
                                            onChange={(e) => handleUpdate(month.id, 'expenses', e.target.value)}
                                            placeholder="0"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-red-500 transition-colors placeholder-slate-600"
                                        />
                                    </td>
                                    <td className="py-3 px-2 text-right font-semibold">
                                        <span className={net > 0 ? 'text-emerald-400' : net < 0 ? 'text-red-400' : 'text-slate-500'}>
                                            {net > 0 ? '+' : ''}{net.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        {month.id < 12 && (month.income || month.expenses) && (
                                            <button 
                                                onClick={() => autofillRemaining(month.id)}
                                                className="text-slate-600 hover:text-primary-400 transition-colors p-1"
                                                title="Copy values to remaining months"
                                            >
                                                ↓
                                            </button>
                                        )}
                                    </td>
                                </tr>
                             );
                        })}
                    </tbody>
                 </table>
             </div>
        </div>
      </div>
    </div>
  );
};
