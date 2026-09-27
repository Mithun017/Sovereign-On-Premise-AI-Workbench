import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Terminal as TerminalIcon, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Cpu, 
  Lock,
  FileCode
} from 'lucide-react';
import { api } from '../services/api';
import { SandboxResult } from '../types';

const defaultPythonCode = `import pandas as pd
import numpy as np

def calculate_equipment_downtime(csv_file='equipment_downtime.csv'):
    """
    Sovereign On-Premise Industrial Reliability Pipeline.
    Calculates equipment downtime and plant availability in air-gapped sandbox.
    """
    df = pd.read_csv(csv_file)
    df['downtime_hours'] = df['downtime_minutes'] / 60.0
    
    total_hours = df['downtime_hours'].sum()
    monthly_capacity_hours = 720.0
    unit_availability_pct = ((monthly_capacity_hours - total_hours) / monthly_capacity_hours) * 100.0
    
    print("========================================")
    print("REFINERY ASSET INTEGRITY RELIABILITY REPORT")
    print("========================================")
    print(f"Total Incidents Logged: {len(df)}")
    print(f"Cumulative Plant Downtime: {total_hours:.2f} Hours")
    print(f"Overall Unit Availability: {unit_availability_pct:.2f}%")
    print("----------------------------------------")
    
    summary = df.groupby('equipment_tag').agg(
        incidents=('incident_id', 'count'),
        total_downtime=('downtime_hours', 'sum'),
        critical_count=('severity', lambda s: (s == 'CRITICAL').sum())
    ).reset_index()
    
    print(summary.to_string(index=False))
    return {
        'total_downtime': total_hours,
        'availability': unit_availability_pct,
        'critical_count': int((df['severity'] == 'CRITICAL').sum())
    }

if __name__ == '__main__':
    result = calculate_equipment_downtime()
`;

export const CodeLab: React.FC = () => {
  const [code, setCode] = useState(defaultPythonCode);
  const [isRunning, setIsRunning] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<SandboxResult | null>(null);

  const handleRunCode = async (withTests: boolean = true) => {
    setIsRunning(true);
    try {
      const tests = withTests ? [
        "assert result['total_downtime'] > 0",
        "assert result['availability'] <= 100.0",
        "assert result['critical_count'] >= 1"
      ] : [];

      const res = await api.executeCode({
        code: code,
        tests: tests,
        timeout_seconds: 10
      });
      setSandboxResult(res);
    } catch (err: any) {
      alert(`Execution error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto font-sans h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E1D9F0] shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-[#121334] font-mono flex items-center gap-2">
            <TerminalIcon className="w-5 h-5 text-[#5B4EB1]" />
            <span>SANDBOXED CODE LAB & COMPLIANCE VERIFIER</span>
          </h1>
          <p className="text-xs text-[#4B506C]">
            Isolated ephemeral Python execution environment. Network disabled, bounded resources, deterministic test assertions.
          </p>
        </div>

        {/* Action Buttons & Network Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-mono text-xs font-bold shadow-sm">
            <Lock className="w-3.5 h-3.5" />
            <span>Network: DENIED</span>
          </div>

          <button
            onClick={() => handleRunCode(true)}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#5B4EB1] hover:bg-[#4F46E5] text-white font-mono text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Running in Sandbox...' : 'Run in Sandbox & Tests'}</span>
          </button>
        </div>
      </div>

      {/* Editor + Terminal Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left: Monaco Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#FFFFFF] border border-[#E1D9F0] shadow-sm overflow-hidden min-h-0">
          <div className="p-3 bg-[#FCFBFF] border-b border-[#E1D9F0] flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-[#121334] font-bold">
              <FileCode className="w-4 h-4 text-[#5B4EB1]" />
              <span>sandbox_script.py (Isolated Scratch Space)</span>
            </span>
            <span className="text-[10px] text-[#8F92C0] font-semibold">Python 3.10 Runtime</span>
          </div>

          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs"
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Right: Sandbox Terminal & Assertion Output (5 cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm overflow-hidden min-h-0">
          <div className="p-3 bg-[#FCFBFF] border-b border-[#E1D9F0] flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-2 text-[#121334] font-bold">
              <TerminalIcon className="w-4 h-4 text-[#5B4EB1]" />
              <span>Sandbox Sentinel Terminal</span>
            </span>
            {sandboxResult && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                sandboxResult.exit_code === 0
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-50 text-rose-800 border border-rose-300'
              }`}>
                Exit: {sandboxResult.exit_code}
              </span>
            )}
          </div>

          {/* Telemetry Bar */}
          {sandboxResult && (
            <div className="px-4 py-2 bg-[#ECE1F3]/60 border-b border-[#E1D9F0] flex items-center justify-between text-[11px] font-mono text-[#4B506C]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-700" />
                <span>{sandboxResult.execution_time_ms} ms</span>
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#5B4EB1]" />
                <span>Mem: {sandboxResult.resource_usage?.memory_mb} MB</span>
              </span>
              <span className="text-emerald-800 font-bold">
                {sandboxResult.test_results?.passed || 0} / {sandboxResult.test_results?.total || 0} Tests Passed
              </span>
            </div>
          )}

          {/* Terminal Console Output */}
          <div className="flex-1 p-4 bg-[#FFFFFF] text-[#121334] font-mono text-xs overflow-y-auto leading-relaxed space-y-3">
            {sandboxResult ? (
              <div className="space-y-3">
                {sandboxResult.stdout && (
                  <pre className="text-[#121334] bg-[#ECE1F3]/40 p-3 rounded-lg border border-[#E1D9F0] whitespace-pre-wrap">{sandboxResult.stdout}</pre>
                )}
                {sandboxResult.stderr && (
                  <pre className="text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200 whitespace-pre-wrap">{sandboxResult.stderr}</pre>
                )}
                {sandboxResult.test_results?.details && sandboxResult.test_results.details.length > 0 && (
                  <div className="pt-2 border-t border-[#E1D9F0] space-y-1">
                    <span className="text-[10px] text-[#4B506C] uppercase font-bold block">Automated Assertion Log:</span>
                    {sandboxResult.test_results.details.map((d, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#121334]">
                        {d.status === 'PASSED' ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                        )}
                        <span>{d.log}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#8F92C0] space-y-2 py-12">
                <TerminalIcon className="w-8 h-8 text-[#8F92C0]" />
                <span>Terminal ready. Click "Run in Sandbox" to trigger isolated execution.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
