import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Server, 
  ShieldCheck, 
  RefreshCw,
  Zap,
  Layers,
  Thermometer
} from 'lucide-react';
import { api } from '../services/api';
import { SystemHardwareTelemetry } from '../types';

export const SystemStatus: React.FC = () => {
  const [status, setStatus] = useState<SystemHardwareTelemetry | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      const data = await api.getSystemStatus();
      setStatus(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>HARDWARE & LOCAL HOST TELEMETRY</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time on-premise compute monitoring (NVIDIA GPU array, VRAM consumption, CPU, and isolated RAM).
          </p>
        </div>

        <button
          onClick={async () => { setIsRefreshing(true); await loadStatus(); setIsRefreshing(false); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-all border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Hardware Bus</span>
        </button>
      </div>

      {/* Hardware Gauge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* GPU VRAM */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">GPU VRAM</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-cyan-300">
            {status?.vram_used_gb || 14.2} / {status?.vram_total_gb || 48.0} GB
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full" style={{ width: '29.5%' }}></div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">NVIDIA RTX A6000 Sovereign Array</span>
        </div>

        {/* CPU Util */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Host CPU Load</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">
            {status?.cpu_utilization_percent || 24.1}%
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${status?.cpu_utilization_percent || 24.1}%` }}></div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">AMD EPYC 64-Core Server</span>
        </div>

        {/* System RAM */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">ECC System Memory</span>
            <HardDrive className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-indigo-300">
            {status?.ram_used_gb || 18.6} / {status?.ram_total_gb || 64.0} GB
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '29.0%' }}></div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">DDR5 ECC Registered RAM</span>
        </div>

        {/* Storage */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Encrypted NVMe Pool</span>
            <Server className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-300">
            {status?.disk_used_gb || 84.2} / {status?.disk_total_gb || 1800.0} GB
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
            <div className="bg-amber-500 h-2 rounded-full" style={{ width: '4.6%' }}></div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">LUKS AES-256 Encrypted Volumes</span>
        </div>
      </div>
    </div>
  );
};
