import AppHeader from "@/components/app/AppHeader";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wallet, Github, Twitter, ShieldCheck } from "lucide-react";

const Settings = () => {
  return (
    <>
      <AppHeader
        title="Settings"
        subtitle="Identity sources, privacy, and notifications"
      />

      <div className="flex-1 px-4 md:px-8 py-6 space-y-6 max-w-3xl">
        <Card className="rounded-2xl border-border/60 p-6">
          <h2 className="font-display text-xl font-bold mb-4">
            Connected wallet
          </h2>
          <div className="flex items-center justify-between p-4 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  0x7a3f…b21e
                </p>
                <p className="text-xs text-muted-foreground">SUI · 3.2y old</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="rounded-full border-success/30 bg-success/10 text-success"
            >
              <ShieldCheck className="h-3 w-3 mr-1" /> Verified
            </Badge>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/60 p-6">
          <h2 className="font-display text-xl font-bold mb-1">
            Off-chain data sources
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Optional — boosts your score and unlocks new proofs.
          </p>
          <div className="space-y-2">
            {[
              {
                icon: Github,
                label: "GitHub",
                sub: "Adds developer reputation",
              },
              { icon: Twitter, label: "Twitter / X", sub: "Social signals" },
              {
                icon: ShieldCheck,
                label: "KYC attestation",
                sub: "Sybil-resistant identity",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between p-4 rounded-xl border border-border/40"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                    <s.icon className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {s.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.sub}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border-border/60 p-6">
          <h2 className="font-display text-xl font-bold mb-4">
            Privacy preferences
          </h2>
          <div className="space-y-4">
            {[
              {
                label: "Allow anonymized score in public leaderboards",
                enabled: true,
              },
              {
                label: "Auto-approve proofs for whitelisted dApps",
                enabled: false,
              },
              {
                label: "Email me when a new dApp queries my data",
                enabled: true,
              },
              { label: "Notify on score change > 10 points", enabled: true },
            ].map((p) => (
              <div key={p.label} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{p.label}</span>
                <Switch defaultChecked={p.enabled} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Settings;
