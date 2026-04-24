import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { usePersonaNft } from "@/hooks/usePersonaNft";
import { Sparkles, Wallet, BadgeCheck, ArrowRight } from "lucide-react";
import { ConnectButton } from "@mysten/dapp-kit-react/ui";
import { useCurrentAccount } from "@mysten/dapp-kit-react";

const PersonaMint = () => {
  const nav = useNavigate();
  const persona = usePersonaNft();
  const [minting, setMinting] = useState(false);
  const currentAccount = useCurrentAccount();

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
    <div className="flex-1 px-4 md:px-8 pb-8">
      <div className="max-w-3xl mx-auto">
        <div className="px-2 py-4 md:px-0 md:py-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h1 className="mt-4 text-2xl md:text-3xl font-semibold">Mint Persona</h1>
          <p className="mt-2 max-w-xl text-sm md:text-base text-muted-foreground">
            Create your Persona NFT once to unlock personalized insights and
            the full Persona experience.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <Wallet className="h-3.5 w-3.5" />
              {currentAccount?.address
                ? `${currentAccount.address.slice(0, 6)}…${currentAccount.address.slice(-4)}`
                : "Wallet not connected"}
            </Badge>
            <Badge variant={persona.minted ? "default" : "outline"} className="gap-1">
              <BadgeCheck className="h-3.5 w-3.5" />
              {persona.minted ? "Minted" : "Not minted"}
            </Badge>
          </div>
        </div>

        <div className="px-2 py-6 md:px-0 md:py-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Step 1
              </p>
              <p className="mt-1 text-sm font-medium">Connect your wallet</p>
            </div>
            <div className="rounded-xl border px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Step 2
              </p>
              <p className="mt-1 text-sm font-medium">Mint your Persona NFT</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {!persona.connected ? (
              <ConnectButton />
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    persona.disconnect();
                    toast("Disconnected wallet");
                  }}
                >
                  Disconnect
                </Button>
                {persona.minted ? (
                  <Button onClick={() => nav("/persona")} className="gap-2">
                    Go to Persona
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={onMint} disabled={minting} className="gap-2">
                    <Sparkles className="h-4 w-4" />
                    {minting ? "Minting..." : "Mint Persona NFT"}
                  </Button>
                )}
              </>
            )}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            One-time mint. Gas fees may apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaMint;
