
import React, { useState } from 'react';
import { CalculatorType } from './types';
import { PercentageCalculator } from './components/PercentageCalculator';
import { LoanCalculator } from './components/LoanCalculator';
import { InvestmentCalculator } from './components/InvestmentCalculator';
import { AccountingCalculator } from './components/AccountingCalculator';
import { YearlyPlanner } from './components/YearlyPlanner';
import { PieChart, TrendingUp, Percent, Calculator, Factory, BookOpen, Calendar } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorType>(CalculatorType.LOAN);

  const renderCalculator = () => {
    switch (activeTab) {
      case CalculatorType.PERCENTAGE:
        return <PercentageCalculator />;
      case CalculatorType.LOAN:
        return <LoanCalculator />;
      case CalculatorType.INVESTMENT:
        return <InvestmentCalculator />;
      case CalculatorType.ACCOUNTING:
        return <AccountingCalculator />;
      case CalculatorType.PLANNER:
        return <YearlyPlanner />;
      default:
        return <LoanCalculator />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-primary-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-900/20">
              <Calculator className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              FIN <span className="text-primary-400">BUDGET</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Nav/Status items removed as app is free */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="w-full md:w-64 flex-shrink-0 space-y-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Calculators</p>
            
            <button
              onClick={() => setActiveTab(CalculatorType.LOAN)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === CalculatorType.LOAN 
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <PieChart size={20} className={activeTab === CalculatorType.LOAN ? 'text-primary-500' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="font-medium">Loan & Mortgage</span>
            </button>

            <button
              onClick={() => setActiveTab(CalculatorType.INVESTMENT)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === CalculatorType.INVESTMENT 
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <TrendingUp size={20} className={activeTab === CalculatorType.INVESTMENT ? 'text-primary-500' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="font-medium">Investment Growth</span>
            </button>

            <button
              onClick={() => setActiveTab(CalculatorType.PLANNER)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === CalculatorType.PLANNER 
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Calendar size={20} className={activeTab === CalculatorType.PLANNER ? 'text-primary-500' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="font-medium">Planner</span>
            </button>

            <button
              onClick={() => setActiveTab(CalculatorType.ACCOUNTING)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === CalculatorType.ACCOUNTING 
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Factory size={20} className={activeTab === CalculatorType.ACCOUNTING ? 'text-primary-500' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="font-medium">Accounting & Factory</span>
            </button>

            <button
              onClick={() => setActiveTab(CalculatorType.PERCENTAGE)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === CalculatorType.PERCENTAGE 
                  ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Percent size={20} className={activeTab === CalculatorType.PERCENTAGE ? 'text-primary-500' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="font-medium">Percentage</span>
            </button>
          </nav>

          {/* Calculator Area */}
          <section className="flex-1 min-w-0">
             <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                    {activeTab === CalculatorType.LOAN && 'Loan Calculator'}
                    {activeTab === CalculatorType.INVESTMENT && 'Compound Interest'}
                    {activeTab === CalculatorType.PERCENTAGE && 'Percentage Tools'}
                    {activeTab === CalculatorType.ACCOUNTING && 'Accounting & Factory Tools'}
                    {activeTab === CalculatorType.PLANNER && 'Planner'}
                </h2>
                <p className="text-slate-400">
                     {activeTab === CalculatorType.LOAN && 'Estimate monthly payments and total interest for mortgages or auto loans.'}
                     {activeTab === CalculatorType.INVESTMENT && 'Visualize how your money can grow over time with compound interest.'}
                     {activeTab === CalculatorType.PERCENTAGE && 'Quickly calculate percentages, increases, and proportions.'}
                     {activeTab === CalculatorType.ACCOUNTING && 'Essential formulas for business, factory costs, and financial accounting.'}
                     {activeTab === CalculatorType.PLANNER && 'Plan your budget, track monthly income vs. expenses, and forecast savings.'}
                </p>
             </div>
             
             <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-1 md:p-6 backdrop-blur-sm relative">
                 {renderCalculator()}
             </div>
          </section>
        </div>

        {/* Financial Definitions / Glossary Section */}
        <div className="mt-20 border-t border-slate-800 pt-12">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <BookOpen className="text-primary-500" />
                Financial Definitions & Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-primary-400">Accounting & Factory</h4>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li>
                            <strong className="text-slate-200 block">Prime Cost</strong>
                            The sum of Direct Materials and Direct Labor. These are the direct costs of production.
                        </li>
                        <li>
                            <strong className="text-slate-200 block">Conversion Cost</strong>
                            Direct Labor plus Manufacturing Overhead. The cost to convert raw materials into finished goods.
                        </li>
                        <li>
                            <strong className="text-slate-200 block">Break-Even Point</strong>
                            The sales volume at which total revenue equals total costs (neither profit nor loss).
                        </li>
                    </ul>
                </div>
                
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-primary-400">Business Metrics</h4>
                    <ul className="space-y-3 text-sm text-slate-400">
                         <li>
                            <strong className="text-slate-200 block">Gross Margin</strong>
                            The percentage of revenue exceeding the Cost of Goods Sold (COGS). Indicates profitability per item.
                        </li>
                        <li>
                            <strong className="text-slate-200 block">Markup</strong>
                            The percentage added to the cost price of goods to cover overhead and profit.
                        </li>
                         <li>
                            <strong className="text-slate-200 block">Depreciation (Straight-Line)</strong>
                            Allocating the cost of an asset evenly over its useful life.
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-primary-400">General Finance</h4>
                    <ul className="space-y-3 text-sm text-slate-400">
                        <li>
                            <strong className="text-slate-200 block">Amortization</strong>
                            The process of paying off a debt over time through regular payments of principal and interest.
                        </li>
                        <li>
                            <strong className="text-slate-200 block">Compound Interest</strong>
                            Interest calculated on the initial principal and also on the accumulated interest of previous periods.
                        </li>
                        <li>
                            <strong className="text-slate-200 block">Percentage Change</strong>
                            The difference between a new value and an old value, expressed as a percentage of the old value.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </main>
      
      <footer className="border-t border-slate-800 py-8 bg-slate-950 text-center">
        <p className="text-slate-500 text-sm">© 2024 FIN BUDGET. Built with React & Tailwind.</p>
      </footer>
    </div>
  );
};

export default App;
