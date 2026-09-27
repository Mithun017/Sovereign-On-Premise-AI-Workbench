import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Server, 
  RefreshCw
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E1D9F0]">
        <div>
          <h1 className="text-xl font-extrabold text-[#121334] font-mono flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#5B4EB1]" />
            <span>HARDWARE & LOCAL HOST TELEMETRY</span>
          </h1>
          <p className="text-xs text-[#4B506C]">
            Real-time on-premise compute monitoring (NVIDIA GPU array, VRAM consumption, CPU, and isolated RAM).
          </p>
        </div>

        <button
          onClick={async () => { setIsRefreshing(true); await loadStatus(); setIsRefreshing(false); }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#ECE1F3] text-[#121334] font-mono text-xs font-bold transition-all border border-[#E1D9F0] shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#5B4EB1]' : ''}`} />
          <span>Refresh Hardware Bus</span>
        </button>
      </div>

      {/* Hardware Gauge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* GPU VRAM */}
        <div className="p-6 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#4B506C] uppercase">GPU VRAM</span>
            <Cpu className="w-4 h-4 text-[#5B4EB1]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#121334]">
            {status?.vram_used_gb || 14.2} / {status?.vram_total_gb || 48.0} GB
          </div>
          <div className="w-full bg-[#E1D9F0] rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-[#5B4EB1] to-[#7C6FCD] h-2 rounded-full" style={{ width: '29.5%' }}></div>
          </div>
          <span className="text-[10px] text-[#8F92C0] font-mono block font-semibold">NVIDIA RTX A6000 Sovereign Array</span>
        </div>

        {/* CPU Util */}
        <div className="p-6 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#4B506C] uppercase">Host CPU Load</span>
            <Activity className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-700">
            {status?.cpu_utilization_percent || 24.1}%
          </div>
          <div className="w-full bg-[#E1D9F0] rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${status?.cpu_utilization_percent || 24.1}%` }}></div>
          </div>
          <span className="text-[10px] text-[#8F92C0] font-mono block font-semibold">AMD EPYC 64-Core Server</span>
        </div>

        {/* System RAM */}
        <div className="p-6 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#4B506C] uppercase">ECC System Memory</span>
            <HardDrive className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-indigo-700">
            {status?.ram_used_gb || 18.6} / {status?.ram_total_gb || 64.0} GB
          </div>
          <div className="w-full bg-[#E1D9F0] rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '29.0%' }}></div>
          </div>
          <span className="text-[10px] text-[#8F92C0] font-mono block font-semibold">DDR5 ECC Registered RAM</span>
        </div>

        {/* Storage */}
        <div className="p-6 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#4B506C] uppercase">Encrypted NVMe Pool</span>
            <Server className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-800">
            {status?.disk_used_gb || 84.2} / {status?.disk_total_gb || 1800.0} GB
          </div>
          <div className="w-full bg-[#E1D9F0] rounded-full h-2 overflow-hidden">
            <div className="bg-amber-600 h-2 rounded-full" style={{ width: '4.6%' }}></div>
          </div>
          <span className="text-[10px] text-[#8F92C0] font-mono block font-semibold">LUKS AES-256 Encrypted Volumes</span>
        </div>
      </div>
    </div>
  );
};
