import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Activity, 
  HardDrive, 
  ShieldCheck,
  Eye,
  Terminal,
  Calculator,
  Sliders
} from 'lucide-react';
import { api } from '../services/api';
import { AIModel } from '../types';

export const ModelRegistry: React.FC = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [isHealthChecking, setIsHealthChecking] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);

  // New model form state
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    provider: 'ollama',
    endpoint: 'http://127.0.0.1:11434',
    context_length: 32768,
    vram_requirement_gb: 8.0,
    vision_support: false,
    coding_support: true,
    reasoning_support: true,
    ocr_support: false,
    spreadsheet_support: true,
    priority: 1
  });

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const data = await api.getModels();
      setModels(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleHealthCheck = async (modelId: string) => {
    setIsHealthChecking(prev => ({ ...prev, [modelId]: true }));
    try {
      const res = await api.checkModelHealth(modelId);
      setModels(prev => prev.map(m => m.id === modelId ? { ...m, health_status: res.status as any, last_health_check: new Date().toISOString() } : m));
    } catch (e: any) {
      alert(`Health check failed: ${e.message}`);
    } finally {
      setIsHealthChecking(prev => ({ ...prev, [modelId]: false }));
    }
  };

  const handleToggle = async (modelId: string) => {
    try {
      const res = await api.toggleModel(modelId);
      setModels(prev => prev.map(m => m.id === modelId ? { ...m, is_enabled: res.is_enabled } : m));
    } catch (e: any) {
      alert(`Toggle failed: ${e.message}`);
    }
  };

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newModel = await api.registerModel(formData);
      setModels(prev => [...prev, newModel]);
      setShowAddModal(false);
      setFormData({
        name: '',
        identifier: '',
        provider: 'ollama',
        endpoint: 'http://127.0.0.1:11434',
        context_length: 32768,
        vram_requirement_gb: 8.0,
        vision_support: false,
        coding_support: true,
        reasoning_support: true,
        ocr_support: false,
        spreadsheet_support: true,
        priority: 1
      });
    } catch (e: any) {
      alert(`Failed to add model: ${e.message}`);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white font-mono flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>LOCAL MODEL REGISTRY & ADAPTER CONFIGURATION</span>
          </h1>
          <p className="text-xs text-slate-400">
            Configure local inference endpoints (Ollama, vLLM, llama.cpp, Sovereign Embedded) with zero hardcoding.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs font-mono transition-all shadow-lg shadow-cyan-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Local Model</span>
        </button>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {models.map(m => (
          <div key={m.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-100">{m.name}</h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                    m.health_status === 'ONLINE'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border-rose-800'
                  }`}>
                    {m.health_status}
                  </span>
                </div>
                <code className="text-xs font-mono text-cyan-400 block">{m.identifier}</code>
              </div>

              <span className="text-xs font-mono uppercase px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                {m.provider}
              </span>
            </div>

            {/* Capabilities Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {m.reasoning_support && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Reasoning
                </span>
              )}
              {m.coding_support && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Coding
                </span>
              )}
              {m.vision_support && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Vision / Multimodal
                </span>
              )}
              {m.ocr_support && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  OCR Engine
                </span>
              )}
              {m.spreadsheet_support && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Spreadsheet
                </span>
              )}
            </div>

            {/* Technical Parameters Table */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Context Window</span>
                <span className="text-slate-300 font-semibold">{(m.context_length / 1024).toFixed(0)}k tokens</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">VRAM Required</span>
                <span className="text-slate-300 font-semibold">{m.vram_requirement_gb} GB</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Priority</span>
                <span className="text-slate-300 font-semibold">Rank #{m.priority}</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
              <span className="text-slate-500 text-[10px] truncate max-w-[200px]">
                Endpoint: {m.endpoint}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleHealthCheck(m.id)}
                  disabled={isHealthChecking[m.id]}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-xs"
                >
                  <RefreshCw className={`w-3 h-3 ${isHealthChecking[m.id] ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>Test Health</span>
                </button>

                <button
                  onClick={() => handleToggle(m.id)}
                  className={`px-2.5 py-1 rounded font-bold text-xs transition-all ${
                    m.is_enabled
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {m.is_enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Model Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 font-mono">Register Local Model Adapter</h3>
            
            <form onSubmit={handleAddModel} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-mono block mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Llama-3.3-70B-Instruct"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Identifier</label>
                  <input
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                    placeholder="llama-3.3-70b"
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono block mb-1">Provider</label>
                  <select
                    value={formData.provider}
                    onChange={e => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ollama">Ollama</option>
                    <option value="vllm">vLLM</option>
                    <option value="llamacpp">llama.cpp</option>
                    <option value="sovrix_local">Sovereign Local</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono block mb-1">Local Host Endpoint</label>
                <input
                  type="text"
                  required
                  value={formData.endpoint}
                  onChange={e => setFormData({ ...formData, endpoint: e.target.value })}
                  placeholder="http://127.0.0.1:11434"
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-semibold shadow-md"
                >
                  Save Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
