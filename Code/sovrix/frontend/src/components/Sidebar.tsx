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
  Lock
} from 'lucide-react';

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
    <aside className="w-64 bg-[#FCFBFF] border-r border-[#E1D9F0] flex flex-col h-screen select-none shrink-0 sticky top-0 z-30 shadow-sm">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#E1D9F0] flex flex-col gap-1 bg-[#FFFFFF]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5B4EB1] to-[#7C6FCD] flex items-center justify-center shadow-md shadow-[#5B4EB1]/20 border border-[#E9D1F1]">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider text-[#121334] font-mono">SOVRIX</span>
            <span className="text-[10px] block text-[#5B4EB1] font-semibold tracking-widest uppercase">Air-Gapped AI</span>
          </div>
        </div>
        <p className="text-[11px] text-[#4B506C] mt-1 line-clamp-1">Sovereign On-Premise AI Workbench</p>
      </div>

      {/* Air-Gap Status Mini Pill */}
      <div className="px-3 pt-3">
        <div className="p-2.5 rounded-lg bg-[#ECE1F3] border border-[#E1D9F0] flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#4B506C] uppercase">Network Boundary</span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-mono font-bold">
            <span>SECURE LOCAL ONLY</span>
          </div>
          <div className="text-[10px] text-[#8F92C0] font-mono">Ext. API Calls: 0 (Enforced)</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-mono font-bold text-[#8F92C0] tracking-wider uppercase">
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
                    ? 'bg-[#E9D1F1] text-[#121334] border border-[#E1D9F0] font-bold shadow-sm'
                    : 'text-[#4B506C] hover:text-[#121334] hover:bg-[#ECE1F3] border border-transparent'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className="w-4 h-4 shrink-0 text-[#5B4EB1] transition-transform group-hover:scale-110" />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#ECE1F3] text-[#5B4EB1] border border-[#E1D9F0]">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Telemetry Compact Footer */}
      <div className="p-3 border-t border-[#E1D9F0] bg-[#FCFBFF]">
        <div className="flex items-center justify-between text-[11px] text-[#4B506C] font-mono mb-1">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-[#5B4EB1]" />
            <span>VRAM</span>
          </span>
          <span className="text-[#121334] font-semibold">14.2 / 48 GB</span>
        </div>
        <div className="w-full bg-[#E1D9F0] rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-[#5B4EB1] to-[#7C6FCD] h-1.5 rounded-full" style={{ width: '29.5%' }}></div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#8F92C0] font-mono mt-2">
          <span>HOST: REFINERY-NODE-01</span>
          <span className="text-emerald-700 font-bold">100% AIR-GAP</span>
        </div>
      </div>
    </aside>
  );
};
