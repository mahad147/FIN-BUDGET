
export enum CalculatorType {
  PERCENTAGE = 'percentage',
  LOAN = 'loan',
  INVESTMENT = 'investment',
  ACCOUNTING = 'accounting',
  VAT = 'vat',
  PLANNER = 'planner',
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface PercentageState {
  valueA: string;
  valueB: string;
  result: number | null;
  mode: 'XofY' | 'XisY' | 'increase';
}

export interface LoanState {
  amount: string;
  rate: string;
  years: string;
  monthlyPayment: number | null;
  totalInterest: number | null;
  totalPayment: number | null;
}

export interface InvestmentState {
  initial: string;
  contribution: string;
  rate: string;
  years: string;
  frequency: 'monthly' | 'yearly';
  futureValue: number | null;
  totalContributed: number | null;
  interestEarned: number | null;
}

export interface VATState {
  amount: string;
  rate: string;
  isInclusive: boolean;
  netAmount: number | null;
  taxAmount: number | null;
  grossAmount: number | null;
}

export interface AccountingState {
  mode: 'factory' | 'breakeven' | 'margin' | 'depreciation';
  
  // Factory Costs
  directMaterials: string;
  directLabor: string;
  overhead: string;
  
  // Break-Even
  fixedCost: string;
  variableCostPerUnit: string;
  pricePerUnit: string;
  
  // Margin
  cost: string;
  revenue: string;
  
  // Depreciation
  assetCost: string;
  salvageValue: string;
  lifeYears: string;
}

export interface AIInsightProps {
  context: string;
  data: Record<string, any>;
}
