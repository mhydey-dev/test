import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Minus, 
  Maximize2, 
  LayoutGrid, 
  Undo2, 
  Redo2, 
  Share2, 
  Play, 
  Rocket,
  ChevronDown,
  ChevronRight,
  Settings,
  Copy,
  Trash2,
  Sparkles,
  Bell,
  GitBranch,
  Cpu,
  TrendingUp,
  FileCode,
  Save,
  Download,
  Upload,
  FolderOpen,
  Clock,
  X,
  Move
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link, useSearchParams } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { workflowTemplates, getTemplatesByCategory } from "@/lib/workflow-templates";
import { saveWorkflow, downloadWorkflow, importWorkflow, getWorkflows } from "@/lib/workflow-storage";
import { nodeDefinitions, getNodeDefinition } from "@/lib/node-definitions";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import { toast } from "sonner";
import { SimulationTerminal, useSimulationTerminal } from "@/components/builder/SimulationTerminal";
import { DeployDialog } from "@/components/dialogs/DeployDialog";
import { ShareDialog } from "@/components/dialogs/ShareDialog";
import { MobileBlocker } from "@/components/builder/MobileBlocker";
import type { 
  WorkflowNode, 
  Connection, 
  SavedWorkflow,
  WorkflowVariable,
  NodeDefinition,
  PendingConnection,
  WorkflowHistoryState,
} from "@/types/workflow";
import { generateNodeId, generateConnectionId } from "@/types/workflow";

const DRAFT_KEY = "flowfi_draft_workflow";

// Group nodes by category
const nodeCategories = nodeDefinitions.reduce((acc, node) => {
  if (!acc[node.category]) {
    acc[node.category] = [];
  }
  acc[node.category].push(node);
  return acc;
}, {} as Record<string, NodeDefinition[]>);

const categoryIcons: Record<string, React.ReactNode> = {
  "Trigger": <Clock size={14} />,
  "DeFi": <TrendingUp size={14} />,
  "Logic": <GitBranch size={14} />,
  "AI": <Cpu size={14} />,
  "Contract": <FileCode size={14} />,
  "Notification": <Bell size={14} />,
};

// Define category order for display
const categoryOrder = ["Trigger", "DeFi", "Logic", "AI", "Contract", "Notification"];

const NODE_WIDTH = 220;
const NODE_HEIGHT = 100;

