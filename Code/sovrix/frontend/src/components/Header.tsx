import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Cpu, 
  Terminal, 
  FileCheck2, 
  Eye,
  Menu,
  PanelLeft,
  Sparkles
} from 'lucide-react';
import { AirGapIndicator } from './AirGapIndicator';

interface HeaderProps {
  onRunScenario?: (scenarioNum: number) => void;
  activeModelName?: string;
  onToggleSidebar?: () => void;
  onOpenMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onRunScenario, 
  activeModelName = 'sovrix-deepseek-r1-local',
  onToggleSidebar,
  onOpenMobileSidebar
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
    <header className="h-16 bg-[#FCFBFF]/95 backdrop-blur border-b border-[#E1D9F0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shrink-0 shadow-sm gap-3 select-none">
      {/* Left: Sidebar Toggle & Air Gap Sentinel */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Toggle Button for Mobile */}
        <button
          onClick={onOpenMobileSidebar}
          className="flex lg:hidden items-center justify-center w-9 h-9 rounded-xl bg-[#FFFFFF] hover:bg-[#ECE1F3] border border-[#E1D9F0] text-[#121334] transition-all shadow-sm shrink-0"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 text-[#5B4EB1]" />
        </button>

        {/* Toggle Button for Desktop */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-[#FFFFFF] hover:bg-[#ECE1F3] border border-[#E1D9F0] text-[#4B506C] hover:text-[#121334] transition-all shadow-sm shrink-0"
          title="Toggle Left Navigation Panel"
        >
          <PanelLeft className="w-4 h-4 text-[#5B4EB1]" />
        </button>

        <AirGapIndicator />

        {/* Active Model Indicator */}
        <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ECE1F3] border border-[#E1D9F0] text-xs font-mono text-[#121334] shadow-sm shrink-0 whitespace-nowrap">
          <Cpu className="w-3.5 h-3.5 text-[#5B4EB1] shrink-0" />
          <span className="text-[#4B506C]">Model:</span>
          <span className="text-[#121334] font-bold">{activeModelName}</span>
        </div>
      </div>

      {/* Center / Right: Quick Industrial Scenarios & User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Industrial Demo Triggers */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-[#ECE1F3]/80 border border-[#E1D9F0] text-xs shrink-0 whitespace-nowrap">
          <span className="px-2 text-[10px] font-mono text-[#4B506C] font-bold uppercase flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-[#5B4EB1]" />
            <span>Runs:</span>
          </span>
          <button
            onClick={() => handleScenarioClick(1)}
            title="Analyze inspection report, calculate MAWT deficit, generate DOCX approval note"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#E9D1F1] text-[#121334] border border-[#E1D9F0] transition-all font-medium text-xs shadow-sm shrink-0 whitespace-nowrap"
          >
            <FileCheck2 className="w-3 h-3 text-[#5B4EB1] shrink-0" />
            <span>1: Report → Word</span>
          </button>
          <button
            onClick={() => handleScenarioClick(2)}
            title="Inspect CSV, generate Python code, execute in isolated sandbox, generate XLSX"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#E9D1F1] text-[#121334] border border-[#E1D9F0] transition-all font-medium text-xs shadow-sm shrink-0 whitespace-nowrap"
          >
            <Terminal className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>2: Code → Excel</span>
          </button>
          <button
            onClick={() => handleScenarioClick(3)}
            title="Extract equipment tags from P&ID drawing with local vision model, generate PPTX"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#E9D1F1] text-[#121334] border border-[#E1D9F0] transition-all font-medium text-xs shadow-sm shrink-0 whitespace-nowrap"
          >
            <Eye className="w-3 h-3 text-purple-600 shrink-0" />
            <span>3: P&ID → Slides</span>
          </button>
        </div>

        {/* User Identity Pill - Crisp Single-Line Clean Layout */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E1D9F0] shrink-0 whitespace-nowrap">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B4EB1] to-[#7C6FCD] flex items-center justify-center text-xs font-bold text-white shadow-sm border border-[#E9D1F1] shrink-0">
            CE
          </div>
          <div className="hidden sm:flex flex-col text-left justify-center whitespace-nowrap shrink-0">
            <span className="text-xs font-bold text-[#121334] leading-tight whitespace-nowrap">
              Chief Engineer
            </span>
            <span className="text-[10px] text-[#5B4EB1] font-mono font-medium leading-tight whitespace-nowrap mt-0.5">
              Asset Integrity
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};


