import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronUp, 
  ChevronDown, 
  Terminal, 
  Play, 
  Square, 
  Trash2,
  Circle,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export type LogLevel = "info" | "success" | "warning" | "error" | "debug";

export interface TerminalLog {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  nodeId?: string;
  nodeName?: string;
}

interface SimulationTerminalProps {
  isSimulating: boolean;
  onStartSimulation: () => void;
  onStopSimulation: () => void;
  logs: TerminalLog[];
  onClearLogs: () => void;
}

const levelStyles: Record<LogLevel, { color: string; icon: React.ReactNode }> = {
  info: { 
    color: "text-blue-400", 
    icon: <Circle size={10} className="fill-blue-400 text-blue-400" /> 
  },
  success: { 
    color: "text-emerald-400", 
    icon: <CheckCircle2 size={12} className="text-emerald-400" /> 
  },
  warning: { 
    color: "text-amber-400", 
    icon: <Circle size={10} className="fill-amber-400 text-amber-400" /> 
  },
  error: { 
    color: "text-red-400", 
    icon: <XCircle size={12} className="text-red-400" /> 
  },
  debug: { 
    color: "text-muted-foreground", 
    icon: <Circle size={8} className="text-muted-foreground" /> 
  },
};

export const SimulationTerminal = ({
  isSimulating,
  onStartSimulation,
  onStopSimulation,
  logs,
  onClearLogs,
}: SimulationTerminalProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(200);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current && isExpanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isExpanded]);

  // Auto-expand when simulation starts
  useEffect(() => {
    if (isSimulating && !isExpanded) {
      setIsExpanded(true);
    }
  }, [isSimulating]);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30">
      {/* Terminal Header - Always Visible */}
      <div 
        className={cn(
          "flex items-center justify-between px-4 py-2 bg-card/95 backdrop-blur-sm border-t border-border/60 cursor-pointer",
          isExpanded && "border-b border-border/40"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Simulation Output</span>
          </div>
          {isSimulating && (
            <div className="flex items-center gap-1.5 text-xs text-primary">
              <Loader2 size={12} className="animate-spin" />
              <span>Running...</span>
            </div>
          )}
          {logs.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {logs.length} {logs.length === 1 ? "log" : "logs"}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isSimulating ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 gap-1.5 text-xs hover:bg-primary/10 hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onStartSimulation();
              }}
            >
              <Play size={12} />
              Run
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 gap-1.5 text-xs text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onStopSimulation();
              }}
            >
              <Square size={12} />
              Stop
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onClearLogs();
            }}
          >
            <Trash2 size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#0d0d0d] overflow-hidden"
          >
            <div 
              ref={scrollRef}
              className="h-full overflow-y-auto font-mono text-xs p-3 space-y-1"
              style={{ height }}
            >
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>No simulation output yet. Click "Run" to start.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-muted-foreground/60 shrink-0">
                      [{formatTime(log.timestamp)}]
                    </span>
                    <span className="shrink-0 mt-0.5">
                      {levelStyles[log.level].icon}
                    </span>
                    {log.nodeName && (
                      <span className="text-primary/80 shrink-0">
                        [{log.nodeName}]
                      </span>
                    )}
                    <span className={cn(levelStyles[log.level].color)}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Hook for managing terminal state
export const useSimulationTerminal = () => {
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (level: LogLevel, message: string, nodeId?: string, nodeName?: string) => {
    const newLog: TerminalLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      message,
      nodeId,
      nodeName,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const clearLogs = () => setLogs([]);

  const startSimulation = (nodes: Array<{ id: string; title: string; type: string }>) => {
    setIsSimulating(true);
    addLog("info", "Starting workflow simulation...");
    
    // Simulate workflow execution
    let step = 0;
    const executeStep = () => {
      if (step >= nodes.length) {
        addLog("success", "Simulation completed successfully!");
        setIsSimulating(false);
        return;
      }

      const node = nodes[step];
      if (node.type === "settings") {
        addLog("debug", "Initializing workflow settings", node.id, node.title);
      } else {
        addLog("info", `Executing node...`, node.id, node.title);
        
        // Simulate random outputs
        setTimeout(() => {
          const outputs = [
            { level: "success" as LogLevel, msg: "Node executed successfully" },
            { level: "info" as LogLevel, msg: `Output: ${JSON.stringify({ value: Math.random().toFixed(4) })}` },
            { level: "warning" as LogLevel, msg: "Rate limit approaching (80% used)" },
          ];
          const randomOutput = outputs[Math.floor(Math.random() * outputs.length)];
          addLog(randomOutput.level, randomOutput.msg, node.id, node.title);
        }, 300);
      }
      
      step++;
      simulationRef.current = setTimeout(executeStep, 800 + Math.random() * 400);
    };

    simulationRef.current = setTimeout(executeStep, 500);
  };

  const stopSimulation = () => {
    if (simulationRef.current) {
      clearTimeout(simulationRef.current);
    }
    setIsSimulating(false);
    addLog("warning", "Simulation stopped by user");
  };

  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        clearTimeout(simulationRef.current);
      }
    };
  }, []);

  return {
    logs,
    isSimulating,
    addLog,
    clearLogs,
    startSimulation,
    stopSimulation,
  };
};

export default SimulationTerminal;
