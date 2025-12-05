
import React, { useState, useEffect } from 'react';
import { AccountingState } from '../types';
import { Input } from './ui/Input';
import { Factory, Calculator, TrendingDown, DollarSign } from 'lucide-react';

export const AccountingCalculator: React.FC = () => {
  const [state, setState] = useState<AccountingState>({
    mode: 'factory',
    directMaterials: '',
    directLabor: '',
    overhead: '',
    fixedCost: '',
    variableCostPerUnit: '',
    pricePerUnit: '',
    cost: '',
    revenue: '',
    assetCost: '',
    salvageValue: '',
    lifeYears: ''
  });

  const [results, setResults] = useState<Record<string, number>>({});

  useEffect(() => {
    setResults({});
  }, [state.mode]);

  useEffect(() => {
    const res: Record<string, number> = {};

    if (state.mode === 'factory') {
        const mat = parseFloat(state.directMaterials) || 0;
        const lab = parseFloat(state.directLabor) || 0;
        const ovh = parseFloat(state.overhead) || 0;
        
        // Only calculate if at least one value is entered
        if (state.directMaterials || state.directLabor || state.overhead) {
            res.primeCost = mat + lab;
            res.conversionCost = lab + ovh;
            res.totalMfgCost = mat + lab + ovh;
        }
    } 
    else if (state.mode === 'breakeven') {
        const fc = parseFloat(state.fixedCost);
        const vc = parseFloat(state.variableCostPerUnit);
        const p = parseFloat(state.pricePerUnit);

        if (fc >= 0 && vc >= 0 && p > vc) {
            const beUnits = fc / (p - vc);
            res.breakEvenUnits = beUnits;
            res.breakEvenRevenue = beUnits * p;
            res.contributionMargin = p - vc;
        }
    }
    else if (state.mode === 'margin') {
        const cost = parseFloat(state.cost);
        const rev = parseFloat(state.revenue);

        if (cost >= 0 && rev > 0) {
            const profit = rev - cost;
            res.grossProfit = profit;
            res.grossMargin = (profit / rev) * 100;
            res.markup = (profit / cost) * 100;
        }
    }
    else if (state.mode === 'depreciation') {
        const cost = parseFloat(state.assetCost);
        const salvage = parseFloat(state.salvageValue) || 0;
        const life = parseFloat(state.lifeYears);

        if (cost > 0 && life > 0) {
            res.annualDepreciation = (cost - salvage) / life;
            res.monthlyDepreciation = res.annualDepreciation / 12;
            res.totalDepreciation = cost - salvage;
        }
    }

    setResults(res);

  }, [state]);

  const ResultCard = ({ label, value, prefix = '', suffix = '' }: { label: string, value: number | undefined, prefix?: string, suffix?: string }) => {
    if (value === undefined || isNaN(value)) return null;
    return (
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center text-center animate-fade-in">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</span>
            <span className="text-xl md:text-2xl font-bold text-primary-400">
                {prefix}{value.toLocaleString(undefined, { maximumFractionDigits: 2 })}{suffix}
            </span>
        </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            {[
                { id: 'factory', label: 'Factory Costs', icon: Factory },
                { id: 'breakeven', label: 'Break-Even', icon: Calculator },
                { id: 'margin', label: 'Margin & Markup', icon: DollarSign },
                { id: 'depreciation', label: 'Depreciation', icon: TrendingDown },
            ].map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => setState(s => ({ ...s, mode: tool.id as any }))}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                        state.mode === tool.id 
                        ? 'bg-primary-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                    <tool.icon size={16} />
                    <span className="hidden md:inline">{tool.label}</span>
                    <span className="md:hidden">{tool.label.split(' ')[0]}</span>
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Section */}
            <div className="md:col-span-1 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4">
                <h3 className="text-lg font-semibold text-slate-100 mb-4 border-b border-slate-700 pb-2">
                    {state.mode === 'factory' && 'Manufacturing Costs'}
                    {state.mode === 'breakeven' && 'Break-Even Analysis'}
                    {state.mode === 'margin' && 'Sales & Cost'}
                    {state.mode === 'depreciation' && 'Asset Details'}
                </h3>

                {state.mode === 'factory' && (
                    <>
                        <Input label="Direct Materials" type="number" prefix="$" placeholder="10000" value={state.directMaterials} onChange={e => setState(s => ({...s, directMaterials: e.target.value}))} />
                        <Input label="Direct Labor" type="number" prefix="$" placeholder="5000" value={state.directLabor} onChange={e => setState(s => ({...s, directLabor: e.target.value}))} />
                        <Input label="Factory Overhead" type="number" prefix="$" placeholder="2500" value={state.overhead} onChange={e => setState(s => ({...s, overhead: e.target.value}))} />
                    </>
                )}

                {state.mode === 'breakeven' && (
                    <>
                        <Input label="Total Fixed Costs" type="number" prefix="$" placeholder="50000" value={state.fixedCost} onChange={e => setState(s => ({...s, fixedCost: e.target.value}))} />
                        <Input label="Variable Cost per Unit" type="number" prefix="$" placeholder="12" value={state.variableCostPerUnit} onChange={e => setState(s => ({...s, variableCostPerUnit: e.target.value}))} />
                        <Input label="Sale Price per Unit" type="number" prefix="$" placeholder="25" value={state.pricePerUnit} onChange={e => setState(s => ({...s, pricePerUnit: e.target.value}))} />
                    </>
                )}

                {state.mode === 'margin' && (
                    <>
                        <Input label="Cost of Goods (COGS)" type="number" prefix="$" placeholder="150" value={state.cost} onChange={e => setState(s => ({...s, cost: e.target.value}))} />
                        <Input label="Selling Price / Revenue" type="number" prefix="$" placeholder="250" value={state.revenue} onChange={e => setState(s => ({...s, revenue: e.target.value}))} />
                    </>
                )}

                {state.mode === 'depreciation' && (
                    <>
                        <Input label="Asset Cost" type="number" prefix="$" placeholder="20000" value={state.assetCost} onChange={e => setState(s => ({...s, assetCost: e.target.value}))} />
                        <Input label="Salvage Value" type="number" prefix="$" placeholder="2000" value={state.salvageValue} onChange={e => setState(s => ({...s, salvageValue: e.target.value}))} />
                        <Input label="Useful Life (Years)" type="number" placeholder="5" value={state.lifeYears} onChange={e => setState(s => ({...s, lifeYears: e.target.value}))} />
                    </>
                )}
            </div>

            {/* Results Section */}
            <div className="md:col-span-2 space-y-6 relative">
                 <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {state.mode === 'factory' && (
                            <>
                                <ResultCard label="Prime Cost" value={results.primeCost} prefix="$" />
                                <ResultCard label="Conversion Cost" value={results.conversionCost} prefix="$" />
                                <div className="sm:col-span-2">
                                    <ResultCard label="Total Manufacturing Cost" value={results.totalMfgCost} prefix="$" />
                                </div>
                            </>
                        )}
                        {state.mode === 'breakeven' && (
                            <>
                                <ResultCard label="Break-Even Units" value={results.breakEvenUnits} suffix=" Units" />
                                <ResultCard label="Break-Even Revenue" value={results.breakEvenRevenue} prefix="$" />
                                <div className="sm:col-span-2">
                                    <ResultCard label="Contribution Margin per Unit" value={results.contributionMargin} prefix="$" />
                                </div>
                            </>
                        )}
                        {state.mode === 'margin' && (
                            <>
                                <ResultCard label="Gross Margin" value={results.grossMargin} suffix="%" />
                                <ResultCard label="Markup" value={results.markup} suffix="%" />
                                <div className="sm:col-span-2">
                                    <ResultCard label="Gross Profit" value={results.grossProfit} prefix="$" />
                                </div>
                            </>
                        )}
                        {state.mode === 'depreciation' && (
                            <>
                                <ResultCard label="Annual Depreciation" value={results.annualDepreciation} prefix="$" />
                                <ResultCard label="Monthly Depreciation" value={results.monthlyDepreciation} prefix="$" />
                                <div className="sm:col-span-2">
                                    <ResultCard label="Total Depreciable Amount" value={results.totalDepreciation} prefix="$" />
                                </div>
                            </>
                        )}
                    </div>
                </div>
                
                {Object.keys(results).length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 border border-slate-700/50 rounded-2xl p-8 border-dashed bg-slate-800/20">
                        <Calculator size={48} className="opacity-20 mb-3" />
                        <p>Enter values to calculate</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
