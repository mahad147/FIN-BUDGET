
import React, { useState, useEffect } from 'react';
import { LoanState } from '../types';
import { Input } from './ui/Input';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign, AlertCircle, Bot } from 'lucide-react';
import { generateFinancialInsight } from '../services/geminiService';

const COLORS = ['#10b981', '#3b82f6']; // Primary-500, Blue-500

export const LoanCalculator: React.FC = () => {
  const [state, setState] = useState<LoanState>({
    amount: '',
    rate: '',
    years: '',
    monthlyPayment: null,
    totalInterest: null,
    totalPayment: null,
  });

  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const P = parseFloat(state.amount);
    const r = parseFloat(state.rate) / 100 / 12;
    const n = parseFloat(state.years) * 12;

    if (P > 0 && r > 0 && n > 0) {
      // M = P[r(1+r)^n]/[(1+r)^n - 1]
      const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPay = monthly * n;
      const totalInt = totalPay - P;

      setState(s => ({
        ...s,
        monthlyPayment: monthly,
        totalPayment: totalPay,
        totalInterest: totalInt
      }));
      setAiInsight(''); // Reset AI on change

    } else {
      setState(s => ({ ...s, monthlyPayment: null, totalPayment: null, totalInterest: null }));
    }
  }, [state.amount, state.rate, state.years]);

  const handleAiAnalysis = async () => {
    if (!state.monthlyPayment) return;
    setLoadingAi(true);
    const context = "Loan/Mortgage Calculation";
    const data = {
        LoanAmount: state.amount,
        InterestRate: state.rate + '%',
        Term: state.years + ' years',
        MonthlyPayment: state.monthlyPayment?.toFixed(2),
        TotalInterest: state.totalInterest?.toFixed(2),
        TotalCost: state.totalPayment?.toFixed(2)
    };
    const insight = await generateFinancialInsight(context, data);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  const chartData = state.totalInterest ? [
    { name: 'Principal', value: parseFloat(state.amount || '0') },
    { name: 'Interest', value: state.totalInterest },
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in relative">
      <div className="space-y-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-5">
            <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                <DollarSign className="text-primary-500" size={20}/> Loan Details
            </h3>
            <Input
                label="Loan Amount ($)"
                type="number"
                value={state.amount}
                onChange={(e) => setState(s => ({...s, amount: e.target.value}))}
                placeholder="250000"
            />
            <Input
                label="Interest Rate (%)"
                type="number"
                value={state.rate}
                onChange={(e) => setState(s => ({...s, rate: e.target.value}))}
                placeholder="4.5"
                step="0.1"
            />
            <Input
                label="Loan Term (Years)"
                type="number"
                value={state.years}
                onChange={(e) => setState(s => ({...s, years: e.target.value}))}
                placeholder="30"
            />
        </div>

        {state.monthlyPayment !== null && (
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
                 <button
                    onClick={handleAiAnalysis}
                    disabled={loadingAi}
                    className="w-full mb-4 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                >
                    <Bot size={18} /> {loadingAi ? 'Analyzing...' : 'Get AI Financial Insight'}
                </button>
                {aiInsight && (
                    <div className="mb-4 p-4 bg-indigo-900/30 border border-indigo-500/30 rounded-lg text-indigo-100 text-sm leading-relaxed whitespace-pre-line animate-pulse-fade-in">
                        {aiInsight}
                    </div>
                )}
            </div>
        )}
      </div>

      <div className="flex flex-col gap-6 relative">
         <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-full flex flex-col justify-center relative">
            {!state.monthlyPayment ? (
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 flex-col gap-2">
                    <AlertCircle size={48} className="opacity-20" />
                    <p>Enter details to see breakdown</p>
                </div>
            ) : (
                <>
                     <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/50">
                            <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Monthly Pay</div>
                            <div className="text-2xl font-bold text-primary-400">
                                ${state.monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}
                            </div>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/50">
                            <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Interest</div>
                            <div className="text-2xl font-bold text-blue-400">
                                ${state.totalInterest?.toLocaleString(undefined, {maximumFractionDigits: 0})}
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    formatter={(value: number) => `$${value.toLocaleString()}`}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
         </div>
      </div>
    </div>
  );
};
