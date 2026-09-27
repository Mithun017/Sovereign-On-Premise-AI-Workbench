import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  CheckCircle2, 
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import { Message, AgentRun, AIModel, DocumentItem, DeliverableItem } from '../types';
import { AgentStepTimeline } from '../components/AgentStepTimeline';
import { DeliverableCard } from '../components/DeliverableCard';
import { CalculationVisualizer } from '../components/CalculationVisualizer';

export const Workbench: React.FC = () => {
  const [searchParams] = useSearchParams();
  const scenarioParam = searchParams.get('scenario');

  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAgentRun, setActiveAgentRun] = useState<AgentRun | null>(null);
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModelOverride, setSelectedModelOverride] = useState<string>('');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (scenarioParam) {
      triggerScenario(parseInt(scenarioParam, 10));
    }
  }, [scenarioParam]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeAgentRun]);

  const loadInitialData = async () => {
    try {
      const [mList, dList, delivs] = await Promise.all([
        api.getModels().catch(() => []),
        api.getDocuments().catch(() => []),
        api.getDeliverables().catch(() => [])
      ]);
      setModels(mList);
      setDocuments(dList);
      setDeliverables(delivs);
    } catch (e) {
      console.error(e);
    }
  };

  const triggerScenario = async (scenarioNum: number) => {
    setIsLoading(true);
    let promptText = "";
    if (scenarioNum === 1) {
      promptText = "Analyze the ultrasonic inspection report for Crude Distillation Line PL-4820-A, compare against SOP-INS-2025 wall thickness limits, calculate the deficit deterministically, and generate a formal executive Approval Note in Word (.DOCX).";
    } else if (scenarioNum === 2) {
      promptText = "Create a Python program that calculates equipment downtime statistics and unit availability from equipment_downtime.csv, run tests in the air-gapped sandbox, and generate an analytical Excel workbook.";
    } else if (scenarioNum === 3) {
      promptText = "Identify visible equipment tags from refinery P&ID drawing ENG-PID-4029-REV3, summarize major components using local vision model, and generate an executive PowerPoint presentation.";
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: promptText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      let runResult: AgentRun;
      if (scenarioNum === 1) runResult = await api.runScenario1();
      else if (scenarioNum === 2) runResult = await api.runScenario2();
      else runResult = await api.runScenario3();

      setActiveAgentRun(runResult);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: runResult.results_summary || "Scenario executed successfully.",
        metadata: { agent_run: runResult },
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMsg]);
      // Refresh deliverables list
      const latestDelivs = await api.getDeliverables().catch(() => []);
      setDeliverables(latestDelivs);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Execution error: ${err.message || 'Error executing sovereign agent.'}`,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;

    const userText = inputPrompt;
    setInputPrompt('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await api.sendMessage({
        message: userText,
        model_override: selectedModelOverride || undefined
      });

      if (response.agent_run) {
        setActiveAgentRun(response.agent_run);
      }

      const assistantMsg: Message = {
        id: response.message_id || Date.now().toString(),
        role: 'assistant',
        content: response.content,
        metadata: { citations: response.citations, agent_run: response.agent_run },
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Refresh deliverables
      const latestDelivs = await api.getDeliverables().catch(() => []);
      setDeliverables(latestDelivs);
    } catch (err: any) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${err.message || 'Failed to communicate with local model runtime.'}`,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDocSelection = (id: string) => {
    setSelectedDocIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const [showContextPanel, setShowContextPanel] = useState(true);
  const [showDeliverablesPanel, setShowDeliverablesPanel] = useState(true);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden font-sans relative">
      {/* LEFT REGION: Context, Documents & Attachments */}
      {showContextPanel && (
        <div className="w-80 border-r border-[#E1D9F0] bg-[#FCFBFF] flex flex-col justify-between shrink-0 p-4 space-y-4 overflow-y-auto custom-scrollbar transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E1D9F0]">
              <span className="text-xs font-bold text-[#121334] font-mono uppercase flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#5B4EB1]" />
                <span>Input Context Docs</span>
              </span>
              <span className="text-[10px] font-mono text-[#5B4EB1] bg-[#ECE1F3] px-2 py-0.5 rounded font-bold border border-[#E1D9F0]">
                {documents.length} Files
              </span>
            </div>

            <div className="space-y-2">
              {documents.map(doc => {
                const isSelected = selectedDocIds.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDocSelection(doc.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#E9D1F1] border-[#5B4EB1] text-[#121334] font-semibold shadow-sm'
                        : 'bg-[#FFFFFF] border-[#E1D9F0] text-[#1A1B3B] hover:border-[#8F92C0]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold truncate text-xs">{doc.original_name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#ECE1F3] text-[#4B506C] shrink-0">
                        {doc.file_type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#4B506C] font-mono mt-1.5">
                      <span className="truncate">{doc.department}</span>
                      <span className={doc.ocr_processed ? 'text-emerald-700 font-bold shrink-0' : 'text-[#8F92C0] shrink-0'}>
                        {doc.ocr_processed ? '✓ OCR' : 'Raw'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Selector in Left Panel */}
          <div className="pt-4 border-t border-[#E1D9F0] space-y-2">
            <label className="text-xs font-bold text-[#121334] font-mono uppercase block">
              Target Model Adapter
            </label>
            <select
              value={selectedModelOverride}
              onChange={(e) => setSelectedModelOverride(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E1D9F0] rounded-lg p-2 text-xs text-[#121334] font-mono font-medium focus:border-[#5B4EB1] focus:outline-none shadow-sm"
            >
              <option value="">Auto Router (Intelligent Selection)</option>
              {models.map(m => (
                <option key={m.id} value={m.identifier}>
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-[#8F92C0] block">
              Directs query to optimal GPU model automatically.
            </span>
          </div>
        </div>
      )}

      {/* CENTER REGION: Conversation Stream & Live Step Visualization */}
      <div className="flex-1 flex flex-col bg-[#EFEDF5] overflow-hidden min-w-0">
        {/* Top Control Bar for Panes */}
        <div className="px-4 py-2 bg-[#FCFBFF] border-b border-[#E1D9F0] flex items-center justify-between text-xs font-mono text-[#4B506C]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowContextPanel(prev => !prev)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                showContextPanel 
                  ? 'bg-[#E9D1F1] border-[#5B4EB1] text-[#121334]' 
                  : 'bg-[#FFFFFF] border-[#E1D9F0] text-[#4B506C] hover:text-[#121334]'
              }`}
            >
              {showContextPanel ? '◀ Hide Context' : '▶ Show Context'}
            </button>
            <span className="text-[#8F92C0] hidden sm:inline">|</span>
            <span className="hidden sm:inline font-bold text-[#121334]">
              Autonomous Reasoning Session
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              ● Sandbox Ready
            </span>
            <button
              onClick={() => setShowDeliverablesPanel(prev => !prev)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                showDeliverablesPanel 
                  ? 'bg-[#E9D1F1] border-[#5B4EB1] text-[#121334]' 
                  : 'bg-[#FFFFFF] border-[#E1D9F0] text-[#4B506C] hover:text-[#121334]'
              }`}
            >
              {showDeliverablesPanel ? 'Hide Output ▶' : 'Show Output ◀'}
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-5 select-none py-8">
              <div className="w-16 h-16 rounded-2xl bg-[#E9D1F1] border border-[#E1D9F0] flex items-center justify-center shadow-md">
                <Bot className="w-8 h-8 text-[#5B4EB1]" />
              </div>
              <div className="space-y-1.5 px-4">
                <h3 className="text-lg font-bold text-[#121334] font-mono">SOVRIX Autonomous Workbench</h3>
                <p className="text-xs text-[#4B506C] leading-relaxed">
                  Confidential engineering planning, local OCR extraction, verified calculations, sandboxed Python code execution, and executive deliverable generation.
                </p>
              </div>

              {/* Quick Launch Buttons */}
              <div className="flex flex-wrap gap-2.5 justify-center pt-2 px-2">
                <button
                  onClick={() => triggerScenario(1)}
                  className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#E9D1F1] border border-[#E1D9F0] text-xs font-mono text-[#121334] font-semibold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>⚡ 1: Inspection & MAWT (DOCX)</span>
                </button>
                <button
                  onClick={() => triggerScenario(2)}
                  className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#E9D1F1] border border-[#E1D9F0] text-xs font-mono text-[#121334] font-semibold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>⚡ 2: Downtime Sandbox (XLSX)</span>
                </button>
                <button
                  onClick={() => triggerScenario(3)}
                  className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#E9D1F1] border border-[#E1D9F0] text-xs font-mono text-[#121334] font-semibold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>⚡ 3: P&ID Vision Analysis (PPTX)</span>
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="space-y-4 max-w-4xl mx-auto">
                <div className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-[#E9D1F1] border border-[#E1D9F0] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Bot className="w-4 h-4 text-[#5B4EB1]" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-xs leading-relaxed space-y-3 ${
                    msg.role === 'user'
                      ? 'bg-[#E9D1F1] border border-[#E1D9F0] text-[#121334] font-medium'
                      : 'bg-[#FFFFFF] border border-[#E1D9F0] text-[#1A1B3B]'
                  }`}>
                    <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{msg.content}</div>

                    {/* Grounded Citations if attached */}
                    {msg.metadata?.citations && msg.metadata.citations.length > 0 && (
                      <div className="pt-2 border-t border-[#E1D9F0] space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-[#5B4EB1] font-bold block">
                          Verified Citations & Grounding:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.metadata.citations.map((c: any, i: number) => (
                            <div key={i} className="p-2 rounded-lg bg-[#ECE1F3] border border-[#E1D9F0] font-mono text-[11px] text-[#121334]">
                              <span className="font-bold block">{c.citation}</span>
                              <span className="text-[#4B506C] block text-[10px] truncate mt-0.5">{c.doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-[#ECE1F3] border border-[#E1D9F0] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <User className="w-4 h-4 text-[#5B4EB1]" />
                    </div>
                  )}
                </div>

                {/* Live Agent Step Timeline if present */}
                {msg.metadata?.agent_run?.steps && (
                  <div className="pl-10 pr-2 sm:pr-4">
                    <AgentStepTimeline
                      steps={msg.metadata.agent_run.steps}
                      taskClassification={msg.metadata.agent_run.task_classification}
                      selectedModel={msg.metadata.agent_run.selected_model}
                      totalDurationMs={msg.metadata.agent_run.duration_ms}
                    />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* BOTTOM: Prompt Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-[#FCFBFF] border-t border-[#E1D9F0]">
          <div className="max-w-4xl mx-auto flex items-center gap-2 p-2 rounded-2xl bg-[#FFFFFF] border border-[#E1D9F0] focus-within:border-[#5B4EB1] transition-all shadow-sm">
            <textarea
              rows={2}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask SOVRIX: reason over inspection data, write sandboxed Python, extract P&ID tags, or generate Word/Excel..."
              className="flex-1 bg-transparent text-xs text-[#1A1B3B] placeholder-[#8F92C0] focus:outline-none resize-none font-sans px-2"
            />

            <div className="flex items-center gap-1.5 self-end">
              <button
                type="submit"
                disabled={isLoading || !inputPrompt.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B4EB1] hover:bg-[#4F46E5] disabled:opacity-40 text-white font-bold text-xs shadow-sm transition-all font-mono"
              >
                <span>{isLoading ? 'Executing...' : 'Run Agent'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* RIGHT REGION: Execution Metadata, Deliverables & Verified Calculations */}
      {showDeliverablesPanel && (
        <div className="w-96 border-l border-[#E1D9F0] bg-[#FCFBFF] flex flex-col justify-between shrink-0 p-4 space-y-4 overflow-y-auto custom-scrollbar transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E1D9F0]">
              <span className="text-xs font-bold text-[#121334] font-mono uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Deliverables Generated</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold border border-emerald-200">
                {deliverables.length} Files
              </span>
            </div>

            {/* Generated Deliverables List */}
            <div className="space-y-3">
              {deliverables.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#8F92C0] font-mono">
                  No deliverables generated yet. Run Scenario 1, 2, or 3 to generate real Word, Excel, or PPTX.
                </div>
              ) : (
                deliverables.slice(0, 3).map(deliv => (
                  <DeliverableCard key={deliv.id} deliverable={deliv} />
                ))
              )}
            </div>

            {/* Deterministic Calculation Card */}
            <div className="pt-2">
              <CalculationVisualizer
                calc={{
                  inputs: { mawt: 4.50, measured: 3.42 },
                  formula: "Deficit = MAWT - Measured",
                  steps: [
                    { step_number: 1, description: "Nominal Wall: 9.52 mm (ASTM A106-B)", intermediate_value: 9.52, formula_used: "Nominal" },
                    { step_number: 2, description: "Statutory MAWT Limit (SOP-INS-2025)", intermediate_value: 4.50, formula_used: "MAWT := 4.50" },
                    { step_number: 3, description: "Ultrasonic Minimum Measured Point", intermediate_value: 3.42, formula_used: "Measured := 3.42" },
                    { step_number: 4, description: "Compute Absolute Deficit: 4.50 - 3.42", intermediate_value: 1.08, formula_used: "4.50 - 3.42" }
                  ],
                  final_result: 1.08,
                  units: "mm",
                  is_verified: true,
                  explanation: "Deficit is 1.08 mm (24.0% below statutory retirement limit)."
                }}
              />
            </div>
          </div>

          {/* Security / Sovereignty Assurance Badge */}
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E1D9F0] space-y-1.5 font-mono text-[11px] shadow-sm">
            <div className="flex items-center justify-between text-[#121334] font-bold">
              <span>Air-Gap Sentinel</span>
              <span className="text-emerald-700">PASSED</span>
            </div>
            <div className="text-[#8F92C0] text-[10px]">
              Network egress blocked via iptables / loopback VLAN isolation.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

