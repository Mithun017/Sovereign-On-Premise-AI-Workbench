import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  FileText, 
  BookOpen, 
  Terminal, 
  FileSpreadsheet, 
  Cpu, 
  ShieldAlert, 
  Settings, 
  Activity,
  HardDrive,
  Lock,
  ChevronRight
} from 'lucide-react';
import { AirGapIndicator } from './AirGapIndicator';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const mainNavigation: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'AI Workbench', path: '/workbench', icon: Bot, badge: 'Agentic' },
  { name: 'Documents & OCR', path: '/documents', icon: FileText },
  { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
  { name: 'Code Lab (Sandbox)', path: '/code-lab', icon: Terminal, badge: 'Isolated' },
  { name: 'Deliverables Factory', path: '/deliverables', icon: FileSpreadsheet },
  { name: 'Model Registry', path: '/models', icon: Cpu },
  { name: 'Sovereignty Monitor', path: '/sovereignty', icon: ShieldAlert, badge: 'Zero Egress' },
  { name: 'Administration & Audit', path: '/admin', icon: Settings },
  { name: 'System Status', path: '/status', icon: Activity },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#090d16] border-r border-slate-800/80 flex flex-col h-screen select-none shrink-0 sticky top-0 z-30">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider text-slate-100 font-mono">SOVRIX</span>
            <span className="text-[10px] block text-cyan-400 font-semibold tracking-widest uppercase">Air-Gapped AI</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">Sovereign On-Premise AI Workbench</p>
      </div>

      {/* Air-Gap Status Mini Pill */}
      <div className="px-3 pt-3">
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-emerald-500/20 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Network Boundary</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono font-semibold">
            <span className="text-emerald-300">SECURE LOCAL ONLY</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Ext. API Calls: 0 (Enforced)</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-mono font-bold text-slate-500 tracking-wider uppercase">
          Workspace Navigation
        </div>
        {mainNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 font-semibold shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700/60">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Telemetry Compact Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            <span>VRAM</span>
          </span>
          <span className="text-slate-300 font-semibold">14.2 / 48 GB</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-1.5 rounded-full" style={{ width: '29.5%' }}></div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2">
          <span>HOST: REFINERY-NODE-01</span>
          <span className="text-emerald-400 font-bold">100% AIR-GAP</span>
        </div>
      </div>
    </aside>
  );
};
