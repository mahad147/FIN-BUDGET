
import React, { useState, useEffect } from 'react';
import { InvestmentState } from '../types';
import { Input } from './ui/Input';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Bot } from 'lucide-react';
import { generateFinancialInsight } from '../services/geminiService';

export const InvestmentCalculator: React.FC = () => {
  const [state, setState] = useState<InvestmentState>({
    initial: '',
    contribution: '',
    rate: '',
    years: '',
    frequency: 'monthly',
    futureValue: null,
    totalContributed: null,
    interestEarned: null
  });
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const P = parseFloat(state.initial) || 0;
    const c = parseFloat(state.contribution) || 0;
    const r = parseFloat(state.rate) / 100;
    const t = parseFloat(state.years);
    const n = state.frequency === 'monthly' ? 12 : 1;

    if (t > 0 && (P > 0 || c > 0) && r >= 0) {
      const data = [];
      let currentBalance = P;
      let totalContrib = P;

      for (let year = 0; year <= t; year++) {
        data.push({
          year: `Year ${year}`,
          balance: Math.round(currentBalance),
          contribution: Math.round(totalContrib),
          interest: Math.round(currentBalance - totalContrib)
        });

        if (year < t) {
            for(let k=0; k<n; k++) {
                currentBalance = currentBalance * (1 + r/n) + c;
                totalContrib += c;
            }
        }
      }

      setState(s => ({
        ...s,
        futureValue: currentBalance,
        totalContributed: totalContrib,
        interestEarned: currentBalance - totalContrib
      }));
      setChartData(data);
      setAiInsight(''); 

    } else {
        setState(s => ({ ...s, futureValue: null, totalContributed: null, interestEarned: null }));
        setChartData([]);
    }
  }, [state.initial, state.contribution, state.rate, state.years, state.frequency]);

  const handleAiAnalysis = async () => {
    if (!state.futureValue) return;
    setLoadingAi(true);
    const context = "Compound Interest Investment Projection";
    const data = {
        InitialPrincipal: state.initial,
        PeriodicContribution: state.contribution + ` (${state.frequency})`,
        AnnualRate: state.rate + '%',
        TimePeriod: state.years + ' years',
        FutureValue: state.futureValue?.toFixed(2),
        TotalContributed: state.totalContributed?.toFixed(2),
        InterestEarned: state.interestEarned?.toFixed(2),
        Multiplier: (state.futureValue! / (state.totalContributed || 1)).toFixed(2) + 'x'
    };
    const insight = await generateFinancialInsight(context, data);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in relative">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4">
                 <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
                    <TrendingUp className="text-primary-500" size={20}/> Parameters
                </h3>
                <Input
                    label="Initial Investment"
                    type="number"
                    value={state.initial}
                    onChange={(e) => setState(s => ({...s, initial: e.target.value}))}
                    placeholder="10000"
                    prefix="$"
                />
                 <Input
                    label="Regular Contribution"
                    type="number"
                    value={state.contribution}
                    onChange={(e) => setState(s => ({...s, contribution: e.target.value}))}
                    placeholder="500"
                    prefix="$"
                />
                 <div className="flex gap-2">
                    <button 
                        onClick={() => setState(s => ({...s, frequency: 'monthly'}))}
                        className={`flex-1 text-xs py-1.5 rounded border ${state.frequency === 'monthly' ? 'bg-slate-700 border-slate-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                        Monthly
                    </button>
                    <button 
                         onClick={() => setState(s => ({...s, frequency: 'yearly'}))}
                         className={`flex-1 text-xs py-1.5 rounded border ${state.frequency === 'yearly' ? 'bg-slate-700 border-slate-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                        Yearly
                    </button>
                 </div>
                 <Input
                    label="Annual Interest Rate"
                    type="number"
                    value={state.rate}
                    onChange={(e) => setState(s => ({...s, rate: e.target.value}))}
                    placeholder="7"
                    suffix="%"
                />
                <Input
                    label="Time Period"
                    type="number"
                    value={state.years}
                    onChange={(e) => setState(s => ({...s, years: e.target.value}))}
                    placeholder="10"
                    suffix="Years"
                />
            </div>

            <div className="md:col-span-2 flex flex-col gap-6 relative">
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex-1 min-h-[300px]">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                     <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis 
                                    stroke="#64748b" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(value) => `$${value/1000}k`} 
                                />
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    formatter={(value: number) => `$${value.toLocaleString()}`}
                                />
                                <Area type="monotone" dataKey="balance" stroke="#10b981" fillOpacity={1} fill="url(#colorBalance)" name="Total Balance" />
                                <Area type="monotone" dataKey="contribution" stroke="#3b82f6" fillOpacity={1} fill="url(#colorContrib)" name="Your Contribution" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                         <div className="h-full flex items-center justify-center text-slate-500">
                            Enter parameters to visualize growth
                        </div>
                    )}
                </div>
            </div>
       </div>

       {state.futureValue !== null && (
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
                 <div className="text-slate-400 text-xs font-bold uppercase mb-1">Future Value</div>
                 <div className="text-2xl font-bold text-primary-400">${state.futureValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            </div>
             <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
                 <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total Contributed</div>
                 <div className="text-xl font-bold text-blue-400">${state.totalContributed?.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            </div>
             <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
                 <div className="text-slate-400 text-xs font-bold uppercase mb-1">Total Interest</div>
                 <div className="text-xl font-bold text-emerald-400">+${state.interestEarned?.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            </div>
            <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl flex items-center justify-center">
                 <button
                    onClick={handleAiAnalysis}
                    disabled={loadingAi}
                    className="flex flex-col items-center gap-1 text-indigo-300 hover:text-white transition-colors disabled:opacity-50"
                >
                    <Bot size={20} />
                    <span className="text-xs font-semibold">{loadingAi ? 'Thinking...' : 'AI Explain'}</span>
                </button>
            </div>
         </div>
       )}
       {aiInsight && (
            <div className="p-6 bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-xl text-indigo-100 text-sm leading-relaxed animate-pulse-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                <h4 className="font-bold text-indigo-300 mb-2 flex items-center gap-2"><Bot size={16}/> AI Assessment</h4>
                <div className="whitespace-pre-line">{aiInsight}</div>
            </div>
        )}
    </div>
  );
};
