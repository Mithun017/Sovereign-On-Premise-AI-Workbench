import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldCheck
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E1D9F0]">
        <div>
          <h1 className="text-xl font-extrabold text-[#121334] font-mono flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#5B4EB1]" />
            <span>IMMUTABLE ENTERPRISE AUDIT TRAIL</span>
          </h1>
          <p className="text-xs text-[#4B506C]">
            Cryptographically sealed provenance log for every local inference, tool invocation, and document access.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 font-bold shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Tamper-Resistant Local Log</span>
        </div>
      </div>

      {/* Multi-Field Filters Bar */}
      <div className="p-5 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono shadow-sm">
        <div>
          <label className="text-[#4B506C] text-[10px] uppercase font-bold block mb-1">Action Type</label>
          <input
            type="text"
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            placeholder="e.g. STEP_OCR, DELIVERABLE"
            className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] text-[#121334] focus:outline-none focus:border-[#5B4EB1]"
          />
        </div>

        <div>
          <label className="text-[#4B506C] text-[10px] uppercase font-bold block mb-1">Model Used</label>
          <input
            type="text"
            value={modelFilter}
            onChange={e => setModelFilter(e.target.value)}
            placeholder="e.g. deepseek, qwen"
            className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] text-[#121334] focus:outline-none focus:border-[#5B4EB1]"
          />
        </div>

        <div>
          <label className="text-[#4B506C] text-[10px] uppercase font-bold block mb-1">Tool Invoked</label>
          <input
            type="text"
            value={toolFilter}
            onChange={e => setToolFilter(e.target.value)}
            placeholder="e.g. OCRTool, WordTool"
            className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] text-[#121334] focus:outline-none focus:border-[#5B4EB1]"
          />
        </div>

        <div>
          <label className="text-[#4B506C] text-[10px] uppercase font-bold block mb-1">Result Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] text-[#121334] focus:outline-none focus:border-[#5B4EB1] font-medium"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-[#ECE1F3]/60 border-b border-[#E1D9F0] text-[#4B506C] text-[10px] uppercase tracking-wider font-bold">
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
            <tbody className="divide-y divide-[#E1D9F0] text-[#1A1B3B]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#8F92C0]">
                    No audit records matching filter parameters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#ECE1F3]/40">
                    <td className="py-3.5 px-4 text-[#4B506C]">{log.timestamp}</td>
                    <td className="py-3.5 px-4 text-[#5B4EB1] font-bold">{log.user_name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#ECE1F3] text-[#121334] font-semibold border border-[#E1D9F0] text-[10px]">
                        {log.action_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#121334] font-medium max-w-xs truncate">{log.task_name || '-'}</td>
                    <td className="py-3.5 px-4 text-[#5B4EB1]">{log.model_used || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-amber-700 font-semibold">{log.tool_used || '-'}</td>
                    <td className="py-3.5 px-4 text-[#4B506C]">{log.execution_duration_ms}ms</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.result_status === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-50 text-rose-800 border border-rose-300'
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
