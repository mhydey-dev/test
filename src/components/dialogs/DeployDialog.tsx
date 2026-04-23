import { useState } from "react";
import { Rocket, Check, AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface DeployDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowName: string;
}

export const DeployDialog = ({ open, onOpenChange, workflowName }: DeployDialogProps) => {
  const [network, setNetwork] = useState("bsc-mainnet");
  const [autoRetry, setAutoRetry] = useState(true);
  const [gasOptimize, setGasOptimize] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<"idle" | "deploying" | "success" | "error">("idle");

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployStatus("deploying");
    
    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDeployStatus("success");
    setIsDeploying(false);
  };

  const handleClose = () => {
    if (!isDeploying) {
      onOpenChange(false);
      setDeployStatus("idle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Rocket size={16} className="text-primary" />
            </div>
            Deploy Workflow
          </DialogTitle>
          <DialogDescription>
            Deploy "{workflowName}" to the blockchain network.
          </DialogDescription>
        </DialogHeader>

        {deployStatus === "success" ? (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
              <Check size={28} className="text-emerald-500" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Workflow Deployed!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your workflow is now active and running on {network === "bsc-mainnet" ? "BSC Mainnet" : "BSC Testnet"}.
            </p>
            <Button onClick={handleClose} className="rounded-xl">
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Network</Label>
                <Select value={network} onValueChange={setNetwork} disabled={isDeploying}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="bsc-mainnet">BSC Mainnet</SelectItem>
                    <SelectItem value="bsc-testnet">BSC Testnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-retry on failure</Label>
                    <p className="text-xs text-muted-foreground">Automatically retry failed transactions</p>
                  </div>
                  <Switch checked={autoRetry} onCheckedChange={setAutoRetry} disabled={isDeploying} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Gas optimization</Label>
                    <p className="text-xs text-muted-foreground">Optimize gas usage for transactions</p>
                  </div>
                  <Switch checked={gasOptimize} onCheckedChange={setGasOptimize} disabled={isDeploying} />
                </div>
              </div>

              {network === "bsc-mainnet" && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <AlertCircle size={16} className="text-primary mt-0.5 shrink-0" />
                  <p className="text-xs text-foreground">
                    You're deploying to mainnet. Real funds will be used. Make sure your workflow is tested.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose} disabled={isDeploying} className="rounded-xl">
                Cancel
              </Button>
              <Button 
                onClick={handleDeploy} 
                disabled={isDeploying}
                className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isDeploying ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket size={14} />
                    Deploy Now
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
