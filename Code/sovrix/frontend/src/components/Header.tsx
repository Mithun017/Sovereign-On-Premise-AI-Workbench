import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Cpu, 
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
    <header className="h-16 bg-[#FCFBFF]/90 backdrop-blur border-b border-[#E1D9F0] px-6 flex items-center justify-between sticky top-0 z-20 shrink-0 shadow-sm">
      {/* Left: Air Gap Badge & Telemetry */}
      <div className="flex items-center gap-4">
        <AirGapIndicator />
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ECE1F3] border border-[#E1D9F0] text-xs font-mono text-[#121334]">
          <Cpu className="w-3.5 h-3.5 text-[#5B4EB1]" />
          <span className="text-[#4B506C]">Model:</span>
          <span className="text-[#121334] font-bold">{activeModelName}</span>
        </div>
      </div>

      {/* Center / Right: Quick Industrial Scenario Triggers */}
      <div className="flex items-center gap-3">
        <div className="hidden xl:flex items-center gap-1.5 p-1 rounded-lg bg-[#ECE1F3]/80 border border-[#E1D9F0] text-xs">
          <span className="px-2 text-[10px] font-mono text-[#4B506C] font-bold uppercase">Quick Demos:</span>
          <button
            onClick={() => handleScenarioClick(1)}
            title="Analyze inspection report, calculate MAWT deficit, generate DOCX approval note"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#FFFFFF] hover:bg-[#E9D1F1] text-[#121334] border border-[#E1D9F0] transition-all font-medium text-xs shadow-sm"
          >
            <FileCheck2 className="w-3 h-3 text-[#5B4EB1]" />
            <span>1: Inspection Report → Word</span>
          </button>
          <button
            onClick={() => handleScenarioClick(2)}
            title="Inspect CSV, generate Python code, execute in isolated sandbox, generate XLSX"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#FFFFFF] hover:bg-[#E9D1F1] text-[#121334] border border-[#E1D9F0] transition-all font-medium text-xs shadow-sm"
          >
            <Terminal className="w-3 h-3 text-emerald-600" />
            <span>2: Downtime Code → Excel</span>
          </button>
          <button
            onClick={() => handleScenarioClick(3)}
            title="Extract equipment tags from P&ID drawing with local vision model, generate PPTX"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#FFFFFF] hover:bg-[#E9D1F1] text-[#121334] border border-[#E1D9F0] transition-all font-medium text-xs shadow-sm"
          >
            <Eye className="w-3 h-3 text-purple-600" />
            <span>3: P&ID Drawing → Slides</span>
          </button>
        </div>

        {/* User Identity */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#E1D9F0]">
          <div className="w-7 h-7 rounded bg-gradient-to-tr from-[#5B4EB1] to-[#7C6FCD] flex items-center justify-center text-xs font-bold text-white shadow border border-[#E9D1F1]">
            CE
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-[#121334]">Chief Engineer</div>
            <div className="text-[10px] text-[#5B4EB1] font-mono font-medium">Asset Integrity Dept</div>
          </div>
        </div>
      </div>
    </header>
  );
};
