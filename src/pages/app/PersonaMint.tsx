import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppHeader from "@/components/app/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

  const onConnect = () => {
    const addr = persona.connect();
    toast.success("Wallet connected", { description: `Connected: ${addr}` });
  };

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

  return (
    <>
      <AppHeader
        title="Mint Persona NFT"
        subtitle="Mint your identity to unlock Persona"
      />

      <div className="flex-1 px-4 md:px-8 pb-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid lg:grid-cols-3 gap-4"
        >
          <Card className="lg:col-span-2 rounded-2xl border-border/60 p-6 md:p-8 overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-transparent" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge
                    variant="outline"
                    className="rounded-full border-primary/30 text-primary bg-primary/5"
                  >
                    <Sparkles className="h-3 w-3 mr-1" /> Required to use Persona
                  </Badge>
                  <h2 className="font-display text-2xl md:text-3xl font-bold mt-3">
                    Your Persona is built from your on-chain activity
                  </h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl">
                    Minting creates your Persona AI NFT and enables insights that
                    adapt to how your wallet behaves across protocols over time.
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-2">
                  {currentAccount?.address ? (
                    <Badge
                      variant="outline"
                      className="rounded-full border-border/60 bg-muted/30"
                    >
                      <Wallet className="h-3 w-3 mr-1" />
                      {currentAccount.address}
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

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Setup progress</span>
                  <span>
                    Step {step} / 3
                    {step === 1
                      ? " · Connect"
                      : step === 2
                        ? " · Mint"
                        : " · Ready"}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="mt-6 grid md:grid-cols-3 gap-3">
                {[
                  {
                    icon: ScanEye,
                    title: "On-chain grounded",
                    desc: "Persona knowledge is based on your wallet’s activity across protocols.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Proof-ready",
                    desc: "Minting anchors an identity you can later reference in proofs and access policies.",
                  },
                  {
                    icon: Sparkles,
                    title: "Personalized answers",
                    desc: "Ask questions and get insights that reflect your behavior, not generic data.",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-border/40 bg-muted/20 p-4"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {f.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  {persona.minted ? (
                    <span>
                      You’re all set. Go to{" "}
                      <Link to="/persona" className="text-foreground underline">
                        Persona
                      </Link>{" "}
                      to start asking questions.
                    </span>
                  ) : (
                    <span>
                      Minting takes a single transaction. You can mint once per
                      wallet.
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!persona.connected ? (
                    <ConnectButton />
                  ) : (
                    <>
                      <Button
                        onClick={onMint}
                        disabled={minting || persona.minted}
                        className="rounded-xl gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        {persona.minted ? "Minted" : minting ? "Minting…" : "Mint Persona NFT"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-border/60 p-6">
            <h3 className="font-display text-lg font-bold">Mint details</h3>
            <p className="text-xs text-muted-foreground mt-1">
              UI is ready; wire in the real mint call when your contract is set.
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium text-foreground">SUI</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Supply</span>
                <span className="font-medium text-foreground">1 / wallet</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Mint cost</span>
                <span className="font-medium text-foreground">Gas only</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                {persona.minted ? (
                  <Badge
                    variant="outline"
                    className="rounded-full border-success/30 bg-success/10 text-success"
                  >
                    <BadgeCheck className="h-3 w-3 mr-1" /> Minted
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="rounded-full border-border/60 bg-muted/30 text-muted-foreground"
                  >
                    Not minted
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="my-5" />

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Need to reset demo state?
              </p>
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => {
                  persona.reset();
                  toast("Persona state reset");
                }}
              >
                Reset
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default PersonaMint;

