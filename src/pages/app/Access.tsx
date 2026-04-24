import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCurrentAccount, useDAppKit } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { Wallet } from "lucide-react";
import { dataConsumers, TOTAL_EARNINGS } from "@/lib/reputation-mock";

const Access = () => {
  const [claiming, setClaiming] = useState(false);
  const [claimedUsdc, setClaimedUsdc] = useState(0);
  const account = useCurrentAccount();
  const dAppKit = useDAppKit();

  const CLAIM_PACKAGE_ID =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  const CLAIM_MODULE = "earnings_vault";
  const CLAIM_FUNCTION = "claim";

  const claimableUsdc = Math.max(0, TOTAL_EARNINGS - claimedUsdc);
  const suiPerUsdc = 0.62; // mock conversion rate
  const claimableSui = useMemo(
    () => claimableUsdc * suiPerUsdc,
    [claimableUsdc],
  );

  const claim = async () => {
    if (claiming) return;
    if (!account?.address) {
      toast.error("Connect a wallet first");
      return;
    }
    if (claimableUsdc <= 0) {
      toast("Nothing to claim");
      return;
    }
    setClaiming(true);
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${CLAIM_PACKAGE_ID}::${CLAIM_MODULE}::${CLAIM_FUNCTION}`,
        arguments: [tx.pure.address(account.address)],
      });

      const result = await dAppKit.signAndExecuteTransaction({ transaction: tx });
      if (result.FailedTransaction) {
        const failure = result.FailedTransaction.status.error;
        const failureMessage =
          typeof failure === "string"
            ? failure
            : failure?.message ?? "Claim failed on-chain";
        throw new Error(failureMessage);
      }

      setClaimedUsdc((v) => v + claimableUsdc);
      toast.success("Claim sent", {
        description: `Claimed ${claimableSui.toFixed(2)} SUI · tx ${result.Transaction.digest.slice(0, 10)}…`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Claim transaction failed";
      toast.error("Claim failed", { description: message });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <>
      <div className="flex-1 px-4 md:px-8 py-6 space-y-6">
        {/* Claim */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-xl font-bold">Claim earnings</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Claim your data-access earnings in <span className="text-foreground font-medium">SUI</span>.
            </p>
          </div>
          <Button onClick={claim} className="rounded-xl" disabled={claiming || claimableUsdc <= 0}>
            <Wallet className="h-4 w-4 mr-1.5" />
            {claiming ? "Claiming…" : "Claim in SUI"}
          </Button>
        </div>

        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Claimable</p>
            <p className="font-display text-2xl font-bold mt-1">{claimableSui.toFixed(2)} SUI</p>
            <p className="text-xs text-muted-foreground mt-1">
              ≈ ${claimableUsdc.toFixed(2)} (mock rate)
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Already claimed</p>
            <p className="font-display text-2xl font-bold mt-1">
              {(claimedUsdc * suiPerUsdc).toFixed(2)} SUI
            </p>
            <p className="text-xs text-muted-foreground mt-1">All-time</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Settlement</p>
            <p className="text-sm font-medium text-foreground mt-1">On-chain (Sui testnet)</p>
            <p className="text-xs text-muted-foreground mt-1">
              Signed and executed from your connected wallet
            </p>
          </div>
        </div>

        <section>
          <h2 className="font-display text-xl font-bold mb-4">Income stream</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left">
                  <th className="py-2 pr-4 font-medium text-muted-foreground">Source</th>
                  <th className="py-2 pr-4 font-medium text-muted-foreground">Category</th>
                  <th className="py-2 pr-4 font-medium text-muted-foreground">Status</th>
                  <th className="py-2 font-medium text-muted-foreground text-right">Income (USD)</th>
                </tr>
              </thead>
              <tbody>
                {dataConsumers.map((consumer) => (
                  <tr key={consumer.id} className="border-b border-border/40">
                    <td className="py-3 pr-4">{consumer.app}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{consumer.category}</td>
                    <td className="py-3 pr-4 capitalize">{consumer.status}</td>
                    <td className="py-3 text-right">${consumer.paid.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </>
  );
};

export default Access;
