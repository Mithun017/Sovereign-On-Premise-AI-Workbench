import React from 'react';
import { ShieldCheck, Lock, Activity } from 'lucide-react';

interface AirGapIndicatorProps {
  compact?: boolean;
}

export const AirGapIndicator: React.FC<AirGapIndicatorProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-semibold shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span>AIR-GAPPED</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-emerald-50/80 border border-emerald-300/80 text-emerald-800 text-xs font-mono shadow-sm">
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
        <span className="font-bold tracking-wider">AIR-GAPPED ENFORCED</span>
      </div>
      <span className="text-emerald-300">|</span>
      <div className="flex items-center gap-1 text-[#4B506C]">
        <Lock className="w-3.5 h-3.5 text-[#5B4EB1]" />
        <span>Ext. Calls: <strong className="text-emerald-700 font-bold">0</strong></span>
      </div>
      <span className="text-emerald-300">|</span>
      <div className="flex items-center gap-1 text-[#4B506C]">
        <Activity className="w-3.5 h-3.5 text-[#5B4EB1]" />
        <span>VLAN: 409-ISOLATED</span>
      </div>
    </div>
  );
};
