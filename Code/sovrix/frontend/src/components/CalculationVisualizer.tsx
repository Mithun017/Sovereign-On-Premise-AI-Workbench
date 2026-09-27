import React from 'react';
import { Calculator, CheckCircle } from 'lucide-react';
import { CalculationResult } from '../types';

interface CalculationVisualizerProps {
  calc: CalculationResult;
}

export const CalculationVisualizer: React.FC<CalculationVisualizerProps> = ({ calc }) => {
  return (
    <div className="p-4 rounded-xl bg-[#FCFBFF] border border-amber-300 shadow-md space-y-3 font-sans">
      <div className="flex items-center justify-between pb-2 border-b border-[#E1D9F0]">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-[#121334] uppercase tracking-wider font-mono">
            Deterministic Math Engine (Zero Hallucination)
          </span>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold">
          <CheckCircle className="w-3 h-3" />
          VERIFIED
        </span>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-[#1A1B3B]">
          <span className="text-[#4B506C] font-mono">Formula: </span>
          <code className="px-2 py-0.5 rounded bg-[#ECE1F3] text-[#121334] font-mono text-xs font-bold border border-[#E1D9F0]">{calc.formula}</code>
        </div>

        {/* Steps Breakdown */}
        <div className="space-y-1.5 pt-1">
          {calc.steps.map((s) => (
            <div key={s.step_number} className="flex items-start justify-between text-xs font-mono p-2 rounded bg-[#FFFFFF] border border-[#E1D9F0] shadow-sm">
              <div className="space-y-0.5">
                <span className="text-[#121334] text-[11px] font-medium block">{s.description}</span>
                <span className="text-[#8F92C0] text-[10px]">Expr: {s.formula_used}</span>
              </div>
              <span className="text-amber-700 font-bold ml-3 shrink-0">{s.intermediate_value}</span>
            </div>
          ))}
        </div>

        {/* Final Result Card */}
        <div className="mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-800 font-bold block">Final Deterministic Output:</span>
            <span className="text-xs text-[#4B506C]">{calc.explanation}</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold font-mono text-amber-800">
              {calc.final_result} {calc.units || ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
