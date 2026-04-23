import { useState } from "react";
import { Key, Eye, EyeOff, Plus, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Secret {
  name: string;
  value: string;
  type: "api_key" | "token" | "password" | "other";
  description?: string;
}

interface AddSecretDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSecretAdded?: (secret: Secret) => void;
}

export const AddSecretDialog = ({ open, onOpenChange, onSecretAdded }: AddSecretDialogProps) => {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<Secret["type"]>("api_key");
  const [description, setDescription] = useState("");
  const [showValue, setShowValue] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a secret name");
      return;
    }
    if (!value.trim()) {
      toast.error("Please enter a secret value");
      return;
    }

    // Validate name format (uppercase with underscores)
    const validName = /^[A-Z][A-Z0-9_]*$/.test(name);
    if (!validName) {
      toast.error("Secret name must be uppercase with underscores (e.g., API_KEY)");
      return;
    }

    setIsSaving(true);
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSecretAdded?.({ name, value, type, description });
    toast.success("Secret added successfully!");
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    setName("");
    setValue("");
    setType("api_key");
    setDescription("");
    setShowValue(false);
    setIsSaving(false);
  };

  const formatName = (input: string) => {
    return input.toUpperCase().replace(/[^A-Z0-9_]/g, "_").replace(/_+/g, "_");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Key size={16} className="text-primary" />
            </div>
            Add Secret
          </DialogTitle>
          <DialogDescription>
            Store API keys, tokens, and other sensitive values securely.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="MY_API_KEY"
                value={name}
                onChange={(e) => setName(formatName(e.target.value))}
                className="rounded-xl font-mono"
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">
                Use in workflows as <code className="bg-muted px-1 rounded">${`{{${name || "NAME"}}`}</code>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as Secret["type"])} disabled={isSaving}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="api_key">API Key</SelectItem>
                  <SelectItem value="token">Access Token</SelectItem>
                  <SelectItem value="password">Password</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <div className="relative">
              <Input
                id="value"
                type={showValue ? "text" : "password"}
                placeholder="Enter secret value..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="rounded-xl pr-10 font-mono"
                disabled={isSaving}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowValue(!showValue)}
                disabled={isSaving}
              >
                {showValue ? <EyeOff size={14} /> : <Eye size={14} />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What is this secret used for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl resize-none"
              rows={2}
              disabled={isSaving}
            />
          </div>

          <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Security note:</strong> Secrets are encrypted and stored securely. 
              They are never exposed in logs or workflow outputs.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSaving} className="rounded-xl">
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || !name || !value}
            className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus size={14} />
                Add Secret
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
