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
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const mainNavigation: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'AI Workbench', path: '/workbench', icon: Bot, badge: 'Agentic', badgeColor: 'bg-[#ECE1F3] text-[#5B4EB1]' },
  { name: 'Documents & OCR', path: '/documents', icon: FileText },
  { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
  { name: 'Code Lab (Sandbox)', path: '/code-lab', icon: Terminal, badge: 'Isolated', badgeColor: 'bg-purple-100 text-purple-700' },
  { name: 'Deliverables Factory', path: '/deliverables', icon: FileSpreadsheet },
  { name: 'Model Registry', path: '/models', icon: Cpu },
  { name: 'Sovereignty Monitor', path: '/sovereignty', icon: ShieldAlert, badge: 'Zero Egress', badgeColor: 'bg-emerald-100 text-emerald-800' },
  { name: 'Administration & Audit', path: '/admin', icon: Settings },
  { name: 'System Status', path: '/status', icon: Activity },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-[#121334]/30 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen z-40 bg-[#FCFBFF] border-r border-[#E1D9F0]
          flex flex-col select-none transition-all duration-300 ease-in-out shadow-sm
          ${isCollapsed ? 'lg:w-[76px]' : 'lg:w-72'}
          ${mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="p-3.5 border-b border-[#E1D9F0] flex items-center justify-between bg-[#FFFFFF] min-h-[64px]">
          {(!isCollapsed || mobileOpen) ? (
            <>
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B4EB1] to-[#7C6FCD] flex items-center justify-center shadow-md shadow-[#5B4EB1]/20 border border-[#E9D1F1] shrink-0">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base tracking-wider text-[#121334] font-mono leading-none">
                      SOVRIX
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#ECE1F3] text-[#5B4EB1] font-bold font-mono uppercase tracking-wider">
                      v1.0
                    </span>
                  </div>
                  <span className="text-[10px] block text-[#5B4EB1] font-bold tracking-widest uppercase mt-0.5">
                    Air-Gapped AI
                  </span>
                </div>
              </div>

              {/* Desktop Collapse Toggle */}
              <button
                onClick={() => setIsCollapsed(prev => !prev)}
                title="Collapse Sidebar"
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#ECE1F3] text-[#4B506C] hover:text-[#121334] transition-colors"
              >
                <PanelLeftClose className="w-4 h-4 text-[#4B506C]" />
              </button>

              {/* Mobile Close Button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="flex lg:hidden items-center justify-center w-8 h-8 rounded-lg hover:bg-[#ECE1F3] text-[#4B506C]"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            /* When Closed / Collapsed: Clean single centered Expand button with no clipped lock icon */
            <div className="w-full flex items-center justify-center">
              <button
                onClick={() => setIsCollapsed(false)}
                title="Expand Sidebar"
                className="w-10 h-10 rounded-xl bg-[#ECE1F3] hover:bg-[#E9D1F1] border border-[#E1D9F0] text-[#5B4EB1] flex items-center justify-center shadow-sm transition-all hover:scale-105"
              >
                <PanelLeftOpen className="w-5 h-5 text-[#5B4EB1]" />
              </button>
            </div>
          )}
        </div>

        {/* Air-Gap Status Mini Pill (Hidden when collapsed) */}
        {(!isCollapsed || mobileOpen) ? (
          <div className="px-3.5 pt-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#ECE1F3] to-[#FCFBFF] border border-[#E1D9F0] flex flex-col gap-1 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#4B506C] uppercase tracking-wider">
                  Network Boundary
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-mono font-bold mt-0.5">
                <span>SECURE LOCAL ONLY</span>
              </div>
              <div className="text-[10px] text-[#8F92C0] font-mono">
                Ext. API Calls: 0 (Strict Enforced)
              </div>
            </div>
          </div>
        ) : (
          <div className="px-2 pt-3 flex justify-center">
            <div 
              title="Air-Gap Enforced: Zero External Egress" 
              className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {(!isCollapsed || mobileOpen) && (
            <div className="px-2.5 py-1 text-[10px] font-mono font-bold text-[#8F92C0] tracking-wider uppercase">
              Workspace Navigation
            </div>
          )}

          {mainNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileOpen(false)}
                title={isCollapsed && !mobileOpen ? item.name : undefined}
                className={({ isActive }) =>
                  `relative flex items-center rounded-xl text-xs font-medium transition-all group ${
                    isCollapsed && !mobileOpen
                      ? 'justify-center p-3'
                      : 'justify-between px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[#E9D1F1] text-[#121334] border border-[#E1D9F0] font-bold shadow-sm'
                      : 'text-[#4B506C] hover:text-[#121334] hover:bg-[#ECE1F3] border border-transparent'
                  }`
                }
              >
                <div className={`flex items-center gap-3 min-w-0 ${isCollapsed && !mobileOpen ? 'justify-center' : ''}`}>
                  <Icon className="w-4 h-4 shrink-0 text-[#5B4EB1] transition-transform group-hover:scale-110" />
                  {(!isCollapsed || mobileOpen) && (
                    <span className="truncate text-xs font-sans tracking-tight">
                      {item.name}
                    </span>
                  )}
                </div>

                {(!isCollapsed || mobileOpen) && item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold whitespace-nowrap shrink-0 ml-1 border border-[#E1D9F0] ${item.badgeColor || 'bg-[#ECE1F3] text-[#5B4EB1]'}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Telemetry Compact Footer */}
        {(!isCollapsed || mobileOpen) ? (
          <div className="p-3.5 border-t border-[#E1D9F0] bg-[#FCFBFF] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#4B506C] font-mono">
              <span className="flex items-center gap-1.5 font-bold text-[#121334]">
                <HardDrive className="w-3.5 h-3.5 text-[#5B4EB1]" />
                <span>GPU VRAM</span>
              </span>
              <span className="text-[#121334] font-bold">14.2 / 48 GB</span>
            </div>
            <div className="w-full bg-[#E1D9F0] rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#5B4EB1] to-[#7C6FCD] h-1.5 rounded-full" 
                style={{ width: '29.5%' }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#8F92C0] font-mono pt-1">
              <span className="truncate">NODE: REFINERY-01</span>
              <span className="text-emerald-700 font-bold shrink-0">100% AIR-GAP</span>
            </div>
          </div>
        ) : (
          <div className="p-2.5 border-t border-[#E1D9F0] bg-[#FCFBFF] flex flex-col items-center gap-1" title="VRAM: 14.2/48 GB">
            <HardDrive className="w-4 h-4 text-[#5B4EB1]" />
            <span className="text-[9px] font-mono text-[#4B506C] font-bold">30%</span>
          </div>
        )}
      </aside>
    </>
  );
};

