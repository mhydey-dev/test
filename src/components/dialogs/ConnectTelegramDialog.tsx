import { useState } from "react";
import { Send, Copy, Check, Loader2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ConnectTelegramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTelegramConnected?: (username: string) => void;
}

export const ConnectTelegramDialog = ({ open, onOpenChange, onTelegramConnected }: ConnectTelegramDialogProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const botUsername = "@FlowFiBot";
  const generatedCode = "FLOWFI-" + Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenTelegram = () => {
    window.open(`https://t.me/FlowFiBot?start=${generatedCode}`, "_blank");
    setStep(2);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    
    // Simulate verification check
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStep(3);
    setIsVerifying(false);
  };

  const handleComplete = () => {
    onTelegramConnected?.("@user");
    toast.success("Telegram connected successfully!");
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
    setVerificationCode("");
    setIsVerifying(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#0088cc]/15 flex items-center justify-center">
              <Send size={16} className="text-[#0088cc]" />
            </div>
            Connect Telegram
          </DialogTitle>
          <DialogDescription>
            Connect your Telegram account to receive instant notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/30 text-center">
                <div className="h-16 w-16 rounded-full bg-[#0088cc]/15 flex items-center justify-center mx-auto mb-3">
                  <Send size={28} className="text-[#0088cc]" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  To connect Telegram, you'll need to message our bot with a verification code.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Your verification code</Label>
                <div className="flex gap-2">
                  <Input 
                    value={generatedCode} 
                    readOnly 
                    className="rounded-xl text-center font-mono font-semibold tracking-wider"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleCopyCode}
                    className="rounded-xl shrink-0"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/30 text-center">
                <Loader2 size={32} className="animate-spin text-primary mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Waiting for verification...
                </p>
                <p className="text-xs text-muted-foreground">
                  Send the code to {botUsername} on Telegram
                </p>
              </div>

              <div className="p-3 rounded-xl border border-border/60">
                <p className="text-xs text-muted-foreground mb-2">Verification code:</p>
                <p className="font-mono font-semibold text-center tracking-wider">{generatedCode}</p>
              </div>

              <Button 
                variant="outline" 
                className="w-full gap-2 rounded-xl"
                onClick={handleOpenTelegram}
              >
                <ExternalLink size={14} />
                Open Telegram
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="py-4 text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-emerald-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Telegram Connected!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You'll now receive workflow notifications on Telegram.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step === 1 && (
            <>
              <Button variant="outline" onClick={handleClose} className="rounded-xl">
                Cancel
              </Button>
              <Button 
                onClick={handleOpenTelegram}
                className="gap-2 rounded-xl bg-[#0088cc] hover:bg-[#0088cc]/90 text-white"
              >
                <Send size={14} />
                Open Telegram
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Button variant="outline" onClick={handleClose} className="rounded-xl">
                Cancel
              </Button>
              <Button 
                onClick={handleVerify}
                disabled={isVerifying}
                className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isVerifying ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Checking...
                  </>
                ) : (
                  "I've sent the code"
                )}
              </Button>
            </>
          )}

          {step === 3 && (
            <Button 
              onClick={handleComplete}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
