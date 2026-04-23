import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Zap, Activity, FileText, Filter } from "lucide-react";
import AppHeader from "@/components/app/AppHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Workflow {
  id: string;
  name: string;
  lastUpdated: string;
  chain: string;
  trigger: string;
  executions: string;
  status: "Running" | "Stopped" | "Completed" | "Failed" | "Draft";
}

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "BTC Price Alert Bot",
    lastUpdated: "Feb 8, 2:45 PM",
    chain: "Sui",
    trigger: "Price",
    executions: "127 / ∞",
    status: "Running",
  },
  {
    id: "2",
    name: "ETH DCA Strategy",
    lastUpdated: "Feb 8, 11:30 AM",
    chain: "Sui",
    trigger: "Schedule",
    executions: "24 / ∞",
    status: "Running",
  },
  {
    id: "3",
    name: "Whale Alert Monitor",
    lastUpdated: "Feb 7, 9:15 PM",
    chain: "Sui",
    trigger: "Contract",
    executions: "56 / 100",
    status: "Running",
  },
  {
    id: "4",
    name: "Stop-Loss on PancakeSwap",
    lastUpdated: "Feb 8, 11:31 AM",
    chain: "Sui",
    trigger: "Price",
    executions: "- / 5",
    status: "Draft",
  },
  {
    id: "5",
    name: "AI Trading Assistant",
    lastUpdated: "Feb 6, 3:20 PM",
    chain: "Sui",
    trigger: "AI",
    executions: "89 / ∞",
    status: "Stopped",
  },
  {
    id: "6",
    name: "Low Balance Alert",
    lastUpdated: "Feb 5, 10:00 AM",
    chain: "Sui",
    trigger: "Schedule",
    executions: "312 / ∞",
    status: "Completed",
  },
  {
    id: "7",
    name: "NFT Floor Price Bot",
    lastUpdated: "Feb 4, 8:45 PM",
    chain: "Sui",
    trigger: "Contract",
    executions: "15 / 50",
    status: "Failed",
  },
  {
    id: "8",
    name: "Arbitrage Scanner",
    lastUpdated: "Feb 8, 1:00 PM",
    chain: "Sui",
    trigger: "Contract",
    executions: "- / ∞",
    status: "Draft",
  },
];

const statusFilters = ["All", "Running", "Stopped", "Completed", "Failed", "Draft"];
const timeFilters = ["Last Month", "Last 3 Months", "This Year"];

const Workflows = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedTime, setSelectedTime] = useState("Last Month");

  const activeCount = mockWorkflows.filter(w => w.status === "Running").length;
  const draftCount = mockWorkflows.filter(w => w.status === "Draft").length;
  const totalExecutions = mockWorkflows.reduce((sum, w) => {
    const match = w.executions.match(/^(\d+)/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);

  const getStatusStyle = (status: Workflow["status"]) => {
    switch (status) {
      case "Running":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Stopped":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "Failed":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "Draft":
      default:
        return "border-border/60";
    }
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4">Smart Wallets</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            <Checkbox className="rounded-md" />
            <span>My 1st Smart Wallet</span>
          </label>
        </div>
      </div>

      <div className="border-t border-border/50 pt-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Status</h3>
        <div className="space-y-3">
          {statusFilters.map((status) => (
            <label 
              key={status}
              className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
            >
              <Checkbox 
                checked={selectedStatus === status}
                onCheckedChange={() => setSelectedStatus(status)}
                className="rounded-md"
              />
              <span>{status}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-border/50 pt-6">
        <h3 className="text-sm font-medium text-foreground mb-4">Last Updated</h3>
        <div className="space-y-3">
          {timeFilters.map((time) => (
            <label 
              key={time}
              className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
            >
              <Checkbox 
                checked={selectedTime === time}
                onCheckedChange={() => setSelectedTime(time)}
                className="rounded-md"
              />
              <span>{time}</span>
            </label>
          ))}
        </div>
        
        <Button variant="outline" size="sm" className="w-full mt-5 rounded-xl border-border/60">
          Apply Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <AppHeader title="Workflows" />
      
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col md:flex-row px-4 md:px-8 pb-8 gap-6">
          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-xl w-full">
                  <Filter size={16} />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block w-60 shrink-0"
          >
            <div className="card-outlined p-5 sticky top-0">
              <FilterSidebar />
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-5 mb-6 md:mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="stat-card flex items-center gap-3 md:gap-4"
              >
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                  <Activity size={20} className="text-muted-foreground md:w-6 md:h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-xl md:text-3xl font-display font-bold text-foreground">{activeCount}</span>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Active</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="stat-card flex items-center gap-3 md:gap-4"
              >
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                  <Zap size={20} className="text-muted-foreground md:w-6 md:h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-xl md:text-3xl font-display font-bold text-foreground">{totalExecutions.toLocaleString()}</span>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Executions</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="stat-card flex items-center gap-3 md:gap-4"
              >
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-muted-foreground md:w-6 md:h-6" />
                </div>
                <div className="min-w-0">
                  <span className="text-xl md:text-3xl font-display font-bold text-foreground">{draftCount}</span>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">Drafts</p>
                </div>
              </motion.div>
            </div>

            {/* Workflows List - Mobile Cards */}
            <div className="md:hidden space-y-3">
              {mockWorkflows.map((workflow) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-outlined p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-foreground truncate">{workflow.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{workflow.lastUpdated}</p>
                    </div>
                    <Badge variant="outline" className={getStatusStyle(workflow.status)}>
                      {workflow.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{workflow.chain}</span>
                    <span>•</span>
                    <span>{workflow.trigger}</span>
                    <span>•</span>
                    <span>{workflow.executions}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Workflows Table - Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden md:block"
            >
              <p className="text-sm text-muted-foreground mb-4">
                Showing {mockWorkflows.length} out of {mockWorkflows.length} workflows
              </p>
              
              <div className="card-outlined overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="w-10">
                        <Checkbox className="rounded-md" />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
                      <TableHead className="hidden xl:table-cell">Chain</TableHead>
                      <TableHead className="hidden lg:table-cell">Trigger</TableHead>
                      <TableHead className="hidden xl:table-cell">Executions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockWorkflows.map((workflow) => (
                      <TableRow key={workflow.id} className="border-border/50 hover:bg-muted/30">
                        <TableCell>
                          <Checkbox className="rounded-md" />
                        </TableCell>
                        <TableCell className="font-medium">{workflow.name}</TableCell>
                        <TableCell className="text-muted-foreground hidden lg:table-cell">{workflow.lastUpdated}</TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <Badge variant="outline" className="bg-muted/50 text-foreground border-border/60">
                            {workflow.chain}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground hidden lg:table-cell">{workflow.trigger}</TableCell>
                        <TableCell className="text-muted-foreground hidden xl:table-cell">{workflow.executions}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusStyle(workflow.status)}>{workflow.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Workflows;
