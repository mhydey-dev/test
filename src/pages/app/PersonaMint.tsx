import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppHeader from "@/components/app/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { usePersonaNft } from "@/hooks/usePersonaNft";
import {
  Sparkles,
  Wallet,
  BadgeCheck,
  ShieldCheck,
  ScanEye,
  ArrowRight,
  Check,
} from "lucide-react";
import { ConnectButton } from "@mysten/dapp-kit-react/ui";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

const PersonaMint = () => {
  const nav = useNavigate();
  const persona = usePersonaNft();
  const [minting, setMinting] = useState(false);
  const currentAccount = useCurrentAccount();

  const step = useMemo(() => {
    if (!persona.connected) return 1;
    if (!persona.minted) return 2;
    return 3;
  }, [persona.connected, persona.minted]);

  const progress = useMemo(() => {
    if (!persona.mounted) return 0;
    if (step === 1) return 25;
    if (step === 2) return 65;
    return 100;
  }, [persona.mounted, step]);

  const onMint = async () => {
    if (!persona.connected) {
      toast.error("Connect a wallet first");
      return;
    }
    if (minting) return;
    setMinting(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      persona.markMinted();
      toast.success("Persona NFT minted", {
        description: "You can now start using Persona.",
      });
      nav("/persona");
    } finally {
      setMinting(false);
    }
  };

  const steps = [
    { n: 1, label: "Connect wallet" },
    { n: 2, label: "Mint Persona" },
    { n: 3, label: "Start using Persona" },
  ];

  return (
    <>
      <AppHeader
        title="Mint Persona NFT"
        subtitle="Mint your identity to unlock Persona"
      />

      <div className="flex-1 px-4 md:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="rounded-2xl border-border/60 overflow-hidden">
            {/* Hero */}
            <div className="relative px-6 md:px-10 pt-10 pb-8 border-b border-border/60">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
              <div className="relative flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/30 text-primary bg-primary/5"
                >
                  Required to use Persona
                </Badge>
                <h2 className="font-display text-2xl md:text-3xl font-bold mt-4">
                  Your Persona, built from your on-chain activity
                </h2>
                <p className="text-muted-foreground mt-2 max-w-xl text-sm md:text-base">
                  Minting creates your Persona AI NFT and enables insights that
                  adapt to how your wallet behaves across protocols over time.
                </p>

                <div className="mt-5 flex items-center gap-2 flex-wrap justify-center">
                  {currentAccount?.address ? (
                    <Badge
                      variant="outline"
                      className="rounded-full border-border/60 bg-muted/30"
                    >
                      <Wallet className="h-3 w-3 mr-1" />
                      {currentAccount.address.slice(0, 6)}…
                      {currentAccount.address.slice(-4)}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="rounded-full border-border/60 bg-muted/30"
                    >
                      <Wallet className="h-3 w-3 mr-1" />
                      Wallet not connected
                    </Badge>
                  )}

                  {persona.minted && (
                    <Badge
                      variant="outline"
                      className="rounded-full border-success/30 bg-success/10 text-success"
                    >
                      <BadgeCheck className="h-3 w-3 mr-1" /> Minted
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Steps progress */}
            <div className="px-6 md:px-10 py-6 border-b border-border/60">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>Setup progress</span>
                <span>Step {step} of 3</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {steps.map((s) => {
                  const done = step > s.n;
                  const current = step === s.n;
                  return (
                    <div
                      key={s.n}
                      className={
                        "flex items-center gap-2 rounded-xl border px-3 py-2 " +
                        (current
                          ? "border-primary/40 bg-primary/5"
                          : done
                            ? "border-success/30 bg-success/5"
                            : "border-border/60 bg-muted/20")
                      }
                    >
                      <div
                        className={
                          "h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 " +
                          (done
                            ? "bg-success/20 text-success"
                            : current
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground")
                        }
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : s.n}
                      </div>
                      <span
                        className={
                          "text-xs truncate " +
                          (current || done
                            ? "text-foreground"
                            : "text-muted-foreground")
                        }
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Features */}
            <div className="px-6 md:px-10 py-6 border-b border-border/60 grid md:grid-cols-3 gap-3">
              {[
                {
                  icon: ScanEye,
                  title: "On-chain grounded",
                  desc: "Knowledge based on your wallet's activity across protocols.",
                },
                {
                  icon: ShieldCheck,
                  title: "Proof-ready",
                  desc: "Anchors an identity you can reference in proofs and policies.",
                },
                {
                  icon: Sparkles,
                  title: "Personalized answers",
                  desc: "Insights that reflect your behavior, not generic data.",
                },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {f.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-6 md:px-10 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                {persona.minted ? (
                  <span>
                    You're all set. Go to{" "}
                    <Link
                      to="/persona"
                      className="text-foreground underline underline-offset-2"
                    >
                      Persona
                    </Link>{" "}
                    to start asking questions.
                  </span>
                ) : (
                  <span>
                    Single transaction · Gas only · 1 mint per wallet
                  </span>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                {!persona.connected ? (
                  <ConnectButton />
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => {
                        persona.disconnect();
                        toast("Disconnected wallet");
                      }}
                    >
                      Disconnect
                    </Button>
                    <Button
                      onClick={onMint}
                      disabled={minting || persona.minted}
                      className="rounded-xl gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      {persona.minted
                        ? "Minted"
                        : minting
                          ? "Minting…"
                          : "Mint Persona NFT"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default PersonaMint;
