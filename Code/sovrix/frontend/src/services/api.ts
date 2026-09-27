import { 
  AIModel, AgentRun, Conversation, Message, DocumentItem,
  KnowledgeCollection, KnowledgeCitation, DeliverableItem,
  SandboxResult, CalculationResult, SystemHardwareTelemetry,
  SovereigntyTelemetry, AuditLogItem
} from '../types';

const API_BASE = '/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call to ${url} failed or in mock mode:`, err);
    throw err;
  }
}

export const api = {
  // Models
  getModels: () => fetchJson<AIModel[]>(`${API_BASE}/models`),
  registerModel: (data: Partial<AIModel>) => 
    fetchJson<AIModel>(`${API_BASE}/models`, { method: 'POST', body: JSON.stringify(data) }),
  checkModelHealth: (id: string) => 
    fetchJson<{ status: string; latency_ms: number; details: string }>(`${API_BASE}/models/${id}/health`, { method: 'POST' }),
  toggleModel: (id: string) => 
    fetchJson<{ id: string; is_enabled: boolean }>(`${API_BASE}/models/${id}/toggle`, { method: 'PATCH' }),

  // Chat & Workbench
  sendMessage: (data: { message: string; conversation_id?: string; model_override?: string }) =>
    fetchJson<{ message_id: string; conversation_id: string; content: string; citations: any[]; agent_run?: AgentRun }>(
      `${API_BASE}/chat`, { method: 'POST', body: JSON.stringify(data) }
    ),
  getConversations: () => fetchJson<Conversation[]>(`${API_BASE}/chat/conversations`),
  getConversationMessages: (id: string) => fetchJson<Message[]>(`${API_BASE}/chat/conversations/${id}/messages`),

  // Agents
  runAgentTask: (data: { task_prompt: string; conversation_id?: string; preferred_model?: string }) =>
    fetchJson<AgentRun>(`${API_BASE}/agents/run`, { method: 'POST', body: JSON.stringify(data) }),
  getAgentRuns: () => fetchJson<AgentRun[]>(`${API_BASE}/agents/runs`),
  getAgentRun: (id: string) => fetchJson<AgentRun>(`${API_BASE}/agents/${id}`),

  // Documents & OCR
  getDocuments: () => fetchJson<DocumentItem[]>(`${API_BASE}/documents`),
  uploadDocument: async (file: File, department: string = 'Refinery Operations', isScanned: boolean = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('department', department);
    formData.append('is_scanned', String(isScanned));
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
    return await res.json() as DocumentItem;
  },
  runOcr: (docId: string) =>
    fetchJson<{ document_id: string; extracted_text: string; confidence_score: number; pages_processed: number }>(
      `${API_BASE}/documents/${docId}/ocr`, { method: 'POST' }
    ),

  // Knowledge Base
  getCollections: () => fetchJson<KnowledgeCollection[]>(`${API_BASE}/knowledge/collections`),
  searchKnowledge: (data: { query: string; collection_id?: string; top_k?: number }) =>
    fetchJson<KnowledgeCitation[]>(`${API_BASE}/knowledge/search`, { method: 'POST', body: JSON.stringify(data) }),

  // Code Lab Sandbox
  executeCode: (data: { code: string; tests?: string[]; timeout_seconds?: number }) =>
    fetchJson<SandboxResult>(`${API_BASE}/code/execute`, { method: 'POST', body: JSON.stringify(data) }),

  // Calculation Engine
  calculate: (data: { expression: string; variables?: Record<string, number>; unit?: string }) =>
    fetchJson<CalculationResult>(`${API_BASE}/calculate`, { method: 'POST', body: JSON.stringify(data) }),

  // Deliverables Factory
  getDeliverables: () => fetchJson<DeliverableItem[]>(`${API_BASE}/deliverables`),
  generateWord: (data: any) =>
    fetchJson<DeliverableItem>(`${API_BASE}/deliverables/word`, { method: 'POST', body: JSON.stringify(data) }),
  generateExcel: (data: any) =>
    fetchJson<DeliverableItem>(`${API_BASE}/deliverables/excel`, { method: 'POST', body: JSON.stringify(data) }),
  generatePowerPoint: (data: any) =>
    fetchJson<DeliverableItem>(`${API_BASE}/deliverables/powerpoint`, { method: 'POST', body: JSON.stringify(data) }),

  // System & Sovereignty
  getSystemStatus: () => fetchJson<SystemHardwareTelemetry>(`${API_BASE}/system/status`),
  getSovereigntyNetwork: () => fetchJson<SovereigntyTelemetry>(`${API_BASE}/system/network`),
  getNetworkEvents: () => fetchJson<Array<{ timestamp: string; source: string; destination: string; action: string; status: string }>>(`${API_BASE}/system/events`),

  // Audit Logs
  getAuditLogs: (params?: Record<string, string>) => {
    const q = new URLSearchParams(params || {}).toString();
    return fetchJson<AuditLogItem[]>(`${API_BASE}/audit${q ? `?${q}` : ''}`);
  },

  // Scenarios Endpoints
  runScenario1: () => fetchJson<AgentRun>(`${API_BASE}/demo/run-scenario-1`, { method: 'POST' }),
  runScenario2: () => fetchJson<AgentRun>(`${API_BASE}/demo/run-scenario-2`, { method: 'POST' }),
  runScenario3: () => fetchJson<AgentRun>(`${API_BASE}/demo/run-scenario-3`, { method: 'POST' }),
};
