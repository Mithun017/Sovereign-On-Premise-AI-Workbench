import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Cpu,
  Wrench,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { AuditLogItem } from '../types';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [actionFilter, setActionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [toolFilter, setToolFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [actionFilter, statusFilter, modelFilter, toolFilter]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (actionFilter) params.action = actionFilter;
      if (statusFilter) params.status = statusFilter;
      if (modelFilter) params.model = modelFilter;
      if (toolFilter) params.tool = toolFilter;

      const data = await api.getAuditLogs(params);
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>IMMUTABLE ENTERPRISE AUDIT TRAIL</span>
          </h1>
          <p className="text-xs text-slate-400">
            Cryptographically sealed provenance log for every local inference, tool invocation, and document access.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-800">
          <ShieldCheck className="w-4 h-4" />
          <span>Tamper-Resistant Local Log</span>
        </div>
      </div>

      {/* Multi-Field Filters Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div>
          <label className="text-slate-400 text-[10px] uppercase block mb-1">Action Type</label>
          <input
            type="text"
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            placeholder="e.g. STEP_OCR, DELIVERABLE"
            className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="text-slate-400 text-[10px] uppercase block mb-1">Model Used</label>
          <input
            type="text"
            value={modelFilter}
            onChange={e => setModelFilter(e.target.value)}
            placeholder="e.g. deepseek, qwen"
            className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="text-slate-400 text-[10px] uppercase block mb-1">Tool Invoked</label>
          <input
            type="text"
            value={toolFilter}
            onChange={e => setToolFilter(e.target.value)}
            placeholder="e.g. OCRTool, WordTool"
            className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="text-slate-400 text-[10px] uppercase block mb-1">Result Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full p-2 rounded bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator / Agent</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Task / Step Description</th>
                <th className="py-3 px-4">Model Adapter</th>
                <th className="py-3 px-4">Tool</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No audit records matching filter parameters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                    <td className="py-3 px-4 text-cyan-300 font-bold">{log.user_name}</td>
                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                        {log.action_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-200 max-w-xs truncate">{log.task_name || '-'}</td>
                    <td className="py-3 px-4 text-indigo-300">{log.model_used || 'N/A'}</td>
                    <td className="py-3 px-4 text-amber-300">{log.tool_used || '-'}</td>
                    <td className="py-3 px-4 text-slate-400">{log.execution_duration_ms}ms</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.result_status === 'SUCCESS'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                      }`}>
                        {log.result_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
