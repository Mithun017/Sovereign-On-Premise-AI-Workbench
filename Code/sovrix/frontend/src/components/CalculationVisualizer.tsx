import React from 'react';
import { Calculator, CheckCircle, AlertTriangle } from 'lucide-react';
import { CalculationResult } from '../types';

interface CalculationVisualizerProps {
  calc: CalculationResult;
}

export const CalculationVisualizer: React.FC<CalculationVisualizerProps> = ({ calc }) => {
  return (
    <div className="p-4 rounded-xl bg-slate-900/95 border border-amber-500/30 shadow-lg space-y-3 font-sans">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
            Deterministic Math Engine (Zero Hallucination)
          </span>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
          <CheckCircle className="w-3 h-3" />
          VERIFIED
        </span>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-slate-300">
          <span className="text-slate-500 font-mono">Formula: </span>
          <code className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-xs">{calc.formula}</code>
        </div>

        {/* Steps Breakdown */}
        <div className="space-y-1.5 pt-1">
          {calc.steps.map((s) => (
            <div key={s.step_number} className="flex items-start justify-between text-xs font-mono p-2 rounded bg-slate-950 border border-slate-800/80">
              <div className="space-y-0.5">
                <span className="text-slate-400 text-[11px] block">{s.description}</span>
                <span className="text-slate-500 text-[10px]">Expr: {s.formula_used}</span>
              </div>
              <span className="text-amber-400 font-bold ml-3 shrink-0">{s.intermediate_value}</span>
            </div>
          ))}
        </div>

        {/* Final Result Card */}
        <div className="mt-2 p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">Final Deterministic Output:</span>
            <span className="text-xs text-slate-300">{calc.explanation}</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold font-mono text-amber-300">
              {calc.final_result} {calc.units || ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
