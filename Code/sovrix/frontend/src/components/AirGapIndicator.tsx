import React from 'react';
import { ShieldCheck, Lock, Activity } from 'lucide-react';

interface AirGapIndicatorProps {
  compact?: boolean;
}

export const AirGapIndicator: React.FC<AirGapIndicatorProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span>AIR-GAPPED</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono shadow-inner">
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span className="font-bold tracking-wider">AIR-GAPPED ENFORCED</span>
      </div>
      <span className="text-slate-600">|</span>
      <div className="flex items-center gap-1 text-slate-300">
        <Lock className="w-3.5 h-3.5 text-cyan-400" />
        <span>Ext. Calls: <strong className="text-emerald-400 font-bold">0</strong></span>
      </div>
      <span className="text-slate-600">|</span>
      <div className="flex items-center gap-1 text-slate-300">
        <Activity className="w-3.5 h-3.5 text-indigo-400" />
        <span>VLAN: 409-ISOLATED</span>
      </div>
    </div>
  );
};
