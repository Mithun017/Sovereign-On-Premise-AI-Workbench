export type RoleType = 'Admin' | 'Engineer' | 'Auditor' | 'Operator';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  role: RoleType;
  department: string;
  is_active: boolean;
  created_at: string;
}

export interface AIModel {
  id: string;
  name: string;
  identifier: string;
  provider: string; // 'ollama' | 'vllm' | 'llamacpp' | 'sovrix_local'
  endpoint: string;
  context_length: number;
  vram_requirement_gb: number;
  vision_support: boolean;
  coding_support: boolean;
  reasoning_support: boolean;
  ocr_support: boolean;
  spreadsheet_support: boolean;
  priority: number;
  is_enabled: boolean;
  health_status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  last_health_check?: string;
  created_at: string;
}

export type StepStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'BLOCKED';

export interface AgentStep {
  id: string;
  step_number: number;
  step_title: string;
  step_type: string;
  tool_name?: string;
  status: StepStatus;
  input_payload: Record<string, any>;
  output_payload: Record<string, any>;
  duration_ms: number;
  created_at: string;
}

export interface AgentRun {
  id: string;
  conversation_id?: string;
  task_prompt: string;
  task_classification: string;
  selected_model: string;
  status: StepStatus;
  plan_json: any[];
  results_summary?: string;
  start_time: string;
  end_time?: string;
  duration_ms: number;
  external_calls_prevented: number;
  steps: AgentStep[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  message_count?: number;
}

export interface DocumentItem {
  id: string;
  filename: string;
  original_name: string;
  file_type: string;
  file_size_bytes: number;
  page_count: number;
  is_scanned: boolean;
  ocr_processed: boolean;
  extracted_text?: string;
  summary?: string;
  department: string;
  uploaded_by: string;
  created_at: string;
}

export interface KnowledgeCollection {
  id: string;
  name: string;
  description?: string;
  department: string;
  access_level: string;
  created_at: string;
  chunk_count: number;
}

export interface KnowledgeCitation {
  chunk_id: string;
  document_id?: string;
  document_name: string;
  citation: string;
  content: string;
  score: number;
  metadata: Record<string, any>;
}

export interface DeliverableItem {
  id: string;
  title: string;
  file_type: 'DOCX' | 'XLSX' | 'PPTX' | 'PDF';
  filename: string;
  download_url: string;
  file_size_bytes: number;
  created_at: string;
}

export interface SandboxResult {
  id: string;
  stdout: string;
  stderr: string;
  exit_code: number;
  execution_time_ms: number;
  network_status: string;
  security_status: string;
  resource_usage: {
    cpu_percent: number;
    memory_mb: number;
  };
  test_results: {
    total: number;
    passed: number;
    failed: number;
    details: Array<{ status: string; log: string }>;
  };
  created_at: string;
}

export interface CalculationStepItem {
  step_number: number;
  description: string;
  intermediate_value: number;
  formula_used: string;
}

export interface CalculationResult {
  inputs: Record<string, any>;
  formula: string;
  steps: CalculationStepItem[];
  final_result: number;
  units?: string;
  is_verified: boolean;
  explanation: string;
}

export interface SovereigntyTelemetry {
  air_gapped: boolean;
  external_connections: number;
  internet_requests: number;
  external_dns_requests: number;
  cloud_ai_requests: number;
  telemetry_requests: number;
  blocked_requests: number;
  local_model_requests: number;
  network_interface: string;
  firewall_status: string;
}

export interface SystemHardwareTelemetry {
  gpu_name: string;
  gpu_utilization_percent: number;
  vram_used_gb: number;
  vram_total_gb: number;
  cpu_utilization_percent: number;
  ram_used_gb: number;
  ram_total_gb: number;
  disk_used_gb: number;
  disk_total_gb: number;
  active_agents: number;
  total_documents: number;
  knowledge_chunks: number;
  configured_models: number;
  sovereignty: SovereigntyTelemetry;
}

export interface AuditLogItem {
  id: string;
  user_name: string;
  action_type: string;
  task_name?: string;
  model_used?: string;
  tool_used?: string;
  document_referenced?: string;
  result_status: string;
  execution_duration_ms: number;
  network_state: string;
  details_json: Record<string, any>;
  timestamp: string;
}
