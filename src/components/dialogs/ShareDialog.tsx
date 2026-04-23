import { useState } from "react";
import { Share2, Copy, Check, Link2, Users, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowName: string;
  workflowId?: string;
}

export const ShareDialog = ({ open, onOpenChange, workflowName, workflowId }: ShareDialogProps) => {
  const [visibility, setVisibility] = useState<"private" | "team" | "public">("private");
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://flowfi.app/workflow/${workflowId || "draft"}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Share2 size={16} className="text-primary" />
            </div>
            Share Workflow
          </DialogTitle>
          <DialogDescription>
            Share "{workflowName}" with others.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Visibility</Label>
            <RadioGroup value={visibility} onValueChange={(v) => setVisibility(v as typeof visibility)}>
              <div className="flex items-center space-x-3 p-3 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Link2 size={16} className="text-muted-foreground" />
                    <span>Private</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Only you can access this workflow</p>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="team" id="team" />
                <Label htmlFor="team" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    <span>Team</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Anyone in your team can view and clone</p>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-muted-foreground" />
                    <span>Public</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Anyone with the link can view and clone</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {visibility !== "private" && (
            <div className="space-y-2">
              <Label>Share link</Label>
              <div className="flex gap-2">
                <Input 
                  value={shareUrl} 
                  readOnly 
                  className="rounded-xl text-sm"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleCopy}
                  className="rounded-xl shrink-0"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              toast.success("Sharing settings updated!");
              onOpenChange(false);
            }}
            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
