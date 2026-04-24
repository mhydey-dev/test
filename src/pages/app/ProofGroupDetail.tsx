import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Users,
  ExternalLink,
} from "lucide-react";
import {
  proofProviders,
  zkProofGroups,
  zkProofLevelsByGroupId,
  type ZkProofLevel,
} from "@/lib/reputation-mock";

type GroupStatus = "none" | "active" | "revoked";

const ProofGroupDetail = () => {
  const { id } = useParams();

  const providerById = useMemo(
    () => new Map(proofProviders.map((p) => [p.id, p] as const)),
    [],
  );

  const group = useMemo(
    () => zkProofGroups.find((g) => g.id === id),
    [id],
  );
  const levels = useMemo(
    () => (id ? zkProofLevelsByGroupId[id] ?? [] : []),
    [id],
  );

  const [status, setStatus] = useState<GroupStatus>("none");
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [busyLevelId, setBusyLevelId] = useState<string | null>(null);

  const activeLevel = useMemo(
    () => levels.find((l) => l.id === activeLevelId) ?? null,
    [levels, activeLevelId],
  );

  if (!group) {
    return (
      <>
        <div className="flex-1 px-4 md:px-8 pb-8">
          <Card className="rounded-2xl border-border/60 border-dashed p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No proof group exists with id <code>{id}</code>.
            </p>
            <Button asChild className="rounded-xl">
              <Link to="/proofs">Back to proof groups</Link>
            </Button>
          </Card>
        </div>
      </>
    );
  }

  const provider = providerById.get(group.providerId);

  const generate = async (l: ZkProofLevel) => {
    setBusyLevelId(l.id);
    await new Promise((r) => setTimeout(r, 800));
    setStatus("active");
    setActiveLevelId(l.id);
    setBusyLevelId(null);
    toast.success("Proof generated", {
      description: `${l.name} is now your active level.`,
    });
  };

  const revoke = () => {
    setStatus("revoked");
    setActiveLevelId(null);
    toast.success("Group revoked", {
      description: "All levels are unlocked again.",
    });
  };

  /**
   * Locking rule: when a level is active, every level with a LOWER rank
   * is implied (technical less) and shown as locked / deactivated.
   * Higher levels remain available to upgrade.
   */
  const isLocked = (l: ZkProofLevel) => {
    if (status !== "active" || !activeLevel) return false;
    return l.rank < activeLevel.rank;
  };
  const isActive = (l: ZkProofLevel) =>
    status === "active" && activeLevelId === l.id;

  return (
    <>
      <div className="flex-1 px-4 md:px-8 py-6 space-y-6">
        <Button asChild variant="ghost" size="sm" className="rounded-xl -ml-2">
          <Link to="/proofs">
            <ArrowLeft className="h-4 w-4 mr-1" /> All proof groups
          </Link>
        </Button>

        {/* Group header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="rounded-2xl border-border/60 p-6">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="h-14 w-14 rounded-xl bg-muted/40 overflow-hidden border border-border/40 shrink-0">
                <img
                  src={group.imageUrl}
                  alt={`${group.title} logo`}
                  className="h-full w-full object-cover"
                  width={56}
                  height={56}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {group.title}
                  </h2>
                  <Badge
                    variant="outline"
                    className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                  >
                    {group.category}
                  </Badge>
                  {provider && (
                    <Badge
                      variant="outline"
                      className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                    >
                      {provider.name}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={
                      "rounded-full text-[10px] " +
                      (status === "active"
                        ? "border-success/30 bg-success/10 text-success"
                        : status === "revoked"
                          ? "border-destructive/30 bg-destructive/10 text-destructive"
                          : "border-border/60 text-muted-foreground")
                    }
                  >
                    {status === "active"
                      ? "Active"
                      : status === "revoked"
                        ? "Revoked"
                        : "Not generated"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mt-2">
                  {group.subtitle}
                </p>

                {activeLevel && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                    <span>Current active level:</span>
                    <span className="text-foreground font-medium">
                      {activeLevel.name}
                    </span>
                    <span>·</span>
                    <span>Level {activeLevel.rank}</span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                className="rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                onClick={revoke}
                disabled={status !== "active"}
              >
                <Ban className="h-4 w-4 mr-1.5" />
                Revoke group
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Levels */}
        <div className="space-y-2">
          {levels.map((l) => {
            const locked = isLocked(l);
            const active = isActive(l);
            const busy = busyLevelId === l.id;

            return (
              <Card
                key={l.id}
                className={
                  "rounded-2xl border-border/60 p-5 transition-opacity " +
                  (locked ? "opacity-60" : "")
                }
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display font-semibold text-foreground">
                        {l.name}
                      </p>
                      <Badge
                        variant="outline"
                        className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                      >
                        Level {l.rank}
                      </Badge>
                      {active && (
                        <Badge
                          variant="outline"
                          className="rounded-full text-[10px] border-success/30 bg-success/10 text-success"
                        >
                          <ShieldCheck className="h-3 w-3 mr-1" /> Active
                        </Badge>
                      )}
                      {locked && (
                        <Badge
                          variant="outline"
                          className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                        >
                          <Lock className="h-3 w-3 mr-1" /> Implied by Level{" "}
                          {activeLevel?.rank}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">
                      {l.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-2 inline-flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      <span className="text-foreground font-medium">
                        {l.completedCount.toLocaleString()}
                      </span>{" "}
                      completed
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {active ? (
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        disabled
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1.5" /> Generated
                      </Button>
                    ) : (
                      <Button
                        className="rounded-xl"
                        onClick={() => generate(l)}
                        disabled={locked || busy}
                      >
                        {busy ? (
                          <>Generating…</>
                        ) : (
                          <>
                            {/* <Sparkles className="h-4 w-4 mr-1.5" /> */}
                            Generate proof
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="rounded-2xl border-border/60 border-dashed p-4">
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground font-medium">How it works:</span>{" "}
            generating a higher level proves the lower levels by implication, so
            those are deactivated to avoid leaking redundant data. Revoking the
            group unlocks all levels again.
          </p>
        </Card>

        {/* Provider footer */}
        {provider && (
          <footer className="border-t border-border/60 pt-4 mt-2">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="h-10 w-10 rounded-lg overflow-hidden border border-border/40 bg-muted/40 shrink-0">
                <img
                  src={provider.imageUrl}
                  alt={`${provider.name} logo`}
                  className="h-full w-full object-cover"
                  width={40}
                  height={40}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-foreground">
                    {provider.name}
                  </p>
                  <span className="text-[11px] text-muted-foreground">
                    Provider
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {provider.about}
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-xl shrink-0"
              >
                <a
                  href={provider.websiteUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Visit
                  <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                </a>
              </Button>
            </div>
          </footer>
        )}
      </div>
    </>
  );
};

export default ProofGroupDetail;
