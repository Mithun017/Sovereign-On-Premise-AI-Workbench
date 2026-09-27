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
    if (status === 'RUNNING') return <PlayCircle className="w-4 h-4 text-[#5B4EB1] animate-spin" />;
    if (status === 'FAILED') return <AlertCircle className="w-4 h-4 text-rose-500" />;
    
    switch (type.toUpperCase()) {
      case 'CLASSIFY':
        return <Layers className="w-4 h-4 text-[#5B4EB1]" />;
      case 'OCR':
      case 'VISION':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'KB_SEARCH':
        return <FileCheck2 className="w-4 h-4 text-indigo-600" />;
      case 'CALCULATION':
        return <Calculator className="w-4 h-4 text-amber-600" />;
      case 'SANDBOX_RUN':
      case 'CODE_GEN':
        return <Terminal className="w-4 h-4 text-emerald-600" />;
      case 'DELIVERABLE':
        return <CheckCircle2 className="w-4 h-4 text-[#5B4EB1]" />;
      default:
        return <Wrench className="w-4 h-4 text-[#4B506C]" />;
    }
  };

  return (
    <div className="bg-[#FCFBFF] border border-[#E1D9F0] rounded-xl p-4 shadow-md space-y-4 font-sans">
      {/* Execution Header Meta */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E1D9F0] text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#4B506C] font-semibold">Task Class:</span>
          <span className="px-2.5 py-0.5 rounded bg-[#E9D1F1] text-[#121334] border border-[#E1D9F0] font-mono font-bold">
            {taskClassification}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-[#4B506C]">
          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-[#5B4EB1]" />
            <span className="text-[#121334] font-medium">{selectedModel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[#121334] font-medium">{totalDurationMs} ms</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-700 font-bold">
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
              className="rounded-lg border border-[#E1D9F0] bg-[#FFFFFF] hover:border-[#8F92C0] transition-all overflow-hidden shadow-sm"
            >
              {/* Step Summary Bar */}
              <div 
                onClick={() => toggleExpand(step.id)}
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-[#ECE1F3]/40 select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-[#ECE1F3] border border-[#E1D9F0] flex items-center justify-center shrink-0">
                    {getStepIcon(step.step_type, step.status)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#8F92C0]">Step {step.step_number}:</span>
                      <span className="text-xs font-bold text-[#121334] truncate">{step.step_title}</span>
                    </div>
                    {step.tool_name && (
                      <span className="text-[10px] font-mono text-[#5B4EB1] font-semibold">Tool: {step.tool_name}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono text-[#8F92C0]">{step.duration_ms}ms</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    step.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    step.status === 'RUNNING' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {step.status}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-[#8F92C0]" /> : <ChevronDown className="w-4 h-4 text-[#8F92C0]" />}
                </div>
              </div>

              {/* Step Expanded Details Drawer */}
              {isExpanded && (
                <div className="p-3 bg-[#FCFBFF] border-t border-[#E1D9F0] text-xs font-mono space-y-2">
                  {step.input_payload && Object.keys(step.input_payload).length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-[#4B506C] uppercase tracking-wider block mb-1">Input Context:</span>
                      <pre className="p-2 rounded bg-[#ECE1F3]/60 text-[#121334] border border-[#E1D9F0] text-[11px] overflow-x-auto max-h-32">
                        {JSON.stringify(step.input_payload, null, 2)}
                      </pre>
                    </div>
                  )}

                  {step.output_payload && Object.keys(step.output_payload).length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold text-[#5B4EB1] uppercase tracking-wider block mb-1">Execution Output:</span>
                      <pre className="p-2 rounded bg-[#ECE1F3]/60 text-[#1A1B3B] border border-[#E1D9F0] text-[11px] overflow-x-auto max-h-48 whitespace-pre-wrap">
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
        <div className="flex items-center gap-2 text-xs font-mono text-[#5B4EB1] animate-pulse pt-2 font-semibold">
          <PlayCircle className="w-4 h-4 animate-spin" />
          <span>Executing on-premise neural agent step...</span>
        </div>
      )}
    </div>
  );
};
