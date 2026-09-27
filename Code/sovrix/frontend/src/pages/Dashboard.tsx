import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Cpu, 
  FileText, 
  Activity, 
  Lock, 
  Play, 
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { api } from '../services/api';
import { SystemHardwareTelemetry, AgentRun } from '../types';

const mockTelemetryData = [
  { time: '10:00', vram: 12.4, cpu: 18, gpu: 32 },
  { time: '10:15', vram: 13.1, cpu: 22, gpu: 45 },
  { time: '10:30', vram: 14.2, cpu: 28, gpu: 58 },
  { time: '10:45', vram: 14.2, cpu: 24, gpu: 38 },
  { time: '11:00', vram: 14.8, cpu: 26, gpu: 42 },
  { time: '11:15', vram: 14.2, cpu: 21, gpu: 36 },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [telemetry, setTelemetry] = useState<SystemHardwareTelemetry | null>(null);
  const [recentRuns, setRecentRuns] = useState<AgentRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [sys, runs] = await Promise.all([
        api.getSystemStatus().catch(() => null),
        api.getAgentRuns().catch(() => [])
      ]);
      if (sys) setTelemetry(sys);
      if (runs) setRecentRuns(runs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScenarioLaunch = async (scenarioNum: number) => {
    navigate(`/workbench?scenario=${scenarioNum}`);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Sovereign Hero Banner */}
      <div className="p-7 rounded-2xl bg-gradient-to-r from-[#E9D1F1] via-[#ECE1F3] to-[#E1D9F0] border border-[#E1D9F0] shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-15 pointer-events-none">
          <ShieldCheck className="w-64 h-64 text-[#5B4EB1]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                AIR-GAPPED SOVEREIGN ENVIRONMENT
              </span>
              <span className="text-xs font-mono text-[#4B506C] font-semibold">HOST: REFINERY-SECURE-NODE-01</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#121334] tracking-tight">
              Sovereign On-Premise Agentic AI Workbench
            </h1>
            <p className="text-[#4B506C] text-sm max-w-2xl leading-relaxed">
              Confidential industrial intelligence runtime. Local neural reasoning, OCR extraction, sandboxed code execution, and multi-format document generation with absolute zero external telemetry.
            </p>
          </div>

          <button
            onClick={() => navigate('/workbench')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#5B4EB1] hover:bg-[#4F46E5] text-white font-bold text-sm shadow-md transition-all border border-[#7C6FCD] shrink-0 self-start md:self-auto"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch AI Workbench</span>
          </button>
        </div>
      </div>

      {/* Sovereign Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Air-Gap Boundary */}
        <div className="p-5 rounded-2xl bg-[#FCFBFF] border border-emerald-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#4B506C] uppercase">External Egress</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-emerald-700">0 Calls</div>
            <div className="text-xs text-[#4B506C] mt-1 flex items-center gap-1 font-medium">
              <Lock className="w-3 h-3 text-emerald-700" />
              <span>Strict Air-Gap Enforced</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Local GPU Array */}
        <div className="p-5 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#4B506C] uppercase">GPU VRAM Allocated</span>
            <div className="w-8 h-8 rounded-lg bg-[#ECE1F3] border border-[#E1D9F0] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#5B4EB1]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-[#121334]">14.2 / 48 GB</div>
            <div className="text-xs text-[#4B506C] mt-1">RTX A6000 Array (29.5% Utilized)</div>
          </div>
        </div>

        {/* Metric 3: Active Knowledge Base */}
        <div className="p-5 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#4B506C] uppercase">Knowledge Chunks</span>
            <div className="w-8 h-8 rounded-lg bg-[#ECE1F3] border border-[#E1D9F0] flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#5B4EB1]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-[#121334]">512 Chunks</div>
            <div className="text-xs text-[#4B506C] mt-1">Local pgvector Indexed SOPs</div>
          </div>
        </div>

        {/* Metric 4: Configured Local Models */}
        <div className="p-5 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#4B506C] uppercase">Active Local Models</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-amber-700">4 Models</div>
            <div className="text-xs text-[#4B506C] mt-1">DeepSeek, Qwen-VL, Mistral</div>
          </div>
        </div>
      </div>

      {/* Mandatory End-to-End Scenarios Showcase (Sections 30, 31, 32) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#121334] font-mono flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#5B4EB1]" />
              <span>CORE INDUSTRIAL AGENT SCENARIOS (VERIFIED POC)</span>
            </h2>
            <p className="text-xs text-[#4B506C]">Click any scenario to execute the complete end-to-end local agent workflow</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Scenario 1 Card */}
          <div className="p-5 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] hover:border-[#5B4EB1] transition-all flex flex-col justify-between group shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-[#E9D1F1] text-[#121334] font-mono text-[10px] font-bold border border-[#E1D9F0]">
                  SCENARIO 1 (SEC 30)
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">OCR + Reasoning</span>
              </div>
              <h3 className="font-bold text-sm text-[#121334] group-hover:text-[#5B4EB1] transition-colors">
                Inspection Report → Approval Note
              </h3>
              <p className="text-xs text-[#4B506C] leading-relaxed">
                Uploads scanned CDU-101 pipe ultrasonic inspection, performs local neural OCR, retrieves SOP-INS-2025 from pgvector, computes 1.08mm deficit deterministically, and generates real DOCX deliverable.
              </p>
            </div>
            <button
              onClick={() => handleScenarioLaunch(1)}
              className="mt-4 flex items-center justify-between w-full px-3 py-2 rounded-lg bg-[#ECE1F3] group-hover:bg-[#5B4EB1] text-xs font-bold text-[#121334] group-hover:text-white transition-all"
            >
              <span>Execute Scenario 1</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scenario 2 Card */}
          <div className="p-5 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] hover:border-emerald-500 transition-all flex flex-col justify-between group shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold border border-emerald-300">
                  SCENARIO 2 (SEC 31)
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">Code Sandbox</span>
              </div>
              <h3 className="font-bold text-sm text-[#121334] group-hover:text-emerald-700 transition-colors">
                Downtime Analytics → Python & Excel
              </h3>
              <p className="text-xs text-[#4B506C] leading-relaxed">
                Inspects refinery equipment downtime CSV, synthesizes Python processing script, runs assertions in isolated sandbox with Network: DENIED, and builds structured XLSX workbook with formulas.
              </p>
            </div>
            <button
              onClick={() => handleScenarioLaunch(2)}
              className="mt-4 flex items-center justify-between w-full px-3 py-2 rounded-lg bg-[#ECE1F3] group-hover:bg-emerald-600 text-xs font-bold text-[#121334] group-hover:text-white transition-all"
            >
              <span>Execute Scenario 2</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scenario 3 Card */}
          <div className="p-5 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] hover:border-purple-500 transition-all flex flex-col justify-between group shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-purple-100 text-purple-900 font-mono text-[10px] font-bold border border-purple-300">
                  SCENARIO 3 (SEC 32)
                </span>
                <span className="text-[10px] font-mono text-purple-700 font-bold">Local Vision Model</span>
              </div>
              <h3 className="font-bold text-sm text-[#121334] group-hover:text-purple-700 transition-colors">
                Engineering P&ID Drawing → Presentation
              </h3>
              <p className="text-xs text-[#4B506C] leading-relaxed">
                Feeds engineering P&ID drawing to local vision model (Qwen2-VL), extracts tags (P-101A/B, E-104, V-102), reasons over flow loops, and generates executive PowerPoint (.PPTX) slides.
              </p>
            </div>
            <button
              onClick={() => handleScenarioLaunch(3)}
              className="mt-4 flex items-center justify-between w-full px-3 py-2 rounded-lg bg-[#ECE1F3] group-hover:bg-purple-600 text-xs font-bold text-[#121334] group-hover:text-white transition-all"
            >
              <span>Execute Scenario 3</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry & Recent Agent Executions Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Hardware Telemetry Graph */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E1D9F0]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#5B4EB1]" />
              <span className="text-xs font-bold text-[#121334] uppercase font-mono">
                Hardware Telemetry (Zero Remote Reporting)
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#8F92C0]">Internal Bus Interval: 1s</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTelemetryData}>
                <defs>
                  <linearGradient id="vramGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B4EB1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5B4EB1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E9D1F1" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#E9D1F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#8F92C0" fontSize={11} />
                <YAxis stroke="#8F92C0" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#FCFBFF', borderColor: '#E1D9F0', fontSize: '11px', color: '#121334', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="gpu" stroke="#7C6FCD" fillOpacity={1} fill="url(#gpuGrad)" name="GPU Util %" />
                <Area type="monotone" dataKey="vram" stroke="#5B4EB1" fillOpacity={1} fill="url(#vramGrad)" name="VRAM (GB)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Recent Agent Runs */}
        <div className="p-6 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E1D9F0]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5B4EB1]" />
                <span className="text-xs font-bold text-[#121334] uppercase font-mono">Recent Agent Runs</span>
              </div>
              <button 
                onClick={() => navigate('/admin')}
                className="text-[11px] text-[#5B4EB1] font-bold hover:underline font-mono"
              >
                Audit Log
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {recentRuns.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#8F92C0] font-mono">
                  No previous agent runs recorded. Run Scenario 1, 2, or 3 above.
                </div>
              ) : (
                recentRuns.slice(0, 4).map((r) => (
                  <div key={r.id} className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E9D1F1] text-[#121334] font-bold border border-[#E1D9F0]">
                        {r.task_classification}
                      </span>
                      <span className="text-[10px] font-mono text-[#8F92C0]">{r.duration_ms}ms</span>
                    </div>
                    <p className="text-xs text-[#1A1B3B] font-semibold line-clamp-1">{r.task_prompt}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#4B506C]">
                      <span>Model: {r.selected_model}</span>
                      <span className="text-emerald-700 font-bold">{r.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/workbench')}
            className="w-full py-2.5 rounded-xl bg-[#ECE1F3] hover:bg-[#E9D1F1] text-xs font-mono text-[#121334] font-bold transition-all border border-[#E1D9F0]"
          >
            Open Interactive Console
          </button>
        </div>
      </div>
    </div>
  );
};
