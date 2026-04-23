/**
 * Workflow Type System
 * Central type definitions for the workflow builder
 */

// ============= Core Node Types =============

/** Node types in a workflow */
export type WorkflowNodeType = "settings" | "node";

/** Node category classifications */
export type NodeCategory = 
  | "Trigger" 
  | "DeFi" 
  | "Logic" 
  | "AI" 
  | "Contract" 
  | "Notification";

/** Configuration field types for node settings */
export type ConfigFieldType = "text" | "select" | "textarea" | "number";

/** Select option for dropdown fields */
export interface SelectOption {
  value: string;
  label: string;
}

/** Configuration field definition */
export interface ConfigField {
  name: string;
  label: string;
  type: ConfigFieldType;
  placeholder?: string;
  options?: SelectOption[];
  required?: boolean;
  defaultValue?: string | number;
}

/** Node definition (static blueprint for node types) */
export interface NodeDefinition {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: NodeCategory;
  inputCount: number;
  outputCount: number;
  color: string;
  description?: string;
  configFields?: ConfigField[];
}

/** Node configuration values (dynamic, per-instance) */
export type NodeConfig = Record<string, string | number | boolean | undefined>;

/** Workflow node instance */
export interface WorkflowNode {
  id: string;
  definitionId: string;
  type: WorkflowNodeType;
  title: string;
  x: number;
  y: number;
  config?: NodeConfig;
}

// ============= Connection Types =============

/** Connection between two nodes */
export interface Connection {
  id: string;
  fromNode: string;
  fromPort: number;
  toNode: string;
  toPort: number;
}

/** In-progress connection being drawn */
export interface PendingConnection {
  fromNode: string;
  fromPort: number;
  fromX: number;
  fromY: number;
}

// ============= Workflow Types =============

/** Workflow variable for template strings */
export interface WorkflowVariable {
  key: string;
  value: string;
  description?: string;
}

/** Workflow template (pre-built workflow) */
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  connections: Connection[];
}

/** Saved workflow with metadata */
export interface SavedWorkflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  connections: Connection[];
  variables?: WorkflowVariable[];
  createdAt: string;
  updatedAt: string;
}

/** Workflow export format */
export interface WorkflowExport {
  version: string;
  exportedAt: string;
  workflow: {
    name: string;
    nodes: WorkflowNode[];
    connections: Connection[];
    variables?: WorkflowVariable[];
  };
}

// ============= Canvas State Types =============

/** Canvas transform state for pan/zoom */
export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

/** Port position for connection rendering */
export interface PortPosition {
  x: number;
  y: number;
}

/** Node positions lookup */
export type NodePositions = Record<string, { x: number; y: number }>;

// ============= Builder State Types =============

/** Builder history state for undo/redo */
export interface WorkflowHistoryState {
  nodes: WorkflowNode[];
  connections: Connection[];
}

/** Drag state for node movement */
export interface DragState {
  nodeId: string;
  startX: number;
  startY: number;
  nodeStartX: number;
  nodeStartY: number;
}

/** Builder active tab */
export type BuilderSidebarTab = "nodes" | "settings";

// ============= Execution Types =============

/** Node execution status */
export type NodeExecutionStatus = 
  | "idle" 
  | "pending" 
  | "running" 
  | "success" 
  | "error";

/** Node execution result */
export interface NodeExecutionResult {
  nodeId: string;
  status: NodeExecutionStatus;
  output?: unknown;
  error?: string;
  executedAt?: string;
  duration?: number;
}

/** Workflow execution state */
export interface WorkflowExecutionState {
  workflowId: string;
  status: "idle" | "running" | "completed" | "failed";
  startedAt?: string;
  completedAt?: string;
  nodeResults: Record<string, NodeExecutionResult>;
}

// ============= Template Types =============

/** Template index entry (from index.json) */
export interface TemplateIndexEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  file: string;
}

/** Template index file format */
export interface TemplateIndex {
  version: string;
  templates: TemplateIndexEntry[];
}

/** Template file format */
export interface TemplateFile {
  version: string;
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  connections: Connection[];
}

// ============= UI State Types =============

/** Template card display info */
export interface TemplateCardInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  uses: number;
}

/** Category with templates for sidebar */
export interface NodeCategoryGroup {
  name: NodeCategory;
  isOpen: boolean;
  nodes: NodeDefinition[];
}

// ============= Utility Types =============

/** Type guard for checking if a value is a WorkflowNode */
export function isWorkflowNode(value: unknown): value is WorkflowNode {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "definitionId" in value &&
    "type" in value &&
    "title" in value &&
    "x" in value &&
    "y" in value
  );
}

/** Type guard for checking if a value is a Connection */
export function isConnection(value: unknown): value is Connection {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "fromNode" in value &&
    "fromPort" in value &&
    "toNode" in value &&
    "toPort" in value
  );
}

/** Type guard for checking if workflow export is valid */
export function isValidWorkflowExport(value: unknown): value is WorkflowExport {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  
  if (typeof obj.version !== "string") return false;
  if (typeof obj.workflow !== "object" || obj.workflow === null) return false;
  
  const workflow = obj.workflow as Record<string, unknown>;
  if (!Array.isArray(workflow.nodes)) return false;
  if (!Array.isArray(workflow.connections)) return false;
  
  return workflow.nodes.every(isWorkflowNode) && 
         workflow.connections.every(isConnection);
}

/** Create a unique node ID */
export function generateNodeId(prefix: string = "node"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/** Create a unique connection ID */
export function generateConnectionId(): string {
  return `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
