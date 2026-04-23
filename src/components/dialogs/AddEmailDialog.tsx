import { useState } from "react";
import { Mail, Loader2, Check } from "lucide-react";
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

interface AddEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmailAdded?: (email: string, label: string) => void;
}

export const AddEmailDialog = ({ open, onOpenChange, onEmailAdded }: AddEmailDialogProps) => {
  const [email, setEmail] = useState("");
  const [label, setLabel] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleSendVerification = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setIsVerifying(true);
    
    // Simulate sending verification email
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setVerificationSent(true);
    setIsVerifying(false);
    toast.success("Verification email sent!");
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      toast.error("Please enter the verification code");
      return;
    }

    setIsVerifying(true);
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Email verified successfully!");
    onEmailAdded?.(email, label || email);
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    setEmail("");
    setLabel("");
    setVerificationSent(false);
    setVerificationCode("");
    setIsVerifying(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Mail size={16} className="text-primary" />
            </div>
            Add Email Address
          </DialogTitle>
          <DialogDescription>
            Add an email address to receive workflow notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!verificationSent ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                  disabled={isVerifying}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Label (optional)</Label>
                <Input
                  id="label"
                  placeholder="e.g., Work Email, Personal"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="rounded-xl"
                  disabled={isVerifying}
                />
                <p className="text-xs text-muted-foreground">
                  A friendly name to identify this email
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/30 text-center">
                <Mail size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-foreground mb-1">Verification email sent to:</p>
                <p className="text-sm font-medium text-primary">{email}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="rounded-xl text-center text-lg tracking-widest"
                  maxLength={6}
                  disabled={isVerifying}
                />
              </div>

              <Button 
                variant="link" 
                className="w-full text-sm"
                onClick={handleSendVerification}
                disabled={isVerifying}
              >
                Didn't receive it? Resend code
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isVerifying} className="rounded-xl">
            Cancel
          </Button>
          {!verificationSent ? (
            <Button 
              onClick={handleSendVerification}
              disabled={isVerifying || !email}
              className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Verification"
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleVerify}
              disabled={isVerifying || verificationCode.length < 6}
              className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Verify Email
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
