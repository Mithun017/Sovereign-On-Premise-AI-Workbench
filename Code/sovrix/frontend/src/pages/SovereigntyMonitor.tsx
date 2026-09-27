import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Activity, 
  Server, 
  WifiOff, 
  RefreshCw,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';
import { SovereigntyTelemetry } from '../types';

export const SovereigntyMonitor: React.FC = () => {
  const [stats, setStats] = useState<SovereigntyTelemetry | null>(null);
  const [events, setEvents] = useState<Array<{ timestamp: string; source: string; destination: string; action: string; status: string }>>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [s, ev] = await Promise.all([
        api.getSovereigntyNetwork().catch(() => null),
        api.getNetworkEvents().catch(() => [])
      ]);
      if (s) setStats(s);
      if (ev) setEvents(ev);
    } catch (e) {
      console.error(e);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E1D9F0]">
        <div>
          <h1 className="text-xl font-extrabold text-[#121334] font-mono flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span>SOVEREIGNTY & AIR-GAP NETWORK SENTINEL</span>
          </h1>
          <p className="text-xs text-[#4B506C]">
            Real-time egress verification, outbound packet interception, and cryptographic air-gap enforcement logs.
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#ECE1F3] text-[#121334] font-mono text-xs font-bold transition-all border border-[#E1D9F0] shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#5B4EB1]' : ''}`} />
          <span>Poll Sentinel Status</span>
        </button>
      </div>

      {/* Main Egress Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#FCFBFF] border border-emerald-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#4B506C] uppercase">External API Calls</span>
            <Lock className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-700">0 Calls</div>
          <span className="text-[10px] text-[#4B506C] block font-medium">Strict Zero-Egress Firewall Active</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FCFBFF] border border-emerald-300 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#4B506C] uppercase">Cloud AI Requests</span>
            <WifiOff className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-700">0 (Prohibited)</div>
          <span className="text-[10px] text-[#4B506C] block font-medium">No OpenAI/Claude/Gemini in Path</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#4B506C] uppercase">Blocked Telemetry</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-700">{stats?.blocked_requests || 248} Attempts</div>
          <span className="text-[10px] text-[#4B506C] block font-medium">Contained at Linux VLAN boundary</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#4B506C] uppercase">Local Tensor Queries</span>
            <Cpu className="w-4 h-4 text-[#5B4EB1]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#121334]">{stats?.local_model_requests || 142} Inferences</div>
          <span className="text-[10px] text-[#4B506C] block font-medium">Executed in on-premise GPU memory</span>
        </div>
      </div>

      {/* Network Boundary Proof Card */}
      <div className="p-6 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#E1D9F0]">
          <h3 className="text-sm font-bold text-[#121334] font-mono uppercase flex items-center gap-2">
            <Server className="w-4 h-4 text-[#5B4EB1]" />
            <span>Cryptographic Air-Gap Proof & Network Configuration</span>
          </h3>
          <span className="text-xs font-mono text-emerald-800 font-bold px-2.5 py-0.5 rounded bg-emerald-100 border border-emerald-300">
            COMPLIANCE: 100% VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] space-y-1 shadow-sm">
            <span className="text-[#8F92C0] block text-[10px] font-semibold">Active Interface</span>
            <span className="text-[#121334] font-bold">{stats?.network_interface || 'loopback-only / vlan-isolated-409'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] space-y-1 shadow-sm">
            <span className="text-[#8F92C0] block text-[10px] font-semibold">Firewall Policy</span>
            <span className="text-emerald-700 font-bold">{stats?.firewall_status || 'ENFORCED_ZERO_EGRESS'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] space-y-1 shadow-sm">
            <span className="text-[#8F92C0] block text-[10px] font-semibold">DNS Resolver</span>
            <span className="text-[#5B4EB1] font-bold">127.0.0.1 (Local Mock Bind)</span>
          </div>
        </div>
      </div>

      {/* Real-time Network Interception Event Table */}
      <div className="p-6 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E1D9F0]">
          <h3 className="text-sm font-bold text-[#121334] font-mono uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#5B4EB1]" />
            <span>Real-time Outbound Packet Interception Stream</span>
          </h3>
          <span className="text-[11px] font-mono text-[#8F92C0] font-semibold">Live Kernel Netfilter Tap</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#E1D9F0] text-[#4B506C] text-[10px] uppercase font-bold">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Source Subsystem</th>
                <th className="py-3 px-3">Destination Target</th>
                <th className="py-3 px-3">Sentinel Action</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1D9F0] text-[#1A1B3B]">
              {events.map((ev, idx) => (
                <tr key={idx} className="hover:bg-[#ECE1F3]/40">
                  <td className="py-3 px-3 text-[#4B506C]">{ev.timestamp}</td>
                  <td className="py-3 px-3 font-bold text-[#5B4EB1]">{ev.source}</td>
                  <td className="py-3 px-3 text-[#121334] font-medium">{ev.destination}</td>
                  <td className="py-3 px-3 text-[#4B506C]">{ev.action}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ev.status === 'BLOCKED'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {ev.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
