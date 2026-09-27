import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  ShieldCheck, 
  Cpu, 
  UserCheck, 
  Terminal, 
  FileCheck2, 
  Eye
} from 'lucide-react';
import { AirGapIndicator } from './AirGapIndicator';

interface HeaderProps {
  onRunScenario?: (scenarioNum: number) => void;
  activeModelName?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onRunScenario, 
  activeModelName = 'sovrix-deepseek-r1-local' 
}) => {
  const navigate = useNavigate();

  const handleScenarioClick = (num: number) => {
    if (onRunScenario) {
      onRunScenario(num);
    } else {
      navigate(`/workbench?scenario=${num}`);
    }
  };

  return (
    <header className="h-16 bg-[#090d16]/90 backdrop-blur border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Left: Air Gap Badge & Telemetry */}
      <div className="flex items-center gap-4">
        <AirGapIndicator />
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Model:</span>
          <span className="text-cyan-300 font-semibold">{activeModelName}</span>
        </div>
      </div>

      {/* Center / Right: Quick Industrial Scenario Triggers */}
      <div className="flex items-center gap-3">
        <div className="hidden xl:flex items-center gap-1.5 p-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
          <span className="px-2 text-[10px] font-mono text-slate-400 font-bold uppercase">Quick Demos:</span>
          <button
            onClick={() => handleScenarioClick(1)}
            title="Analyze inspection report, calculate MAWT deficit, generate DOCX approval note"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-500/50 border border-slate-700/50 text-slate-300 transition-all font-medium text-xs"
          >
            <FileCheck2 className="w-3 h-3 text-cyan-400" />
            <span>1: Inspection Report → Word</span>
          </button>
          <button
            onClick={() => handleScenarioClick(2)}
            title="Inspect CSV, generate Python code, execute in isolated sandbox, generate XLSX"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-500/50 border border-slate-700/50 text-slate-300 transition-all font-medium text-xs"
          >
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span>2: Downtime Code → Excel</span>
          </button>
          <button
            onClick={() => handleScenarioClick(3)}
            title="Extract equipment tags from P&ID drawing with local vision model, generate PPTX"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-indigo-950 hover:text-indigo-300 hover:border-indigo-500/50 border border-slate-700/50 text-slate-300 transition-all font-medium text-xs"
          >
            <Eye className="w-3 h-3 text-indigo-400" />
            <span>3: P&ID Drawing → Slides</span>
          </button>
        </div>

        {/* User Identity */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
          <div className="w-7 h-7 rounded bg-gradient-to-tr from-cyan-600 to-slate-700 flex items-center justify-center text-xs font-bold text-white shadow border border-cyan-400/30">
            CE
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-200">Chief Engineer</div>
            <div className="text-[10px] text-cyan-400 font-mono">Asset Integrity Dept</div>
          </div>
        </div>
      </div>
    </header>
  );
};
