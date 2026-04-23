import { useMemo, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import { motion } from "framer-motion";
import AppHeader from "@/components/app/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  Copy,
  RefreshCw,
  Ban,
  Share2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X as XIcon,
  Hourglass,
  Clock,
  FileCode2,
  Cpu,
  Eye,
  Instagram,
  Landmark,
  ExternalLink,
} from "lucide-react";
import {
  issuedProofs,
  zkTemplates,
  proofProviders,
  proofGroups,
  type IssuedProof,
  type ProofStatus,
} from "@/lib/reputation-mock";

const STATUS_META: Record<
  ProofStatus,
  { label: string; className: string; icon: typeof ShieldCheck; }
> = {
  active: {
    label: "Active",
    className: "border-success/30 bg-success/10 text-success",
    icon: ShieldCheck,
  },
  expired: {
    label: "Expired",
    className: "border-warning/30 bg-warning/10 text-warning",
    icon: AlertCircle,
  },
  revoked: {
    label: "Revoked",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    icon: XIcon,
  },
  pending: {
    label: "Pending",
    className: "border-info/30 bg-info/10 text-info",
    icon: Hourglass,
  },
};

const ProofDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNew = id === "new";

  // Resolve initial proof or seed from a template
  const initialFromList = useMemo(
    () => (isNew ? null : (issuedProofs.find((p) => p.id === id) ?? null)),
    [id, isNew],
  );

  const seedTemplateId = searchParams.get("template") ?? zkTemplates[0].id;
  const seedTemplate =
    zkTemplates.find((t) => t.id === seedTemplateId) ?? zkTemplates[0];

  const providerById = useMemo(
    () => new Map(proofProviders.map((p) => [p.id, p] as const)),
    [],
  );
  const groupById = useMemo(
    () => new Map(proofGroups.map((g) => [g.id, g] as const)),
    [],
  );

  const ProviderIcon = (brand: string) => {
    if (brand === "x") return XIcon;
    if (brand === "instagram") return Instagram;
    if (brand === "bank") return Landmark;
    return ShieldCheck;
  };

  // Local "live" copy of the proof so revoke/renew/regenerate update the UI
  const [proof, setProof] = useState<IssuedProof | null>(initialFromList);
  const [predicate, setPredicate] = useState(
    initialFromList?.predicate ?? seedTemplate.predicate,
  );
  const [busy, setBusy] = useState<null | "generate" | "renew" | "revoke">(
    null,
  );

  const meta = proof ? STATUS_META[proof.status] : null;
  const StatusIcon = meta?.icon ?? Sparkles;

  const template = proof
    ? zkTemplates.find((t) => t.id === proof.templateId) ?? seedTemplate
    : seedTemplate;
  const provider = providerById.get(template.providerId);
  const group = groupById.get(template.groupId);
  const ProvIcon = ProviderIcon(provider?.brand ?? "databook");

  // Not found
  if (!isNew && !proof) {
    return (
      <>
        <AppHeader title="Proof not found" />
        <div className="flex-1 px-4 md:px-8 pb-8">
          <Card className="rounded-2xl border-border/60 border-dashed p-12 text-center">
            <p className="text-muted-foreground mb-4">
              No proof exists with id <code>{id}</code>.
            </p>
            <Button asChild className="rounded-xl">
              <Link to="/proofs">Back to proofs</Link>
            </Button>
          </Card>
        </div>
      </>
    );
  }

  const generateHash = () => {
    let h = "0x";
    for (let i = 0; i < 32; i++)
      h += Math.floor(Math.random() * 16).toString(16);
    return h;
  };

  const onGenerate = () => {
    setBusy("generate");
    setTimeout(() => {
      const newProof: IssuedProof = {
        id: `ip${Math.floor(Math.random() * 9000 + 1000)}`,
        templateId: seedTemplate.id,
        template: seedTemplate.title,
        predicate,
        category: seedTemplate.category,
        issuedAt: "Today",
        issuedAtMs: Date.now(),
        expiresAt: "in 30 days",
        expiresInDays: 30,
        status: "active",
        proofHash: generateHash(),
        verifications: 0,
        size: "2.3 KB",
        zkSystem: "Groth16",
      };
      setProof(newProof);
      setBusy(null);
      toast.success("Proof generated", {
        description: "Your zero-knowledge proof is ready to share.",
      });
      navigate(`/proofs/${newProof.id}`, { replace: true });
    }, 1200);
  };

  const onRenew = () => {
    if (!proof) return;
    setBusy("renew");
    setTimeout(() => {
      setProof({
        ...proof,
        status: "active",
        issuedAt: "Today",
        issuedAtMs: Date.now(),
        expiresAt: "in 30 days",
        expiresInDays: 30,
        proofHash: generateHash(),
      });
      setBusy(null);
      toast.success("Proof renewed", {
        description: "Lifetime extended by 30 days.",
      });
    }, 900);
  };

  const onRevoke = () => {
    if (!proof) return;
    setBusy("revoke");
    setTimeout(() => {
      setProof({ ...proof, status: "revoked" });
      setBusy(null);
      toast.success("Proof revoked", {
        description: "Verifiers will no longer accept this proof.",
      });
    }, 600);
  };

  const copy = (text: string, label = "Copied to clipboard") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  const headerTitle = proof
    ? proof.template
    : `Generate: ${seedTemplate.title}`;
  const headerSubtitle = proof
    ? `Proof ${proof.id}`
    : "Configure the predicate, then generate a verifiable artifact.";

  return (
    <>
      <AppHeader title={headerTitle} subtitle={headerSubtitle} />

      <div className="flex-1 px-4 md:px-8 pb-8 space-y-6">
        {/* Back link */}
        <Button asChild variant="ghost" size="sm" className="rounded-xl -ml-2">
          <Link to="/proofs">
            <ArrowLeft className="h-4 w-4 mr-1" /> All proofs
          </Link>
        </Button>

        {/* Status / hero card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="rounded-2xl border-border/60 p-6">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <ProvIcon className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {proof?.template ?? seedTemplate.title}
                  </h2>
                  {provider && (
                    <Badge
                      variant="outline"
                      className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                    >
                      {provider.name}
                    </Badge>
                  )}
                  {proof && meta && (
                    <Badge
                      variant="outline"
                      className={"rounded-full text-xs " + meta.className}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" /> {meta.label}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                  >
                    {proof?.category ?? seedTemplate.category}
                  </Badge>
                </div>
                <code className="block text-sm text-muted-foreground font-mono mt-2 break-all">
                  {proof?.predicate ?? predicate}
                </code>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
                  <span>
                    <span className="text-foreground font-medium">
                      {template.completedCount.toLocaleString()}
                    </span>{" "}
                    completed
                  </span>
                  {group && (
                    <>
                      <span>·</span>
                      <span>{group.title}</span>
                    </>
                  )}
                  {provider && (
                    <>
                      <span>·</span>
                      <a
                        href={provider.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:text-foreground"
                      >
                        Provider <ExternalLink className="h-3 w-3" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                {proof ? (
                  <>
                    <Button
                      onClick={onRenew}
                      disabled={busy !== null || proof.status === "revoked"}
                      variant="outline"
                      className="rounded-xl"
                    >
                      <RefreshCw
                        className={
                          "h-4 w-4 mr-1.5 " +
                          (busy === "renew" ? "animate-spin" : "")
                        }
                      />
                      {busy === "renew" ? "Renewing…" : "Renew"}
                    </Button>

                    <Button
                      onClick={() => copy(proof.proofHash, "Proof hash copied")}
                      variant="outline"
                      className="rounded-xl"
                    >
                      <Share2 className="h-4 w-4 mr-1.5" /> Share
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          disabled={busy !== null || proof.status === "revoked"}
                          variant="outline"
                          className="rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Ban className="h-4 w-4 mr-1.5" /> Revoke
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Revoke this proof?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Verifiers will reject{" "}
                            <code className="font-mono">{proof.id}</code>{" "}
                            immediately. You can always generate a new one from
                            the same template.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={onRevoke}
                            className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                          >
                            Revoke proof
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <Button
                    onClick={onGenerate}
                    disabled={busy !== null}
                    className="rounded-xl bg-primary hover:bg-primary/90"
                  >
                    <Sparkles
                      className={
                        "h-4 w-4 mr-1.5 " +
                        (busy === "generate" ? "animate-pulse" : "")
                      }
                    />
                    {busy === "generate"
                      ? "Generating proof…"
                      : "Generate ZK proof"}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Two columns: predicate config + proof artifact */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Predicate / disclosure */}
          <Card className="rounded-2xl border-border/60 p-6 space-y-5">
            <div>
              <h3 className="font-display font-semibold text-foreground">
                Predicate
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                The statement being proven. Edit before generating to customize.
              </p>
            </div>

            {provider && (
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Proof provider
                </p>
                <div className="flex items-start gap-3 mt-2">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <ProvIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground">
                        {provider.name}
                      </p>
                      <a
                        href={provider.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        {provider.websiteUrl} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {provider.about}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                Statement
              </Label>
              <Input
                value={proof?.predicate ?? predicate}
                onChange={(e) => setPredicate(e.target.value)}
                readOnly={!!proof}
                className="rounded-xl mt-1.5 font-mono text-sm"
              />
              {!proof && (
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  Hint: use comparators like <code>&gt;</code>,{" "}
                  <code>&lt;</code>, <code>==</code>.
                </p>
              )}
            </div>

            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                What gets disclosed
              </Label>
              <div className="mt-1.5 p-4 rounded-xl border border-border/60 bg-muted/30 text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  <span className="text-foreground">
                    Predicate result (true / false)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="h-4 w-4 shrink-0" />
                  <span>
                    Underlying score is{" "}
                    <span className="font-medium text-foreground">
                      never revealed
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="h-4 w-4 shrink-0" />
                  <span>Wallet address & history stay private</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Artifact */}
          <Card className="rounded-2xl border-border/60 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-foreground">
                  Proof artifact
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cryptographic output a verifier checks against your predicate.
                </p>
              </div>
            </div>

            {!proof ? (
              <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
                <div className="h-10 w-10 rounded-xl bg-muted mx-auto flex items-center justify-center mb-2">
                  <FileCode2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Generate a proof to see the artifact, hash, and metadata.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Proof hash
                  </Label>
                  <div className="flex items-center gap-2 mt-1.5">
                    <code className="flex-1 p-3 rounded-xl bg-muted border border-border/60 font-mono text-xs text-foreground break-all">
                      {proof.proofHash}
                    </code>
                    <Button
                      onClick={() => copy(proof.proofHash, "Proof hash copied")}
                      size="icon"
                      variant="outline"
                      className="rounded-xl shrink-0"
                      aria-label="Copy proof hash"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Cpu className="h-3 w-3" /> System
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {proof.zkSystem}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <FileCode2 className="h-3 w-3" /> Size
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {proof.size}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Eye className="h-3 w-3" /> Verifications
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {proof.verifications}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Expires
                    </p>
                    <p
                      className={
                        "text-sm font-medium mt-1 " +
                        (proof.status === "expired"
                          ? "text-warning"
                          : "text-foreground")
                      }
                    >
                      {proof.expiresAt}
                    </p>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Activity log */}
        {proof && (
          <Card className="rounded-2xl border-border/60 p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">
              Activity
            </h3>
            <div className="space-y-3">
              {[
                {
                  icon: ShieldCheck,
                  label: "Proof issued",
                  sub: proof.issuedAt,
                  tone: "text-success",
                },
                ...(proof.consumer
                  ? [
                    {
                      icon: Eye,
                      label: `Verified by ${proof.consumer}`,
                      sub: `${proof.verifications} times`,
                      tone: "text-muted-foreground" as const,
                    },
                  ]
                  : []),
                ...(proof.status === "revoked"
                  ? [
                    {
                      icon: Ban,
                      label: "Proof revoked",
                      sub: "Just now",
                      tone: "text-destructive" as const,
                    },
                  ]
                  : []),
                ...(proof.status === "expired"
                  ? [
                    {
                      icon: AlertCircle,
                      label: "Proof expired",
                      sub: proof.expiresAt,
                      tone: "text-warning" as const,
                    },
                  ]
                  : []),
              ].map((event, i) => {
                const Icon = event.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/40"
                  >
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Icon className={"h-4 w-4 " + event.tone} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {event.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.sub}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default ProofDetail;