const Builder = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");
  
  // Initialize with template or draft
  const getInitialState = () => {
    // Try to load template first, then draft
    if (templateId) {
      const template = workflowTemplates.find((t) => t.id === templateId);
      if (template) {
        const timestamp = Date.now();
        return {
          name: `${template.name} - Copy`,
          nodes: template.nodes.map((node) => ({
            ...node,
            id: `${node.id}-${timestamp}`,
          })),
          connections: template.connections.map((conn) => ({
            ...conn,
            id: `${conn.id}-${timestamp}`,
            fromNode: `${conn.fromNode}-${timestamp}`,
            toNode: `${conn.toNode}-${timestamp}`,
          })),
        };
      }
    }

    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft && !templateId) {
        const parsed = JSON.parse(draft);
        if (parsed.nodes && parsed.connections) {
          return parsed;
        }
      }
    } catch {}
    
    if (templateId) {
      const template = workflowTemplates.find((t) => t.id === templateId);
      if (template) {
        return {
          nodes: template.nodes,
          connections: template.connections,
          name: template.name,
        };
      }
    }
    return {
      nodes: [{
        id: "settings",
        definitionId: "settings",
        type: "settings" as const,
        title: "Settings",
        x: 100,
        y: 200,
      }],
      connections: [] as Connection[],
      name: "Untitled Workflow",
    };
  };
  
  const initial = getInitialState();
  
  // Undo/Redo for workflow state
  interface WorkflowState {
    nodes: WorkflowNode[];
    connections: Connection[];
  }
  
  const {
    state: workflowState,
    set: setWorkflowState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetHistory,
  } = useUndoRedo<WorkflowState>({ nodes: initial.nodes, connections: initial.connections });

  const nodes = workflowState.nodes;
  const connections = workflowState.connections;

  const setNodes = useCallback((updater: WorkflowNode[] | ((prev: WorkflowNode[]) => WorkflowNode[])) => {
    setWorkflowState((prev) => ({
      ...prev,
      nodes: typeof updater === "function" ? updater(prev.nodes) : updater,
    }));
  }, [setWorkflowState]);

  const setConnections = useCallback((updater: Connection[] | ((prev: Connection[]) => Connection[])) => {
    setWorkflowState((prev) => ({
      ...prev,
      connections: typeof updater === "function" ? updater(prev.connections) : updater,
    }));
  }, [setWorkflowState]);

  const [selectedNode, setSelectedNode] = useState<string>("settings");
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [workflowName, setWorkflowName] = useState(initial.name);
  const [workflowVariables, setWorkflowVariables] = useState<Array<{name: string; value: string; type: string}>>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [expandedCategories, setExpandedCategories] = useState<string[]>(Object.keys(nodeCategories));
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [showSavedDialog, setShowSavedDialog] = useState(false);
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // Connection drawing state
  const [connectingFrom, setConnectingFrom] = useState<{ nodeId: string; port: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Simulation terminal
  const {
    logs: terminalLogs,
    isSimulating,
    clearLogs,
    startSimulation,
    stopSimulation,
  } = useSimulationTerminal();

  // Auto-save draft
  useEffect(() => {
    const draftData = {
      nodes,
      connections,
      name: workflowName,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
  }, [nodes, connections, workflowName]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedNode && selectedNode !== "settings" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault();
          handleDeleteNode(selectedNode);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, selectedNode]);

  // Wheel zoom - native listener so we can preventDefault (React onWheel is passive)
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      setZoom((prev) => Math.min(200, Math.max(25, prev + delta)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const getNodeDefinition = (definitionId: string): NodeDefinition | undefined => {
    return nodeDefinitions.find((n) => n.id === definitionId);
  };

  const handleAddNode = (definition: NodeDefinition) => {
    // Calculate center of visible canvas area
    const centerX = (-pan.x + 400) / (zoom / 100);
    const centerY = (-pan.y + 200) / (zoom / 100);
    
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      definitionId: definition.id,
      type: "node",
      title: definition.label,
      x: centerX + nodes.length * 30,
      y: centerY + nodes.length * 20,
      config: {},
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
  };

  // Canvas panning
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle mouse or Alt+Left click to pan
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (connectingFrom) return;
    
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    
    e.stopPropagation();
    setDraggedNode(nodeId);
    const scale = zoom / 100;
    setDragOffset({
      x: (e.clientX - pan.x) / scale - node.x,
      y: (e.clientY - pan.y) / scale - node.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Handle panning
      if (isPanning) {
        setPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
        return;
      }

      if (connectingFrom && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const scale = zoom / 100;
        setMousePos({
          x: (e.clientX - rect.left - pan.x) / scale,
          y: (e.clientY - rect.top - pan.y) / scale,
        });
      }
      
      if (!draggedNode) return;
      
      const scale = zoom / 100;
      setNodes((prev) =>
        prev.map((node) =>
          node.id === draggedNode
            ? { 
                ...node, 
                x: (e.clientX - pan.x) / scale - dragOffset.x, 
                y: (e.clientY - pan.y) / scale - dragOffset.y 
              }
            : node
        )
      );
    },
    [draggedNode, dragOffset, connectingFrom, isPanning, panStart, pan, zoom]
  );

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNode(null);
  };

  const getOutputPortCount = (node: WorkflowNode): number => {
    if (node.type === "settings") return 1;
    const def = getNodeDefinition(node.definitionId);
    return def?.outputCount ?? 1;
  };

  const getInputPortCount = (node: WorkflowNode): number => {
    if (node.type === "settings") return 0;
    const def = getNodeDefinition(node.definitionId);
    return def?.inputCount ?? 1;
  };

  const handleStartConnection = (e: React.MouseEvent, nodeId: string, portIndex: number) => {
    e.stopPropagation();
    setConnectingFrom({ nodeId, port: portIndex });
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const scale = zoom / 100;
      setMousePos({
        x: (e.clientX - rect.left - pan.x) / scale,
        y: (e.clientY - rect.top - pan.y) / scale,
      });
    }
  };

  const handleCompleteConnection = (e: React.MouseEvent, nodeId: string, portIndex: number) => {
    e.stopPropagation();
    if (connectingFrom && connectingFrom.nodeId !== nodeId) {
      const exists = connections.some(
        (c) => c.fromNode === connectingFrom.nodeId && c.fromPort === connectingFrom.port && c.toNode === nodeId && c.toPort === portIndex
      );
      if (!exists) {
        setConnections([
          ...connections,
          {
            id: `conn-${Date.now()}`,
            fromNode: connectingFrom.nodeId,
            fromPort: connectingFrom.port,
            toNode: nodeId,
            toPort: portIndex,
          },
        ]);
      }
    }
    setConnectingFrom(null);
  };

  const handleCanvasClick = () => {
    setConnectingFrom(null);
  };

  const handleDeleteConnection = (connId: string) => {
    setConnections(connections.filter((c) => c.id !== connId));
  };

  const handleDeleteNode = (nodeId: string) => {
    if (nodeId === "settings") return;
    setNodes(nodes.filter((n) => n.id !== nodeId));
    setConnections(connections.filter((c) => c.fromNode !== nodeId && c.toNode !== nodeId));
    setSelectedNode("settings");
    setExpandedNodes(prev => {
      const next = new Set(prev);
      next.delete(nodeId);
      return next;
    });
  };

  const handleAddVariable = () => {
    setWorkflowVariables(prev => [...prev, { name: `var_${prev.length + 1}`, value: "", type: "text" }]);
  };

  const handleUpdateVariable = (index: number, field: "name" | "value" | "type", newValue: string) => {
    setWorkflowVariables(prev => prev.map((v, i) => 
      i === index ? { ...v, [field]: newValue } : v
    ));
  };

  const handleRemoveVariable = (index: number) => {
    setWorkflowVariables(prev => prev.filter((_, i) => i !== index));
  };

  const toggleNodeExpanded = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const getNodeOutputPos = (nodeId: string, portIndex: number = 0, totalPorts: number = 1) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    
    const portSpacing = NODE_HEIGHT / (totalPorts + 1);
    return {
      x: node.x + NODE_WIDTH,
      y: node.y + portSpacing * (portIndex + 1),
    };
  };

  const getNodeInputPos = (nodeId: string, portIndex: number = 0, totalPorts: number = 1) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    
    const portSpacing = NODE_HEIGHT / (totalPorts + 1);
    return {
      x: node.x,
      y: node.y + portSpacing * (portIndex + 1),
    };
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Save/Export functions
  const handleSave = () => {
    const saved = saveWorkflow({ name: workflowName, nodes, connections });
    setCurrentWorkflowId(saved.id);
    toast.success("Workflow saved!");
  };

  const handleExport = () => {
    downloadWorkflow({ name: workflowName, nodes, connections });
    toast.success("Workflow exported!");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importWorkflow(content);
      
      if (imported) {
        setNodes(imported.nodes);
        setConnections(imported.connections);
        setWorkflowName(imported.name);
        setCurrentWorkflowId(null);
        toast.success("Workflow imported!");
      } else {
        toast.error("Invalid workflow file");
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = workflowTemplates.find((t) => t.id === templateId);
    if (template) {
      setNodes(template.nodes);
      setConnections(template.connections);
      setWorkflowName(template.name);
      setCurrentWorkflowId(null);
      setShowTemplatesDialog(false);
      toast.success(`Loaded template: ${template.name}`);
    }
  };

  const handleLoadSaved = (workflow: SavedWorkflow) => {
    setNodes(workflow.nodes);
    setConnections(workflow.connections);
    setWorkflowName(workflow.name);
    setCurrentWorkflowId(workflow.id);
    setShowSavedDialog(false);
    toast.success(`Loaded: ${workflow.name}`);
  };

  const savedWorkflows = getWorkflows();
  const templatesByCategory = getTemplatesByCategory();

  const selectedNodeData = nodes.find((n) => n.id === selectedNode);
  const selectedNodeDef = selectedNodeData?.type === "node" ? getNodeDefinition(selectedNodeData.definitionId) : null;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Mobile Blocker */}
      <MobileBlocker />
      
      {/* Desktop Builder - Hidden on mobile */}
      <div className="hidden md:flex flex-col flex-1">
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />

      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-border/40">
        <div className="flex items-center gap-4">
          <Link to="/app" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </Link>
          <div className="h-5 w-px bg-border/60" />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Workflow</span>
            <span className="text-muted-foreground">/</span>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="h-8 w-48 bg-transparent border-none text-foreground font-medium px-2 focus-visible:ring-0"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-lg border-border/60">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            Sui
            <ChevronDown size={14} />
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg border-border/60 font-mono text-xs">
            0xF6EB...173c
          </Button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="h-12 border-b border-border/40 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          {/* File Operations */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 rounded-lg border-border/60">
                <FolderOpen size={14} />
                File
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 rounded-lg">
              <DropdownMenuItem onClick={handleSave} className="gap-2">
                <Save size={14} />
                Save
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport} className="gap-2">
                <Download size={14} />
                Export JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-2">
                <Upload size={14} />
                Import JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowTemplatesDialog(true)} className="gap-2">
                <LayoutGrid size={14} />
                From Template
              </DropdownMenuItem>
              {savedWorkflows.length > 0 && (
                <DropdownMenuItem onClick={() => setShowSavedDialog(true)} className="gap-2">
                  <FolderOpen size={14} />
                  Open Saved
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border/40">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(zoom + 10, 200))}>
              <Plus size={14} />
            </Button>
            <span className="text-xs text-muted-foreground w-10 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(zoom - 10, 25))}>
              <Minus size={14} />
            </Button>
          </div>

          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border/40">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => { setZoom(100); setPan({ x: 0, y: 0 }); }}
              title="Reset view"
            >
              <Maximize2 size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Pan mode: Alt+drag or middle-click">
              <Move size={14} />
            </Button>
          </div>

          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border/40">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={undo} 
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={redo} 
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={14} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 rounded-lg border-border/60"
            onClick={() => setShowShareDialog(true)}
          >
            <Share2 size={14} />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-lg border-border/60"
            onClick={() =>
              isSimulating
                ? stopSimulation()
                : startSimulation(nodes.map((n) => ({ id: n.id, title: n.title, type: n.type })))
            }
          >
            <Play size={14} />
            {isSimulating ? "Stop" : "Simulate"}
          </Button>
          <Button 
            size="sm" 
            className="gap-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setShowDeployDialog(true)}
          >
            <Rocket size={14} />
            Deploy
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Node Library (Sticky) */}
        <aside className="w-56 border-r border-border/40 bg-card flex flex-col sticky top-0 h-[calc(100vh-6.5rem)] overflow-hidden">
          <div className="p-3 border-b border-border/40">
            <h3 className="text-sm font-medium text-foreground">Nodes</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {categoryOrder.filter(cat => nodeCategories[cat]).map((category) => {
              const categoryNodes = nodeCategories[category];
              return (
                <Collapsible
                  key={category}
                  open={expandedCategories.includes(category)}
                  onOpenChange={() => toggleCategory(category)}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-muted/40 transition-colors text-left">
                    <ChevronRight
                      size={14}
                      className={cn(
                        "text-muted-foreground transition-transform",
                        expandedCategories.includes(category) && "rotate-90"
                      )}
                    />
                    <span className="text-muted-foreground">{categoryIcons[category]}</span>
                    <span className="text-sm font-medium text-foreground">{category}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{categoryNodes.length}</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-0.5 mt-1">
                    {categoryNodes.map((nodeDef) => (
                      <button
                        key={nodeDef.id}
                        onClick={() => handleAddNode(nodeDef)}
                        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-muted/40 transition-colors text-left group"
                      >
                        <div className={cn(
                          "h-6 w-6 rounded-md bg-gradient-to-br flex items-center justify-center text-white",
                          nodeDef.color
                        )}>
                          {nodeDef.icon}
                        </div>
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {nodeDef.label}
                        </span>
                      </button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </aside>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className={cn(
            "flex-1 relative overflow-hidden dot-grid",
            isPanning && "cursor-grabbing"
          )}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            handleMouseUp();
            setConnectingFrom(null);
          }}
          onClick={handleCanvasClick}
          style={{ cursor: isPanning ? "grabbing" : undefined }}
        >
          {/* Transformed canvas content */}
          <div 
            className="absolute inset-0"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
              transformOrigin: "0 0",
            }}
          >
            {/* Connection Lines SVG */}
            <svg className="absolute w-[5000px] h-[5000px] pointer-events-none" style={{ zIndex: 1, left: -2500, top: -2500 }}>
            {connections.map((conn) => {
              const fromNode = nodes.find((n) => n.id === conn.fromNode);
              const toNode = nodes.find((n) => n.id === conn.toNode);
              if (!fromNode || !toNode) return null;
              
              const fromOutputCount = getOutputPortCount(fromNode);
              const toInputCount = getInputPortCount(toNode);
              
              const from = getNodeOutputPos(conn.fromNode, conn.fromPort, fromOutputCount);
              const to = getNodeInputPos(conn.toNode, conn.toPort, toInputCount);
              const midX = (from.x + to.x) / 2;
              
              return (
                <g
                  key={conn.id}
                  className="pointer-events-auto cursor-pointer"
                  onDoubleClick={() => handleDeleteConnection(conn.id)}
                >
                  <path
                    d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                    fill="none"
                    className="hover:stroke-destructive transition-colors"
                  />
                  <path
                    d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                    stroke="transparent"
                    strokeWidth="12"
                    fill="none"
                  >
                    <title>Double-click to remove connection</title>
                  </path>
                </g>
              );
            })}
            
            {/* Drawing connection line */}
            {connectingFrom && (() => {
              const fromNode = nodes.find((n) => n.id === connectingFrom.nodeId);
              if (!fromNode) return null;
              const fromOutputCount = getOutputPortCount(fromNode);
              const fromPos = getNodeOutputPos(connectingFrom.nodeId, connectingFrom.port, fromOutputCount);
              return (
                <path
                  d={`M ${fromPos.x} ${fromPos.y} C ${(fromPos.x + mousePos.x) / 2} ${fromPos.y}, ${(fromPos.x + mousePos.x) / 2} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  fill="none"
                />
              );
            })()}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const nodeDef = node.type === "node" ? getNodeDefinition(node.definitionId) : null;
            const inputCount = getInputPortCount(node);
            const outputCount = getOutputPortCount(node);
            
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "absolute cursor-move select-none",
                  selectedNode === node.id && "z-10"
                )}
                style={{
                  left: node.x,
                  top: node.y,
                  zIndex: selectedNode === node.id ? 10 : 2,
                }}
                onMouseDown={(e) => {
                  setSelectedNode(node.id);
                  handleMouseDown(e, node.id);
                }}
              >
                <div
                  className={cn(
                    "bg-card rounded-xl p-4 min-w-[260px] transition-all border group/node relative",
                    expandedNodes.has(node.id) ? "w-72" : "",
                    selectedNode === node.id
                      ? "border-primary/60"
                      : "border-border/60 hover:border-border"
                  )}
                  style={{ minHeight: NODE_HEIGHT }}
                >
                  {/* Delete button - shows on hover for non-settings nodes */}
                  {node.type !== "settings" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(node.id);
                      }}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover/node:opacity-100 transition-opacity hover:bg-destructive/90"
                    >
                      <X size={12} />
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    {node.type === "settings" ? (
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Settings size={14} className="text-primary" />
                      </div>
                    ) : nodeDef && (
                      <div className={cn(
                        "h-7 w-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white",
                        nodeDef.color
                      )}>
                        {nodeDef.icon}
                      </div>
                    )}
                    <span className="text-sm font-medium text-foreground flex-1">{node.title}</span>
                    {node.type !== "settings" && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          title="Duplicate"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newNode = {
                              ...node,
                              id: `node-${Date.now()}`,
                              x: node.x + 40,
                              y: node.y + 40,
                              config: { ...(node.config || {}) },
                            };
                            setNodes([...nodes, newNode]);
                            setSelectedNode(newNode.id);
                          }}
                        >
                          <Copy size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-destructive hover:text-destructive"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNode(node.id);
                          }}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    )}
                    {node.type !== "settings" && nodeDef?.configFields && nodeDef.configFields.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNodeExpanded(node.id);
                        }}
                        className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      >
                        <ChevronRight 
                          size={12} 
                          className={cn("transition-transform", expandedNodes.has(node.id) && "rotate-90")} 
                        />
                      </button>
                    )}
                  </div>

                  {/* Inline Config Fields */}
                  {node.type !== "settings" && nodeDef?.configFields && expandedNodes.has(node.id) && (
                    <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                      {nodeDef.configFields.slice(0, 8).map((field) => (
                        <div key={field.name}>
                          <Label className="text-[10px] text-muted-foreground">{field.label}</Label>
                          {(field.type === "text" || field.type === "number") && (
                            <Input
                              type={field.type}
                              placeholder={field.placeholder || `{{${field.name}}}`}
                              value={String(node.config?.[field.name] ?? "")}
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                setNodes(nodes.map((n) =>
                                  n.id === node.id
                                    ? { ...n, config: { ...n.config, [field.name]: e.target.value } }
                                    : n
                                ));
                              }}
                              className="h-7 text-xs mt-0.5"
                            />
                          )}
                          {field.type === "select" && (
                            <Select
                              value={String(node.config?.[field.name] ?? "")}
                              onValueChange={(value) => {
                                setNodes(nodes.map((n) =>
                                  n.id === node.id
                                    ? { ...n, config: { ...n.config, [field.name]: value } }
                                    : n
                                ));
                              }}
                            >
                              <SelectTrigger 
                                className="h-7 text-xs mt-0.5"
                                onClick={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Config Preview (when not expanded) */}
                  {node.type !== "settings" && nodeDef?.configFields && !expandedNodes.has(node.id) && node.config && Object.keys(node.config).length > 0 && (
                    <div className="mt-2 text-[10px] text-muted-foreground space-y-0.5">
                      {Object.entries(node.config).slice(0, 2).map(([key, value]) => (
                        value && (
                          <div key={key} className="truncate">
                            <span className="text-muted-foreground/60">{key}:</span> {String(value).includes("{{") ? <span className="text-primary">{String(value)}</span> : String(value)}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                  
                  {node.type === "settings" && (
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Network</span>
                        <span className="text-foreground">Sui</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Wallet</span>
                        <span className="text-foreground font-mono">0xF6...173c</span>
                      </div>
                    </div>
                  )}

                  {node.type === "node" && nodeDef && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {nodeDef.category}
                    </div>
                  )}
                </div>

                {/* Input Ports */}
                {inputCount > 0 && Array.from({ length: inputCount }).map((_, i) => {
                  const portSpacing = NODE_HEIGHT / (inputCount + 1);
                  return (
                    <div
                      key={`input-${i}`}
                      className="absolute left-0 -translate-x-1/2 h-3 w-3 rounded-full bg-card border-2 border-border hover:border-primary hover:bg-primary/20 transition-colors cursor-crosshair"
                      style={{ top: portSpacing * (i + 1) }}
                      onMouseUp={(e) => handleCompleteConnection(e, node.id, i)}
                    />
                  );
                })}

                {/* Output Ports */}
                {outputCount > 0 && Array.from({ length: outputCount }).map((_, i) => {
                  const portSpacing = NODE_HEIGHT / (outputCount + 1);
                  return (
                    <div
                      key={`output-${i}`}
                      className="absolute right-0 translate-x-1/2 h-3 w-3 rounded-full bg-card border-2 border-border hover:border-primary hover:bg-primary/20 transition-colors cursor-crosshair"
                      style={{ top: portSpacing * (i + 1) }}
                      onMouseDown={(e) => handleStartConnection(e, node.id, i)}
                    />
                  );
                })}
              </motion.div>
            );
          })}
          </div>
          
          {/* Connection hint - outside the transformed container */}
          {connectingFrom && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card border border-border/60 rounded-lg px-3 py-1.5 text-xs text-muted-foreground z-20">
              Click on another node's input port to connect, or click canvas to cancel
            </div>
          )}
          
          {/* Zoom indicator */}
          <div className="absolute bottom-14 right-4 bg-card/80 border border-border/60 rounded-lg px-2 py-1 text-xs text-muted-foreground z-20">
            {zoom}% • Scroll to zoom
          </div>

          {/* Simulation Terminal */}
          <SimulationTerminal
            isSimulating={isSimulating}
            onStartSimulation={() => startSimulation(nodes.map(n => ({ id: n.id, title: n.title, type: n.type })))}
            onStopSimulation={stopSimulation}
            logs={terminalLogs}
            onClearLogs={clearLogs}
          />
        </div>

        {/* Right Panel - Node Config - HIDDEN */}
        {false && selectedNodeData && (
          <motion.aside
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            className="w-72 border-l border-border/40 bg-card overflow-y-auto"
          >
            <div className="p-4 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedNodeData.type === "settings" ? (
                    <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Settings size={12} className="text-primary" />
                    </div>
                  ) : selectedNodeDef && (
                    <div className={cn(
                      "h-6 w-6 rounded-lg bg-gradient-to-br flex items-center justify-center text-white",
                      selectedNodeDef.color
                    )}>
                      {selectedNodeDef.icon}
                    </div>
                  )}
                  <h3 className="font-medium text-foreground text-sm">{selectedNodeData.title}</h3>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Play size={12} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Copy size={12} />
                  </Button>
                  {selectedNodeData.type !== "settings" && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive"
                      onClick={() => handleDeleteNode(selectedNodeData.id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4">
              <Tabs defaultValue="inputs">
                <TabsList className="w-full bg-muted/30 p-0.5 rounded-lg h-8">
                  <TabsTrigger value="inputs" className="flex-1 rounded text-xs h-7 data-[state=active]:bg-background">Inputs</TabsTrigger>
                  <TabsTrigger value="data" className="flex-1 rounded text-xs h-7 data-[state=active]:bg-background">Data</TabsTrigger>
                </TabsList>
                <TabsContent value="inputs" className="mt-4 space-y-3">
                  {selectedNodeData.type === "settings" && (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">Network</Label>
                        <Select defaultValue="sui">
                          <SelectTrigger className="mt-1 h-8 rounded-lg border-border/60">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            <SelectItem value="sui">Sui</SelectItem>
                            <SelectItem value="eth">Ethereum</SelectItem>
                            <SelectItem value="polygon">Polygon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Smart Wallet</Label>
                        <Select defaultValue="wallet1">
                          <SelectTrigger className="mt-1 h-8 rounded-lg border-border/60">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            <SelectItem value="wallet1">My 1st Smart Wallet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Variables Section */}
                      <div className="pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs text-muted-foreground">Variables</Label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs"
                            onClick={handleAddVariable}
                          >
                            <Plus size={12} className="mr-1" />
                            Add
                          </Button>
                        </div>
                        {workflowVariables.length === 0 ? (
                          <p className="text-xs text-muted-foreground/60">
                            No variables defined. Use {"{{variable}}"} in nodes.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {workflowVariables.map((variable, index) => (
                              <div key={index} className="flex items-center gap-1.5">
                                <Input
                                  value={variable.name}
                                  onChange={(e) => handleUpdateVariable(index, "name", e.target.value)}
                                  placeholder="name"
                                  className="h-7 text-xs flex-1"
                                />
                                <Input
                                  value={variable.value}
                                  onChange={(e) => handleUpdateVariable(index, "value", e.target.value)}
                                  placeholder="value"
                                  className="h-7 text-xs flex-1"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleRemoveVariable(index)}
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {selectedNodeDef?.configFields?.map((field) => (
                    <div key={field.name}>
                      <Label className="text-xs text-muted-foreground">{field.label}</Label>
                      {field.type === "text" && (
                        <Input
                          placeholder={field.placeholder}
                          className="mt-1 h-8 rounded-lg border-border/60 text-sm"
                        />
                      )}
                      {field.type === "number" && (
                        <Input
                          type="number"
                          placeholder={field.placeholder}
                          className="mt-1 h-8 rounded-lg border-border/60 text-sm"
                        />
                      )}
                      {field.type === "textarea" && (
                        <Textarea
                          placeholder={field.placeholder}
                          className="mt-1 rounded-lg border-border/60 text-sm min-h-[80px]"
                        />
                      )}
                      {field.type === "select" && field.options && (
                        <Select>
                          <SelectTrigger className="mt-1 h-8 rounded-lg border-border/60">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            {field.options.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="data" className="mt-4">
                  <div className="bg-muted/30 border border-border/40 rounded-lg p-3 font-mono text-xs text-muted-foreground">
                    <pre>{`{
  "name": "${workflowName}",
  "chain": "Sui",
  "nodes": ${nodes.length},
  "connections": ${connections.length}
}`}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.aside>
        )}
      </div>

      {/* Templates Dialog */}
      <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Load Template</DialogTitle>
            <DialogDescription>
              Choose a template to start your workflow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {Object.entries(templatesByCategory).map(([category, templates]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-foreground mb-2">{category}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleLoadTemplate(template.id)}
                      className="p-3 border border-border/60 rounded-lg hover:border-primary/60 hover:bg-muted/20 transition-all text-left"
                    >
                      <h5 className="text-sm font-medium text-foreground">{template.name}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                      <p className="text-xs text-primary mt-2">{template.nodes.length} nodes</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Saved Workflows Dialog */}
      <Dialog open={showSavedDialog} onOpenChange={setShowSavedDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Saved Workflows</DialogTitle>
            <DialogDescription>
              Load a previously saved workflow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            {savedWorkflows.map((workflow) => (
              <button
                key={workflow.id}
                onClick={() => handleLoadSaved(workflow)}
                className="w-full p-3 border border-border/60 rounded-lg hover:border-primary/60 hover:bg-muted/20 transition-all text-left"
              >
                <h5 className="text-sm font-medium text-foreground">{workflow.name}</h5>
                <p className="text-xs text-muted-foreground mt-1">
                  {workflow.nodes.length} nodes • {workflow.connections.length} connections
                </p>
                <p className="text-xs text-muted-foreground">
                  Updated: {new Date(workflow.updatedAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Deploy Dialog */}
      <DeployDialog 
        open={showDeployDialog} 
        onOpenChange={setShowDeployDialog}
        workflowName={workflowName}
      />

      {/* Share Dialog */}
      <ShareDialog 
        open={showShareDialog} 
        onOpenChange={setShowShareDialog}
        workflowName={workflowName}
        workflowId={currentWorkflowId || undefined}
      />
      </div>
    </div>
  );
};

export default Builder;
