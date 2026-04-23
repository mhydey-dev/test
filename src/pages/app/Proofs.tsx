import { useState } from "react";
import { motion } from "framer-motion";
import AppHeader from "@/components/app/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, ShieldCheck, Copy, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { zkTemplates, issuedProofs, type ZkProofTemplate } from "@/lib/reputation-mock";

const Proofs = () => {
  const [selected, setSelected] = useState<ZkProofTemplate | null>(null);
  const [threshold, setThreshold] = useState("700");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<string | null>(null);

  const onGenerate = () => {
    if (!selected) return;
    setGenerating(true);
    setGenerated(null);
    setTimeout(() => {
      const hex = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      setGenerated(`zkp_${hex}`);
      setGenerating(false);
      toast.success("Proof generated", {
        description: "Your zero-knowledge proof is ready to share.",
      });
    }, 1400);
  };

  const copyProof = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated);
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <AppHeader title="ZK Proofs" subtitle="Prove what you need to — reveal nothing else" />

      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 space-y-6">
        {/* Templates */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold">Proof templates</h2>
              <p className="text-sm text-muted-foreground">
                Select a predicate to prove. We generate a zero-knowledge proof from your private data.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {zkTemplates.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  onClick={() => {
                    setSelected(t);
                    setGenerated(null);
                  }}
                  className={
                    "text-left w-full h-full rounded-2xl border p-5 transition-all " +
                    (selected?.id === t.id
                      ? "border-primary bg-primary/5"
                      : "border-border/60 hover:border-border bg-card")
                  }
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-primary" />
                    </div>
                    <Badge variant="outline" className="rounded-full text-[10px] border-border/60">
                      {t.category}
                    </Badge>
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">{t.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{t.description}</p>
                  <code className="block text-xs px-2 py-1.5 rounded-md bg-muted text-muted-foreground font-mono">
                    {t.predicate}
                  </code>
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Generator */}
        {selected && (
          <Card className="rounded-2xl border-border/60 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Generate proof: {selected.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{selected.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Predicate</Label>
                  <Input
                    value={selected.predicate.includes(">") && selected.id === "z1"
                      ? `score > ${threshold}`
                      : selected.predicate}
                    onChange={(e) => {
                      const m = e.target.value.match(/(\d+)/);
                      if (m) setThreshold(m[1]);
                    }}
                    className="rounded-xl mt-1.5 font-mono text-sm"
                    readOnly={selected.id !== "z1"}
                  />
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Disclosure</Label>
                  <div className="mt-1.5 p-3 rounded-xl border border-border/60 bg-muted/30 text-sm space-y-1.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-foreground">Predicate result (true/false)</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>Underlying score is <span className="font-medium">never revealed</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>Wallet history stays private</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={onGenerate}
                  disabled={generating}
                  className="rounded-xl w-full bg-primary hover:bg-primary/90"
                >
                  {generating ? "Generating proof…" : "Generate ZK proof"}
                </Button>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/30 p-4 min-h-[200px] flex flex-col">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Proof output</Label>
                {generating ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                    <p className="text-sm">Computing constraints…</p>
                  </div>
                ) : generated ? (
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-3 rounded-lg bg-background border border-border/60 font-mono text-xs break-all text-foreground">
                      {generated}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-success" />
                        Verified · valid for 30 days
                      </div>
                      <Button onClick={copyProof} size="sm" variant="outline" className="rounded-xl">
                        <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground text-center px-4">
                    Click "Generate ZK proof" to produce a verifiable artifact.
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Issued history */}
        <Card className="rounded-2xl border-border/60 p-6">
          <h2 className="font-display text-xl font-bold mb-4">Recently issued proofs</h2>
          <div className="space-y-3">
            {issuedProofs.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-border/40">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4 text-success" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.template}</p>
                    <code className="text-xs text-muted-foreground font-mono">{p.predicate}</code>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                  <span className="hidden sm:inline">{p.consumer}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {p.expiresIn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Proofs;
