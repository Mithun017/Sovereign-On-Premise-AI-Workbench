import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PlayCircle, 
  ChevronDown, 
  ChevronUp, 
  Wrench, 
  FileText, 
  Cpu, 
  Calculator, 
  Terminal, 
  FileCheck2,
  Lock,
  Layers
} from 'lucide-react';
import { AgentStep, StepStatus } from '../types';

interface AgentStepTimelineProps {
  steps: AgentStep[];
  taskClassification?: string;
  selectedModel?: string;
  totalDurationMs?: number;
  isStreaming?: boolean;
}

export const AgentStepTimeline: React.FC<AgentStepTimelineProps> = ({
  steps,
  taskClassification = 'Industrial Technical Assessment',
  selectedModel = 'sovrix-deepseek-r1-local',
  totalDurationMs = 0,
  isStreaming = false,
}) => {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  const toggleExpand = (stepId: string) => {
    setExpandedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const getStepIcon = (type: string, status: StepStatus) => {
    if (status === 'RUNNING') return <PlayCircle className="w-4 h-4 text-cyan-400 animate-spin" />;
    if (status === 'FAILED') return <AlertCircle className="w-4 h-4 text-rose-400" />;
    
    switch (type.toUpperCase()) {
      case 'CLASSIFY':
        return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'OCR':
      case 'VISION':
        return <FileText className="w-4 h-4 text-purple-400" />;
      case 'KB_SEARCH':
        return <FileCheck2 className="w-4 h-4 text-indigo-400" />;
      case 'CALCULATION':
        return <Calculator className="w-4 h-4 text-amber-400" />;
      case 'SANDBOX_RUN':
      case 'CODE_GEN':
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 'DELIVERABLE':
        return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
      default:
        return <Wrench className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4 font-sans">
      {/* Execution Header Meta */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Task Class:</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono font-semibold">
            {taskClassification}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-300">{selectedModel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300">{totalDurationMs} ms</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>0 Ext. Calls</span>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          const isExpanded = expandedSteps[step.id] || idx === steps.length - 1;
          return (
            <div
              key={step.id || idx}
              className="rounded-lg border border-slate-800/90 bg-slate-950/70 hover:border-slate-700/80 transition-all overflow-hidden"
            >
              {/* Step Summary Bar */}
              <div 
                onClick={() => toggleExpand(step.id)}
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-900/40 select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-slate-900 border border-slate-700/60 flex items-center justify-center shrink-0">
                    {getStepIcon(step.step_type, step.status)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-400">Step {step.step_number}:</span>
                      <span className="text-xs font-semibold text-slate-200 truncate">{step.step_title}</span>
                    </div>
                    {step.tool_name && (
                      <span className="text-[10px] font-mono text-cyan-400">Tool: {step.tool_name}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-slate-500">{step.duration_ms}ms</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    step.status === 'SUCCESS' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' :
                    step.status === 'RUNNING' ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 animate-pulse' :
                    'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                  }`}>
                    {step.status}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Step Expanded Details Drawer */}
              {isExpanded && (
                <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-xs font-mono space-y-2">
                  {step.input_payload && Object.keys(step.input_payload).length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Input Context:</span>
                      <pre className="p-2 rounded bg-slate-900 text-slate-300 text-[11px] overflow-x-auto max-h-32">
                        {JSON.stringify(step.input_payload, null, 2)}
                      </pre>
                    </div>
                  )}

                  {step.output_payload && Object.keys(step.output_payload).length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">Execution Output:</span>
                      <pre className="p-2 rounded bg-slate-900 text-slate-200 text-[11px] overflow-x-auto max-h-48 whitespace-pre-wrap">
                        {typeof step.output_payload.extracted_text === 'string' 
                          ? step.output_payload.extracted_text 
                          : JSON.stringify(step.output_payload, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isStreaming && (
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 animate-pulse pt-2">
          <PlayCircle className="w-4 h-4 animate-spin" />
          <span>Executing on-premise neural agent step...</span>
        </div>
      )}
    </div>
  );
};
