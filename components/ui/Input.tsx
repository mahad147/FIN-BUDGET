
import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, prefix, suffix, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-slate-400">{label}</label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-slate-500 text-sm font-medium pointer-events-none flex items-center justify-center">
            {prefix}
          </span>
        )}
        <input
          className={`
            w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 
            ${prefix ? 'pl-10' : 'pl-3'} 
            ${suffix ? 'pr-10' : 'pr-3'} 
            text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all
          `}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 text-slate-500 text-sm font-medium pointer-events-none flex items-center justify-center">
            {suffix}
          </span>
        )}
      </div>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
};
