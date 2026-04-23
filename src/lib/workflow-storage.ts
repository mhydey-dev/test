import type { 
  WorkflowNode, 
  Connection, 
  SavedWorkflow, 
  WorkflowExport,
  WorkflowVariable,
  isValidWorkflowExport 
} from "@/types/workflow";

// Re-export types for backward compatibility
export type { SavedWorkflow };

const STORAGE_KEY = "flowfi_workflows";

export const saveWorkflow = (
  workflow: Omit<SavedWorkflow, "id" | "createdAt" | "updatedAt">
): SavedWorkflow => {
  const workflows = getWorkflows();
  const now = new Date().toISOString();
  
  const newWorkflow: SavedWorkflow = {
    ...workflow,
    id: `workflow-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  
  workflows.push(newWorkflow);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
  
  return newWorkflow;
};

export const updateWorkflow = (
  id: string, 
  updates: Partial<Omit<SavedWorkflow, "id" | "createdAt">>
): SavedWorkflow | null => {
  const workflows = getWorkflows();
  const index = workflows.findIndex((w) => w.id === id);
  
  if (index === -1) return null;
  
  workflows[index] = {
    ...workflows[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
  return workflows[index];
};

export const getWorkflows = (): SavedWorkflow[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const getWorkflow = (id: string): SavedWorkflow | null => {
  const workflows = getWorkflows();
  return workflows.find((w) => w.id === id) || null;
};

export const deleteWorkflow = (id: string): boolean => {
  const workflows = getWorkflows();
  const filtered = workflows.filter((w) => w.id !== id);
  
  if (filtered.length === workflows.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

export interface ExportWorkflowInput {
  name: string;
  nodes: WorkflowNode[];
  connections: Connection[];
  variables?: WorkflowVariable[];
}

export const exportWorkflow = (workflow: ExportWorkflowInput): string => {
  const exportData: WorkflowExport = {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    workflow: {
      name: workflow.name,
      nodes: workflow.nodes,
      connections: workflow.connections,
      variables: workflow.variables,
    },
  };
  
  return JSON.stringify(exportData, null, 2);
};

export interface ImportWorkflowResult {
  name: string;
  nodes: WorkflowNode[];
  connections: Connection[];
  variables?: WorkflowVariable[];
}

export const importWorkflow = (jsonString: string): ImportWorkflowResult | null => {
  try {
    const data = JSON.parse(jsonString) as Record<string, unknown>;
    
    // New format with workflow wrapper
    if (data.workflow && typeof data.workflow === "object") {
      const workflow = data.workflow as Record<string, unknown>;
      if (Array.isArray(workflow.nodes) && Array.isArray(workflow.connections)) {
        return {
          name: typeof workflow.name === "string" ? workflow.name : "Imported Workflow",
          nodes: workflow.nodes as WorkflowNode[],
          connections: workflow.connections as Connection[],
          variables: Array.isArray(workflow.variables) 
            ? workflow.variables as WorkflowVariable[] 
            : undefined,
        };
      }
    }
    
    // Legacy format support
    if (Array.isArray(data.nodes) && Array.isArray(data.connections)) {
      return {
        name: typeof data.name === "string" ? data.name : "Imported Workflow",
        nodes: data.nodes as WorkflowNode[],
        connections: data.connections as Connection[],
      };
    }
    
    return null;
  } catch {
    return null;
  }
};

export const downloadWorkflow = (workflow: ExportWorkflowInput): void => {
  const json = exportWorkflow(workflow);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `${workflow.name.toLowerCase().replace(/\s+/g, "-")}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
