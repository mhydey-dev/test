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
      <div className="flex-1 px-4 md:px-8 py-6 space-y-6">
        <div>
          <h2 className="font-display text-xl font-bold mb-1">
            Connected socials
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Optional — boosts your score and unlocks new proofs.
          </p>
          <div className="rounded-xl border border-border/40">
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
                className="flex items-center justify-between p-4 border-b border-border/40 last:border-b-0"
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
        </div>

        <div>
          <h2 className="font-display text-xl font-bold mb-4">
            Data access and permissions
          </h2>
          <div className="space-y-4">
            {[
              {
                label: "Zero Knowledge Proofs access to dApps",
                enabled: true,
              },
              {
                label: "Persona access to dApps",
                enabled: true,
              },
            ].map((p) => (
              <div key={p.label} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{p.label}</span>
                <Switch defaultChecked={p.enabled} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
