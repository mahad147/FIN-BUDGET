
import React, { useState, useEffect } from 'react';
import { PercentageState } from '../types';
import { Input } from './ui/Input';
import { Percent, ArrowRight } from 'lucide-react';

export const PercentageCalculator: React.FC = () => {
  const [state, setState] = useState<PercentageState>({
    valueA: '',
    valueB: '',
    result: null,
    mode: 'XofY'
  });
  
  useEffect(() => {
    const a = parseFloat(state.valueA);
    const b = parseFloat(state.valueB);

    if (isNaN(a) || isNaN(b)) {
      setState(s => ({ ...s, result: null }));
      return;
    }

    let res = 0;
    switch (state.mode) {
      case 'XofY':
        // What is X% of Y?
        res = (a / 100) * b;
        break;
      case 'XisY':
        // X is what % of Y?
        res = (a / b) * 100;
        break;
      case 'increase':
        // % change from A to B
        res = ((b - a) / Math.abs(a)) * 100;
        break;
    }
    setState(s => ({ ...s, result: res }));
    
  }, [state.valueA, state.valueB, state.mode]);

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800 p-2 rounded-xl border border-slate-700">
        <button
          onClick={() => {
              setState(s => ({ ...s, mode: 'XofY', valueA: '', valueB: '', result: null }));
          }}
          className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${state.mode === 'XofY' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          Percentage Of
        </button>
        <button
          onClick={() => {
              setState(s => ({ ...s, mode: 'XisY', valueA: '', valueB: '', result: null }));
          }}
          className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${state.mode === 'XisY' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          What Percentage
        </button>
        <button
          onClick={() => {
              setState(s => ({ ...s, mode: 'increase', valueA: '', valueB: '', result: null }));
          }}
          className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${state.mode === 'increase' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          Percent Change
        </button>
      </div>

      <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex-1 w-full space-y-4">
            {state.mode === 'XofY' && (
                <>
                    <Input 
                        label="Percentage (X)" 
                        type="number" 
                        suffix="%" 
                        value={state.valueA}
                        onChange={(e) => setState(s => ({...s, valueA: e.target.value}))}
                        placeholder="e.g. 20"
                    />
                    <div className="text-center text-slate-500 font-medium">OF</div>
                    <Input 
                        label="Total Value (Y)" 
                        type="number" 
                        value={state.valueB}
                        onChange={(e) => setState(s => ({...s, valueB: e.target.value}))}
                        placeholder="e.g. 1500"
                    />
                </>
            )}
            {state.mode === 'XisY' && (
                <>
                    <Input 
                        label="Part Value (X)" 
                        type="number" 
                        value={state.valueA}
                        onChange={(e) => setState(s => ({...s, valueA: e.target.value}))}
                        placeholder="e.g. 50"
                    />
                    <div className="text-center text-slate-500 font-medium">IS WHAT % OF</div>
                    <Input 
                        label="Total Value (Y)" 
                        type="number" 
                        value={state.valueB}
                        onChange={(e) => setState(s => ({...s, valueB: e.target.value}))}
                        placeholder="e.g. 200"
                    />
                </>
            )}
            {state.mode === 'increase' && (
                <>
                    <Input 
                        label="Old Value" 
                        type="number" 
                        value={state.valueA}
                        onChange={(e) => setState(s => ({...s, valueA: e.target.value}))}
                        placeholder="e.g. 100"
                    />
                    <div className="text-center text-slate-500 font-medium">TO</div>
                    <Input 
                        label="New Value" 
                        type="number" 
                        value={state.valueB}
                        onChange={(e) => setState(s => ({...s, valueB: e.target.value}))}
                        placeholder="e.g. 150"
                    />
                </>
            )}
        </div>

        <div className="hidden md:flex text-slate-600">
            <ArrowRight size={32} />
        </div>

        <div className="flex-1 w-full bg-slate-900 rounded-xl p-6 flex flex-col items-center justify-center min-h-[160px] border border-slate-700 shadow-inner relative">
            <div>
                <span className="text-slate-400 text-sm mb-2 uppercase tracking-wider font-semibold block text-center">Result</span>
                {state.result !== null ? (
                    <div className="text-4xl font-bold text-primary-400 break-all text-center">
                        {state.mode === 'XofY' ? state.result.toLocaleString(undefined, {maximumFractionDigits: 2}) : `${state.result.toLocaleString(undefined, {maximumFractionDigits: 2})}%`}
                    </div>
                ) : (
                    <div className="text-slate-600 flex justify-center">
                        <Percent size={40} opacity={0.5} />
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
