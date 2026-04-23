import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import AppHeader from "@/components/app/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUpRight,
  Lock,
  ShieldCheck,
  Ban,
} from "lucide-react";
import {
  proofProviders,
  zkProofGroups,
  zkProofTemplatesByGroupId,
  type ZkProofTemplate,
} from "@/lib/reputation-mock";

type GroupProofStatus = "none" | "active" | "revoked";

const ProofGroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const providerById = useMemo(
    () => new Map(proofProviders.map((p) => [p.id, p] as const)),
    [],
  );

  const group = useMemo(() => zkProofGroups.find((g) => g.id === id), [id]);
  const templates = useMemo(
    () => (id ? zkProofTemplatesByGroupId[id] ?? [] : []),
    [id],
  );

  // mock "user state": one active level per group
  const [status, setStatus] = useState<GroupProofStatus>("none");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const activeTemplate = useMemo(
    () => templates.find((t) => t.id === activeTemplateId) ?? null,
    [templates, activeTemplateId],
  );

  if (!group) {
    return (
      <>
        <AppHeader title="Proof group not found" />
        <div className="flex-1 px-4 md:px-8 pb-8">
          <Card className="rounded-2xl border-border/60 border-dashed p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No proof group exists with id <code>{id}</code>.
            </p>
            <Button asChild className="rounded-xl">
              <Link to="/proofs">Back to proofs</Link>
            </Button>
          </Card>
        </div>
      </>
    );
  }

  const provider = providerById.get(group.providerId);

  const generate = (t: ZkProofTemplate) => {
    // When a higher tier is generated, lower tiers become "locked" (technical less).
    setStatus("active");
    setActiveTemplateId(t.id);
    toast.success("Level proof generated", {
      description: `Active level: ${t.title}`,
    });
  };

  const revoke = () => {
    setStatus("revoked");
    setActiveTemplateId(null);
    toast.success("Group revoked", {
      description: "All levels are unlocked again.",
    });
  };

  const isLocked = (t: ZkProofTemplate) => {
    if (status !== "active" || !activeTemplate) return false;
    return t.levelRank < activeTemplate.levelRank;
  };

  return (
    <>
      <AppHeader
        title={group.title}
        subtitle="This group is the parent ZK proof; levels represent your status"
      />

      <div className="flex-1 px-4 md:px-8 pb-8 space-y-6">
        <Button asChild variant="ghost" size="sm" className="rounded-xl -ml-2">
          <Link to="/proofs">
            <ArrowLeft className="h-4 w-4 mr-1" /> All proof groups
          </Link>
        </Button>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-2xl border-border/60 p-6">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="h-12 w-12 rounded-xl bg-muted/40 overflow-hidden border border-border/40 shrink-0">
                <img
                  src={group.imageUrl}
                  alt={`${group.title} logo`}
                  className="h-12 w-12 object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {group.title}
                  </h2>
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
                  Generating a higher level locks lower levels (technical less).
                  Revoking unlocks them again.
                </p>

                {activeTemplate && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                    <span>Current level:</span>
                    <span className="text-foreground font-medium">
                      {activeTemplate.title}
                    </span>
                    <span>·</span>
                    <span>Level {activeTemplate.levelRank}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => navigate("/proofs/new")}
                >
                  Custom proof
                  <ArrowUpRight className="h-4 w-4 ml-1.5" />
                </Button>
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
            </div>
          </Card>
        </motion.div>

        <div className="space-y-2">
          {templates.map((t) => {
            const locked = isLocked(t);
            const isActive = status === "active" && activeTemplateId === t.id;
            return (
              <Card
                key={t.id}
                className={
                  "rounded-2xl border-border/60 p-5 " +
                  (locked ? "opacity-60" : "")
                }
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display font-semibold text-foreground truncate">
                        {t.title}
                      </p>
                      <Badge
                        variant="outline"
                        className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                      >
                        Level {t.levelRank}
                      </Badge>
                      {isActive && (
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
                          <Lock className="h-3 w-3 mr-1" /> Locked
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.description}
                    </p>
                    <code className="block text-xs text-muted-foreground font-mono mt-2 break-all">
                      {t.predicate}
                    </code>
                    <p className="text-[11px] text-muted-foreground mt-2">
                      <span className="text-foreground font-medium">
                        {t.completedCount.toLocaleString()}
                      </span>{" "}
                      completed
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      className="rounded-xl"
                      onClick={() => generate(t)}
                      disabled={locked}
                    >
                      Generate level proof
                      <ArrowUpRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProofGroupDetail;

