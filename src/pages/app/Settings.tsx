import { useState } from "react";
import { motion } from "framer-motion";
import { User, Key, Plus, Mail, Send, Trash2, Eye, EyeOff, Edit2 } from "lucide-react";
import AppHeader from "@/components/app/AppHeader";
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
import { AddEmailDialog } from "@/components/dialogs/AddEmailDialog";
import { ConnectTelegramDialog } from "@/components/dialogs/ConnectTelegramDialog";
import { AddSecretDialog } from "@/components/dialogs/AddSecretDialog";
import { toast } from "sonner";

interface ConnectedEmail {
  email: string;
  label: string;
  verified: boolean;
}

interface ConnectedTelegram {
  username: string;
  connected: boolean;
}

interface Secret {
  name: string;
  value: string;
  type: "api_key" | "token" | "password" | "other";
  description?: string;
}

const Settings = () => {
  const [displayName, setDisplayName] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  
  // Connected accounts
  const [emails, setEmails] = useState<ConnectedEmail[]>([]);
  const [telegrams, setTelegrams] = useState<ConnectedTelegram[]>([]);
  
  // Secrets
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  
  // Dialogs
  const [showAddEmailDialog, setShowAddEmailDialog] = useState(false);
  const [showConnectTelegramDialog, setShowConnectTelegramDialog] = useState(false);
  const [showAddSecretDialog, setShowAddSecretDialog] = useState(false);

  const handleEmailAdded = (email: string, label: string) => {
    setEmails(prev => [...prev, { email, label, verified: true }]);
  };

  const handleTelegramConnected = (username: string) => {
    setTelegrams(prev => [...prev, { username, connected: true }]);
  };

  const handleSecretAdded = (secret: Secret) => {
    setSecrets(prev => [...prev, secret]);
  };

  const handleDeleteEmail = (email: string) => {
    setEmails(prev => prev.filter(e => e.email !== email));
    toast.success("Email removed");
  };

  const handleDeleteTelegram = (username: string) => {
    setTelegrams(prev => prev.filter(t => t.username !== username));
    toast.success("Telegram disconnected");
  };

  const handleDeleteSecret = (name: string) => {
    setSecrets(prev => prev.filter(s => s.name !== name));
    toast.success("Secret deleted");
  };

  const toggleSecretVisibility = (name: string) => {
    setVisibleSecrets(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const maskValue = (value: string) => {
    if (value.length <= 8) return "••••••••";
    return value.substring(0, 4) + "••••••••" + value.substring(value.length - 4);
  };

  return (
    <>
      <AppHeader title="Settings" />
      
      <div className="flex-1 overflow-auto px-4 md:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <Tabs defaultValue="profile" className="space-y-6 md:space-y-8">
            <TabsList className="bg-muted/30 p-1 rounded-xl w-full sm:w-auto">
              <TabsTrigger value="profile" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex-1 sm:flex-initial">
                <User size={16} />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="secrets" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm flex-1 sm:flex-initial">
                <Key size={16} />
                <span className="hidden sm:inline">Secrets & Variables</span>
                <span className="sm:hidden">Secrets</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 md:space-y-8">
              {/* Profile Settings */}
              <div className="card-outlined p-5 md:p-8">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4 md:mb-6">
                  Profile Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-sm">Display Name</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      How we address you in notifications.
                    </p>
                    <Input
                      id="displayName"
                      placeholder="Enter your display name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="rounded-xl border-border/60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-sm">Time Zone</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Your local time zone for scheduling.
                    </p>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="rounded-xl border-border/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="UTC">(UTC+00:00) UTC</SelectItem>
                        <SelectItem value="PST">(UTC-08:00) Pacific Time</SelectItem>
                        <SelectItem value="EST">(UTC-05:00) Eastern Time</SelectItem>
                        <SelectItem value="GMT">(UTC+00:00) London</SelectItem>
                        <SelectItem value="CET">(UTC+01:00) Central European</SelectItem>
                        <SelectItem value="IST">(UTC+05:30) India Standard</SelectItem>
                        <SelectItem value="JST">(UTC+09:00) Japan Standard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">Primary Email</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      For account notifications.
                    </p>
                    <Select>
                      <SelectTrigger className="rounded-xl border-border/60">
                        <SelectValue placeholder={emails.length > 0 ? emails[0].email : "No email configured"} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {emails.length === 0 ? (
                          <SelectItem value="none">No email configured</SelectItem>
                        ) : (
                          emails.map(e => (
                            <SelectItem key={e.email} value={e.email}>{e.label}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telegram" className="text-sm">Primary Telegram</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      For instant notifications.
                    </p>
                    <Select>
                      <SelectTrigger className="rounded-xl border-border/60">
                        <SelectValue placeholder={telegrams.length > 0 ? telegrams[0].username : "No Telegram configured"} />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {telegrams.length === 0 ? (
                          <SelectItem value="none">No Telegram configured</SelectItem>
                        ) : (
                          telegrams.map(t => (
                            <SelectItem key={t.username} value={t.username}>{t.username}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  className="mt-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                  onClick={() => toast.success("Settings saved!")}
                >
                  Save Changes
                </Button>
              </div>

              {/* Connected Accounts */}
              <div className="card-outlined p-5 md:p-8">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Connected Accounts
                </h3>
                <p className="text-sm text-muted-foreground mb-6 md:mb-8">
                  Accounts for workflows and notifications.
                </p>

                {/* Email Accounts */}
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-foreground">Email Accounts</h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 rounded-xl border-border/60"
                      onClick={() => setShowAddEmailDialog(true)}
                    >
                      <Plus size={14} />
                      <span className="hidden sm:inline">Add Email</span>
                    </Button>
                  </div>
                  
                  {emails.length === 0 ? (
                    <div className="card-outlined p-8 md:p-10 flex flex-col items-center justify-center text-center">
                      <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                        <Mail size={24} className="text-muted-foreground md:w-7 md:h-7" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 md:mb-5">
                        No email configured yet.
                      </p>
                      <Button 
                        className="gap-2 rounded-xl"
                        onClick={() => setShowAddEmailDialog(true)}
                      >
                        Add Email
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {emails.map(email => (
                        <div 
                          key={email.email}
                          className="flex items-center justify-between p-3 md:p-4 rounded-xl border border-border/60 bg-card"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Mail size={16} className="text-primary md:w-[18px] md:h-[18px]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{email.label}</p>
                              <p className="text-xs text-muted-foreground truncate">{email.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="hidden sm:inline text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                              Verified
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteEmail(email.email)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Telegram Accounts */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-foreground">Telegram Accounts</h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 rounded-xl border-border/60"
                      onClick={() => setShowConnectTelegramDialog(true)}
                    >
                      <Plus size={14} />
                      <span className="hidden sm:inline">Connect</span>
                    </Button>
                  </div>
                  
                  {telegrams.length === 0 ? (
                    <div className="card-outlined p-8 md:p-10 flex flex-col items-center justify-center text-center">
                      <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                        <Send size={24} className="text-muted-foreground md:w-7 md:h-7" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 md:mb-5">
                        No Telegram connected yet.
                      </p>
                      <Button 
                        className="gap-2 rounded-xl"
                        onClick={() => setShowConnectTelegramDialog(true)}
                      >
                        Connect Telegram
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {telegrams.map(telegram => (
                        <div 
                          key={telegram.username}
                          className="flex items-center justify-between p-3 md:p-4 rounded-xl border border-border/60 bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-[#0088cc]/10 flex items-center justify-center">
                              <Send size={16} className="text-[#0088cc] md:w-[18px] md:h-[18px]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{telegram.username}</p>
                              <p className="text-xs text-muted-foreground">Telegram</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="hidden sm:inline text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                              Connected
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteTelegram(telegram.username)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="secrets" className="space-y-6 md:space-y-8">
              {/* Secrets Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Secrets & Variables
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Store API keys and sensitive values securely.
                  </p>
                </div>
                <Button 
                  className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                  onClick={() => setShowAddSecretDialog(true)}
                >
                  <Plus size={16} />
                  Add Secret
                </Button>
              </div>

              {secrets.length === 0 ? (
                <div className="card-outlined p-8 md:p-10 flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-4 md:mb-6">
                    <Key size={28} className="text-muted-foreground md:w-9 md:h-9" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    No Secrets Configured
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 md:mb-6 max-w-md">
                    Add API keys and environment variables to use in your workflows.
                  </p>
                  <Button 
                    className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setShowAddSecretDialog(true)}
                  >
                    <Plus size={16} />
                    Add Secret
                  </Button>
                </div>
              ) : (
                <>
                  {/* Mobile: Card view */}
                  <div className="md:hidden space-y-3">
                    {secrets.map((secret) => (
                      <div key={secret.name} className="card-outlined p-4">
                        <div className="flex items-start justify-between mb-3">
                          <code className="text-sm font-mono text-foreground bg-muted/30 px-2 py-1 rounded">
                            {secret.name}
                          </code>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Edit2 size={12} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteSecret(secret.name)}
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-xs font-mono text-muted-foreground">
                            {visibleSecrets.has(secret.name) ? secret.value : maskValue(secret.value)}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleSecretVisibility(secret.name)}
                          >
                            {visibleSecrets.has(secret.name) ? <EyeOff size={12} /> : <Eye size={12} />}
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full capitalize">
                          {secret.type.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: Table view */}
                  <div className="hidden md:block card-outlined overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/60 bg-muted/20">
                          <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                          <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
                          <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                          <th className="text-right p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {secrets.map((secret, index) => (
                          <tr 
                            key={secret.name}
                            className={index !== secrets.length - 1 ? "border-b border-border/40" : ""}
                          >
                            <td className="p-4">
                              <code className="text-sm font-mono text-foreground bg-muted/30 px-2 py-1 rounded">
                                {secret.name}
                              </code>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono text-muted-foreground">
                                  {visibleSecrets.has(secret.name) ? secret.value : maskValue(secret.value)}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => toggleSecretVisibility(secret.name)}
                                >
                                  {visibleSecrets.has(secret.name) ? <EyeOff size={12} /> : <Eye size={12} />}
                                </Button>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full capitalize">
                                {secret.type.replace("_", " ")}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Edit2 size={12} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                  onClick={() => handleDeleteSecret(secret.name)}
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Usage info */}
              <div className="card-outlined p-5 md:p-6">
                <h4 className="font-medium text-foreground mb-3">Using Secrets in Workflows</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Reference your secrets in workflow nodes using the following syntax:
                </p>
                <div className="bg-muted/30 rounded-xl p-3 md:p-4 font-mono text-sm overflow-x-auto">
                  <code className="text-foreground">{"{{SECRET_NAME}}"}</code>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Secrets are encrypted at rest and never exposed in logs.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Dialogs */}
      <AddEmailDialog 
        open={showAddEmailDialog} 
        onOpenChange={setShowAddEmailDialog}
        onEmailAdded={handleEmailAdded}
      />
      <ConnectTelegramDialog 
        open={showConnectTelegramDialog} 
        onOpenChange={setShowConnectTelegramDialog}
        onTelegramConnected={handleTelegramConnected}
      />
      <AddSecretDialog 
        open={showAddSecretDialog} 
        onOpenChange={setShowAddSecretDialog}
        onSecretAdded={handleSecretAdded}
      />
    </>
  );
};

export default Settings;
