import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Plus, 
  RefreshCw
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E1D9F0]">
        <div>
          <h1 className="text-xl font-extrabold text-[#121334] font-mono flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#5B4EB1]" />
            <span>LOCAL MODEL REGISTRY & ADAPTER CONFIGURATION</span>
          </h1>
          <p className="text-xs text-[#4B506C]">
            Configure local inference endpoints (Ollama, vLLM, llama.cpp, Sovereign Embedded) with zero hardcoding.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5B4EB1] hover:bg-[#4F46E5] text-white font-bold text-xs font-mono transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Local Model</span>
        </button>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {models.map(m => (
          <div key={m.id} className="p-6 rounded-2xl bg-[#FCFBFF] border border-[#E1D9F0] shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#121334]">{m.name}</h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                    m.health_status === 'ONLINE'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}>
                    {m.health_status}
                  </span>
                </div>
                <code className="text-xs font-mono text-[#5B4EB1] font-semibold block">{m.identifier}</code>
              </div>

              <span className="text-xs font-mono uppercase px-2.5 py-1 rounded bg-[#ECE1F3] text-[#121334] border border-[#E1D9F0] font-bold">
                {m.provider}
              </span>
            </div>

            {/* Capabilities Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {m.reasoning_support && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E9D1F1] text-[#121334] font-bold border border-[#E1D9F0]">
                  Reasoning
                </span>
              )}
              {m.coding_support && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                  Coding
                </span>
              )}
              {m.vision_support && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold border border-purple-300">
                  Vision / Multimodal
                </span>
              )}
              {m.ocr_support && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ECE1F3] text-[#5B4EB1] font-bold border border-[#E1D9F0]">
                  OCR Engine
                </span>
              )}
              {m.spreadsheet_support && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  Spreadsheet
                </span>
              )}
            </div>

            {/* Technical Parameters Table */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] text-xs font-mono shadow-sm">
              <div>
                <span className="text-[10px] text-[#8F92C0] block font-semibold">Context Window</span>
                <span className="text-[#121334] font-bold">{(m.context_length / 1024).toFixed(0)}k tokens</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8F92C0] block font-semibold">VRAM Required</span>
                <span className="text-[#121334] font-bold">{m.vram_requirement_gb} GB</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8F92C0] block font-semibold">Priority</span>
                <span className="text-[#121334] font-bold">Rank #{m.priority}</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E1D9F0] text-xs font-mono">
              <span className="text-[#4B506C] text-[10px] truncate max-w-[200px]">
                Endpoint: {m.endpoint}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleHealthCheck(m.id)}
                  disabled={isHealthChecking[m.id]}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ECE1F3] hover:bg-[#E9D1F1] text-[#121334] font-bold transition-all text-xs border border-[#E1D9F0]"
                >
                  <RefreshCw className={`w-3 h-3 ${isHealthChecking[m.id] ? 'animate-spin text-[#5B4EB1]' : ''}`} />
                  <span>Test Health</span>
                </button>

                <button
                  onClick={() => handleToggle(m.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    m.is_enabled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#ECE1F3] text-[#8F92C0]'
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFFFFF] border border-[#E1D9F0] rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[#121334] font-mono">Register Local Model Adapter</h3>
            
            <form onSubmit={handleAddModel} className="space-y-3 text-xs">
              <div>
                <label className="text-[#4B506C] font-mono font-bold block mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Llama-3.3-70B-Instruct"
                  className="w-full p-2.5 rounded-lg bg-[#FCFBFF] border border-[#E1D9F0] text-[#121334] focus:outline-none focus:border-[#5B4EB1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#4B506C] font-mono font-bold block mb-1">Identifier</label>
                  <input
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                    placeholder="llama-3.3-70b"
                    className="w-full p-2.5 rounded-lg bg-[#FCFBFF] border border-[#E1D9F0] text-[#121334] focus:outline-none focus:border-[#5B4EB1]"
                  />
                </div>
                <div>
                  <label className="text-[#4B506C] font-mono font-bold block mb-1">Provider</label>
                  <select
                    value={formData.provider}
                    onChange={e => setFormData({ ...formData, provider: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-[#FCFBFF] border border-[#E1D9F0] text-[#121334] focus:outline-none focus:border-[#5B4EB1]"
                  >
                    <option value="ollama">Ollama</option>
                    <option value="vllm">vLLM</option>
                    <option value="llamacpp">llama.cpp</option>
                    <option value="sovrix_local">Sovereign Local</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#4B506C] font-mono font-bold block mb-1">Local Host Endpoint</label>
                <input
                  type="text"
                  required
                  value={formData.endpoint}
                  onChange={e => setFormData({ ...formData, endpoint: e.target.value })}
                  placeholder="http://127.0.0.1:11434"
                  className="w-full p-2.5 rounded-lg bg-[#FCFBFF] border border-[#E1D9F0] text-[#121334] focus:outline-none focus:border-[#5B4EB1]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#ECE1F3] hover:bg-[#E9D1F1] text-[#121334] font-mono font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#5B4EB1] hover:bg-[#4F46E5] text-white font-mono font-bold shadow-sm"
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
